'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import {
  TICKET_TYPE_OPTIONS,
  TICKET_STATUS_OPTIONS,
} from '@/lib/kpi-calc'
import type { TeamMember } from '@/lib/sprints'

interface SprintFiltersProps {
  team: TeamMember[]
}

const FILTER_KEYS = ['assignee', 'type', 'status'] as const
type FilterKey = (typeof FILTER_KEYS)[number]

export function SprintFilters({ team }: SprintFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const current: Record<FilterKey, string> = {
    assignee: searchParams.get('assignee') ?? 'all',
    type: searchParams.get('type') ?? 'all',
    status: searchParams.get('status') ?? 'all',
  }

  const activeCount = FILTER_KEYS.filter((k) => current[k] !== 'all').length

  const setFilter = (key: FilterKey, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const query = params.toString()
    router.replace(query ? `?${query}` : '?', { scroll: false })
  }

  const clearAll = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    for (const k of FILTER_KEYS) params.delete(k)
    const query = params.toString()
    router.replace(query ? `?${query}` : '?', { scroll: false })
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text-muted shrink-0">
        <Filter className="h-3.5 w-3.5" />
        Filter
      </span>
      <FilterSelect
        label="Assignee"
        value={current.assignee}
        onChange={(v) => setFilter('assignee', v)}
        options={[
          { value: 'all', label: 'Everyone' },
          ...team.map((m) => ({ value: m.id, label: m.name })),
        ]}
      />
      <FilterSelect
        label="Type"
        value={current.type}
        onChange={(v) => setFilter('type', v)}
        options={[
          { value: 'all', label: 'All types' },
          ...TICKET_TYPE_OPTIONS,
        ]}
      />
      <FilterSelect
        label="Status"
        value={current.status}
        onChange={(v) => setFilter('status', v)}
        options={[
          { value: 'all', label: 'All statuses' },
          ...TICKET_STATUS_OPTIONS,
        ]}
      />
      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="ml-auto inline-flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-accent transition-colors"
        >
          <X className="h-3 w-3" />
          Clear {activeCount}
        </button>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="inline-flex items-center gap-2 text-[11px] font-mono text-text-muted">
      <span className="sr-only sm:not-sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Filter by ${label.toLowerCase()}`}
        className="bg-base-800 border border-surface-border rounded-md px-2 py-1 text-[12px] text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent/60 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-base-800">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
