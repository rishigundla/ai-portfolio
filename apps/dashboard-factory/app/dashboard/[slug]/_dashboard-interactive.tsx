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
import { pluralize } from '@/lib/format'
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

  // PDF export uses html2canvas + jsPDF, captures the live dashboard DOM
  // (KPIs + charts + filters) at its current filtered state and embeds it
  // as PNG inside an A4 PDF. Both libs dynamic-import on click so they
  // stay out of First Load JS.
  //
  // Capture target: <div id="dashboard-capture-target"> set in DashboardView.
  // If multiple A4 pages are needed, the canvas is sliced vertically and
  // each slice is added as a separate page so nothing gets clipped or
  // squished into one giant page.
  const [isExporting, setIsExporting] = React.useState(false)
  const exportPdf = React.useCallback(async () => {
    setIsExporting(true)
    try {
      const target = document.getElementById('dashboard-capture-target')
      if (!target) {
        throw new Error('Dashboard capture target not found in DOM')
      }

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      // Mark the subtree as 'exporting' so globals.css can hide the
      // interactive drill-in chips (affordance for click, irrelevant in
      // a static PDF). Cleared in finally{} below regardless of outcome.
      target.setAttribute('data-exporting', 'true')

      // Capture at 2x device pixel ratio for crisp text/charts on print.
      // backgroundColor: matches the app's base-900 so the PDF page tint
      // outside the captured region looks intentional, not a leak.
      const canvas = await html2canvas(target, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // A4 portrait at 72 DPI = 595 x 842 pt. We use jsPDF's default 'mm'
      // unit (210 x 297 mm) and let it handle the pt conversion.
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      const pageWidthMm = 210
      const pageHeightMm = 297
      const marginMm = 8
      const headerHeightMm = 14
      const usableWidthMm = pageWidthMm - marginMm * 2
      const usableHeightMm = pageHeightMm - marginMm * 2 - headerHeightMm

      // Programmatic header on page 1 so the PDF identifies the source
      // dataset + export date even when shared without context. Renders
      // as native PDF text (selectable, searchable) above the canvas
      // image. Subsequent pages get just a thin "{title} · page N" line.
      const exportDateStamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
      pdf.setFontSize(14)
      pdf.setTextColor(45, 212, 191) // accent teal
      pdf.text('Dashboard Factory', marginMm, marginMm + 5)
      pdf.setFontSize(11)
      pdf.setTextColor(241, 245, 249) // text-primary
      pdf.text(metadata.title, marginMm, marginMm + 11)
      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184) // text-muted (slate-400)
      pdf.text(
        `Exported ${exportDateStamp} • ${filteredRows.length} of ${rows.length} rows`,
        pageWidthMm - marginMm,
        marginMm + 11,
        { align: 'right' },
      )

      // Convert capture pixel dims to mm using ratio of usableWidthMm to
      // canvas width. The full canvas height in mm tells us if we need
      // to split into multiple pages.
      const canvasMmHeight = (canvas.height * usableWidthMm) / canvas.width

      if (canvasMmHeight <= usableHeightMm) {
        // Single-page case — common for short filtered views.
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.92),
          'JPEG',
          marginMm,
          marginMm + headerHeightMm,
          usableWidthMm,
          canvasMmHeight,
        )
      } else {
        // Multi-page case — slice the canvas vertically into A4-height
        // chunks and add each as its own page. Use a hidden <canvas> as
        // the slice buffer so we don't have to do it via context math.
        const slicePxHeight = Math.floor(
          (usableHeightMm * canvas.width) / usableWidthMm,
        )
        const sliceCanvas = document.createElement('canvas')
        sliceCanvas.width = canvas.width
        sliceCanvas.height = slicePxHeight
        const sliceCtx = sliceCanvas.getContext('2d')
        if (!sliceCtx) {
          throw new Error('Could not create 2D context for PDF page split')
        }

        let yOffsetPx = 0
        let isFirstPage = true
        while (yOffsetPx < canvas.height) {
          const remainingPx = canvas.height - yOffsetPx
          const thisSlicePx = Math.min(slicePxHeight, remainingPx)
          // Reset slice canvas to background color in case it's the last
          // (short) slice, so we don't see ghost pixels from the previous one.
          sliceCtx.fillStyle = '#0a0a0f'
          sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
          sliceCtx.drawImage(
            canvas,
            0, yOffsetPx, canvas.width, thisSlicePx,
            0, 0, sliceCanvas.width, thisSlicePx,
          )
          const sliceMmHeight = (thisSlicePx * usableWidthMm) / canvas.width
          if (!isFirstPage) pdf.addPage()
          // First page reserves headerHeightMm at top for the title;
          // subsequent pages start at the regular margin (no header).
          const yPosMm = isFirstPage ? marginMm + headerHeightMm : marginMm
          pdf.addImage(
            sliceCanvas.toDataURL('image/jpeg', 0.92),
            'JPEG',
            marginMm,
            yPosMm,
            usableWidthMm,
            sliceMmHeight,
          )
          yOffsetPx += slicePxHeight
          isFirstPage = false
        }
      }

      const dateStamp = new Date().toISOString().split('T')[0]
      const filename = `${fullDataset.id}-dashboard-${dateStamp}.pdf`
      pdf.save(filename)
      toast.success('PDF exported', filename)
    } catch (err) {
      console.error('PDF export failed', err)
      toast.error(
        'PDF export failed',
        err instanceof Error ? err.message : 'Unknown error',
      )
    } finally {
      const target = document.getElementById('dashboard-capture-target')
      if (target) target.removeAttribute('data-exporting')
      setIsExporting(false)
    }
  }, [fullDataset.id, metadata.title, filteredRows.length, rows.length])

  return (
    // id + data-exporting flag here mark the dashboard subtree for PDF
    // capture. data-exporting is toggled by the export handler and used
    // by globals.css to hide affordance chrome (the drill-in chips) that
    // shouldn't appear in a static PDF.
    <div id="dashboard-capture-target" className="space-y-6">
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
