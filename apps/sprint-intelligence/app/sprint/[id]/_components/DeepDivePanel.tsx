import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  GaugeCircle,
  ListChecks,
  Users,
} from 'lucide-react'
import type { TeamMember } from '@/lib/sprints'
import type { SprintFixture, TicketSpec } from '@/lib/full-sprints'
import {
  computeCompletionRate,
  computePriorityMix,
  computeReviewLoad,
  computeStatusDistribution,
  computeWorkloadScore,
  type EngineerDeepDive,
  type TicketTimeline,
} from '@/lib/kpi-calc'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rishi/design-system/primitives'
import { TicketHeatmap } from './TicketHeatmap'

const STATUS_TONE_LABEL: Record<string, string> = {
  done: 'Done',
  'in-review': 'In review',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  todo: 'To do',
}

const PRIORITY_NAME: Record<string, string> = {
  P0: 'Critical (P0)',
  P1: 'High (P1)',
  P2: 'Major (P2)',
  P3: 'Minor (P3)',
}

interface DeepDivePanelProps {
  activeAssignee: string
  filteredTickets: TicketSpec[]
  deepDives: EngineerDeepDive[]
  team: TeamMember[]
  totalCapacity: number
  fixture: SprintFixture
  timelines: TicketTimeline[]
  sprintLength: number
  accentHex: string
}

export function DeepDivePanel(props: DeepDivePanelProps) {
  const {
    activeAssignee,
    filteredTickets,
    deepDives,
    team,
    totalCapacity,
    fixture,
    timelines,
    sprintLength,
    accentHex,
  } = props

  const isTeam = activeAssignee === 'all' || activeAssignee === ''
  const single = !isTeam ? deepDives.find((d) => d.engineer.id === activeAssignee) : null

  if (!isTeam && single) {
    return (
      <EngineerView
        deepDive={single}
        timelines={timelines}
        sprintLength={sprintLength}
        accentHex={accentHex}
      />
    )
  }

  return (
    <TeamView
      filteredTickets={filteredTickets}
      team={team}
      totalCapacity={totalCapacity}
      fixture={fixture}
      timelines={timelines}
      sprintLength={sprintLength}
      accentHex={accentHex}
    />
  )
}

// ============================================================
// Single engineer view
// ============================================================

