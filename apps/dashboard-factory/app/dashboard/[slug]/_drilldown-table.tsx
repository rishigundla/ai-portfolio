'use client'

import { DataGrid, type DataGridColumn } from '@rishi/design-system/components'
import { formatCell, type ColumnSchema } from '@/lib/full-datasets'

interface DrilldownTableProps {
  rows: Record<string, unknown>[]
  schema: ColumnSchema[]
  /** Cap how many columns to show in the drill-down view. */
  maxColumns?: number
}

/**
 * Compact table used inside the drill-down dialog. Same DataGrid primitive
 * as the dataset preview, with a tighter column cap for the dialog layout.
 *
 * Why a separate component (rather than reusing _dataset-preview.tsx from
 * /generate/[slug]): different consumer, different defaults. Keeps each
 * call site explicit about column caps and ID column styling.
 */
export function DrilldownTable({
  rows,
  schema,
  maxColumns = 6,
}: DrilldownTableProps) {
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
      data={rows}
      columns={columns}
      pageSize={20}
      rowId={(_, idx) => `drilldown-${idx}`}
      emptyMessage="No matching rows"
    />
  )
}
