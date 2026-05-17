"""Emit the 6 monthly meeting brief fixtures.

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

Jan 2026 closed on plan. The team shipped both stretch deliverables (the dashboard redesign and the magic link auth flow) and held cycle time below the team baseline across the sprint. Velocity landed at **67 story points**, beating the four sprint baseline of 58 by **16 percent**. Two onboarding empty state tickets carried over to Feb 2026 by design, both P3 priority.

## Highlights

- **Dashboard redesign shipped end to end.** Hero section, filter bar refactor, and the cohort retention chart all behind the new design system tokens.
- **Magic link auth flow shipped** with rate limiting, email copy review, and an abuse guard. Cycle time on the auth tickets averaged 4.2 days against a 4.5 day team baseline.
- **Light mode contrast audit closed.** Card footer contrast lifted from 2.37 to 6.4, no more WCAG AA misses.
- **Quality work landed** across two P2 backlog sweeps and a search index v2 spike.

## Watch list

- Marcus Johnson carried a lighter workload this sprint (3 tickets, 8 story points). Worth a one on one to check if context switching cost him capacity or if assignments missed him.
- Two onboarding empty state tickets (copy refresh, illustration swap) carry over to Feb 2026. Both P3, both blocked on design feedback that arrived at the end of week four.
- Junior engineer Kai Tanaka still tracking above the team cycle time baseline (5.6 days versus 4.5). Pair Kai with a senior on the Feb cohort heatmap work for a mentoring lift.

## Recommendations

- Schedule a cycle time retrospective for the Feb 2026 retro slot. The sprint shaved 1.8 days off the team average across the month. Worth documenting what changed so the gain holds.
- Move both onboarding empty state tickets to a single design pairing session early in Feb 2026 so they ship in week one rather than carrying again.
- Promote the magic link auth flow to all tier two customers in Feb 2026. The flow has held in staging for three weeks with zero incidents.

## Talking points

- **Both stretch deliverables shipped on plan.** Dashboard redesign plus magic link auth, no scope cuts.
- **Velocity beat the baseline by 16 percent** at 67 story points versus 58. Capacity headroom remained at 17 percent for unplanned work.
- **Cycle time improvement of 1.8 days** across the sprint, from 5.2 on day one to 3.4 on day thirty one.
- **Two carryover tickets are P3 onboarding polish** that depended on design feedback. Not a discipline issue.
- **Kai Tanaka pairing recommendation** for the cohort heatmap work in Feb 2026."""

FEB = """## Executive summary

Feb 2026 absorbed a customer escalation mid sprint and still closed the original scope. A workspace data leak escalation on day nine added six P0 and P1 tickets, all closed by day twenty four. Velocity finished at **78 story points** against a baseline of 62, but capacity ran hot, three tickets carried over, and cycle time drifted above baseline.

## Highlights

- **Real time presence indicator shipped** with websocket fallback. Cycle time averaged 4.6 days, half a day over baseline because of the customer escalation interleaving.
- **Quarterly billing rollup shipped** including the CSV export. Retroactive recalculation absorbed the day eleven tax line bug fix cleanly.
- **Customer escalation closed cleanly** by day twenty four. Audit log of cross account share events live in prod, postmortem filed, retention policy doc in flight.
- **Workspace template gallery shell** landed. Cards still in review carrying to mar.

## Watch list

- Cycle time **rose 0.5 days above baseline** during the escalation window. Worth watching in mar to confirm the team norm returns to 4.5 days once the queue stabilises.
- **Three tickets carry over**: search ranking improvements v2, workspace template gallery cards, notification preference toggles backend. All in review at close, all P2.
- Liam Sullivan picked up the audit log retention policy doc plus the postmortem. Manager carrying a doc heavy queue is a yellow flag for the next sprint.

## Recommendations

- Schedule the audit log retention review for the first week of mar so the doc closes before it stales.
- Pull the workspace template gallery cards to mar week one. Owner already in review, predictable close.
- Run a postmortem follow up two weeks after the prod fix lands. Confirm the abuse guard rules cover the original leak vector plus the two adjacent ones flagged in the incident channel.

## Talking points

- **Customer escalation absorbed mid sprint**, six P0 plus P1 tickets, all closed in fifteen days.
- **Velocity beat baseline by 26 percent** at 78 story points versus 62 because of the absorbed scope. The cost was three carryover tickets and a half day cycle time drift.
- **Both stretch deliverables shipped** (presence indicator, billing rollup) despite the absorbed scope. No customer commits missed.
- **Audit log of cross account share events live in prod.** Audit log dashboard plus retention policy doc carry into mar.
- **Search v2 plus template gallery cards plus notifications toggles** carry into mar, all in review."""

