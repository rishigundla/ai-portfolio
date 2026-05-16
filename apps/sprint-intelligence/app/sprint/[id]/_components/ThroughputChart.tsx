import type { ThroughputSummary } from '@/lib/kpi-calc'

interface ThroughputChartProps {
  summary: ThroughputSummary
  accentHex: string
}

export function ThroughputChart({ summary, accentHex }: ThroughputChartProps) {
  const max = Math.max(summary.weekOne, summary.weekTwo, summary.priorAverage, 1)

  const deltaLabel = `${summary.deltaPct >= 0 ? '+' : ''}${summary.deltaPct.toFixed(0)}%`
  const deltaColor = summary.deltaPct >= 0 ? '#34d399' : '#fb7185'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-display text-3xl font-bold text-text-primary">
            {summary.total}
          </p>
          <p className="text-[11px] font-mono text-text-muted">
            tickets closed
          </p>
        </div>
        <div className="text-right">
          <p
            className="font-mono text-sm font-semibold"
            style={{ color: deltaColor }}
          >
            {deltaLabel}
          </p>
          <p className="text-[10px] font-mono text-text-muted">vs prior average</p>
        </div>
      </div>
      <div className="flex items-end gap-3 h-24 pt-2">
        <Bar
          label="Week 1"
          value={summary.weekOne}
          max={max}
          color={accentHex}
        />
        <Bar
          label="Week 2"
          value={summary.weekTwo}
          max={max}
          color={accentHex}
        />
        <Bar
          label="Prior avg"
          value={summary.priorAverage}
          max={max}
          color="#94a3b8"
          muted
        />
      </div>
    </div>
  )
}

function Bar({
  label,
  value,
  max,
  color,
  muted,
}: {
  label: string
  value: number
  max: number
  color: string
  muted?: boolean
}) {
  const heightPct = (value / max) * 100
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <div className="w-full flex flex-col-reverse h-full">
        <div
          className="w-full rounded-sm"
          style={{
            height: `${heightPct}%`,
            backgroundColor: color,
            opacity: muted ? 0.5 : 0.9,
          }}
        />
      </div>
      <p
        className="text-[10px] font-mono"
        style={{ color: muted ? '#94a3b8' : color }}
      >
        {value}
      </p>
      <p className="text-[9px] font-mono text-text-muted">{label}</p>
    </div>
  )
}
