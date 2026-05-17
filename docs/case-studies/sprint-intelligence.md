# Sprint Intelligence Case Study

> Sprint review prep for a BI team, in five minutes. Pick a monthly sprint, filter by assignee or ticket type, read the AI brief that closes the page.

**Live**: <https://ai-portfolio-sprint-intelligence.vercel.app> &nbsp;·&nbsp; **Source**: [`apps/sprint-intelligence`](https://github.com/rishigundla/ai-portfolio/tree/main/apps/sprint-intelligence) &nbsp;·&nbsp; **Stack**: Next.js 15, React 19, TypeScript, Tailwind, Vercel

---

## The problem

Sprint review prep is one of the most expensive recurring meetings on an engineering team. The lead spends an hour every two weeks pulling Jira screenshots, writing up blockers, and shaping a one page narrative the room can actually read. Standard Jira dashboards surface the raw data but stop one step short of telling the story. Jira tells you 22 tickets closed. The lead has to figure out the why and what to do about it.

Project 3 takes the dashboard half of that prep and the storytelling half and stitches them together. The dashboard fills with the right metrics at the right resolution. The AI brief at the bottom is the closing summary the lead would have written by hand. Five minutes of reading replaces an hour of consolidation.

## The approach: pick, read, take into the room

Three steps.

1. **Pick a sprint** from a roster of six monthly sprints across the first half of 2026. Four completed (one healthy, one absorbed a customer escalation, one stalled on a cross team handoff, one recovered cleanly), one currently in flight at day 17 of 31, and one already filling up with backlog tickets the manager has earmarked for next cycle. The same eight engineer team carries through every sprint. 138 hand curated tickets total.

2. **Read the analysis**. A filter bar at the top of every detail page accepts assignee, ticket type, and status. The same filter scope feeds every surface on the page: a wide KPI strip, a story points strip, time in current status plus a priority breakdown, ETA discipline tiles (Missing ETA, Overdue), per ticket cycle time and aging bars, workload by assignee, the standard sprint health cards (burndown, velocity, scope creep, carryover), a per engineer deep dive with an activity heatmap that shows which days each engineer worked on which ticket, the cross sprint history table, and the trend charts at the bottom.

3. **Take the brief into the room**. A streaming AI meeting brief closes the page. Executive summary, highlights, watch list, recommendations, talking points. For the backlog sprint the brief flips to a planning summary plus allocation highlights so the manager can walk into planning ready to lock etas.

The same streaming primitive that drove Projects 1 and 2 (the data exploration story and the dashboard to deck story) drives Project 3's meeting brief. One engine, three product surfaces.

## Architecture

```
fixtures/sprint-intelligence/
├── sprints/
│   ├── index.json              Manifest with per sprint counts (drives gallery + cross sprint widgets)
│   └── {jan..jun}-2026.json    Six sprint fixtures, 138 tickets total
└── briefs/
    └── {jan..jun}-2026.json    Six AI meeting briefs (five retrospective, one planning)

apps/sprint-intelligence/lib/
├── sprints.ts                  Manifest loader plus color tokens plus status mapping
├── full-sprints.ts             Per id full fixture loader, tree shaken per route
├── briefs.ts                   Brief loader keyed by sprint id
└── kpi-calc.ts                 Filter helpers plus all KPI math

apps/sprint-intelligence/app/sprint/[id]/_components/
├── SprintFilters.tsx           Client component driving ?assignee=...&type=...&status=...
├── TopKpiStrip.tsx             Seven tile KPI strip
├── StoryPointsStrip.tsx        Six tile story points strip
├── AvgDaysInStatusChart.tsx    Time in current status per status
├── PriorityBreakdownChart.tsx  Stacked column per priority, Done versus Remaining
├── EtaCard.tsx                 Missing ETA plus Overdue tiles
├── CycleTimeBars.tsx           Per ticket cycle time, color graded against baseline
├── AgingTicketsCard.tsx        Per ticket age for open tickets
├── WorkloadByAssignee.tsx      Per engineer completed share fill
├── DeepDivePanel.tsx           Per engineer view OR team aggregate view (switches via top filter)
├── TicketHeatmap.tsx           Sparse heatmap from per ticket workSchedule
├── SprintHistoryTable.tsx      All six sprints at a glance, honors top filter
├── SprintTrendCharts.tsx       Tickets closed plus story points per sprint, honors top filter
└── StreamingBriefPanel.tsx     Closing AI brief at the bottom
```

