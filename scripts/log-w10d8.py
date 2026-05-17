"""Log W10.D8 per ticket charts, future sprint variant, production redeploy."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# W10.D8 does not exist in the days array yet (the original W10 plan only had D1..D7).
# Insert a new W10.D8 entry after W10.D7 in the Week 10 days list.
old_d7_block = (
    '{ num: "W10.D7", weekday: "Sun", name: "Filter bar, KPI strips, layout flip", '
)
if old_d7_block not in html:
    raise SystemExit("Could not locate W10.D7 block start")

# Append D8 immediately after the W10.D7 entry. The W10.D7 entry ends with `] },`
# right before the closing of the days array `]`.
insert_marker = '"10-W10.D7-3"\n      ],'
new_d7_tail = (
    '"10-W10.D7-3",\n'
    '        // Phase 3 · Week 10 · Day 8 (4 tasks - eight new components for DE Tracker style analyses, future sprint variant on the planned status, production redeploy, smoke checks on all eight routes)\n'
    '        "10-W10.D8-0", "10-W10.D8-1", "10-W10.D8-2", "10-W10.D8-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D7 completed task tail")
html = html.replace(insert_marker, new_d7_tail, 1)

# Add the W10.D8 day entry to the Week 10 days array. The days array ends with
# the W10.D7 entry and a `]` close.
old_days_close = (
    '            { num: "W10.D7", weekday: "Sun", name: "Filter bar, KPI strips, layout flip", '
    'tasks: ["New SprintFilters client component with three select controls (assignee, ticket type, status) that read and write search params via router.replace, plus a clear all link. URL state mirrors the existing eng=N drill down pattern", '
    '"New TopKpiStrip server component renders seven tiles in a grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 layout: Total Tickets, Completion percent (with progress bar), Done, In Review, In Progress, Open, Avg Cycle Time", '
    '"New StoryPointsStrip server component renders six tiles: SP Completed, In Progress, In Review, Open, Total SP, Missing SP (count of tickets with estimate 0). Rose tinted Missing tile when greater than zero", '
    '"Page layout flipped. Filters plus the two KPI strips at the top, then the existing eight team KPI cards (status mix plus blocked plus workload now respect filters, burndown plus velocity plus cycle time plus throughput plus scope creep plus carryover stay sprint level), then per engineer deep dive, then the AI brief at the bottom. /sprint/[id] First Load JS at 52.9 kB versus the W10.D6 baseline of 52.2 kB, a 0.7 kB cost for the new client filter"] }\n'
    '          ],'
)
new_days_close = (
    '            { num: "W10.D7", weekday: "Sun", name: "Filter bar, KPI strips, layout flip", '
    'tasks: ["New SprintFilters client component with three select controls (assignee, ticket type, status) that read and write search params via router.replace, plus a clear all link. URL state mirrors the existing eng=N drill down pattern", '
    '"New TopKpiStrip server component renders seven tiles in a grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 layout: Total Tickets, Completion percent (with progress bar), Done, In Review, In Progress, Open, Avg Cycle Time", '
    '"New StoryPointsStrip server component renders six tiles: SP Completed, In Progress, In Review, Open, Total SP, Missing SP (count of tickets with estimate 0). Rose tinted Missing tile when greater than zero", '
    '"Page layout flipped. Filters plus the two KPI strips at the top, then the existing eight team KPI cards (status mix plus blocked plus workload now respect filters, burndown plus velocity plus cycle time plus throughput plus scope creep plus carryover stay sprint level), then per engineer deep dive, then the AI brief at the bottom. /sprint/[id] First Load JS at 52.9 kB versus the W10.D6 baseline of 52.2 kB, a 0.7 kB cost for the new client filter"] },\n'
    '            { num: "W10.D8", weekday: "Mon", name: "Per ticket charts, future sprint variant, redeploy", '
    'tasks: ["Eight new server components for DE Tracker style analyses: AvgDaysInStatusChart, PriorityBreakdownChart, EtaCard (Missing ETA plus Overdue), CycleTimeBars (per ticket horizontal bars color graded against baseline), AgingTicketsCard, WorkloadByAssignee (DE Tracker style with completed share fill), SprintHistoryTable (all six sprints), SprintTrendCharts (tickets closed per sprint plus SP per sprint stacked columns)", '
    '"Eight new kpi-calc helpers backing those components: computeAvgDaysInStatus, computePriorityBreakdown, computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, plus enriched manifest reads. The manifest itself was extended with closedCount, openCount, spCompleted, and spTotal per sprint so SprintHistoryTable and SprintTrendCharts render without importing all six fixtures (zero extra First Load JS for the cross sprint widgets)", '
    '"Future sprint variant. /sprint/jun-2026 (status planned) hides the Per ticket signals section and the Sprint health section (burndown plus velocity plus cycle time chart plus throughput plus scope creep plus carryover) because none of those metrics make sense before sprint start. The page leads with the ETA card and the workload by assignee allocation preview, then shows the six sprint history table and trend charts for context, then the planning brief. The header swaps tickets for backlog in the meta strip and hides the scope summary", '
    '"Production redeploy. vercel --prod --yes from the repo root using the existing .vercel link. Aliased deploy at https://ai-portfolio-sprint-intelligence.vercel.app. Smoke checks via curl across /, /sprints, and all six /sprint/[id] routes all returned HTTP 200. /sprint/[id] First Load JS at 52.4 kB versus the W10.D7 baseline of 52.9 kB, a 0.5 kB win from dropping the TeamWorkloadCard client import in favor of the new server side WorkloadByAssignee. portfolio.meta.json deployedAt 2026-05-17, lastUpdatedAt 2026-05-17"] }\n'
    '          ],'
)
if old_days_close not in html:
    raise SystemExit("Could not locate Week 10 days array close")
html = html.replace(old_days_close, new_days_close, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W10.D7 - Sprint Intelligence filter bar, KPI strips, layout flip",'
)
desc = (
    "Per ticket charts plus the future sprint variant plus the production redeploy landed. "
    "Eight new server components fill out the DE Tracker style analysis surface that the user "
    "asked for. AvgDaysInStatusChart renders a horizontal bar per status, sorted by occupancy. "
    "PriorityBreakdownChart renders one stacked column per priority (P0 to P3) with the Done "
    "share in green and Remaining in rose. EtaCard renders two tiles: Missing ETA (count of "
    "tickets without a committed eta) and Overdue (count of tickets where the eta has passed "
    "but the work is not done), both tinted when greater than zero. CycleTimeBars renders one "
    "horizontal bar per completed ticket, color graded fast under one and a half times baseline, "
    "on track up to five times baseline, slow beyond. AgingTicketsCard mirrors the same "
    "treatment for still open tickets sorted by age. WorkloadByAssignee renders one row per "
    "engineer with the completion share filling in green and the remaining share in indigo, "
    "matching the DE Tracker workload by requester pattern. SprintHistoryTable renders a small "
    "table at the bottom of every detail page with all six sprints, columns Sprint, Total, "
    "Closed, Open, Completion percent, SP done, SP total, plus a thin progress bar. "
    "SprintTrendCharts renders two stacked column charts side by side, tickets closed per sprint "
    "on the left, story points per sprint on the right, one column per sprint across all six. "
    "Eight new kpi-calc helpers back those components. The manifest itself was extended with "
    "closedCount, openCount, spCompleted, and spTotal per sprint so SprintHistoryTable and "
    "SprintTrendCharts render directly from the manifest without importing the six fixtures "
    "(zero extra First Load JS for the cross sprint widgets). Future sprint variant lives in "
    "page.tsx as an isPlanned branch on summary.status. /sprint/jun-2026 hides the Per ticket "
    "signals section and the Sprint health section (burndown plus velocity plus cycle time plus "
    "throughput plus scope creep plus carryover) because none of those metrics make sense before "
    "sprint start. The page leads with the ETA card and the workload by assignee allocation "
    "preview, then surfaces the six sprint history table and trend charts for context, then "
    "the planning brief at the bottom. Production redeploy ran clean via vercel --prod --yes "
    "from the repo root (36 second build on iad1, all six sprint slugs prerendered, aliased to "
    "the stable URL). Smoke checks via curl on /, /sprints, and all six /sprint/[id] routes "
    "all returned HTTP 200. /sprint/[id] First Load JS at 52.4 kB versus 52.9 kB after W10.D7, "
    "a 0.5 kB win from dropping the TeamWorkloadCard client import in favor of the new server "
    "side WorkloadByAssignee component."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4ca W10.D8 - Sprint Intelligence per ticket charts, future sprint variant, redeploy",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Mirror the narrative-generator case study structure (problem framing, approach, architecture, three engineering moments, tech stack, impact). Three engineering moments to cover: the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern shared with the eng=N drill down, and the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS. Wire caseStudyUrl in portfolio.meta.json once the file lands."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W10.D7 - Sprint Intelligence filter bar, KPI strips, layout flip",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 7 - Filter bar plus KPI strip rewrite plus layout flip. Three select '
    'SprintFilters (assignee, type, status), seven tile TopKpiStrip plus six tile '
    'StoryPointsStrip styled after the DE Tracker, AI brief moved to the bottom. '
    '/sprint/[id] First Load JS at 52.9 kB."'
)
new_day_row = (
    '"Week 10 · Day 8 - Per ticket charts, future sprint variant, production redeploy. Eight '
    'new server components (AvgDaysInStatus, PriorityBreakdown, EtaCard, CycleTimeBars, '
    'AgingTickets, WorkloadByAssignee, SprintHistoryTable, SprintTrendCharts), enriched '
    'manifest for cross sprint widgets at zero First Load JS cost. /sprint/jun-2026 branches to '
    'a backlog focused layout. Live deploy 52.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f9ed W10.D7 - Sprint Intelligence filter bar, KPI strips, layout flip"
md_new = (
    "### 2026-05-17 · \U0001f4ca W10.D8 - Sprint Intelligence per ticket charts, future sprint variant, redeploy\n"
    "- **Eight new server components** fill out the DE Tracker style analysis surface from the user feedback. `AvgDaysInStatusChart` (horizontal bar per status), `PriorityBreakdownChart` (stacked column per priority, Done versus Remaining), `EtaCard` (Missing ETA plus Overdue tiles), `CycleTimeBars` (per completed ticket bar, color graded against the team baseline), `AgingTicketsCard` (per open ticket bar, sorted by age), `WorkloadByAssignee` (DE Tracker style row per engineer with completion share fill), `SprintHistoryTable` (all six sprints with completion percent and progress bar per row), `SprintTrendCharts` (Tickets Closed per Sprint plus Story Points per Sprint stacked columns side by side).\n"
    "- **Eight new `lib/kpi-calc.ts` helpers** back those components. `computeAvgDaysInStatus`, `computePriorityBreakdown`, `computeEtaSummary`, `computePerTicketCycleTime`, `computeAgingTickets`, `computeWorkloadByAssignee`. Date math uses a constant `TODAY = '2026-05-17'` for deterministic output (fixtures are synthetic).\n"
    "- **Manifest enriched** with `closedCount`, `openCount`, `spCompleted`, `spTotal` per sprint via `scripts/generate-monthly-sprints.py`. `SprintHistoryTable` and `SprintTrendCharts` read directly from the manifest, so cross sprint widgets cost zero extra First Load JS instead of pulling in all six fixtures.\n"
    "- **Future sprint variant.** `/sprint/jun-2026` (status `planned`) hides the Per ticket signals section and the Sprint health section (burndown plus velocity plus cycle time chart plus throughput plus scope creep plus carryover) because none of those metrics make sense before sprint start. The page leads with the ETA card and the workload by assignee allocation preview, then surfaces the six sprint history table and trend charts for context, then the planning brief at the bottom. Header meta strip swaps `tickets` for `backlog` and hides the scope summary.\n"
    "- **Production redeploy.** `vercel --prod --yes` from the repo root using the existing `.vercel/project.json` link. 36 second build on Node 24 in iad1. Aliased to <https://ai-portfolio-sprint-intelligence.vercel.app>. Smoke checks via `curl` on `/`, `/sprints`, and all six `/sprint/[id]` routes all returned HTTP 200.\n"
    "- **Bundle.** `/sprint/[id]` First Load JS at 52.4 kB versus 52.9 kB after W10.D7, a 0.5 kB win from dropping the `TeamWorkloadCard` client import in favor of the new server side `WorkloadByAssignee` component. `portfolio.meta.json` `deployedAt: 2026-05-17`, `lastUpdatedAt: 2026-05-17`.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Mirror the narrative-generator case study structure. Three engineering moments to cover: the monorepo `rootDirectory` workaround for the Vercel deploy (W10.D5), the search param driven filter pattern shared with the `eng=N` drill down (W10.D1 + W10.D7), and the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS (W10.D8). Wire `caseStudyUrl` in `portfolio.meta.json` once the file lands.\n"
    "\n"
    "### 2026-05-17 · \U0001f9ed W10.D7 - Sprint Intelligence filter bar, KPI strips, layout flip"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D7 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 7 - Filter bar plus KPI strip rewrite plus layout flip. "
    "Three select `SprintFilters`, seven tile `TopKpiStrip` plus six tile `StoryPointsStrip` "
    "styled after the DE Tracker, AI brief moved to the bottom. `/sprint/[id]` First Load JS at 52.9 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 8 - Per ticket charts, future sprint variant, production "
    "redeploy. Eight new server components (`AvgDaysInStatus`, `PriorityBreakdown`, `EtaCard`, "
    "`CycleTimeBars`, `AgingTickets`, `WorkloadByAssignee`, `SprintHistoryTable`, "
    "`SprintTrendCharts`), enriched manifest. `/sprint/jun-2026` branches to a backlog focused layout. "
    "Live deploy 52.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
