"""Emit the 6 monthly BI / Data Engineering meeting brief fixtures.

Each conforms to @rishi/ai-core's Fixture type: {id, text, metadata}.
Text uses the five canonical section headings the StreamingBriefPanel
watches for: Executive summary, Highlights, Watch list, Recommendations,
Talking points.

Jun 2026 is a planning brief (forward looking, manager facing) so the
tone differs from the four retrospective briefs.
"""

from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "fixtures" / "sprint-intelligence" / "briefs"
OUT.mkdir(parents=True, exist_ok=True)

JAN = """## Executive summary

Jan 2026 closed on plan. The team shipped both headline deliverables (the NAI Pulse quarterly KPI refresh and the Jira SSOT data portal v1) and held cycle time below the team baseline across the sprint. Velocity landed at **67 story points**, beating the four sprint baseline of 58 by **16 percent**. Two Jira SSOT onboarding tour tickets carried over to Feb 2026 by design, both P3 priority.

## Highlights

- **NAI Pulse quarterly KPI refresh shipped.** Six new tiles on the executive dashboard plus the Gold layer schema review behind them. Cycle time on the Pulse work averaged 4.2 days against a 4.5 day team baseline.
- **Jira SSOT data portal v1 live.** Project list, search, filter bar plus CSV export, activity feed on the project page. Incremental backfill landed for the closed-tickets table.
- **RevOps ACV Weekly drillthrough on the segment view shipped.** Pairs with the v1 Balanced Scorecard data layer.
- **Maintenance backlog burndown** held to plan: CFD legacy view cleanup, Supply Chain dashboard refresh, Tableau Server warmup cron, Balanced Scorecard load time cut by 1.4 seconds.

## Watch list

- Marcus Johnson (Analytics Engineer) carried a lighter workload this sprint (3 tickets, 8 story points). Worth a one on one to check if context switching cost him capacity or if assignments missed him.
- Two Jira SSOT onboarding tour tickets (copy refresh, illustration swap) carry over to Feb 2026. Both P3, both blocked on Figma feedback that arrived at the end of week four.
- Junior engineer Kai Tanaka still tracking above the team cycle time baseline (5.5 days versus 4.5). Pair Kai with a senior on the NC2 cohort heatmap work in Feb for a mentoring lift.

## Recommendations

- Schedule a cycle time retrospective for the Feb 2026 retro slot. The sprint shaved 1.8 days off the team average across the month. Worth documenting what changed so the gain holds.
- Move both Jira SSOT onboarding tickets to a single Figma pairing session early in Feb 2026 so they ship in week one rather than carrying again.
- Promote the NAI Pulse Gold tiles to all tier two stakeholders in Feb 2026. The tiles have held in staging for three weeks with zero data drift.

## Talking points

- **Both headline deliverables shipped on plan.** NAI Pulse quarterly KPI refresh plus Jira SSOT data portal v1, no scope cuts.
- **Velocity beat the baseline by 16 percent** at 67 story points versus 58. Capacity headroom remained at 17 percent for unplanned work.
- **Cycle time improvement of 1.8 days** across the sprint, from 5.2 on day one to 3.4 on day thirty one.
- **Two carryover tickets are P3 onboarding polish** that depended on Figma feedback. Not a discipline issue.
- **Kai Tanaka pairing recommendation** for the NC2 cohort heatmap work in Feb 2026."""

