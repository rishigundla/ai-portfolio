"""Log W9.D4 second KPI row work in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_tail = (
    '        // Phase 3 · Week 9 · Day 3 (4 tasks - burndown chart, velocity bar, status donut, blocked card)\n'
    '        "9-W9.D3-0", "9-W9.D3-1", "9-W9.D3-2", "9-W9.D3-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 3 (4 tasks - burndown chart, velocity bar, status donut, blocked card)\n'
    '        "9-W9.D3-0", "9-W9.D3-1", "9-W9.D3-2", "9-W9.D3-3",\n'
    '        // Phase 3 · Week 9 · Day 4 (4 tasks - cycle time trend, throughput per week, scope creep, carryover rate)\n'
    '        "9-W9.D4-0", "9-W9.D4-1", "9-W9.D4-2", "9-W9.D4-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D3 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-18",\n'
    '          title: "\U0001f4ca W9.D3 - Sprint Intelligence team KPI cards live",'
)
desc = (
    "Second KPI row landed. Eight cards now fill the Team KPIs section, split into the W9.D3 "
    "row (burndown, velocity, status mix, blocked) and the new W9.D4 row (cycle time trend, "
    "throughput per week, scope creep, carryover rate). All eight cards run off fixture data, "
    "no runtime computation outside lib/kpi-calc.ts. Fixture enrichment. Each sprint JSON now "
    "carries cycleTime.days (rolling team cycle time per sprint day with nulls for future days "
    "on the in flight sprint), cycleTime.teamBaseline (trailing team norm shown as a dashed "
    "reference line on the chart), cycleTime.trend (improving, flat, or rising tag rendered as "
    "a colored chip), and throughputPerWeek (weekOne, weekTwo, priorAverage for the comparison "
    "bars). New helpers in lib/kpi-calc.ts. buildCycleTimePoints and computeCycleTimeSummary "
    "expose latest, earliest, baseline, trend, and a delta percent for the day one to latest "
    "movement. computeThroughputSummary sums the week one and week two counts, divides against "
    "twice the priorAverage, and returns the delta percent against the prior baseline. "
    "computeScopeCreepSummary subtracts scopePlanned from scopeFinal, computes the creep "
    "percent, and counts addedMidSprint tickets. computeCarryoverSummary filters status equals "
    "done to compute the carry over share, flags the projected state for the in flight sprint, "
    "and surfaces the count of blocked tickets within the carry over. Four new card components "
    "under app/sprint/[id]/_components/. CycleTimeChart draws an inline SVG line over the day "
    "axis with the team baseline as a dashed reference and a trend chip colored green for "
    "improving, gray for flat, rose for rising. ThroughputChart stacks three bars (week one, "
    "week two, prior average) with a colored delta percent at the top right. ScopeCreepCard "
    "shows the headline percent, planned versus final bars, and the tickets added line. "
    "CarryoverCard shows a closed versus total ratio bar that fills accent for closed and "
    "tone color for carryover. Wired in. /sprint/[id] page renders both KPI rows back to back "
    "with a small gap, no extra section headers, so the eight cards read as one cohesive grid. "
    "Build clean. Nine routes prerendered, 102 kB First Load JS shared. Type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-19",\n'
    '          title: "\U0001f4c8 W9.D4 - Sprint Intelligence trend and scope KPI row",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W9.D5 - Per engineer deep dive tabs. Tab strip per engineer with workload score (weighted priority), completion rate, personal versus team cycle time, and a review bottleneck callout when an engineer carries too many in-review tickets. Replace the Section 3 of 3 placeholder."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-18",\n'
    '          title: "\U0001f4ca W9.D3 - Sprint Intelligence team KPI cards live",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day = (
    '"Week 9 · Day 3 - Team level KPI cards live on /sprint/[id]. '
    'Burndown chart, velocity versus baseline bar, status distribution donut, and blocked tickets card '
    'all drawn from fixture data via lib/kpi-calc.ts."'
)
new_day = (
    '"Week 9 · Day 4 - Trend and scope KPI row added. Cycle time trend with team baseline, '
    'throughput per week bar versus prior average, scope creep tracker, and carryover rate. '
    'Team KPIs section now holds eight cards across two rows."'
)
if old_day in html:
    html = html.replace(old_day, new_day, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-18 · \U0001f4ca W9.D3 - Sprint Intelligence team KPI cards live"
md_new = (
    "### 2026-05-19 · \U0001f4c8 W9.D4 - Sprint Intelligence trend and scope KPI row\n"
    "- **Second KPI row.** Eight cards now fill the Team KPIs section, split into the W9.D3 row (burndown, velocity, status mix, blocked) and the new W9.D4 row (cycle time trend, throughput per week, scope creep, carryover rate). All eight cards run off fixture data through `lib/kpi-calc.ts`.\n"
    "- **Fixture enrichment.** Each sprint JSON now carries `cycleTime.days` (rolling team cycle time per sprint day with nulls for future days on the in flight sprint), `cycleTime.teamBaseline` (trailing team norm shown as a dashed reference line on the chart), `cycleTime.trend` (improving, flat, or rising tag rendered as a colored chip), and `throughputPerWeek` (`weekOne`, `weekTwo`, `priorAverage` for the comparison bars).\n"
    "- **New helpers.** `buildCycleTimePoints` plus `computeCycleTimeSummary` expose latest, earliest, baseline, trend, and the day one to latest delta percent. `computeThroughputSummary` sums week one and week two counts, divides against twice the prior average, returns the delta percent. `computeScopeCreepSummary` subtracts `scopePlanned` from `scopeFinal`, computes the creep percent, and counts `addedMidSprint` tickets. `computeCarryoverSummary` filters status equals done to compute the carry over share, flags the projected state for the in flight sprint, and surfaces the count of blocked tickets within the carry over.\n"
    "- **Four new card components.** `CycleTimeChart` draws an inline SVG line over the day axis with the team baseline as a dashed reference and a trend chip colored green for improving, gray for flat, rose for rising. `ThroughputChart` stacks three bars (week one, week two, prior average) with a colored delta percent at the top right. `ScopeCreepCard` shows the headline percent, planned versus final bars, and the tickets added line. `CarryoverCard` shows a closed versus total ratio bar that fills accent for closed and tone color for carryover.\n"
    "- **Wired in.** `/sprint/[id]` page renders both KPI rows back to back with a small gap, no extra section headers, so the eight cards read as one cohesive grid.\n"
    "- **Build clean.** Nine routes prerendered, 102 kB First Load JS shared. Type check clean.\n"
    "- **Next**: W9.D5 - Per engineer deep dive tabs. Tab strip per engineer with workload score (weighted priority), completion rate, personal versus team cycle time, and a review bottleneck callout when an engineer carries too many in-review tickets. Replace the Section 3 of 3 placeholder.\n"
    "\n"
    "### 2026-05-18 · \U0001f4ca W9.D3 - Sprint Intelligence team KPI cards live"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D3 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 9 · Day 3 - Team level KPI cards live on `/sprint/[id]`. "
    "Burndown chart, velocity versus baseline bar, status distribution donut, and blocked tickets card "
    "all drawn from fixture data via `lib/kpi-calc.ts`. |"
)
md_new_day = (
    "| **Current Day** | Week 9 · Day 4 - Trend and scope KPI row added. Cycle time trend with team baseline, "
    "throughput per week bar versus prior average, scope creep tracker, and carryover rate. "
    "Team KPIs section now holds eight cards across two rows. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
