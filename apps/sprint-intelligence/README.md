# sprint-intelligence

**Project 03 of 5**. AI Sprint Intelligence Dashboard. Pick a monthly sprint, filter by assignee or ticket type, watch a dashboard fill with the KPIs an engineering lead actually walks into the sprint review with, then read the AI meeting brief that closes the page.

**Status**: Live in production. Deployed 2026-05-17.

**Live**: <https://ai-portfolio-sprint-intelligence.vercel.app>

**Case study**: [`docs/case-studies/sprint-intelligence.md`](../../docs/case-studies/sprint-intelligence.md) (lands W12.D3)

## What it does

Three steps.

1. **Pick a sprint** from a roster of six monthly sprints across the first half of 2026. Four completed (healthy, scope creep absorbed, blocked, recovered), one currently in flight at day 17 of 31, one filling up with backlog tickets a manager has earmarked for next cycle. The same eight engineer team carries through every sprint. 138 hand curated tickets in total.
2. **Read the analysis**. Filter bar at the top accepts assignee, ticket type, and status. The same filter scope feeds every surface on the page. Below it a wide KPI strip plus a story points strip. Then a Status and priority section (avg time in current status plus priority breakdown). Then ETA discipline tiles (Missing ETA, Overdue). Then per ticket cycle time and aging tickets bars. Then workload by assignee. Standard sprint health cards next (burndown, velocity, status mix, blocked, cycle time trend, throughput, scope creep, carryover). Per engineer deep dive at the bottom with an activity heatmap that shows which days each engineer worked on which ticket. Sprint history table plus trend charts close the data view.
3. **Take the brief into the room**. A streaming AI meeting brief closes the page. Executive summary, highlights, watch list, recommendations, talking points. For the backlog sprint the brief flips to a planning summary plus allocation highlights so the manager can walk into planning ready to lock etas.

## Routes

| Route | Kind | Notes |
| --- | --- | --- |
| `/` | Static | Home with the three step product pitch |
| `/sprints` | Static | Gallery of six monthly sprints (four completed green, one in flight amber, one backlog slate) |
| `/sprint/[id]` | SSG x 6 | Detail page for each of `jan-2026`, `feb-2026`, `mar-2026`, `apr-2026`, `may-2026`, `jun-2026` |

13 static pages prerendered at build time. `/sprint/[id]` First Load JS at 50.4 kB.

## Architecture

```
fixtures/sprint-intelligence/
├── sprints/
│   ├── index.json              Six sprint manifest with pre computed per sprint metrics
│   └── {jan,feb,mar,apr,may,jun}-2026.json   138 tickets total
└── briefs/
    └── {jan..jun}-2026.json    Six AI meeting briefs (jan-may retrospective, jun planning)

apps/sprint-intelligence/lib/
├── sprints.ts                  Manifest loader plus color tokens plus status mapping
├── full-sprints.ts             Per id full fixture loader, tree shaken per route
├── briefs.ts                   Brief loader keyed by sprint id
└── kpi-calc.ts                 Filter helpers plus KPI math (top strip, story points,
                                status mix, blocked, cycle time, throughput, scope creep,
                                carryover, per ticket cycle time, aging tickets, ETA
                                discipline, workload by assignee, priority breakdown,
                                avg time in status, ticket timelines plus runs)

apps/sprint-intelligence/app/sprint/[id]/_components/
├── SprintFilters.tsx           Client component, drives `?assignee=...&type=...&status=...`
├── TopKpiStrip.tsx             Seven tile KPI strip
├── StoryPointsStrip.tsx        Six tile story points strip
├── AvgDaysInStatusChart.tsx    Horizontal bar chart, time in current status
├── PriorityBreakdownChart.tsx  Stacked column per priority (P0 to P3), Done versus Remaining
├── EtaCard.tsx                 Missing ETA plus Overdue tiles
├── CycleTimeBars.tsx           Per ticket cycle time bars, color graded against baseline
├── AgingTicketsCard.tsx        Per ticket age bars for open tickets
├── WorkloadByAssignee.tsx      Per engineer completed share fill
├── StatusDonut.tsx             Five segment donut, per status color
├── BurndownChart.tsx           Story points remaining versus ideal
├── VelocityBar.tsx             This sprint versus four sprint baseline
├── BlockedCard.tsx             Counts plus oldest blocker note plus history dialog
├── CycleTimeChart.tsx          Rolling team cycle time trend
├── ThroughputChart.tsx         Week 1 plus Week 2 plus Prior avg bars
├── ScopeCreepCard.tsx          Planned versus final scope plus mid sprint adds
├── CarryoverCard.tsx           Tickets carrying into the next sprint
├── DeepDivePanel.tsx           Per engineer view OR team aggregate view, switches via top filter
├── TicketHeatmap.tsx           Tickets across rows, sprint days across columns, sparse
                                cells per ticket workSchedule
├── SprintHistoryTable.tsx      All six sprints at a glance, honors the top filter
├── SprintTrendCharts.tsx       Tickets closed per sprint plus story points per sprint,
                                honors the top filter
└── StreamingBriefPanel.tsx     Closing AI brief, replayFixture plus AiNarrativeBlock
```