FEB = """## Executive summary

Feb 2026 absorbed a CFO escalation mid sprint and still closed the original scope. A pipeline coverage tile escalation on day nine added six P0 and P1 tickets, all closed by day twenty four. Velocity finished at **77 story points** against a baseline of 62, but capacity ran hot, three tickets carried over, and cycle time drifted above baseline.

## Highlights

- **Pulse NAI real-time tile shipped** (license usage by region) with the Genie Space embed behind it. Cycle time averaged 4.6 days, half a day over baseline because of the escalation interleaving.
- **RevOps GRR Weekly quarterly view shipped** including the CSV export plus subscription. Retroactive recalculation absorbed the day eleven tax line bug fix cleanly.
- **CFO escalation closed cleanly** by day twenty four. Pipeline coverage tile fixed in prod, audit log of pipeline coverage tile reads live, postmortem filed.
- **CX OKR quarterly dashboard shell** landed. Per-product cards still in review carrying to mar.

## Watch list

- Cycle time **rose 0.5 days above baseline** during the escalation window. Worth watching in mar to confirm the team norm returns to 4.5 days once the queue stabilises.
- **Three tickets carry over**: NCI Pulse cohort weighting fix, CX OKR per-product cards, notification preference backend. All in review at close, all P2.
- Liam Sullivan (Engineering Manager) picked up the Genie Space query postmortem plus the audit log retention policy doc. Manager carrying a doc-heavy queue is a yellow flag for the next sprint.

## Recommendations

- Schedule the audit log retention review for the first week of mar so the doc closes before it stales.
- Pull the CX OKR per-product cards to mar week one. Owner already in review, predictable close.
- Run a postmortem follow up two weeks after the prod fix lands. Confirm the audit guards on the pipeline coverage tile cover the original Genie Space cohort vector plus the two adjacent ones flagged in the incident channel.

## Talking points

- **CFO escalation absorbed mid sprint**, six P0 plus P1 tickets, all closed in fifteen days.
- **Velocity beat baseline by 24 percent** at 77 story points versus 62 because of the absorbed scope. The cost was three carryover tickets and a half day cycle time drift.
- **Both headline deliverables shipped** (Pulse NAI real-time tile, RevOps GRR quarterly view) despite the absorbed scope. No stakeholder commits missed.
- **Pipeline coverage tile fixed in prod plus audit log live.** Audit log retention policy doc carries into mar.
- **NCI Pulse cohort fix plus CX OKR cards plus notification backend** carry into mar, all in review."""

MAR = """## Executive summary

Mar 2026 stalled on the Fabric Marketing migration. The NextGen team sign-off on the ADF pipeline lapsed on day four and three engineers idled on the OneLake cutover dependency. Sales Rep QBR redesign and the Supply Chain dashboard refresh shipped on plan but the Fabric migration carries cleanly to apr. Velocity landed at **46 story points**, the lowest in the four trailing sprints, against a baseline of 62.

## Highlights

- **Sales Rep QBR redesign shipped to prod** with cycle time held at 4.2 days, the only headline deliverable to close on plan.
- **Genie Space adoption pack for Sales Rep QBR landed.** Ten sample questions, embed flow live for the field team.
- **Tableau Supply Chain dashboard refresh shipped.** New SKU drilldown plus the weekly SKU rollup behind it.
- **Maintenance batch held to plan** despite the Fabric block: NCI Pulse view cleanup, Genie Space saved view bulk migration, CX OKR PDF newline bug fix.

## Watch list

- **Three Fabric Marketing tickets blocked** on the NextGen team ADF sign-off (DE-2201, DE-2202, DE-2203). All P0. All carrying to apr with manager escalation.
- **Two enhancement tickets blocked** on owner reassignment (CFD trend bug, Sentry alert rules tune). Both P2, carrying.
- **Velocity drop of sixteen points versus baseline.** Driven entirely by the Fabric block. Cycle time rose to 5.3 days as the team absorbed the disruption.
- Priya Sharma and Zara Khan both picked up Fabric work that got blocked. Two senior engineers idled for two weeks. Direct cost of the NextGen team handoff.

## Recommendations

- **Escalate the NextGen team handoff process** for the apr retro. Two weeks of senior engineer idle time is the single largest pull on the quarter.
- **Hold the Fabric migration window in apr week one.** Three blocked tickets plus the rollback plan doc need to close before week two so the Sales Rep QBR redesign v2 has runway.
- Pair Marcus Johnson with eng-2 on the Procurement Open PO work in apr. Marcus had spare capacity this sprint and the Power BI flow is the natural next step.

## Talking points

- **Fabric Marketing migration blocked on NextGen team sign-off** since day four. Three engineers idled. Carrying cleanly to apr week one.
- **Velocity 46 SP**, lowest in four sprints, baseline 62. Direct attribution to the Fabric block.
- **Sales Rep QBR redesign plus Supply Chain refresh plus Genie Space adoption pack all shipped.** The non blocked queue held.
- **Cycle time at 5.3 days**, up from a 4.5 day baseline.
- **Apr lift requires the Fabric migration to close in week one** so the Sales Rep QBR redesign v2 has runway."""

