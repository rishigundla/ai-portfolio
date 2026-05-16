"""Log W9.D3 team level KPI work in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Append four W9.D3 ids to completedTasks. The original day declared
# four tasks (burndown, velocity, status donut, blocked count) so the
# ids fit directly without rewriting the day definition.
old_tail = (
    '        // Phase 3 · Week 9 · Day 2 (4 tasks - manifest loader, full sprint loader, gallery, dashboard shell)\n'
    '        "9-W9.D2-0", "9-W9.D2-1", "9-W9.D2-2", "9-W9.D2-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 2 (4 tasks - manifest loader, full sprint loader, gallery, dashboard shell)\n'
    '        "9-W9.D2-0", "9-W9.D2-1", "9-W9.D2-2", "9-W9.D2-3",\n'
    '        // Phase 3 · Week 9 · Day 3 (4 tasks - burndown chart, velocity bar, status donut, blocked card)\n'
    '        "9-W9.D3-0", "9-W9.D3-1", "9-W9.D3-2", "9-W9.D3-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D2 trailing block")
html = html.replace(old_tail, new_tail, 1)

# Insert W9.D3 activity entry on top of the array
old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W9.D2 - Sprint Intelligence gallery, dashboard shell, typed loaders",'
)
desc = (
    "Team level KPIs rendered. Four cards inside the Team KPIs section, two by two grid on the "
    "sprint detail page, every chart drawn from real fixture data. lib/kpi-calc.ts is the pure "
    "function module that converts a SprintFixture into the shapes each card needs. "
    "computeStatusDistribution groups tickets across done, in review, in progress, to do, and "
    "blocked with story point totals per bucket. computeVelocityComparison reads the velocity "
    "and fourSprintBaseline fields from the fixture and returns current versus baseline plus a "
    "delta percent and a beat flag. computeBlockedSummary filters status equals blocked, sums "
    "the story points, and exposes the freshest blockerNote plus an oldest age estimate. "
    "buildBurndownPoints zips ideal and actual arrays into day numbered points. Each sprint "
    "fixture now carries a burndown series, currentDay marker for the in flight sprint, "
    "fourSprintBaseline, and velocity field. Sprint 42 healthy at 67 SP versus a 58 SP "
    "baseline. Sprint 43 scope creep at 73 SP versus 60. Sprint 44 blocked at 41 SP versus 63. "
    "Sprint 45 in flight at 34 SP through day eight versus 60. Four card components live under "
    "app/sprint/[id]/_components/. BurndownChart draws an inline SVG with an ideal dashed line, "
    "an actual solid line, dots on each actual data point, and a current day vertical guide "
    "for the in flight sprint. VelocityBar stacks current and baseline bars with width "
    "proportional to capacity plus a colored delta line at the foot of the card. StatusDonut "
    "renders five arcs with the blocked segment forced to a rose tone so a stalled sprint pops "
    "out at a glance. BlockedCard handles both the all clear state (big green zero with a "
    "satisfied subtext) and the stalled state (count plus story points plus oldest age in days "
    "plus the freshest blockerNote). A KpiCard layout primitive wraps each chart with eyebrow, "
    "title, and subtitle so the dashboard reads as a coherent grid. /sprint/[id] page now "
    "passes the fixture through the calc helpers and into the cards. The W9.D2 placeholder "
    "grid is gone. BUILD CLEAN: nine routes prerendered, 102 kB First Load JS shared, four "
    "sprint pages all SSG."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-18",\n'
    '          title: "\U0001f4ca W9.D3 - Sprint Intelligence team KPI cards live",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W9.D4 - More KPIs and trends. Cycle time trend line, throughput per week bar, scope creep tracker (planned versus final), and carryover rate. Add a second KPI row below the existing four card grid."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W9.D2 - Sprint Intelligence gallery, dashboard shell, typed loaders",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day = (
    '"Week 9 · Day 2 - Sprint Intelligence gallery and dashboard shell live. '
    'lib/sprints.ts manifest loader and lib/full-sprints.ts per id loader in place, '
    'four sprint pages prerender as SSG."'
)
new_day = (
    '"Week 9 · Day 3 - Team level KPI cards live on /sprint/[id]. '
    'Burndown chart, velocity versus baseline bar, status distribution donut, and blocked tickets card '
    'all drawn from fixture data via lib/kpi-calc.ts."'
)
if old_day in html:
    html = html.replace(old_day, new_day, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f9ed W9.D2 - Sprint Intelligence gallery, dashboard shell, typed loaders"
md_new = (
    "### 2026-05-18 · \U0001f4ca W9.D3 - Sprint Intelligence team KPI cards live\n"
    "- **KPI calc module.** `lib/kpi-calc.ts` is the pure function module that turns a `SprintFixture` into the shapes each card needs. `computeStatusDistribution` groups tickets across done, in review, in progress, to do, and blocked with story point totals per bucket. `computeVelocityComparison` reads the `velocity` and `fourSprintBaseline` fields and returns current versus baseline plus a delta percent and a beat flag. `computeBlockedSummary` filters status equals blocked, sums story points, and exposes the freshest `blockerNote` plus an oldest age estimate. `buildBurndownPoints` zips ideal and actual arrays into day numbered points.\n"
    "- **Fixture enrichment.** Each sprint JSON now carries a `burndown` series (ideal and actual arrays), `currentDay` marker for the in flight sprint, `fourSprintBaseline`, and a `velocity` field. Sprint 42 healthy at 67 SP versus a 58 SP baseline. Sprint 43 scope creep at 73 SP versus 60. Sprint 44 blocked at 41 SP versus 63. Sprint 45 in flight at 34 SP through day eight versus 60.\n"
    "- **Four card components** under `app/sprint/[id]/_components/`. `BurndownChart` draws an inline SVG with an ideal dashed line, an actual solid line, dots on each actual data point, and a current day vertical guide for the in flight sprint. `VelocityBar` stacks current and baseline bars with width proportional to capacity plus a colored delta line at the foot. `StatusDonut` renders five arcs with the blocked segment forced to a rose tone so a stalled sprint pops out at a glance. `BlockedCard` handles both the all clear state (big green zero) and the stalled state (count plus story points plus oldest age plus freshest note). `KpiCard` is the layout primitive wrapping each chart with eyebrow, title, and subtitle.\n"
    "- **Wired into the shell.** `/sprint/[id]` page passes the fixture through the calc helpers and into the cards. The W9.D2 placeholder grid is gone.\n"
    "- **Build clean.** Nine routes prerendered, 102 kB First Load JS shared, four sprint pages all SSG.\n"
    "- **Next**: W9.D4 - more KPIs and trends. Cycle time trend line, throughput per week bar, scope creep tracker (planned versus final), and carryover rate. Add a second KPI row below the existing four card grid.\n"
    "\n"
    "### 2026-05-17 · \U0001f9ed W9.D2 - Sprint Intelligence gallery, dashboard shell, typed loaders"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D2 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 9 · Day 2 - Sprint Intelligence gallery and dashboard shell live. "
    "`lib/sprints.ts` manifest loader and `lib/full-sprints.ts` per id loader in place, "
    "four sprint pages prerender as SSG. |"
)
md_new_day = (
    "| **Current Day** | Week 9 · Day 3 - Team level KPI cards live on `/sprint/[id]`. "
    "Burndown chart, velocity versus baseline bar, status distribution donut, and blocked tickets card "
    "all drawn from fixture data via `lib/kpi-calc.ts`. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