The shared primitives carry the weight here too. `@rishi/ai-core/replayFixture` plus `AiNarrativeBlock` deliver the streaming brief. The design system color tokens plus the new chart palette (`chart-emerald`, `chart-amber`, `chart-violet`, `chart-rose`, `chart-slate`, `chart-blue`, `chart-indigo`, plus `heatmap-empty`) drive every chart fill so the dashboard themes cleanly between light and dark. Project 3 ships zero copies of the streaming primitive or the design system internals.

What is unique to Project 3: the per engineer queue scheduler with hash deterministic profile variation, the `workSchedule` field on `TicketSpec` driving the sparse heatmap, and the manifest enrichment pattern that lets cross sprint widgets render at zero First Load JS cost.

## Key technical decisions

**Six monthly sprints, not four bi weekly.** The original W9 plan called for four 14 day sprints. After the W10.D5 deploy review, the user asked for calendar months. Easier to identify, four completed plus one in flight plus one backlog tells a richer story, and 31 day windows make per ticket time math more legible. The Python generator now authors six month long sprint fixtures with priority aware ticket distribution.

**Sequential per engineer queue scheduler, not parallel.** A naive scheduler with five P1 tickets all sized at five SP would have every ticket running in parallel from day 1 to day 5. Real engineers do not work that way. The W11.D6 scheduler walks each engineer's queue sequentially per week. Each engineer gets a hash deterministic profile: role based pace bias (senior 0.85, junior 1.2), week shape (front loaded, back loaded, or steady), carryover habit (probability plus extra days), side ticket probability, plus a per week meeting skip day. Two engineers with the same ticket queue still produce visibly different heatmap rows because the profile differs.

**Status driven sprint card colors, not per sprint colors.** Earlier drafts let each sprint pick its own color token. Then status (`completed`, `in-progress`, `planned`) became the more important axis. A user scanning the gallery wants to read at a glance which sprints are done and which are still moving. `getStatusColorToken(status)` resolves to `chart-emerald` for completed, `chart-amber` for in flight, `chart-slate` for planned. The per sprint color field on the manifest is now optional and unused.

**Chart palette tokens in the design system, not hardcoded hex.** Every chart fill, KPI tile accent, and heatmap cell uses CSS variables (`var(--chart-emerald)`, etc.) defined in `packages/design-system/src/tokens/colors.css`. The `:root,.dark` block keeps the bright shades that work on dark cards. The `.light` block overrides each token with a darker saturated equivalent (chart-emerald becomes `#059669` emerald-600 in light mode). The dashboard themes cleanly between light and dark without component changes.

## Engineering moments worth telling

Three patterns that paid off across the build.

**The monorepo `rootDirectory` workaround for the Vercel deploy.** W10.D5 should have been a 30 minute Vercel deploy. It took an hour because the first attempt from inside `apps/sprint-intelligence/` failed at install. The Vercel CLI uploads the working directory as the deploy context. With a pnpm workspace, that leaves `@rishi/design-system` and `@rishi/ai-core` outside the upload and the install step blows up. Same problem Project 2 hit on W6.D2. The fix is the same recipe: create the Vercel project with `vercel project add` (the CLI does this fine), then PATCH the project record via the Vercel REST API to set `rootDirectory: apps/sprint-intelligence` plus `framework: nextjs`. After that, `vercel --prod --yes` from the monorepo root uploads the whole workspace, runs `pnpm install` at the workspace root, and builds from the configured root directory. The whole recipe lives in the W10.D5 master plan entry and is reusable for Projects 4 and 5.

