# AI Portfolio

> Five AI-native portfolio projects anchored to real enterprise SaaS data work.
> Built on Next.js + Vercel with a shared design system. Designed to complete the Senior BI Engineer → Data / Analytics Engineer transition.

**Author**: Rishikesh Gundla [rishikeshgundla.com](https://rishikeshgundla.com)
**Status**: Phase 3 · Project 3 (Sprint Intelligence) live · 320 / 436 tasks · Projects 1 and 2 shipped v1.0, Project 3 wrap-up days W12.D2 to W12.D4 in flight (README + case study + v1.0 tag)
**Live demos**:
- Project 0 (Design System) [ai-portfolio-design-system-docs.vercel.app](https://ai-portfolio-design-system-docs.vercel.app)
- Project 1 (Dashboard Factory) [ai-portfolio-dashboard-factory.vercel.app](https://ai-portfolio-dashboard-factory.vercel.app) · [case study](./docs/case-studies/dashboard-factory.md)
- Project 2 (Narrative Generator) [ai-portfolio-narrative-generator.vercel.app](https://ai-portfolio-narrative-generator.vercel.app) · [case study](./docs/case-studies/narrative-generator.md)
- Project 3 (Sprint Intelligence) [ai-portfolio-sprint-intelligence.vercel.app](https://ai-portfolio-sprint-intelligence.vercel.app) · case study lands W12.D3

**Plan**: [docs/master-plan.md](./docs/master-plan.md) · [docs/plan.html](./docs/plan.html) (interactive)

---

## The Five Projects

| # | Project | What it does | Status | Live |
|---|---------|--------------|--------|------|
| 0 | [Design System Docs](./apps/design-system-docs/) | Showcase of tokens, primitives, AI components | **Live** | [link](https://ai-portfolio-design-system-docs.vercel.app) |
| 1 | [Instant Analytics Dashboard Factory](./apps/dashboard-factory/) | Pick a sample dataset → streaming AI profiling → interactive dashboard | **Live** · [case study](./docs/case-studies/dashboard-factory.md) | [link](https://ai-portfolio-dashboard-factory.vercel.app) |
| 2 | [Dashboard-to-Deck Narrative Generator](./apps/narrative-generator/) | Sample dashboard → streaming AI readout → themed PPTX download | **Live** · [case study](./docs/case-studies/narrative-generator.md) | [link](https://ai-portfolio-narrative-generator.vercel.app) |
| 3 | [AI Sprint Intelligence Dashboard](./apps/sprint-intelligence/) | Monthly sprints → filterable KPI dashboard + activity heatmap → AI meeting brief | **Live** (case study lands W12.D3) | [link](https://ai-portfolio-sprint-intelligence.vercel.app) |
| 4 | Smart Metric Anomaly Alerting | Curated anomalies → AI root-cause narration with correlation analysis | Not started | — |
| 5 | AI Pipeline Debugger & Self-Healer | PySpark failure scenarios → AI diagnosis + patch + mock Slack approval | Not started | — |

Each app has its own `README.md`, `portfolio.meta.json`, and case study in [`docs/case-studies/`](./docs/case-studies/). Project 1 is the first to close — see the [Dashboard Factory case study](./docs/case-studies/dashboard-factory.md).

---

## Architecture

```mermaid
flowchart TB
    subgraph packages["packages/ · shared infrastructure"]
        DS["@rishi/design-system<br/>tokens · primitives · AI components · motion"]
        AI["@rishi/ai-core<br/>replayFixture · generate · types · prompts"]
        TS["@repo/typescript-config<br/>base · nextjs · react-library"]
        EL["@repo/eslint-config<br/>base · next · react"]
    end

    subgraph apps["apps/ · 6 Next.js apps on Vercel"]
        DSD["design-system-docs<br/>(live)"]
        P1["dashboard-factory<br/>(Project 1)"]
        P2["narrative-generator<br/>(Project 2)"]
        P3["sprint-intelligence<br/>(Project 3)"]
        P4["anomaly-alerting<br/>(Project 4)"]
        P5["pipeline-healer<br/>(Project 5)"]
    end

    subgraph data["fixtures/ · pre-generated AI responses"]
        F1["dashboard-factory/"]
        F2["narrative-generator/"]
        F3["anomaly-alerting/"]
        F4["sprint-intelligence/"]
        F5["pipeline-healer/"]
    end

    DS --> DSD
    DS --> P1
    DS --> P2
    DS --> P3
    DS --> P4
    DS --> P5

    AI --> DSD
    AI --> P1
    AI --> P2
    AI --> P3
    AI --> P4
    AI --> P5

    TS --> DS
    TS --> AI
    TS --> DSD

    F1 -.consumed by.-> P1
    F2 -.consumed by.-> P2
    F3 -.consumed by.-> P3
    F4 -.consumed by.-> P4
    F5 -.consumed by.-> P5
```

### Why this shape works

- **One design system, six surfaces.** Every visual surface — 5 demo apps + 1 showcase site — imports from `@rishi/design-system`. Change a token once, all six update.
- **One streaming primitive, six use cases.** `@rishi/ai-core`'s `replayFixture` is the single way streaming AI output is handled across every app. Apps don't reinvent the streaming animation; they pass a fixture + config.
- **Fixtures sit beside code.** Pre-generated AI responses live in `fixtures/` at the repo root, committed to git, reviewed as regular source files. No runtime API calls, no hidden cost.
- **TurboRepo + pnpm workspaces.** Packages rebuild only when their inputs change. Vercel's turborepo integration deploys any app from the same monorepo by just setting a different Root Directory.

---

## Repository Structure

```
ai-portfolio/
├── apps/                           6 Next.js apps on Vercel
│   └── design-system-docs/         ← live: showcases all design system exports
├── packages/
│   ├── design-system/              @rishi/design-system
│   │   ├── src/tokens/             CSS variables
│   │   ├── src/primitives/         14 Radix-backed components
│   │   ├── src/components/         5 AI-specific composed components
│   │   └── src/motion/             Framer Motion variants
│   ├── ai-core/                    @rishi/ai-core
│   │   ├── src/replay.ts           Streaming replay primitive
│   │   ├── src/generate.ts         Dev-only Anthropic SDK wrapper
│   │   ├── src/prompts/            System prompts for all 5 projects
│   │   └── src/types/              Fixture, Scenario, StreamConfig
│   ├── eslint-config/              Shared lint config
│   └── typescript-config/          Shared tsconfig bases
├── fixtures/                       Pre-generated AI responses per project
├── docs/
│   ├── master-plan.md              Canonical 14-week day-by-day plan
│   ├── plan.html                   Interactive plan dashboard
│   └── case-studies/               Per-project MDX case studies
├── scripts/                        Portfolio + resume sync automation (Week 4)
└── .github/workflows/              GitHub Actions (Week 4)
```

---

## Development

```bash
pnpm install                        # install workspace dependencies
pnpm dev --filter design-system-docs  # run the live showcase at :3001
pnpm build                          # build all apps + packages
pnpm lint                           # lint across workspaces
pnpm format                         # prettier write all files
pnpm check-types                    # tsc --noEmit across workspaces
```

Per-app scripts delegated through Turborepo — run `pnpm --filter <app-name> <script>` to scope.

---

## Tech Stack

- **Framework**: Next.js 15.1 App Router with Turbopack
- **Language**: TypeScript 5.9 with strict mode
- **Styling**: Tailwind 3.4 with a shared preset
- **Primitives**: Radix UI (9 packages)
- **Motion**: Framer Motion 11 + CSS keyframes
- **Markdown**: react-markdown + remark-gfm
- **AI**: Vercel AI SDK + Anthropic SDK (dev-only)
- **Monorepo**: pnpm workspaces + Turborepo
- **Deploy**: Vercel per app

---

## Automation (shipping Week 4)

When an app ships with `apps/<project>/portfolio.meta.json#deployedAt` populated, a GitHub Action will open pull requests on:

- [`rishigundla/portfolio-site`](https://github.com/rishigundla/portfolio-site) — new project card + case study MDX
- [`rishigundla/resume-builder`](https://github.com/rishigundla/resume-builder) — new bullet under AI Projects category

See [Part G of the master plan](./docs/master-plan.md) for the automation design.

---

## Conventions

- **No runtime AI calls.** Every deployed app streams pre-generated fixtures. `$0/month` runtime cost.
- **No `[x]` without verification.** Checking a task means the outcome is observable. When downstream validation is required, tasks stay at `[~]` until validated.
- **Plan MD and plan HTML stay in sync.** Daily updates touch both `docs/master-plan.md` and `docs/plan.html`.
- **Commits are factual.** No AI co-author tags unless explicitly requested. Commit messages state what changed and why.

---

## License

MIT — reuse any pattern you find useful. The architecture is deliberately reusable for anyone building an AI-native portfolio on Vercel.
