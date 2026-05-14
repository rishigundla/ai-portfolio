# Dashboard Factory — Case Study

> From CSV to interactive dashboard in 60 seconds. Two modes, one engine, zero BI tickets.

**Live**: <https://ai-portfolio-dashboard-factory.vercel.app> &nbsp;·&nbsp; **Source**: [`apps/dashboard-factory`](https://github.com/rishigundla/ai-portfolio/tree/main/apps/dashboard-factory) &nbsp;·&nbsp; **Stack**: Next.js 15, React 19, TypeScript, Tailwind, Recharts, Zustand, Vercel

---

## The problem

In my day job as a senior BI engineer, ad-hoc dashboard requests are a constant. A VP wants Q3 vs Q2 regional sales for Monday's leadership meeting. A product manager wants a quick retention view for an exec readout. The conventional path: file a BI ticket, wait three days, get something that looks like Excel circa 2012, iterate twice.

There's a second pain point on the other side of the same workflow. Before BI engineers build the real dashboard in Tableau or Power BI, they often spend two to four days mocking it up in Figma — for stakeholder discovery, alignment, approvals. That's a separate cycle of pixel-pushing that doesn't ship product.

Two audiences. Two timelines. One underlying cause: dashboard creation is slow, manual, and largely unstructured. The hypothesis behind Dashboard Factory: an AI-powered factory can compress both timelines without sacrificing design quality, by sharing one chart engine across two presentation contexts.

## The approach: two modes, one engine

**Ad-hoc mode** is for the business user. Pick a sample dataset, watch Claude profile it via streaming explanation, get a fully designed interactive dashboard in about 60 seconds. KPIs, charts, filters, drill-downs, PDF export — all generated, all themed to a single design system.

**Wireframe mode** is for the BI engineer or designer. Pick a dataset-driven wireframe instead. The same chart engine renders a hi-fi mockup — five-KPI strip plus four-chart grid — ready to share in a stakeholder discovery session, or hand off to a designer through the future-state Figma MCP integration.

Both modes feed off the same machinery. The chart engine doesn't know which mode it's running in; it just renders typed chart specs. The two modes differ only in where those specs come from: parsed from a streaming AI profile in ad-hoc mode, or sourced from a per-dataset recommendation file in wireframe mode. That shared engine is the wedge — whatever the user picks, they get the same quality output.

## Architecture

```
            ┌─────────────────────────┐
            │   User picks a dataset  │
            └────────────┬────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
       Ad-hoc mode            Wireframe mode
       /generate/:slug        /wireframe/:slug
       │                     │
       ▼                     ▼
   Streaming profile     Per-dataset
   (fixture text,        recommendation
   word-by-word reveal)  (KPIs + ChartPick[])
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
       Chart engine  (lib/dashboard-builder.ts)
       resolveChartPick(rows, pick, helpers)
       discriminated kind: bar | line | donut |
       heatmap | scatter | funnel | histogram
                  │
                  ▼
      Recharts + design-system primitives
                  │
                  ▼
      Interactive dashboard OR
      5-KPI strip + 4-chart grid
```

The repo is a turborepo monorepo. `packages/design-system` exports a Tailwind preset, CSS-variable design tokens, and Radix-based primitives (Dialog, Tabs, Popover, Toast, Select, Command). Every app consumes it. `apps/dashboard-factory` is the Next.js 15 App Router app deployed to Vercel.

Static fixtures power both modes. Twelve datasets in total — six for ad-hoc, six for wireframe — each one a JSON file with rows, schema, and metadata. Schema columns are typed (`measure`, `dimension`, `time`, `id`, `supporting`), which lets the chart engine make typed decisions about which columns can drive which chart kinds.

State management is deliberately minimal. A small Zustand persist store gates navigation from `/generate` → `/dashboard` (you can't view a dashboard for a dataset you haven't profiled). Beyond that, every page is server-rendered, every chart is rendered on the client through Recharts, and every interaction (filters, drill-downs, PDF export) keeps state local.

## Key technical decisions

**Streaming profiling over instant render.** The streaming text on `/generate` takes about eight seconds to finish — a long beat for a feature that could populate in milliseconds. But the streaming *is* the product moment. It's the visible "Claude is thinking" that justifies the whole AI framing. Trade-off paid: viewers wait, but they understand what just happened.

