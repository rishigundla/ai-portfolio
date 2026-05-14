# dashboard-factory

**Project 01 of 5** — Instant Analytics Dashboard Factory. Pick a sample dataset, watch Claude profile it via streaming, get a fully designed interactive dashboard.

**Live**: <https://ai-portfolio-dashboard-factory.vercel.app> &nbsp;·&nbsp; **Case study**: [`docs/case-studies/dashboard-factory.md`](../../docs/case-studies/dashboard-factory.md) &nbsp;·&nbsp; **Status**: Production

---

## Two modes, one engine

### Ad-hoc dashboard mode (business users)

> "My VP wants Q3 vs Q2 regional sales for Monday's leadership meeting. I have a CSV. I don't want to file a BI ticket."

Pick from 6 curated sample datasets (RevOps, marketing, IoT telemetry, supply chain, financial complaints, customer demographics). Watch the streaming profiling explain column types and business domain. Get an interactive dashboard with filters, drill-downs (rows / summary stats / distribution tabs), and PDF export.

### Hi-fi wireframe mode (BI engineers, designers)

> "I'm kicking off a new CX dashboard project. I need a clickable hi-fi mockup for Monday's discovery session, but I don't want to spend a week in Figma first."

Pick from 6 dataset-driven wireframes spanning manufacturing, real estate, healthcare, education, SaaS, and logistics. Each layout is generated from the dataset schema by the same chart engine that powers the ad-hoc dashboard. Export-to-Figma modal explains the future-state Figma MCP integration.

## Routes

| Route | Status |
|-------|--------|
| `/` | Live — home with two persona cards |
| `/datasets` | Live — ad-hoc dataset gallery (6 cards) |
| `/generate/[slug]` | Live — streaming profiling animation |
| `/dashboard/[slug]` | Live — interactive dashboard with KPIs + charts + drill-down + PDF export |
| `/wireframe` | Live — wireframe gallery (6 cards) |
| `/wireframe/[slug]` | Live — wireframe rendering with Export-to-Figma modal |

28 of 28 pages prerendered. Zero console errors verified across all routes at 1440×900.

## Architecture (at a glance)

- **Chart engine** in [`lib/dashboard-builder.ts`](./lib/dashboard-builder.ts) — `resolveChartPick(rows, pick, helpers)` dispatches on a discriminated `kind` (bar / line / donut / heatmap / scatter / funnel / histogram) and returns a typed chart spec. Same engine drives both modes.
- **Static fixtures** under [`fixtures/dashboard-factory/`](../../fixtures/dashboard-factory/) — 12 datasets total (6 ad-hoc + 6 wireframe), each a JSON file with rows, schema, and metadata.
- **Wireframe engine** in [`lib/wireframe-engine.ts`](./lib/wireframe-engine.ts) — consumes a dataset + per-slug recommendation and emits a `DashboardLayout` consumable by the shared dashboard view.
- **Zustand persist store** gates navigation from `/generate` → `/dashboard` so users can't view a dashboard for a dataset they haven't profiled.
- **Streaming on `/generate`** replays a hand-curated profiling fixture word-by-word — the AI "thinking" moment is the headline product beat.

Full architecture walkthrough + key technical decisions + engineering moments in the [case study](../../docs/case-studies/dashboard-factory.md).

## Development

```bash
# from repo root
pnpm dev --filter dashboard-factory

# or from this directory
pnpm dev
```

Runs at <http://localhost:3002>.

```bash
pnpm --filter dashboard-factory build       # production build
pnpm --filter dashboard-factory typecheck   # tsc --noEmit
```

## Deployment

Deployed to Vercel on every push to `main`. Production URL: <https://ai-portfolio-dashboard-factory.vercel.app>.

`portfolio.meta.json` carries the project metadata consumed by the [portfolio-site](https://github.com/rishigundla/portfolio-site) project — when `deployedAt` is set and the case study URL is wired, the portfolio site picks up the project card on its next deploy.
