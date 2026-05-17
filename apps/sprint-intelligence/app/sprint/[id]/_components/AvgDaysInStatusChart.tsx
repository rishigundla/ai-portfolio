import type { AvgDaysInStatusEntry } from '@/lib/kpi-calc'

interface AvgDaysInStatusChartProps {
  entries: AvgDaysInStatusEntry[]
}

const STATUS_COLOR: Record<string, string> = {
  done: 'var(--chart-emerald)',
  'in-review': 'var(--chart-violet)',
  'in-progress': 'var(--chart-amber)',
  todo: 'var(--chart-slate)',
  blocked: 'var(--chart-rose)',
}

export function AvgDaysInStatusChart({ entries }: AvgDaysInStatusChartProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-text-muted">No tickets match the current filter.</p>
    )
  }
  const max = Math.max(...entries.map((e) => e.averageDays), 1)
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const widthPct = Math.min(100, (entry.averageDays / max) * 100)
        const color = STATUS_COLOR[entry.status] ?? 'var(--chart-slate)'
        const title = `${entry.label}: ${entry.count} ticket${entry.count === 1 ? '' : 's'} averaging ${entry.averageDays.toFixed(1)} days in this status`
        return (
          <div
            key={entry.status}
            className="flex items-center gap-3"
            title={title}
          >
            <span className="w-24 text-[11px] font-mono text-text-secondary shrink-0">
              {entry.label}
            </span>
            <span className="flex-1 h-2 rounded-sm bg-base-700 overflow-hidden">
              <span
                className="block h-full rounded-sm transition-all"
                style={{ width: `${widthPct}%`, backgroundColor: color }}
              />
            </span>
            <span
              className="w-14 text-right text-[11px] font-mono font-semibold"
              style={{ color }}
            >
              {entry.averageDays.toFixed(1)}d
            </span>
            <span className="w-8 text-right text-[10px] font-mono text-text-muted">
              ({entry.count})
            </span>
          </div>
        )
      })}
    </div>
  )
}
