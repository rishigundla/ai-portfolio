import Link from 'next/link'
import { CheckCircle2, Activity, Clock } from 'lucide-react'
import type { SprintSummary } from '@/lib/sprints'

interface SprintHistoryTableProps {
  sprints: SprintSummary[]
  activeId: string
}

const STATUS_ICON: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  completed: CheckCircle2,
  'in-progress': Activity,
  planned: Clock,
}

const STATUS_TONE: Record<string, string> = {
  completed: 'text-emerald-300',
  'in-progress': 'text-amber-300',
  planned: 'text-slate-300',
}

export function SprintHistoryTable({ sprints, activeId }: SprintHistoryTableProps) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-[12px] font-mono">
        <thead>
          <tr className="text-text-muted text-[10px] uppercase tracking-widest border-b border-surface-border">
            <th className="text-left px-2 py-2 font-medium">Sprint</th>
            <th className="text-right px-2 py-2 font-medium">Total</th>
            <th className="text-right px-2 py-2 font-medium">Closed</th>
            <th className="text-right px-2 py-2 font-medium">Open</th>
            <th className="text-right px-2 py-2 font-medium">Completion</th>
            <th className="text-right px-2 py-2 font-medium">SP done</th>
            <th className="text-right px-2 py-2 font-medium">SP total</th>
            <th className="text-left px-2 py-2 font-medium w-32">Progress</th>
          </tr>
        </thead>
        <tbody>
          {sprints.map((s) => {
            const Icon = STATUS_ICON[s.status] ?? CheckCircle2
            const tone = STATUS_TONE[s.status] ?? 'text-text-secondary'
            const total = s.ticketCount
            const closed = s.closedCount ?? 0
            const open = s.openCount ?? Math.max(0, total - closed)
            const completionPct = total > 0 ? (closed / total) * 100 : 0
            const isActive = s.id === activeId
            const rowTitle = `${s.name} · ${s.tagline}`
            return (
              <tr
                key={s.id}
                className={`border-b border-surface-border/40 ${
                  isActive ? 'bg-base-700/40' : 'hover:bg-base-700/20'
                } transition-colors`}
                title={rowTitle}
              >
                <td className="px-2 py-2">
                  <Link
                    href={`/sprint/${s.id}`}
                    className="inline-flex items-center gap-2 text-text-primary hover:text-accent transition-colors"
                    title={`Open ${s.name}`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${tone}`}
                      strokeWidth={1.5}
                    />
                    <span>{s.name}</span>
                    {isActive && (
                      <span className="ml-1 inline-flex items-center text-[9px] uppercase tracking-widest text-accent">
                        viewing
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-2 py-2 text-right text-text-secondary">{total}</td>
                <td className="px-2 py-2 text-right text-emerald-300">{closed}</td>
                <td className={`px-2 py-2 text-right ${open > 0 ? 'text-rose-300' : 'text-text-muted'}`}>
                  {open}
                </td>
                <td className="px-2 py-2 text-right text-text-primary">
                  {completionPct.toFixed(0)}%
                </td>
                <td className="px-2 py-2 text-right text-text-secondary">
                  {s.spCompleted ?? 0}
                </td>
                <td className="px-2 py-2 text-right text-text-muted">
                  {s.spTotal ?? 0}
                </td>
                <td className="px-2 py-2">
                  <span className="block h-1.5 rounded-sm bg-base-700 overflow-hidden">
                    <span
                      className="block h-full rounded-sm bg-accent"
                      style={{ width: `${completionPct}%` }}
                    />
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
