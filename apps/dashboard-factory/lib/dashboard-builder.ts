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
import { bucketSparkline, formatInteger, formatKpiValue, pluralize } from './format'

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
const TARGET_KPI_COUNT = 5

/**
 * Build a complete DashboardLayout from a set of rows + the schema.
 *
 * Runs on the server initially (page load) and on the client whenever
 * filters change (in the dashboard interactive wrapper).
 *
 * KPIs target a count of {@link TARGET_KPI_COUNT}: schema measures first,
 * then derived KPIs (total record count, top dim value, distinct dim count)
 * fill any remaining slots so a dataset with only 1-2 measures still gets a
 * full strip — matching what the curated profiling fixtures promise.
 *
 * Charts target 4 slots: primary bar, trend line, donut, secondary bar.
 */
export function buildDashboardLayout(
  rows: Record<string, unknown>[],
  schema: ColumnSchema[],
): DashboardLayout {
  const measures = schema.filter((c) => c.type === 'measure')
  const dimensions = schema.filter((c) => c.type === 'dimension')
  const times = schema.filter((c) => c.type === 'time')
  const idColumn = schema.find((c) => c.type === 'id')

  // Skip dimensions whose distinct value count equals row count — those are
  // typically free-text identifiers (e.g. opportunity_name) where "Top
  // segment" or "Distinct count" is meaningless. Keeps derived KPIs useful.
  const usefulDimensions = dimensions.filter((d) => {
    const distinct = new Set(rows.map((r) => r[d.name])).size
    return distinct > 1 && distinct < rows.length
  })

  const kpis = buildKpis(rows, measures, usefulDimensions, idColumn)
  const charts: DashboardChart[] = []

  // Primary bar: top measure × primary useful dimension
  if (measures[0] && usefulDimensions[0]) {
    charts.push(buildBarChart(rows, measures[0], usefulDimensions[0], 'primary-bar'))
  }

  // Trend line: top measure × time (if time column exists)
  if (measures[0] && times[0]) {
    charts.push(buildLineChart(rows, measures[0], times[0]))
  }

  // Donut: distribution by secondary useful dimension (falls back to primary)
  const donutDim = usefulDimensions[1] ?? usefulDimensions[0]
  if (donutDim) {
    charts.push(buildDonutChart(rows, donutDim))
  }

  // Secondary bar: top measure × tertiary useful dimension (different from
  // the primary bar). Keeps the 4-chart promise — fixtures consistently
  // recommend a 4th view that isn't a simple table.
  if (measures[0] && usefulDimensions[2]) {
    charts.push(buildBarChart(rows, measures[0], usefulDimensions[2], 'secondary-bar'))
  } else if (measures[0] && usefulDimensions[1] && donutDim !== usefulDimensions[1]) {
    charts.push(buildBarChart(rows, measures[0], usefulDimensions[1], 'secondary-bar'))
  }

  return { kpis, charts }
}

// ============================================================
// Internals
// ============================================================

function buildKpis(
  rows: Record<string, unknown>[],
  measures: ColumnSchema[],
  dimensions: ColumnSchema[],
  idColumn: ColumnSchema | undefined,
): DashboardKpi[] {
  // 1. Schema measures (sum or avg per the schema's aggregation hint).
  const measureKpis: DashboardKpi[] = measures.slice(0, TARGET_KPI_COUNT).map((measure) => {
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

  if (measureKpis.length >= TARGET_KPI_COUNT) {
    return measureKpis
  }

  // 2. Fill remaining slots with derived KPIs in priority order.
  const derived: DashboardKpi[] = []

  // Total record count, labeled by entity (e.g. id "Deal ID" → "Total Deals").
  if (idColumn) {
    const entity = idColumn.label.replace(/ (ID|Number)$/i, '').trim()
    derived.push({
      label: `Total ${pluralize(entity)}`,
      value: formatInteger(rows.length),
      rawValue: rows.length,
    })
  }

  // Top value of primary dimension by primary measure.
  if (measures[0] && dimensions[0]) {
    const measure = measures[0]
    const dim = dimensions[0]
    const buckets = new Map<string, number>()
    for (const row of rows) {
      const k = String(row[dim.name] ?? 'Unknown')
      const v = row[measure.name]
      if (typeof v !== 'number') continue
      buckets.set(k, (buckets.get(k) ?? 0) + v)
    }
    const top = [...buckets.entries()].sort(([, a], [, b]) => b - a)[0]
    if (top) {
      derived.push({
        label: `Top ${dim.label}`,
        value: top[0],
        rawValue: top[1],
      })
    }
  }

  // Distinct count of primary dimension ("Segments: 3", "Industries: 6").
  if (dimensions[0]) {
    const dim = dimensions[0]
    const distinct = new Set(
      rows.map((r) => String(r[dim.name] ?? '')).filter((v) => v !== ''),
    ).size
    derived.push({
      label: pluralize(dim.label),
      value: formatInteger(distinct),
      rawValue: distinct,
    })
  }

  // Distinct count of secondary dimension if we still need slots.
  if (dimensions[1]) {
    const dim = dimensions[1]
    const distinct = new Set(
      rows.map((r) => String(r[dim.name] ?? '')).filter((v) => v !== ''),
    ).size
    derived.push({
      label: pluralize(dim.label),
      value: formatInteger(distinct),
      rawValue: distinct,
    })
  }

  return [...measureKpis, ...derived].slice(0, TARGET_KPI_COUNT)
}

function buildBarChart(
  rows: Record<string, unknown>[],
  measure: ColumnSchema,
  dimension: ColumnSchema,
  id: string = 'primary-bar',
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
    id,
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
