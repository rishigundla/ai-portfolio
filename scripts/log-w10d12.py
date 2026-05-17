"""Log W10.D12: sequential per-engineer queue, team-view heatmap + progress, rename Gantt."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_d11_close = (
    '            { num: "W10.D11", weekday: "Wed", name: "Realistic work schedule, sparse heatmap, Gantt run segments, trend chart numbers", '
    'tasks: ["New workSchedule field per ticket synthesized in scripts/generate-monthly-sprints.py. Hash-deterministic (sprint_id, ticket_id) sampler picks a priority-aware start day (P0 plus mid-sprint additions at createdDay, P1 zero to two day delay, P2 one to five day delay, P3 three to ten day delay), then spreads estimate days of active work across a sparse window with context-switch gaps. Weekend days are skipped via a date math helper, so the heatmap matches a real work week", '
    '"Mid-sprint additions (Feb 2026 customer escalation tickets DE-2113 through DE-2118 plus DE-2126) now start their work schedule around day 9 to 13, matching their createdAt, not at day 1. Blocked tickets show one to three active days then idle. Done tickets show estimate-aware active days within their priority window. In-progress and in-review tickets anchor the last active day at the current sprint day", '
    '"TicketTimeline shape updated. activeDays plus runs replace the old contiguous startDay-to-endDay span. computeTicketTimelines reads ticket.workSchedule directly, collapses consecutive days into runs via a small helper, and sorts by descending active day count. TicketHeatmap renders only the listed activeDays as filled cells (sparse with gaps). TicketGantt renders one bar segment per run so gaps in the work cadence are visually obvious. Todo tickets still show a dashed planned range using createdAt plus estimate", '
    '"SprintTrendCharts segment annotations. Each column on the Tickets Closed per Sprint and Story Points per Sprint charts now displays both segment counts above the bar in their respective colors (closed in green plus open in rose, done SP in blue plus remaining SP in amber). Chart height bumped from h-48 to h-56 to fit the annotation row. Title attribute on every segment for hover. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] }\n'
    '          ],'
)
new_d11_plus_d12 = (
    '            { num: "W10.D11", weekday: "Wed", name: "Realistic work schedule, sparse heatmap, Gantt run segments, trend chart numbers", '
    'tasks: ["New workSchedule field per ticket synthesized in scripts/generate-monthly-sprints.py. Hash-deterministic (sprint_id, ticket_id) sampler picks a priority-aware start day (P0 plus mid-sprint additions at createdDay, P1 zero to two day delay, P2 one to five day delay, P3 three to ten day delay), then spreads estimate days of active work across a sparse window with context-switch gaps. Weekend days are skipped via a date math helper, so the heatmap matches a real work week", '
    '"Mid-sprint additions (Feb 2026 customer escalation tickets DE-2113 through DE-2118 plus DE-2126) now start their work schedule around day 9 to 13, matching their createdAt, not at day 1. Blocked tickets show one to three active days then idle. Done tickets show estimate-aware active days within their priority window. In-progress and in-review tickets anchor the last active day at the current sprint day", '
    '"TicketTimeline shape updated. activeDays plus runs replace the old contiguous startDay-to-endDay span. computeTicketTimelines reads ticket.workSchedule directly, collapses consecutive days into runs via a small helper, and sorts by descending active day count. TicketHeatmap renders only the listed activeDays as filled cells (sparse with gaps). TicketGantt renders one bar segment per run so gaps in the work cadence are visually obvious. Todo tickets still show a dashed planned range using createdAt plus estimate", '
    '"SprintTrendCharts segment annotations. Each column on the Tickets Closed per Sprint and Story Points per Sprint charts now displays both segment counts above the bar in their respective colors (closed in green plus open in rose, done SP in blue plus remaining SP in amber). Chart height bumped from h-48 to h-56 to fit the annotation row. Title attribute on every segment for hover. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] },\n'
    '            { num: "W10.D12", weekday: "Thu", name: "Sequential engineer queue, team-view heatmap, Ticket progress rename", '
    'tasks: ["work_schedule_for replaced with a per-engineer queue scheduler. For each assignee, tickets are sorted by priority (P0 first then P1 P2 P3) then createdAt ascending. A currentDay cursor walks forward sequentially: each ticket consumes its own weekday run, the next ticket starts the day after, no parallel work. Mid-sprint additions still start at their createdDay because effectiveStartDay = max(currentDay, createdDay) gates the start", '
    '"Realistic distribution. An engineer with five P1 tickets at five SP each now spends the whole month walking through them sequentially (ticket 1 days 1 to 6, ticket 2 days 7 to 12, etc.) instead of all five running in parallel from day 1. Mid-sprint P0 escalations on Feb 2026 still slot mid-month at their createdAt before regular work resumes. In-progress tickets on the in-flight may sprint anchor their last active day at today (sprint day 17)", '
    '"DeepDivePanel TeamView now renders the activity heatmap plus the Ticket progress chart in addition to the team aggregate stat tiles plus the priority and status mix bars. When the user picks Everyone in the assignee filter, they see the top twelve tickets across the entire team. The heatmap and progress chart components are unchanged (engineer-agnostic) so the addition was purely prop wiring", '
    '"Section heading renamed from Ticket Gantt to Ticket progress in both the EngineerView and TeamView paths. Description updated to call out continuous progress bars per ticket plus the dashed planned range for to-do tickets. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] }\n'
    '          ],'
)
if old_d11_close not in html:
    raise SystemExit("Could not locate W10.D11 day-array tail")
html = html.replace(old_d11_close, new_d11_plus_d12, 1)

insert_marker = '"10-W10.D11-3"\n      ],'
new_tail = (
    '"10-W10.D11-3",\n'
    '        // Phase 3 · Week 10 · Day 12 (4 tasks - sequential per-engineer queue scheduler, mid-sprint escalation slotting, team-view heatmap + Ticket progress, Ticket Gantt rename)\n'
    '        "10-W10.D12-0", "10-W10.D12-1", "10-W10.D12-2", "10-W10.D12-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D11 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f5d3️ W10.D11 - Sprint Intelligence realistic workSchedule, sparse heatmap, Gantt run segments, trend chart numbers",'
)
desc = (
    "Three fixes after the live review. work_schedule_for replaced with a per-engineer queue "
    "scheduler. For each assignee, tickets are sorted by priority (P0 first then P1 P2 P3) then "
    "createdAt ascending. A currentDay cursor walks forward sequentially: each ticket consumes "
    "its own weekday run, the next ticket starts the day after, no parallel work. Mid-sprint "
    "additions still start at their createdDay because effectiveStartDay = max(currentDay, "
    "createdDay) gates the start, and the priority-first sort puts P0 escalations at the head of "
    "the queue. Spot checks confirm the distribution: Jan eng-1 ticket 1 runs days 1 to 6 and "
    "ticket 2 runs days 7 to 12 (sequential, not parallel). Feb eng-2 P0 escalation tickets "
    "DE-2113 and DE-2114 land days 9 to 18, then regular P1 ticket DE-2102 starts day 19, then "
    "P2 ticket on days 25 to 26. The DeepDivePanel TeamView now renders the activity heatmap "
    "plus the Ticket progress chart in addition to the team aggregate stat tiles plus the "
    "priority and status mix bars. When the user picks Everyone in the assignee filter, they "
    "see the top twelve tickets across the entire team. The heatmap and progress chart "
    "components are unchanged (engineer-agnostic) so the addition was purely prop wiring. "
    "Section heading renamed from Ticket Gantt to Ticket progress in both the EngineerView and "
    "TeamView paths. Description updated to call out continuous progress bars per ticket plus "
    "the dashed planned range for to-do tickets. Build clean, type check clean. /sprint/[id] "
    "First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered "
    "variants returned HTTP 200 on smoke check."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50d W10.D12 - Sprint Intelligence sequential engineer queue, team-view heatmap, Ticket progress rename",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Three engineering moments: the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern shared across every dashboard surface, and the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f5d3️ W10.D11 - Sprint Intelligence realistic workSchedule, sparse heatmap, Gantt run segments, trend chart numbers",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 11 - workSchedule synth (priority-aware start, weekend-skipped active days, '
    'context-switch gaps) makes the heatmap sparse and the Gantt show run segments. Mid sprint '
    'additions start mid sprint. SprintTrendCharts columns now show both segment numbers above '
    'each bar. Live deploy 50.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 12 - Sequential per-engineer queue scheduler. An engineer with 5 P1 tickets '
    'now works through them across the whole month sequentially, not all five in parallel '
    'day 1. Mid-sprint P0 escalations still slot mid-month. TeamView in the deep dive now '
    'renders the heatmap plus Ticket progress for the top twelve team tickets. Section '
    'renamed from Ticket Gantt to Ticket progress. Live deploy 50.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f5d3️ W10.D11 - Sprint Intelligence realistic workSchedule, sparse heatmap, Gantt run segments, trend chart numbers"
md_new = (
    "### 2026-05-17 · \U0001f50d W10.D12 - Sprint Intelligence sequential engineer queue, team-view heatmap, Ticket progress rename\n"
    "- **Sequential per-engineer queue scheduler.** `work_schedule_for` replaced with a per-assignee scheduler. Tickets sorted by priority (P0 → P1 → P2 → P3) then `createdAt`. A `currentDay` cursor walks forward sequentially. Each ticket consumes its own weekday run; the next ticket starts the day after, no parallel work. Mid-sprint additions still start at their `createdDay` because `effectiveStartDay = max(currentDay, createdDay)` gates the start, and the priority-first sort puts P0 escalations at the head of the queue.\n"
    "- **Realistic distribution.** Spot checks: Jan eng-1 ticket 1 runs days 1-6, ticket 2 runs days 7-12 (sequential, not parallel). Feb eng-2 P0 escalation tickets DE-2113 + DE-2114 land days 9-18, then regular P1 ticket DE-2102 starts day 19, then P2 ticket on days 25-26.\n"
    "- **TeamView heatmap plus Ticket progress.** `DeepDivePanel` `TeamView` now renders both the activity heatmap and the Ticket progress chart in addition to the team aggregate stat tiles plus the priority and status mix bars. Top 12 tickets across the entire team when the user picks Everyone. Components unchanged (engineer-agnostic), addition was purely prop wiring.\n"
    "- **Ticket Gantt renamed to Ticket progress.** Section heading and description updated in both the `EngineerView` and `TeamView` paths. File name `TicketGantt.tsx` preserved for git-history hygiene.\n"
    "- **Build clean, type check clean.** `/sprint/[id]` First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Three engineering moments: the monorepo `rootDirectory` workaround for the Vercel deploy, the search-param-driven filter pattern shared across every dashboard surface, and the manifest enrichment pattern that keeps cross-sprint widgets zero cost on First Load JS.\n"
    "\n"
    "### 2026-05-17 · \U0001f5d3️ W10.D11 - Sprint Intelligence realistic workSchedule, sparse heatmap, Gantt run segments, trend chart numbers"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D11 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 11 - `workSchedule` synth (priority-aware start, "
    "weekend-skipped active days, context-switch gaps) makes the heatmap sparse and the Gantt "
    "show run segments. Mid sprint additions start mid sprint. `SprintTrendCharts` columns now "
    "show both segment numbers above each bar. Live deploy 50.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 12 - Sequential per-engineer queue scheduler. An "
    "engineer with 5 P1 tickets now works through them across the whole month sequentially, not "
    "all five in parallel day 1. Mid-sprint P0 escalations still slot mid-month. `TeamView` in "
    "the deep dive now renders the heatmap plus Ticket progress for the top twelve team "
    "tickets. Section renamed from Ticket Gantt to Ticket progress. Live deploy 50.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
