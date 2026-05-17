"""Log W10.D14: filter-aware cross-sprint table and trend charts."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_d13_close = (
    '            { num: "W10.D13", weekday: "Fri", name: "Per-engineer per-week scheduler with profile variation, drop Ticket progress", '
    'tasks: ["Scheduler rewritten to a per-week assignment with per-engineer profile variation. New _sprint_weeks helper carves the sprint into Mon-Fri blocks. Each engineer gets a hash-deterministic profile (pace bias by role plus jitter, week shape front/back/steady, carryover probability, carryover extra days, side ticket probability, per-week meeting skip day). Tickets sort by priority then createdAt, mid-sprint additions anchor to the week of their createdAt, the rest spread evenly across weeks. Sparse engineers (active less than week count) get a forced carryover boost so their few tickets stretch across more weeks", '
    '"Within-week stagger. When multiple tickets share a week (two P0 escalations, or carryover plus new primary), each successive ticket shifts its start by one day so they do not stack on identical days. Mid-sprint Feb tickets DE-2113 and DE-2114 land days 10-12 and 11-13 instead of identical [11, 12, 13]. The natural overlap is preserved (engineer juggling both tickets) without the visual collision", '
    '"TicketGantt component deleted and removed from DeepDivePanel TeamView plus EngineerView. The activity heatmap remains and now carries the full distribution signal alone. /sprint/[id] First Load JS held at 50.4 kB (the deletion offset the new scheduler logic adding tiny derivation cost in the helper)", '
    '"KPI parity verified. The schedule rewrite is purely a heatmap-input change: computeTopKpis, computeStoryPointsKpis, computeAvgDaysInStatus, computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, and the trend charts all read other fixture fields, not workSchedule. Feb 2026 confirms Total=28, Done=23, Velocity=77 SP (matches the brief)"] }\n'
    '          ],'
)
new_d13_plus_d14 = (
    '            { num: "W10.D13", weekday: "Fri", name: "Per-engineer per-week scheduler with profile variation, drop Ticket progress", '
    'tasks: ["Scheduler rewritten to a per-week assignment with per-engineer profile variation. New _sprint_weeks helper carves the sprint into Mon-Fri blocks. Each engineer gets a hash-deterministic profile (pace bias by role plus jitter, week shape front/back/steady, carryover probability, carryover extra days, side ticket probability, per-week meeting skip day). Tickets sort by priority then createdAt, mid-sprint additions anchor to the week of their createdAt, the rest spread evenly across weeks. Sparse engineers (active less than week count) get a forced carryover boost so their few tickets stretch across more weeks", '
    '"Within-week stagger. When multiple tickets share a week (two P0 escalations, or carryover plus new primary), each successive ticket shifts its start by one day so they do not stack on identical days. Mid-sprint Feb tickets DE-2113 and DE-2114 land days 10-12 and 11-13 instead of identical [11, 12, 13]. The natural overlap is preserved (engineer juggling both tickets) without the visual collision", '
    '"TicketGantt component deleted and removed from DeepDivePanel TeamView plus EngineerView. The activity heatmap remains and now carries the full distribution signal alone. /sprint/[id] First Load JS held at 50.4 kB (the deletion offset the new scheduler logic adding tiny derivation cost in the helper)", '
    '"KPI parity verified. The schedule rewrite is purely a heatmap-input change: computeTopKpis, computeStoryPointsKpis, computeAvgDaysInStatus, computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, and the trend charts all read other fixture fields, not workSchedule. Feb 2026 confirms Total=28, Done=23, Velocity=77 SP (matches the brief)"] },\n'
    '            { num: "W10.D14", weekday: "Sat", name: "Filter-aware cross-sprint history table and trend charts", '
    'tasks: ["page.tsx now computes filteredHistoryRows by iterating every full sprint fixture from getAllFullSprints and re-applying the top filter (assignee plus type plus status) to each sprint ticket array. The recomputed totals (ticketCount, closedCount, openCount, spCompleted, spTotal) drive both the SprintHistoryTable and the SprintTrendCharts so the bottom widgets respect the top filter", '
    '"All six fixtures were already in the per-route bundle via the FIXTURES static map so the addition cost zero kB. /sprint/[id] First Load JS held at 50.4 kB", '
    '"Section descriptions on both widgets updated to call out filter awareness so the user knows the top filter scope flows down to the cross-sprint view. With no filter applied, the recomputed totals match the manifest values (parity verified by reading /sprint/may-2026 with no query string)", '
    '"Live deploy verified. Smoke checks across /, /sprints, /sprint/feb-2026, /sprint/feb-2026?assignee=eng-2, /sprint/feb-2026?type=bug, /sprint/may-2026?assignee=eng-1&type=development all returned HTTP 200. Filter combinations now flow through the history table and trend charts so the manager can see eng-1 development tickets across every sprint at a glance"] }\n'
    '          ],'
)
if old_d13_close not in html:
    raise SystemExit("Could not locate W10.D13 day-array tail")
html = html.replace(old_d13_close, new_d13_plus_d14, 1)

insert_marker = '"10-W10.D13-3"\n      ],'
new_tail = (
    '"10-W10.D13-3",\n'
    '        // Phase 3 · Week 10 · Day 14 (4 tasks - filter-aware history table + trend charts via getAllFullSprints, zero bundle cost, parity verified, redeployed)\n'
    '        "10-W10.D14-0", "10-W10.D14-1", "10-W10.D14-2", "10-W10.D14-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D13 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c6 W10.D13 - Sprint Intelligence per-engineer per-week scheduler, drop Ticket progress",'
)
desc = (
    "Filter awareness extended to the cross-sprint widgets at the bottom of /sprint/[id]. "
    "page.tsx now computes filteredHistoryRows by iterating every full sprint fixture from "
    "getAllFullSprints and re-applying the top filter (assignee plus type plus status) to each "
    "sprint's ticket array. The recomputed per-sprint totals (ticketCount, closedCount, "
    "openCount, spCompleted, spTotal) feed both the SprintHistoryTable and the "
    "SprintTrendCharts. When the user picks assignee=eng-2, every row in the table plus every "
    "column in the trend charts now shows only eng-2's contributions per sprint. Combinations "
    "work too: assignee=eng-1 plus type=development scopes the cross-sprint view to that slice "
    "across all six sprints. All six fixtures were already in the per-route bundle via the "
    "FIXTURES static map so the addition cost zero kB on First Load JS — it held at 50.4 kB. "
    "Parity verified: with no filter, the recomputed totals exactly match the manifest "
    "pre-computed values. Section descriptions on both widgets updated to call out the filter "
    "scope. Redeployed to prod, smoke checks across /, /sprints, /sprint/feb-2026, the same "
    "with ?assignee=eng-2, ?type=bug, and /sprint/may-2026?assignee=eng-1&type=development all "
    "returned HTTP 200."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50e W10.D14 - Sprint Intelligence filter-aware cross-sprint history and trend charts",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Three engineering moments: monorepo rootDirectory workaround, search-param-driven filter pattern (now scoped across every dashboard surface and cross-sprint widget), manifest enrichment pattern."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c6 W10.D13 - Sprint Intelligence per-engineer per-week scheduler, drop Ticket progress",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 13 - Per-week scheduler with per-engineer profile variation (pace, week '
    'shape, carryover habit, side ticket probability, weekly meeting skip day) so every '
    'engineer’s heatmap row reads differently. Sparse engineers get a carryover boost to '
    'stretch coverage. Within-week stagger prevents same-day collisions. TicketGantt deleted. '
    'KPI parity verified. Live deploy 50.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 14 - Filter awareness extended to the cross-sprint widgets. '
    'SprintHistoryTable and SprintTrendCharts now recompute every sprint’s totals against the '
    'active filter, so assignee+type+status combinations scope the bottom-of-page view too. '
    'Zero bundle cost (all six fixtures already in the static map). Live deploy 50.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f4c6 W10.D13 - Sprint Intelligence per-engineer per-week scheduler, drop Ticket progress"
md_new = (
    "### 2026-05-17 · \U0001f50e W10.D14 - Sprint Intelligence filter-aware cross-sprint history and trend charts\n"
    "- **Cross-sprint widgets honor the top filter.** `page.tsx` now computes `filteredHistoryRows` by iterating every full sprint fixture from `getAllFullSprints()` and re-applying the top filter (`assignee` + `type` + `status`) to each sprint's ticket array. Recomputed per-sprint totals (`ticketCount`, `closedCount`, `openCount`, `spCompleted`, `spTotal`) feed both `SprintHistoryTable` and `SprintTrendCharts`.\n"
    "- **Zero bundle cost.** All six fixtures were already in the per-route bundle via the `FIXTURES` static map. `/sprint/[id]` First Load JS held at 50.4 kB.\n"
    "- **Parity verified**: with no filter applied, the recomputed totals match the manifest pre-computed values exactly. Confirmed on `/sprint/may-2026` with no query string.\n"
    "- **Section descriptions updated** on both widgets to call out the filter scope (\"Honors the top filter — pick an assignee, type, or status to scope every row\").\n"
    "- **Live deploy**: smoke checks across `/`, `/sprints`, `/sprint/feb-2026`, `/sprint/feb-2026?assignee=eng-2`, `/sprint/feb-2026?type=bug`, `/sprint/may-2026?assignee=eng-1&type=development` all returned HTTP 200.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Three engineering moments: monorepo `rootDirectory` workaround, search-param-driven filter pattern (now scoped across every dashboard surface and cross-sprint widget), manifest enrichment pattern.\n"
    "\n"
    "### 2026-05-17 · \U0001f4c6 W10.D13 - Sprint Intelligence per-engineer per-week scheduler, drop Ticket progress"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D13 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 13 - Per-week scheduler with per-engineer profile "
    "variation (pace, week shape, carryover habit, side ticket probability, weekly meeting "
    "skip day). Sparse engineers get a carryover boost. Within-week stagger prevents "
    "same-day collisions. `TicketGantt` deleted. KPI parity verified. Live deploy 50.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 14 - Filter awareness extended to the cross-sprint "
    "widgets. `SprintHistoryTable` and `SprintTrendCharts` now recompute every sprint's totals "
    "against the active filter, so `assignee + type + status` combinations scope the "
    "bottom-of-page view too. Zero bundle cost (all six fixtures already in the static map). "
    "Live deploy 50.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
