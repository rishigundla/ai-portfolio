# AI Portfolio

> Five AI-native portfolio projects anchored to real Nutanix SaaS Data Team work.
> Built with Next.js 16, deployed on Vercel, designed to complete the Senior BI Engineer → Data / Analytics Engineer transition.

**Author**: Rishikesh Gundla ([rishikeshgundla.com](https://rishikeshgundla.com))
**Status**: Phase 1 · Week 1 · Day 1 — Foundation
**Build Plan**: [docs/master-plan.md](./docs/master-plan.md) · [docs/plan.html](./docs/plan.html) (rich interactive view)

---

## The Five Projects

| # | Project | Status | Live Demo |
|---|---------|--------|-----------|
| 1 | **Instant Analytics Dashboard Factory** | Not Started | — |
| 2 | **Dashboard-to-Deck Narrative Generator** | Not Started | — |
| 3 | **Smart Metric Anomaly Alerting** | Not Started | — |
| 4 | **AI Sprint Intelligence Dashboard** | Not Started | — |
| 5 | **AI Pipeline Debugger & Self-Healer** | Not Started | — |

Each project is a standalone Next.js app in [`apps/`](./apps/) with its own README, case study, and 90-second Loom video.

---

## Architecture

- **Monorepo**: pnpm workspaces + turborepo
- **Apps**: Next.js 16 App Router, Vercel AI SDK for streaming simulation
- **Shared packages**:
  - `packages/design-system` — tokens, primitives, AI components
  - `packages/ai-core` — streaming replay + fixture generation utilities
- **Data**: Pre-generated JSON fixtures replayed via `streamText` (no runtime Claude API calls)
- **Deployment**: Vercel per app · $0 monthly runtime cost

See [docs/master-plan.md](./docs/master-plan.md) for the full 14-week day-by-day build plan.

---

## Repository Structure

```
ai-portfolio/
├── apps/                           Each AI project as a standalone Next.js app
├── packages/
│   ├── design-system/              @rishi/design-system — tokens + components
│   ├── ai-core/                    @rishi/ai-core — streaming replay
│   ├── eslint-config/              Shared lint config
│   └── typescript-config/          Shared tsconfig bases
├── fixtures/                       Pre-generated AI responses per project
├── docs/
│   ├── master-plan.md              Canonical 14-week build plan
│   ├── plan.html                   Rich interactive view of the plan
│   └── case-studies/               MDX case studies per project
├── scripts/                        Portfolio + resume sync automation
└── .github/workflows/              GitHub Actions (sync, deploy verification)
```

---

## Development

```bash
pnpm install              # install workspace dependencies
pnpm dev                  # run all apps in dev mode
pnpm build                # build all apps + packages
pnpm lint                 # lint across workspaces
pnpm format               # prettier write all files
pnpm check-types          # tsc --noEmit across workspaces
```

---

## Portfolio + Resume Automation

When a project ships with `portfolio.meta.json#deployedAt` populated, GitHub Actions opens PRs on:
- [`rishigundla/portfolio-site`](https://github.com/rishigundla/portfolio-site) — new project card + case study MDX
- [`rishigundla/resume-builder`](https://github.com/rishigundla/resume-builder) — new bullet under AI Projects category

See [Part G of the master plan](./docs/master-plan.md) for details.

---

## License

MIT — feel free to learn from the patterns. The architecture and design system are a reference for building AI-native portfolio projects.
