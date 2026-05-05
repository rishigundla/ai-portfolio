import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Code2,
  AlertCircle,
  Clock,
  Layers,
  Wand2,
} from 'lucide-react'
import { Section } from '../../_components/Section'

export const metadata = {
  title: 'Export to Figma · future-state demo',
  description:
    'A wireframe of the wireframe-export feature. Once Figma MCP matures, one click on any generated wireframe would push the layout into an editable Figma file styled with the portfolio design system. Today, this is the manual workflow it replaces.',
}

const FLOW_STEPS = [
  {
    number: '01',
    title: 'Generated wireframe',
    body: 'A dataset-driven layout the engine has already materialized: 5 KPIs, 4 charts, density-aware grid, design system applied. Lives at /wireframe/[slug].',
    icon: Layers,
  },
  {
    number: '02',
    title: 'Claude + Figma MCP',
    body: 'Click the button. Claude reads the WireframeLayout, picks the right Figma frame primitives, applies design-system tokens, and creates the file via the Figma MCP server.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Editable Figma file',
    body: 'Figma desktop opens with the wireframe rendered as native frames, components, and text styles. Designers continue refining from a real starting point, not a blank canvas.',
    icon: Wand2,
  },
] as const

const BLOCKERS = [
  {
    title: 'Figma MCP server is in beta',
    body: 'The MCP server that lets Claude call into Figma was released as a preview in late 2025. The frame-creation surface area is partial, the auth flow requires Figma desktop to be running, and the type definitions for plugin nodes are still settling. Not yet stable enough for a production click-to-export.',
  },
  {
    title: 'No headless Figma layout API',
    body: 'Figma\'s REST API can read files but can\'t create complex frame hierarchies with auto-layout, variants, and design-system bindings. The MCP path is the only realistic way to author Figma content programmatically today.',
  },
  {
    title: 'Production deploy on Vercel cannot run MCP',
    body: 'MCP servers run on the user\'s machine alongside Claude Desktop. A serverless Vercel function cannot reach a local Figma session. So a real export would be either a download (Figma plugin .fig file) or a "copy this prompt into Claude Desktop" handoff. Both are deferred until the desktop integration matures.',
  },
] as const

const ARCHITECTURE = [
  {
    label: 'WireframeLayout',
    detail: 'Already produced by the engine: 5 KPIs + 4 typed ChartPicks. Serializable JSON.',
  },
  {
    label: 'Claude Code (or Claude Desktop)',
    detail: 'Reads the layout. Picks Figma frame templates. Resolves design-system tokens. Calls the MCP server.',
  },
  {
    label: 'Figma MCP server',
    detail: 'Translates frame intents into Figma plugin actions. Creates frames, applies styles, opens the file.',
  },
  {
    label: 'Figma desktop',
    detail: 'Receives the new file. Designer continues refinement from a real starting point.',
  },
] as const

