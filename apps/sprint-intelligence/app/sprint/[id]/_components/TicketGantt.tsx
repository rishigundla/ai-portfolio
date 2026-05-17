import type { TicketTimeline } from '@/lib/kpi-calc'

interface TicketGanttProps {
  timelines: TicketTimeline[]
  sprintLength: number
}

const STATUS_FILL: Record<string, string> = {
  done: '#34d399',
  'in-review': '#a78bfa',
  'in-progress': '#fbbf24',
  blocked: '#fb7185',
  todo: '#475569',
}

const STATUS_LABEL: Record<string, string> = {
  done: 'Done',
  'in-review': 'In review',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  todo: 'Planned',
}

export function TicketGantt({ timelines, sprintLength }: TicketGanttProps) {
  const top = timelines.slice(0, 12)
  if (top.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No tickets to chart for the current filter.
      </p>
    )
  }

  // Day axis marks every 5 days plus first and last
  const axisMarks: number[] = []
  for (let d = 1; d <= sprintLength; d += 1) {
    if (d === 1 || d === sprintLength || d % 5 === 0) axisMarks.push(d)
  }

  return (
    <div className="flex flex-col gap-2">
      {top.map((entry) => {
        const fill = STATUS_FILL[entry.status] ?? '#475569'
        const hasRuns = entry.runs.length > 0
        const rowTitle = hasRuns
          ? `${entry.ticketId} · ${entry.title} · ${entry.spanDays} active day${entry.spanDays === 1 ? '' : 's'} across ${entry.runs.length} run${entry.runs.length === 1 ? '' : 's'} (${STATUS_LABEL[entry.status] ?? entry.status})`
          : `${entry.ticketId} · ${entry.title} · planned days ${entry.plannedStartDay}–${entry.plannedEndDay} (${STATUS_LABEL[entry.status] ?? entry.status})`
        return (
          <div
            key={entry.ticketId}
            className="grid grid-cols-[7rem_1fr] gap-3 items-center"
            title={rowTitle}
          >
            <span className="text-[11px] font-mono text-accent truncate">
              {entry.ticketId}
            </span>
            <div className="relative h-3 rounded-sm bg-base-800/70">
              {hasRuns
                ? entry.runs.map((run, idx) => {
                    const leftPct = ((run.start - 1) / sprintLength) * 100
                    const widthPct = Math.max(
                      1.5,
                      ((run.end - run.start + 1) / sprintLength) * 100,
                    )
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 bottom-0 rounded-sm"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          backgroundColor: fill,
                          opacity: 0.85,
                        }}
                        title={`${entry.ticketId} · day${run.start === run.end ? '' : 's'} ${run.start}${run.start === run.end ? '' : `–${run.end}`} (${STATUS_LABEL[entry.status] ?? entry.status})`}
                      />
                    )
                  })
                : (() => {
                    const leftPct =
                      ((entry.plannedStartDay - 1) / sprintLength) * 100
                    const widthPct = Math.max(
                      2,
                      ((entry.plannedEndDay - entry.plannedStartDay + 1) /
                        sprintLength) *
                        100,
                    )
                    return (
                      <div
                        className="absolute top-0 bottom-0 rounded-sm"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          opacity: 0.35,
                          border: `1px dashed ${fill}`,
                        }}
                      />
                    )
                  })()}
            </div>
          </div>
        )
      })}

      <div className="grid grid-cols-[7rem_1fr] gap-3 mt-1">
        <span />
        <div className="relative h-3">
          {axisMarks.map((d) => (
            <span
              key={d}
              className="absolute -translate-x-1/2 text-[9px] font-mono text-text-muted"
              style={{ left: `${((d - 1) / sprintLength) * 100}%` }}
            >
              {d === sprintLength ? `d${d}` : `d${d}`}
            </span>
          ))}
        </div>
      </div>

      {timelines.length > top.length && (
        <p className="text-[10px] font-mono text-text-muted mt-3">
          Showing top {top.length} of {timelines.length} tickets by active span.
        </p>
      )}
    </div>
  )
}