MAR = """## Executive summary

Mar 2026 stalled on the auth migration. A database team sign off lapsed on day four and three engineers idled on the v2 session cutover dependency. Workspace templates and search v2 shipped on plan but auth migration carries cleanly to apr. Velocity landed at **46 story points**, the lowest in the four trailing sprints, against a baseline of 62.

## Highlights

- **Search v2 shipped to prod** with cycle time held at 4.2 days, the only headline deliverable to close on plan.
- **Workspace templates polish landed** including the dark mode bug fix.
- **Notifications preference toggles UI plus backend shipped.** End to end behind a flag, default off pending qa in apr.
- **P2 backlog burndown** held to plan despite the auth block, two of two batches closed.

## Watch list

- **Three auth migration tickets blocked** on the v2 session cutover (ENG-2201, ENG-2202, ENG-2203). All P0. All carrying to apr with manager escalation.
- **Two enhancement tickets blocked** on owner reassignment (Lighthouse SEO regression on /report, Sentry alert rules tune for the noisy frontend). Both P2, carrying.
- **Velocity drop of sixteen points versus baseline.** Driven entirely by the auth block. Cycle time rose to 5.3 days as the team absorbed the disruption.
- Priya Sharma and Zara Khan both picked up auth migration work that got blocked. Two senior engineers idled for two weeks. Direct cost of the database team handoff.

## Recommendations

- **Escalate the database team handoff process** for the apr retro. Two weeks of senior engineer idle time is the single largest pull on the quarter.
- **Hold the auth migration window in apr week one.** Three blocked tickets plus the rollback plan doc need to close before week two so the analytics revamp lands cleanly.
- Pair Marcus Johnson with eng-2 on the workspace template gallery cards in apr. Marcus had spare capacity this sprint and the gallery card flow is the natural next step.

## Talking points

- **Auth migration blocked on database team sign off** since day four. Three engineers idled. Carrying cleanly to apr week one.
- **Velocity 46 SP**, lowest in four sprints, baseline 62. Direct attribution to the auth block.
- **Search v2 plus workspace templates plus notification toggles all shipped.** The non blocked queue held.
- **Cycle time at 5.3 days**, up from a 4.5 day baseline.
- **Apr lift requires the auth migration to close in week one** so analytics work has runway."""

APR = """## Executive summary

Apr 2026 closed the auth migration end to end. All three carryover tickets from mar landed in apr week one. The team also shipped the workspace template create plus delete flows and burned down the bulk move work. Velocity recovered to **65 story points** against a baseline of 58, cycle time held at 4.1 days under the 4.5 day team norm.

## Highlights

- **Auth v2 migration shipped end to end.** Cutover, dual write, dual read fallback, rollback plan doc, prod promotion, plus decommission of the old session table.
- **Every mar carryover closed.** Lighthouse SEO regression, Sentry alert rules tune, the auth queue, all clean.
- **Workspace template create plus delete flows shipped.** Bulk move work also closed, both frontend and backend wired through.
- **Cycle time recovered to 4.1 days**, a 1.2 day swing versus mar. Throughput at 22 tickets across the month.

## Watch list

- The auth migration close required a sustained two week push. Worth banking the cycle time gain rather than spending it on stretch scope in may.
- Liam Sullivan continues to carry a doc heavy queue (rollback plan, audit log retention dashboard polish, audit dashboard promotion). Manager bandwidth for the may onboarding redesign reviews is the question.
- Kai Tanaka cycle time at 5.4 days, still trailing baseline. Three onboarding polish tickets is a healthy load but the trend has not closed yet.

## Recommendations

- **Bank the cycle time gain for may.** The onboarding redesign and the analytics revamp both have predictable scope. Hold capacity headroom at twenty percent for the analytics chart work.
- **Schedule a manager bandwidth check** before may week one. Liam's queue across mar and apr has been doc heavy. The onboarding reviews in may will compete for his time.
- **Pair Kai Tanaka with a senior** on a stretch ticket in may. Two months of trailing cycle time without a deliberate pairing call is a mentoring miss.

## Talking points

- **Auth migration shipped end to end** including the decommission of the old session table.
- **Every mar carryover closed.** No tickets carried into may.
- **Velocity 65 SP**, baseline 58. Capacity headroom at twenty percent, the healthiest of the four trailing sprints.
- **Cycle time 4.1 days**, under the 4.5 day baseline. The cleanest recovery story in the quarter.
- **May runway is clear** for the onboarding redesign plus the analytics revamp."""

