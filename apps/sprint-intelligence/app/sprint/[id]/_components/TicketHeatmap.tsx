import type { TicketTimeline } from '@/lib/kpi-calc'

interface TicketHeatmapProps {
  timelines: TicketTimeline[]
  sprintLength: number
}

const STATUS_FILL: Record<string, string> = {
  done: 'var(--chart-emerald)',
  'in-review': 'var(--chart-violet)',
  'in-progress': 'var(--chart-amber)',
  blocked: 'var(--chart-rose)',
  todo: 'var(--chart-slate)',
}

const STATUS_LABEL: Record<string, string> = {
  done: 'Done',
  'in-review': 'In review',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  todo: 'To do',
}

export function TicketHeatmap({ timelines, sprintLength }: TicketHeatmapProps) {
  const top = timelines.slice(0, 12)
  if (top.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No tickets to chart for the current filter.
      </p>
    )
  }

  // Day axis marks every 5 days plus the first and last day.
  const axisMarks: number[] = []
  for (let d = 1; d <= sprintLength; d += 1) {
    if (d === 1 || d === sprintLength || d % 5 === 0) axisMarks.push(d)
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="min-w-[36rem]">
        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted mb-2 flex-wrap">
          {(['done', 'in-progress', 'in-review', 'blocked', 'todo'] as const).map(
            (s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: STATUS_FILL[s] }}
                />
                {STATUS_LABEL[s]}
              </span>
            ),
          )}
        </div>

        <div
          className="grid gap-0.5 mb-1"
          style={{
            gridTemplateColumns: `7rem repeat(${sprintLength}, minmax(0, 1fr))`,
          }}
        >
          <span className="text-[9px] font-mono text-text-muted">Ticket</span>
          {Array.from({ length: sprintLength }, (_, i) => i + 1).map((d) => (
            <span
              key={d}
              className="text-[9px] font-mono text-text-muted text-center"
              style={{ visibility: axisMarks.includes(d) ? 'visible' : 'hidden' }}
            >
              {d}
            </span>
          ))}
        </div>

        {top.map((entry) => {
          const activeSet = new Set(entry.activeDays)
          const fill = STATUS_FILL[entry.status] ?? 'var(--chart-slate)'
          const rowTitle =
            entry.spanDays > 0
              ? `${entry.ticketId} · ${entry.title} · ${entry.spanDays} active day${entry.spanDays === 1 ? '' : 's'} (${STATUS_LABEL[entry.status] ?? entry.status})`
              : `${entry.ticketId} · ${entry.title} · not started (${STATUS_LABEL[entry.status] ?? entry.status})`
          return (
            <div
              key={entry.ticketId}
              className="grid gap-0.5 mb-0.5"
              style={{
                gridTemplateColumns: `7rem repeat(${sprintLength}, minmax(0, 1fr))`,
              }}
              title={rowTitle}
            >
              <span className="text-[10px] font-mono text-accent truncate self-center">
                {entry.ticketId}
              </span>
              {Array.from({ length: sprintLength }, (_, i) => i + 1).map((d) => {
                const isActive = activeSet.has(d)
                return (
                  <div
                    key={d}
                    className="h-4 rounded-sm"
                    style={{
                      backgroundColor: isActive ? fill : 'var(--heatmap-empty)',
                      opacity: isActive ? 0.85 : 1,
                    }}
                    title={
                      isActive
                        ? `${entry.ticketId} · day ${d} · ${STATUS_LABEL[entry.status] ?? entry.status}`
                        : undefined
                    }
                  />
                )
              })}
            </div>
          )
        })}

        {timelines.length > top.length && (
          <p className="text-[10px] font-mono text-text-muted mt-3">
            Showing top {top.length} of {timelines.length} tickets by active span.
          </p>
        )}
      </div>
    </div>
  )
}
