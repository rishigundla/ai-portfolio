import { Users } from 'lucide-react'
import type { WorkloadByAssigneeEntry } from '@/lib/kpi-calc'

interface WorkloadByAssigneeProps {
  entries: WorkloadByAssigneeEntry[]
}

const COLOR_DONE = '#34d399'
const COLOR_OPEN = '#6366f1'

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
      <ul className="flex flex-col gap-1.5">
        {entries.map((entry) => {
          const donePct = entry.total > 0 ? entry.ratio * 100 : 0
          const openPct = 100 - donePct
          return (
            <li key={entry.engineer.id} className="flex items-center gap-3">
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
          )
        })}
      </ul>
    </div>
  )
}
