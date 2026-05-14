import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Deck · ${slug}`,
    description: `Polished PPTX-ready deck for the ${slug} dashboard narrative.`,
  }
}

// W6.D1 scaffold — slide rendering + PPTX export land in W7.D4-D5.
export default async function DeckPage({ params }: PageProps) {
  const { slug } = await params

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
          {slug}
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          The slide deck themed to the design system. Title slide, hero-metric slide,
          per-bullet detail slides, closing recap. Download as PPTX.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-surface-border bg-surface/50 p-12 text-center">
        <p className="font-mono text-sm text-text-muted">
          Slide preview + PPTX export — coming W7.D4-D5
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Will use <code className="font-mono text-text-secondary">pptxgenjs</code>{' '}
          on the server (or <code className="font-mono text-text-secondary">pptx-automizer</code>{' '}
          for richer template control) — same design-system tokens applied to slide
          backgrounds, headings, and accent fills.
        </p>
      </div>
    </section>
  )
}
