/**
 * Pure filter functions for the dashboard interactive layer.
 *
 * Used by <DashboardInteractive> to compute filtered rows whenever the
 * FilterBar inputs change. Layout building runs on the filtered rows.
 *
 * Date range options are RELATIVE TO THE DATASET'S MAX DATE, not today's
 * date. Reason: portfolio datasets span 2020-2026; "Last 7 days from today"
 * would show empty results everywhere. Using the dataset's max date as the
 * reference always shows recent data.
 */

import type { ColumnSchema } from './full-datasets'

export type DateRangeKey = 'all' | 'recent-30' | 'recent-90' | 'custom'

export interface DashboardFilters {
  /** Free-text search across id + dimension columns. Empty string = no filter. */
  search: string
  /** Active dimension column name being filtered, or null. */
  segmentKey: string | null
  /**
   * Selected dimension values. Empty array = no filter (matches all rows).
   * Single value = same as the prior single-select behavior.
   * Multiple values = OR'd union (row matches if its dim value is in the array).
   */
  segmentValues: string[]
  /**
   * Date range mode.
   *  - 'all': no date filter
   *  - 'recent-30' / 'recent-90': last N days of data, anchored to dataset max date
   *  - 'custom': use dateStart + dateEnd (ISO YYYY-MM-DD) for an arbitrary window
   */
  dateRange: DateRangeKey
  /** ISO YYYY-MM-DD; only honored when dateRange === 'custom'. */
  dateStart?: string
  /** ISO YYYY-MM-DD; only honored when dateRange === 'custom'. */
  dateEnd?: string
}

export const EMPTY_FILTERS: DashboardFilters = {
  search: '',
  segmentKey: null,
  segmentValues: [],
  dateRange: 'all',
}

export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: 'recent-30', label: 'Last 30 days of data' },
  { value: 'recent-90', label: 'Last 90 days of data' },
] as const

/**
 * Apply filters to rows and return the matching subset. Pure function.
 *
 * Order of filter operations doesn't change the result (set intersection),
 * but for performance we apply cheap filters first (segment match, date
 * range) before the more expensive search across multiple columns.
 */
export function applyFilters(
  rows: Record<string, unknown>[],
  schema: ColumnSchema[],
  filters: DashboardFilters,
): Record<string, unknown>[] {
  let result = rows

  // Segment filter — empty array = match all
  if (filters.segmentKey && filters.segmentValues.length > 0) {
    const allowed = new Set(filters.segmentValues)
    result = result.filter((row) => allowed.has(String(row[filters.segmentKey!])))
  }

  // Date range filter
  if (filters.dateRange !== 'all') {
    const timeCol = schema.find((c) => c.type === 'time')
    if (timeCol) {
      if (filters.dateRange === 'custom') {
        // Honor explicit start/end dates (ISO). Either may be absent — open
        // intervals are useful ("from Jan 1" with no end, "before Mar 31"
        // with no start).
        const start = filters.dateStart ? new Date(filters.dateStart) : null
        const end = filters.dateEnd ? new Date(filters.dateEnd) : null
        result = result.filter((row) => {
          const dateStr = row[timeCol.name]
          if (typeof dateStr !== 'string') return false
          const date = new Date(dateStr)
          if (Number.isNaN(date.getTime())) return false
          if (start && date < start) return false
          if (end && date > end) return false
          return true
        })
      } else {
        const maxDate = computeMaxDate(rows, timeCol)
        if (maxDate) {
          const days = filters.dateRange === 'recent-30' ? 30 : 90
          const cutoff = new Date(maxDate.getTime() - days * 24 * 60 * 60 * 1000)
          result = result.filter((row) => {
            const dateStr = row[timeCol.name]
            if (typeof dateStr !== 'string') return false
            const date = new Date(dateStr)
            return !Number.isNaN(date.getTime()) && date >= cutoff
          })
        }
      }
    }
  }

  // Search filter — across id + dimension columns
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    const searchableCols = schema
      .filter((c) => c.type === 'id' || c.type === 'dimension')
      .map((c) => c.name)
    result = result.filter((row) =>
      searchableCols.some((col) => {
        const v = row[col]
        return typeof v === 'string' && v.toLowerCase().includes(q)
      }),
    )
  }

  return result
}

/**
 * Compute the maximum date from a column. Returns null if the column is empty
 * or all values fail to parse.
 */
export function computeMaxDate(
  rows: Record<string, unknown>[],
  timeCol: ColumnSchema,
): Date | null {
  let max: Date | null = null
  for (const row of rows) {
    const v = row[timeCol.name]
    if (typeof v !== 'string') continue
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) continue
    if (max === null || d > max) max = d
  }
  return max
}

/**
 * Get unique values from a dimension column, sorted alphabetically.
 * Used to populate the segment filter dropdown.
 */
export function uniqueDimensionValues(
  rows: Record<string, unknown>[],
  dimensionKey: string,
): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    const v = row[dimensionKey]
    if (typeof v === 'string' && v.length > 0) set.add(v)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}
