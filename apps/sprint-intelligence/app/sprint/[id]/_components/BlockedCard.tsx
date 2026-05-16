import { AlertOctagon, CircleSlash } from 'lucide-react'
import type { BlockedSummary } from '@/lib/kpi-calc'

interface BlockedCardProps {
  summary: BlockedSummary
}

export function BlockedCard({ summary }: BlockedCardProps) {
  if (summary.count === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-status-completed">
          <CircleSlash className="h-3.5 w-3.5" />
          All clear
        </div>
        <p className="font-display text-3xl font-bold text-status-completed">0</p>
        <p className="text-[11px] text-text-muted leading-relaxed">
          No blockers this sprint. The team moved without external waits.
        </p>
      </div>
    )
  }

  const tone = summary.oldestDaysBlocked >= 5 ? 'severe' : 'mild'
  const accent = tone === 'severe' ? '#fb7185' : '#fbbf24'

  return (
    <div className="flex flex-col gap-3">
      <div
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest"
        style={{ color: accent }}
      >
        <AlertOctagon className="h-3.5 w-3.5" />
        {tone === 'severe' ? 'Stalled' : 'Watch'}
      </div>
      <div className="flex items-baseline gap-3">
        <p
          className="font-display text-3xl font-bold"
          style={{ color: accent }}
        >
          {summary.count}
        </p>
        <span className="text-[11px] font-mono text-text-muted">
          ticket{summary.count === 1 ? '' : 's'}
        </span>
      </div>
      <div className="space-y-1.5 text-[11px] font-mono text-text-muted">
        <div className="flex items-center justify-between">
          <span>Total story points</span>
          <span className="text-text-secondary font-semibold">
            {summary.totalStoryPoints} SP
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Oldest age</span>
          <span className="text-text-secondary font-semibold">
            {summary.oldestDaysBlocked} day{summary.oldestDaysBlocked === 1 ? '' : 's'}
          </span>
        </div>
      </div>
      {summary.topBlockerNote && (
        <p className="text-[11px] text-text-secondary leading-relaxed pt-2 border-t border-surface-border">
          {summary.topBlockerNote}.
        </p>
      )}
    </div>
  )
}