APR = """## Executive summary

Apr 2026 closed the Fabric Marketing migration end to end. All three carryover tickets from mar landed in apr week one. The team also shipped the Fabric Procurement Open PO plus AP Invoice Accrual dashboards and the RevOps Partner Focus rollup. Velocity recovered to **65 story points** against a baseline of 58, cycle time held at 4.1 days under the 4.5 day team norm.

## Highlights

- **Fabric Marketing Budget Tracker shipped end to end.** OneLake cutover, Bronze to Silver PySpark refactor, Silver to Gold semantic model in Power BI, rollback plan doc, prod promotion, plus decommission of the legacy Marketing Budget Tracker pipeline.
- **Every mar carryover closed.** CFD trend bug, Sentry alert rules tune, the three blocked Fabric tickets, all clean.
- **Fabric Procurement Open PO plus AP Invoice Accrual shipped.** RevOps Partner Focus weekly rollup also closed, both frontend and backend wired through.
- **Cycle time recovered to 4.1 days**, a 1.2 day swing versus mar. Throughput at 22 tickets across the month.

## Watch list

- The Fabric migration close required a sustained two week push. Worth banking the cycle time gain rather than spending it on stretch scope in may.
- Liam Sullivan continues to carry a doc-heavy queue (rollback plan doc, audit log retention dashboard polish, audit dashboard promotion). Manager bandwidth for the may CX OKR plus Sales Rep QBR redesign reviews is the question.
- Kai Tanaka cycle time at 5.4 days, still trailing baseline. Three Jira SSOT onboarding tickets is a healthy load but the trend has not closed yet.

## Recommendations

- **Bank the cycle time gain for may.** The CX OKR quarterly refresh and the Sales Rep QBR redesign v2 both have predictable scope. Hold capacity headroom at twenty percent for the cohort retention chart work.
- **Schedule a manager bandwidth check** before may week one. Liam's queue across mar and apr has been doc heavy. The may reviews will compete for his time.
- **Pair Kai Tanaka with a senior** on a stretch ticket in may. Two months of trailing cycle time without a deliberate pairing call is a mentoring miss.

## Talking points

- **Fabric Marketing migration shipped end to end** including the decommission of the legacy pipeline.
- **Every mar carryover closed.** No tickets carried into may.
- **Velocity 65 SP**, baseline 58. Capacity headroom at twenty percent, the healthiest of the four trailing sprints.
- **Cycle time 4.1 days**, under the 4.5 day baseline. The cleanest recovery story in the quarter.
- **May runway is clear** for the CX OKR quarterly refresh plus the Sales Rep QBR redesign v2."""

MAY = """## Executive summary

May 2026 is day 17 of 31 and tracking on baseline. The CX OKR quarterly refresh shipped, the Sales Rep QBR redesign v2 is in review, and the Balanced Scorecard Genie Space embed is in flight. One blocker on the cohort retention accessibility audit, unblocked friday. Velocity tracking to a projected **58 to 62 story points** at close, in line with the four sprint baseline of 59.

## Highlights

- **CX OKR quarterly refresh shipped.** New business KPI tiles plus the per-product breakdown tabs. Cycle time on the CX queue at 3.7 days, under baseline.
- **Sales Rep QBR redesign v2 in review.** New cohort retention API plus chart in review. Funnel chart redesign in progress, backend rollup in review. On track for the may close.
- **Balanced Scorecard Genie Space embed shell shipped.** Rows in review, deployment slot reserved for week four.
- **Two production bugs closed** in week one (CX OKR PDF font fallback, Tableau Server workbook switcher keyboard nav).

## Watch list

- **One ticket blocked** on the Balanced Scorecard Genie Space accessibility audit. Waiting on Figma design tokens refresh from Emma Williams by friday. P2, carrying risk for the QBR close.
- **Six tickets at to do** for the late may push including three deployment tickets. Liam's queue dependent.
- **Three tickets missing eta** including the audit log retention dashboard polish and the second P2 maintenance batch. Worth a noon on day eighteen pass.

## Recommendations

- **Unblock the Genie Space a11y audit by friday.** Figma design tokens refresh is the single dependency. One slack thread away.
- **Pull two of the missing eta tickets to a triage slot.** Audit log dashboard polish plus the second P2 maintenance batch can both go to next sprint if needed, but a deliberate call beats a slow slip.
- **Schedule the Sales Rep QBR redesign v2 staging promotion for day twenty four.** Cohort retention API plus chart plus funnel backend all in review now, all on track.

## Talking points

- **Day 17 of 31.** On baseline, no escalation.
- **CX OKR quarterly refresh shipped.** Sales Rep QBR redesign v2 in review. Balanced Scorecard Genie Space embed in flight.
- **One blocker, unblocking friday.** Genie Space accessibility audit pending Figma design tokens.
- **Three deployment tickets queued for week four.** Predictable owner, predictable close.
- **Projected close at 58 to 62 SP**, on the four sprint baseline of 59."""

