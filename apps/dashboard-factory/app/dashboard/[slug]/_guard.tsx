'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Construction, Sparkles } from 'lucide-react'
import { Section } from '../../_components/Section'
import { useDashboardStore, useStoreHydrated } from '@/lib/store'
import {
  type DatasetSummary,
  getDatasetIcon,
  getColorClasses,
} from '@/lib/datasets'

interface DashboardGuardProps {
  slug: string
  dataset: DatasetSummary
}

/**
 * Client-side route guard.
 *
 * /dashboard/[slug] should not be reachable without first profiling the
 * dataset (Step 2 of the flow). This guard:
 *   1. Waits for Zustand to hydrate from localStorage
 *   2. Reads profilingComplete[slug]
 *   3. Redirects to /generate/[slug] if false
 *   4. Renders the Week-3-coming-soon placeholder if true
 *
 * Until Week 3 ships the actual dashboard rendering, this page exists
 * primarily to make the "Generate dashboard" CTA on /generate/[slug]
 * link to a real page (no 404) and to validate the navigation guard
 * pattern for Week 3.
 */
export function DashboardGuard({ slug, dataset }: DashboardGuardProps) {
  const router = useRouter()
  const hydrated = useStoreHydrated()
  const profilingComplete = useDashboardStore(
    (s) => s.profilingComplete[slug] ?? false,
  )

  React.useEffect(() => {
    if (!hydrated) return
    if (!profilingComplete) {
      router.replace(`/generate/${slug}`)
    }
  }, [hydrated, profilingComplete, slug, router])

  // While we're loading or about to redirect, show a tasteful loading state
  // (avoids flashing the "Coming Week 3" placeholder before the redirect fires)
  if (!hydrated || !profilingComplete) {
    return (
      <Section
        eyebrow="Loading"
        title="Checking your progress"
      >
        <div className="rounded-xl border border-surface-border bg-surface p-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-text-muted">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>One moment...</span>
          </div>
        </div>
      </Section>
    )
  }

  return <ComingSoonStub slug={slug} dataset={dataset} />
}

function ComingSoonStub({
  slug,
  dataset,
}: {
  slug: string
  dataset: DatasetSummary
}) {
  const Icon = getDatasetIcon(dataset.icon)
  const colors = getColorClasses(dataset.colorToken)

  return (
    <>
      {/* Back link */}
      <div className="section-container pt-8">
        <Link
          href={`/generate/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profiling
        </Link>
      </div>

      <Section
        eyebrow={`Step 3 of 3 · Dashboard · ${dataset.domain}`}
        title={dataset.title}
        description={dataset.tagline}
      >
        {/* Header strip */}
        <div className="flex items-center gap-4 mb-10 -mt-2">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border ${colors.thumbBorder} ${colors.thumbBg}`}
          >
            <Icon className={`h-7 w-7 ${colors.iconColor}`} strokeWidth={1.5} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5 text-status-completed">
              <span className="h-1.5 w-1.5 rounded-full bg-status-completed" />
              Profiling complete
            </span>
            <span className="text-text-muted">
              ready for dashboard rendering
            </span>
          </div>
        </div>

        {/* Coming soon card */}
        <div className="rounded-xl border border-surface-border bg-surface p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
              <Construction className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Coming Week 3
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Dashboard rendering ships next
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              The Claude profiling output you just watched recommends a specific KPI strip + chart
              composition for this dataset. Week 3 of the build plan implements the renderer that
              maps those recommendations to live charts using Recharts and the design system's{' '}
              <code className="text-accent font-mono text-xs">KpiCard</code> +{' '}
              <code className="text-accent font-mono text-xs">ChartCard</code> components.
            </p>
            <p className="text-text-muted leading-relaxed text-sm mb-8">
              The route exists, the navigation guard works, the design system is ready, and the
              fixtures are in place. What's coming: dynamic chart rendering, filter wiring, drill-
              downs, and PDF export. ETA Week 3 (Days 15-21).
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/generate/${slug}`}
                className="inline-flex items-center gap-2 rounded-md border border-surface-border bg-surface hover:bg-surface-hover hover:border-accent/40 px-5 py-2.5 text-sm font-medium text-text-primary transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Replay profiling
              </Link>
              <Link
                href="/datasets"
                className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-5 py-2.5 text-sm font-semibold transition-all"
              >
                Try another dataset
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
