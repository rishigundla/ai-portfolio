import Link from 'next/link'
import { Sparkles, FileText, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section-container pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <Sparkles className="h-3 w-3" />
            Project 02 · Dashboard-to-Deck
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Dashboards out,{' '}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              stories back in.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
            Pick a sample dashboard. Watch Claude write the executive narrative — hero
            metric, week-over-week movement, the contextual one-liner that explains why
            it matters. Get a polished PPTX-ready deck themed to a unified design system.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/dashboards"
              className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-6 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              Browse sample dashboards
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-md border border-surface-border bg-surface px-6 py-3 text-sm font-medium text-text-muted">
              <FileText className="h-4 w-4" />
              W6.D1 scaffold — narrative + PPTX in W7
            </span>
          </div>
        </div>
      </section>

      {/* Two-step preview */}
      <section className="section-container pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <StepCard
            num="01"
            title="Watch Claude write the readout"
            description="Stream the executive narrative live — hero metric pulled from the dashboard, week-over-week deltas, the contextual one-liner. Same streaming primitive as Project 1's profiling, different output medium."
          />
          <StepCard
            num="02"
            title="Download a polished deck"
            description="Get a PPTX-ready slide deck themed to the design system, accessible, ready to drop into Monday's exec review. No template wrangling, no design re-do."
          />
        </div>
      </section>
    </>
  )
}

function StepCard({ num, title, description }: { num: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-6 lg:p-8">
      <div className="font-mono text-3xl font-light text-accent mb-3 tracking-tight">{num}</div>
      <h3 className="font-display text-xl lg:text-2xl font-semibold tracking-tight mb-3">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}
