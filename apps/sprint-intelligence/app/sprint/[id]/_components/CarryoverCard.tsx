import type { CarryoverSummary } from '@/lib/kpi-calc'

interface CarryoverCardProps {
  summary: CarryoverSummary
  accentHex: string
}

export function CarryoverCard({ summary, accentHex }: CarryoverCardProps) {
  const tone =
    summary.carryoverPct >= 25
      ? 'severe'
      : summary.carryoverPct > 10
        ? 'mild'
        : 'clean'
  const toneColor =
    tone === 'severe' ? 'var(--chart-rose)' : tone === 'mild' ? 'var(--chart-amber)' : 'var(--chart-emerald)'
  const toneLabel =
    summary.projected
      ? 'Projected'
      : tone === 'severe'
        ? 'High carryover'
        : tone === 'mild'
          ? 'Some slip'
          : 'On plan'

  const donePct = summary.total > 0 ? (summary.done / summary.total) * 100 : 0
  const carryoverPct = 100 - donePct

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: toneColor }}
        >
          {toneLabel}
        </span>
        <span
          className="font-display text-2xl font-bold"
          style={{ color: toneColor }}
        >
          {summary.carryoverPct.toFixed(0)}%
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-[11px] font-mono text-text-muted">
          <span>Closed</span>
          <span className="text-text-secondary font-semibold">
            {summary.done} of {summary.total} tickets
          </span>
        </div>
        <div className="h-3 rounded-sm bg-base-700 overflow-hidden flex">
          <div
            className="h-full"
            style={{
              width: `${donePct}%`,
              backgroundColor: accentHex,
              opacity: 0.9,
            }}
          />
          <div
            className="h-full"
            style={{
              width: `${carryoverPct}%`,
              backgroundColor: toneColor,
              opacity: 0.5,
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-surface-border">
        <span>Carrying over</span>
        <span className="text-text-secondary font-semibold">
          {summary.carryover} tickets
        </span>
        {summary.blockedInCarryover > 0 && (
          <>
            <span className="text-text-dim">·</span>
            <span>Blocked</span>
            <span className="text-text-secondary font-semibold">
              {summary.blockedInCarryover}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
