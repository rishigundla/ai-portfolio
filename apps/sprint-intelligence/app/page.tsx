import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <section className="section-container pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">
            <Sparkles className="h-3 w-3" />
            Project 03 · Sprint Intelligence
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Sprint review prep,{' '}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              in five minutes.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
            Pick a synthetic sprint. The dashboard fills with team and individual
            KPIs. A streaming AI meeting brief lands on top with executive summary,
            watch list, and workload rebalancing recommendations. Same streaming
            primitive as the other portfolio projects, applied to engineering
            analytics this time.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/sprints"
              className="inline-flex items-center gap-2 rounded-md bg-accent text-base-900 hover:bg-accent-light px-6 py-3 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              Browse sprints
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <StepCard
            num="01"
            title="Pick a sprint"
            description="Four curated sprints with different stories. A healthy sprint that hit its goal. A scope creep sprint that grew from 22 tickets to 28. A blocked sprint with five blockers across three engineers. A current sprint mid flight."
          />
          <StepCard
            num="02"
            title="Read the dashboard"
            description="Team level KPIs at the top (burndown, velocity, cycle time, scope creep, carryover) and individual deep dive tabs at the bottom (workload score, completion rate, review bottleneck). The dashboard fills the moment you land on the page."
          />
          <StepCard
            num="03"
            title="Take the brief into the room"
            description="A streaming AI meeting brief writes itself on top of the dashboard. Executive summary, highlights, watch list, recommendations, talking points. Five minute read instead of an hour of prep."
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