function EngineerView({
  deepDive,
  timelines,
  sprintLength,
  accentHex,
}: {
  deepDive: EngineerDeepDive
  timelines: TicketTimeline[]
  sprintLength: number
  accentHex: string
}) {
  const { engineer, workload, completion, cycle, review, priorityMix, tickets } =
    deepDive

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-5 lg:p-6 flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {engineer.name}
          </h3>
          <p className="text-[11px] font-mono text-text-muted mt-0.5">
            {engineer.role} · capacity {engineer.capacity} SP
          </p>
        </div>
        <div className="text-[10px] font-mono text-text-muted">
          {tickets.length} ticket{tickets.length === 1 ? '' : 's'} assigned
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatTile
          icon={<GaugeCircle className="h-3.5 w-3.5" />}
          label="Workload score"
          tone={
            workload.tone === 'heavy'
              ? 'var(--chart-rose)'
              : workload.tone === 'light'
                ? 'var(--chart-slate)'
                : accentHex
          }
          value={workload.raw.toFixed(1)}
          unit="weighted SP"
          subtitle={`${(workload.index * 100).toFixed(0)}% of capacity · ${workload.label}`}
        />
        <StatTile
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Completion rate"
          tone={
            completion.percent >= 80
              ? 'var(--chart-emerald)'
              : completion.percent >= 50
                ? 'var(--chart-amber)'
                : 'var(--chart-rose)'
          }
          value={`${completion.percent.toFixed(0)}%`}
          unit=""
          subtitle={`${completion.done} of ${completion.total} tickets done`}
        />
        <StatTile
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Cycle time"
          tone={cycle.beatsTeam ? 'var(--chart-emerald)' : 'var(--chart-rose)'}
          value={cycle.personal !== null ? `${cycle.personal.toFixed(1)}d` : '—'}
          unit=""
          subtitle={
            cycle.deltaPct !== null
              ? `Team baseline ${cycle.team.toFixed(1)}d (${cycle.deltaPct >= 0 ? '+' : ''}${cycle.deltaPct.toFixed(0)}%)`
              : `Team baseline ${cycle.team.toFixed(1)}d`
          }
        />
        <StatTile
          icon={
            review.tone === 'bottleneck' ? (
              <AlertOctagon className="h-3.5 w-3.5" />
            ) : (
              <ListChecks className="h-3.5 w-3.5" />
            )
          }
          label="Review queue"
          tone={
            review.tone === 'bottleneck'
              ? 'var(--chart-rose)'
              : review.tone === 'queue'
                ? 'var(--chart-amber)'
                : 'var(--chart-emerald)'
          }
          value={`${review.inReviewCount}`}
          unit="in review"
          subtitle={`${review.label} · ${review.inProgressCount} in progress${review.blockedCount > 0 ? ` · ${review.blockedCount} blocked` : ''}`}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Priority mix
          </p>
          {priorityMix.length === 0 ? (
            <p className="text-[11px] text-text-muted">No tickets to show.</p>
          ) : (
            <TooltipProvider delayDuration={120} skipDelayDuration={60}>
              <ul className="space-y-1.5">
                {priorityMix.map((entry) => {
                  const fill = priorityColor(entry.priority, accentHex)
                  return (
                    <Tooltip key={entry.priority}>
                      <TooltipTrigger asChild>
                        <li className="flex items-center gap-2 text-[11px] font-mono cursor-default">
                          <span className="text-text-primary font-semibold w-7">
                            {entry.priority}
                          </span>
                          <div className="flex-1 h-2 rounded-sm bg-base-700 overflow-hidden">
                            <div
                              className="h-full rounded-sm"
                              style={{
                                width: `${barWidth(entry.count, priorityMix)}%`,
                                backgroundColor: fill,
                                opacity: 0.9,
                              }}
                            />
                          </div>
                          <span className="text-text-secondary">
                            {entry.count} ticket{entry.count === 1 ? '' : 's'}
                          </span>
                          <span className="text-text-muted">{entry.storyPoints} SP</span>
                        </li>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                          {PRIORITY_NAME[entry.priority] ?? entry.priority}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: fill }}
                          />
                          <span className="text-text-secondary">Tickets</span>
                          <span className="text-text-primary font-mono font-semibold">
                            {entry.count} · {entry.storyPoints} SP
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </ul>
            </TooltipProvider>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Assigned tickets
          </p>
          {tickets.length === 0 ? (
            <p className="text-[11px] text-text-muted">
              Nothing on this sprint.
            </p>
          ) : (
            <TooltipProvider delayDuration={120} skipDelayDuration={60}>
              <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {tickets.map((t) => {
                  const fill = statusColor(t.status, accentHex)
                  const statusLabel = STATUS_TONE_LABEL[t.status] ?? t.status
                  return (
                    <Tooltip key={t.id}>
                      <TooltipTrigger asChild>
                        <li
                          className="flex items-center gap-2 text-[11px] font-mono py-1 border-b border-surface-border last:border-b-0 cursor-default"
                        >
                          <span
                            className="inline-flex shrink-0 items-center justify-center h-4 w-4 rounded-sm text-[9px] font-bold"
                            style={{
                              backgroundColor: fill,
                              color: 'var(--color-base-900)',
                              opacity: 0.95,
                            }}
                            aria-label={t.status}
                          >
                            {statusGlyph(t.status)}
                          </span>
                          <span className="text-text-secondary text-[10px] w-12">
                            {t.priority}
                          </span>
                          <span className="text-text-primary truncate flex-1">
                            {t.title}
                          </span>
                          <span className="text-text-muted">{t.estimate} SP</span>
                        </li>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                          {t.id}
                        </div>
                        <div className="text-text-primary text-xs mb-1">{t.title}</div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: fill }}
                          />
                          <span className="text-text-secondary">{statusLabel}</span>
                          <span className="text-text-primary font-mono font-semibold">
                            {t.priority} · {t.estimate} SP
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </ul>
            </TooltipProvider>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Activity heatmap
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            Tickets across rows, sprint days across columns. Filled cells mark days the
            ticket was active.
          </p>
        </div>
        <TicketHeatmap timelines={timelines} sprintLength={sprintLength} />
      </section>

    </div>
  )
}

// ============================================================
// Team aggregate view
// ============================================================

function TeamView({
  filteredTickets,
  team,
  totalCapacity,
  fixture,
  timelines,
  sprintLength,
  accentHex,
}: {
  filteredTickets: TicketSpec[]
  team: TeamMember[]
  totalCapacity: number
  fixture: SprintFixture
  timelines: TicketTimeline[]
  sprintLength: number
  accentHex: string
}) {
  const workload = computeWorkloadScore(filteredTickets, totalCapacity)
  const completion = computeCompletionRate(filteredTickets)
  const review = computeReviewLoad(filteredTickets)
  const priorityMix = computePriorityMix(filteredTickets)
  const statusMix = computeStatusDistribution(filteredTickets)
  const teamCycleBaseline = fixture.cycleTime.teamBaseline
  const filledCycle = fixture.cycleTime.days.filter(
    (d): d is number => typeof d === 'number',
  )
  const latestCycle: number | null =
    filledCycle.length > 0 ? (filledCycle[filledCycle.length - 1] ?? null) : null
  const cycleDelta =
    latestCycle !== null
      ? ((latestCycle - teamCycleBaseline) / teamCycleBaseline) * 100
      : null

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-5 lg:p-6 flex flex-col gap-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight inline-flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" strokeWidth={1.5} />
            Team total
          </h3>
          <p className="text-[11px] font-mono text-text-muted mt-0.5">
            {team.length} engineers · capacity {totalCapacity} SP · pick an
            assignee in the top filter to drill in
          </p>
        </div>
        <div className="text-[10px] font-mono text-text-muted">
          {filteredTickets.length} ticket
          {filteredTickets.length === 1 ? '' : 's'} in scope
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatTile
          icon={<GaugeCircle className="h-3.5 w-3.5" />}
          label="Team workload"
          tone={
            workload.tone === 'heavy'
              ? 'var(--chart-rose)'
              : workload.tone === 'light'
                ? 'var(--chart-slate)'
                : accentHex
          }
          value={workload.raw.toFixed(1)}
          unit="weighted SP"
          subtitle={`${(workload.index * 100).toFixed(0)}% of team capacity · ${workload.label}`}
        />
        <StatTile
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Team completion"
          tone={
            completion.percent >= 80
              ? 'var(--chart-emerald)'
              : completion.percent >= 50
                ? 'var(--chart-amber)'
                : 'var(--chart-rose)'
          }
          value={`${completion.percent.toFixed(0)}%`}
          unit=""
          subtitle={`${completion.done} of ${completion.total} tickets done`}
        />
        <StatTile
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Team cycle time"
          tone={
            latestCycle !== null && latestCycle <= teamCycleBaseline
              ? 'var(--chart-emerald)'
              : 'var(--chart-rose)'
          }
          value={
            latestCycle !== null ? `${latestCycle.toFixed(1)}d` : `${teamCycleBaseline.toFixed(1)}d`
          }
          unit=""
          subtitle={
            cycleDelta !== null
              ? `Team baseline ${teamCycleBaseline.toFixed(1)}d (${cycleDelta >= 0 ? '+' : ''}${cycleDelta.toFixed(0)}%)`
              : `Team baseline ${teamCycleBaseline.toFixed(1)}d`
          }
        />
        <StatTile
          icon={
            review.tone === 'bottleneck' ? (
              <AlertOctagon className="h-3.5 w-3.5" />
            ) : (
              <ListChecks className="h-3.5 w-3.5" />
            )
          }
          label="Review queue"
          tone={
            review.tone === 'bottleneck'
              ? 'var(--chart-rose)'
              : review.tone === 'queue'
                ? 'var(--chart-amber)'
                : 'var(--chart-emerald)'
          }
          value={`${review.inReviewCount}`}
          unit="in review"
          subtitle={`${review.label} · ${review.inProgressCount} in progress${review.blockedCount > 0 ? ` · ${review.blockedCount} blocked` : ''}`}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Priority mix
          </p>
          {priorityMix.length === 0 ? (
            <p className="text-[11px] text-text-muted">No tickets to show.</p>
          ) : (
            <TooltipProvider delayDuration={120} skipDelayDuration={60}>
              <ul className="space-y-1.5">
                {priorityMix.map((entry) => {
                  const fill = priorityColor(entry.priority, accentHex)
                  return (
                    <Tooltip key={entry.priority}>
                      <TooltipTrigger asChild>
                        <li className="flex items-center gap-2 text-[11px] font-mono cursor-default">
                          <span className="text-text-primary font-semibold w-7">
                            {entry.priority}
                          </span>
                          <div className="flex-1 h-2 rounded-sm bg-base-700 overflow-hidden">
                            <div
                              className="h-full rounded-sm"
                              style={{
                                width: `${barWidth(entry.count, priorityMix)}%`,
                                backgroundColor: fill,
                                opacity: 0.9,
                              }}
                            />
                          </div>
                          <span className="text-text-secondary">
                            {entry.count} ticket{entry.count === 1 ? '' : 's'}
                          </span>
                          <span className="text-text-muted">{entry.storyPoints} SP</span>
                        </li>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                          {PRIORITY_NAME[entry.priority] ?? entry.priority}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: fill }}
                          />
                          <span className="text-text-secondary">Tickets</span>
                          <span className="text-text-primary font-mono font-semibold">
                            {entry.count} · {entry.storyPoints} SP
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </ul>
            </TooltipProvider>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Status mix
          </p>
          {statusMix.filter((s) => s.count > 0).length === 0 ? (
            <p className="text-[11px] text-text-muted">No tickets to show.</p>
          ) : (
            <TooltipProvider delayDuration={120} skipDelayDuration={60}>
              <ul className="space-y-1.5">
                {statusMix
                  .filter((s) => s.count > 0)
                  .map((entry) => {
                    const fill = statusColor(entry.status, accentHex)
                    return (
                      <Tooltip key={entry.status}>
                        <TooltipTrigger asChild>
                          <li className="flex items-center gap-2 text-[11px] font-mono cursor-default">
                            <span className="text-text-primary font-semibold w-20">
                              {entry.label}
                            </span>
                            <div className="flex-1 h-2 rounded-sm bg-base-700 overflow-hidden">
                              <div
                                className="h-full rounded-sm"
                                style={{
                                  width: `${barWidth(entry.count, statusMix.filter((s) => s.count > 0))}%`,
                                  backgroundColor: fill,
                                  opacity: 0.9,
                                }}
                              />
                            </div>
                            <span className="text-text-secondary">
                              {entry.count} ticket{entry.count === 1 ? '' : 's'}
                            </span>
                            <span className="text-text-muted">{entry.storyPoints} SP</span>
                          </li>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={6}>
                          <div className="text-text-muted font-mono text-[10px] uppercase tracking-wider mb-1">
                            {entry.label}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: fill }}
                            />
                            <span className="text-text-secondary">Tickets</span>
                            <span className="text-text-primary font-mono font-semibold">
                              {entry.count} · {entry.storyPoints} SP
                            </span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
              </ul>
            </TooltipProvider>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Activity heatmap
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            Top twelve tickets across the team by active span. Sprint days
            across columns, filled cells mark days the ticket was actively
            worked on.
          </p>
        </div>
        <TicketHeatmap timelines={timelines} sprintLength={sprintLength} />
      </section>

    </div>
  )
}

// ============================================================
// Shared helpers
// ============================================================

function StatTile({
  icon,
  label,
  value,
  unit,
  subtitle,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  subtitle: string
  tone: string
}) {
  return (
    <div className="rounded-md border border-surface-border bg-base-800/50 p-3 flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono"
        style={{ color: tone }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-display text-xl font-bold" style={{ color: tone }}>
        {value}
        {unit && (
          <span className="text-[10px] font-mono text-text-muted ml-1.5 font-normal">
            {unit}
          </span>
        )}
      </p>
      <p className="text-[10px] text-text-muted leading-snug">{subtitle}</p>
    </div>
  )
}

function barWidth(count: number, mix: { count: number }[]): number {
  const max = Math.max(1, ...mix.map((m) => m.count))
  return (count / max) * 100
}

function priorityColor(priority: string, accent: string): string {
  if (priority === 'P0') return 'var(--chart-rose)'
  if (priority === 'P1') return 'var(--chart-amber)'
  if (priority === 'P2') return accent
  return 'var(--chart-slate)'
}

function statusColor(status: string, accent: string): string {
  if (status === 'done') return 'var(--chart-emerald)'
  if (status === 'in-review') return accent
  if (status === 'in-progress') return 'var(--chart-amber)'
  if (status === 'blocked') return 'var(--chart-rose)'
  return 'var(--chart-slate)'
}

function statusGlyph(status: string): string {
  if (status === 'done') return '✓'
  if (status === 'in-review') return 'R'
  if (status === 'in-progress') return 'P'
  if (status === 'blocked') return '!'
  return ' '
}
