import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, CalendarRange, Ticket } from 'lucide-react'
import {
  getSprintSummary,
  getAllSprintIds,
  getColorClasses,
  getSprintStatusIcon,
  getSprintStatusLabel,
  getStatusColorToken,
  formatSprintDateRange,
  sprintDaysElapsed,
  sprints,
  team,
  totalCapacity,
} from '@/lib/sprints'
import { getFullSprint } from '@/lib/full-sprints'
import { getBrief } from '@/lib/briefs'
import {
  applyTicketFilters,
  buildBurndownPoints,
  buildCycleTimePoints,
  buildEngineerDeepDive,
  computeAgingTickets,
  computeAvgDaysInStatus,
  computeBlockedSummary,
  computeCarryoverSummary,
  computeCycleTimeSummary,
  computeEtaSummary,
  computePerTicketCycleTime,
  computePriorityBreakdown,
  computeScopeCreepSummary,
  computeStatusDistribution,
  computeStoryPointsKpis,
  computeThroughputSummary,
  computeTicketTimelines,
  computeTopKpis,
  computeVelocityComparison,
  computeWorkloadByAssignee,
  getSprintLength,
  hasActiveFilter,
} from '@/lib/kpi-calc'
import { BurndownChart } from './_components/BurndownChart'
import { VelocityBar } from './_components/VelocityBar'
import { StatusDonut } from './_components/StatusDonut'
import { BlockedCard } from './_components/BlockedCard'
import { CycleTimeChart } from './_components/CycleTimeChart'
import { ThroughputChart } from './_components/ThroughputChart'
import { ScopeCreepCard } from './_components/ScopeCreepCard'
import { CarryoverCard } from './_components/CarryoverCard'
import { DeepDivePanel } from './_components/DeepDivePanel'
import { KpiCard } from './_components/KpiCard'
import { StreamingBriefPanel } from './_components/StreamingBriefPanel'
import { SprintErrorBoundary } from './_components/SprintErrorBoundary'
import { SprintFilters } from './_components/SprintFilters'
import { TopKpiStrip } from './_components/TopKpiStrip'
import { StoryPointsStrip } from './_components/StoryPointsStrip'
import { AvgDaysInStatusChart } from './_components/AvgDaysInStatusChart'
import { PriorityBreakdownChart } from './_components/PriorityBreakdownChart'
import { EtaCard } from './_components/EtaCard'
import { CycleTimeBars } from './_components/CycleTimeBars'
import { AgingTicketsCard } from './_components/AgingTicketsCard'
import { WorkloadByAssignee } from './_components/WorkloadByAssignee'
import { SprintHistoryTable } from './_components/SprintHistoryTable'
import { SprintTrendCharts } from './_components/SprintTrendCharts'
import { BriefSkeleton } from './_components/skeletons'

const ACCENT_HEX: Record<string, string> = {
  accent: '#2dd4bf',
  purple: '#a78bfa',
  blue: '#60a5fa',
  amber: '#fbbf24',
  rose: '#fb7185',
  teal: '#2dd4bf',
  green: '#34d399',
  slate: '#94a3b8',
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    assignee?: string
    type?: string
    status?: string
    eng?: string
  }>
}

