"""Log W10.D13: per-engineer per-week scheduler, drop Ticket progress chart."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_d12_close = (
    '            { num: "W10.D12", weekday: "Thu", name: "Sequential engineer queue, team-view heatmap, Ticket progress rename", '
    'tasks: ["work_schedule_for replaced with a per-engineer queue scheduler. For each assignee, tickets are sorted by priority (P0 first then P1 P2 P3) then createdAt ascending. A currentDay cursor walks forward sequentially: each ticket consumes its own weekday run, the next ticket starts the day after, no parallel work. Mid-sprint additions still start at their createdDay because effectiveStartDay = max(currentDay, createdDay) gates the start", '
    '"Realistic distribution. An engineer with five P1 tickets at five SP each now spends the whole month walking through them sequentially (ticket 1 days 1 to 6, ticket 2 days 7 to 12, etc.) instead of all five running in parallel from day 1. Mid-sprint P0 escalations on Feb 2026 still slot mid-month at their createdAt before regular work resumes. In-progress tickets on the in-flight may sprint anchor their last active day at today (sprint day 17)", '
    '"DeepDivePanel TeamView now renders the activity heatmap plus the Ticket progress chart in addition to the team aggregate stat tiles plus the priority and status mix bars. When the user picks Everyone in the assignee filter, they see the top twelve tickets across the entire team. The heatmap and progress chart components are unchanged (engineer-agnostic) so the addition was purely prop wiring", '
    '"Section heading renamed from Ticket Gantt to Ticket progress in both the EngineerView and TeamView paths. Description updated to call out continuous progress bars per ticket plus the dashed planned range for to-do tickets. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] }\n'
    '          ],'
)
new_d12_plus_d13 = (
    '            { num: "W10.D12", weekday: "Thu", name: "Sequential engineer queue, team-view heatmap, Ticket progress rename", '
    'tasks: ["work_schedule_for replaced with a per-engineer queue scheduler. For each assignee, tickets are sorted by priority (P0 first then P1 P2 P3) then createdAt ascending. A currentDay cursor walks forward sequentially: each ticket consumes its own weekday run, the next ticket starts the day after, no parallel work. Mid-sprint additions still start at their createdDay because effectiveStartDay = max(currentDay, createdDay) gates the start", '
    '"Realistic distribution. An engineer with five P1 tickets at five SP each now spends the whole month walking through them sequentially (ticket 1 days 1 to 6, ticket 2 days 7 to 12, etc.) instead of all five running in parallel from day 1. Mid-sprint P0 escalations on Feb 2026 still slot mid-month at their createdAt before regular work resumes. In-progress tickets on the in-flight may sprint anchor their last active day at today (sprint day 17)", '
    '"DeepDivePanel TeamView now renders the activity heatmap plus the Ticket progress chart in addition to the team aggregate stat tiles plus the priority and status mix bars. When the user picks Everyone in the assignee filter, they see the top twelve tickets across the entire team. The heatmap and progress chart components are unchanged (engineer-agnostic) so the addition was purely prop wiring", '
    '"Section heading renamed from Ticket Gantt to Ticket progress in both the EngineerView and TeamView paths. Description updated to call out continuous progress bars per ticket plus the dashed planned range for to-do tickets. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200"] },\n'
    '            { num: "W10.D13", weekday: "Fri", name: "Per-engineer per-week scheduler with profile variation, drop Ticket progress", '
    'tasks: ["Scheduler rewritten to a per-week assignment with per-engineer profile variation. New _sprint_weeks helper carves the sprint into Mon-Fri blocks. Each engineer gets a hash-deterministic profile (pace bias by role plus jitter, week shape front/back/steady, carryover probability, carryover extra days, side ticket probability, per-week meeting skip day). Tickets sort by priority then createdAt, mid-sprint additions anchor to the week of their createdAt, the rest spread evenly across weeks. Sparse engineers (active less than week count) get a forced carryover boost so their few tickets stretch across more weeks", '
    '"Within-week stagger. When multiple tickets share a week (two P0 escalations, or carryover plus new primary), each successive ticket shifts its start by one day so they do not stack on identical days. Mid-sprint Feb tickets DE-2113 and DE-2114 land days 10-12 and 11-13 instead of identical [11, 12, 13]. The natural overlap is preserved (engineer juggling both tickets) without the visual collision", '
    '"TicketGantt component deleted and removed from DeepDivePanel TeamView plus EngineerView. The activity heatmap remains and now carries the full distribution signal alone. /sprint/[id] First Load JS held at 50.4 kB (the deletion offset the new scheduler logic adding tiny derivation cost in the helper)", '
    '"KPI parity verified. The schedule rewrite is purely a heatmap-input change: computeTopKpis, computeStoryPointsKpis, computeAvgDaysInStatus, computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, and the trend charts all read other fixture fields, not workSchedule. Feb 2026 confirms Total=28, Done=23, Velocity=77 SP (matches the brief)"] }\n'
    '          ],'
)
if old_d12_close not in html:
    raise SystemExit("Could not locate W10.D12 day-array tail")
html = html.replace(old_d12_close, new_d12_plus_d13, 1)

insert_marker = '"10-W10.D12-3"\n      ],'
new_tail = (
    '"10-W10.D12-3",\n'
    '        // Phase 3 · Week 10 · Day 13 (4 tasks - per-engineer per-week scheduler, within-week stagger, drop Ticket progress chart, KPI parity verified)\n'
    '        "10-W10.D13-0", "10-W10.D13-1", "10-W10.D13-2", "10-W10.D13-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D12 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50d W10.D12 - Sprint Intelligence sequential engineer queue, team-view heatmap, Ticket progress rename",'
)
desc = (
    "Scheduler rewritten again, this time as a per-week assignment with rich per-engineer "
    "profile variation. New _sprint_weeks helper carves each sprint into Mon-Fri blocks (Jan 2026 "
    "has five Mon-Fri weeks). For each engineer the algorithm derives a hash-deterministic "
    "profile (role-based pace plus jitter, week shape from front-loaded / back-loaded / steady, "
    "carryover probability 0.3 to 0.7, carryover extra days 1 to 2, side ticket probability up "
    "to 0.35, plus a per-week meeting skip day that drops one weekday). Active tickets sort by "
    "priority then createdAt, mid-sprint additions anchor to the week of their createdAt, the "
    "rest spread evenly across weeks. Engineers with fewer active tickets than weeks get a "
    "forced carryover boost so their few tickets stretch across more weeks (eng-1 in Jan has "
    "two tickets covering weeks 0-1 and 2-3 instead of just weeks 0-1). Within-week stagger "
    "prevents collisions: when two P0 escalations land in the same week, each subsequent ticket "
    "shifts its start by one day. Feb DE-2113 and DE-2114 now land days 10-12 and 11-13 instead "
    "of identical [11, 12, 13]. The TicketGantt component was deleted and removed from both the "
    "TeamView and EngineerView in DeepDivePanel. The activity heatmap remains and now carries "
    "the full distribution signal alone. /sprint/[id] First Load JS held at 50.4 kB. Top KPI "
    "numbers verified unchanged: computeTopKpis, computeStoryPointsKpis, computeAvgDaysInStatus, "
    "computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, "
    "and the trend charts all read other fixture fields, not workSchedule. Feb 2026 confirms "
    "Total=28, Done=23, Velocity=77 SP (matches the brief). Redeployed to prod, all eight routes "
    "plus two filtered variants returned HTTP 200 on smoke check."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c6 W10.D13 - Sprint Intelligence per-engineer per-week scheduler, drop Ticket progress",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Three engineering moments: the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern shared across every dashboard surface, and the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50d W10.D12 - Sprint Intelligence sequential engineer queue, team-view heatmap, Ticket progress rename",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 12 - Sequential per-engineer queue scheduler. An engineer with 5 P1 tickets '
    'now works through them across the whole month sequentially, not all five in parallel '
    'day 1. Mid-sprint P0 escalations still slot mid-month. TeamView in the deep dive now '
    'renders the heatmap plus Ticket progress for the top twelve team tickets. Section '
    'renamed from Ticket Gantt to Ticket progress. Live deploy 50.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 13 - Per-week scheduler with per-engineer profile variation (pace, week '
    'shape, carryover habit, side ticket probability, weekly meeting skip day) so every '
    'engineer’s heatmap row reads differently. Sparse engineers get a carryover boost to '
    'stretch coverage. Within-week stagger prevents same-day collisions. TicketGantt deleted. '
    'KPI parity verified. Live deploy 50.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f50d W10.D12 - Sprint Intelligence sequential engineer queue, team-view heatmap, Ticket progress rename"
md_new = (
    "### 2026-05-17 · \U0001f4c6 W10.D13 - Sprint Intelligence per-engineer per-week scheduler, drop Ticket progress\n"
    "- **Per-week scheduler with per-engineer profile variation.** New `_sprint_weeks` helper carves each sprint into Mon-Fri blocks. Each engineer derives a hash-deterministic profile: role-based pace plus jitter, week shape (front-loaded / back-loaded / steady), carryover probability 0.3-0.7, carryover extra days 1-2, side ticket probability up to 0.35, plus a per-week meeting skip day. Every engineer's heatmap row reads recognizably different.\n"
    "- **Sparse engineer carryover boost.** Engineers with fewer active tickets than weeks get `carryover_prob` forced to 0.85+ so their few tickets stretch across more weeks. Eng-1 in Jan with 2 tickets now covers weeks 0-1 and 2-3 instead of crammed into weeks 0-1.\n"
    "- **Within-week stagger.** When multiple tickets share a week (two P0 escalations, carryover + new primary), each successive ticket shifts its start by one day. Feb DE-2113 and DE-2114 now land days 10-12 and 11-13 instead of identical [11, 12, 13]. Natural overlap preserved without visual collision.\n"
    "- **TicketGantt removed.** Component deleted, both Ticket progress sections removed from `DeepDivePanel` (TeamView + EngineerView). The activity heatmap carries the full distribution signal alone now.\n"
    "- **KPI parity verified.** The schedule rewrite is purely a heatmap-input change: `computeTopKpis`, `computeStoryPointsKpis`, `computeAvgDaysInStatus`, `computeEtaSummary`, `computePerTicketCycleTime`, `computeAgingTickets`, `computeWorkloadByAssignee`, and the trend charts all read other fixture fields, not `workSchedule`. Feb 2026 confirms Total=28, Done=23, Velocity=77 SP (matches the brief).\n"
    "- **Build clean, type check clean.** `/sprint/[id]` First Load JS held at 50.4 kB. Redeployed to prod, all eight routes plus two filtered variants returned HTTP 200.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Three engineering moments: the monorepo `rootDirectory` workaround, the search-param-driven filter pattern, and the manifest enrichment pattern.\n"
    "\n"
    "### 2026-05-17 · \U0001f50d W10.D12 - Sprint Intelligence sequential engineer queue, team-view heatmap, Ticket progress rename"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D12 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 12 - Sequential per-engineer queue scheduler. An "
    "engineer with 5 P1 tickets now works through them across the whole month sequentially, not "
    "all five in parallel day 1. Mid-sprint P0 escalations still slot mid-month. `TeamView` in "
    "the deep dive now renders the heatmap plus Ticket progress for the top twelve team "
    "tickets. Section renamed from Ticket Gantt to Ticket progress. Live deploy 50.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 13 - Per-week scheduler with per-engineer profile "
    "variation (pace, week shape, carryover habit, side ticket probability, weekly meeting "
    "skip day). Sparse engineers get a carryover boost. Within-week stagger prevents "
    "same-day collisions. `TicketGantt` deleted. KPI parity verified. Live deploy 50.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
