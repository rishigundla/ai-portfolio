import type { CycleTimePoint, CycleTimeSummary } from '@/lib/kpi-calc'

interface CycleTimeChartProps {
  points: CycleTimePoint[]
  summary: CycleTimeSummary
  accentHex: string
}

export function CycleTimeChart({ points, summary, accentHex }: CycleTimeChartProps) {
  if (points.length === 0) return null

  const width = 320
  const height = 180
  const padX = 30
  const padY = 18
  const innerW = width - padX * 2
  const innerH = height - padY * 2

  const filled = points.filter((p): p is CycleTimePoint & { value: number } => p.value !== null)
  const max = Math.max(
    summary.baseline,
    ...points.map((p) => p.value ?? 0),
  )
  const maxScale = Math.ceil(max * 1.1)
  const lastDay = points.length

  const toX = (day: number) =>
    padX + ((day - 1) / Math.max(1, lastDay - 1)) * innerW
  const toY = (value: number) =>
    padY + innerH - (value / Math.max(1, maxScale)) * innerH

  const linePath = filled
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.day)} ${toY(p.value)}`)
    .join(' ')

  const baselineY = toY(summary.baseline)

  const trendColor =
    summary.trend === 'improving'
      ? 'var(--chart-emerald)'
      : summary.trend === 'rising'
        ? 'var(--chart-rose)'
        : 'var(--chart-slate)'

  const trendLabel =
    summary.trend === 'improving'
      ? 'Improving'
      : summary.trend === 'rising'
        ? 'Rising'
        : 'Flat'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-3 text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-4"
              style={{ backgroundColor: accentHex }}
            />
            Daily average
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-px w-4 border-t border-dashed border-text-muted" />
            Baseline {summary.baseline}d
          </span>
        </div>
        <span
          style={{ color: trendColor }}
          className="font-semibold uppercase tracking-widest"
        >
          {trendLabel}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <line
          x1={padX}
          y1={padY + innerH}
          x2={padX + innerW}
          y2={padY + innerH}
          stroke="var(--color-surface-border)"
          strokeWidth="1"
        />
        <line
          x1={padX}
          y1={padY}
          x2={padX}
          y2={padY + innerH}
          stroke="var(--color-surface-border)"
          strokeWidth="1"
        />
        <line
          x1={padX}
          y1={baselineY}
          x2={padX + innerW}
          y2={baselineY}
          stroke="var(--chart-slate)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={accentHex}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {filled.map((p) => (
          <circle
            key={`ct-${p.day}`}
            cx={toX(p.day)}
            cy={toY(p.value)}
            r="2.2"
            fill={accentHex}
          />
        ))}
        <text
          x={padX}
          y={height - 4}
          fontSize="9"
          fill="var(--color-text-muted)"
          fontFamily="JetBrains Mono"
        >
          Day 1
        </text>
        <text
          x={padX + innerW - 32}
          y={height - 4}
          fontSize="9"
          fill="var(--color-text-muted)"
          fontFamily="JetBrains Mono"
        >
          Day {lastDay}
        </text>
        <text
          x={padX - 24}
          y={padY + 4}
          fontSize="9"
          fill="var(--color-text-muted)"
          fontFamily="JetBrains Mono"
        >
          {maxScale}d
        </text>
        <text
          x={padX - 12}
          y={padY + innerH + 4}
          fontSize="9"
          fill="var(--color-text-muted)"
          fontFamily="JetBrains Mono"
        >
          0
        </text>
      </svg>
      {summary.latest !== null && summary.earliest !== null && (
        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-surface-border">
          <span>Day one</span>
          <span className="text-text-secondary font-semibold">
            {summary.earliest.toFixed(1)}d
          </span>
          <span className="text-text-dim">→</span>
          <span>Latest</span>
          <span className="text-text-secondary font-semibold">
            {summary.latest.toFixed(1)}d
          </span>
        </div>
      )}
    </div>
  )
}
