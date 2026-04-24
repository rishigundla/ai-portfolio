import * as React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../primitives/button'
import { cn } from '../lib/cn'

export type SortDirection = 'asc' | 'desc' | null

export interface DataGridColumn<T> {
  key: keyof T | string
  label: string
  /** Custom cell renderer. Defaults to String(row[key]). */
  render?: (row: T, index: number) => React.ReactNode
  /** Enables sort UI on the column header. */
  sortable?: boolean
  /** Custom sort comparator. Defaults to localeCompare for strings, numeric otherwise. */
  sortFn?: (a: T, b: T, direction: SortDirection) => number
  /** Class applied to the cell. */
  cellClassName?: string
  /** Class applied to the header. */
  headerClassName?: string
  /** Tailwind width class (e.g. 'w-32'). */
  width?: string
  /** Text alignment. */
  align?: 'left' | 'center' | 'right'
}

export interface DataGridProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  data: T[]
  columns: DataGridColumn<T>[]
  pageSize?: number
  /** 0-indexed initial page. */
  initialPage?: number
  /** Called when a row is clicked. */
  onRowClick?: (row: T, index: number) => void
  emptyMessage?: string
  /** Stable row ID accessor. Defaults to index. */
  rowId?: (row: T, index: number) => string | number
}

function defaultCompare<T>(a: T, b: T, key: keyof T | string, direction: SortDirection): number {
  if (direction === null) return 0
  const av = (a as Record<string, unknown>)[key as string]
  const bv = (b as Record<string, unknown>)[key as string]
  if (av == null && bv == null) return 0
  if (av == null) return direction === 'asc' ? 1 : -1
  if (bv == null) return direction === 'asc' ? -1 : 1
  if (typeof av === 'number' && typeof bv === 'number') {
    return direction === 'asc' ? av - bv : bv - av
  }
  const as = String(av).toLowerCase()
  const bs = String(bv).toLowerCase()
  return direction === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
}

export function DataGrid<T>({
  data,
  columns,
  pageSize = 10,
  initialPage = 0,
  onRowClick,
  emptyMessage = 'No rows to display',
  rowId,
  className,
  ...props
}: DataGridProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDirection>(null)
  const [page, setPage] = React.useState(initialPage)

  const sorted = React.useMemo(() => {
    if (!sortKey || sortDir === null) return data
    const column = columns.find((c) => String(c.key) === sortKey)
    const compareFn = column?.sortFn || ((a: T, b: T, dir: SortDirection) => defaultCompare(a, b, sortKey, dir))
    return [...data].sort((a, b) => compareFn(a, b, sortDir))
  }, [data, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('asc')
      return
    }
    // cycle: asc → desc → null → asc
    setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'))
  }

  const getSortIcon = (colKey: string) => {
    if (sortKey !== colKey || sortDir === null) {
      return <ChevronsUpDown className="h-3 w-3 opacity-50" />
    }
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 text-accent" /> : <ChevronDown className="h-3 w-3 text-accent" />
  }

  if (data.length === 0) {
    return (
      <div className={cn('rounded-lg border border-surface-border bg-surface p-12 text-center', className)} {...props}>
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-surface-border bg-surface overflow-hidden', className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-base-800">
              {columns.map((col) => {
                const k = String(col.key)
                const alignClass =
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                return (
                  <th
                    key={k}
                    className={cn(
                      'font-mono text-[11px] uppercase tracking-wider text-text-muted font-medium px-4 py-3',
                      alignClass,
                      col.width,
                      col.headerClassName,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(k)}
                        className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                      >
                        {col.label}
                        {getSortIcon(k)}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => {
              const id = rowId ? rowId(row, i) : i
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row, currentPage * pageSize + i)}
                  className={cn(
                    'border-b border-surface-border/60 last:border-b-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surface-hover',
                  )}
                >
                  {columns.map((col) => {
                    const k = String(col.key)
                    const value = col.render
                      ? col.render(row, currentPage * pageSize + i)
                      : String((row as Record<string, unknown>)[k] ?? '')
                    const alignClass =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                    return (
                      <td
                        key={k}
                        className={cn('px-4 py-3 text-text-primary', alignClass, col.cellClassName)}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-surface-border px-4 py-2">
          <span className="font-mono text-xs text-text-muted">
            {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-xs text-text-muted px-2">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
