import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Generating · ${slug}`,
    description: `Streaming AI-authored executive narrative for the ${slug} dashboard.`,
  }
}

// W6.D1 scaffold — streaming narrative replay lands in W7.D1-D3.
// generateStaticParams will enumerate the 6 sample-dashboard slugs once
// the dashboard library is authored in W6.D3. For now this is a dynamic
// route that accepts any slug and renders the placeholder shell.
export default async function GeneratePage({ params }: PageProps) {
  const { slug } = await params

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
          {slug}
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Claude will read this dashboard, identify the hero metric, and stream the
          executive readout live — hero + delta + context, then a bulleted callout
          structure ready for a slide.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-surface-border bg-surface/50 p-12 text-center">
        <p className="font-mono text-sm text-text-muted">
          Streaming narrative panel — coming W7.D1
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Will reuse <code className="font-mono text-text-secondary">@rishi/ai-core</code>{' '}
          <code className="font-mono text-text-secondary">replayFixture</code> primitive
          from Project 1, consuming a hand-curated narrative fixture per dashboard.
        </p>
      </div>
    </section>
  )
}
