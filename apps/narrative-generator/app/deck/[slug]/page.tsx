import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getDashboardSummary, getAllDashboardSlugs } from '@/lib/dashboards'
import { getFullDashboard } from '@/lib/full-dashboards'
import { getNarrativeFixture } from '@/lib/narratives'
import { SlidePreview, TOTAL_SLIDES } from './_slide-preview'
import { PptxExportModal } from './_pptx-modal'

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
    description: `Slide-by-slide preview of the executive deck for ${dashboard.title}.`,
  }
}

export default async function DeckPage({ params }: PageProps) {
  const { slug } = await params

  const summary = getDashboardSummary(slug)
  const dashboard = getFullDashboard(slug)
  const narrative = getNarrativeFixture(slug)
  if (!summary || !dashboard || !narrative) notFound()

  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href={`/generate/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to narrative
      </Link>

      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
            Step 3 of 3 · Deck preview
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {dashboard.metadata.title}
          </h1>
          <p className="mt-4 text-text-secondary leading-relaxed">
            {TOTAL_SLIDES}-slide deck themed to the design system — title, headline metric,
            four narrative sections, closing recap. Scroll to review; download as PPTX when
            you&apos;re ready to share.
          </p>
        </div>
        <PptxExportModal slug={slug} />
      </header>

      <SlidePreview dashboard={dashboard} narrative={narrative} />

      <p className="mt-12 max-w-2xl text-xs text-text-muted leading-relaxed">
        Slide content is generated from the{' '}
        <span className="font-mono text-text-secondary">{slug}</span> dashboard fixture
        + the matching narrative fixture. Same machinery will feed the PPTX exporter
        (W7.D1) so the binary output matches this preview pixel for pixel.
      </p>
    </section>
  )
}
