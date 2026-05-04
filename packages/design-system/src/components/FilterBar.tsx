'use client'

import * as React from 'react'
import { Calendar, Check, ChevronDown, Filter, Search, X } from 'lucide-react'
import { Input } from '../primitives/input'
import { Button } from '../primitives/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../primitives/command'
import { cn } from '../lib/cn'

// ========== Root FilterBar ==========
export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const FilterBar: React.FC<FilterBarProps> & {
  Search: typeof FilterBarSearch
  Select: typeof FilterBarSelect
  MultiSelect: typeof FilterBarMultiSelect
  DateRange: typeof FilterBarDateRange
  DateRangePicker: typeof FilterBarDateRangePicker
  Clear: typeof FilterBarClear
} = ({ children, className, ...props }) => (
  <div
    className={cn(
      'flex flex-wrap items-center gap-2 p-3 rounded-lg border border-surface-border bg-surface-elevated',
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

// ========== Search field ==========
export interface FilterBarSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

const FilterBarSearch: React.FC<FilterBarSearchProps> = ({
  value,
  onValueChange,
  placeholder = 'Search...',
  className,
  ...props
}) => (
  <div className={cn('relative flex-1 min-w-[180px] max-w-xs', className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
    <Input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      className="pl-9 h-9 text-sm"
      {...props}
    />
  </div>
)

// ========== Segmented dropdown select ==========
export interface FilterBarSelectOption {
  value: string
  label: string
}

export interface FilterBarSelectProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  options: FilterBarSelectOption[]
  placeholder?: string
  className?: string
}

const FilterBarSelect: React.FC<FilterBarSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'All',
  className,
}) => (
  <div className={cn('flex items-center gap-1.5 min-w-[140px]', className)}>
    {label && (
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted whitespace-nowrap">
        {label}
      </span>
    )}
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

// ========== Date range picker (light-weight preset selector) ==========
export type DateRangeValue = '7d' | '30d' | '90d' | 'qtd' | 'ytd' | 'all' | string

export interface FilterBarDateRangeProps {
  value: DateRangeValue
  onValueChange: (value: DateRangeValue) => void
  options?: FilterBarSelectOption[]
  className?: string
}

const DEFAULT_DATE_OPTIONS: FilterBarSelectOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'qtd', label: 'Quarter to date' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'all', label: 'All time' },
]

const FilterBarDateRange: React.FC<FilterBarDateRangeProps> = ({
  value,
  onValueChange,
  options = DEFAULT_DATE_OPTIONS,
  className,
}) => (
  <div className={cn('flex items-center gap-1.5 min-w-[160px]', className)}>
    <Calendar className="h-4 w-4 text-text-muted shrink-0" />
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

// ========== Multi-select dropdown (popover + cmdk check-list) ==========
export interface FilterBarMultiSelectProps {
  label?: string
  /** Currently selected values. Empty array = no filter applied. */
  values: string[]
  onValuesChange: (values: string[]) => void
  options: FilterBarSelectOption[]
  placeholder?: string
  /** Empty-list label inside the popover when search returns nothing. */
  emptyLabel?: string
  /** Label shown on the trigger when nothing is selected. Defaults to "All". */
  allLabel?: string
  className?: string
}

const FilterBarMultiSelect: React.FC<FilterBarMultiSelectProps> = ({
  label,
  values,
  onValuesChange,
  options,
  placeholder = 'Search...',
  emptyLabel = 'No matches',
  allLabel = 'All',
  className,
}) => {
  const [open, setOpen] = React.useState(false)
  const selected = new Set(values)

  // Trigger preview: "All", or "<first> + N more", to keep the trigger
  // narrow even when many values are selected. Hovering the chip surfaces
  // the full list via title for keyboard / screen-reader users too.
  const triggerLabel = (() => {
    if (values.length === 0) return allLabel
    const firstOption = options.find((o) => o.value === values[0])
    const firstLabel = firstOption?.label ?? values[0]
    if (values.length === 1) return firstLabel
    return `${firstLabel} +${values.length - 1}`
  })()

  const fullTitle =
    values.length > 0
      ? values
          .map((v) => options.find((o) => o.value === v)?.label ?? v)
          .join(', ')
      : undefined

  const toggle = (value: string) => {
    if (selected.has(value)) {
      onValuesChange(values.filter((v) => v !== value))
    } else {
      onValuesChange([...values, value])
    }
  }

  return (
    <div className={cn('flex items-center gap-1.5 min-w-[140px]', className)}>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted whitespace-nowrap">
          {label}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            title={fullTitle}
            aria-label={`${label ?? 'Filter'}: ${triggerLabel}`}
            className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-surface-border bg-surface px-3 text-sm text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = selected.has(opt.value)
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => toggle(opt.value)}
                    >
                      <span
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded border',
                          isSelected
                            ? 'bg-accent border-accent text-base-900'
                            : 'border-surface-border',
                        )}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <span className="truncate">{opt.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
            {values.length > 0 && (
              <div className="border-t border-surface-border p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full justify-start text-xs text-text-muted hover:text-accent"
                  onClick={() => {
                    onValuesChange([])
                    setOpen(false)
                  }}
                >
                  <X className="h-3 w-3 mr-1.5" />
                  Clear selection
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ========== Date-range picker (popover with start/end + presets) ==========
export interface FilterBarDateRangePickerProps {
  /** Current date-range mode. 'all' shows everything; 'custom' uses start+end. */
  mode: 'all' | 'recent-30' | 'recent-90' | 'custom' | string
  /** ISO YYYY-MM-DD; rendered as the start input value when mode is 'custom'. */
  start?: string
  /** ISO YYYY-MM-DD; rendered as the end input value when mode is 'custom'. */
  end?: string
  /** Called when user picks a preset chip (no start/end emitted). */
  onPresetChange: (mode: 'all' | 'recent-30' | 'recent-90') => void
  /** Called when user edits one of the date inputs. */
  onCustomChange: (start: string | undefined, end: string | undefined) => void
  /** Called when user clicks the "Clear" button inside the popover. */
  onClear: () => void
  /**
   * The dataset's earliest + latest dates as ISO strings. Used for the
   * <input min/max> attributes so users can't pick dates outside the data.
   */
  bounds?: { min?: string; max?: string }
  className?: string
}

const PRESET_LABEL: Record<string, string> = {
  all: 'All time',
  'recent-30': 'Last 30 days',
  'recent-90': 'Last 90 days',
}

const FilterBarDateRangePicker: React.FC<FilterBarDateRangePickerProps> = ({
  mode,
  start,
  end,
  onPresetChange,
  onCustomChange,
  onClear,
  bounds,
  className,
}) => {
  const [open, setOpen] = React.useState(false)

  const triggerLabel =
    mode === 'custom' && (start || end)
      ? formatRangeLabel(start, end)
      : PRESET_LABEL[mode] ?? 'All time'

  return (
    <div className={cn('flex items-center gap-1.5 min-w-[160px]', className)}>
      <Calendar className="h-4 w-4 text-text-muted shrink-0" aria-hidden="true" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Date range: ${triggerLabel}`}
            className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-surface-border bg-surface px-3 text-sm text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-3 space-y-3">
          {/* Custom range inputs */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Custom range
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={start ?? ''}
                min={bounds?.min}
                max={end ?? bounds?.max}
                onChange={(e) => onCustomChange(e.target.value || undefined, end)}
                className="flex-1 h-8 rounded-md border border-surface-border bg-surface px-2 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Start date"
              />
              <span className="self-center text-text-muted text-xs">to</span>
              <input
                type="date"
                value={end ?? ''}
                min={start ?? bounds?.min}
                max={bounds?.max}
                onChange={(e) => onCustomChange(start, e.target.value || undefined)}
                className="flex-1 h-8 rounded-md border border-surface-border bg-surface px-2 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="End date"
              />
            </div>
          </div>

          {/* Preset chips */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Quick presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'recent-30', 'recent-90'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onPresetChange(preset)
                    setOpen(false)
                  }}
                  className={cn(
                    'rounded-full px-3 h-7 text-xs font-medium transition-colors',
                    mode === preset
                      ? 'bg-accent text-base-900'
                      : 'border border-surface-border text-text-secondary hover:border-accent/40 hover:text-text-primary',
                  )}
                >
                  {PRESET_LABEL[preset]}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {(mode !== 'all' || start || end) && (
            <div className="border-t border-surface-border pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-start text-xs text-text-muted hover:text-accent"
                onClick={() => {
                  onClear()
                  setOpen(false)
                }}
              >
                <X className="h-3 w-3 mr-1.5" />
                Clear date range
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function formatRangeLabel(start?: string, end?: string): string {
  const fmt = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  const s = fmt(start)
  const e = fmt(end)
  if (s && e) return `${s} – ${e}`
  if (s) return `From ${s}`
  if (e) return `Until ${e}`
  return 'Custom range'
}

// ========== Clear-filters button ==========
export interface FilterBarClearProps {
  onClear: () => void
  className?: string
  label?: string
}

const FilterBarClear: React.FC<FilterBarClearProps> = ({ onClear, className, label = 'Clear' }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClear}
    className={cn('h-9 text-xs text-text-muted hover:text-accent', className)}
  >
    <X className="h-3.5 w-3.5 mr-1" />
    {label}
  </Button>
)

FilterBar.Search = FilterBarSearch
FilterBar.Select = FilterBarSelect
FilterBar.MultiSelect = FilterBarMultiSelect
FilterBar.DateRange = FilterBarDateRange
FilterBar.DateRangePicker = FilterBarDateRangePicker
FilterBar.Clear = FilterBarClear

// Convenience unified export
export {
  FilterBarSearch,
  FilterBarSelect,
  FilterBarMultiSelect,
  FilterBarDateRange,
  FilterBarDateRangePicker,
  FilterBarClear,
}
