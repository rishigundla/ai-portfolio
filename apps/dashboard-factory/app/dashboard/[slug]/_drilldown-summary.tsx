'use client'

import { formatKpiValue, formatInteger, pluralize } from '@/lib/format'
import type { ColumnSchema } from '@/lib/full-datasets'

interface DrilldownSummaryProps {
  rows: Record<string, unknown>[]
  schema: ColumnSchema[]
}

/**
 * Summary stats tab inside the drill-down dialog.
 *
 * For each measure column: count, mean, median, sum, min, max — formatted
 * with the measure's unit-aware formatter so numbers read in their native
 * representation ($14.4M, 93.9%, 245 ms).
 *
 * For each dimension column with ≤ 25 distinct values: top 3 values plus
 * their counts. Dimensions with 25+ distinct values (free-text identifier
 * columns like opportunity_name) are skipped — top-3 there isn't useful.
 */
export function DrilldownSummary({ rows, schema }: DrilldownSummaryProps) {
  const measures = schema.filter((c) => c.type === 'measure')
  const dimensions = schema.filter((c) => c.type === 'dimension')

  if (rows.length === 0) {
    return (
      <div className="text-sm text-text-muted py-8 text-center">
        No rows in this segment to summarize.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Headline count */}
      <div className="rounded-lg border border-surface-border bg-surface px-4 py-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Records in segment
        </div>
        <div className="mt-1 font-display text-2xl font-semibold text-text-primary">
          {formatInteger(rows.length)}
        </div>
      </div>

      {/* Measure stats */}
      {measures.length > 0 && (
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-2">
            Measures
          </h4>
          <div className="overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full text-xs">
              <thead className="bg-surface-elevated">
                <tr className="text-left text-text-muted">
                  <th className="px-3 py-2 font-medium">Measure</th>
                  <th className="px-3 py-2 font-medium text-right">Mean</th>
                  <th className="px-3 py-2 font-medium text-right">Median</th>
                  <th className="px-3 py-2 font-medium text-right">Sum</th>
                  <th className="px-3 py-2 font-medium text-right">Min</th>
                  <th className="px-3 py-2 font-medium text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                {measures.map((m) => {
                  const stats = computeMeasureStats(rows, m)
                  if (!stats) {
                    return (
                      <tr key={m.name} className="border-t border-surface-border">
                        <td className="px-3 py-2 text-text-secondary">{m.label}</td>
                        <td className="px-3 py-2 text-text-muted text-right" colSpan={5}>
                          No numeric values
                        </td>
                      </tr>
                    )
                  }
                  return (
                    <tr key={m.name} className="border-t border-surface-border">
                      <td className="px-3 py-2 text-text-secondary">{m.label}</td>
                      <td className="px-3 py-2 font-mono text-text-primary text-right">
                        {formatKpiValue(stats.mean, m)}
                      </td>
                      <td className="px-3 py-2 font-mono text-text-primary text-right">
                        {formatKpiValue(stats.median, m)}
                      </td>
                      <td className="px-3 py-2 font-mono text-text-primary text-right">
                        {formatKpiValue(stats.sum, m)}
                      </td>
                      <td className="px-3 py-2 font-mono text-text-muted text-right">
                        {formatKpiValue(stats.min, m)}
                      </td>
                      <td className="px-3 py-2 font-mono text-text-muted text-right">
                        {formatKpiValue(stats.max, m)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top dim values */}
      {dimensions.length > 0 && (
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-2">
            Top values
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dimensions.map((dim) => {
              const top = topDimValues(rows, dim, 3)
              if (top === null) return null
              return (
                <div
                  key={dim.name}
                  className="rounded-lg border border-surface-border bg-surface px-3 py-2.5"
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
                    {dim.label}{' '}
                    <span className="text-text-dim normal-case">
                      ({top.distinctCount} distinct)
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {top.entries.map(({ label, count }) => (
                      <li
                        key={label}
                        className="flex items-baseline justify-between gap-2 text-xs"
                      >
                        <span className="text-text-secondary truncate">{label}</span>
                        <span className="font-mono text-text-muted shrink-0">
                          {count} {pluralize(count === 1 ? 'row' : 'rows').replace(/^rowss$/, 'rows')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface MeasureStats {
  mean: number
  median: number
  sum: number
  min: number
  max: number
}

function computeMeasureStats(
  rows: Record<string, unknown>[],
  measure: ColumnSchema,
): MeasureStats | null {
  const vals: number[] = []
  for (const r of rows) {
    const v = r[measure.name]
    if (typeof v === 'number') vals.push(v)
  }
  if (vals.length === 0) return null
  const sum = vals.reduce((a, b) => a + b, 0)
  const mean = sum / vals.length
  const sorted = [...vals].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!
  return {
    mean,
    median,
    sum,
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
  }
}

interface TopDimResult {
  entries: Array<{ label: string; count: number }>
  distinctCount: number
}

const MAX_DISTINCT_FOR_TOP = 25

function topDimValues(
  rows: Record<string, unknown>[],
  dim: ColumnSchema,
  topN: number,
): TopDimResult | null {
  const counts = new Map<string, number>()
  for (const r of rows) {
    const v = r[dim.name]
    if (v === null || v === undefined || v === '') continue
    const key = String(v)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  if (counts.size === 0) return null
  // Skip free-text identifier columns — top-3 there isn't useful insight.
  if (counts.size > MAX_DISTINCT_FOR_TOP) return null
  const entries = [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([label, count]) => ({ label, count }))
  return { entries, distinctCount: counts.size }
}
