/**
 * Dashboard layout generator. Pure functions over rows + schema — runs on
 * server (initial render) and client (filter changes).
 *
 * The schema's typed annotations (id / dimension / measure / time) plus
 * aggregation hints (sum / avg) are sufficient to choose:
 *   - Which 4 measures become KPI cards
 *   - Which dimension powers a bar chart
 *   - Whether a line chart over time is feasible
 *   - Which categorical dimension is best for a donut
 *
 * Bar and donut chart data carries `dimensionKey` so click-to-drill knows
 * which column to filter on.
 */

import type { ColumnSchema } from './full-datasets'
import { bucketSparkline, formatKpiValue } from './format'

// ============================================================
// Types
// ============================================================

export interface DashboardKpi {
  label: string
  /** Display-formatted value (e.g. "$14.8M", "97.2%"). */
  value: string
  /** Raw numeric value used by downstream chart logic. */
  rawValue: number
  unit?: string
  /** Bucketed values for the inline sparkline. */
  sparkline?: number[]
}

export type DashboardChartData =
  | {
      type: 'bar'
      bars: Array<{ label: string; value: number }>
      max: number
      /** Schema column whose values became the bar labels — used by drill-down. */
      dimensionKey: string
      /** Human-readable dimension label, used in drill-down dialog title. */
      dimensionLabel: string
    }
  | { type: 'line'; points: Array<{ label: string; value: number }>; max: number }
  | {
      type: 'donut'
      slices: Array<{ label: string; value: number; pct: number }>
      total: number
      dimensionKey: string
      dimensionLabel: string
    }

export interface DashboardChart {
  id: string
  title: string
  subtitle?: string
  data: DashboardChartData
}

export interface DashboardLayout {
  kpis: DashboardKpi[]
  charts: DashboardChart[]
}

// ============================================================
// Builder
// ============================================================

const TOP_N_BARS = 6
const TOP_N_DONUT = 5
const LINE_BUCKETS = 8

/**
 * Build a complete DashboardLayout from a set of rows + the schema.
 *
 * Runs on the server initially (page load) and on the client whenever
 * filters change (in the dashboard interactive wrapper).
 */
export function buildDashboardLayout(
  rows: Record<string, unknown>[],
  schema: ColumnSchema[],
): DashboardLayout {
  const measures = schema.filter((c) => c.type === 'measure')
  const dimensions = schema.filter((c) => c.type === 'dimension')
  const times = schema.filter((c) => c.type === 'time')

  const kpis = buildKpis(rows, measures)
  const charts: DashboardChart[] = []

  // Primary bar: top measure × primary dimension
  if (measures[0] && dimensions[0]) {
    charts.push(buildBarChart(rows, measures[0], dimensions[0]))
  }

  // Trend line: top measure × time (if time column exists)
  if (measures[0] && times[0]) {
    charts.push(buildLineChart(rows, measures[0], times[0]))
  }

  // Donut: distribution by secondary dimension (count)
  if (dimensions[1]) {
    charts.push(buildDonutChart(rows, dimensions[1]))
  } else if (dimensions[0]) {
    charts.push(buildDonutChart(rows, dimensions[0]))
  }

  return { kpis, charts }
}

// ============================================================
// Internals
// ============================================================

function buildKpis(rows: Record<string, unknown>[], measures: ColumnSchema[]): DashboardKpi[] {
  return measures.slice(0, 4).map((measure) => {
    const values = rows
      .map((r) => r[measure.name])
      .filter((v): v is number => typeof v === 'number')

    const aggregated =
      measure.aggregation === 'avg' && values.length > 0
        ? values.reduce((a, b) => a + b, 0) / values.length
        : values.reduce((a, b) => a + b, 0)

    return {
      label: measure.label,
      value: formatKpiValue(aggregated, measure),
      rawValue: aggregated,
      unit: measure.unit,
      sparkline: bucketSparkline(values, 8),
    }
  })
}

