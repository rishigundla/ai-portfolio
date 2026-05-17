"""Log W10.D10: chart fixes, deep dive refactor, heatmap + Gantt."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_d9_close = (
    '            { num: "W10.D9", weekday: "Mon", name: "Polish round: BI content, chart fixes, hover affordances", '
    'tasks: ["All 138 tickets across the six sprints rewritten to BI / data engineering work themed around the user real anchor projects (NAI / NC2 / NCI Pulse on Databricks, Jira SSOT, RevOps ACV / GRR / QBR, Balanced Scorecard, Fabric Marketing plus Procurement, CX OKR, Tableau Server, Genie Space, dbt, ADF). Team roles refreshed to a realistic BI / DE org. Six brief fixtures rewritten to match the new narratives", '
    '"Avg time in current status chart fixed. New per-ticket daysInStatus field added to the TicketSpec, synthesized at fixture generation time with realistic per-status distributions (done 1.5 to 7d, in review 1 to 4d, in progress 2 to 8d, todo 0 to 12d, blocked 5 to 14d). computeAvgDaysInStatus reads t.daysInStatus directly. Section eyebrow renamed to Avg time in current status so the meaning is explicit. Numbers now read in the 2 to 12 day range instead of 100 plus", '
    '"Priority breakdown bars fixed (grid item is now h-full so the percent-based bar heights compute correctly, chart height bumped from h-44 to h-56, minHeight 4px so even tiny stacks remain visible). Sprint health and Status and priority and Per ticket signals grids all use items-start so velocity and throughput cards size to content instead of inflating to match burndown. Sprint card taglines hand authored per sprint with a key metric. Home page hero h1 plus subtitle plus all three StepCard descriptions refreshed to reference the BI angle, the filter bar, and the analysis layers", '
    '"Hover affordances added across the dashboard. Native title attribute on the sprint cards (gallery), the seven Top KPI tiles (each carrying a formula), the six Story Points tiles, the Avg days in status bars, the Priority Breakdown columns, the Cycle Time bars (ticket title plus tone), the Aging Tickets bars (ticket title plus age plus status), the Workload by Assignee rows (engineer name plus role plus done over total), the Sprint History rows (sprint name plus tagline), and the row link icons. /sprint/[id] First Load JS unchanged at 52.4 kB. Build clean, type check clean, redeployed to prod, all eight routes return HTTP 200"] }\n'
    '          ],'
)
new_d9_plus_d10 = (
    '            { num: "W10.D9", weekday: "Mon", name: "Polish round: BI content, chart fixes, hover affordances", '
    'tasks: ["All 138 tickets across the six sprints rewritten to BI / data engineering work themed around the user real anchor projects (NAI / NC2 / NCI Pulse on Databricks, Jira SSOT, RevOps ACV / GRR / QBR, Balanced Scorecard, Fabric Marketing plus Procurement, CX OKR, Tableau Server, Genie Space, dbt, ADF). Team roles refreshed to a realistic BI / DE org. Six brief fixtures rewritten to match the new narratives", '
    '"Avg time in current status chart fixed. New per-ticket daysInStatus field added to the TicketSpec, synthesized at fixture generation time with realistic per-status distributions (done 1.5 to 7d, in review 1 to 4d, in progress 2 to 8d, todo 0 to 12d, blocked 5 to 14d). computeAvgDaysInStatus reads t.daysInStatus directly. Section eyebrow renamed to Avg time in current status so the meaning is explicit. Numbers now read in the 2 to 12 day range instead of 100 plus", '
    '"Priority breakdown bars fixed (grid item is now h-full so the percent-based bar heights compute correctly, chart height bumped from h-44 to h-56, minHeight 4px so even tiny stacks remain visible). Sprint health and Status and priority and Per ticket signals grids all use items-start so velocity and throughput cards size to content instead of inflating to match burndown. Sprint card taglines hand authored per sprint with a key metric. Home page hero h1 plus subtitle plus all three StepCard descriptions refreshed to reference the BI angle, the filter bar, and the analysis layers", '
    '"Hover affordances added across the dashboard. Native title attribute on the sprint cards (gallery), the seven Top KPI tiles (each carrying a formula), the six Story Points tiles, the Avg days in status bars, the Priority Breakdown columns, the Cycle Time bars (ticket title plus tone), the Aging Tickets bars (ticket title plus age plus status), the Workload by Assignee rows (engineer name plus role plus done over total), the Sprint History rows (sprint name plus tagline), and the row link icons. /sprint/[id] First Load JS unchanged at 52.4 kB. Build clean, type check clean, redeployed to prod, all eight routes return HTTP 200"] },\n'
    '            { num: "W10.D10", weekday: "Tue", name: "Throughput redesign, deep dive merge, heatmap, Gantt, trend chart fix", '
    'tasks: ["ThroughputChart redesigned. Week 1 and Week 2 numbers render in font-display text-2xl bold above each bar, Prior avg renders in muted slate as a reference. Bar heights are proportional to the max of the three values inside an h-40 container. Legend below clarifies This sprint versus Prior average colors. SprintTrendCharts (tickets closed per sprint plus story points per sprint) bars fixed via the same h-full plus minHeight 4px pattern as PriorityBreakdownChart in W10.D9. Title attribute on every column for hover details", '
    '"Deep dive panel merged with the top filter. EngineerTabs client component plus its ?eng URL param removed entirely. New DeepDivePanel server component reads the active engineer from the top assignee filter. With Everyone selected, the panel switches to a Team total view (team workload, team completion, team cycle time versus baseline, team review queue, plus a priority mix and status mix across the filtered tickets). With a specific engineer selected, the panel shows that engineer plus the new heatmap and Gantt", '
    '"TicketHeatmap server component renders tickets across rows plus sprint days across columns. Filled cells mark days the ticket was active, colored by status (done emerald, in progress amber, in review violet, blocked rose, todo slate). Top 12 tickets by descending active span. Day axis with marks at 1, 5, 10, 15, 20, 25, and the last day. Overflow-x-auto so the 31-column May heatmap scrolls cleanly on mobile. Hover titles on every row plus every active cell", '
    '"TicketGantt server component renders the same timeline data as continuous horizontal bars per ticket. Bar color matches the status. To-do tickets render as a dashed planned range at low opacity so the manager can see what is queued up. computeTicketTimelines helper derives the per ticket startDay and endDay from createdAt plus estimate plus the sprint window plus the current day for in-flight sprints. Build clean, type check clean. /sprint/[id] First Load JS dropped from 52.4 to 50.4 kB (a 2 kB win from removing the EngineerTabs client island). Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] }\n'
    '          ],'
)
if old_d9_close not in html:
    raise SystemExit("Could not locate W10.D9 day-array tail")
html = html.replace(old_d9_close, new_d9_plus_d10, 1)

insert_marker = '"10-W10.D9-3"\n      ],'
new_tail = (
    '"10-W10.D9-3",\n'
    '        // Phase 3 · Week 10 · Day 10 (4 tasks - throughput redesign + trend chart fix, deep dive merged with top filter, heatmap, gantt)\n'
    '        "10-W10.D10-0", "10-W10.D10-1", "10-W10.D10-2", "10-W10.D10-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D9 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f3a8 W10.D9 - Sprint Intelligence polish: BI content, chart fixes, hover affordances",'
)
desc = (
    "Polish round 2 after the live review. Five concrete fixes. Throughput chart redesigned: "
    "Week 1 and Week 2 numbers now render in font-display text-2xl bold above each bar, Prior avg "
    "uses muted slate as a reference. Bar heights are proportional inside an h-40 container, "
    "minHeight 6px so even tiny week values stay visible. Legend below clarifies This sprint "
    "versus Prior average colors. SprintTrendCharts (Tickets Closed per Sprint plus Story Points "
    "per Sprint) bars finally render: the items-end h-40 collapse bug was fixed via the same "
    "h-full plus minHeight 4px pattern used on PriorityBreakdownChart in W10.D9. Deep dive "
    "panel merged with the top filter. The EngineerTabs client component plus its ?eng URL "
    "param are gone entirely (the file was deleted, EngineerTabsSkeleton removed from "
    "skeletons.tsx, no remaining references in the codebase). The new DeepDivePanel server "
    "component reads activeAssignee from the top assignee filter. When the user picks Everyone, "
    "the panel switches to a Team total view (team workload as priority weighted SP versus team "
    "capacity, team completion percent, team cycle time versus baseline with delta, team review "
    "queue tile, plus priority mix and status mix bars). When the user picks a specific "
    "engineer, the panel shows that engineer's deep dive plus two new visuals. The new "
    "TicketHeatmap renders tickets across rows plus sprint days across columns. Filled cells "
    "mark days the ticket was active, colored by status. Top 12 tickets by descending active "
    "span. Day axis with marks at 1, 5, 10, 15, 20, 25, and the last day. Overflow-x-auto so "
    "the 31-column May heatmap scrolls cleanly on mobile. The new TicketGantt renders the same "
    "timeline data as continuous horizontal bars per ticket, color graded by status. To-do "
    "tickets render as a dashed planned range at low opacity. computeTicketTimelines helper in "
    "lib/kpi-calc.ts derives per ticket startDay and endDay from createdAt plus estimate plus "
    "the sprint window plus the current day for in-flight sprints. Build clean, type check "
    "clean. /sprint/[id] First Load JS dropped from 52.4 kB to 50.4 kB (a 2 kB win from "
    "removing the EngineerTabs client island). Redeployed to prod, all eight routes plus two "
    "filtered variants (/sprint/may-2026?assignee=eng-1 and the same plus type=bug) returned "
    "HTTP 200 on smoke check."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c8 W10.D10 - Sprint Intelligence throughput redesign, deep dive merge, heatmap, Gantt",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Mirror the narrative-generator case study structure: problem framing, approach, architecture, three engineering moments (the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern shared across all surfaces now that the engineer tab strip is gone, the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS), tech stack, impact. Then wire caseStudyUrl in portfolio.meta.json."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f3a8 W10.D9 - Sprint Intelligence polish: BI content, chart fixes, hover affordances",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 9 - Polish round. All 138 tickets and 6 briefs rewritten to BI / DE work '
    '(Pulse SSOT, Jira SSOT, RevOps, Fabric, CX OKR, Tableau Server, Genie Space). Avg time '
    'in current status math fixed via a new daysInStatus field. Priority breakdown bars fixed, '
    'card grid stretch fixed, hover affordances added across nine surfaces, home page hero '
    'plus three step cards refreshed. Live deploy 52.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 10 - Throughput card redesigned, SprintTrendCharts bars fixed, deep dive '
    'merged with the top assignee filter (Team total view when Everyone is selected, '
    'per engineer otherwise). New TicketHeatmap plus TicketGantt server components show per-day '
    'activity plus per-ticket progress. /sprint/[id] First Load JS down to 50.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f3a8 W10.D9 - Sprint Intelligence polish: BI content, chart fixes, hover affordances"
md_new = (
    "### 2026-05-17 · \U0001f4c8 W10.D10 - Sprint Intelligence throughput redesign, deep dive merge, heatmap, Gantt\n"
    "- **Throughput card redesigned.** Week 1 and Week 2 numbers render in `font-display text-2xl bold` above each bar; Prior avg uses muted slate as a reference. Bar heights proportional inside an `h-40` container, `minHeight: 6px` so even tiny week values stay visible. Legend below the chart clarifies the colors.\n"
    "- **SprintTrendCharts bars rendered.** The `items-end h-40` collapse bug on `ClosedPerSprintChart` and `StoryPointsPerSprintChart` is fixed using the same `h-full` + `minHeight: 4px` pattern that fixed `PriorityBreakdownChart` in W10.D9. Both charts now show visible stacked columns per sprint.\n"
    "- **Deep dive merged with the top filter.** `EngineerTabs` client component plus its `?eng` URL param removed entirely. File deleted, `EngineerTabsSkeleton` removed from `skeletons.tsx`. New `DeepDivePanel` server component reads `activeAssignee` from the top assignee filter:\n"
    "  - Everyone selected → Team total view (team workload, team completion, team cycle time versus baseline with delta, team review queue, plus priority mix and status mix bars).\n"
    "  - Specific engineer selected → that engineer's deep dive plus the two new visuals.\n"
    "- **`TicketHeatmap`** (new server component). Tickets across rows, sprint days across columns. Filled cells mark days the ticket was active, colored by status (done emerald, in-progress amber, in-review violet, blocked rose, todo slate). Top 12 tickets by descending active span. Day axis with marks at 1, 5, 10, 15, 20, 25, and the last day. `overflow-x-auto` so the 31-column May heatmap scrolls cleanly on mobile. Hover titles on every row plus every active cell.\n"
    "- **`TicketGantt`** (new server component). Same timeline data rendered as continuous horizontal bars per ticket, color graded by status. To-do tickets render as a dashed planned range at low opacity.\n"
    "- **`computeTicketTimelines` helper** in `lib/kpi-calc.ts` derives per-ticket `startDay` and `endDay` from `createdAt` + `estimate` + the sprint window + `currentDay` for in-flight sprints. Sorted by descending `spanDays`.\n"
    "- **Build clean, type check clean.** `/sprint/[id]` First Load JS dropped from 52.4 kB to 50.4 kB (a 2 kB win from removing the `EngineerTabs` client island). Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200 on smoke check.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Mirror the narrative-generator case study structure. Three engineering moments to cover: the monorepo `rootDirectory` workaround, the search-param-driven filter pattern (now shared across every surface after the engineer tab strip retirement), and the manifest enrichment pattern.\n"
    "\n"
    "### 2026-05-17 · \U0001f3a8 W10.D9 - Sprint Intelligence polish: BI content, chart fixes, hover affordances"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D9 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 9 - Polish round. All 138 tickets and 6 briefs rewritten to "
    "BI / DE work (Pulse SSOT, Jira SSOT, RevOps, Fabric, CX OKR, Tableau Server, Genie Space). "
    "Avg time in current status math fixed via a new `daysInStatus` field. Priority breakdown bars "
    "fixed, card grid stretch fixed, hover affordances added across nine surfaces, home page hero "
    "plus three step cards refreshed. Live deploy 52.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 10 - Throughput card redesigned, `SprintTrendCharts` bars "
    "fixed, deep dive merged with the top assignee filter (Team total view when Everyone is "
    "selected, per engineer otherwise). New `TicketHeatmap` plus `TicketGantt` server components "
    "show per-day activity plus per-ticket progress. `/sprint/[id]` First Load JS down to 50.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
