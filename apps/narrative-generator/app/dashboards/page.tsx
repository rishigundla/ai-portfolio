import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sample dashboards',
  description: 'Pick a sample dashboard to generate an executive narrative readout from.',
}

export default function DashboardsGalleryPage() {
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
          Sample dashboards
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Pick a dashboard. Get a narrative readout.
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          The dashboard library and streaming narrative pipeline land in W6.D3 and W7.
          This scaffold proves the route exists and consumes the shared design system.
        </p>
      </header>

      {/* W6.D1 placeholder — gallery cards land in W6.D3 once sample dashboards are authored */}
      <div className="rounded-xl border border-dashed border-surface-border bg-surface/50 p-12 text-center">
        <p className="font-mono text-sm text-text-muted">
          Sample dashboard gallery — coming W6.D3
        </p>
        <p className="mt-2 text-xs text-text-dim">
          Will mirror the dashboard-factory <code className="font-mono text-text-secondary">/datasets</code>{' '}
          gallery pattern — 6 sample dashboards spanning RevOps, marketing, ops, finance, HR, and CX.
        </p>
      </div>
    </section>
  )
}
