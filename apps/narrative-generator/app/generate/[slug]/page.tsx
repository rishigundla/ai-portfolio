import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getDashboardSummary, getAllDashboardSlugs } from '@/lib/dashboards'

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Enumerate every dashboard slug so each /generate/[slug] page
 * prerenders to static HTML at build time. Lifts SEO to 100 because
 * the prerendered HTML has the full per-slug metadata.
 */
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
    title: `Generating · ${dashboard.title}`,
    description: `Streaming AI-authored executive narrative for the ${dashboard.title} dashboard.`,
  }
}

// W6.D3 — gallery → narrative wiring uses the manifest only (light bundle).
// The streaming narrative panel + full dashboard payload land in W6.D6,
// where /generate/[slug] will pull from lib/full-dashboards.ts.
export default async function GeneratePage({ params }: PageProps) {
  const { slug } = await params
  const dashboard = getDashboardSummary(slug)
  if (!dashboard) notFound()

  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href="/dashboards"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboards
      </Link>

      <header className="mb-10 max-w-2xl">
        <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
          Step 2 of 3 · Narrative streaming
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          {dashboard.title}
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          {dashboard.tagline}
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-surface-border bg-surface/50 p-12 text-center">
        <p className="font-mono text-sm text-text-muted">
          Streaming narrative panel — coming W6.D6
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Will reuse <code className="font-mono text-text-secondary">@rishi/ai-core</code>{' '}
          <code className="font-mono text-text-secondary">replayFixture</code> primitive
          from Project 1, consuming a hand-curated narrative fixture keyed by{' '}
          <code className="font-mono text-text-secondary">{dashboard.id}</code>.
        </p>
      </div>
    </section>
  )
}
