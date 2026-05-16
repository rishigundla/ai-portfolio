import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Sprint ${id}`,
    description: `Team and individual KPIs plus the streaming AI meeting brief for ${id}.`,
  }
}

export default async function SprintDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <section className="section-container pt-12 pb-24">
      <Link
        href="/sprints"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sprints
      </Link>
      <header className="mb-10 max-w-2xl">
        <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
          Step 2 of 2 · Sprint detail
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          {id}
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          KPIs, deep dive tabs, and the streaming meeting brief arrive across W9.D3 to W9.D7.
        </p>
      </header>
      <div className="rounded-xl border border-surface-border bg-surface p-12 text-center text-text-muted text-sm">
        Sprint dashboard arrives across W9.D3 through W9.D7.
      </div>
    </section>
  )
}
