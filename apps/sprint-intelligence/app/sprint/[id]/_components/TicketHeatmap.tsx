import type { TicketTimeline } from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'

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
    <TooltipProvider delayDuration={120} skipDelayDuration={60}>
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
            const statusLabel = STATUS_LABEL[entry.status] ?? entry.status
            const rowMeta =
              entry.spanDays > 0
                ? `${entry.spanDays} active day${entry.spanDays === 1 ? '' : 's'} · ${statusLabel}`
                : `Not started · ${statusLabel}`
            return (
              <div
                key={entry.ticketId}
                className="grid gap-0.5 mb-0.5"
                style={{
                  gridTemplateColumns: `7rem repeat(${sprintLength}, minmax(0, 1fr))`,
                }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-[10px] font-mono text-accent truncate self-center cursor-default">
                      {entry.ticketId}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>
                    <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                      {entry.ticketId}
                    </div>
                    <div className="text-text-primary text-xs">{entry.title}</div>
                    <div className="text-text-secondary text-[11px] mt-0.5">{rowMeta}</div>
                  </TooltipContent>
                </Tooltip>
                {Array.from({ length: sprintLength }, (_, i) => i + 1).map((d) => {
                  const isActive = activeSet.has(d)
                  const cell = (
                    <div
                      className="h-4 rounded-sm w-full"
                      style={{
                        backgroundColor: isActive ? fill : 'var(--heatmap-empty)',
                        opacity: isActive ? 0.85 : 1,
                      }}
                    />
                  )
                  if (!isActive) {
                    return <div key={d}>{cell}</div>
                  }
                  return (
                    <Tooltip key={d}>
                      <TooltipTrigger asChild>{cell}</TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                          {entry.ticketId} · Day {d}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-sm shrink-0"
                            style={{ backgroundColor: fill }}
                          />
                          <span className="text-text-primary text-xs">{statusLabel}</span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
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
    </TooltipProvider>
  )
}
