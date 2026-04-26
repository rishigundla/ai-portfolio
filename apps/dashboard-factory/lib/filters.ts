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

export type DateRangeKey = 'all' | 'recent-30' | 'recent-90'

export interface DashboardFilters {
  /** Free-text search across id + dimension columns. Empty string = no filter. */
  search: string
  /** Active dimension column name being filtered, or null. */
  segmentKey: string | null
  /** Selected dimension value, or 'all'. */
  segmentValue: string
  /** Date range relative to the dataset's max date, or 'all'. */
  dateRange: DateRangeKey
}

export const EMPTY_FILTERS: DashboardFilters = {
  search: '',
  segmentKey: null,
  segmentValue: 'all',
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

  // Segment filter
  if (filters.segmentKey && filters.segmentValue !== 'all') {
    result = result.filter((row) => row[filters.segmentKey!] === filters.segmentValue)
  }

  // Date range filter (relative to dataset max date)
  if (filters.dateRange !== 'all') {
    const timeCol = schema.find((c) => c.type === 'time')
    if (timeCol) {
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
