import type { SprintSummary } from '@/lib/sprints'

interface SprintTrendChartsProps {
  sprints: SprintSummary[]
}

const COLOR_CLOSED = '#34d399'
const COLOR_OPEN = '#fb7185'
const COLOR_SP_DONE = '#60a5fa'
const COLOR_SP_REMAIN = '#fbbf24'

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
      <div className="grid grid-cols-6 gap-3 items-end h-40">
        {sprints.map((s) => {
          const total = s.ticketCount
          const closed = s.closedCount ?? 0
          const open = (s.openCount ?? Math.max(0, total - closed))
          const totalHeightPct = (total / max) * 100
          const closedShare = total > 0 ? closed / total : 0
          return (
            <div key={s.id} className="flex flex-col items-center gap-1.5">
              <div className="flex-1 w-full flex items-end justify-center">
                <div
                  className="w-9 rounded-t-sm overflow-hidden flex flex-col-reverse"
                  style={{ height: `${totalHeightPct}%` }}
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
              <span className="text-[10px] font-mono text-text-muted">
                {s.id.slice(0, 3)}
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {closed}/{total}
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
      <div className="grid grid-cols-6 gap-3 items-end h-40">
        {sprints.map((s) => {
          const total = s.spTotal ?? 0
          const done = s.spCompleted ?? 0
          const totalHeightPct = (total / max) * 100
          const doneShare = total > 0 ? done / total : 0
          return (
            <div key={s.id} className="flex flex-col items-center gap-1.5">
              <div className="flex-1 w-full flex items-end justify-center">
                <div
                  className="w-9 rounded-t-sm overflow-hidden flex flex-col-reverse"
                  style={{ height: `${totalHeightPct}%` }}
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
              <span className="text-[10px] font-mono text-text-muted">
                {s.id.slice(0, 3)}
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {done}/{total}
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