export function generateStaticParams() {
  return getAllSprintIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const summary = getSprintSummary(id)
  if (!summary) {
    return {
      title: 'Sprint not found',
      description: 'The requested sprint does not exist.',
    }
  }
  const title = `${summary.name} · ${getSprintStatusLabel(summary.status)}`
  const description = `${summary.tagline}. Filterable team and individual KPIs across ${summary.ticketCount} tickets and the eight engineer roster, plus a streaming AI authored meeting brief.`
  return {
    title,
    description,
    openGraph: {
      title: `${title} · Sprint Intelligence`,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${title} · Sprint Intelligence`,
      description,
    },
  }
}

export default async function SprintDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const summary = getSprintSummary(id)
  if (!summary) notFound()

  const fixture = getFullSprint(id)
  if (!fixture) notFound()

  const brief = getBrief(id)
  const filters = await searchParams
  const filteredTickets = applyTicketFilters(fixture.tickets, filters)
  const filtered = hasActiveFilter(filters)
  const filteredFixtureForEngineers = { ...fixture, tickets: filteredTickets }
  const deepDives = team.map((member) =>
    buildEngineerDeepDive(filteredFixtureForEngineers, member),
  )

  const colorToken = getStatusColorToken(summary.status)
  const colors = getColorClasses(colorToken)
  const StatusIcon = getSprintStatusIcon(summary.status)
  const dayCount = sprintDaysElapsed(summary.startDate, summary.endDate)
  const accentHex = ACCENT_HEX[colorToken] ?? ACCENT_HEX.accent ?? '#2dd4bf'

  const isPlanned = summary.status === 'planned'
  const topKpis = computeTopKpis(filteredTickets, fixture)
  const spKpis = computeStoryPointsKpis(filteredTickets)
  const avgDays = computeAvgDaysInStatus(filteredTickets)
  const priorityBreakdown = computePriorityBreakdown(filteredTickets)
  const eta = computeEtaSummary(filteredTickets)
  const perTicketCycle = computePerTicketCycleTime(
    filteredTickets,
    fixture.cycleTime.teamBaseline,
  )
  const aging = computeAgingTickets(filteredTickets)
  const workloadRows = computeWorkloadByAssignee(filteredTickets, team)
  const timelines = computeTicketTimelines(filteredTickets, fixture)
  const sprintLength = getSprintLength(fixture)
  const activeAssignee = filters.assignee ?? 'all'

  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href="/sprints"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sprints
      </Link>

      <header className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${colors.cardBorder} ${colors.cardBg}`}
            >
              <StatusIcon className={`h-5 w-5 ${colors.iconColor}`} strokeWidth={1.5} />
            </div>
            <span
              className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
            >
              {getSprintStatusLabel(summary.status)}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Step 2 of 2
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {summary.name}
          </h1>
          <p className="mt-3 text-text-secondary leading-relaxed">
            {fixture.metadata.goal}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" />
              {formatSprintDateRange(summary.startDate, summary.endDate)} ({dayCount} days)
            </span>
            <span className="text-text-dim">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5" />
              {filteredTickets.length}
              {filtered ? ` of ${fixture.tickets.length}` : ''}{' '}
              {isPlanned ? 'backlog' : 'tickets'}
            </span>
            {!isPlanned && (
              <>
                <span className="text-text-dim">·</span>
                <span>
                  Scope {fixture.scopePlanned} planned, {fixture.scopeFinal} final
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <Suspense fallback={<div className="h-12 rounded-xl border border-surface-border bg-surface" />}>
          <SprintFilters team={team} />
        </Suspense>

        <TopKpiStrip kpis={topKpis} filtered={filtered} />
        <StoryPointsStrip kpis={spKpis} />

        <ShellSection
          eyebrow="Status and priority"
          title="Avg time in current status plus priority breakdown"
          description="Average days each ticket has spent in its current status alongside a priority weighted Done versus Remaining stack. Both honor the filter bar above."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <AvgDaysInStatusChart entries={avgDays} />
            <PriorityBreakdownChart entries={priorityBreakdown} />
          </div>
        </ShellSection>

        <ShellSection
          eyebrow="ETA discipline"
          title="Missing ETA and overdue"
          description="Tickets without a committed ETA and tickets where the ETA has passed but the work is not done. Honors the filter bar above."
        >
          <EtaCard summary={eta} />
        </ShellSection>

        {!isPlanned && (
          <ShellSection
            eyebrow="Per ticket signals"
            title="Cycle time and aging tickets"
            description="Per ticket cycle time on the closed tickets (left) and per ticket age on the still open tickets (right). Top eight of each, color graded against the team baseline."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <CycleTimeBars
                entries={perTicketCycle}
                baseline={fixture.cycleTime.teamBaseline}
              />
              <AgingTicketsCard entries={aging} />
            </div>
          </ShellSection>
        )}

        <ShellSection
          eyebrow="Workload"
          title="Workload by assignee"
          description="Completed share of each engineer's ticket allocation. Useful as a sprint allocation preview on the backlog sprint and as a completion progress check on active sprints."
        >
          <WorkloadByAssignee entries={workloadRows} />
        </ShellSection>

        {!isPlanned && (
          <ShellSection
            eyebrow="Sprint health"
            title="Burndown, velocity, scope, and trend"
            description="Eight cards. First row covers headline sprint health (burndown, velocity, status mix, blocked). Second row covers the trend and scope signals (cycle time, throughput, scope creep, carryover). Burndown, velocity, cycle time, throughput, scope creep, and carryover are sprint level signals, not filter aware. Status mix and blocked honor filters."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <KpiCard
                eyebrow="Burndown"
                title="Story points remaining"
                subtitle="Ideal dashed line versus actual solid line."
              >
                <BurndownChart
                  points={buildBurndownPoints(fixture)}
                  accentHex={accentHex}
                  currentDay={fixture.currentDay}
                />
              </KpiCard>
              <KpiCard
                eyebrow="Velocity"
                title="This sprint versus baseline"
                subtitle="Completed SP compared with the trailing four sprint average."
              >
                <VelocityBar
                  velocity={computeVelocityComparison(fixture, totalCapacity)}
                  accentHex={accentHex}
                />
              </KpiCard>
              <KpiCard
                eyebrow="Status mix"
                title="Tickets across the board"
                subtitle="Distribution across done, in review, in progress, to do, and blocked. Honors filters."
              >
                <StatusDonut
                  distribution={computeStatusDistribution(filteredTickets)}
                  accentHex={accentHex}
                />
              </KpiCard>
              <KpiCard
                eyebrow="Blocked"
                title="Tickets and freshest blocker note"
                subtitle="Counts plus story points plus the oldest age. Honors filters."
              >
                <BlockedCard
                  summary={computeBlockedSummary(filteredFixtureForEngineers)}
                  team={team}
                />
              </KpiCard>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 items-start">
              <KpiCard
                eyebrow="Cycle time"
                title="Trend across the sprint"
                subtitle="Rolling average days from start to done. Sprint level signal."
              >
                <CycleTimeChart
                  points={buildCycleTimePoints(fixture)}
                  summary={computeCycleTimeSummary(fixture)}
                  accentHex={accentHex}
                />
              </KpiCard>
              <KpiCard
                eyebrow="Throughput"
                title="Tickets closed per week"
                subtitle="Week one and week two compared with the prior average."
              >
                <ThroughputChart
                  summary={computeThroughputSummary(fixture)}
                  accentHex={accentHex}
                />
              </KpiCard>
              <KpiCard
                eyebrow="Scope creep"
                title="Planned versus final scope"
                subtitle="Mid sprint additions from the addedMidSprint flag."
              >
                <ScopeCreepCard
                  summary={computeScopeCreepSummary(fixture)}
                  accentHex={accentHex}
                />
              </KpiCard>
              <KpiCard
                eyebrow="Carryover"
                title="Tickets carrying into the next sprint"
                subtitle="Closed versus total. In flight sprint marks the number as projected."
              >
                <CarryoverCard
                  summary={computeCarryoverSummary(fixture)}
                  accentHex={accentHex}
                />
              </KpiCard>
            </div>
          </ShellSection>
        )}

        <div id="per-engineer-section">
          <ShellSection
            eyebrow="Per engineer"
            title="Deep dive"
            description="Honors the top filter. Pick a specific engineer in the assignee filter above to see their workload, cycle time, ticket list, and the per-day activity heatmap plus the per-ticket Gantt. With Everyone selected, the panel shows team total numbers."
          >
            <SprintErrorBoundary label="Deep dive unavailable">
              <DeepDivePanel
                activeAssignee={activeAssignee}
                filteredTickets={filteredTickets}
                deepDives={deepDives}
                team={team}
                totalCapacity={totalCapacity}
                fixture={fixture}
                timelines={timelines}
                sprintLength={sprintLength}
                accentHex={accentHex}
              />
            </SprintErrorBoundary>
          </ShellSection>
        </div>

        <ShellSection
          eyebrow="Sprint history"
          title="All six sprints at a glance"
          description="Closed plus open ticket counts, completion percent, and story points per sprint across jan to jun 2026. Click a row to navigate."
        >
          <SprintHistoryTable sprints={sprints} activeId={summary.id} />
        </ShellSection>

        <ShellSection
          eyebrow="Cross sprint trend"
          title="Tickets and story points per sprint"
          description="Stacked column charts side by side. Closed versus open ticket counts on the left, completed versus remaining story points on the right."
        >
          <SprintTrendCharts sprints={sprints} />
        </ShellSection>

        <ShellSection
          eyebrow={isPlanned ? 'Planning brief' : 'Meeting brief'}
          title={isPlanned ? 'AI planning brief' : 'AI meeting brief'}
          description={
            isPlanned
              ? 'Claude streams the planning brief on page load. Forward looking sections: planning summary, allocation highlights, watch list before sprint start, recommendations, talking points.'
              : 'Claude streams the brief on page load. Five sections in order: executive summary, highlights, watch list, recommendations, talking points.'
          }
        >
          {brief ? (
            <SprintErrorBoundary
              label="Streaming brief unavailable"
              fallback={
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
                    Streaming brief unavailable
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    The streaming brief failed to render. The sprint summary
                    captured at fixture time is below as a fallback.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-3 text-sm">
                    {fixture.metadata.summary}
                  </p>
                </div>
              }
            >
              <Suspense fallback={<BriefSkeleton />}>
                <StreamingBriefPanel brief={brief} />
              </Suspense>
            </SprintErrorBoundary>
          ) : (
            <p className="text-text-secondary leading-relaxed">
              {fixture.metadata.summary}
            </p>
          )}
        </ShellSection>
      </div>
    </section>
  )
}

function ShellSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-surface-border bg-surface p-6 lg:p-8">
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {eyebrow}
        </span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-5">
        {description}
      </p>
      {children}
    </section>
  )
}
