'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react'
import { Section } from '../../_components/Section'
import { useDashboardStore, useStoreHydrated } from '@/lib/store'
import {
  type DatasetSummary,
  getDatasetIcon,
  getColorClasses,
} from '@/lib/datasets'
import type { FullDataset } from '@/lib/full-datasets'
import { DashboardInteractive } from './_dashboard-interactive'

interface DashboardGuardProps {
  slug: string
  dataset: DatasetSummary
  fullDataset: FullDataset
}

/**
 * Client-side route guard.
 *
 * /dashboard/[slug] should not be reachable without first profiling the
 * dataset (Step 2 of the flow). This guard:
 *   1. Waits for Zustand to hydrate from localStorage
 *   2. Reads profilingComplete[slug]
 *   3. Redirects to /generate/[slug] if false
 *   4. Renders the actual dashboard if true
 *
 * As of Week 3 Day 1, the success branch renders an actual dashboard
 * (KPI strip + chart grid). Day 16 swaps the inline-SVG charts for
 * Recharts to add interactivity.
 */
export function DashboardGuard({ slug, dataset, fullDataset }: DashboardGuardProps) {
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

  // While loading or about to redirect, show a tasteful loading state
  // so the dashboard doesn't flash before redirect fires
  if (!hydrated || !profilingComplete) {
    return (
      <Section eyebrow="Loading" title="Checking your progress">
        <div className="rounded-xl border border-surface-border bg-surface p-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-text-muted">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>One moment...</span>
          </div>
        </div>
      </Section>
    )
  }

  return <DashboardSuccess slug={slug} dataset={dataset} fullDataset={fullDataset} />
}

function DashboardSuccess({
  slug,
  dataset,
  fullDataset,
}: {
  slug: string
  dataset: DatasetSummary
  fullDataset: FullDataset
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
        <div className="flex items-center gap-4 mb-8 -mt-2">
          <div
            className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl border ${colors.thumbBorder} ${colors.thumbBg}`}
          >
            <Icon
              className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.iconColor}`}
              strokeWidth={1.5}
            />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs min-w-0">
            <span className="inline-flex items-center gap-1.5 text-status-completed shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-status-completed animate-pulse" />
              Live dashboard
            </span>
            <span className="text-text-muted shrink-0">
              auto-generated from profiling
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <Link
              href={`/generate/${slug}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent px-3 py-2 rounded-md border border-surface-border hover:border-accent/40 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Re-profile
            </Link>
            <Link
              href="/datasets"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent px-3 py-2 rounded-md border border-surface-border hover:border-accent/40 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Switch dataset</span>
              <span className="sm:hidden">Switch</span>
            </Link>
          </div>
        </div>

        {/* Dashboard content, interactive wrapper handles filters + drill-down */}
        <DashboardInteractive fullDataset={fullDataset} colors={colors} />
      </Section>
    </>
  )
}
