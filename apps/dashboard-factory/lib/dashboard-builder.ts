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
import { splitByPeriod } from './period'

import type { KpiDelta } from '@rishi/design-system/components'

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
  /**
   * Period-over-period growth on this KPI. Set only for measure-based KPIs
   * when the dataset has enough date range to split in half cleanly.
   * Derived KPIs (counts, top values) leave this undefined since
   * period comparison isn't semantically meaningful for them.
   */
  delta?: KpiDelta
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
  | {
      type: 'heatmap'
      /** Cells indexed by (xLabels.indexOf(x), yLabels.indexOf(y)). */
      cells: Array<{ x: string; y: string; value: number }>
      xLabels: string[]
      yLabels: string[]
      max: number
      xLabel: string
      yLabel: string
      /** What the cell value represents — "Total ACV", "Row count", etc. */
      valueLabel: string
    }
  | {
      type: 'scatter'
      points: Array<{ x: number; y: number; label: string }>
      xKey: string
      yKey: string
      xLabel: string
      yLabel: string
      xUnit?: string
      yUnit?: string
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

  const period = splitByPeriod(rows, times[0])
  const kpis = buildKpis(rows, measures, usefulDimensions, idColumn, period)
  const charts: DashboardChart[] = []

  // Slot 1: primary bar (top measure × primary useful dimension)
  if (measures[0] && usefulDimensions[0]) {
    charts.push(buildBarChart(rows, measures[0], usefulDimensions[0], 'primary-bar'))
  }

  // Slot 2: trend line (top measure × time)
  if (measures[0] && times[0]) {
    charts.push(buildLineChart(rows, measures[0], times[0]))
  }

  // Slot 3: scatter (≥ 2 measures, quadrant analysis) OR donut (distribution).
  // Scatter wins when the dataset is numerically rich enough for a 2-measure
  // view — that's a higher-information chart than yet another distribution.
  if (measures[0] && measures[1]) {
    charts.push(buildScatterChart(rows, measures[0], measures[1], idColumn, usefulDimensions[0]))
  } else {
    const donutDim = usefulDimensions[1] ?? usefulDimensions[0]
    if (donutDim) {
      charts.push(buildDonutChart(rows, donutDim))
    }
  }

  // Slot 4: heatmap (time × primary useful dim) OR secondary bar (3rd dim).
  // Heatmap wins when there's both time AND a categorical dimension — the
  // matrix view answers "which segment is rising/falling over time", which
  // a separate trend line + segment bar can't show together.
  if (times[0] && usefulDimensions[0]) {
    charts.push(buildHeatmapChart(rows, times[0], usefulDimensions[0], measures[0]))
  } else if (measures[0] && usefulDimensions[2]) {
    charts.push(buildBarChart(rows, measures[0], usefulDimensions[2], 'secondary-bar'))
  } else if (measures[0] && usefulDimensions[1]) {
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
  period: ReturnType<typeof splitByPeriod>,
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
      delta: period ? computeMeasureDelta(measure, period) : undefined,
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

/**
 * Compute period-over-period delta for a measure. Returns the same shape
 * KpiCard's `delta` prop expects, or undefined when prior aggregate is zero
 * (no meaningful comparison) or both halves yield no numeric values.
 *
 * Direction: 'up' if current > prior, 'down' if smaller, 'neutral' on equal.
 * Value is the absolute percent change (KpiCard renders an absolute value
 * with a directional arrow, so signs would double up).
 */
function computeMeasureDelta(
  measure: ColumnSchema,
  period: NonNullable<ReturnType<typeof splitByPeriod>>,
): KpiDelta | undefined {
  const aggregate = (rows: Record<string, unknown>[]): number | null => {
    const values = rows
      .map((r) => r[measure.name])
      .filter((v): v is number => typeof v === 'number')
    if (values.length === 0) return null
    return measure.aggregation === 'avg'
      ? values.reduce((a, b) => a + b, 0) / values.length
      : values.reduce((a, b) => a + b, 0)
  }

  const curr = aggregate(period.currentRows)
  const prior = aggregate(period.priorRows)
  if (curr === null || prior === null || prior === 0) return undefined

  const changePct = ((curr - prior) / Math.abs(prior)) * 100
  const direction: KpiDelta['direction'] =
    Math.abs(changePct) < 0.05 ? 'neutral' : changePct > 0 ? 'up' : 'down'

  return {
    value: Math.round(changePct * 10) / 10,
    direction,
    period: 'vs prior period',
  }
}

/**
 * Build a scatter chart from two measures. Each row becomes one point.
 * Used for quadrant analysis (ROI vs spend, ACV vs GRR%, etc.) — not
 * aggregated, so users see actual record-level distribution.
 *
 * Caps at 100 points to keep render cost bounded; samples evenly when
 * row count exceeds the cap. The portfolio fixtures top out around 50
 * rows so the cap rarely triggers, but downstream consumers may pass
 * larger sets.
 */
function buildScatterChart(
  rows: Record<string, unknown>[],
  measureX: ColumnSchema,
  measureY: ColumnSchema,
  idColumn: ColumnSchema | undefined,
  fallbackLabelDim: ColumnSchema | undefined,
): DashboardChart {
  const labelKey = idColumn?.name ?? fallbackLabelDim?.name
  const points = rows
    .map((r) => {
      const x = r[measureX.name]
      const y = r[measureY.name]
      if (typeof x !== 'number' || typeof y !== 'number') return null
      const label = labelKey ? String(r[labelKey] ?? '') : ''
      return { x, y, label }
    })
    .filter((p): p is { x: number; y: number; label: string } => p !== null)

  const MAX_POINTS = 100
  const sampled =
    points.length <= MAX_POINTS
      ? points
      : points.filter((_, i) => i % Math.ceil(points.length / MAX_POINTS) === 0)

  return {
    id: 'quadrant-scatter',
    title: `${measureX.label} vs ${measureY.label}`,
    subtitle: `Each dot is one record · ${sampled.length} points`,
    data: {
      type: 'scatter',
      points: sampled,
      xKey: measureX.name,
      yKey: measureY.name,
      xLabel: measureX.label,
      yLabel: measureY.label,
      xUnit: measureX.unit,
      yUnit: measureY.unit,
    },
  }
}

/**
 * Build a heatmap (time bucket × dimension value matrix). Cells contain the
 * sum of `valueMeasure` (or row count when no measure is provided).
 *
 * Time bucketing: monthly when the date span fits in ≤ 18 months, yearly
 * when the span exceeds that. Avoids sparse grids on multi-year datasets
 * (customer-demographics spans 2020-2024) and over-wide grids on single-
 * month datasets.
 *
 * Y axis is the top {@link TOP_N_BARS} values of the dimension (matches the
 * primary-bar chart's truncation). Smaller values fold into "Other".
 */
function buildHeatmapChart(
  rows: Record<string, unknown>[],
  timeCol: ColumnSchema,
  dim: ColumnSchema,
  valueMeasure: ColumnSchema | undefined,
): DashboardChart {
  // Parse and time-bucket every row
  const dated = rows
    .map((r) => {
      const v = r[timeCol.name]
      if (typeof v !== 'string') return null
      const d = new Date(v)
      if (Number.isNaN(d.getTime())) return null
      return { row: r, date: d }
    })
    .filter((x): x is { row: Record<string, unknown>; date: Date } => x !== null)

  if (dated.length === 0) {
    return {
      id: 'time-heatmap',
      title: `${dim.label} over ${timeCol.label}`,
      subtitle: 'No time-series data',
      data: {
        type: 'heatmap',
        cells: [],
        xLabels: [],
        yLabels: [],
        max: 0,
        xLabel: timeCol.label,
        yLabel: dim.label,
        valueLabel: valueMeasure?.label ?? 'Records',
      },
    }
  }

  const minTime = dated[0]!.date.getTime()
  const maxTime = dated[dated.length - 1]!.date.getTime()
  const spanMonths = (maxTime - minTime) / (1000 * 60 * 60 * 24 * 30.44)
  const granularity: 'month' | 'year' = spanMonths > 18 ? 'year' : 'month'

  const bucketKey = (d: Date): string => {
    if (granularity === 'year') return String(d.getFullYear())
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`
  }

  const xLabelsSet = new Set<string>()
  const dimCounts = new Map<string, number>()
  for (const { row, date } of dated) {
    xLabelsSet.add(bucketKey(date))
    const dimVal = String(row[dim.name] ?? 'Unknown')
    const w = valueMeasure ? Number(row[valueMeasure.name]) : 1
    dimCounts.set(dimVal, (dimCounts.get(dimVal) ?? 0) + (Number.isFinite(w) ? w : 0))
  }

  // Top-N dim values, fold rest into Other
  const sortedDims = [...dimCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_N_BARS)
    .map(([k]) => k)
  const dimSet = new Set(sortedDims)
  const yLabels = [...sortedDims, ...(dimCounts.size > sortedDims.length ? ['Other'] : [])]

  const xLabels = [...xLabelsSet].sort((a, b) => {
    // Stable chronological sort — convert label back to a Date for comparison
    const da = new Date(a).getTime()
    const db = new Date(b).getTime()
    if (Number.isNaN(da) || Number.isNaN(db)) return a.localeCompare(b)
    return da - db
  })

  // Build cell map keyed by `${x}|${y}`
  const cellMap = new Map<string, number>()
  for (const { row, date } of dated) {
    const x = bucketKey(date)
    const dimVal = String(row[dim.name] ?? 'Unknown')
    const y = dimSet.has(dimVal) ? dimVal : 'Other'
    const w = valueMeasure ? Number(row[valueMeasure.name]) : 1
    if (!Number.isFinite(w)) continue
    const key = `${x}|${y}`
    cellMap.set(key, (cellMap.get(key) ?? 0) + w)
  }

  const cells: Array<{ x: string; y: string; value: number }> = []
  for (const x of xLabels) {
    for (const y of yLabels) {
      cells.push({ x, y, value: cellMap.get(`${x}|${y}`) ?? 0 })
    }
  }
  const max = cells.reduce((m, c) => Math.max(m, c.value), 0)

  return {
    id: 'time-heatmap',
    title: `${dim.label} over ${timeCol.label}`,
    subtitle: `${xLabels.length} ${granularity}s × ${yLabels.length} ${pluralize(dim.label.toLowerCase())}${valueMeasure ? ` · ${valueMeasure.label}` : ' · row count'}`,
    data: {
      type: 'heatmap',
      cells,
      xLabels,
      yLabels,
      max,
      xLabel: timeCol.label,
      yLabel: dim.label,
      valueLabel: valueMeasure?.label ?? 'Records',
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
