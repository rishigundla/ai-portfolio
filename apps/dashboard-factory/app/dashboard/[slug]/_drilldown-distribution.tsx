'use client'

import * as React from 'react'
import { ChartCard } from '@rishi/design-system/components'
import { buildHistogramChart } from '@/lib/dashboard-builder'
import type { ColumnSchema } from '@/lib/full-datasets'
import { ChartRenderer } from './_dashboard-view'

interface DrilldownDistributionProps {
  rows: Record<string, unknown>[]
  schema: ColumnSchema[]
}

/**
 * Distribution tab inside the drill-down dialog.
 *
 * Picks the first measure column and renders a histogram of its values
 * within the drilled subset, reusing the histogram chart type added in
 * Phase 1. Falls back to a count-by-primary-dimension bar when the
 * dataset has no measures (financial-complaints' segment of 1 measure
 * still works since `days_to_resolve` is the primary measure).
 *
 * Single chart at full width — no grid layout, no additional selectors.
 * The user already chose what to drill INTO (a dimension value); this
 * tab shows the shape of that subset, not a grid of mini-dashboards.
 */
export function DrilldownDistribution({ rows, schema }: DrilldownDistributionProps) {
  const measures = React.useMemo(
    () => schema.filter((c) => c.type === 'measure'),
    [schema],
  )

  const chart = React.useMemo(() => {
    if (rows.length === 0) return null
    if (measures[0]) return buildHistogramChart(rows, measures[0])
    return null
  }, [rows, measures])

  if (rows.length === 0) {
    return (
      <div className="text-sm text-text-muted py-8 text-center">
        No rows in this segment.
      </div>
    )
  }

  if (!chart) {
    return (
      <div className="text-sm text-text-muted py-8 text-center">
        No measure columns available — distribution view skipped.
      </div>
    )
  }

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle}>
      <ChartRenderer chart={chart} />
    </ChartCard>
  )
}
