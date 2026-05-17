import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarRange, Ticket, Users } from 'lucide-react'
import {
  sprints,
  team,
  totalCapacity,
  getColorClasses,
  getSprintStatusIcon,
  getSprintStatusLabel,
  getStatusColorToken,
  formatSprintDateRange,
} from '@/lib/sprints'

export const metadata: Metadata = {
  title: 'Sprints',
  description:
    'Pick a synthetic sprint to inspect. Four sprints with different stories: healthy, scope creep, blocked, and currently in flight.',
  openGraph: {
    title: 'Sprint gallery · Sprint Intelligence',
    description:
      'Four synthetic sprints, each with 20 to 30 tickets and the same eight engineer team. Pick one to land in the dashboard.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sprint gallery · Sprint Intelligence',
    description:
      'Four synthetic sprints. Pick one to land in the dashboard with KPIs plus a streaming AI brief.',
  },
}

export default function SprintsPage() {
  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header className="mb-10 max-w-2xl">
        <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
          Step 1 of 2 · Pick a sprint
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Sprint gallery
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Six monthly sprints across the first half of 2026. Four completed
          (green), one currently in flight (amber, day 17 of 31), one
          already filling up with backlog tickets the manager has earmarked
          for next cycle (slate). Same eight engineer team across every
          sprint, full ticket status, priority, type, and assignment data.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {team.length} engineers
          </span>
          <span className="text-text-dim">·</span>
          <span>{totalCapacity} story points per sprint capacity</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sprints.map((sprint) => {
          const colors = getColorClasses(getStatusColorToken(sprint.status))
          const StatusIcon = getSprintStatusIcon(sprint.status)
          const isActive = sprint.status === 'in-progress'
          const isPlanned = sprint.status === 'planned'
          return (
            <Link
              key={sprint.id}
              href={`/sprint/${sprint.id}`}
              className={`group relative rounded-xl border ${colors.cardBorder} ${colors.cardBg} p-6 lg:p-8 transition-all hover:border-text-muted/30 hover:shadow-glow-sm overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${colors.accentLine} opacity-60`} />
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${colors.cardBorder} ${colors.cardBg}`}
                  >
                    <StatusIcon className={`h-5 w-5 ${colors.iconColor}`} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-lg font-semibold tracking-tight">
                        {sprint.name}
                      </h2>
                      <span
                        className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                      >
                        {getSprintStatusLabel(sprint.status)}
                      </span>
                      {isActive && (
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-status-in-progress animate-pulse" />
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5">
                      <CalendarRange className="h-3 w-3" />
                      {formatSprintDateRange(sprint.startDate, sprint.endDate)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-5">
                {sprint.tagline}.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5" />
                  {sprint.ticketCount} {isPlanned ? 'backlog' : 'tickets'}
                </span>
                <span className="text-text-dim">·</span>
                <span>{team.length} engineers</span>
                <span className="text-text-dim">·</span>
                <span>{totalCapacity} SP capacity</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
