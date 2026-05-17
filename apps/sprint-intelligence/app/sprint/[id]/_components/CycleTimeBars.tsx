import type { PerTicketCycleEntry } from '@/lib/kpi-calc'

interface CycleTimeBarsProps {
  entries: PerTicketCycleEntry[]
  baseline: number
}

const TONE_COLOR: Record<string, string> = {
  fast: '#34d399',
  'on-track': '#fbbf24',
  slow: '#fb7185',
}

export function CycleTimeBars({ entries, baseline }: CycleTimeBarsProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-text-muted">No completed tickets match the current filter.</p>
    )
  }
  const top = entries.slice(0, 8)
  const max = Math.max(...top.map((e) => e.days), baseline * 2, 1)
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-text-muted font-mono">
        Average: {(top.reduce((acc, e) => acc + e.days, 0) / top.length).toFixed(1)}d
        from creation to closure · baseline {baseline.toFixed(1)}d
      </p>
      {top.map((entry) => {
        const widthPct = Math.min(100, (entry.days / max) * 100)
        const color = TONE_COLOR[entry.tone] ?? '#94a3b8'
        const title = `${entry.ticketId} · ${entry.title} · ${entry.days.toFixed(1)}d (${entry.tone})`
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
              {entry.days.toFixed(1)}d
            </span>
          </div>
        )
      })}
    </div>
  )
}
