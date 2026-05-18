import type { PriorityBreakdownEntry } from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

interface PriorityBreakdownChartProps {
  entries: PriorityBreakdownEntry[]
}

const PRIORITY_LABEL: Record<string, string> = {
  P0: 'Critical (P0)',
  P1: 'High (P1)',
  P2: 'Major (P2)',
  P3: 'Minor (P3)',
}

const COLOR_DONE = 'var(--chart-emerald)'
const COLOR_REMAIN = 'var(--chart-rose)'

export function PriorityBreakdownChart({ entries }: PriorityBreakdownChartProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-text-muted">No tickets match the current filter.</p>
    )
  }
  const max = Math.max(...entries.map((e) => e.total), 1)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: COLOR_DONE }} />
          Done
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: COLOR_REMAIN }} />
          Remaining
        </span>
      </div>
      <TooltipProvider delayDuration={120} skipDelayDuration={60}>
        <div className="grid grid-cols-4 gap-3 h-56">
          {entries.map((entry) => {
            const totalHeightPct = (entry.total / max) * 100
            const doneShare = entry.total > 0 ? entry.done / entry.total : 0
            return (
              <Tooltip key={entry.priority}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center h-full cursor-default">
                    <div className="flex-1 w-full flex items-end justify-center">
                      <div
                        className="w-12 rounded-t-sm overflow-hidden flex flex-col-reverse"
                        style={{ height: `${totalHeightPct}%`, minHeight: '4px' }}
                      >
                        <div
                          className="w-full"
                          style={{
                            height: `${doneShare * 100}%`,
                            backgroundColor: COLOR_DONE,
                          }}
                        />
                        <div
                          className="w-full"
                          style={{
                            height: `${(1 - doneShare) * 100}%`,
                            backgroundColor: COLOR_REMAIN,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-text-secondary mt-2">
                      {PRIORITY_LABEL[entry.priority] ?? entry.priority}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted mt-0.5">
                      {entry.done}/{entry.total}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={6}>
                  <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                    {PRIORITY_LABEL[entry.priority] ?? entry.priority}
                  </div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLOR_DONE }}
                    />
                    <span className="text-text-secondary">Done</span>
                    <span className="text-text-primary font-mono font-semibold">
                      {entry.done}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLOR_REMAIN }}
                    />
                    <span className="text-text-secondary">Remaining</span>
                    <span className="text-text-primary font-mono font-semibold">
                      {entry.total - entry.done}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}
