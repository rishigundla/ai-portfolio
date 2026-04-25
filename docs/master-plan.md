# AI Portfolio Projects — Master Plan (v3)

> **Owner**: Rishikesh Gundla
> **Current Role**: Senior BI Engineer @ Nutanix · SaaS Data Team
> **Target Roles**: Data Engineer, Analytics Engineer, AI Data Engineer, AI Engineer
> **Repo**: `rishigundla/ai-portfolio` (public, to be created)
> **Plan Version**: 3.0 — includes day-by-day tracker and progress log
> **Last Plan Update**: 2026-04-24

---

# PART A — LIVE PROGRESS TRACKER

## Current Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 1 — Project 1 (Dashboard Factory) |
| **Current Week** | Week 1 of 14 |
| **Current Day** | Week 2 · Day 9 (Tue) — Sample Dataset Fixtures |
| **Overall Progress** | 52 tasks of 98 complete · Phase 0 ✓ · Week 1 ✓ · Week 2 Day 1 ✓ |
| **Status** | Project 1 scaffolded. `apps/dashboard-factory/` live in monorepo with hero + two persona cards + how-it-works section. Build clean (106 kB First Load JS). Pushed to GitHub. |
| **Next Action** | Week 2 Day 2: Author 6 sample dataset JSON fixtures in `fixtures/dashboard-factory/datasets/` (RevOps Sales, Marketing Campaigns, Pulse Telemetry, Supply Chain, Financial Complaints, Customer Demographics) with metadata for thumbnail / domain / color token. |
| **Blockers** | None |

### Phase Progress Overview

| Phase | Project | Weeks | Days | Progress | Status |
|-------|---------|-------|------|----------|--------|
| 0 | Pre-flight setup | — | — | 0 / 5 | Not Started |
| 1 | Project 1 · Dashboard Factory | 1-4 | 28 | 0 / 28 | Not Started |
| 2 | Project 2 · Narrative Generator | 5-6 | 14 | 0 / 14 | Not Started |
| 3 | Project 4 · Sprint Intelligence | 7-8 | 14 | 0 / 14 | Not Started |
| 4 | Project 3 · Anomaly Alerting | 9-11 | 21 | 0 / 21 | Not Started |
| 5 | Project 5 · Pipeline Self-Healer | 12-14 | 21 | 0 / 21 | Not Started |

**Status Legend**: `[ ]` Not Started · `[~]` In Progress · `[x]` Completed · `[!]` Blocked · `[-]` Skipped

---

## Recent Activity Log

_Last 7 days of work, kept rolling. Older entries archived per-phase below._

### 2026-04-25 · Week 2 Day 1 — Project 1 (dashboard-factory) scaffolded
- Created `apps/dashboard-factory/` mirroring the design-system-docs setup pattern (the foundation pays off — Day 1 of the new app took ~30 mins instead of a full day)
- 13 files: package.json (workspace deps on design-system + ai-core, port 3002), tsconfig (extends nextjs base), next.config.mjs (transpilePackages for both shared packages), tailwind.config.ts (presets [@rishi/design-system/tailwind.config]), postcss.config.js, next-env.d.ts, .gitignore, app/layout.tsx, app/_components/Nav.tsx (gradient "DF" logo mark + "Project 01" badge), app/globals.css, app/page.tsx, portfolio.meta.json, README.md
- **Landing page composition**:
  - Hero: eyebrow chip "Project 01 · Instant Analytics", title "Dashboards in **minutes**, not days." (with gradient on the word "minutes"), subtitle, two CTAs (Browse sample datasets → /datasets, Try wireframe mode → /wireframe)
  - Two persona cards stacked side-by-side: "Ad-hoc dashboard mode" (Business User) with the VP/CSV/Monday quote pulled from the master plan, "Hi-fi wireframe mode" (BI Engineer) with the discovery-session quote — both quotes rendered in serif italic with accent left-border
  - "How it works" section with 3 numbered step cards (Pick / Profile / Get dashboard)
- Footer pulls in the rishikeshgundla.com personal site link plus the monorepo
- Build: 4 static pages, **/ at 106 kB First Load JS** — exact match to design-system-docs baseline (no extra deps pulled in for Day 1)
- Typecheck clean, build clean
- Commit `aaf597b` pushed to main
- **Context for Day 9 (Tue)**: Authoring the 6 sample dataset fixtures in `fixtures/dashboard-factory/datasets/`. Each fixture is a JSON file with: 50 sample rows (realistic Nutanix-style anonymised data), metadata (display name, domain, recommended color token, row count, thumbnail path placeholder), schema description. These are CONSUMED by the gallery UI (Day 3) and profiling animation (Day 4). Generate using Faker patterns + manual curation for realism — not Anthropic API.
- **Next**: Week 2 Day 2 — Sample dataset fixtures

### 2026-04-24 · Day 7 complete — Week 1 WRAPPED
- Verified post-refactor deploy at https://ai-portfolio-design-system-docs.vercel.app/components — all 5 component sections render, "Simulate Claude streaming" button live, `replayFixture` from ai-core working in production
- Rewrote `packages/design-system/README.md` — previous version stopped at Day 2; now documents all tokens + 14 primitives + 5 AI components + motion variants with quick-start examples
- Rewrote monorepo root `README.md` with:
  - Live status line (44 / 98 tasks, links to live demo + plan)
  - Status table for all 6 apps (design-system-docs live, Projects 1-5 not started)
  - Mermaid architecture diagram showing packages → apps → fixtures relationships
  - Repository structure tree
  - Dev commands (`pnpm install`, `pnpm dev --filter`, etc.)
  - Tech stack summary
  - Conventions (no runtime AI, no premature [x], plan sync)
- `packages/ai-core/README.md` already current from Day 6 — no update needed
- **Week 1 is officially complete.** All foundation work done: monorepo, design system, AI core, first deploy, integration-tested. Week 2 starts building the first real AI app (Dashboard Factory).
- **Context for Week 2**: Everything downstream apps need is in place. Next 21 days (Weeks 2-4) build Project 1 using only `@rishi/design-system` + `@rishi/ai-core` + per-app fixtures. No more foundation work until the automation in Week 4.
- **Next**: Week 2 Day 1 — scaffold `apps/dashboard-factory/`

### 2026-04-24 · Day 6 complete — @rishi/ai-core implemented + integration-tested
- Fully wired up `packages/ai-core` (was placeholder since Day 1)
- Five TypeScript files:
  - `src/types/index.ts` — `Scenario`, `Fixture`, `FixtureMetadata`, `StreamConfig`, `AiNarrative`
  - `src/replay.ts` — core streaming primitives: `replayFixture` (async generator yielding accumulated text), `replayFixtureToString` (Promise<string> collector), `fixtureToReadableStream` (native web ReadableStream for `Response()`), `ReplayAbortedError`, `DEFAULT_STREAM_CONFIG` (40 cps, 300ms initial delay, 20% jitter)
  - `src/generate.ts` — dev-only Anthropic SDK wrapper: `generateFixture` + `generateFixtures` with optional prompt caching (90% cost reduction on repeat system prompts). Uses `claude-sonnet-4-6` by default.
  - `src/prompts/index.ts` — system prompts for all 5 projects (DASHBOARD_PROFILING, DASHBOARD_NARRATIVE, ANOMALY_RCA, SPRINT_BRIEF, PIPELINE_DIAGNOSIS)
  - `src/index.ts` — barrel that intentionally excludes `generate.ts` so client bundles never pull in `@anthropic-ai/sdk`
- Added deps: `@anthropic-ai/sdk` 0.40.0, `ai` (Vercel AI SDK) 4.0.22, `@types/node` 22.10.5
- tsconfig uses `moduleResolution: Bundler` (same as design-system) for relative imports without `.js` extensions
- **Integration test**: refactored `apps/design-system-docs/app/components/page.tsx` streaming demo to use `replayFixture` from ai-core instead of raw `setInterval`. Added proper `AbortController` with `useEffect` cleanup to prevent orphan streams on route navigation.
- Build validation: `/components` page size grew by only **0.8 kB** (86.2 → 87.0 kB), proving dev-only code is excluded from the client bundle.
- Typecheck clean across ai-core + design-system-docs
- Commit `7e55b7d` pushed to main — Vercel auto-redeploying the showcase
- **Context for Day 7**: Week 1 is effectively done. Day 7 is pure polish — READMEs per package, monorepo-level README with Mermaid architecture diagram, final design-system-docs visual QA.
- **Next**: Day 7 — Week 1 polish and wrap

### 2026-04-24 · First deploy LIVE — design-system-docs on Vercel
- Deployed via Vercel dashboard with Root Directory `apps/design-system-docs`, default turborepo auto-detection
- Public URL: **https://ai-portfolio-design-system-docs.vercel.app**
- Verified render via WebFetch — home page returns correct hero eyebrow, title, 3 catalog card titles, and install snippet mentioning `@rishi/design-system`
- `portfolio.meta.json` updated with `liveUrl` + `deployedAt: 2026-04-24`
- Phase 1 first concrete milestone: the portfolio now has a publicly accessible asset
- **Next**: Day 6 — Implement `@rishi/ai-core` (streaming replay + generate + types)

