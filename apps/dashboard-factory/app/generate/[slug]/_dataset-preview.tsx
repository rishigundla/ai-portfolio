'use client'

import { DataGrid, type DataGridColumn } from '@rishi/design-system/components'
import { formatCell, type ColumnSchema } from '@/lib/full-datasets'

interface DatasetPreviewProps {
  rows: Record<string, unknown>[]
  schema: ColumnSchema[]
  /** Limit how many columns to render (preview tables shouldn't show every column). */
  maxColumns?: number
  /** Limit how many rows to render. */
  maxRows?: number
}

/**
 * Thin client wrapper around DataGrid for the profiling page preview.
 *
 * Why this exists: DataGridColumn objects contain `render` functions, which
 * cannot be passed across the server-to-client boundary (RSC serialization
 * forbids non-JSON values). Constructing the columns array INSIDE this client
 * component keeps the function definitions client-side throughout.
 */
export function DatasetPreview({
  rows,
  schema,
  maxColumns = 7,
  maxRows = 10,
}: DatasetPreviewProps) {
  const previewRows = rows.slice(0, maxRows)
  const columns: DataGridColumn<Record<string, unknown>>[] = schema
    .slice(0, maxColumns)
    .map((col) => ({
      key: col.name,
      label: col.label,
      sortable: col.type !== 'id',
      align: col.type === 'measure' ? ('right' as const) : ('left' as const),
      render: (row) => formatCell(row[col.name], col),
      cellClassName: col.type === 'id' ? 'font-mono text-xs text-text-muted' : '',
    }))

  return (
    <DataGrid
      data={previewRows}
      columns={columns}
      pageSize={maxRows}
      rowId={(_, idx) => `row-${idx}`}
      emptyMessage="No rows to preview"
    />
  )
}