MAY = """## Executive summary

May 2026 is day 17 of 31 and tracking on baseline. The onboarding redesign shipped, the analytics revamp is in review, and the notifications inbox redesign is in flight. One blocker on the cohort retention accessibility audit, unblocked friday. Velocity tracking to a projected **58 to 62 story points** at close, in line with the four sprint baseline of 59.

## Highlights

- **Onboarding redesign hero plus step strip shipped.** Cycle time on the onboarding queue at 3.7 days, under baseline.
- **Analytics revamp cohort retention API plus chart in review.** Funnel chart redesign in progress, backend API in review. On track for the may close.
- **Notifications inbox redesign shell shipped.** Rows in review, deployment slot reserved for week four.
- **Two production bugs closed** in week one (PDF font fallback, workspace switcher keyboard nav).

## Watch list

- **One ticket blocked** on the cohort retention accessibility audit. Waiting on design tokens refresh from Emma Williams by friday. P2, carrying risk for the analytics close.
- **Six tickets at to do** for the late may push including three deployment tickets. Liam's queue dependent.
- **Three tickets missing eta** including the audit log retention dashboard polish and two P2 backlog burndowns. Worth a noon on day eighteen pass.

## Recommendations

- **Unblock the cohort retention a11y audit by friday.** Design tokens refresh is the single dependency. One slack thread away.
- **Pull two of the missing eta tickets to a triage slot.** Audit log dashboard polish plus the second P2 backlog burndown can both go to next sprint if needed, but a deliberate call beats a slow slip.
- **Schedule the analytics revamp staging promotion for day twenty four.** Cohort retention chart plus funnel chart plus funnel backend all in review now, all on track.

## Talking points

- **Day 17 of 31.** On baseline, no escalation.
- **Onboarding redesign shipped.** Analytics revamp in review. Notifications inbox in flight.
- **One blocker, unblocking friday.** Cohort retention accessibility audit pending design tokens.
- **Six deployment tickets queued for week four.** Predictable owner, predictable close.
- **Projected close at 58 to 62 SP**, on the four sprint baseline of 59."""

JUN = """## Planning summary

Jun 2026 is the next sprint. The manager has earmarked **sixteen tickets** across three workstreams: payments v2, mobile app v2 scaffold, and the telemetry pipeline groundwork. Eight tickets have committed etas inside the june window, eight do not. Total story points allocated at **69**, ten under capacity, leaving headroom for unplanned work.

## Allocation highlights

- **Payments v2 is the headline initiative.** Four tickets across the new pricing tier engine, usage metering ingest, invoice render template, and the pricing page redesign. Senior engineers (Priya, Alex) own the backend and frontend respectively.
- **Mobile app v2 scaffold lands.** Three tickets: shell scaffold, auth flow port, dashboard read only. Marcus and Sophia own the mobile work.
- **Telemetry pipeline groundwork.** Three tickets across the event schema doc, the producer SDK, and the BigQuery consumer. Zara plus Priya partner on this with Zara leading.
- **Three deployment tickets queued** to promote payments v2 and the telemetry producer to staging.

## Watch list before sprint start

- **Eight tickets are missing eta.** Highest risk: mobile app v2 scaffold (shell, auth port, dashboard) and the BigQuery telemetry consumer. Manager review needed before the planning meeting.
- **Two P0 payments tickets** depend on each other (pricing tier engine plus usage metering ingest). Schedule a kickoff to align the two senior engineers on the shared schema.
- **Kai Tanaka is on the bench** with one ticket allocated (customer onboarding video v2). Worth pulling a stretch ticket onto his lane before the sprint starts.

## Recommendations

- **Lock etas on the eight open tickets** before the sprint planning meeting. Five of the eight are mobile or telemetry tickets where the ambiguity is real, not procedural.
- **Pair Priya and Zara on the telemetry producer SDK** for the first three days. Producer plus consumer co design eliminates the most likely day eight rework.
- **Add a stretch ticket to Kai's lane.** One ticket of allocation across a month is a mentoring miss. The bug sweep on the analytics revamp is the right fit.

## Talking points

- **Sixteen tickets allocated, 69 SP, ten under capacity.** Headroom for unplanned work plus one carryover from may.
- **Payments v2 plus mobile v2 plus telemetry groundwork** are the three workstreams. No dependency chain across the three.
- **Eight tickets missing eta**, half of those are mobile work where the ambiguity is real.
- **Two P0 tickets on payments**, one dependency between them, kickoff scheduled.
- **Kai Tanaka under allocated.** One stretch ticket to add before sprint start."""

BRIEFS = [
    ("jan-2026", JAN, "Healthy sprint. Velocity 67 SP versus 58 baseline, cycle time improved 1.8 days. Two P3 carryovers."),
    ("feb-2026", FEB, "Scope creep absorbed. Six P0 plus P1 tickets added day nine for a customer escalation. Three carryovers."),
    ("mar-2026", MAR, "Blocked sprint. Auth migration stalled on database team sign off, three senior engineers idled. Velocity 46 SP."),
    ("apr-2026", APR, "Recovery sprint. Auth migration shipped end to end, every mar carryover closed. Velocity 65 SP."),
    ("may-2026", MAY, "In flight, day 17 of 31. Onboarding redesign shipped, analytics revamp in review. One blocker."),
    ("jun-2026", JUN, "Planning brief. Sixteen tickets allocated across payments v2, mobile v2 scaffold, and telemetry groundwork."),
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