export default function FigmaExportFutureStatePage() {
  return (
    <>
      {/* Back link */}
      <div className="section-container pt-8">
        <Link
          href="/wireframe"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to wireframe gallery
        </Link>
      </div>

      <Section
        eyebrow="For Developers · Future-state demo"
        title="From wireframe to Figma in one click, eventually"
        description="This is what the workflow looks like once Figma MCP matures and headless layout creation is a real surface. Today, the Export to Figma button on each wireframe is itself a wireframe, of the wireframe-export feature. Honest framing first, vision second, blockers explicit."
      >
        {/* Today's reality */}
        <div className="rounded-xl border border-surface-border bg-surface p-6 lg:p-8 mb-12">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-amber-400/30 bg-amber-400/10">
              <Clock className="h-4 w-4 text-amber-300" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Today's reality
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mt-0.5">
                What the export feature actually replaces
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed mt-3 max-w-2xl">
            After a BI engineer mocks up a dashboard, the typical handoff to a designer is a
            screenshot, a Loom walkthrough, and a 3-day Figma rebuild from scratch. The designer
            redraws every chart, retypes every KPI label, re-applies brand colors, and frequently
            misses small but important details (filter chip layout, drill-down dialog spacing,
            empty states). The wireframe engine already produced a faithful, design-system-styled
            layout. The export feature collapses those 3 days into one click.
          </p>
        </div>

        {/* The future-state flow */}
        <div className="mb-12">
          <h2 className="font-display text-xl lg:text-2xl font-semibold text-text-primary mb-2">
            The future-state flow
          </h2>
          <p className="text-sm text-text-muted mb-6 max-w-2xl">
            Three steps. The first one already works (the wireframe engine ships in this app).
            The second and third are what unlocks once Figma MCP matures.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="relative rounded-xl border border-surface-border bg-surface p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-3xl font-light text-accent tracking-tight">
                      {step.number}
                    </span>
                    <Icon className="h-5 w-5 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">{step.body}</p>
                  {i < FLOW_STEPS.length - 1 && (
                    <ArrowRight
                      className="hidden lg:block absolute top-1/2 -right-3 h-5 w-5 text-accent/40 -translate-y-1/2 z-10"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* What a click would do — code snippet */}
        <div className="mb-12">
          <h2 className="font-display text-xl lg:text-2xl font-semibold text-text-primary mb-2">
            What a click would do
          </h2>
          <p className="text-sm text-text-muted mb-4 max-w-2xl">
            Conceptually, the button hands the engine's output to Claude as a structured tool call
            against the Figma MCP server. The schema lives next to the wireframe engine, so the
            handoff is data-driven rather than text-prompt-driven.
          </p>
          <div className="rounded-xl border border-surface-border bg-base-900 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-surface-border px-4 py-2.5">
              <Code2 className="h-3.5 w-3.5 text-text-muted" />
              <span className="font-mono text-xs text-text-muted">
                conceptual · not currently wired
              </span>
            </div>
            <pre className="px-4 py-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
              <code className="text-text-secondary">
                <span className="text-text-muted">// On click of "Export to Figma":</span>
                {'\n'}
                <span className="text-accent">await</span>{' '}
                <span className="text-purple-300">claude</span>.<span className="text-blue-300">tool</span>({'{'}
                {'\n  '}name: <span className="text-amber-200">{`'mcp__figma__create_frame'`}</span>,
                {'\n  '}input: {'{'}
                {'\n    '}layout:{' '}
                <span className="text-purple-300">getWireframeLayout</span>(slug, density),
                {'\n    '}designSystem:{' '}
                <span className="text-amber-200">{`'@rishi/design-system'`}</span>,
                {'\n    '}target: <span className="text-amber-200">{`'figma-desktop'`}</span>,
                {'\n  '}{'}'},
                {'\n'}{'}'})
                {'\n'}
                {'\n'}
                <span className="text-text-muted">
                  // Result: Figma desktop opens the new file.
                </span>
                {'\n'}
                <span className="text-text-muted">
                  // Designer iterates from there, not from blank canvas.
                </span>
              </code>
            </pre>
          </div>
        </div>

        {/* Blockers */}
        <div className="mb-12">
          <h2 className="font-display text-xl lg:text-2xl font-semibold text-text-primary mb-2">
            What's blocking it today
          </h2>
          <p className="text-sm text-text-muted mb-6 max-w-2xl">
            Three real constraints make this a future-state feature rather than a shippable
            today. None of them are unfixable, but each is upstream of this app.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {BLOCKERS.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border border-surface-border bg-surface px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="h-4 w-4 text-rose-300 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-text-primary mb-1">
                      {b.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">{b.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture sketch */}
        <div className="mb-12">
          <h2 className="font-display text-xl lg:text-2xl font-semibold text-text-primary mb-2">
            Architecture sketch
          </h2>
          <p className="text-sm text-text-muted mb-6 max-w-2xl">
            Four components, one direction of dataflow. The first piece already ships in this
            app. The next three are what you wire up once MCP is stable.
          </p>
          <ol className="space-y-3 max-w-2xl">
            {ARCHITECTURE.map((arch, i) => (
              <li
                key={arch.label}
                className="flex items-start gap-3 rounded-lg border border-surface-border bg-surface px-4 py-3"
              >
                <span className="font-mono text-xs text-accent shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="font-display text-sm font-semibold text-text-primary">
                    {arch.label}
                  </div>
                  <div className="text-xs text-text-muted leading-relaxed mt-0.5">
                    {arch.detail}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Closing note */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 lg:p-8">
          <p className="font-display text-base sm:text-lg text-text-primary leading-relaxed max-w-2xl">
            Why ship the button before the integration? Because the value of this feature is
            answering, "what would the workflow even look like." Once you can answer that
            concretely, the integration is a matter of wiring. Until you can, you're guessing.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/wireframe"
            className="inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-surface hover:bg-surface-hover hover:border-accent/40 px-4 h-10 text-sm font-medium text-text-primary transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to wireframe gallery
          </Link>
          <Link
            href="/wireframe/manufacturing-throughput"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent text-base-900 hover:bg-accent-light px-4 h-10 text-sm font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
          >
            See an example wireframe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  )
}
