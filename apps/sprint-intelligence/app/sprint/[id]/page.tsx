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
  formatSprintDateRange,
  sprintDaysElapsed,
  team,
  totalCapacity,
} from '@/lib/sprints'
import { getFullSprint } from '@/lib/full-sprints'
import { getBrief } from '@/lib/briefs'
import {
  buildBurndownPoints,
  buildCycleTimePoints,
  buildEngineerDeepDive,
  computeBlockedSummary,
  computeCarryoverSummary,
  computeCycleTimeSummary,
  computeScopeCreepSummary,
  computeStatusDistribution,
  computeThroughputSummary,
  computeVelocityComparison,
} from '@/lib/kpi-calc'
import { BurndownChart } from './_components/BurndownChart'
import { VelocityBar } from './_components/VelocityBar'
import { StatusDonut } from './_components/StatusDonut'
import { BlockedCard } from './_components/BlockedCard'
import { CycleTimeChart } from './_components/CycleTimeChart'
import { ThroughputChart } from './_components/ThroughputChart'
import { ScopeCreepCard } from './_components/ScopeCreepCard'
import { CarryoverCard } from './_components/CarryoverCard'
import { EngineerTabs } from './_components/EngineerTabs'
import { KpiCard } from './_components/KpiCard'
import { StreamingBriefPanel } from './_components/StreamingBriefPanel'
import { TeamWorkloadCard } from './_components/TeamWorkloadCard'
import { SprintErrorBoundary } from './_components/SprintErrorBoundary'
import {
  BriefSkeleton,
  EngineerTabsSkeleton,
  TeamWorkloadSkeleton,
} from './_components/skeletons'

const ACCENT_HEX: Record<string, string> = {
  accent: '#2dd4bf',
  purple: '#a78bfa',
  blue: '#60a5fa',
  amber: '#fbbf24',
  rose: '#fb7185',
  teal: '#2dd4bf',
  green: '#34d399',
}

interface PageProps {
  params: Promise<{ id: string }>
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
  const description = `${summary.tagline}. Streaming meeting brief plus team and individual KPIs across ${summary.ticketCount} tickets and the eight engineer roster.`
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

export default async function SprintDetailPage({ params }: PageProps) {
  const { id } = await params
  const summary = getSprintSummary(id)
  if (!summary) notFound()

  const fixture = getFullSprint(id)
  if (!fixture) notFound()

  const brief = getBrief(id)

  const colors = getColorClasses(summary.colorToken)
  const StatusIcon = getSprintStatusIcon(summary.status)
  const dayCount = sprintDaysElapsed(summary.startDate, summary.endDate)
  const accentHex = ACCENT_HEX[summary.colorToken] ?? ACCENT_HEX.accent ?? '#2dd4bf'

  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href="/sprints"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sprints
      </Link>

      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
              {fixture.tickets.length} tickets
            </span>
            <span className="text-text-dim">·</span>
            <span>
              Scope {fixture.scopePlanned} planned, {fixture.scopeFinal} final
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <ShellSection
          eyebrow="Section 1 of 3"
          title="Meeting brief"
          description="Claude streams the brief on page load. Five sections in order: executive summary, highlights, watch list, recommendations, talking points. The progress strip ticks through as each section heading lands."
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
              <StreamingBriefPanel brief={brief} />
            </SprintErrorBoundary>
          ) : (
            <p className="text-text-secondary leading-relaxed">
              {fixture.metadata.summary}
            </p>
          )}
        </ShellSection>

        <ShellSection
          eyebrow="Section 2 of 3"
          title="Team KPIs"
          description="Eight cards split into two rows. First row covers the headline sprint health (burndown, velocity, status mix, blocked). Second row covers the trend and scope signals (cycle time trend, throughput per week, scope creep, carryover rate)."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KpiCard
              eyebrow="Burndown"
              title="Story points remaining"
              subtitle="Ideal dashed line versus actual solid line, story points on the y axis, sprint day on the x axis."
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
              subtitle="Current sprint completed story points compared with the trailing four sprint average. Capacity sits at the top for context."
            >
              <VelocityBar
                velocity={computeVelocityComparison(fixture, totalCapacity)}
                accentHex={accentHex}
              />
            </KpiCard>
            <KpiCard
              eyebrow="Status mix"
              title="Tickets across the board"
              subtitle="Distribution across done, in review, in progress, to do, and blocked. Center shows the total ticket count."
            >
              <StatusDonut
                distribution={computeStatusDistribution(fixture.tickets)}
                accentHex={accentHex}
              />
            </KpiCard>
            <KpiCard
              eyebrow="Blocked"
              title="Tickets and the freshest blocker note"
              subtitle="Counts plus story points plus the oldest age in days. The top note surfaces what to action first."
            >
              <BlockedCard summary={computeBlockedSummary(fixture)} team={team} />
            </KpiCard>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <KpiCard
              eyebrow="Cycle time"
              title="Trend across the sprint"
              subtitle="Rolling average days from ticket start to done. Dashed baseline is the trailing team norm. Trend chip on the right reads improving, flat, or rising."
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
              subtitle="Week one and week two bars compared with the prior throughput average. Delta percent at the top right summarises the gap."
            >
              <ThroughputChart
                summary={computeThroughputSummary(fixture)}
                accentHex={accentHex}
              />
            </KpiCard>
            <KpiCard
              eyebrow="Scope creep"
              title="Planned versus final scope"
              subtitle="Headline percent and the absolute ticket delta. Mid sprint additions are pulled from the addedMidSprint flag on every ticket."
            >
              <ScopeCreepCard
                summary={computeScopeCreepSummary(fixture)}
                accentHex={accentHex}
              />
            </KpiCard>
            <KpiCard
              eyebrow="Carryover"
              title="Tickets carrying into the next sprint"
              subtitle="Closed versus total split. The in flight sprint marks the number as projected since the carryover state can still shift."
            >
              <CarryoverCard
                summary={computeCarryoverSummary(fixture)}
                accentHex={accentHex}
              />
            </KpiCard>
          </div>
          <div className="mt-4">
            <KpiCard
              eyebrow="Team workload"
              title="Per engineer load against capacity"
              subtitle="Priority weighted estimates as a share of each engineer's capacity. Click an engineer to drop into their deep dive panel below."
            >
              <SprintErrorBoundary label="Team workload unavailable">
                <Suspense fallback={<TeamWorkloadSkeleton />}>
                  <TeamWorkloadCard
                    deepDives={team.map((member) => buildEngineerDeepDive(fixture, member))}
                    accentHex={accentHex}
                  />
                </Suspense>
              </SprintErrorBoundary>
            </KpiCard>
          </div>
        </ShellSection>

        <div id="per-engineer-section">
          <ShellSection
            eyebrow="Section 3 of 3"
            title="Per engineer deep dive"
            description="Tab strip per engineer. Each engineer card shows workload score (priority weighted estimates against capacity), completion rate, personal versus team cycle time, and a review queue tile with a bottleneck flag when more than one ticket is sitting in review. Below the stat tiles, a priority mix bar and the engineer's ticket list."
          >
            <SprintErrorBoundary label="Engineer deep dive unavailable">
              <Suspense fallback={<EngineerTabsSkeleton />}>
                <EngineerTabs
                  deepDives={team.map((member) => buildEngineerDeepDive(fixture, member))}
                  accentHex={accentHex}
                />
              </Suspense>
            </SprintErrorBoundary>
          </ShellSection>
        </div>
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
