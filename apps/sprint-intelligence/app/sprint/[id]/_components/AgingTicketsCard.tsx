import type { AgingTicketEntry } from '@/lib/kpi-calc'

interface AgingTicketsCardProps {
  entries: AgingTicketEntry[]
}

const TONE_COLOR: Record<string, string> = {
  fresh: 'var(--chart-emerald)',
  aging: 'var(--chart-amber)',
  stale: 'var(--chart-rose)',
}

const STATUS_LABEL: Record<string, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  'in-review': 'In review',
  blocked: 'Blocked',
  done: 'Done',
}

export function AgingTicketsCard({ entries }: AgingTicketsCardProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-text-muted">No open tickets. Nothing aging.</p>
    )
  }
  const top = entries.slice(0, 8)
  const max = Math.max(...top.map((e) => e.ageDays), 1)
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-text-muted font-mono">
        Open tickets sorted by age, oldest first ({entries.length} total).
      </p>
      {top.map((entry) => {
        const widthPct = Math.min(100, (entry.ageDays / max) * 100)
        const color = TONE_COLOR[entry.tone] ?? 'var(--chart-slate)'
        const title = `${entry.ticketId} · ${entry.title} · ${entry.ageDays.toFixed(1)}d old (${entry.tone})`
        return (
          <div
            key={entry.ticketId}
            className="flex items-center gap-3"
            title={title}
          >
            <span className="w-20 text-[11px] font-mono text-accent shrink-0">
              {entry.ticketId}
            </span>
            <span className="flex-1 h-2 rounded-sm bg-base-700 overflow-hidden">
              <span
                className="block h-full rounded-sm"
                style={{ width: `${widthPct}%`, backgroundColor: color }}
              />
            </span>
            <span
              className="w-14 text-right text-[11px] font-mono font-semibold"
              style={{ color }}
            >
              {entry.ageDays.toFixed(1)}d
            </span>
            <span className="w-20 text-right text-[10px] font-mono text-text-muted">
              {STATUS_LABEL[entry.status] ?? entry.status}
            </span>
          </div>
        )
      })}
    </div>
  )
}
