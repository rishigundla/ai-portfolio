'use client'

import * as React from 'react'
import { AlertOctagon, CircleSlash, X } from 'lucide-react'
import type { BlockedSummary } from '@/lib/kpi-calc'
import type { TeamMember } from '@/lib/sprints'

interface BlockedCardProps {
  summary: BlockedSummary
  team: TeamMember[]
}

export function BlockedCard({ summary, team }: BlockedCardProps) {
  const [open, setOpen] = React.useState(false)

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
    <>
      <div className="flex flex-col gap-3 h-full">
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
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-surface-border bg-base-800/40 px-3 py-2 text-[11px] font-mono text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
        >
          View blocker history
        </button>
      </div>
      {open && (
        <BlockerHistoryDialog
          summary={summary}
          team={team}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

interface BlockerHistoryDialogProps {
  summary: BlockedSummary
  team: TeamMember[]
  onClose: () => void
}

function BlockerHistoryDialog({ summary, team, onClose }: BlockerHistoryDialogProps) {
  // Lock body scroll while the dialog is open and close on Escape.
  React.useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const lookupName = (id: string) =>
    team.find((m) => m.id === id)?.name ?? id

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blocker-history-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-base-900/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] sm:max-h-[80vh] overflow-hidden rounded-t-xl sm:rounded-xl border border-surface-border bg-surface-elevated shadow-2xl flex flex-col"
      >
        <header className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-surface-border">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">
              Blocker history
            </p>
            <h2
              id="blocker-history-title"
              className="font-display text-lg font-semibold text-text-primary"
            >
              {summary.count} ticket{summary.count === 1 ? '' : 's'} blocked,{' '}
              {summary.totalStoryPoints} story points held
            </h2>
            <p className="text-[11px] text-text-muted mt-1">
              Oldest age {summary.oldestDaysBlocked} day
              {summary.oldestDaysBlocked === 1 ? '' : 's'}. Notes are recorded at
              the point each block was reported.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-base-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <ul className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          {summary.tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-lg border border-surface-border bg-base-800/40 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-widest text-rose-300">
                  {ticket.id} · {ticket.priority} · {ticket.estimate} SP
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  Assigned {lookupName(ticket.assignee)}
                </span>
              </div>
              <p className="font-display text-sm font-semibold text-text-primary">
                {ticket.title}
              </p>
              {ticket.blockerNote ? (
                <p className="text-[12px] text-text-secondary leading-relaxed border-l-2 border-rose-300/50 pl-3">
                  {ticket.blockerNote}.
                </p>
              ) : (
                <p className="text-[11px] text-text-muted italic">
                  No blocker note recorded.
                </p>
              )}
              {ticket.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ticket.labels.map((label) => (
                    <span
                      key={label}
                      className="inline-block text-[9px] font-mono uppercase tracking-widest text-text-muted bg-base-700/60 px-1.5 py-0.5 rounded-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