JUN = """## Planning summary

Jun 2026 is the next sprint. The manager has earmarked **sixteen tickets** across three workstreams: Pulse v2 unified semantic layer, Genie Space adoption on RevOps, and the Tableau Server 2024.3 upgrade. Eight tickets have committed etas inside the june window, eight do not. Total story points allocated at **69**, ten under capacity, leaving headroom for unplanned work plus one may carryover.

## Allocation highlights

- **Pulse v2 is the headline initiative.** Four tickets across the NAI / NC2 / NCI schema reconcile, the shared Gold mart definition, the unified executive dashboard shell, and the dashboard tiles. Senior engineers (Priya, Alex) own the backend and the dashboard front respectively.
- **Genie Space adoption across RevOps.** Three tickets: ACV Weekly adoption pack, Sales QBR adoption pack, Balanced Scorecard starter board. Sophia and Marcus partner with Sophia leading.
- **Tableau Server 2024.3 upgrade.** Two tickets: upgrade plan doc plus the staging pass. Zara leads, deployment slot reserved for week three.
- **Three deployment tickets queued** to promote Pulse v2 unified mart and the Tableau Server upgrade.

## Watch list before sprint start

- **Eight tickets are missing eta.** Highest risk: the three Genie Space adoption packs and the Pulse v2 dbt model coverage ticket. Manager review needed before the planning meeting.
- **Two P0 Pulse tickets** depend on each other (schema reconcile plus shared Gold mart). Schedule a kickoff to align the two senior engineers on the unified schema before any tile work begins.
- **Kai Tanaka is on the bench** with one ticket allocated (Figma design tokens refresh). Worth pulling a stretch ticket onto his lane before the sprint starts.

## Recommendations

- **Lock etas on the eight open tickets** before the sprint planning meeting. Five of the eight are Genie Space adoption tickets where the ambiguity is real, not procedural.
- **Pair Priya and Zara on the Pulse v2 schema reconcile** for the first three days. Producer plus consumer co design eliminates the most likely day eight rework.
- **Add a stretch ticket to Kai's lane.** One ticket of allocation across a month is a mentoring miss. The bug sweep on the Sales Rep QBR redesign is the right fit.

## Talking points

- **Sixteen tickets allocated, 69 SP, ten under capacity.** Headroom for unplanned work plus one may carryover.
- **Pulse v2 plus Genie Space adoption plus Tableau Server upgrade** are the three workstreams. No dependency chain across the three.
- **Eight tickets missing eta**, half of those are Genie Space adoption packs where the ambiguity is real.
- **Two P0 tickets on Pulse v2**, one dependency between them, kickoff scheduled.
- **Kai Tanaka under allocated.** One stretch ticket to add before sprint start."""

BRIEFS = [
    ("jan-2026", JAN, "Healthy sprint. Velocity 67 SP versus 58 baseline, cycle time improved 1.8 days. Two P3 carryovers."),
    ("feb-2026", FEB, "Scope creep absorbed. Six P0 plus P1 tickets added day nine for a CFO escalation. Three carryovers."),
    ("mar-2026", MAR, "Blocked sprint. Fabric migration stalled on NextGen team sign-off, three senior engineers idled. Velocity 46 SP."),
    ("apr-2026", APR, "Recovery sprint. Fabric migration shipped end to end, every mar carryover closed. Velocity 65 SP."),
    ("may-2026", MAY, "In flight, day 17 of 31. CX OKR quarterly refresh shipped, Sales Rep QBR redesign v2 in review. One blocker."),
    ("jun-2026", JUN, "Planning brief. Sixteen tickets allocated across Pulse v2, Genie Space adoption, and Tableau Server upgrade."),
]


def main() -> None:
    for sprint_id, text, notes in BRIEFS:
        payload = {
            "id": f"{sprint_id}-brief",
            "text": text,
            "metadata": {
                "generatedAt": "2026-05-17T00:00:00.000Z",
                "model": "claude-sonnet-4-6",
                "promptTokens": 1640,
                "completionTokens": 720,
                "notes": notes,
            },
        }
        path = OUT / f"{sprint_id}.json"
        path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {path.relative_to(REPO)}")


if __name__ == "__main__":
    main()
