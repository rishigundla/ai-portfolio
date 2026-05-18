import { Users } from 'lucide-react'
import type { WorkloadByAssigneeEntry } from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

interface WorkloadByAssigneeProps {
  entries: WorkloadByAssigneeEntry[]
}

const COLOR_DONE = 'var(--chart-emerald)'
const COLOR_OPEN = 'var(--chart-indigo)'

export function WorkloadByAssignee({ entries }: WorkloadByAssigneeProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          Completed share of own tickets, sorted by allocation
        </span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: COLOR_DONE }} />
            Done
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: COLOR_OPEN }} />
            Open
          </span>
        </div>
      </div>
      <TooltipProvider delayDuration={120} skipDelayDuration={60}>
        <ul className="flex flex-col gap-1.5">
          {entries.map((entry) => {
            const donePct = entry.total > 0 ? entry.ratio * 100 : 0
            const openPct = 100 - donePct
            return (
              <Tooltip key={entry.engineer.id}>
                <TooltipTrigger asChild>
                  <li className="flex items-center gap-3 cursor-default">
                    <span className="w-36 font-display text-[13px] font-semibold text-text-primary truncate">
                      {entry.engineer.name}
                    </span>
                    <span className="flex-1 h-2.5 rounded-sm bg-base-700 overflow-hidden flex">
                      {entry.total > 0 ? (
                        <>
                          <span
                            className="h-full"
                            style={{ width: `${donePct}%`, backgroundColor: COLOR_DONE }}
                          />
                          <span
                            className="h-full"
                            style={{ width: `${openPct}%`, backgroundColor: COLOR_OPEN, opacity: 0.85 }}
                          />
                        </>
                      ) : null}
                    </span>
                    <span className="w-14 text-right text-[11px] font-mono text-text-secondary">
                      {entry.done}/{entry.total}
                    </span>
                  </li>
                </TooltipTrigger>
                <TooltipContent sideOffset={6}>
                  <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                    {entry.engineer.name} · {entry.engineer.role}
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
                      style={{ backgroundColor: COLOR_OPEN }}
                    />
                    <span className="text-text-secondary">Open</span>
                    <span className="text-text-primary font-mono font-semibold">
                      {entry.total - entry.done}
                    </span>
                  </div>
                  {entry.total > 0 && (
                    <div className="text-text-muted font-mono text-[10px] mt-1">
                      {donePct.toFixed(0)}% complete
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </ul>
      </TooltipProvider>
    </div>
  )
}