function buildBarChart(
  rows: Record<string, unknown>[],
  measure: ColumnSchema,
  dimension: ColumnSchema,
): DashboardChart {
  const buckets = new Map<string, number>()
  for (const row of rows) {
    const dim = String(row[dimension.name] ?? 'Unknown')
    const val = row[measure.name]
    if (typeof val !== 'number') continue
    buckets.set(dim, (buckets.get(dim) ?? 0) + val)
  }
  // For 'avg' aggregation we should average per bucket; sum is the default.
  if (measure.aggregation === 'avg') {
    const counts = new Map<string, number>()
    for (const row of rows) {
      const dim = String(row[dimension.name] ?? 'Unknown')
      const val = row[measure.name]
      if (typeof val !== 'number') continue
      counts.set(dim, (counts.get(dim) ?? 0) + 1)
    }
    for (const [k, sum] of buckets) {
      const count = counts.get(k) ?? 1
      buckets.set(k, sum / count)
    }
  }

  const sorted = [...buckets.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_N_BARS)
  const max = sorted[0]?.[1] ?? 0

  return {
    id: 'primary-bar',
    title: `${measure.label} by ${dimension.label}`,
    subtitle: `Top ${sorted.length} categories${measure.aggregation === 'avg' ? ' · average' : ' · total'}`,
    data: {
      type: 'bar',
      bars: sorted.map(([label, value]) => ({ label, value })),
      max,
      dimensionKey: dimension.name,
      dimensionLabel: dimension.label,
    },
  }
}

function buildLineChart(
  rows: Record<string, unknown>[],
  measure: ColumnSchema,
  time: ColumnSchema,
): DashboardChart {
  const dated = rows
    .map((r) => {
      const dateStr = r[time.name]
      const value = r[measure.name]
      if (typeof dateStr !== 'string' || typeof value !== 'number') return null
      const date = new Date(dateStr)
      if (Number.isNaN(date.getTime())) return null
      return { date, value }
    })
    .filter((d): d is { date: Date; value: number } => d !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (dated.length === 0) {
    return {
      id: 'trend-line',
      title: `${measure.label} trend`,
      subtitle: 'No time-series data',
      data: { type: 'line', points: [], max: 0 },
    }
  }

  // Bucket evenly across the time range
  const points: Array<{ label: string; value: number }> = []
  const bucketSize = Math.max(1, Math.ceil(dated.length / LINE_BUCKETS))
  for (let i = 0; i < dated.length; i += bucketSize) {
    const slice = dated.slice(i, i + bucketSize)
    const sum = slice.reduce((a, b) => a + b.value, 0)
    const value = measure.aggregation === 'avg' ? sum / slice.length : sum
    const labelDate = slice[Math.floor(slice.length / 2)]?.date ?? slice[0]?.date
    if (!labelDate) continue
    const label = `${labelDate.toLocaleString('en-US', { month: 'short' })} ${labelDate.getDate()}`
    points.push({ label, value })
  }

  const max = points.reduce((m, p) => Math.max(m, p.value), 0)

  return {
    id: 'trend-line',
    title: `${measure.label} trend`,
    subtitle: `Over ${time.label}`,
    data: {
      type: 'line',
      points,
      max,
    },
  }
}

function buildDonutChart(
  rows: Record<string, unknown>[],
  dimension: ColumnSchema,
): DashboardChart {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const dim = String(row[dimension.name] ?? 'Unknown')
    counts.set(dim, (counts.get(dim) ?? 0) + 1)
  }
  const total = rows.length
  const sorted = [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_N_DONUT)

  const topTotal = sorted.reduce((s, [, v]) => s + v, 0)
  const slices = sorted.map(([label, value]) => ({
    label,
    value,
    pct: total > 0 ? (value / total) * 100 : 0,
  }))
  if (topTotal < total) {
    const other = total - topTotal
    slices.push({
      label: 'Other',
      value: other,
      pct: (other / total) * 100,
    })
  }

  return {
    id: 'distribution-donut',
    title: `Distribution by ${dimension.label}`,
    subtitle: `${total} records · ${slices.length} slices`,
    data: {
      type: 'donut',
      slices,
      total,
      dimensionKey: dimension.name,
      dimensionLabel: dimension.label,
    },
  }
}
