import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarRange, Ticket } from 'lucide-react'
import {
  getSprintSummary,
  getAllSprintIds,
  getColorClasses,
  getSprintStatusIcon,
  getSprintStatusLabel,
  formatSprintDateRange,
  sprintDaysElapsed,
} from '@/lib/sprints'
import { getFullSprint } from '@/lib/full-sprints'

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
  return {
    title: summary.name,
    description: summary.tagline,
  }
}

export default async function SprintDetailPage({ params }: PageProps) {
  const { id } = await params
  const summary = getSprintSummary(id)
  if (!summary) notFound()

  const fixture = getFullSprint(id)
  if (!fixture) notFound()

  const colors = getColorClasses(summary.colorToken)
  const StatusIcon = getSprintStatusIcon(summary.status)
  const dayCount = sprintDaysElapsed(summary.startDate, summary.endDate)

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
          description="A streaming AI authored brief lands here in W9.D7. Executive summary, highlights, watch list, recommendations, and talking points. For now this panel holds the sprint summary pulled from the fixture so the page has a top of fold story."
        >
          <p className="text-text-secondary leading-relaxed">
            {fixture.metadata.summary}
          </p>
        </ShellSection>

        <ShellSection
          eyebrow="Section 2 of 3"
          title="Team KPIs"
          description="W9.D3 to D4 will render burndown, velocity, status distribution, blocked ticket counts, cycle time, throughput, scope creep, and carryover. The slots below are the placeholder grid that the real KPI cards will replace."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {['Burndown', 'Velocity', 'Status mix', 'Cycle time', 'Scope creep'].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-surface-border bg-surface p-4 text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  {label}
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-text-dim">
                  arrives W9.D3
                </p>
              </div>
            ))}
          </div>
        </ShellSection>

        <ShellSection
          eyebrow="Section 3 of 3"
          title="Per engineer deep dive"
          description="W9.D5 fills the bottom strip with a tab per engineer. Workload score, completion rate, personal versus team cycle time, and review bottleneck callouts. The team header below is live data from the manifest."
        >
          <div className="rounded-lg border border-surface-border bg-surface p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
              Sprint team
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Eight engineers ship together in this sprint and across the
              series. Deep dive tabs arrive on W9.D5 with per engineer KPIs.
            </p>
          </div>
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
