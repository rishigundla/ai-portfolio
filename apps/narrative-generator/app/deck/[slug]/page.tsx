import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getDashboardSummary, getAllDashboardSlugs } from '@/lib/dashboards'

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
    return { title: 'Deck not found', description: 'The requested deck does not exist.' }
  }
  return {
    title: `Deck · ${dashboard.title}`,
    description: `Polished PPTX-ready deck for the ${dashboard.title} narrative.`,
  }
}

// W6.D3 — gallery → deck wiring uses the manifest only. Real slide
// rendering + PPTX export land in W7.D1 using lib/full-dashboards.ts
// + pptxgenjs.
export default async function DeckPage({ params }: PageProps) {
  const { slug } = await params
  const dashboard = getDashboardSummary(slug)
  if (!dashboard) notFound()

  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href={`/generate/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to narrative
      </Link>

      <header className="mb-10 max-w-2xl">
        <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
          Step 3 of 3 · Deck preview
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          {dashboard.title}
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          The slide deck themed to the design system. Title slide, hero-metric slide,
          per-bullet detail slides, closing recap. Download as PPTX.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-surface-border bg-surface/50 p-12 text-center">
        <p className="font-mono text-sm text-text-muted">
          Slide preview + PPTX export — coming W7.D1
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Will use <code className="font-mono text-text-secondary">pptxgenjs</code>{' '}
          on the server, same design-system tokens applied to slide
          backgrounds, headings, and accent fills. Loaded fixture:{' '}
          <code className="font-mono text-text-secondary">{dashboard.id}</code>
        </p>
      </div>
    </section>
  )
}
