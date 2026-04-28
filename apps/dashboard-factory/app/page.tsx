import Link from 'next/link'
import { Sparkles, Wand2, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section-container pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <Sparkles className="h-3 w-3" />
            Project 01 · Instant Analytics
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Dashboards in{' '}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              minutes
            </span>
            , not days.
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
            Pick a sample dataset. Watch Claude profile it. Get a fully designed,
            interactive dashboard following a unified design system — ready to share with
            stakeholders or refine into a hi-fi wireframe.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/datasets"
              className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-6 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              Browse sample datasets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/wireframe"
              className="inline-flex items-center gap-2 rounded-md border border-surface-border bg-surface hover:bg-surface-hover hover:border-accent/40 px-6 py-3 text-sm font-medium text-text-primary transition-all"
            >
              <Wand2 className="h-4 w-4" />
              Try wireframe mode
            </Link>
          </div>
        </div>
      </section>

      {/* Two personas */}
      <section className="section-container pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PersonaCard
            href="/datasets"
            badge="For business users"
            badgeAccent="accent"
            title="Ad-hoc dashboard mode"
            quote="My VP wants Q3 vs Q2 regional sales for Monday's leadership meeting. I have a CSV. I don't want to file a BI ticket."
            description="Pick from 6 curated sample datasets, watch the AI profile your data and recommend KPIs, get an interactive dashboard with filters, drill-downs, and PDF export — all in under a minute."
          />
          <PersonaCard
            href="/wireframe"
            badge="For BI engineers"
            badgeAccent="muted"
            title="Hi-fi wireframe mode"
            quote="I'm kicking off a new CX dashboard project. I need a clickable hi-fi mockup for Monday's discovery session, but I don't want to spend a week in Figma first."
            description="Pick a layout template (Executive, Operational, Exploratory), get a fully designed clickable mockup. Export to Figma for stakeholder refinement before any real development begins."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="section-container pb-24">
        <div className="mb-10 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-2">How it works</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps from dataset to dashboard
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StepCard
            num="01"
            title="Pick a dataset"
            description="6 anonymised samples covering RevOps, Marketing, Pulse Telemetry, Supply Chain, Financial Complaints, Customer Demographics."
          />
          <StepCard
            num="02"
            title="Watch the AI profile it"
            description="Streaming explanation: column types inferred, business domain detected, KPIs recommended, chart types proposed. About 8 seconds."
          />
          <StepCard
            num="03"
            title="Get an interactive dashboard"
            description="Fully designed, themed to a unified design system. Filter, drill down, export to PDF, or hand off to a designer."
          />
        </div>
      </section>
    </>
  )
}

function PersonaCard({
  href,
  badge,
  badgeAccent,
  title,
  quote,
  description,
}: {
  href: string
  badge: string
  badgeAccent: 'accent' | 'muted'
  title: string
  quote: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-surface-border bg-surface p-6 lg:p-8 transition-all hover:border-accent/40 hover:shadow-card-hover"
    >
      <div
        className={
          badgeAccent === 'accent'
            ? 'inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-accent/30 bg-accent/10 text-accent'
            : 'inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-surface-border bg-base-700 text-text-muted'
        }
      >
        {badge}
      </div>
      <h2 className="mt-4 font-display text-xl lg:text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <blockquote className="mt-4 pl-4 border-l-2 border-accent/40 font-serif italic text-text-secondary leading-relaxed">
        {quote}
      </blockquote>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{description}</p>
      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
        Try this mode
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}

function StepCard({ num, title, description }: { num: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-6">
      <div className="font-mono text-3xl font-light text-accent mb-3 tracking-tight">{num}</div>
      <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}
