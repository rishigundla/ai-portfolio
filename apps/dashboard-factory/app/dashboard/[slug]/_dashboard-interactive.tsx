'use client'

import * as React from 'react'
import { Download, Inbox, Loader2, X } from 'lucide-react'
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
import { toast } from '@/lib/toast-store'

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
      { value: 'all', label: `All ${pluralize(primaryDimension.label.toLowerCase())}` },
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
    toast.info('Filters cleared', 'Showing all rows')
  }, [primaryDimension])

  // PDF export — dynamic-import @react-pdf/renderer + lib/pdf-document
  // only when the user clicks Export, so the ~200 kB renderer bundle
  // stays out of the route's First Load JS.
  const [isExporting, setIsExporting] = React.useState(false)
  const exportPdf = React.useCallback(async () => {
    setIsExporting(true)
    try {
      const [{ pdf }, { DashboardPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/lib/pdf-document'),
      ])
      const blob = await pdf(
        <DashboardPdf
          datasetTitle={metadata.title}
          datasetTagline={metadata.tagline}
          datasetDomain={metadata.domain}
          layout={layout}
          filters={filters}
          filterSegmentLabel={primaryDimension?.label}
          totalRows={rows.length}
          filteredRowCount={filteredRows.length}
          generatedAt={new Date()}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const dateStamp = new Date().toISOString().split('T')[0]
      const filename = `${fullDataset.id}-dashboard-${dateStamp}.pdf`
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
      toast.success('PDF exported', filename)
    } catch (err) {
      console.error('PDF export failed', err)
      toast.error(
        'PDF export failed',
        err instanceof Error ? err.message : 'Unknown error',
      )
    } finally {
      setIsExporting(false)
    }
  }, [
    metadata.title,
    metadata.tagline,
    metadata.domain,
    layout,
    filters,
    primaryDimension,
    rows.length,
    filteredRows.length,
    fullDataset.id,
  ])

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

      {/* Filtered count summary + export button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs font-mono text-text-muted">
          Showing <span className="text-accent">{filteredRows.length}</span> of{' '}
          <span className="text-text-secondary">{rows.length}</span> rows
          {isFiltered && (
            <span className="hidden sm:inline ml-3 text-text-muted">
              · Click any bar or slice to drill into matching records
            </span>
          )}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={exportPdf}
          disabled={isExporting || filteredRows.length === 0}
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {isExporting ? 'Generating...' : 'Export PDF'}
        </Button>
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
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          {drilldown && (
            <>
              <DialogHeader>
                <DialogTitle>{drilldown.title}</DialogTitle>
                <DialogDescription>{drilldown.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-2 flex-1 min-h-0 overflow-auto">
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
// Pluralization — handles the common cases the segment filter encounters.
// Opportunity → opportunities (consonant + y → ies)
// Status → statuses (s/x/z/ch/sh → es)
// Campaign → campaigns (default + s)
// ============================================================

function pluralize(word: string): string {
  if (/[^aeiou]y$/.test(word)) return word.slice(0, -1) + 'ies'
  if (/(s|x|z|ch|sh)$/.test(word)) return word + 'es'
  return word + 's'
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
