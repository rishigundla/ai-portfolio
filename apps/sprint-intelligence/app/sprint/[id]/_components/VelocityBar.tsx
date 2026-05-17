import type { VelocityComparison } from '@/lib/kpi-calc'

interface VelocityBarProps {
  velocity: VelocityComparison
  accentHex: string
}

export function VelocityBar({ velocity, accentHex }: VelocityBarProps) {
  const max = Math.max(velocity.current, velocity.baseline, velocity.capacity, 1)
  const currentPct = (velocity.current / max) * 100
  const baselinePct = (velocity.baseline / max) * 100

  const deltaLabel = `${velocity.deltaPct >= 0 ? '+' : ''}${velocity.deltaPct.toFixed(1)}%`
  const deltaColor = velocity.beat ? 'var(--chart-emerald)' : 'var(--chart-rose)'

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-3">
        <Row
          label="This sprint"
          value={`${velocity.current} SP`}
          pct={currentPct}
          color={accentHex}
        />
        <Row
          label="Four sprint baseline"
          value={`${velocity.baseline} SP`}
          pct={baselinePct}
          color="var(--chart-slate)"
        />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-surface-border text-[11px] font-mono">
        <span className="text-text-muted">Delta versus baseline</span>
        <span style={{ color: deltaColor }} className="font-semibold">
          {deltaLabel}
        </span>
        <span className="text-text-muted ml-auto">
          Capacity {velocity.capacity} SP
        </span>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  pct,
  color,
}: {
  label: string
  value: string
  pct: number
  color: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-[11px] font-mono text-text-muted">
        <span>{label}</span>
        <span className="text-text-secondary font-semibold">{value}</span>
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