**Data-driven wireframe engine, not hand-coded templates.** The initial implementation had three SVG-heavy template components — Executive, Operational, Exploratory — totaling about a thousand lines. The pivot replaced all of it with one engine that consumes a dataset schema plus a recommendation file and emits a `DashboardLayout` consumable by the existing dashboard view. Net deletion: about 1,100 lines. The same machinery now powers both modes.

**Funnel sort heuristic.** The schema-declared lifecycle order (`Active → Completed → Withdrawn → Dropped`) doesn't always produce a funnel-shaped chart, because real-world status counts aren't monotonically decreasing. The builder detects monotonicity and falls back to value-desc sort only when needed — semantic ordering wins when it produces a real funnel, magnitude ordering wins when it doesn't.

**Recharts over D3 or Plotly.** D3 is too low-level; Plotly is too heavy and not React-native. Recharts is the right ceiling — declarative, composable, with enough escape hatches for custom rendering when needed (funnel charts are pure CSS, not Recharts).

## Engineering moments worth telling

The fix saga is the part of the project that taught me the most.

**Tailwind opacity gotcha.** Every `bg-accent/X` class in the app was silently rendering transparent. The CSS variable `--color-accent` was a hex literal (`#2dd4bf`); Tailwind's `<alpha-value>` placeholder generates `rgb(var(--color-accent) / 0.75)` which expands to invalid CSS — `rgb(#2dd4bf / 0.75)`. Browsers drop it. The bug was latent for weeks until an unrelated overlay was removed, exposing transparent funnel bars. Localized fix: solid `bg-accent`. Wider fix (migrate the variable to space-separated RGB) is on the followup list.

**Funnel cone shape.** The original funnel rendered bars left-aligned and in lifecycle order — so a logistics "Loaded(1) → In-Transit(2) → Delivered(30) → Delayed(3)" funnel zigzagged up and down and looked like a horizontal bar chart. Two changes fixed it: detect non-monotonic stages and sort by value descending; center-align bars in the layout. The cone shape now emerges from CSS, not from data preprocessing.

**Dialog centering.** The Export-to-Figma modal opened in the bottom-right quadrant. Cause: the `animate-slide-up` keyframes' final `translate(0, 0)` overwrote the inline `translate(-50%, -50%)` centering with `forwards` fill mode. Fix: a Dialog-specific keyframe with composite transform that preserves both axes' centering translate.

## What I'd do differently

Visual regression testing would have caught the transparent `bg-accent` on day one. A simple Playwright screenshot test against the dataset gallery would have surfaced "wait, why are these badges transparent?" the moment they first appeared. I should have added it as part of the design-system package, not waited for a production bug.

The funnel `mix-blend-screen` overlay was clever but fragile. It relied on a screen-blend trick to make dark text readable on a teal bar — and quietly failed when the bar got narrow. I should have prototyped the chart at varying widths before shipping it; testing only at one width hid the failure mode.

The `--color-accent` migration is real tech debt. The funnel got a workaround (solid color, no opacity); badges across the app still resolve to transparent. The proper fix is migrating the token to space-separated RGB format. Captured, deferred, tracked.

## Future work

The Figma MCP integration is the most interesting next step. The architecture is already there — `WireframeLayout` is a typed handoff object ready for MCP consumption. What's missing is stable MCP server access plus the API budget to justify it for a personal-portfolio project.

Beyond that: more datasets that stress-test chart kinds the existing six don't (HR analytics for cohort tables, security operations for log timelines, e-commerce for purchase funnels). ML-driven KPI suggestions to replace the hand-curated profiling fixtures. Multi-user persistence so dashboards can be saved and shared via URL. Custom domain mapping for the case study itself.

## Footer

This is Project 1 of a five-project AI portfolio. Next up: Project 2, a narrative generator that turns dashboard snapshots into written executive readouts.

- **Live demo**: <https://ai-portfolio-dashboard-factory.vercel.app>
- **Source**: [`apps/dashboard-factory`](https://github.com/rishigundla/ai-portfolio/tree/main/apps/dashboard-factory)
- **Master plan**: [`docs/master-plan.md`](https://github.com/rishigundla/ai-portfolio/blob/main/docs/master-plan.md)
- **Built by**: [Rishikesh Gundla](https://rishikeshgundla.com)
