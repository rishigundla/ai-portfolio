import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  dashboards,
  getDashboardIcon,
  getColorClasses,
} from '@/lib/dashboards'

export const metadata: Metadata = {
  title: 'Sample dashboards',
  description: 'Pick a sample dashboard to generate an executive narrative readout from.',
}

export default function DashboardsGalleryPage() {
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
          Sample dashboards
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Pick a dashboard. Get a narrative readout.
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Six sample dashboards spanning RevOps, Marketing, Ops, Finance, HR, and CX.
          Each one is a finished BI artifact — five KPIs and three charts plus
          supporting rows. Click in to watch Claude write the executive narrative
          and assemble a PPTX-ready deck.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboards.map((dashboard) => {
          const Icon = getDashboardIcon(dashboard.icon)
          const colors = getColorClasses(dashboard.colorToken)
          return (
            <Link
              key={dashboard.id}
              href={`/generate/${dashboard.id}`}
              className="group rounded-xl border border-surface-border bg-surface hover:border-accent/40 hover:shadow-card-hover transition-all overflow-hidden"
            >
              <div
                className={`${colors.thumbBg} ${colors.thumbBorder} border-b aspect-[16/9] flex items-center justify-center`}
              >
                <Icon className={`h-12 w-12 ${colors.iconColor}`} strokeWidth={1.5} />
              </div>
              <div className="p-5">
                <div
                  className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder} mb-3`}
                >
                  {dashboard.domain}
                </div>
                {/* h2 because the H1 above is the gallery title and these cards
                    are top-level sections of the gallery. H3 (the previous tag)
                    skipped a level and triggered the Lighthouse heading-order
                    audit on the W6.D6 sweep. */}
                <h2 className="font-display text-lg font-semibold tracking-tight mb-2">
                  {dashboard.title}
                </h2>
                <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">
                  {dashboard.tagline}
                </p>
                {/* text-text-muted (slate-400) not text-text-dim (#4b5563) —
                    dim is below the WCAG AA 4.5:1 contrast threshold against
                    bg-surface (#16161e). Footer stats need to be readable. */}
                <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                  <span>
                    {dashboard.kpiCount} KPIs · {dashboard.chartCount} charts · {dashboard.rowCount} rows
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
