/**
 * Period-over-period split for dashboard KPIs.
 *
 * Splits a row set in half by the provided time column: the later half is
 * "current", the earlier half is "prior". Used by `dashboard-builder` to
 * compute growth % deltas on KPIs without mutating the source fixtures —
 * every dataset already spans enough date range to derive a comparison.
 *
 * Splitting by *date* (median) rather than by *row count* (median index)
 * matters for irregular cadences (pulse-telemetry has bursty days). The
 * median date keeps each half time-balanced even if the row distribution
 * isn't uniform across the range.
 */

import type { ColumnSchema } from './full-datasets'

export interface PeriodSplit {
  currentRows: Record<string, unknown>[]
  priorRows: Record<string, unknown>[]
  currentLabel: string
  priorLabel: string
}

/** Minimum rows in each half — below this we skip deltas (too noisy). */
const MIN_ROWS_PER_HALF = 4

/**
 * Split rows by the median date in the time column. Returns null when:
 *   - timeCol is missing
 *   - fewer than 2 * MIN_ROWS_PER_HALF rows have valid dates
 *   - all rows fall on the same date (no meaningful split)
 *   - either resulting half is below MIN_ROWS_PER_HALF
 */
export function splitByPeriod(
  rows: Record<string, unknown>[],
  timeCol: ColumnSchema | undefined,
): PeriodSplit | null {
  if (!timeCol) return null

  const dated = rows
    .map((r) => {
      const v = r[timeCol.name]
      if (typeof v !== 'string') return null
      const d = new Date(v)
      if (Number.isNaN(d.getTime())) return null
      return { row: r, date: d }
    })
    .filter((x): x is { row: Record<string, unknown>; date: Date } => x !== null)

  if (dated.length < 2 * MIN_ROWS_PER_HALF) return null

  dated.sort((a, b) => a.date.getTime() - b.date.getTime())

  const minTime = dated[0]!.date.getTime()
  const maxTime = dated[dated.length - 1]!.date.getTime()
  if (minTime === maxTime) return null
  const splitTime = (minTime + maxTime) / 2

  const priorRows: Record<string, unknown>[] = []
  const currentRows: Record<string, unknown>[] = []
  for (const { row, date } of dated) {
    if (date.getTime() < splitTime) priorRows.push(row)
    else currentRows.push(row)
  }

  if (priorRows.length < MIN_ROWS_PER_HALF || currentRows.length < MIN_ROWS_PER_HALF) {
    return null
  }

  return {
    currentRows,
    priorRows,
    currentLabel: formatPeriodLabel(new Date(splitTime), new Date(maxTime)),
    priorLabel: formatPeriodLabel(new Date(minTime), new Date(splitTime - 1)),
  }
}

/**
 * Format a period as "Mon Year" or "Mon-Mon Year" depending on span.
 * Examples: "Aug 2026", "Jul-Oct 2026", "2022-2024".
 */
function formatPeriodLabel(start: Date, end: Date): string {
  const startMonth = start.toLocaleString('en-US', { month: 'short' })
  const endMonth = end.toLocaleString('en-US', { month: 'short' })
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()

  if (startYear !== endYear) {
    // Multi-year span; year-only labels read cleaner.
    return startYear === endYear - 1 || endYear - startYear <= 2
      ? `${startYear}-${endYear}`
      : `${startYear}-${endYear}`
  }
  if (startMonth === endMonth) return `${startMonth} ${startYear}`
  return `${startMonth}-${endMonth} ${startYear}`
}
