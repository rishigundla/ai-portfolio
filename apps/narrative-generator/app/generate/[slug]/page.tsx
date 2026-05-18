import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  getDashboardSummary,
  getAllDashboardSlugs,
  getColorClasses,
  getDashboardIcon,
} from '@/lib/dashboards'
import { getFullDashboard } from '@/lib/full-dashboards'
import { getNarrativeFixture } from '@/lib/narratives'
import { DashboardPreview } from './_dashboard-preview'
import { GenerateShell } from './_generate-shell'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllDashboardSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const dashboard = getDashboardSummary(slug)
  if (!dashboard) {
    return {
      title: 'Dashboard not found',
      description: 'The requested dashboard does not exist.',
    }
  }
  return {
    title: `Generate narrative for ${dashboard.title}`,
    description: `Preview the ${dashboard.title} and generate an AI authored executive readout plus a themed downloadable deck.`,
  }
}

export default async function GeneratePage({ params }: PageProps) {
  const { slug } = await params
  const summary = getDashboardSummary(slug)
  if (!summary) notFound()

  const dashboard = getFullDashboard(slug)
  if (!dashboard) notFound()

  const narrative = getNarrativeFixture(slug)
  if (!narrative) notFound()

  const colors = getColorClasses(dashboard.metadata.colorToken)
  const Icon = getDashboardIcon(dashboard.metadata.icon)

  return (
    <GenerateShell
      fixture={narrative}
      dashboardSlug={slug}
      dashboardTitle={dashboard.metadata.title}
      backLink={
        <Link
          href="/dashboards"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboards
        </Link>
      }
      header={
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            {/*
              Icon container reuses the badge background + border classes
              (solid color tint) instead of the gradient thumbBg used on
              the dashboard selection cards. The gradient on a 9x9 box
              read as faded olive next to the tag's solid lime fill, so
              icon and tag looked like different accents. Sharing the
              badge background closes the gap and makes the icon, tag,
              KPI numbers, and chart accent visually pull from the same
              dashboard accent in both modes.
            */}
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${colors.badgeBg} ${colors.badgeBorder}`}
            >
              <Icon className={`h-5 w-5 ${colors.iconColor}`} strokeWidth={1.5} />
            </div>
            <div
              className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
            >
              {dashboard.metadata.domain}
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Step 2 of 2
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {dashboard.metadata.title}
          </h1>
          <p className="mt-3 text-text-secondary leading-relaxed">
            {dashboard.metadata.tagline}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-text-muted">
            <span>{dashboard.metadata.period}</span>
            <span className="text-text-dim">·</span>
            <span>{dashboard.metadata.audience}</span>
          </div>
        </div>
      }
      dashboardPreview={<DashboardPreview dashboard={dashboard} />}
    />
  )
}