**Shared with Projects 1 and 2**: the streaming primitive (`@rishi/ai-core/replayFixture`), `AiNarrativeBlock`, design system tokens, the search param driven filter pattern.

**Unique to Project 3**:

- The per engineer queue scheduler (sequential, per week, with hash deterministic profile variation by role: pace bias, week shape, carryover habit, side ticket probability, weekly meeting skip day).
- The `workSchedule` field on `TicketSpec` driving the sparse activity heatmap (only days the engineer actually worked on the ticket get filled, weekends skipped, mid sprint additions anchor to their createdAt week).
- The chart palette tokens (`chart-emerald`, `chart-amber`, `chart-violet`, `chart-rose`, `chart-slate`, `chart-blue`, `chart-indigo`, plus `heatmap-empty`) in the design system, used by every chart fill so the dashboard themes cleanly between light and dark.
- The manifest enrichment pattern that keeps cross sprint widgets at zero First Load JS cost.

## Theming

Every chart fill, KPI tile accent, and heatmap cell flips between dark and light mode via CSS variables defined in `packages/design-system/src/tokens/colors.css`. Status bound sprint card colors (`getStatusColorToken(status)`) resolve to `chart-emerald` for completed, `chart-amber` for in progress, `chart-slate` for planned. Light mode shades are darker and more saturated for contrast on a white card. Dark mode keeps the original brighter shades.

## Development

```bash
pnpm dev --filter sprint-intelligence
```

Runs at <http://localhost:3004>.

```bash
python scripts/generate-monthly-sprints.py
python scripts/generate-monthly-briefs.py
```

Regenerate the six sprint fixtures and the six brief fixtures from the hand curated ticket specs in the Python scripts. Hash deterministic so regenerates stay stable across re-runs.

## Engineering moments

Three patterns worth a deep dive. Covered in detail in the case study at `docs/case-studies/sprint-intelligence.md`.

1. **Monorepo `rootDirectory` workaround for the Vercel deploy** (W10.D5). The Vercel CLI does not expose `rootDirectory` as a flag. Created the project with `vercel project add`, then PATCHed it via the Vercel REST API to set `rootDirectory: apps/sprint-intelligence` plus `framework: nextjs`. Same pattern used for Project 2.

2. **Search param driven filter pattern across every surface**. One `?assignee=eng-1&type=development&status=done` URL state feeds every dashboard surface: the seven tile KPI strip, the story points strip, the status mix, the blocked card, the workload by assignee, the per engineer deep dive, the activity heatmap, the sprint history table, and the cross sprint trend charts. The page recomputes `filteredHistoryRows` against every full sprint fixture so cross sprint widgets respect the same filter.

3. **Manifest enrichment for zero cost cross sprint widgets**. `closedCount`, `openCount`, `spCompleted`, and `spTotal` per sprint are pre computed at fixture generation time and stored in the manifest. `SprintHistoryTable` and `SprintTrendCharts` read directly from the manifest, so the bottom of every detail page renders the six sprint history without importing six fixtures (zero extra First Load JS).