**Search param driven filter pattern across every surface.** The filter bar at the top of `/sprint/[id]` is a small client component (`SprintFilters.tsx`) that writes `assignee`, `type`, and `status` to `useSearchParams()` and triggers a `router.replace` with `scroll: false`. The detail page is a server component that reads `searchParams` on every request. With those two pieces, every downstream chart can be a server component that receives the filtered ticket array as a prop. No client side filtering, no extra hydration cost.

The pattern feeds every dashboard surface: the seven tile KPI strip, the story points strip, the status mix, the blocked card, the per engineer workload, the per engineer deep dive (the `DeepDivePanel` even flips between a per engineer view and a team aggregate view based on whether `assignee` is set), the activity heatmap, the cross sprint history table, and the trend charts. The cross sprint widgets recompute their per sprint totals against every full sprint fixture so the bottom of the page respects the same filter as the top. One filter, one URL state, every surface in agreement.

**Manifest enrichment for zero cost cross sprint widgets.** The naive way to render a six sprint history table at the bottom of every detail page would be to import all six sprint fixtures. Each fixture is roughly 30 KB minified. Doing that on every route would have pushed First Load JS past 80 kB. The lighter pattern: pre compute `closedCount`, `openCount`, `spCompleted`, and `spTotal` per sprint at fixture generation time in the Python script and store them in the manifest. `SprintHistoryTable` and `SprintTrendCharts` read directly from the manifest. The full fixtures themselves are tree shaken per route. `/sprint/[id]` First Load JS held at 50.4 kB even with the cross sprint widgets present.

## What I would do differently

The W10 day count blew well past plan. Original scope had Project 3 closing in W9 + W10 (14 days). The actual close ran W9 + W10 + W11 + W12 (22 days plus 3 wrap-up days for a total of 25). The polish rounds (W11.D1 through W11.D7) were not in the original scope. Most of them came from live deploy reviews where the user surfaced concrete gaps (filter scope inconsistency, hardcoded chart hex literals, parallel scheduler unrealism). The right read is that the polish work paid off (the dashboard reads as a credible BI tool now, not a portfolio demo) but the slip pushed Projects 4 and 5 back by two weeks each.

The fixture authoring pattern is hand curated Python ticket specs. That works for 138 tickets across six sprints. For a real product the tickets would come from the actual Jira API plus a typed schema. The hand curation was the right scope for a portfolio demo and let me ship narrative variety the API could not have given without real teams behind it.

The activity heatmap and per ticket bars use native `title` attributes for hover details. Native tooltips work on desktop but are invisible on mobile. A real Tooltip primitive lifted into `@rishi/design-system` would close that gap. Cat C item.

## Future work

A per sprint comparison view. The cross sprint trend charts at the bottom show counts and SP per sprint but do not let you pivot on the engineer or ticket axis. A real product would let the user pick two sprints and overlay them side by side.

A drill in pattern from the activity heatmap. Today the heatmap row shows a ticket id label and a hover title. Clicking through to a ticket detail page (or a Jira deep link) would be the natural next move. Out of portfolio scope but obvious next step.

Real time data, not synthetic fixtures. The fixture pattern keeps the demo costs at zero ongoing dollars and lets me ship narrative variety. A production version would consume the Jira API directly and skip the fixture step. The streaming primitive plus the design system would carry over unchanged.

## Footer

This is Project 3 of a five project AI portfolio. The streaming primitive plus the design system across Projects 1, 2, and 3 closes the BI workflow loop: raw data to dashboard (Project 1), dashboard to deck (Project 2), and now sprint to brief (Project 3). Next up: Project 4 (Anomaly Alerting) with synthetic time series plus AI root cause narration.

- **Live demo**: <https://ai-portfolio-sprint-intelligence.vercel.app>
- **Source**: [`apps/sprint-intelligence`](https://github.com/rishigundla/ai-portfolio/tree/main/apps/sprint-intelligence)
- **Project 1 case study**: [`docs/case-studies/dashboard-factory.md`](./dashboard-factory.md)
- **Project 2 case study**: [`docs/case-studies/narrative-generator.md`](./narrative-generator.md)
- **Master plan**: [`docs/master-plan.md`](../master-plan.md)
- **Built by**: [Rishikesh Gundla](https://rishikeshgundla.com)
