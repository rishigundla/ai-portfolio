import type { ThroughputSummary } from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

interface ThroughputChartProps {
  summary: ThroughputSummary
  accentHex: string
}

export function ThroughputChart({ summary, accentHex }: ThroughputChartProps) {
  const max = Math.max(summary.weekOne, summary.weekTwo, summary.priorAverage, 1)
  const deltaLabel = `${summary.deltaPct >= 0 ? '+' : ''}${summary.deltaPct.toFixed(0)}%`
  const deltaColor = summary.deltaPct >= 0 ? 'var(--chart-emerald)' : 'var(--chart-rose)'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-mono text-text-muted">
          <span className="font-display text-2xl font-bold text-text-primary mr-1.5">
            {summary.total}
          </span>
          tickets closed
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
      <TooltipProvider delayDuration={120} skipDelayDuration={60}>
        <div className="flex items-end gap-4 h-40 pt-2 border-b border-surface-border/40 pb-1">
          <Bar
            label="Week 1"
            value={summary.weekOne}
            max={max}
            color={accentHex}
            tooltipBody={`${summary.weekOne} tickets closed`}
          />
          <Bar
            label="Week 2"
            value={summary.weekTwo}
            max={max}
            color={accentHex}
            tooltipBody={`${summary.weekTwo} tickets closed`}
          />
          <Bar
            label="Prior avg"
            value={summary.priorAverage}
            max={max}
            color="var(--chart-slate)"
            muted
            tooltipBody={`Trailing four-sprint average · ${summary.priorAverage} tickets per week`}
          />
        </div>
      </TooltipProvider>
      <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: accentHex }}
          />
          This sprint
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: 'var(--chart-slate)', opacity: 0.6 }}
          />
          Prior average
        </span>
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
  tooltipBody,
}: {
  label: string
  value: number
  max: number
  color: string
  muted?: boolean
  tooltipBody?: string
}) {
  const heightPct = (value / max) * 100
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex-1 flex flex-col items-center h-full cursor-default">
          <p
            className="font-display text-2xl font-bold mb-1"
            style={{ color: muted ? 'var(--chart-slate)' : color, opacity: muted ? 0.85 : 1 }}
          >
            {value}
          </p>
          <div className="flex-1 w-full flex items-end justify-center">
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${heightPct}%`,
                minHeight: '6px',
                backgroundColor: color,
                opacity: muted ? 0.5 : 0.9,
              }}
            />
          </div>
          <p className="text-[10px] font-mono text-text-muted mt-1.5">{label}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>
        <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-text-primary font-mono font-semibold">{value}</span>
          {tooltipBody && (
            <span className="text-text-secondary">· {tooltipBody}</span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