### 2026-04-24 · Day 5 complete — Design system showcase app built
- Scaffolded `apps/design-system-docs/` manually (not `create-next-app`) for monorepo precision — all configs hand-written with proper workspace wiring
- Framework: Next.js 15.1.6 App Router · React 19 · TypeScript · Tailwind 3.4.17
- Key config: `transpilePackages: ['@rishi/design-system']` in next.config.mjs (the one line most monorepo tutorials miss — without it, Next.js can't consume TSX source from workspace packages)
- Tailwind: `presets: [baseConfig]` from `@rishi/design-system/tailwind.config` + content globs include design-system source so all its utilities are emitted
- Globals.css imports `@rishi/design-system/tokens` at the top, then Tailwind layers — CSS variables are hydrated before any component mounts
- 4 routes:
  - `/` — Hero + catalog cards linking to 3 category pages + install code snippet
  - `/tokens` — Live swatches (accent family, base-900→600 scale, surface/text, status/severity palette), typography samples for all 3 font families, CSS keyframe demos (pulse-glow, float, fade-in), elevation showcase (card / card-hover / glow-lg)
  - `/primitives` — All 14 primitives with live variants: Button (6×4), Card (composed), Badge (6×3), Input+Label pair, Dialog with trigger, Popover, Tooltip, Tabs, Select, Combobox (with live state), Avatar
  - `/components` — Interactive AI component demos: KpiCard 4-state grid, ChartCard with SVG bar mock + loading variant, **AiNarrativeBlock with click-to-simulate Claude streaming at ~40 chars/sec** (this proves the streaming UX works end-to-end — it's the exact pattern all 5 apps will use), FilterBar with live state, DataGrid with sortable + paginated sample data
- Shared components at `app/_components/`: Nav (sticky with gradient logo mark), Section + SubSection (consistent header pattern)
- Build: 4 static pages generated, 10.6s compile, `/` First Load JS 105 kB, `/components` heaviest at 223 kB (framer-motion + react-markdown)
- Hit and fixed: `lucide-react` needed to be declared as direct dep in the app even though design-system imports it — pnpm workspace transitives aren't auto-resolved for direct imports. Resolved by adding explicit dep.
- `portfolio.meta.json` scaffolded with `deployedAt: null` (flipped to date once Vercel deploys)
- README per app with dev/build/deploy instructions
- Commit `516ceb7` pushed to main
- **Context for Day 6**: Design system is fully documented and browseable locally via `pnpm dev --filter design-system-docs`. To go live, you need to connect the repo to Vercel (one-time, handles all 6 future apps automatically). Once deployed, update `portfolio.meta.json` with liveUrl + deployedAt.
- **Next**: Day 6 — Implement `@rishi/ai-core` (currently placeholder). This is the streaming replay infrastructure that every app will use for fake-Claude streaming from pre-generated fixtures.

### 2026-04-24 · Day 4 complete — AI components + motion variants
- Built 5 AI-specific components in `packages/design-system/src/components/`:
  - `KpiCard.tsx`: value + unit + directional delta badge (up/down/neutral with invertGood option for churn-style metrics) + inline SVG sparkline + 4 states (ready/loading skeleton/empty/error) + Framer slideUp on mount
  - `ChartCard.tsx`: themed container that accepts any chart library as children; 4 states (ready/loading/empty/error) with skeleton bars, empty inbox icon, and error alert; optional actions slot top-right
  - `AiNarrativeBlock.tsx`: markdown renderer using react-markdown + remark-gfm with custom components matched to tokens (accent `→` list bullets, accent inline code, teal links); 3 variants (default/accent/muted); blink cursor when `streaming=true` — this is the core component for Claude-generated content across all 5 apps
  - `FilterBar.tsx`: compound component with sub-components (`.Search`, `.Select`, `.DateRange`, `.Clear`); 6 preset date ranges (7d/30d/90d/qtd/ytd/all); uses Select primitive internally
  - `DataGrid.tsx`: sortable columns with 3-state cycle (asc → desc → clear), pagination with page-of-pages display, row click handler, per-column render function, automatic numeric vs string comparator, align/width/className overrides
- Created `src/motion/index.ts` with Framer Motion variants matching the CSS keyframes: easings (out/in/inOut/smooth/elastic), durations (fast through slower), variants (fadeIn, fadeOut, slideUp, slideDown, slideLeft, scaleIn, staggerContainer, staggerItem, pulseGlow, float), shared transitions and layoutTransition
- Added deps: `framer-motion` 11.15.0, `react-markdown` 9.0.3, `remark-gfm` 4.0.0 (+100 total new packages)
- Updated `package.json` exports to expose `./components` barrel
- Created `src/components/index.ts` barrel
- `pnpm install` clean, `pnpm tsc --noEmit` clean
- Commit `5658a44` pushed to main
- **Context for Day 5**: Design system is feature-complete. Day 5 ships the public showcase site that renders every token + primitive + component with live examples, serving as both internal documentation and visible proof of the design system's polish.
- **Next**: Day 5 — Create `apps/design-system-docs/` Next.js 16 project

### 2026-04-24 · Day 3 complete — 13 shadcn primitives themed to tokens
- Manually set up shadcn pattern inside `packages/design-system/` (CLI is app-oriented, not library-friendly for monorepos — correct engineering choice)
- Installed 16 new deps: 9 @radix-ui/* packages + class-variance-authority + clsx + tailwind-merge + cmdk + lucide-react + react + react-dom + @types/react
- Created `src/lib/cn.ts` — clsx + tailwind-merge utility used by all primitives
- Built 14 primitive files in `src/primitives/`:
  - `button.tsx` (6 variants × 4 sizes via cva)
  - `card.tsx` (Card + Header/Title/Description/Content/Footer composition)
  - `badge.tsx` (6 variants × 3 sizes for status display)
  - `input.tsx` (with accent-ring focus state)
  - `label.tsx` (Radix accessible label)
  - `dialog.tsx` (Modal with animated overlay)
  - `tabs.tsx` (Accent-highlighted active tab)
  - `tooltip.tsx` (Directional animations)
  - `popover.tsx` (Portal-rendered with slide-up animation)
  - `select.tsx` (Complete dropdown with scroll buttons)
  - `toast.tsx` (4 variants with viewport + actions)
  - `command.tsx` (cmdk-based command palette)
  - `combobox.tsx` (Composed: Command + Popover + Button)
  - `avatar.tsx` (Image + fallback)
  - `index.ts` (barrel)
- Fixed TS moduleResolution from `NodeNext` → `Bundler` (correct for React libs consumed by bundlers; the NodeNext default would require `.js` extensions on every import)
- `pnpm install` clean (+62 packages), `pnpm tsc --noEmit` clean
- Commit `f7e2874` pushed to main
- **Context for Day 4**: All primitives exported via `@rishi/design-system/primitives`. Tokens, primitives, and Tailwind preset are ready for composition into AI-specific components.
- **Next**: Day 4 — Build KpiCard, ChartCard, AiNarrativeBlock, FilterBar, DataGrid + motion variants

### 2026-04-24 · Day 2 complete — Design system tokens extracted
- Created `packages/design-system/src/tokens/` with 7 files: `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `shadows.css`, `index.css` (barrel), `index.ts` (typed exports)
- `colors.css`: teal accent (`#2dd4bf`), base-900→600 scale, surface/text/status/severity tokens, dark + light theme variants
- `typography.css`: Space Grotesk + JetBrains Mono + Source Serif 4 font face imports + size/weight/line-height/tracking scales
- `spacing.css`: 4px base spacing scale, radius scale, container widths, border widths
- `motion.css`: durations, easings, keyframes (fadeIn, slideUp, pulseGlow, float, gridFlow, shimmer, blink) + utility classes
- `shadows.css`: elevation system + accent glow shadows + card variants + focus rings
- `tailwind.config.ts`: shared Tailwind preset that all 5 apps will consume via `presets: [baseConfig]`
- `tsconfig.json`: extends `@repo/typescript-config/react-library`
- `package.json`: added `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono`, `@fontsource/source-serif-4` dependencies + `tailwindcss` 3.4.17 + `typescript` 5.9.2 devDeps
- README: full usage documentation with consumer examples
- `pnpm install` succeeded; `pnpm tsc --noEmit` clean
- Commit `f23762e` pushed to main
- **Context for Day 3**: Design system tokens ready. Next is installing shadcn primitives and theming them. Note: used Tailwind v3.4.17 (stable, matches portfolio-site) instead of v4 to avoid v4 breaking changes — can upgrade later.
- **Next**: Day 3 — Install shadcn primitives

### 2026-04-24 · Day 1 complete — Monorepo scaffolded and live on GitHub
- Installed pnpm 10.33.2 globally
- Created GitHub repo `rishigundla/ai-portfolio` (public)
- Scaffolded monorepo at `C:\Users\Rishi\Documents\ai-portfolio` with `create-turbo@latest`
- Removed default `apps/web`, `apps/docs`, `packages/ui` from starter
- Created placeholder `packages/design-system` (@rishi/design-system) and `packages/ai-core` (@rishi/ai-core) with README + package.json
- Created `fixtures/`, `scripts/`, `docs/case-studies/`, `.github/workflows/` directories
- Copied master-plan.md and plan.html (interactive dashboard) into `docs/`
- Wrote custom root README (portfolio overview, architecture, development commands, automation notes)
- Added `.prettierrc`
- Committed + pushed to main at https://github.com/rishigundla/ai-portfolio
- **Context for Day 2**: `packages/design-system` has empty `src/tokens/`, `src/primitives/`, `src/components/`, `src/motion/` subdirectories ready. Source material is `C:\Users\Rishi\Documents\portfolio-site\tailwind.config.js` (teal `#2dd4bf`, Space Grotesk, base-900→600 scale, motion keyframes).
- **Next**: Day 2 — Extract Tailwind tokens into CSS variables

### 2026-04-24 · Plan finalized (earlier)
- Locked all 5 projects, final architecture (Vercel + pre-generated fixtures), 14-week build sequence
- Locked GitHub repo name, monorepo tool (pnpm + turborepo), deployment strategy, automation design
- Master plan doc v3 finalized with day-by-day tracking

---

## Daily Workflow — How to Use This Doc

**At the start of each day**:
1. Open this file
2. Check "Current Status" at top — confirms where we are
3. Scroll to the current day's section in Part C (the 14-Week Plan)
4. Read the day's planned tasks
5. Read "Context for Next Session" from the previous day's entry

**During the day**:
- Update task checkboxes from `[ ]` → `[~]` when starting
- Mark `[x]` when complete

**At the end of each day**:
1. Mark all completed tasks `[x]`
2. Add entry to "Recent Activity Log" with: what was done, blockers (if any), next action
3. Update "Current Status" at top (day number, progress count)
4. Fill in the day's "Context for Next Session" so tomorrow's session starts with clarity

This way, starting fresh tomorrow means reading only: Current Status + Recent Activity Log + Today's planned section. ~30 seconds of context reload.

---

# PART B — STRATEGIC CONTEXT

## Why These Projects

Existing portfolio (Tableau, Power BI, Databricks, SQL) demonstrates traditional BI + data engineering. It does NOT yet show AI-native systems built on top of that foundation. These 5 projects fill that gap with AI-powered systems anchored to real Nutanix work.

## How They Map to Nutanix Work

| Project | Nutanix Anchor | What It Pushes Further |
|---------|----------------|------------------------|
| 1. Dashboard Factory | Enterprise Dashboard Design System (Figma) + Figma MCP | Automates hi-fi wireframes + ad-hoc dashboards |
| 2. Narrative Generator | Marketing Weekly, ACV/GRR Weekly, Balanced Scorecard QBR, CX OKR QBR | PDF → polished stakeholder slide deck with AI insights |
| 3. Anomaly Alerting | Pulse SSOT (NAI/NC2/NCI), RevOps SSOT, CX OKR | AI root-cause narration on Gold-layer KPIs |
| 4. Sprint Intelligence | Jira SSOT Data Portal + Project Progress/Velocity | Auto-curated Monday sprint-review prep |
| 5. Pipeline Self-Healer | All SSOT pipelines | AI-diagnosed and auto-healed PySpark Medallion failures |

## AI Tooling Stack (Already in Use Daily)

- Claude Code, Cursor AI
- Figma MCP (hi-fi mockups)
- PostgreSQL MCP (database interaction)
- Genie Space (conversational analytics on Gold tables)
- GitHub MCP (repo operations)

---

# PART C — THE 5 PROJECTS

## Project 1 — Instant Analytics Dashboard Factory

### One-Line Pitch
Gallery of curated sample datasets. Pick one, watch Claude profile it via streaming animation, get a fully designed interactive dashboard. Also a power-user wireframe mode for hi-fi mockups.

### Demo Scope (Option C — pre-generated)
- 6 curated sample datasets (RevOps Sales, Marketing Campaigns, Pulse Telemetry, Supply Chain, Financial Complaints, Customer Demographics)
- Pre-generated profiling + dashboard configuration per dataset
- 3 wireframe templates (Executive, Operational, Exploratory)

### Why It Wins Interviews
Your Enterprise Dashboard Design System productised. Shows: design system expertise, business-user + power-user UX thinking, AI orchestration. Directly extends your Nutanix Figma MCP workflow.

### Tech Stack
- Next.js 16 App Router · Vercel
- `@rishi/design-system` (tokens + shadcn primitives)
- Recharts for visualizations
- `@react-pdf/renderer` for export
- Vercel AI SDK for streaming simulation
- Pre-generated fixtures in `/fixtures/dashboard-factory/`

### Scope: 4 weeks (Weeks 1-4)

---

## Project 2 — Dashboard-to-Deck Narrative Generator

### One-Line Pitch
Gallery of curated sample dashboards. Pick one, see the PDF preview, watch Claude generate the narrative, download a polished PPTX ready for the stakeholder meeting.

### Demo Scope (Option C — pre-generated)
- 4-6 sample dashboards (ACV & GRR Weekly, Marketing Weekly, Balanced Scorecard, CX OKR Quarterly)
- Pre-generated narrative + talking points per dashboard
- Pre-generated PPTX files stored in Vercel Blob for download
- Simulated Slack / email delivery UI

### Why It Wins Interviews
Automates the exact manual workflow your RevOps / Marketing teams do every Monday. Directly extends your "data storytelling" resume bullet. Shows semantic understanding (PDF → structured KPIs → narrative → slide deck).

### Tech Stack
- Next.js 16 App Router · Vercel
- `pptxgenjs` for slide generation (pure JS, no Python)
- PDF preview via `pdfjs-dist`
- Vercel Blob for PPTX storage
- Pre-generated fixtures in `/fixtures/narrative-generator/`

### Scope: 2 weeks (Weeks 5-6)

---

## Project 3 — Smart Metric Anomaly Alerting

### One-Line Pitch
Dashboard of synthetic Pulse/RevOps/CX historical data. Gallery of curated anomaly scenarios. Click one → streaming AI root cause explanation with correlation analysis.

### Demo Scope (Option C — pre-generated)
- Historical data for NAI/NC2/NCI Pulse metrics + RevOps ACV/GRR + CX CSAT/NPS
- 6-8 curated anomaly scenarios
- Pre-generated RCAs with correlation hypotheses, confidence scores, recommended actions
- Simulated MLflow-style trace view
- Simulated deployment log for context

### Why It Wins Interviews
Vendor tools detect anomalies; this explains WHY. Correlation-aware causation engine is the hard part. Demonstrates the shift from reactive to proactive analytics your Q12 interview answer references.

### Tech Stack
- Next.js 16 App Router · Vercel
- Recharts for time-series + correlation heatmaps
- Vercel KV for user session (selected scenario)
- Pre-generated fixtures in `/fixtures/anomaly-alerting/`

### Scope: 3 weeks (Weeks 9-11)

---

## Project 4 — AI Sprint Intelligence Dashboard

### One-Line Pitch
Dropdown selector for synthetic sprint weeks. Pick a sprint → dashboard populates with team + individual KPIs → streaming AI meeting brief appears on top with workload rebalancing recommendations.

### Demo Scope (Option C — pre-generated)
- 3-4 synthetic sprint weeks of Jira-SSOT-style data
- Pre-generated AI meeting briefs per sprint
- All KPIs computed in-browser from static JSON (no Postgres needed)
- Sprint burndown, velocity, cycle time, scope creep, carryover, blocked tickets
- Per-engineer workload deep dives

### Why It Wins Interviews
Directly extends your Jira SSOT Data Portal work at Nutanix. Auto-curated before-meeting brief is a universally recognized pain point. Shows end-to-end thinking: data model → aggregation → narrative → recommendation.

### Tech Stack
- Next.js 16 App Router · Vercel
- Static JSON fixtures (no database)
- Recharts for sprint metrics
- Pre-generated fixtures in `/fixtures/sprint-intelligence/`

### Scope: 2 weeks (Weeks 7-8)

---

## Project 5 — AI Pipeline Debugger and Self-Healer

### One-Line Pitch
Gallery of curated PySpark Medallion pipeline failures. Pick one (SCHEMA_DRIFT, NULL_EXPLOSION, DATA_SKEW, etc.) → streaming diagnosis → generated PySpark patch → mock Slack approve/reject UI.

### Demo Scope (Option C — pre-generated)
- 6-8 failure scenarios based on real Nutanix pain points (Q14 + Q17 interview stories)
- Pre-generated diagnoses + PySpark patches per scenario
- Schema diff visualization
- Sample-first validation simulation
- Mock Slack approval UI with approve/reject/escalate buttons
- MTTR trend chart, incident history timeline
- Per-category breakdown dashboard

### Why It Wins Interviews
Signature Data Engineer project. Maps directly to your Q17 (Jira SSOT Silver-layer partition tuning) and Q14 (Informatica schema drift). Shows deepest Databricks + PySpark + AI integration. Staff-level engineering signal.

### Tech Stack
- Next.js 16 App Router · Vercel
- Syntax highlighter for PySpark code (Shiki or Prism)
- Mock Slack UI with Block Kit styling
- Pre-generated fixtures in `/fixtures/pipeline-healer/`

### Scope: 3 weeks (Weeks 12-14)

---

## Cross-Project System

```
              Project 1
              Dashboard Factory
              (Design System Source)
                      |
          +-----------+-----------+
          |           |           |
     Project 3   Project 4   Project 5
     Anomaly     Sprint      Pipeline
     Alerts      Intel       Self-Healer
          ^                       |
          |                       |
          +-----------------------+
       Pipeline metrics from P5 flow into P3

     Project 2
     PDF -> Deck
     Consumes dashboards from 1, 3, 4, 5 as inputs
```

---

# PART D — LOCKED DECISIONS

| # | Dimension | Decision |
|---|-----------|----------|
| 1 | Design system source | Extract from portfolio-site tokens (accent `#2dd4bf`, Space Grotesk, JetBrains Mono, Source Serif 4, dark theme). Package as `@rishi/design-system` |
| 2 | Repo | Single public monorepo `rishigundla/ai-portfolio` |
| 3 | Monorepo tool | **pnpm workspaces + turborepo** |
| 4 | Demo data | Anonymised Nutanix-style synthetic fixtures |
| 5 | Deployment | All 5 apps on Vercel |
| 6 | AI at runtime | **None** — pre-generated JSON fixtures replayed via Vercel AI SDK streaming |
| 7 | AI during dev | Claude Code (covered by Claude Max — $0) |
| 8 | Cost | **$0/month ongoing** |
| 9 | Domains | Vercel-generated URLs (e.g., `ai-dashboard-factory.vercel.app`) |
| 10 | Video demos | Yes — 90-120s Loom per project |
| 11 | Showcase strategy | Monorepo + portfolio-site cards + case-study pages + resume bullet |

---

# PART E — REPOSITORY ARCHITECTURE

```
ai-portfolio/                           Root of rishigundla/ai-portfolio
├── packages/
│   ├── design-system/                  Extracted from portfolio-site
│   │   ├── src/
│   │   │   ├── tokens/                 CSS variables (colors, typography, spacing, motion)
│   │   │   ├── primitives/             shadcn-themed (Button, Dialog, Card, etc.)
│   │   │   ├── components/             KPI cards, chart wrappers, AI-narrative blocks,
│   │   │   │                            data-grid tables, filter bars
│   │   │   └── motion/                 Framer Motion variants
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   └── ai-core/
│       ├── src/
│       │   ├── replay.ts               streamText wrapper (chunks fixture JSON)
│       │   ├── generate.ts             Dev-only: Anthropic SDK for fixture generation
│       │   ├── prompts/                Reusable prompt templates
│       │   └── types/                  Fixture, Scenario, StreamConfig types
│       └── package.json
├── apps/
│   ├── design-system-docs/             Week 1 · Component showcase
│   ├── dashboard-factory/              Project 1
│   ├── narrative-generator/            Project 2
│   ├── sprint-intelligence/            Project 4
│   ├── anomaly-alerting/               Project 3
│   └── pipeline-healer/                Project 5
├── fixtures/                           Pre-generated AI responses per project
│   ├── dashboard-factory/
│   ├── narrative-generator/
│   ├── anomaly-alerting/
│   ├── sprint-intelligence/
│   └── pipeline-healer/
├── docs/
│   ├── master-plan.md                  This file (copy)
│   └── case-studies/                   MDX per project for portfolio-site
├── scripts/
│   ├── sync-deployed.ts                Automation: portfolio + resume sync
│   └── generate-fixtures/              Per-project fixture generators
├── .github/
│   └── workflows/
│       └── sync-portfolio.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.json
├── .gitignore
├── .prettierrc
├── .eslintrc.json
└── README.md
```

### Per-App Shared Stack (all 5 apps)
- **Framework**: Next.js 16 App Router on Vercel
- **AI**: Vercel AI SDK `streamText` replaying static JSON fixtures
- **Data**: Static JSON in `/fixtures`, fetched at request time
- **State**: Vercel KV for session (selected scenario)
- **Storage**: Vercel Blob for Project 2 PPTX files

---

# PART F — 14-WEEK IMPLEMENTATION PLAN (DAY-BY-DAY)

> Each day has planned tasks with checkboxes. Update `[ ]` → `[x]` as you complete work. End-of-day entries go in "Recent Activity Log" at top of doc.

## Phase 0 — Pre-flight (One-Time Setup)

**Goal**: Tooling installed, GitHub repo created, ready to scaffold.

### Pre-flight Checklist — COMPLETED 2026-04-24
- [x] Install pnpm globally: v10.33.2 installed
- [x] Verify pnpm: `pnpm --version` → 10.33.2
- [x] Create GitHub repo `rishigundla/ai-portfolio` (public) — live at https://github.com/rishigundla/ai-portfolio (created manually by user; GitHub MCP returned auth error)
- [x] Set description + README — description set on creation, custom README committed in `d572a1e`
- [x] Confirm Node 24, npm, git ready — Node v24.14.0, npm 10.9.4, git 2.53.0
- [-] Push resume-builder to GitHub as `rishigundla/resume-builder` — **DEFERRED to Week 4 Day 5** per plan (only needed when automation wires up)

---

## Phase 1 — Project 1 · Dashboard Factory (Weeks 1-4)

### Week 1 — Monorepo Foundation + Design System

**Week goal**: Design system package extracted and deployed as showcase site.

#### Day 1 (Mon) · Monorepo Scaffolding — COMPLETED 2026-04-24
- [x] Install pnpm globally (v10.33.2)
- [x] Create GitHub repo `rishigundla/ai-portfolio` (public)
- [x] Create local directory `C:\Users\Rishi\Documents\ai-portfolio`
- [x] Scaffold with `pnpm dlx create-turbo@latest ai-portfolio --package-manager pnpm`
- [x] Clean out default `apps/web` and `apps/docs` from starter; removed `packages/ui` too
- [x] Kept default `pnpm-workspace.yaml`, `turbo.json`, root `package.json` (already configured correctly by create-turbo)
- [x] Added `.prettierrc` · kept existing `.gitignore` · ESLint + TS configs via `packages/eslint-config` + `packages/typescript-config` (modern turborepo pattern)
- [x] `pnpm install` (5 workspace projects registered)
- [x] Initial commit `d572a1e` + push to `main` at https://github.com/rishigundla/ai-portfolio
- [x] Copied master-plan.md and plan.html into `docs/` (rich interactive dashboard included)

**Context for Next Session (Day 2)**:
- Monorepo at `C:\Users\Rishi\Documents\ai-portfolio` is clean and pushed
- Packages `@rishi/design-system` and `@rishi/ai-core` are placeholder with README + package.json only
- Empty subdirectories ready: `packages/design-system/src/{tokens,primitives,components,motion}/`
- Day 2 source material: `C:\Users\Rishi\Documents\portfolio-site\tailwind.config.js` — teal `#2dd4bf` accent, Space Grotesk + JetBrains Mono + Source Serif 4, base-900→base-600 dark scale, motion keyframes (fadeIn, slideUp, pulseGlow, float, gridFlow)
- Day 2 target: create `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`, `tokens/motion.css`, `tokens/shadows.css` as CSS variables, plus Tailwind v4 config consuming them
- Repo root README, docs, and all placeholder packages are live and browseable on GitHub

#### Day 2 (Tue) · Extract Portfolio-Site Tokens — COMPLETED 2026-04-24
- [x] Create `packages/design-system/` with package.json + tsconfig (package.json updated with deps, tsconfig.json extends `@repo/typescript-config/react-library`)
- [x] Referenced `tailwind.config.js` and `src/index.css` tokens from portfolio-site (teal `#2dd4bf`, base scale, Space Grotesk, motion keyframes)
- [x] Created `src/tokens/colors.css` with accent / base / surface / text / status / severity + light theme
- [x] Created `src/tokens/typography.css` with 3 font families + size / weight / line-height / tracking scales
- [x] Created `src/tokens/spacing.css`, `motion.css`, `shadows.css`
- [x] Created `tailwind.config.ts` shared preset (chose v3.4.17 for stability — matches portfolio-site; v4 can come later)
- [x] Exported tokens barrel: `src/tokens/index.css` (CSS side-effect import) + `src/tokens/index.ts` (typed constants)

**Context for Next Session (Day 3)**:
- Design system tokens complete and consumable via `@rishi/design-system/tokens` (CSS) and `@rishi/design-system/tokens/typed` (TS)
- Tailwind preset at `@rishi/design-system/tailwind.config` ready to be imported by all 5 apps
- Next: `pnpm dlx shadcn@latest init` inside `packages/design-system/` to scaffold shadcn setup
- Primitives to install: Button, Dialog, Tabs, Tooltip, Popover, Card, Input, Select, Toast, Command, Combobox, Badge, Avatar
- All primitives must be themed to the existing CSS variables (e.g., `bg-accent`, `text-text-primary`, `border-surface-border`)
- `pnpm install` state: 5 workspace projects, 298 packages, clean (no warnings)
- `pnpm tsc --noEmit` in design-system: passes

#### Day 3 (Wed) · Install shadcn Primitives — COMPLETED 2026-04-24
- [x] Set up shadcn pattern manually inside `packages/design-system/` (CLI is app-oriented; manual setup is correct for monorepo library packages)
- [x] Built 13 primitives + Label bonus: Button, Dialog, Tabs, Tooltip, Popover, Card, Input, Select, Toast, Command, Combobox, Badge, Avatar, Label
- [x] All primitives themed to token system — `bg-accent`, `text-text-primary`, `border-surface-border`, `shadow-glow-sm`, etc.
- [x] Visual-tested every primitive with teal accent + Space Grotesk — **VERIFIED 2026-04-24** via live deploy at https://ai-portfolio-design-system-docs.vercel.app/primitives (all 14 primitives render correctly: Button variants, Card composition, Badge palette, Input focus ring, Dialog modal, Popover, Tooltip, Tabs active state, Select dropdown, Combobox search, Avatar fallback). Typecheck was clean on Day 3; visual confirmation came on Day 5 deploy.

**Context for Next Session (Day 4)**:
- All primitives exported at `@rishi/design-system/primitives` (barrel) and individually via subpaths
- Supporting: `@rishi/design-system/lib/cn` (clsx + tailwind-merge helper used by every primitive)
- Fixed TS `moduleResolution` from `NodeNext` to `Bundler` — required for React component libraries consumed by Next.js / Vite. NodeNext would force `.js` extensions on every relative import.
- Day 4 plan: compose primitives into AI-specific components (`KpiCard` = Card + Badge + sparkline; `ChartCard` wraps Card for Recharts; `AiNarrativeBlock` uses markdown + blink cursor; `FilterBar` composes Select/Combobox/Popover; `DataGrid` is its own component). Also set up `src/motion/` with Framer Motion variants.

#### Day 4 (Thu) · AI-Specific Components — COMPLETED 2026-04-24
- [x] Built `KpiCard` — value, delta indicator with direction + invertGood, inline SVG sparkline, 4 states (ready/loading/empty/error), Framer slideUp animation on mount
- [x] Built `ChartCard` — library-agnostic themed container (works with Recharts/Tremor/any chart lib as children), 4 states, optional actions slot
- [x] Built `AiNarrativeBlock` — react-markdown + remark-gfm with token-matched styling (accent arrow bullets, accent inline code, teal links), blink cursor when streaming, 3 variants
- [x] Built `FilterBar` — compound component with `.Search`, `.Select`, `.DateRange` (6 preset ranges), `.Clear` sub-components
- [x] Built `DataGrid` — sortable columns (3-state cycle), pagination, row click, per-column render/align/width/className, automatic numeric vs string sort
- [x] Created `src/motion/index.ts` — Framer Motion variants (fadeIn, fadeOut, slideUp, slideDown, slideLeft, scaleIn, staggerContainer, staggerItem, pulseGlow, float) + shared easings/durations/transitions

**Context for Next Session (Day 5)**:
- Design system is feature-complete: 5 token files + 14 primitives + 5 AI components + motion variants + Tailwind preset + typed token exports
- All exports available via `@rishi/design-system/{tokens,primitives,components,motion,tailwind.config,lib/cn}`
- Day 5 plan: scaffold `apps/design-system-docs/` as Next.js 16 App Router app that imports the design system and renders live examples of every export. One page per category (/tokens, /primitives, /components). Deploy to Vercel.
- Consider: this showcase site becomes the first public demonstration of the design system. Keep the visual polish high.

#### Day 5 (Fri) · Design System Showcase App — COMPLETED 2026-04-24
- [x] Created `apps/design-system-docs/` as Next.js 15.1 App Router project (chose 15.1 over 16 for stable React 19 support)
- [x] Installed `@rishi/design-system` as workspace dep; also added `lucide-react` directly for icon imports
- [x] Built a page per category: `/`, `/tokens`, `/primitives`, `/components` — covering all 14 primitives and 5 AI components with live interactive variants
- [x] Deploy to Vercel — **LIVE at https://ai-portfolio-design-system-docs.vercel.app** (deployed 2026-04-24, WebFetch verified render of home + catalog cards + install snippet)
- [x] Added `apps/design-system-docs/README.md` with dev/build/deploy instructions

**Context for Next Session (Day 6)**:
- Showcase app builds cleanly: 4 static pages, 10.6s build time, 105 kB First Load JS on home
- `AiNarrativeBlock` streaming simulation is validated — click-to-stream at ~40 chars/sec renders exactly how live Claude streaming will look. This is the pattern all 5 apps reuse via `@rishi/ai-core`.
- Day 6 wires up `@rishi/ai-core`: `replay.ts` takes a fixture JSON + target ReadableStream and chunks text progressively; `generate.ts` is the dev-only Anthropic SDK client Rishi uses locally when curating fixtures. Types go in `src/types/`.
- Run locally: `pnpm dev --filter design-system-docs` (serves on :3001)
- To deploy: connect `rishigundla/ai-portfolio` to Vercel via dashboard, set root directory to `apps/design-system-docs`, build command `pnpm build --filter design-system-docs...`, output directory `.next`

#### Day 6 (Sat) · Build `packages/ai-core` — COMPLETED 2026-04-24
- [x] Created `packages/ai-core/tsconfig.json` extending `@repo/typescript-config/base` with `moduleResolution: Bundler`; package.json was scaffolded on Day 1
- [x] Installed `ai` (Vercel AI SDK) 4.0.22, `@anthropic-ai/sdk` 0.40.0, `@types/node` 22.10.5
- [x] Built `src/replay.ts` — async generator `replayFixture` + ReadableStream variant `fixtureToReadableStream` + Promise collector + ReplayAbortedError. Default cadence 40 cps with 300ms initial delay and 20% jitter.
- [x] Built `src/generate.ts` — `generateFixture` + `generateFixtures` with optional prompt caching (cache_control: ephemeral). Defaults to `claude-sonnet-4-6`. Excluded from the barrel so client bundles don't pull in Anthropic SDK.
- [x] Defined types in `src/types/index.ts`: `Scenario`, `Fixture`, `FixtureMetadata`, `StreamConfig`, `AiNarrative`. Plus system prompt templates for all 5 projects in `src/prompts/index.ts`.
- [x] Verified end-to-end via the design-system-docs `/components` streaming demo: refactored from raw setInterval to `replayFixture(DEMO_FIXTURE, { signal: ac.signal })` with AbortController cleanup. Build size delta just 0.8 kB confirms no Anthropic SDK in client bundle.

**Context for Next Session (Day 7)**:
- All Week 1 functional work is done. Day 7 is polish:
  - Verify `@rishi/ai-core/README.md` covers client + server + dev usage (already updated Day 6)
  - Verify `@rishi/design-system/README.md` is current with final export list
  - Write monorepo root README with a Mermaid architecture diagram showing packages + apps + fixtures flow
  - Visually spot-check the deployed site at https://ai-portfolio-design-system-docs.vercel.app (Vercel should have auto-redeployed with the ai-core integration)
  - Tag Week 1 as complete and transition to Week 2 (Project 1 core)

#### Day 7 (Sun) · Week 1 Polish — COMPLETED 2026-04-24
- [x] `packages/ai-core/README.md` already current from Day 6; `packages/design-system/README.md` rewritten to cover the final state (tokens + 14 primitives + 5 AI components + motion + tailwind preset)
- [x] Monorepo root `README.md` rewritten with live status table for all 6 apps, Mermaid architecture diagram (packages → apps → fixtures), repository tree, dev commands, tech stack, conventions
- [x] Visual QA: fetched https://ai-portfolio-design-system-docs.vercel.app/components post-ai-core-integration deploy; all 5 component sections render, streaming button works. No visual bugs.
- [x] Week 1 tagged complete in the tracker in this plan doc

**Week 1 Deliverables**:
- Monorepo live on GitHub
- `@rishi/design-system` + `@rishi/ai-core` working
- design-system-docs site deployed on Vercel

---

### Week 2 — Project 1 Core (Dataset Gallery + Profiling Animation)

**Week goal**: User picks a sample dataset, watches streaming Claude "profiling" animation.

#### Day 1 (Mon) · App Scaffolding — COMPLETED 2026-04-25
- [x] Created `apps/dashboard-factory/` as Next.js 15.1 App Router (port 3002)
- [x] Installed `@rishi/design-system` + `@rishi/ai-core` as workspace deps; `lucide-react` as direct dep
- [x] Tailwind config extends `@rishi/design-system/tailwind.config` preset
- [x] Root layout with dark theme, sticky Nav (DF logo mark + Project 01 badge), brand-aware footer
- [x] Landing page with hero (gradient "minutes" word), two persona cards (serif italic quotes pulled from master plan), three-step "How it works" section, dual CTAs to /datasets + /wireframe

**Context for Next Session (Day 9)**:
- App scaffolded at port 3002; build clean (106 kB First Load JS, matches design-system-docs baseline)
- portfolio.meta.json scaffolded with full resumeBullet + portfolioCard ready for Week 4 sync automation; `deployedAt: null` until first deploy
- Day 2 (Tue) authors 6 sample dataset JSON fixtures — see `fixtures/dashboard-factory/datasets/` schema in next day's plan
- Routes /datasets and /wireframe link from the landing CTAs but don't exist yet (built Days 3 + 5)
- Local dev: `pnpm dev --filter dashboard-factory` opens on http://localhost:3002

#### Day 2 (Tue) · Sample Dataset Fixtures
- [ ] Create `fixtures/dashboard-factory/datasets/` with 6 sample JSON files:
  - [ ] `revops-sales.json` (50 rows, ACV/GRR/segment/region pattern)
  - [ ] `marketing-campaigns.json` (campaign/channel/spend/ROI)
  - [ ] `pulse-telemetry.json` (NAI/NC2/NCI-style product telemetry)
  - [ ] `supply-chain.json`
  - [ ] `financial-complaints.json`
  - [ ] `customer-demographics.json`
- [ ] Each dataset has metadata: name, domain, suggested color token, row count, thumbnail path

**Context for Next Session**: _(fill in after completion)_

#### Day 3 (Wed) · Dataset Gallery UI
- [ ] Build `/` route with gallery grid (6 cards)
- [ ] Card shows: thumbnail, title, domain badge, row count, tags
- [ ] Hover state (lift + glow)
- [ ] Click to select → navigate to `/generate/[slug]`

**Context for Next Session**: _(fill in after completion)_

#### Day 4 (Thu) · Streaming Profiling Page
- [ ] Build `/generate/[slug]` route
- [ ] Top: dataset preview (first 10 rows in DataGrid)
- [ ] Middle: "Analyzing your data with Claude..." streaming panel
- [ ] Wire up `@rishi/ai-core` replay to stream profiling fixture
- [ ] Progress indicators per step: Column Classification → Domain Inference → KPI Recommendation → Chart Recommendation
- [ ] "Generate Dashboard" button appears when streaming completes

**Context for Next Session**: _(fill in after completion)_

#### Day 5 (Fri) · Generate Profiling Fixtures
- [ ] Use Claude Code to generate `profiling.json` for each of 6 datasets
- [ ] Each fixture includes: column types, domain, 4-6 recommended KPIs, 3-5 recommended charts, color token, streaming narrative text
- [ ] Save to `fixtures/dashboard-factory/{slug}/profiling.json`
- [ ] Verify all 6 stream correctly in the profiling page

**Context for Next Session**: _(fill in after completion)_

#### Day 6 (Sat) · State Management + Navigation
- [ ] Set up Zustand store for selected dataset + profiling result
- [ ] Navigation guards (can't access `/dashboard` without profiling result)
- [ ] Back button flow between pages
- [ ] URL state serialization for shareable links (`?dataset=revops-sales`)

**Context for Next Session**: _(fill in after completion)_

#### Day 7 (Sun) · Responsive Polish
- [ ] Test gallery at 320px, 480px, 768px, 1024px, 1440px, 1920px
- [ ] Test profiling page at same breakpoints
- [ ] Fix mobile hamburger nav + touch targets
- [ ] Tag Week 2 complete

**Week 2 Deliverables**:
- Dashboard Factory app scaffolded
- 6 working "pick dataset → see profiling" flows
- Streaming animation pattern validated

---

### Week 3 — Project 1 Dashboard Rendering

**Week goal**: Full interactive dashboard with filters, drill-downs, PDF export, wireframe mode.

#### Day 1 (Mon) · Dashboard Layout Generator
- [ ] Build `/dashboard/[slug]` route
- [ ] Read profiling.json to determine which KPIs + charts to render
- [ ] Render KpiCard components for each recommended KPI
- [ ] Render ChartCard containers for each recommended chart
- [ ] 12-col responsive grid layout

**Context for Next Session**: _(fill in after completion)_

#### Day 2 (Tue) · Chart Rendering
- [ ] Integrate Recharts (or Tremor)
- [ ] Support bar, line, donut, heatmap, scatter chart types
- [ ] Theme all charts to design-system tokens
- [ ] Wire actual dataset rows to chart data

**Context for Next Session**: _(fill in after completion)_

#### Day 3 (Wed) · Filters + Interactivity
- [ ] FilterBar on dashboard: date range, segment, dimension
- [ ] Filters apply reactively to all KPIs + charts
- [ ] Click a chart → drill-down modal with detail
- [ ] Empty state when filters match no data

**Context for Next Session**: _(fill in after completion)_

#### Day 4 (Thu) · PDF Export
- [ ] Install `@react-pdf/renderer`
- [ ] Build branded PDF template matching design system
- [ ] "Export PDF" button downloads the dashboard
- [ ] Include KPI values + chart images + footer with dataset name + date

**Context for Next Session**: _(fill in after completion)_

#### Day 5 (Fri) · Wireframe Mode
- [ ] Build `/wireframe/[template]` route
- [ ] Gallery with 3 pre-built templates: Executive, Operational, Exploratory
- [ ] Each template shows a static Figma-style mockup
- [ ] Download as PNG or PDF option

**Context for Next Session**: _(fill in after completion)_

#### Day 6 (Sat) · Empty/Loading/Error States
- [ ] Skeleton loaders for dashboard
- [ ] Empty state for no data match
- [ ] Error boundary for Recharts failures
- [ ] Toast notifications for user actions

**Context for Next Session**: _(fill in after completion)_

#### Day 7 (Sun) · End-to-End QA
- [ ] Test all 6 datasets through: gallery → profiling → dashboard → PDF
- [ ] Test all filters
- [ ] Test wireframe templates
- [ ] Fix bugs discovered
- [ ] Tag Week 3 complete

**Week 3 Deliverables**:
- All 6 datasets render as full interactive dashboards
- Filters, drill-downs, PDF export working
- Wireframe mode with 3 templates
- Mobile responsive

---

### Week 4 — Project 1 Polish, Deploy, Automation Setup

**Week goal**: Live on production, Loom published, automation infrastructure deployed.

#### Day 1 (Mon) · Production Polish
- [ ] Lighthouse audit (target 90+ on Performance, Accessibility, Best Practices, SEO)
- [ ] SEO meta tags + Open Graph images
- [ ] Favicon
- [ ] 404 + error pages
- [ ] Social preview image

**Context for Next Session**: _(fill in after completion)_

#### Day 2 (Tue) · Production Deploy
- [ ] Create Vercel project `ai-dashboard-factory`
- [ ] Configure build settings for turborepo monorepo
- [ ] Deploy to production
- [ ] Smoke test all 6 dataset flows on production URL
- [ ] Author `apps/dashboard-factory/portfolio.meta.json` with liveUrl

**Context for Next Session**: _(fill in after completion)_

#### Day 3 (Wed) · Loom Video
- [ ] Write 90-second script: problem (10s) → gallery (15s) → profiling (20s) → dashboard (30s) → PDF export (10s) → outro (5s)
- [ ] Record on clean browser at 1440px
- [ ] Edit: trim, add captions, end card
- [ ] Upload to YouTube unlisted + copy embed URL
- [ ] Update `portfolio.meta.json` with loomUrl

**Context for Next Session**: _(fill in after completion)_

#### Day 4 (Thu) · Case Study Page
- [ ] Create `docs/case-studies/dashboard-factory.mdx`
- [ ] Sections: hero, problem, approach, architecture (Production vs Demo diagrams), tech stack, impact, Loom embed, live link, GitHub link
- [ ] Write Mermaid architecture diagrams

**Context for Next Session**: _(fill in after completion)_

#### Day 5 (Fri) · Automation Infrastructure
- [ ] Push `rishigundla/resume-builder` to GitHub (via GitHub MCP)
- [ ] Generate GitHub PAT with `repo` scope
- [ ] Add PAT as secret `PORTFOLIO_SYNC_PAT` in ai-portfolio repo
- [ ] Build `scripts/sync-deployed.ts` — reads portfolio.meta.json files, opens PRs
- [ ] Build `.github/workflows/sync-portfolio.yml`
- [ ] Dry-run sync locally

**Context for Next Session**: _(fill in after completion)_

#### Day 6 (Sat) · Live Automation Run
- [ ] Trigger sync-portfolio workflow manually
- [ ] Verify PR opens on `rishigundla/portfolio-site` with new project card
- [ ] Verify PR opens on `rishigundla/resume-builder` with new bullet
- [ ] Review and merge both PRs
- [ ] Portfolio-site auto-redeploys with new card
- [ ] Regenerate resume PDF via existing ATS optimizer workflow

**Context for Next Session**: _(fill in after completion)_

#### Day 7 (Sun) · Phase 1 Wrap
- [ ] Buffer day — fix any bugs found post-deploy
- [ ] Update master plan with Phase 1 lessons learned
- [ ] Tag Phase 1 complete
- [ ] Review Phase 2 (Project 2) Week 5 plan

**Week 4 Deliverables**:
- Project 1 fully live at `ai-dashboard-factory.vercel.app`
- 90s Loom video published
- Case study page on portfolio-site
- Automation scripts working for future projects
- Portfolio-site has new card; resume has new bullet

---

## Phase 2 — Project 2 · Narrative Generator (Weeks 5-6)

### Week 5 — Project 2 Core Build

**Week goal**: User picks sample dashboard → sees streaming narrative → downloads PPTX.

#### Day 1 (Mon) · App Scaffold
- [ ] Create `apps/narrative-generator/` Next.js 16 project
- [ ] Install `@rishi/design-system` + `@rishi/ai-core`
- [ ] Landing page with "Browse sample dashboards" CTA

#### Day 2 (Tue) · Sample Dashboard Fixtures
- [ ] Create 4 sample dashboards in `fixtures/narrative-generator/`:
  - [ ] `acv-grr-weekly.json` (KPIs: ACV, GRR, Pipeline Coverage, Channel Mix)
  - [ ] `marketing-weekly.json` (KPIs: Campaign ROI, Reach, Spend vs Budget)
  - [ ] `balanced-scorecard.json` (50+ KPI-style, flagship example)
  - [ ] `cx-okr-quarterly.json` (Bookings, GRR, CSAT, NPS, Attrition)
- [ ] Each fixture includes: source PDF preview image, structured KPIs with current + previous period

#### Day 3 (Wed) · Dashboard Gallery + PDF Preview
- [ ] Gallery grid at `/` with 4 dashboard cards
- [ ] Click → navigate to `/generate/[slug]`
- [ ] Left panel: PDF preview via `pdfjs-dist`
- [ ] Right panel: placeholder for narrative

#### Day 4 (Thu) · Generate Narrative Fixtures
- [ ] Use Claude Code to generate narrative JSON per dashboard
- [ ] Each includes: exec summary (3-4 sentences), per-KPI narratives, risks, opportunities, talking points
- [ ] Save to `fixtures/narrative-generator/{slug}/narrative.json`

#### Day 5 (Fri) · Streaming Narrative Panel
- [ ] Build right-panel streaming display
- [ ] Wire `@rishi/ai-core` replay to stream narrative fixture
- [ ] Progress indicators: Parsing PDF → Extracting KPIs → Generating Narrative → Building Talking Points

#### Day 6 (Sat) · Slide Deck Generation Infrastructure
- [ ] Install `pptxgenjs`
- [ ] Write slide template builder that matches design system tokens
- [ ] Pre-generate PPTX files for each of 4 dashboards locally
- [ ] Upload PPTX files to Vercel Blob

#### Day 7 (Sun) · Download Flow
- [ ] "Download Deck" button → fetches PPTX from Vercel Blob
- [ ] Preview thumbnail of generated deck
- [ ] Simulated delivery options UI: Email, Slack, Google Drive

**Week 5 Deliverables**:
- Gallery + streaming narrative working for all 4 dashboards
- Pre-generated PPTX files stored in Vercel Blob
- Download flow working

---

### Week 6 — Project 2 Polish + Deploy

**Week goal**: Project 2 live on production, automation fires for Project 2.

#### Day 1 (Mon) · Delivery Simulation
- [ ] Mock "Send to Slack" button → shows mock success toast
- [ ] Mock "Email to distribution list" → shows mock success
- [ ] Mock "Save to Google Drive" → shows mock success

#### Day 2 (Tue) · Empty/Loading/Error States
- [ ] Skeleton loaders for PDF preview
- [ ] Error boundary for PDF rendering failures
- [ ] Toast notifications for user actions

#### Day 3 (Wed) · Responsive Polish
- [ ] Test at all breakpoints
- [ ] Mobile: collapse PDF preview below narrative
- [ ] Fix any layout bugs

#### Day 4 (Thu) · Lighthouse + SEO
- [ ] Lighthouse 90+ audit pass
- [ ] Meta tags, Open Graph
- [ ] Social preview image

#### Day 5 (Fri) · Production Deploy + Loom
- [ ] Deploy to Vercel
- [ ] Author `portfolio.meta.json`
- [ ] Record 90s Loom

#### Day 6 (Sat) · Case Study + Automation
- [ ] Write case study MDX
- [ ] Commit `portfolio.meta.json` with `deployedAt` → triggers automation
- [ ] Review + merge portfolio-site and resume-builder PRs

#### Day 7 (Sun) · Phase 2 Wrap
- [ ] Buffer, lessons learned, prep Phase 3

**Week 6 Deliverables**:
- Project 2 live on production
- Loom + case study published
- Portfolio + resume updated via automation

---

## Phase 3 — Project 4 · Sprint Intelligence (Weeks 7-8)

### Week 7 — Project 4 Core Build

**Week goal**: User picks synthetic sprint → sees KPIs + streaming meeting brief.

#### Day 1 (Mon) · App Scaffold + Synthetic Sprints
- [ ] Create `apps/sprint-intelligence/`
- [ ] Author 4 synthetic sprint JSONs in `fixtures/sprint-intelligence/sprints/`
- [ ] Each sprint includes: 20-30 tickets with status history, 8 engineers, priority distribution

#### Day 2 (Tue) · Sprint Selector + Dashboard Shell
- [ ] Dropdown to select sprint (Sprint 42/43/44/45)
- [ ] Dashboard shell with AI brief panel (top), KPIs (middle), deep-dive tabs (bottom)

#### Day 3 (Wed) · Team-Level KPIs
- [ ] Sprint Burndown chart
- [ ] Velocity vs 4-sprint baseline
- [ ] Status Distribution donut
- [ ] Blocked Tickets count + aging

#### Day 4 (Thu) · More Team KPIs + Trends
- [ ] Cycle Time trend line
- [ ] Throughput per week
- [ ] Scope Creep tracker
- [ ] Carryover Rate

#### Day 5 (Fri) · Individual Deep-Dive Tabs
- [ ] Tab per engineer
- [ ] Workload Score (weighted priority)
- [ ] Completion Rate
- [ ] Personal vs team cycle time
- [ ] Review bottleneck

#### Day 6 (Sat) · Generate Meeting Brief Fixtures
- [ ] Use Claude Code to generate meeting brief per sprint
- [ ] Each includes: exec summary, highlights, watch list, recommendations, talking points

#### Day 7 (Sun) · Streaming Brief Panel
- [ ] Top panel streams the AI meeting brief on sprint load
- [ ] Click "Regenerate" to replay streaming

**Week 7 Deliverables**:
- 4 sprints with full KPI breakdowns + AI briefs

---

### Week 8 — Project 4 Polish + Deploy

**Week goal**: Project 4 live, automation fires.

#### Day 1 (Mon) · Interactions + Drill-Downs
- [ ] Click engineer name → filter all views to that person
- [ ] Click blocker → show blocker history

#### Day 2 (Tue) · Responsive Polish
- [ ] Breakpoint testing
- [ ] Mobile: collapse deep-dive tabs to accordion

#### Day 3 (Wed) · Empty/Loading/Error
- [ ] Skeleton states
- [ ] Error boundaries

#### Day 4 (Thu) · Lighthouse + SEO
- [ ] 90+ audit

#### Day 5 (Fri) · Deploy + Loom
- [ ] Vercel production deploy
- [ ] `portfolio.meta.json`
- [ ] Record 90s Loom

#### Day 6 (Sat) · Case Study + Automation
- [ ] Write case study MDX
- [ ] Trigger automation, review + merge PRs

#### Day 7 (Sun) · Phase 3 Wrap
- [ ] Buffer day, lessons learned, prep Phase 4

**Week 8 Deliverables**:
- Project 4 live on production
- Loom + case study published
- Automation fires

---

## Phase 4 — Project 3 · Anomaly Alerting (Weeks 9-11)

### Week 9 — Project 3 Core Build

**Week goal**: Synthetic historical data + anomaly gallery + streaming RCA.

#### Day 1 (Mon) · App Scaffold + Historical Data
- [ ] Create `apps/anomaly-alerting/`
- [ ] Author synthetic historical data in `fixtures/anomaly-alerting/history/`:
  - [ ] NAI Pulse metrics (feature_usage, token_consumption)
  - [ ] NC2 Pulse (cluster_health, heartbeat_rate)
  - [ ] NCI Pulse (firmware_versions, feature_adoption)
  - [ ] RevOps (ACV, GRR, pipeline_coverage)
  - [ ] CX (CSAT, NPS, churn_rate)

#### Day 2 (Tue) · Dashboard with Time-Series
- [ ] Dashboard route with time-series charts per KPI
- [ ] 30-day rolling mean bands overlaid
- [ ] Date range selector

#### Day 3 (Wed) · Anomaly Scenario Gallery
- [ ] Build scenario gallery with 6-8 curated anomalies
- [ ] Each card: metric name, deviation %, Z-score, domain badge
- [ ] Click → navigate to `/scenario/[slug]`

#### Day 4 (Thu) · Baseline Visualization
- [ ] Expected vs actual chart per anomaly
- [ ] Highlight the deviation point
- [ ] Show related-metric time-series alongside

#### Day 5 (Fri) · Generate RCA Fixtures
- [ ] Use Claude Code to generate RCA per scenario
- [ ] Each includes: hypothesis, correlation analysis, confidence score, suggested action

#### Day 6 (Sat) · Streaming RCA Display
- [ ] Right panel streams RCA text
- [ ] Confidence badge (high/medium/low)
- [ ] "Suggested Action" card

#### Day 7 (Sun) · Alert List + Severity Routing
- [ ] Sidebar showing all recent alerts
- [ ] SEV1/SEV2/SEV3 routing tags
- [ ] Timestamp + acknowledgment state

**Week 9 Deliverables**:
- Historical dashboard + 6-8 working scenarios

---

### Week 10 — Project 3 Expanding Features

**Week goal**: Richer visualizations + simulated infrastructure.

#### Day 1 (Mon) · Confidence Score UI
- [ ] Visual gauge for confidence (0-100%)
- [ ] Breakdown: how confidence was calculated
- [ ] Risk-tolerance slider

#### Day 2 (Tue) · Recommended Action Flow
- [ ] "Run Playbook" button per recommendation
- [ ] Mock action execution (simulated API call)
- [ ] Action history log

#### Day 3 (Wed) · Historical Anomaly Archive
- [ ] Table of past anomalies with resolution status
- [ ] Filter by category, severity, date

#### Day 4 (Thu) · Simulated Deployment Log
- [ ] Display timeline of mock deployments
- [ ] Show correlation between deploys and anomalies

#### Day 5 (Fri) · MLflow-Style Trace View
- [ ] Per-RCA trace showing: inputs (metric + correlations + deployments) → AI reasoning → output
- [ ] Simulated MLflow UI aesthetic

#### Day 6 (Sat) · Architecture Diagrams
- [ ] Production architecture Mermaid (Databricks + Unity Catalog + MLflow)
- [ ] Demo architecture Mermaid (Vercel + JSON fixtures)

#### Day 7 (Sun) · Mobile Responsive
- [ ] Breakpoint polish

**Week 10 Deliverables**:
- Rich anomaly exploration UX
- All simulated infrastructure views complete

---

### Week 11 — Project 3 Polish + Deploy

**Week goal**: Project 3 live, automation fires.

#### Day 1 (Mon) · Lighthouse + SEO
- [ ] 90+ audit
- [ ] Meta tags

#### Day 2 (Tue) · Deploy
- [ ] Vercel production
- [ ] `portfolio.meta.json`

#### Day 3 (Wed) · Loom
- [ ] 90s video

#### Day 4 (Thu) · Case Study
- [ ] MDX with both architecture diagrams

#### Day 5 (Fri) · Automation Sync
- [ ] Trigger workflow
- [ ] Review + merge PRs

#### Day 6 (Sat) · Documentation
- [ ] README for the app
- [ ] Add to monorepo root README

#### Day 7 (Sun) · Phase 4 Wrap
- [ ] Buffer, lessons, prep Phase 5

**Week 11 Deliverables**:
- Project 3 live
- Loom + case study published
- Automation fires

---

## Phase 5 — Project 5 · Pipeline Self-Healer (Weeks 12-14)

### Week 12 — Project 5 Core Build

**Week goal**: Failure gallery + streaming diagnosis + PySpark patch display.

#### Day 1 (Mon) · App Scaffold + Failure Scenarios
- [ ] Create `apps/pipeline-healer/`
- [ ] Author 8 failure scenarios in `fixtures/pipeline-healer/scenarios/`:
  - [ ] SCHEMA_DRIFT (Informatica column rename — your Q14 story)
  - [ ] NULL_EXPLOSION
  - [ ] DATA_SKEW (partition imbalance — your Q17 story)
  - [ ] TYPE_MISMATCH
  - [ ] RESOURCE_LIMIT (OOM)
  - [ ] LOGIC_ERROR
  - [ ] DEPENDENCY_FAIL (upstream table not refreshed)
  - [ ] FILE_CORRUPT

#### Day 2 (Tue) · Scenario Gallery
- [ ] Gallery with 8 scenario cards
- [ ] Each card: failure category, pipeline name, timestamp, severity
- [ ] Click → navigate to `/scenario/[slug]`

#### Day 3 (Wed) · Failure Detail View
- [ ] Display mock Spark driver logs (syntax highlighted)
- [ ] Display failing notebook code snippet
- [ ] Run history showing last 10 runs

#### Day 4 (Thu) · Schema Diff Visualization
- [ ] Visual diff of schema (today vs last successful run)
- [ ] Added/removed/renamed/type-changed columns highlighted

#### Day 5 (Fri) · Generate Diagnosis Fixtures
- [ ] Use Claude Code to generate diagnosis per scenario
- [ ] Each includes: root cause explanation, PySpark patch, confidence, risk assessment

#### Day 6 (Sat) · Streaming Diagnosis Panel
- [ ] Stream diagnosis text
- [ ] Category badge (SCHEMA_DRIFT etc.)
- [ ] Confidence score

#### Day 7 (Sun) · PySpark Patch Display
- [ ] Syntax-highlighted code block with Shiki or Prism
- [ ] Before/after diff view
- [ ] Copy-to-clipboard button

**Week 12 Deliverables**:
- 8 scenarios with full diagnosis + patch flows

---

### Week 13 — Project 5 Interactive Demo Features

**Week goal**: Simulated approval flow + historical dashboards.

#### Day 1 (Mon) · Sample Validation UI
- [ ] "Run Sample Test" button simulates running patch on 100 rows
- [ ] Progress indicator
- [ ] Success/failure result display

#### Day 2 (Tue) · Mock Slack Approval UI
- [ ] Slack-styled message preview
- [ ] Approve / Reject / Escalate buttons
- [ ] Simulated response (pipeline retries / ticket created / oncall paged)

#### Day 3 (Wed) · Incident History Timeline
- [ ] Table of past incidents
- [ ] Filter by category, pipeline, auto-healed status
- [ ] Click to view historical details

#### Day 4 (Thu) · MTTR Trend Chart
- [ ] Weekly MTTR line chart
- [ ] Auto-heal rate % over time
- [ ] Comparison: manual vs auto resolution times

#### Day 5 (Fri) · Architecture Diagrams
- [ ] Production Mermaid (Databricks Agent Bricks + MLflow tracing)
- [ ] Demo Mermaid (Vercel + JSON fixtures)

#### Day 6 (Sat) · Per-Category Breakdown
- [ ] Dashboard tab showing category frequency
- [ ] Most common root causes per pipeline

#### Day 7 (Sun) · Mobile Responsive
- [ ] Breakpoint polish

**Week 13 Deliverables**:
- Complete interactive demo experience
- All simulated infrastructure views

---

### Week 14 — Project 5 Polish + Deploy + Portfolio Wrap

**Week goal**: Project 5 live, all 5 projects polished, final portfolio review.

#### Day 1 (Mon) · Lighthouse + SEO
- [ ] 90+ audit

#### Day 2 (Tue) · Deploy
- [ ] Vercel production
- [ ] `portfolio.meta.json`

#### Day 3 (Wed) · Loom
- [ ] 90s video

#### Day 4 (Thu) · Case Study + Automation
- [ ] MDX
- [ ] Trigger sync, merge PRs

#### Day 5 (Fri) · Final Portfolio Review
- [ ] Click-test all 5 deployed apps
- [ ] Verify all 5 cards on portfolio-site
- [ ] Verify resume PDF reflects all 5 projects

#### Day 6 (Sat) · Monorepo Documentation
- [ ] Update root README with "all 5 projects live" announcement
- [ ] Create portfolio overview video (optional 3-min tour)
- [ ] LinkedIn post draft

#### Day 7 (Sun) · Retrospective
- [ ] Lessons learned document
- [ ] Plan next phase (blog posts, talks, follow-up projects)
- [ ] Tag Phase 5 complete — portfolio shipped

**Week 14 Deliverables**:
- All 5 AI projects live on Vercel
- Portfolio-site has 5 new cards
- Resume has new Personal Projects category with bullet
- Monorepo on GitHub showcases the whole system
- Portfolio is public and shipping

---


# PART G — PORTFOLIO + RESUME AUTOMATION

## Source of Truth: `portfolio.meta.json`

Every app in `apps/<project>/` includes this file. Populated `deployedAt` field triggers the automation.

```json
{
  "slug": "dashboard-factory",
  "title": "Instant Analytics Dashboard Factory",
  "category": "AI",
  "tags": ["AI", "React", "Design System", "Claude"],
  "description": "AI-powered dashboard factory that turns any dataset into a fully designed, interactive dashboard.",
  "thumbnail": "/projects/ai-dashboard-factory.png",
  "liveUrl": "https://ai-dashboard-factory.vercel.app",
  "githubUrl": "https://github.com/rishigundla/ai-portfolio/tree/main/apps/dashboard-factory",
  "caseStudyUrl": "https://rishikeshgundla.com/ai-projects/dashboard-factory",
  "loomUrl": "https://www.loom.com/share/abc123",
  "deployedAt": "2026-05-20",
  "resumeBullet": {
    "category": "AI-Powered Analytics & Data Engineering Projects",
    "text": "Architected an AI-powered dashboard factory on Next.js + Vercel, applying a unified design-token system across 6 business domains with streaming AI profiling and automatic chart recommendation."
  },
  "portfolioCard": {
    "problem": "Dashboard creation follows a slow cycle of profiling, wireframing, and alignment before any real build starts.",
    "approach": "An AI-powered factory that profiles uploaded datasets, recommends KPIs, and renders a fully designed interactive dashboard applying a unified design system.",
    "impact": "Reduces ad-hoc dashboard turnaround from days to minutes; serves both business users and BI engineers."
  }
}
```

## Sync Workflow

1. Project merged to `main` → Vercel deploys successfully
2. GitHub Action `.github/workflows/sync-portfolio.yml` fires
3. Runs `scripts/sync-deployed.ts`:
   - Reads all `apps/*/portfolio.meta.json` files
   - Opens PR on `rishigundla/portfolio-site`: adds card to Projects.jsx, adds case study MDX
   - Opens PR on `rishigundla/resume-builder`: adds bullet to all prompt files
   - Posts Slack notification with both PR URLs
4. Rishi reviews + merges PRs manually (safety net)
5. Portfolio-site auto-redeploys; resume PDF regenerated via existing ATS optimizer

## Automation Setup (Week 4, Day 5)

- Push `rishigundla/resume-builder` to GitHub via GitHub MCP
- Create GitHub PAT with `repo` scope
- Add `PORTFOLIO_SYNC_PAT` secret in `rishigundla/ai-portfolio`
- Add `SLACK_WEBHOOK` secret

---

# PART H — SUPPORTING REFERENCE

## Databricks Architecture as Portfolio Artifact

Even though deployment is 100% Vercel, each case study documents the **production architecture** on Databricks — as design, not deployment. This converts the decision into a platform-translation skill (a credential, not a limitation).

Per project:
- Production Architecture: Databricks + Delta Lake + Unity Catalog + MLflow
- Demo Architecture: Vercel + static JSON fixtures + AI SDK streaming

Interview framing: _"I designed the production architecture for Databricks; built the portfolio demo on Vercel for accessibility. The AI layer is live in both versions."_

## Master Skills / MCPs Reference

### MCPs Used
| MCP | Projects | Purpose |
|-----|----------|---------|
| GitHub MCP | All | Repo ops, PR creation during dev |
| Figma MCP | 1 | Design token reference, wireframe generation |

### Vercel Skills
| Skill | Used For |
|-------|----------|
| `vercel:ai-sdk` | streamText fixture replay |
| `vercel:nextjs` | App Router patterns |
| `vercel:vercel-functions` | Serverless routes |
| `vercel:vercel-storage` | Blob (P2 PPTX), KV (session) |
| `vercel:runtime-cache` | Edge caching |
| `vercel:chat-sdk` | P4 conversational UI |
| `vercel:shadcn` | Primitives |
| `vercel:deploy` | Production deploy |
| `vercel:env` | No runtime keys needed |
| `vercel:bootstrap` | App scaffolding |

### Design / Frontend Skills
| Skill | Projects | Purpose |
|-------|----------|---------|
| `design-system-starter` | 1 (Week 1) | Token architecture |
| `frontend-design` | All | Distinctive UI |
| `elegant-design` | All | Accessibility + polish |
| `react-dev` | All | React 19 patterns |
| `browser-qa` | All | Responsive testing |
| `claude-api` | Fixture gen | Prompt engineering |
| `humanizer` | 2, 4 | Natural narrative tone |
| `professional-communication` | 2, 4 | Exec tone |
| `pptx` | 2 | Slide generation |

## Resume Integration Plan

### New Personal Projects Category

Add to `resume-builder/original/resume-prompt-v1.md` and all per-role prompts:

```yaml
- category: AI-Powered Analytics & Data Engineering Projects
  link: https://github.com/rishigundla/ai-portfolio
  bullets:
    - Architected and deployed 5 production-grade AI applications combining BI, data engineering, and applied AI — an AI dashboard factory, PDF-to-deck narrative generator, PySpark self-healing pipeline framework, sprint intelligence dashboard on PostgreSQL SSOT, and Unity Catalog-based anomaly detection with AI root-cause narration.
    - Leveraged Claude API, Databricks Foundation Model Serving, MLflow tracing, Unity Catalog Metric Views, Figma MCP, and PostgreSQL MCP across a shared design-system monorepo deployed on Vercel and Databricks.
```

### Core Competencies Swaps (recommended)
- Replace `Data Storytelling` → `Claude API`
- Replace `Data Modeling` → `AI Agents`
- Keep the rest

## Portfolio-Site Integration Plan

1. Add `AI` filter category to Projects.jsx
2. Add 5 project cards (one per AI project) with thumbnails, live URLs, case-study links
3. Create dedicated case-study pages at `/ai-projects/[slug]` rendering MDX from monorepo `docs/case-studies/`
4. Generate thumbnails from each deployed app, place in `public/projects/ai-*.png`

## Nutanix Project Anchors (for examples)

- Enterprise Dashboard Design System (Figma) — Project 1 anchor
- Pulse SSOT: NAI, NC2, NCI — Project 3 anchor
- Jira SSOT (Atlassian Postgres → Informatica → Databricks) — Project 4 + Project 5 anchors
- RevOps Sales SSOT (ACV/GRR, Balanced Scorecard 50+ KPIs) — Project 2 + Project 3 anchors
- Microsoft Fabric (Marketing, Procurement) — peripheral anchor
- CX OKR Dashboard (Business + Product + Team dimensions) — Project 2 + Project 3 anchor

## Interview Anchors (Q14, Q17)

- Q14 Challenge 2 (Data Quality / Schema Drift) → Project 5 SCHEMA_DRIFT scenario
- Q17 (Jira SSOT Silver-layer partition tuning) → Project 5 DATA_SKEW scenario

---

# PART I — NEXT ACTIONS

## Immediate (Today)
1. Review this updated plan
2. Confirm ready to start Week 1 Day 1
3. Decide execution mode: **Option A** (you run commands, I guide) or **Option B** (I execute via Bash/PowerShell/GitHub MCP, you approve each step)

## Week 1 Day 1 Execution Steps (from Phase 1 plan above)
1. Install pnpm: `npm install -g pnpm`
2. Create GitHub repo via MCP
3. Create local directory
4. Scaffold turborepo starter
5. Clean + configure
6. Initial install + commit + push
7. Verify everything works

## Ongoing
- Every morning: read Current Status + Recent Activity Log + today's section
- Every evening: update task checkboxes, add entry to Recent Activity Log, fill in Context for Next Session
- Weekly: review progress against the 14-week target

---

*Master plan v3 — comprehensive day-by-day tracker. Previous version: v2 (2026-04-24). Reach v4 when first actual implementation feedback comes in.*
