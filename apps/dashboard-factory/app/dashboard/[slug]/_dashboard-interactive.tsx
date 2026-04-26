'use client'

import * as React from 'react'
import { Inbox, X } from 'lucide-react'
import { FilterBar } from '@rishi/design-system/components'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@rishi/design-system/primitives'
import type { FullDataset } from '@/lib/full-datasets'
import {
  applyFilters,
  computeMaxDate,
  DATE_RANGE_OPTIONS,
  EMPTY_FILTERS,
  uniqueDimensionValues,
  type DashboardFilters,
  type DateRangeKey,
} from '@/lib/filters'
import { buildDashboardLayout } from '@/lib/dashboard-builder'
import { DashboardView } from './_dashboard-view'
import { DrilldownTable } from './_drilldown-table'
import type { ColorClassSet } from '@/lib/datasets'

interface DashboardInteractiveProps {
  fullDataset: FullDataset
  colors: ColorClassSet
}

/**
 * Client wrapper around the dashboard. Manages:
 *   - Filter state (search / segment / date range)
 *   - Drill-down dialog state (open + filtered rows)
 *   - Recomputing the layout whenever filters change
 *
 * Pure functions in lib/filters.ts and lib/dashboard-builder.ts do all the
 * heavy lifting; this component just wires them to React state.
 */
export function DashboardInteractive({
  fullDataset,
  colors,
}: DashboardInteractiveProps) {
  const { rows, metadata } = fullDataset
  const schema = metadata.schema

  // Pick the primary dimension (first dimension column) as the segment filter
  const primaryDimension = React.useMemo(
    () => schema.find((c) => c.type === 'dimension') ?? null,
    [schema],
  )

  // Initialize filters with the primary dimension as segmentKey
  const [filters, setFilters] = React.useState<DashboardFilters>(() => ({
    ...EMPTY_FILTERS,
    segmentKey: primaryDimension?.name ?? null,
  }))

  // Drill-down state
  const [drilldown, setDrilldown] = React.useState<{
    title: string
    description: string
    rows: Record<string, unknown>[]
  } | null>(null)

  // Compute filter inputs once per dataset
  const segmentOptions = React.useMemo(() => {
    if (!primaryDimension) return []
    const values = uniqueDimensionValues(rows, primaryDimension.name)
    return [
      { value: 'all', label: `All ${primaryDimension.label.toLowerCase()}s` },
      ...values.map((v) => ({ value: v, label: v })),
    ]
  }, [rows, primaryDimension])

  const hasTimeColumn = React.useMemo(
    () => schema.some((c) => c.type === 'time'),
    [schema],
  )
  const datasetMaxDate = React.useMemo(() => {
    const timeCol = schema.find((c) => c.type === 'time')
    return timeCol ? computeMaxDate(rows, timeCol) : null
  }, [rows, schema])

  // Recompute filtered rows + layout per render via useMemo
  const filteredRows = React.useMemo(
    () => applyFilters(rows, schema, filters),
    [rows, schema, filters],
  )
  const layout = React.useMemo(
    () => buildDashboardLayout(filteredRows, schema),
    [filteredRows, schema],
  )

  // Drill-down handler — open a dialog showing rows matching the clicked label
  const handleBarClick = React.useCallback(
    (dimensionKey: string, dimensionLabel: string, label: string) => {
      const matching = filteredRows.filter((r) => String(r[dimensionKey]) === label)
      setDrilldown({
        title: `${dimensionLabel}: ${label}`,
        description: `${matching.length} row${matching.length === 1 ? '' : 's'} match this segment`,
        rows: matching,
      })
    },
    [filteredRows],
  )

  // Filter helpers
  const isFiltered =
    filters.search !== '' ||
    filters.segmentValue !== 'all' ||
    filters.dateRange !== 'all'

  const clearFilters = React.useCallback(() => {
    setFilters({
      ...EMPTY_FILTERS,
      segmentKey: primaryDimension?.name ?? null,
    })
  }, [primaryDimension])

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <FilterBar>
        <FilterBar.Search
          value={filters.search}
          onValueChange={(search) => setFilters((f) => ({ ...f, search }))}
          placeholder={`Search ${schema
            .filter((c) => c.type === 'id' || c.type === 'dimension')
            .slice(0, 2)
            .map((c) => c.label.toLowerCase())
            .join(' / ')}...`}
        />
        {primaryDimension && segmentOptions.length > 1 && (
          <FilterBar.Select
            label={primaryDimension.label}
            value={filters.segmentValue}
            onValueChange={(segmentValue) =>
              setFilters((f) => ({ ...f, segmentValue }))
            }
            options={segmentOptions}
          />
        )}
        {hasTimeColumn && datasetMaxDate && (
          <FilterBar.DateRange
            value={filters.dateRange}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, dateRange: v as DateRangeKey }))
            }
            options={[...DATE_RANGE_OPTIONS]}
          />
        )}
        {isFiltered && <FilterBar.Clear onClear={clearFilters} />}
      </FilterBar>

      {/* Filtered count summary */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
        <span>
          Showing <span className="text-accent">{filteredRows.length}</span> of{' '}
          <span className="text-text-secondary">{rows.length}</span> rows
        </span>
        {isFiltered && (
          <span className="text-text-muted">
            Click any bar or slice to drill into matching records
          </span>
        )}
      </div>

      {/* Empty state OR dashboard */}
      {filteredRows.length === 0 ? (
        <EmptyFilterState onClear={clearFilters} />
      ) : (
        <DashboardView
          layout={layout}
          colors={colors}
          onBarClick={handleBarClick}
          onDonutClick={handleBarClick}
        />
      )}

      {/* Drill-down dialog */}
      <Dialog
        open={drilldown !== null}
        onOpenChange={(open) => {
          if (!open) setDrilldown(null)
        }}
      >
        <DialogContent className="max-w-3xl">
          {drilldown && (
            <>
              <DialogHeader>
                <DialogTitle>{drilldown.title}</DialogTitle>
                <DialogDescription>{drilldown.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-2 max-h-[60vh] overflow-auto">
                <DrilldownTable rows={drilldown.rows} schema={schema} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================
// Empty state when filters match nothing
// ============================================================

function EmptyFilterState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-12 text-center">
      <Inbox className="h-10 w-10 mx-auto text-text-dim mb-4" />
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
        No rows match your filters
      </h3>
      <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
        Try widening the date range, switching to "All" on the segment filter, or clearing the
        search box.
      </p>
      <Button variant="secondary" size="sm" onClick={onClear}>
        <X className="h-3.5 w-3.5" />
        Clear all filters
      </Button>
    </div>
  )
}
