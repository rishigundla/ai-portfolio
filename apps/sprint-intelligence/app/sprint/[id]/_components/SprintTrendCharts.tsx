import type { SprintSummary } from '@/lib/sprints'

interface SprintTrendChartsProps {
  sprints: SprintSummary[]
}

const COLOR_CLOSED = 'var(--chart-emerald)'
const COLOR_OPEN = 'var(--chart-rose)'
const COLOR_SP_DONE = 'var(--chart-blue)'
const COLOR_SP_REMAIN = 'var(--chart-amber)'

export function SprintTrendCharts({ sprints }: SprintTrendChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ClosedPerSprintChart sprints={sprints} />
      <StoryPointsPerSprintChart sprints={sprints} />
    </div>
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
          const title = `${s.name}: ${closed} closed / ${open} open (${total} total)`
          return (
            <div
              key={s.id}
              className="flex flex-col items-center h-full"
              title={title}
            >
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
                    title={`Closed: ${closed}`}
                  />
                  <div
                    className="w-full"
                    style={{
                      height: `${(1 - closedShare) * 100}%`,
                      backgroundColor: COLOR_OPEN,
                      opacity: 0.85,
                    }}
                    title={`Open: ${open}`}
                  />
                </div>
              </div>
              <span className="text-[10px] font-mono text-text-muted mt-1.5">
                {s.id.slice(0, 3)}
              </span>
            </div>
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
          const title = `${s.name}: ${done} completed SP / ${remaining} remaining SP (${total} total)`
          return (
            <div
              key={s.id}
              className="flex flex-col items-center h-full"
              title={title}
            >
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
                    title={`Completed SP: ${done}`}
                  />
                  <div
                    className="w-full"
                    style={{
                      height: `${(1 - doneShare) * 100}%`,
                      backgroundColor: COLOR_SP_REMAIN,
                      opacity: 0.85,
                    }}
                    title={`Remaining SP: ${remaining}`}
                  />
                </div>
              </div>
              <span className="text-[10px] font-mono text-text-muted mt-1.5">
                {s.id.slice(0, 3)}
              </span>
            </div>
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
