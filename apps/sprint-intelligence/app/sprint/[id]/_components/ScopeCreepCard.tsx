import type { ScopeCreepSummary } from '@/lib/kpi-calc'

interface ScopeCreepCardProps {
  summary: ScopeCreepSummary
  accentHex: string
}

export function ScopeCreepCard({ summary, accentHex }: ScopeCreepCardProps) {
  const tone = summary.creepPct >= 20 ? 'severe' : summary.creepPct > 0 ? 'mild' : 'clean'
  const toneColor =
    tone === 'severe' ? '#fb7185' : tone === 'mild' ? '#fbbf24' : '#34d399'
  const toneLabel =
    tone === 'severe' ? 'Scope creep' : tone === 'mild' ? 'Watch' : 'On plan'

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
          {summary.creepPct.toFixed(0)}%
        </span>
      </div>
      <div className="space-y-2">
        <Row label="Planned" value={summary.planned} color="#94a3b8" max={summary.final} />
        <Row label="Final" value={summary.final} color={accentHex} max={summary.final} />
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-surface-border">
        <span>Tickets added</span>
        <span className="text-text-secondary font-semibold">
          {summary.added > 0 ? `+${summary.added}` : '0'}
        </span>
        <span className="text-text-dim">·</span>
        <span>Mid sprint</span>
        <span className="text-text-secondary font-semibold">
          {summary.midSprintAdditions}
        </span>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = (value / Math.max(1, max)) * 100
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-[11px] font-mono text-text-muted">
        <span>{label}</span>
        <span className="text-text-secondary font-semibold">{value} tickets</span>
      </div>
      <div className="h-2.5 rounded-sm bg-base-700 overflow-hidden">
        <div
          className="h-full rounded-sm"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.9 }}
        />
      </div>
    </div>
  )
}
