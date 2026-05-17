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
            Sprint review prep for a BI team,{' '}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              in five minutes.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
            Pick a monthly sprint from a six-sprint roster (four completed, one
            in flight, one already filling up with backlog). Filter by assignee
            or ticket type. The dashboard fills with a wide KPI strip, a
            priority breakdown, ETA discipline tiles, per-ticket cycle time
            and aging bars, and a workload-by-assignee preview. An AI authored
            meeting brief closes the page with the recommendations that go
            into the room.
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
            description="Six monthly sprints across the first half of 2026, themed around real BI and data engineering work (Pulse SSOT on Databricks, Jira SSOT, RevOps Sales SSOT, Microsoft Fabric, Tableau Server, Genie Space). Four completed sprints carry different stories (healthy, scope creep absorbed, blocked, recovered). One sprint is currently in flight at day 17 of 31. One sprint is already filling up with backlog tickets the manager has earmarked for next cycle."
          />
          <StepCard
            num="02"
            title="Read the analysis"
            description="Filter bar at the top (assignee, ticket type, status). Below it: a wide KPI strip and a story points strip, then avg time in current status plus a priority breakdown, then ETA discipline tiles (Missing ETA, Overdue), then per-ticket cycle time and aging bars, then workload by assignee. Standard sprint health cards (burndown, velocity, scope creep, carryover) sit below for the agile rituals. Per-engineer deep dive tabs at the bottom plus a six-sprint history table for context."
          />
          <StepCard
            num="03"
            title="Take the brief into the room"
            description="A streaming AI meeting brief closes the page. Executive summary, highlights, watch list, recommendations, talking points. For the backlog sprint, the brief flips to a planning summary plus allocation highlights so the manager can walk into planning ready to lock etas."
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
      <h2 className="font-display text-xl lg:text-2xl font-semibold tracking-tight mb-3">{title}</h2>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}
