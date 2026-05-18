import type { AvgDaysInStatusEntry } from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

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
    <TooltipProvider delayDuration={120} skipDelayDuration={60}>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => {
          const widthPct = Math.min(100, (entry.averageDays / max) * 100)
          const color = STATUS_COLOR[entry.status] ?? 'var(--chart-slate)'
          return (
            <Tooltip key={entry.status}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 cursor-default">
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
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                  {entry.label}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-text-secondary">
                    {entry.count} ticket{entry.count === 1 ? '' : 's'}
                  </span>
                  <span className="text-text-primary font-mono font-semibold">
                    {entry.averageDays.toFixed(1)}d avg
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
