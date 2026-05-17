"""Log W10.D7 filter bar plus KPI strip rewrite plus layout flip."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_day = (
    '{ num: "W10.D7", weekday: "Sun", name: "Phase 3 Wrap", '
    'tasks: ["Buffer", "Lessons learned", "Prep Phase 4"] }'
)
new_day = (
    '{ num: "W10.D7", weekday: "Sun", name: "Filter bar, KPI strips, layout flip", '
    'tasks: ["New SprintFilters client component with three select controls (assignee, ticket type, status) that read and write search params via router.replace, plus a clear all link. URL state mirrors the existing eng=N drill down pattern", '
    '"New TopKpiStrip server component renders seven tiles in a grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 layout: Total Tickets, Completion percent (with progress bar), Done, In Review, In Progress, Open, Avg Cycle Time", '
    '"New StoryPointsStrip server component renders six tiles: SP Completed, In Progress, In Review, Open, Total SP, Missing SP (count of tickets with estimate 0). Rose tinted Missing tile when greater than zero", '
    '"Page layout flipped. Filters plus the two KPI strips at the top, then the existing eight team KPI cards (status mix plus blocked plus workload now respect filters, burndown plus velocity plus cycle time plus throughput plus scope creep plus carryover stay sprint level), then per engineer deep dive, then the AI brief at the bottom. /sprint/[id] First Load JS at 52.9 kB versus the W10.D6 baseline of 52.2 kB, a 0.7 kB cost for the new client filter"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D7 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 10 · Day 6 (4 tasks - 6 monthly sprint fixtures, ticket schema with eta + createdAt + 4 new types, status-driven colors with slate token, 3-column gallery + 6 brief fixtures)\n'
    '        "10-W10.D6-0", "10-W10.D6-1", "10-W10.D6-2", "10-W10.D6-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 10 · Day 6 (4 tasks - 6 monthly sprint fixtures, ticket schema with eta + createdAt + 4 new types, status-driven colors with slate token, 3-column gallery + 6 brief fixtures)\n'
    '        "10-W10.D6-0", "10-W10.D6-1", "10-W10.D6-2", "10-W10.D6-3",\n'
    '        // Phase 3 · Week 10 · Day 7 (4 tasks - SprintFilters with three search param selects, TopKpiStrip with seven tiles, StoryPointsStrip with six tiles, layout flip moving the AI brief to the bottom)\n'
    '        "10-W10.D7-0", "10-W10.D7-1", "10-W10.D7-2", "10-W10.D7-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W10.D6 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c5 W10.D6 - Sprint Intelligence monthly sprint model and 6-card gallery",'
)
desc = (
    "Sprint detail page rebuilt around the DE Tracker layout pattern from the user feedback. "
    "Three new components landed. SprintFilters is a client component with three select controls "
    "(assignee = Everyone or one of the eight engineers, ticket type = All or bug or development "
    "or enhancement or deployment, status = All or done or in review or in progress or to do or "
    "blocked). Selections write the search params via router.replace with scroll false, same "
    "pattern as the W10.D1 eng=N drill down. A clear all link appears when any filter is active. "
    "TopKpiStrip is a server component rendering seven tiles in a grid-cols-2 sm:grid-cols-4 "
    "lg:grid-cols-7 layout: Total Tickets, Completion percent (with a thin progress bar), Done, "
    "In Review, In Progress, Open, Avg Cycle Time. StoryPointsStrip is a server component "
    "rendering six tiles: SP Completed, In Progress, In Review, Open, Total SP, plus Missing SP "
    "(count of tickets with estimate zero). The Missing tile turns rose when greater than zero. "
    "Page restructured. Header is unchanged. Below the header: filters bar, then the two KPI "
    "strips back to back, then the existing eight team KPI cards section (status mix, blocked, "
    "and workload now respect the filters; burndown, velocity, cycle time chart, throughput, "
    "scope creep, and carryover stay sprint level since those are aggregate signals not "
    "per ticket). Per engineer deep dive section sits below, still using the eng search param "
    "for drill in. AI brief section moved from the top of the page to the bottom as the closing "
    "narrative summary. Brief panel now wrapped in a Suspense boundary with BriefSkeleton "
    "fallback so the rest of the page paints first. Filter aware engineer deep dives are built "
    "by passing a temporary fixture clone with filteredTickets to buildEngineerDeepDive, so the "
    "workload card and the per engineer tabs both reflect the active filter. Filter aware "
    "BlockedCard uses the same trick. New helpers in lib/kpi-calc.ts: applyTicketFilters, "
    "hasActiveFilter, computeTopKpis, computeStoryPointsKpis, plus exported "
    "TICKET_TYPE_OPTIONS and TICKET_STATUS_OPTIONS arrays for the select labels. "
    "Build clean via direct next build: 13 static pages prerendered, /sprint/[id] First Load JS "
    "at 52.9 kB versus 52.2 kB after W10.D6 (a 0.7 kB cost for the new client filter, under the "
    "60 kB target). Type check clean. No deploy this day."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W10.D7 - Sprint Intelligence filter bar, KPI strips, layout flip",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D8 - Per ticket charts, future sprint variant, redeploy. Add AvgDaysInStatusChart, PriorityBreakdownChart, EtaCard, CycleTimeBars (per ticket), AgingTicketsCard, WorkloadByAssignee (DE Tracker style with completion ratio fill), SprintHistoryTable across all six sprints, SprintTrendCharts for tickets closed plus SP per sprint. Branch the page for the future sprint (jun-2026) to surface the backlog plus the manager allocation preview instead of zero filled charts. Update portfolio.meta.json deployedAt. Run vercel --prod --yes from the repo root."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c5 W10.D6 - Sprint Intelligence monthly sprint model and 6-card gallery",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 6 - Sprint model rebuilt around calendar months. Six monthly sprint fixtures '
    '(jan to jun 2026), four ticket types, eta plus createdAt added. Status-driven colors with a '
    'new slate token. Build clean: 13 static pages, /sprint/[id] First Load JS 52.2 kB."'
)
new_day_row = (
    '"Week 10 · Day 7 - Filter bar plus KPI strip rewrite plus layout flip. Three select '
    'SprintFilters (assignee, type, status), seven tile TopKpiStrip plus six tile '
    'StoryPointsStrip styled after the DE Tracker, AI brief moved to the bottom. '
    '/sprint/[id] First Load JS at 52.9 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f4c5 W10.D6 - Sprint Intelligence monthly sprint model and 6-card gallery"
md_new = (
    "### 2026-05-17 · \U0001f9ed W10.D7 - Sprint Intelligence filter bar, KPI strips, layout flip\n"
    "- **`SprintFilters` client component.** Three select controls (assignee, ticket type, status) that read and write search params via `router.replace` with `scroll: false`. Mirrors the W10.D1 `eng=N` drill down URL pattern. A clear all link appears when any filter is active.\n"
    "- **`TopKpiStrip` server component.** Seven tiles in a `grid-cols-2 sm:grid-cols-4 lg:grid-cols-7` layout: Total Tickets, Completion percent (with a thin progress bar), Done, In Review, In Progress, Open, Avg Cycle Time. Coherent shades: emerald for done, violet for in review, amber for in progress, slate for open.\n"
    "- **`StoryPointsStrip` server component.** Six tiles: SP Completed, In Progress, In Review, Open, Total SP, plus Missing SP (count of tickets with `estimate === 0`). The Missing tile turns rose when greater than zero.\n"
    "- **Page layout flipped.** Filters bar, then the two KPI strips back to back, then the existing eight team KPI cards (status mix, blocked, workload respect the filters; burndown, velocity, cycle time chart, throughput, scope creep, carryover stay sprint level), then per engineer deep dive, then the AI brief at the bottom as the closing narrative.\n"
    "- **Filter aware engineer deep dives.** A temporary fixture clone with `tickets: filteredTickets` feeds `buildEngineerDeepDive` so the workload card and the per engineer tabs both reflect the active filter. The `BlockedCard` uses the same trick.\n"
    "- **New `lib/kpi-calc.ts` helpers.** `applyTicketFilters`, `hasActiveFilter`, `computeTopKpis`, `computeStoryPointsKpis`. Exported `TICKET_TYPE_OPTIONS` and `TICKET_STATUS_OPTIONS` arrays back the select labels. Fixed the stale `sprint-44` reference in `estimateOldestBlockAge` to `mar-2026`.\n"
    "- **Brief panel** now wrapped in a `Suspense` boundary with `BriefSkeleton` fallback so the rest of the page paints first.\n"
    "- **Build clean** via direct `next build`. 13 static pages prerendered, `/sprint/[id]` First Load JS at 52.9 kB versus 52.2 kB after W10.D6 (a 0.7 kB cost for the new client filter, under the 60 kB target). Type check clean. No deploy this day.\n"
    "- **Next**: W10.D8 - Per ticket charts, future sprint variant, redeploy. Add `AvgDaysInStatusChart`, `PriorityBreakdownChart`, `EtaCard`, `CycleTimeBars` (per ticket), `AgingTicketsCard`, `WorkloadByAssignee` (DE Tracker style with completion ratio fill), `SprintHistoryTable` across all six sprints, `SprintTrendCharts` for tickets closed plus SP per sprint. Branch the page for the future sprint (`jun-2026`). Update `portfolio.meta.json` `deployedAt`. Run `vercel --prod --yes` from the repo root.\n"
    "\n"
    "### 2026-05-17 · \U0001f4c5 W10.D6 - Sprint Intelligence monthly sprint model and 6-card gallery"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D6 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 6 - Sprint model rebuilt around calendar months. Six "
    "monthly sprint fixtures (`jan` to `jun` 2026), four ticket types, `eta` plus `createdAt` "
    "added. Status-driven colors with a new `slate` token. Build clean: 13 static pages. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 7 - Filter bar plus KPI strip rewrite plus layout flip. "
    "Three select `SprintFilters`, seven tile `TopKpiStrip` plus six tile `StoryPointsStrip` "
    "styled after the DE Tracker, AI brief moved to the bottom. `/sprint/[id]` First Load JS at 52.9 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
