"""Log W10.D11: trend chart segment annotations + realistic workSchedule for heatmap and Gantt."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_d10_close = (
    '            { num: "W10.D10", weekday: "Tue", name: "Throughput redesign, deep dive merge, heatmap, Gantt, trend chart fix", '
    'tasks: ["ThroughputChart redesigned. Week 1 and Week 2 numbers render in font-display text-2xl bold above each bar, Prior avg renders in muted slate as a reference. Bar heights are proportional to the max of the three values inside an h-40 container. Legend below clarifies This sprint versus Prior average colors. SprintTrendCharts (tickets closed per sprint plus story points per sprint) bars fixed via the same h-full plus minHeight 4px pattern as PriorityBreakdownChart in W10.D9. Title attribute on every column for hover details", '
    '"Deep dive panel merged with the top filter. EngineerTabs client component plus its ?eng URL param removed entirely. New DeepDivePanel server component reads the active engineer from the top assignee filter. With Everyone selected, the panel switches to a Team total view (team workload, team completion, team cycle time versus baseline, team review queue, plus a priority mix and status mix across the filtered tickets). With a specific engineer selected, the panel shows that engineer plus the new heatmap and Gantt", '
    '"TicketHeatmap server component renders tickets across rows plus sprint days across columns. Filled cells mark days the ticket was active, colored by status (done emerald, in progress amber, in review violet, blocked rose, todo slate). Top 12 tickets by descending active span. Day axis with marks at 1, 5, 10, 15, 20, 25, and the last day. Overflow-x-auto so the 31-column May heatmap scrolls cleanly on mobile. Hover titles on every row plus every active cell", '
    '"TicketGantt server component renders the same timeline data as continuous horizontal bars per ticket. Bar color matches the status. To-do tickets render as a dashed planned range at low opacity so the manager can see what is queued up. computeTicketTimelines helper derives the per ticket startDay and endDay from createdAt plus estimate plus the sprint window plus the current day for in-flight sprints. Build clean, type check clean. /sprint/[id] First Load JS dropped from 52.4 to 50.4 kB (a 2 kB win from removing the EngineerTabs client island). Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] }\n'
    '          ],'
)
new_d10_plus_d11 = (
    '            { num: "W10.D10", weekday: "Tue", name: "Throughput redesign, deep dive merge, heatmap, Gantt, trend chart fix", '
    'tasks: ["ThroughputChart redesigned. Week 1 and Week 2 numbers render in font-display text-2xl bold above each bar, Prior avg renders in muted slate as a reference. Bar heights are proportional to the max of the three values inside an h-40 container. Legend below clarifies This sprint versus Prior average colors. SprintTrendCharts (tickets closed per sprint plus story points per sprint) bars fixed via the same h-full plus minHeight 4px pattern as PriorityBreakdownChart in W10.D9. Title attribute on every column for hover details", '
    '"Deep dive panel merged with the top filter. EngineerTabs client component plus its ?eng URL param removed entirely. New DeepDivePanel server component reads the active engineer from the top assignee filter. With Everyone selected, the panel switches to a Team total view (team workload, team completion, team cycle time versus baseline, team review queue, plus a priority mix and status mix across the filtered tickets). With a specific engineer selected, the panel shows that engineer plus the new heatmap and Gantt", '
    '"TicketHeatmap server component renders tickets across rows plus sprint days across columns. Filled cells mark days the ticket was active, colored by status (done emerald, in progress amber, in review violet, blocked rose, todo slate). Top 12 tickets by descending active span. Day axis with marks at 1, 5, 10, 15, 20, 25, and the last day. Overflow-x-auto so the 31-column May heatmap scrolls cleanly on mobile. Hover titles on every row plus every active cell", '
    '"TicketGantt server component renders the same timeline data as continuous horizontal bars per ticket. Bar color matches the status. To-do tickets render as a dashed planned range at low opacity so the manager can see what is queued up. computeTicketTimelines helper derives the per ticket startDay and endDay from createdAt plus estimate plus the sprint window plus the current day for in-flight sprints. Build clean, type check clean. /sprint/[id] First Load JS dropped from 52.4 to 50.4 kB (a 2 kB win from removing the EngineerTabs client island). Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] },\n'
    '            { num: "W10.D11", weekday: "Wed", name: "Realistic work schedule, sparse heatmap, Gantt run segments, trend chart numbers", '
    'tasks: ["New workSchedule field per ticket synthesized in scripts/generate-monthly-sprints.py. Hash-deterministic (sprint_id, ticket_id) sampler picks a priority-aware start day (P0 plus mid-sprint additions at createdDay, P1 zero to two day delay, P2 one to five day delay, P3 three to ten day delay), then spreads estimate days of active work across a sparse window with context-switch gaps. Weekend days are skipped via a date math helper, so the heatmap matches a real work week", '
    '"Mid-sprint additions (Feb 2026 customer escalation tickets DE-2113 through DE-2118 plus DE-2126) now start their work schedule around day 9 to 13, matching their createdAt, not at day 1. Blocked tickets show one to three active days then idle. Done tickets show estimate-aware active days within their priority window. In-progress and in-review tickets anchor the last active day at the current sprint day", '
    '"TicketTimeline shape updated. activeDays plus runs replace the old contiguous startDay-to-endDay span. computeTicketTimelines reads ticket.workSchedule directly, collapses consecutive days into runs via a small helper, and sorts by descending active day count. TicketHeatmap renders only the listed activeDays as filled cells (sparse with gaps). TicketGantt renders one bar segment per run so gaps in the work cadence are visually obvious. Todo tickets still show a dashed planned range using createdAt plus estimate", '
    '"SprintTrendCharts segment annotations. Each column on the Tickets Closed per Sprint and Story Points per Sprint charts now displays both segment counts above the bar in their respective colors (closed in green plus open in rose, done SP in blue plus remaining SP in amber). Chart height bumped from h-48 to h-56 to fit the annotation row. Title attribute on every segment for hover. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] }\n'
    '          ],'
)
if old_d10_close not in html:
    raise SystemExit("Could not locate W10.D10 day-array tail")
html = html.replace(old_d10_close, new_d10_plus_d11, 1)

insert_marker = '"10-W10.D10-3"\n      ],'
new_tail = (
    '"10-W10.D10-3",\n'
    '        // Phase 3 · Week 10 · Day 11 (4 tasks - workSchedule synth, sparse heatmap, Gantt run segments, trend chart segment annotations)\n'
    '        "10-W10.D11-0", "10-W10.D11-1", "10-W10.D11-2", "10-W10.D11-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D10 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c8 W10.D10 - Sprint Intelligence throughput redesign, deep dive merge, heatmap, Gantt",'
)
desc = (
    "Polish round 3 after the live review. Two fixes that lift the data honesty of the deep "
    "dive plus the cross sprint trend charts. New workSchedule field on every ticket synthesized "
    "in scripts/generate-monthly-sprints.py via the existing hash-deterministic "
    "(sprint_id, ticket_id) sampler. The synth picks a priority-aware start day (P0 plus mid "
    "sprint additions at createdDay, P1 zero to two day delay, P2 one to five day delay, P3 "
    "three to ten day delay), then spreads estimate days of active work across a sparse window "
    "with context-switch gaps. Weekend days are skipped via a date math helper, so the heatmap "
    "matches a real work week. Mid sprint additions on the feb sprint (customer escalation "
    "tickets DE-2113 through DE-2118 plus DE-2126) now start their work schedule around day "
    "9 to 13, matching createdAt, not at day 1. Blocked tickets show one to three active days "
    "then idle. Done tickets show estimate-aware active days within their priority window. "
    "In-progress and in-review tickets anchor the last active day at the current sprint day. "
    "TicketTimeline shape updated: activeDays plus runs replace the old contiguous "
    "startDay-to-endDay span. computeTicketTimelines reads ticket.workSchedule directly, "
    "collapses consecutive days into runs via a small helper, and sorts by descending active "
    "day count. TicketHeatmap renders only the listed activeDays as filled cells (sparse with "
    "gaps). TicketGantt renders one bar segment per run so gaps in the work cadence are "
    "visually obvious. Todo tickets still show a dashed planned range. SprintTrendCharts gained "
    "segment annotations. Each column on the Tickets Closed per Sprint and Story Points per "
    "Sprint charts now displays both segment counts above the bar in their respective colors "
    "(closed in green plus open in rose, done SP in blue plus remaining SP in amber). Chart "
    "height bumped from h-48 to h-56 to fit the annotation row. Title attribute on every "
    "segment for hover. Build clean, type check clean. /sprint/[id] First Load JS unchanged at "
    "50.4 kB. Redeployed to prod, all eight routes plus two filtered variants "
    "(/sprint/may-2026?assignee=eng-1 and /sprint/feb-2026?assignee=eng-2) returned HTTP 200 on "
    "smoke check."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f5d3️ W10.D11 - Sprint Intelligence realistic workSchedule, sparse heatmap, Gantt run segments, trend chart numbers",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Mirror the narrative-generator case study structure. Three engineering moments to cover: the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern shared across every dashboard surface (top filter feeds KPI strips, charts, deep dive, heatmap, Gantt), and the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS. Wire caseStudyUrl in portfolio.meta.json once the file lands."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c8 W10.D10 - Sprint Intelligence throughput redesign, deep dive merge, heatmap, Gantt",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 10 - Throughput card redesigned, SprintTrendCharts bars fixed, deep dive '
    'merged with the top assignee filter (Team total view when Everyone is selected, '
    'per engineer otherwise). New TicketHeatmap plus TicketGantt server components show per-day '
    'activity plus per-ticket progress. /sprint/[id] First Load JS down to 50.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 11 - workSchedule synth (priority-aware start, weekend-skipped active days, '
    'context-switch gaps) makes the heatmap sparse and the Gantt show run segments. Mid sprint '
    'additions start mid sprint. SprintTrendCharts columns now show both segment numbers above '
    'each bar. Live deploy 50.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f4c8 W10.D10 - Sprint Intelligence throughput redesign, deep dive merge, heatmap, Gantt"
md_new = (
    "### 2026-05-17 · \U0001f5d3️ W10.D11 - Sprint Intelligence realistic workSchedule, sparse heatmap, Gantt run segments, trend chart numbers\n"
    "- **Realistic `workSchedule` per ticket.** New field synthesized in `scripts/generate-monthly-sprints.py` via the existing hash-deterministic `(sprint_id, ticket_id)` sampler. Priority-aware start day (P0 plus mid sprint at `createdDay`, P1 +0-2d, P2 +1-5d, P3 +3-10d), `estimate`-aware active day count, context-switch gaps, weekends skipped. Stored on each ticket as `workSchedule: number[]`.\n"
    "- **Mid sprint additions start mid sprint.** Feb customer escalation tickets (DE-2113-DE-2118, DE-2126) now have a `workSchedule` starting day 9-13 (matching `createdAt`), not day 1. Blocked tickets show 1-3 active days then idle. Done tickets show estimate-aware active days. In-flight tickets anchor the last active day at the current sprint day.\n"
    "- **`TicketTimeline` rewritten.** `activeDays: number[]` plus `runs: Array<{start, end}>` replace the old contiguous `startDay`-to-`endDay` span. `computeTicketTimelines` reads `ticket.workSchedule` directly, collapses consecutive days into runs via a small helper, and sorts by descending active day count.\n"
    "- **Heatmap is sparse.** `TicketHeatmap` renders only the listed `activeDays` as filled cells. Distribution is visible at a glance: bugs cluster around their mid-sprint createdAt, P3 tickets cluster late, blocked tickets show short stalled runs.\n"
    "- **Gantt shows runs.** `TicketGantt` renders one bar segment per `run` so gaps in the work cadence are obvious. Todo tickets still show a single dashed planned range using `createdAt` plus `estimate`.\n"
    "- **`SprintTrendCharts` segment annotations.** Each column on Tickets Closed per Sprint and Story Points per Sprint now displays both segment counts above the bar in their respective colors (closed in emerald plus open in rose, completed SP in blue plus remaining SP in amber). Chart height bumped from `h-48` to `h-56` to fit the annotation row. `title` attribute on every segment for hover.\n"
    "- **Build clean, type check clean.** `/sprint/[id]` First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Three engineering moments: monorepo `rootDirectory` workaround, search-param-driven filter pattern (now shared across every dashboard surface — top filter feeds KPI strips, charts, deep dive, heatmap, Gantt), manifest enrichment pattern.\n"
    "\n"
    "### 2026-05-17 · \U0001f4c8 W10.D10 - Sprint Intelligence throughput redesign, deep dive merge, heatmap, Gantt"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D10 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 10 - Throughput card redesigned, `SprintTrendCharts` bars "
    "fixed, deep dive merged with the top assignee filter (Team total view when Everyone is "
    "selected, per engineer otherwise). New `TicketHeatmap` plus `TicketGantt` server components "
    "show per-day activity plus per-ticket progress. `/sprint/[id]` First Load JS down to 50.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 11 - `workSchedule` synth (priority-aware start, "
    "weekend-skipped active days, context-switch gaps) makes the heatmap sparse and the Gantt "
    "show run segments. Mid sprint additions start mid sprint. `SprintTrendCharts` columns now "
    "show both segment numbers above each bar. Live deploy 50.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
