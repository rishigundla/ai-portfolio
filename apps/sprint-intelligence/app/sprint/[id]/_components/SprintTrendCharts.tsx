import type { SprintSummary } from '@/lib/sprints'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

interface SprintTrendChartsProps {
  sprints: SprintSummary[]
}

const COLOR_CLOSED = 'var(--chart-emerald)'
const COLOR_OPEN = 'var(--chart-rose)'
const COLOR_SP_DONE = 'var(--chart-blue)'
const COLOR_SP_REMAIN = 'var(--chart-amber)'

export function SprintTrendCharts({ sprints }: SprintTrendChartsProps) {
  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={60}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClosedPerSprintChart sprints={sprints} />
        <StoryPointsPerSprintChart sprints={sprints} />
      </div>
    </TooltipProvider>
  )
}

function ClosedPerSprintChart({ sprints }: { sprints: SprintSummary[] }) {
  const max = Math.max(...sprints.map((s) => s.ticketCount), 1)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-text-primary">
          Tickets closed per sprint
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
          <Legend color={COLOR_CLOSED} label="Closed" />
          <Legend color={COLOR_OPEN} label="Open" />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3 h-56">
        {sprints.map((s) => {
          const total = s.ticketCount
          const closed = s.closedCount ?? 0
          const open = s.openCount ?? Math.max(0, total - closed)
          const totalHeightPct = (total / max) * 100
          const closedShare = total > 0 ? closed / total : 0
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center h-full cursor-default">
                  <div className="flex items-baseline gap-1.5 mb-1 font-mono text-[11px]">
                    <span
                      className="font-display text-sm font-bold"
                      style={{ color: COLOR_CLOSED }}
                    >
                      {closed}
                    </span>
                    <span className="text-text-dim">/</span>
                    <span
                      className="font-display text-sm font-bold"
                      style={{ color: COLOR_OPEN }}
                    >
                      {open}
                    </span>
                  </div>
                  <div className="flex-1 w-full flex items-end justify-center">
                    <div
                      className="w-9 rounded-t-sm overflow-hidden flex flex-col-reverse"
                      style={{ height: `${totalHeightPct}%`, minHeight: '4px' }}
                    >
                      <div
                        className="w-full"
                        style={{
                          height: `${closedShare * 100}%`,
                          backgroundColor: COLOR_CLOSED,
                        }}
                      />
                      <div
                        className="w-full"
                        style={{
                          height: `${(1 - closedShare) * 100}%`,
                          backgroundColor: COLOR_OPEN,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted mt-1.5">
                    {s.id.slice(0, 3)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                  {s.name}
                </div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLOR_CLOSED }}
                  />
                  <span className="text-text-secondary">Closed</span>
                  <span className="text-text-primary font-mono font-semibold">{closed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLOR_OPEN }}
                  />
                  <span className="text-text-secondary">Open</span>
                  <span className="text-text-primary font-mono font-semibold">{open}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

function StoryPointsPerSprintChart({ sprints }: { sprints: SprintSummary[] }) {
  const max = Math.max(...sprints.map((s) => s.spTotal ?? 0), 1)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-text-primary">
          Story points per sprint
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
          <Legend color={COLOR_SP_DONE} label="Completed" />
          <Legend color={COLOR_SP_REMAIN} label="Remaining" />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3 h-56">
        {sprints.map((s) => {
          const total = s.spTotal ?? 0
          const done = s.spCompleted ?? 0
          const remaining = total - done
          const totalHeightPct = (total / max) * 100
          const doneShare = total > 0 ? done / total : 0
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center h-full cursor-default">
                  <div className="flex items-baseline gap-1.5 mb-1 font-mono text-[11px]">
                    <span
                      className="font-display text-sm font-bold"
                      style={{ color: COLOR_SP_DONE }}
                    >
                      {done}
                    </span>
                    <span className="text-text-dim">/</span>
                    <span
                      className="font-display text-sm font-bold"
                      style={{ color: COLOR_SP_REMAIN }}
                    >
                      {remaining}
                    </span>
                  </div>
                  <div className="flex-1 w-full flex items-end justify-center">
                    <div
                      className="w-9 rounded-t-sm overflow-hidden flex flex-col-reverse"
                      style={{ height: `${totalHeightPct}%`, minHeight: '4px' }}
                    >
                      <div
                        className="w-full"
                        style={{
                          height: `${doneShare * 100}%`,
                          backgroundColor: COLOR_SP_DONE,
                        }}
                      />
                      <div
                        className="w-full"
                        style={{
                          height: `${(1 - doneShare) * 100}%`,
                          backgroundColor: COLOR_SP_REMAIN,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted mt-1.5">
                    {s.id.slice(0, 3)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                  {s.name}
                </div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLOR_SP_DONE }}
                  />
                  <span className="text-text-secondary">Completed SP</span>
                  <span className="text-text-primary font-mono font-semibold">{done}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLOR_SP_REMAIN }}
                  />
                  <span className="text-text-secondary">Remaining SP</span>
                  <span className="text-text-primary font-mono font-semibold">{remaining}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
