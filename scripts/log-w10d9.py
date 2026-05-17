"""Log W10.D9 polish round: BI/DE content, chart fixes, hover affordances."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# W10.D9 is a brand new day. Insert it into the Week 10 days array right after W10.D8.
old_d8_close = (
    '            { num: "W10.D8", weekday: "Mon", name: "Per ticket charts, future sprint variant, redeploy", '
    'tasks: ["Eight new server components for DE Tracker style analyses: AvgDaysInStatusChart, PriorityBreakdownChart, EtaCard (Missing ETA plus Overdue), CycleTimeBars (per ticket horizontal bars color graded against baseline), AgingTicketsCard, WorkloadByAssignee (DE Tracker style with completed share fill), SprintHistoryTable (all six sprints), SprintTrendCharts (tickets closed per sprint plus SP per sprint stacked columns)", '
    '"Eight new kpi-calc helpers backing those components: computeAvgDaysInStatus, computePriorityBreakdown, computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, plus enriched manifest reads. The manifest itself was extended with closedCount, openCount, spCompleted, and spTotal per sprint so SprintHistoryTable and SprintTrendCharts render without importing all six fixtures (zero extra First Load JS for the cross sprint widgets)", '
    '"Future sprint variant. /sprint/jun-2026 (status planned) hides the Per ticket signals section and the Sprint health section (burndown plus velocity plus cycle time chart plus throughput plus scope creep plus carryover) because none of those metrics make sense before sprint start. The page leads with the ETA card and the workload by assignee allocation preview, then shows the six sprint history table and trend charts for context, then the planning brief. The header swaps tickets for backlog in the meta strip and hides the scope summary", '
    '"Production redeploy. vercel --prod --yes from the repo root using the existing .vercel link. Aliased deploy at https://ai-portfolio-sprint-intelligence.vercel.app. Smoke checks via curl across /, /sprints, and all six /sprint/[id] routes all returned HTTP 200. /sprint/[id] First Load JS at 52.4 kB versus the W10.D7 baseline of 52.9 kB, a 0.5 kB win from dropping the TeamWorkloadCard client import in favor of the new server side WorkloadByAssignee. portfolio.meta.json deployedAt 2026-05-17, lastUpdatedAt 2026-05-17"] }\n'
    '          ],'
)
new_d8_plus_d9 = (
    '            { num: "W10.D8", weekday: "Mon", name: "Per ticket charts, future sprint variant, redeploy", '
    'tasks: ["Eight new server components for DE Tracker style analyses: AvgDaysInStatusChart, PriorityBreakdownChart, EtaCard (Missing ETA plus Overdue), CycleTimeBars (per ticket horizontal bars color graded against baseline), AgingTicketsCard, WorkloadByAssignee (DE Tracker style with completed share fill), SprintHistoryTable (all six sprints), SprintTrendCharts (tickets closed per sprint plus SP per sprint stacked columns)", '
    '"Eight new kpi-calc helpers backing those components: computeAvgDaysInStatus, computePriorityBreakdown, computeEtaSummary, computePerTicketCycleTime, computeAgingTickets, computeWorkloadByAssignee, plus enriched manifest reads. The manifest itself was extended with closedCount, openCount, spCompleted, and spTotal per sprint so SprintHistoryTable and SprintTrendCharts render without importing all six fixtures (zero extra First Load JS for the cross sprint widgets)", '
    '"Future sprint variant. /sprint/jun-2026 (status planned) hides the Per ticket signals section and the Sprint health section (burndown plus velocity plus cycle time chart plus throughput plus scope creep plus carryover) because none of those metrics make sense before sprint start. The page leads with the ETA card and the workload by assignee allocation preview, then shows the six sprint history table and trend charts for context, then the planning brief. The header swaps tickets for backlog in the meta strip and hides the scope summary", '
    '"Production redeploy. vercel --prod --yes from the repo root using the existing .vercel link. Aliased deploy at https://ai-portfolio-sprint-intelligence.vercel.app. Smoke checks via curl across /, /sprints, and all six /sprint/[id] routes all returned HTTP 200. /sprint/[id] First Load JS at 52.4 kB versus the W10.D7 baseline of 52.9 kB, a 0.5 kB win from dropping the TeamWorkloadCard client import in favor of the new server side WorkloadByAssignee. portfolio.meta.json deployedAt 2026-05-17, lastUpdatedAt 2026-05-17"] },\n'
    '            { num: "W10.D9", weekday: "Mon", name: "Polish round: BI content, chart fixes, hover affordances", '
    'tasks: ["All 138 tickets across the six sprints rewritten to BI / data engineering work themed around the user real anchor projects (NAI / NC2 / NCI Pulse on Databricks, Jira SSOT, RevOps ACV / GRR / QBR, Balanced Scorecard, Fabric Marketing plus Procurement, CX OKR, Tableau Server, Genie Space, dbt, ADF). Team roles refreshed to a realistic BI / DE org. Six brief fixtures rewritten to match the new narratives", '
    '"Avg time in current status chart fixed. New per-ticket daysInStatus field added to the TicketSpec, synthesized at fixture generation time with realistic per-status distributions (done 1.5 to 7d, in review 1 to 4d, in progress 2 to 8d, todo 0 to 12d, blocked 5 to 14d). computeAvgDaysInStatus reads t.daysInStatus directly. Section eyebrow renamed to Avg time in current status so the meaning is explicit. Numbers now read in the 2 to 12 day range instead of 100 plus", '
    '"Priority breakdown bars fixed (grid item is now h-full so the percent-based bar heights compute correctly, chart height bumped from h-44 to h-56, minHeight 4px so even tiny stacks remain visible). Sprint health and Status and priority and Per ticket signals grids all use items-start so velocity and throughput cards size to content instead of inflating to match burndown. Sprint card taglines hand authored per sprint with a key metric. Home page hero h1 plus subtitle plus all three StepCard descriptions refreshed to reference the BI angle, the filter bar, and the analysis layers", '
    '"Hover affordances added across the dashboard. Native title attribute on the sprint cards (gallery), the seven Top KPI tiles (each carrying a formula), the six Story Points tiles, the Avg days in status bars, the Priority Breakdown columns, the Cycle Time bars (ticket title plus tone), the Aging Tickets bars (ticket title plus age plus status), the Workload by Assignee rows (engineer name plus role plus done over total), the Sprint History rows (sprint name plus tagline), and the row link icons. /sprint/[id] First Load JS unchanged at 52.4 kB. Build clean, type check clean, redeployed to prod, all eight routes return HTTP 200"] }\n'
    '          ],'
)
if old_d8_close not in html:
    raise SystemExit("Could not locate W10.D8 day-array tail")
html = html.replace(old_d8_close, new_d8_plus_d9, 1)

# Append D9 IDs to the completedTasks block right after the D8 IDs.
insert_marker = '"10-W10.D8-3"\n      ],'
new_tail = (
    '"10-W10.D8-3",\n'
    '        // Phase 3 · Week 10 · Day 9 (4 tasks - all 138 tickets rewritten BI/DE, briefs rewritten, daysInStatus + chart math fix, layout fixes + hover affordances + home page refresh, redeploy)\n'
    '        "10-W10.D9-0", "10-W10.D9-1", "10-W10.D9-2", "10-W10.D9-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D8 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4ca W10.D8 - Sprint Intelligence per ticket charts, future sprint variant, redeploy",'
)
desc = (
    "Polish round after the live build review. All 138 tickets across the six sprints were "
    "rewritten to BI / data engineering work themed around the user real anchor projects: NAI / NC2 / NCI "
    "Pulse on Databricks, Jira SSOT data portal, RevOps ACV / GRR / QBR plus Balanced Scorecard, Microsoft "
    "Fabric Marketing plus Procurement, CX OKR Tableau dashboard, Tableau Server, Genie Space, dbt, "
    "ADF. Sprint narratives kept their shape (Jan healthy, Feb scope creep absorbed via a CFO escalation, "
    "Mar blocked on a Fabric Marketing migration NextGen team handoff, Apr recovered, May in flight, Jun "
    "backlog) but the actual work now reads as a credible BI / DE team. Team roles refreshed: Senior BI "
    "Engineer (Tableau plus dashboards), Senior Data Engineer (Spark / Databricks pipelines), Analytics "
    "Engineer (dbt / semantic layer), BI Engineer (Power BI / Fabric), Junior Analytics Engineer (SQL / dbt "
    "models), BI Engineer (Tableau plus Figma), Data Engineering Manager, Senior Data Engineer (Fabric plus "
    "ADF). Six brief fixtures rewritten to match the new narratives, same five section markdown structure "
    "preserved for the four retrospectives plus the in-flight may brief, June planning brief retained the "
    "Planning summary plus Allocation highlights tone. Avg time in current status chart fixed at the data "
    "layer. New per-ticket daysInStatus field added to TicketSpec, synthesized at generation time with "
    "realistic per-status distributions (done 1.5 to 7d, in review 1 to 4d, in progress 2 to 8d, todo 0 to "
    "12d, blocked 5 to 14d). Deterministic per (sprint id, ticket id) hash for stable regenerates. "
    "computeAvgDaysInStatus reads t.daysInStatus directly. Section eyebrow renamed to Avg time in current "
    "status. The user reported numbers of 100 plus days are gone, replaced with the 2 to 12 day signal "
    "that actually means something. Priority breakdown chart bars fixed: grid item is now h-full so the "
    "percent based bar heights compute correctly, chart height bumped from h-44 to h-56, minHeight 4px so "
    "even the smallest stacks remain visible. Sprint health, Status and priority, and Per ticket signals "
    "grids all use items-start so velocity and throughput cards size to content instead of inflating to "
    "match the burndown card. Sprint card taglines hand authored per sprint with a key metric (jan: "
    "Healthy sprint, 67 SP delivered, beat baseline by 16 percent. feb: Scope creep absorbed, CFO "
    "escalation added 6 P0/P1 tickets mid sprint, all closed. etc.). Home page hero h1 refreshed to Sprint "
    "review prep for a BI team, in five minutes. Hero subtitle plus all three StepCard descriptions "
    "rewritten to reference the BI angle, the filter bar, and the analysis layers. Hover affordances added "
    "across the dashboard via native title attributes: sprint cards (gallery), seven Top KPI tiles (each "
    "carrying a formula), six Story Points tiles, Avg days in status bars, Priority Breakdown columns, "
    "Cycle Time bars (ticket title plus tone), Aging Tickets bars (ticket title plus age plus status), "
    "Workload by Assignee rows (engineer name plus role plus done over total), Sprint History rows "
    "(sprint name plus tagline), row link icons. Build clean, type check clean. /sprint/[id] First Load "
    "JS unchanged at 52.4 kB. Redeployed to prod, all eight routes return HTTP 200 on smoke check."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f3a8 W10.D9 - Sprint Intelligence polish: BI content, chart fixes, hover affordances",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Mirror the narrative-generator case study structure: problem framing, approach, architecture, three engineering moments (the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern shared with the eng=N drill down, the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS), tech stack, impact. Then wire caseStudyUrl in portfolio.meta.json."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4ca W10.D8 - Sprint Intelligence per ticket charts, future sprint variant, redeploy",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 8 - Per ticket charts, future sprint variant, production redeploy. Eight '
    'new server components (AvgDaysInStatus, PriorityBreakdown, EtaCard, CycleTimeBars, '
    'AgingTickets, WorkloadByAssignee, SprintHistoryTable, SprintTrendCharts), enriched '
    'manifest for cross sprint widgets at zero First Load JS cost. /sprint/jun-2026 branches to '
    'a backlog focused layout. Live deploy 52.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 9 - Polish round. All 138 tickets and 6 briefs rewritten to BI / DE work '
    '(Pulse SSOT, Jira SSOT, RevOps, Fabric, CX OKR, Tableau Server, Genie Space). Avg time '
    'in current status math fixed via a new daysInStatus field. Priority breakdown bars fixed, '
    'card grid stretch fixed, hover affordances added across nine surfaces, home page hero '
    'plus three step cards refreshed. Live deploy 52.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f4ca W10.D8 - Sprint Intelligence per ticket charts, future sprint variant, redeploy"
md_new = (
    "### 2026-05-17 · \U0001f3a8 W10.D9 - Sprint Intelligence polish: BI content, chart fixes, hover affordances\n"
    "- **All 138 tickets rewritten to BI / DE work.** Themed around the user real anchor projects: NAI / NC2 / NCI Pulse on Databricks, Jira SSOT data portal, RevOps ACV / GRR / QBR plus Balanced Scorecard, Microsoft Fabric Marketing plus Procurement, CX OKR Tableau dashboard, Tableau Server, Genie Space, dbt, ADF. Sprint narratives kept their shape (Jan healthy, Feb CFO escalation, Mar Fabric migration blocked, Apr recovered, May in flight, Jun backlog).\n"
    "- **Team roles refreshed** to a realistic BI / DE org: Senior BI Engineer, Senior Data Engineer (x2), Analytics Engineer, BI Engineer (x2), Junior Analytics Engineer, Data Engineering Manager.\n"
    "- **Six brief fixtures rewritten** to match the new narratives. Same five section markdown structure for the four retrospectives plus the in-flight may brief. June planning brief retained the Planning summary plus Allocation highlights tone.\n"
    "- **Avg time in current status math fixed.** New per-ticket `daysInStatus` field added to `TicketSpec`, synthesized at generation time with realistic per-status distributions (done 1.5 to 7d, in review 1 to 4d, in progress 2 to 8d, todo 0 to 12d, blocked 5 to 14d). Deterministic per `(sprint id, ticket id)` hash so regenerates stay stable. `computeAvgDaysInStatus` reads `t.daysInStatus` directly. Section eyebrow renamed to Avg time in current status. The 100+ day numbers the user reported are gone, replaced with the 2 to 12 day signal that actually means something.\n"
    "- **Priority breakdown chart fixed.** Grid item is now `h-full` so the percent based bar heights compute correctly, chart height bumped from `h-44` to `h-56`, `minHeight: 4px` so even the smallest stacks remain visible.\n"
    "- **Card grid stretch fixed.** Sprint health, Status and priority, and Per ticket signals grids all use `items-start` so velocity and throughput cards size to content instead of inflating to match the burndown card.\n"
    "- **Sprint card taglines** hand authored per sprint with a key metric. Examples: 'Healthy sprint. 67 SP delivered, beat baseline by 16 percent.' / 'Scope creep absorbed. CFO escalation added 6 P0/P1 tickets mid sprint, all closed.' / 'Blocked sprint. Fabric migration stalled day 4, 3 engineers idled, velocity 46 SP.'\n"
    "- **Home page refreshed.** Hero h1 now reads 'Sprint review prep for a BI team, in five minutes.' Hero subtitle plus all three StepCard descriptions rewritten to reference the BI angle, the filter bar, and the analysis layers.\n"
    "- **Hover affordances** added across the dashboard via native `title` attributes: sprint cards (gallery), seven Top KPI tiles (each carrying a formula), six Story Points tiles, Avg days in status bars, Priority Breakdown columns, Cycle Time bars (ticket title plus tone), Aging Tickets bars (ticket title plus age plus status), Workload by Assignee rows (engineer name plus role plus done over total), Sprint History rows (sprint name plus tagline), row link icons.\n"
    "- **Build clean, type check clean.** `/sprint/[id]` First Load JS unchanged at 52.4 kB. Redeployed to prod, all eight routes return HTTP 200 on smoke check.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Mirror the narrative-generator case study structure. Three engineering moments to cover: the monorepo `rootDirectory` workaround for the Vercel deploy, the search param driven filter pattern shared with the `eng=N` drill down, and the manifest enrichment pattern that keeps cross sprint widgets zero cost on First Load JS.\n"
    "\n"
    "### 2026-05-17 · \U0001f4ca W10.D8 - Sprint Intelligence per ticket charts, future sprint variant, redeploy"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D8 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 8 - Per ticket charts, future sprint variant, production "
    "redeploy. Eight new server components (`AvgDaysInStatus`, `PriorityBreakdown`, `EtaCard`, "
    "`CycleTimeBars`, `AgingTickets`, `WorkloadByAssignee`, `SprintHistoryTable`, "
    "`SprintTrendCharts`), enriched manifest. `/sprint/jun-2026` branches to a backlog focused layout. "
    "Live deploy 52.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 9 - Polish round. All 138 tickets and 6 briefs rewritten to "
    "BI / DE work (Pulse SSOT, Jira SSOT, RevOps, Fabric, CX OKR, Tableau Server, Genie Space). "
    "Avg time in current status math fixed via a new `daysInStatus` field. Priority breakdown bars "
    "fixed, card grid stretch fixed, hover affordances added across nine surfaces, home page hero "
    "plus three step cards refreshed. Live deploy 52.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
