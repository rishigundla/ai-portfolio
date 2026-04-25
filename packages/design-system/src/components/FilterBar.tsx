'use client'

import * as React from 'react'
import { Calendar, Filter, Search, X } from 'lucide-react'
import { Input } from '../primitives/input'
import { Button } from '../primitives/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select'
import { cn } from '../lib/cn'

// ========== Root FilterBar ==========
export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const FilterBar: React.FC<FilterBarProps> & {
  Search: typeof FilterBarSearch
  Select: typeof FilterBarSelect
  DateRange: typeof FilterBarDateRange
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
FilterBar.DateRange = FilterBarDateRange
FilterBar.Clear = FilterBarClear

// Convenience unified export
export { FilterBarSearch, FilterBarSelect, FilterBarDateRange, FilterBarClear }
