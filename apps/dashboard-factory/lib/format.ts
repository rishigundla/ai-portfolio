/**
 * KPI value formatting helpers.
 *
 * Compact-form numbers (1.2M, 14.8K) for headline KPIs. Full-precision
 * formatting for table cells lives in full-datasets.ts to avoid coupling
 * those two layers.
 */

import type { ColumnSchema } from './full-datasets'

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const decimal = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const integer = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/**
 * Format a number for headline display in a KpiCard.
 * Heuristic: use compact notation ($1.2M, 14.8K) for large values;
 * use one decimal place for percentages and ratings; integers otherwise.
 */
export function formatKpiValue(value: number, column: ColumnSchema): string {
  if (column.unit === '$') {
    return value >= 10_000 ? compactCurrency.format(value) : `$${integer.format(value)}`
  }
  if (column.unit === '%') {
    return `${decimal.format(value)}%`
  }
  if (column.unit === '/100') {
    return decimal.format(value)
  }
  if (column.unit === 'ms' || column.unit === 'days') {
    return integer.format(value)
  }
  return value >= 10_000 ? compactNumber.format(value) : integer.format(value)
}

/**
 * Bucket a numeric series into N evenly-spaced averages, ready for a
 * KpiCard sparkline. Used when the source rows aren't already time-ordered.
 */
export function bucketSparkline(values: number[], buckets = 8): number[] {
  if (values.length === 0) return []
  if (values.length <= buckets) return [...values]
  const result: number[] = []
  const bucketSize = values.length / buckets
  for (let i = 0; i < buckets; i++) {
    const start = Math.floor(i * bucketSize)
    const end = Math.max(start + 1, Math.floor((i + 1) * bucketSize))
    const slice = values.slice(start, end)
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length
    result.push(avg)
  }
  return result
}
