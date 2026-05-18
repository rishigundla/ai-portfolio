import type { PerTicketCycleEntry } from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

interface CycleTimeBarsProps {
  entries: PerTicketCycleEntry[]
  baseline: number
}

const TONE_COLOR: Record<string, string> = {
  fast: 'var(--chart-emerald)',
  'on-track': 'var(--chart-amber)',
  slow: 'var(--chart-rose)',
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
    <TooltipProvider delayDuration={120} skipDelayDuration={60}>
      <div className="flex flex-col gap-2">
        <p className="text-[11px] text-text-muted font-mono">
          Average: {(top.reduce((acc, e) => acc + e.days, 0) / top.length).toFixed(1)}d
          from creation to closure · baseline {baseline.toFixed(1)}d
        </p>
        {top.map((entry) => {
          const widthPct = Math.min(100, (entry.days / max) * 100)
          const color = TONE_COLOR[entry.tone] ?? 'var(--chart-slate)'
          return (
            <Tooltip key={entry.ticketId}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 cursor-default">
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
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                  {entry.ticketId}
                </div>
                <div className="text-text-primary text-xs mb-1">{entry.title}</div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-text-secondary">{entry.tone}</span>
                  <span className="text-text-primary font-mono font-semibold">
                    {entry.days.toFixed(1)}d
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
