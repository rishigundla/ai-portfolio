"""Log W9.D5 per engineer deep dive in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Rewrite W9.D5 task list to match what shipped. The plan had 5 tasks. Map
# them to the four user facing metrics plus the tab strip itself.
old_day = (
    '{ num: "W9.D5", weekday: "Fri", name: "Individual Deep-Dive Tabs", '
    'tasks: ["Tab per engineer", "Workload Score (weighted priority)", '
    '"Completion Rate", "Personal vs team cycle time", "Review bottleneck"] }'
)
new_day = (
    '{ num: "W9.D5", weekday: "Fri", name: "Per engineer deep dive tabs", '
    'tasks: ["EngineerTabs client component with one tab per engineer", '
    '"Workload score weighted by P0 to P3 priority versus per engineer capacity", '
    '"Completion rate per engineer with done versus total ticket count", '
    '"Personal cycle time compared with the team baseline plus delta percent", '
    '"Review queue tile with bottleneck flag when more than one ticket sits in review"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W9.D5 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 9 · Day 4 (4 tasks - cycle time trend, throughput per week, scope creep, carryover rate)\n'
    '        "9-W9.D4-0", "9-W9.D4-1", "9-W9.D4-2", "9-W9.D4-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 4 (4 tasks - cycle time trend, throughput per week, scope creep, carryover rate)\n'
    '        "9-W9.D4-0", "9-W9.D4-1", "9-W9.D4-2", "9-W9.D4-3",\n'
    '        // Phase 3 · Week 9 · Day 5 (5 tasks - engineer tabs, workload score, completion rate, personal cycle time, review queue)\n'
    '        "9-W9.D5-0", "9-W9.D5-1", "9-W9.D5-2", "9-W9.D5-3", "9-W9.D5-4"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D4 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-19",\n'
    '          title: "\U0001f4c8 W9.D4 - Sprint Intelligence trend and scope KPI row",'
)
desc = (
    "Per engineer deep dive landed. Section 3 of 3 placeholder replaced with a real tab strip "
    "(EngineerTabs client component) over the eight team members plus an engineer panel that "
    "swaps content on click. Each engineer panel renders four stat tiles. Workload score is a "
    "priority weighted sum of assigned ticket estimates (P0 weight 2.0, P1 1.5, P2 1.0, P3 "
    "0.5) divided against the engineer's capacity, with the load tone flipped to red when the "
    "index exceeds 1.1 and gray when it is under 0.8. Completion rate is the done count over "
    "the total assigned with the tone flipped to amber when under 80 percent and red when "
    "under 50. Personal cycle time pulls from the new perEngineer.personalCycleTime field on "
    "each sprint fixture (added through scripts/add-engineer-data.py) and compares against the "
    "team baseline cycleTime.teamBaseline with a colored delta percent. Review queue tile "
    "shows in review ticket count plus an in progress count and a blocked count, with the "
    "label switching between Queue clear, In review, and Bottleneck depending on the count. "
    "Below the stat tiles, a priority mix bar (P0/P1/P2/P3 with rose/amber/accent/gray) and "
    "the engineer's assigned ticket list with status color glyphs, priority, title, and "
    "estimate. New helpers under lib/kpi-calc.ts. computeWorkloadScore returns raw, index, "
    "capacity, tone, and label. computeCompletionRate returns done, total, percent. "
    "computePersonalCycleTime reads the perEngineer block and returns personal, team, delta "
    "percent, beatsTeam. computeReviewLoad counts in review, in progress, and blocked, then "
    "produces a tone tag. computePriorityMix groups tickets by P0 through P3 with story point "
    "totals. buildEngineerDeepDive aggregates all of the above per engineer. The page now "
    "passes team.map(member => buildEngineerDeepDive(fixture, member)) into EngineerTabs, so "
    "the eight engineer panels prerender as part of the SSG /sprint/[id] route. BUILD CLEAN: "
    "nine routes prerendered, /sprint/[id] now ships a small client bundle for the tab "
    "switching state, type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-20",\n'
    '          title: "\U0001f465 W9.D5 - Sprint Intelligence per engineer deep dive tabs",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W9.D6 - generate four meeting brief fixtures (one per sprint). Each brief has executive summary, highlights, watch list, recommendations, and talking points. Stored under fixtures/sprint-intelligence/briefs/."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-19",\n'
    '          title: "\U0001f4c8 W9.D4 - Sprint Intelligence trend and scope KPI row",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 9 · Day 4 - Trend and scope KPI row added. Cycle time trend with team baseline, '
    'throughput per week bar versus prior average, scope creep tracker, and carryover rate. '
    'Team KPIs section now holds eight cards across two rows."'
)
new_day_row = (
    '"Week 9 · Day 5 - Per engineer deep dive tabs live. EngineerTabs swaps content for eight '
    'team members, each panel shows workload, completion, personal cycle time, and review '
    'queue tiles plus priority mix and assigned ticket list."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-19 · \U0001f4c8 W9.D4 - Sprint Intelligence trend and scope KPI row"
md_new = (
    "### 2026-05-20 · \U0001f465 W9.D5 - Sprint Intelligence per engineer deep dive tabs\n"
    "- **EngineerTabs client component.** Tab strip over the eight team members, an engineer panel that swaps content on click. Section 3 of 3 placeholder replaced.\n"
    "- **Four stat tiles per engineer.** Workload score (priority weighted estimates as a percent of capacity, tone flips red over 110 percent and gray under 80). Completion rate (done over total assigned, tone amber under 80 percent and red under 50). Personal cycle time versus the team baseline with a colored delta percent. Review queue with in review count, in progress count, blocked count, and a Bottleneck label when more than one ticket sits in review.\n"
    "- **Priority mix plus assigned tickets.** Below the tiles, a priority mix bar with rose for P0, amber for P1, accent for P2, gray for P3. Beside it, the engineer's full assigned ticket list with status color glyphs, priority, title, and estimate.\n"
    "- **Fixture enrichment.** Each sprint JSON gained a `perEngineer` block keyed by engineer id with a `personalCycleTime` field. `scripts/add-engineer-data.py` is the one time loader. The script also tunes the cycle time per sprint character (blocked sprint shows nine days for the auth engineers, healthy sprint shows three to four days across the team).\n"
    "- **New helpers in `lib/kpi-calc.ts`.** `computeWorkloadScore`, `computeCompletionRate`, `computePersonalCycleTime`, `computeReviewLoad`, `computePriorityMix`, and `buildEngineerDeepDive` aggregate all of the above per engineer.\n"
    "- **Wired in.** The page passes `team.map(member => buildEngineerDeepDive(fixture, member))` into `EngineerTabs`, so the eight engineer panels prerender as part of the SSG `/sprint/[id]` route. Tab switching is the only client side state.\n"
    "- **Build clean.** Nine routes prerendered. Type check clean.\n"
    "- **Next**: W9.D6 generate four meeting brief fixtures (one per sprint). Each brief has executive summary, highlights, watch list, recommendations, and talking points. Stored under `fixtures/sprint-intelligence/briefs/`.\n"
    "\n"
    "### 2026-05-19 · \U0001f4c8 W9.D4 - Sprint Intelligence trend and scope KPI row"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D4 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 9 · Day 4 - Trend and scope KPI row added. Cycle time trend with team baseline, "
    "throughput per week bar versus prior average, scope creep tracker, and carryover rate. "
    "Team KPIs section now holds eight cards across two rows. |"
)
md_new_day = (
    "| **Current Day** | Week 9 · Day 5 - Per engineer deep dive tabs live. EngineerTabs swaps content for eight "
    "team members, each panel shows workload, completion, personal cycle time, and review queue tiles plus "
    "priority mix and assigned ticket list. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
