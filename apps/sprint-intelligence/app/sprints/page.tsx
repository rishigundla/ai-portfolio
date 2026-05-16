import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sprints',
  description: 'Gallery of four synthetic sprints to choose from.',
}

export default function SprintsPage() {
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
          Step 1 of 2 · Pick a sprint
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Sprint gallery
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Four sprints arrive in W9.D2 along with the dashboard shell. Cards land here
          with sprint name, dates, status, ticket count, and team size.
        </p>
      </header>
      <div className="rounded-xl border border-surface-border bg-surface p-12 text-center text-text-muted text-sm">
        Gallery cards arrive on W9.D2.
      </div>
    </section>
  )
}
