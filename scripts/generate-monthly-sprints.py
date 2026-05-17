"""Generate the 6 monthly BI/Data Engineering sprint fixtures plus the index manifest.

Tickets and team are themed around the user's actual work surfaces:
Pulse SSOT (NAI / NC2 / NCI on Databricks), Jira SSOT, RevOps Sales
SSOT (ACV / GRR Weekly, Sales QBR, Balanced Scorecard), Microsoft
Fabric Marketing + Procurement, Tableau (CX OKR, Supply Chain, CFD),
Genie Space, dbt, ADF.

Each ticket is hand authored at the spec level (id, title, type,
assignee, status, priority, estimate, labels, mid sprint flag, optional
blocker note, optional ETA override, plus daysInStatus). The script
computes the rest (burndown arrays, velocity, throughput, per engineer
cycle time) so derived KPIs stay consistent with the ticket data.

Sprints span calendar months Jan to Jun 2026. Today is 2026-05-17.
"""

from __future__ import annotations

import hashlib
import json
from datetime import date
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[1]
SPRINT_DIR = REPO / "fixtures" / "sprint-intelligence" / "sprints"
SPRINT_DIR.mkdir(parents=True, exist_ok=True)

TEAM = [
    {"id": "eng-1", "name": "Alex Chen", "role": "Senior BI Engineer", "capacity": 13},
    {"id": "eng-2", "name": "Priya Sharma", "role": "Senior Data Engineer", "capacity": 13},
    {"id": "eng-3", "name": "Marcus Johnson", "role": "Analytics Engineer", "capacity": 10},
    {"id": "eng-4", "name": "Sophia Rodriguez", "role": "BI Engineer", "capacity": 10},
    {"id": "eng-5", "name": "Kai Tanaka", "role": "Junior Analytics Engineer", "capacity": 7},
    {"id": "eng-6", "name": "Emma Williams", "role": "BI Engineer", "capacity": 10},
    {"id": "eng-7", "name": "Liam Sullivan", "role": "Data Engineering Manager", "capacity": 5},
    {"id": "eng-8", "name": "Zara Khan", "role": "Senior Data Engineer", "capacity": 13},
]
TOTAL_CAPACITY = sum(m["capacity"] for m in TEAM)


# Deterministic per-status duration sampler. Hash of (sprint id + ticket id)
# selects an offset inside the configured range so output stays stable across
# regenerations without a seeded PRNG.
DAYS_IN_STATUS_RANGES: dict[str, tuple[float, float]] = {
    "done": (1.5, 7.0),
    "in-review": (1.0, 4.0),
    "in-progress": (2.0, 8.0),
    "todo": (0.0, 12.0),
    "blocked": (5.0, 14.0),
}


def days_in_status_for(sprint_id: str, ticket_id: str, status: str) -> float:
    lo, hi = DAYS_IN_STATUS_RANGES.get(status, (1.0, 5.0))
    digest = hashlib.md5(f"{sprint_id}:{ticket_id}".encode()).digest()
    bucket = digest[0] / 255.0
    return round(lo + (hi - lo) * bucket, 1)


def ticket(
    tid: str,
    title: str,
    ttype: str,
    assignee: str,
    status: str,
    priority: str,
    estimate: int,
    labels: list[str],
    *,
    created_at: str,
    eta: str | None,
    added_mid_sprint: bool = False,
    blocker_note: str | None = None,
) -> dict[str, Any]:
    """Build one ticket dict. daysInStatus is filled per-sprint in build_fixture."""
    out: dict[str, Any] = {
        "id": tid,
        "title": title,
        "type": ttype,
        "assignee": assignee,
        "status": status,
        "priority": priority,
        "estimate": estimate,
        "labels": labels,
        "addedMidSprint": added_mid_sprint,
        "createdAt": created_at,
        "eta": eta,
    }
    if blocker_note:
        out["blockerNote"] = blocker_note
    return out


def days_in_month(start: date, end: date) -> int:
    return (end - start).days + 1


def linear_ideal(total_sp: int, day_count: int) -> list[int]:
    if day_count <= 1:
        return [total_sp, 0]
    step = total_sp / (day_count - 1)
    return [round(total_sp - step * i) for i in range(day_count)]


def actual_burndown_completed(
    total_sp: int, day_count: int, ending_sp: int, beat_baseline: bool
) -> list[int | None]:
    if day_count <= 1:
        return [total_sp, ending_sp]
    points: list[int | None] = []
    for i in range(day_count):
        progress = i / (day_count - 1)
        shape = progress ** (1.3 if beat_baseline else 0.75)
        sp = round(total_sp - (total_sp - ending_sp) * shape)
        points.append(sp)
    return points


def actual_burndown_inflight(
    total_sp: int, day_count: int, current_day: int, current_sp: int
) -> list[int | None]:
    points: list[int | None] = []
    for i in range(day_count):
        if i < current_day:
            progress = i / max(current_day - 1, 1)
            shape = progress ** 1.1
            sp = round(total_sp - (total_sp - current_sp) * shape)
            points.append(sp)
        else:
            points.append(None)
    return points


def cycle_time_completed(baseline: float, trend: str, day_count: int) -> list[float]:
    start = baseline + (0.7 if trend == "improving" else 0.3 if trend == "flat" else 0)
    if trend == "improving":
        end = baseline - 1.1
    elif trend == "rising":
        end = baseline + 1.5
    else:
        end = baseline
    step = (end - start) / max(day_count - 1, 1)
    return [round(start + step * i, 1) for i in range(day_count)]


def cycle_time_inflight(
    baseline: float, trend: str, day_count: int, current_day: int
) -> list[float | None]:
    completed = cycle_time_completed(baseline, trend, day_count)
    return [v if i < current_day else None for i, v in enumerate(completed)]


def compute_velocity(tickets: list[dict[str, Any]]) -> int:
    return sum(t["estimate"] for t in tickets if t["status"] == "done")


def compute_per_engineer(
    tickets: list[dict[str, Any]], team_baseline: float
) -> dict[str, dict[str, float]]:
    out: dict[str, dict[str, float]] = {}
    for m in TEAM:
        done = [t for t in tickets if t["assignee"] == m["id"] and t["status"] == "done"]
        role_bias = {
            "Senior BI Engineer": -0.4,
            "Senior Data Engineer": -0.5,
            "Analytics Engineer": -0.1,
            "BI Engineer": 0.0,
            "Junior Analytics Engineer": 1.0,
            "Data Engineering Manager": 0.3,
        }.get(m["role"], 0.0)
        personal = team_baseline + role_bias if done else team_baseline + 1.0
        out[m["id"]] = {"personalCycleTime": round(personal, 1)}
    return out


def build_fixture(spec: dict[str, Any]) -> dict[str, Any]:
    start = date.fromisoformat(spec["startDate"])
    end = date.fromisoformat(spec["endDate"])
    day_count = days_in_month(start, end)

    # Stamp daysInStatus into every ticket using the deterministic sampler.
    tickets = []
    for t in spec["tickets"]:
        enriched = dict(t)
        enriched["daysInStatus"] = days_in_status_for(spec["id"], t["id"], t["status"])
        tickets.append(enriched)

    velocity = compute_velocity(tickets)
    total_sp = sum(t["estimate"] for t in tickets)
    open_sp = sum(t["estimate"] for t in tickets if t["status"] != "done")

    burndown_ideal = linear_ideal(total_sp, day_count)
    if spec["status"] == "completed":
        burndown_actual = actual_burndown_completed(
            total_sp,
            day_count,
            ending_sp=open_sp,
            beat_baseline=velocity >= spec["fourSprintBaseline"],
        )
        cycle_days = cycle_time_completed(
            spec["cycleTime"]["teamBaseline"], spec["cycleTime"]["trend"], day_count
        )
    elif spec["status"] == "in-progress":
        burndown_actual = actual_burndown_inflight(
            total_sp, day_count, spec["currentDay"], open_sp
        )
        cycle_days = cycle_time_inflight(
            spec["cycleTime"]["teamBaseline"],
            spec["cycleTime"]["trend"],
            day_count,
            spec["currentDay"],
        )
    else:
        burndown_actual = [None] * day_count
        cycle_days = [None] * day_count

    per_engineer = compute_per_engineer(tickets, spec["cycleTime"]["teamBaseline"])

    return {
        "id": spec["id"],
        "metadata": {
            "name": spec["name"],
            "goal": spec["goal"],
            "startDate": spec["startDate"],
            "endDate": spec["endDate"],
            "status": spec["status"],
            "summary": spec["summary"],
        },
        "scopePlanned": spec["scopePlanned"],
        "scopeFinal": len(tickets),
        "tickets": tickets,
        "burndown": {"ideal": burndown_ideal, "actual": burndown_actual},
        "currentDay": spec.get("currentDay"),
        "fourSprintBaseline": spec["fourSprintBaseline"],
        "velocity": velocity,
        "cycleTime": {
            "days": cycle_days,
            "teamBaseline": spec["cycleTime"]["teamBaseline"],
            "trend": spec["cycleTime"]["trend"],
        },
        "throughputPerWeek": spec["throughputPerWeek"],
        "perEngineer": per_engineer,
    }


# ============================================================
# Sprint specs. BI / Data Engineering themed.
# ============================================================


def jan_2026() -> dict[str, Any]:
    created = "2025-12-22"
    eta = "2026-01-30"
    tickets = [
        ticket("DE-2001", "NAI Pulse quarterly KPI refresh: 6 new tiles on the executive dashboard", "development", "eng-1", "done", "P1", 5, ["pulse-nai", "tableau"], created_at=created, eta=eta),
        ticket("DE-2002", "NAI Pulse Gold layer schema review for the new tiles", "development", "eng-2", "done", "P1", 5, ["pulse-nai", "databricks"], created_at=created, eta=eta),
        ticket("DE-2003", "Jira SSOT data portal v1 ship: project list plus search", "development", "eng-3", "done", "P1", 8, ["jira-ssot", "dbt"], created_at=created, eta=eta),
        ticket("DE-2004", "Jira SSOT data portal filter bar plus export to CSV", "enhancement", "eng-6", "done", "P2", 3, ["jira-ssot", "tableau"], created_at=created, eta=eta),
        ticket("DE-2005", "Jira SSOT incremental backfill for the closed-tickets table", "development", "eng-2", "done", "P1", 3, ["jira-ssot", "databricks"], created_at=created, eta=eta),
        ticket("DE-2006", "RevOps ACV Weekly drillthrough on the segment view", "development", "eng-1", "done", "P1", 5, ["revops-acv", "tableau"], created_at=created, eta=eta),
        ticket("DE-2007", "Tooltip overflow on the Balanced Scorecard at 1280 width", "bug", "eng-3", "done", "P2", 2, ["balanced-scorecard", "tableau"], created_at=created, eta=eta),
        ticket("DE-2008", "Pulse NC2 spike: rolling 30 day cohort heatmap feasibility", "development", "eng-4", "done", "P2", 3, ["pulse-nc2", "databricks"], created_at=created, eta=eta),
        ticket("DE-2009", "Bulk export CSV regression on the CX OKR gallery", "bug", "eng-3", "done", "P2", 2, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2010", "Dark mode contrast audit on the executive dashboards", "enhancement", "eng-6", "done", "P2", 3, ["figma", "tableau"], created_at=created, eta=eta),
        ticket("DE-2011", "Genie Space follow-up: column lineage glitch on RevOps", "bug", "eng-2", "done", "P1", 2, ["genie-space", "revops-qbr"], created_at=created, eta=eta),
        ticket("DE-2012", "Jira SSOT activity feed on the project page", "development", "eng-4", "done", "P2", 5, ["jira-ssot", "tableau"], created_at=created, eta=eta),
        ticket("DE-2013", "Promote NAI Pulse Gold tiles to prod", "deployment", "eng-7", "done", "P2", 2, ["pulse-nai", "databricks"], created_at=created, eta=eta),
        ticket("DE-2014", "Tableau Server warmup cron for the executive workbook", "deployment", "eng-7", "done", "P2", 3, ["tableau-server", "tableau"], created_at=created, eta=eta),
        ticket("DE-2015", "Reduce Balanced Scorecard load time by 1.4s (query tuning)", "enhancement", "eng-8", "done", "P2", 3, ["balanced-scorecard", "databricks"], created_at=created, eta=eta),
        ticket("DE-2016", "Empty state copy on the Jira SSOT project list", "enhancement", "eng-5", "done", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2017", "Lighthouse SEO regression on the Genie Space landing", "bug", "eng-8", "done", "P2", 2, ["genie-space"], created_at=created, eta=eta),
        ticket("DE-2018", "NC2 Pulse Silver to Gold transformation refactor", "development", "eng-2", "done", "P1", 5, ["pulse-nc2", "databricks"], created_at=created, eta=eta),
        ticket("DE-2019", "P2 maintenance batch one of two: legacy CFD view cleanup", "enhancement", "eng-6", "done", "P2", 3, ["cfd", "tableau"], created_at=created, eta=eta),
        ticket("DE-2020", "P2 maintenance batch two of two: Supply Chain dashboard refresh", "enhancement", "eng-6", "done", "P2", 3, ["supply-chain", "tableau"], created_at=created, eta=eta),
        ticket("DE-2021", "Onboarding tour copy refresh on the Jira SSOT portal", "enhancement", "eng-5", "todo", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=None),
        ticket("DE-2022", "Onboarding tour screenshots swap on the Jira SSOT portal", "enhancement", "eng-5", "todo", "P3", 3, ["jira-ssot", "figma"], created_at=created, eta=None),
    ]
    return {
        "id": "jan-2026",
        "name": "Jan 2026 Sprint",
        "goal": "Ship the NAI Pulse quarterly KPI refresh, the Jira SSOT data portal v1, and the RevOps ACV Weekly drillthrough. Burn down the P2 maintenance backlog by ten tickets.",
        "startDate": "2026-01-01",
        "endDate": "2026-01-31",
        "status": "completed",
        "scopePlanned": 22,
        "currentDay": None,
        "fourSprintBaseline": 58,
        "summary": "Healthy sprint. Team hit the goal, velocity at 67 story points (well within capacity), only two onboarding tour tickets carried over by design. Cycle time and review queue both improved versus the four sprint baseline.",
        "tagline": "Healthy sprint. 67 SP delivered, beat baseline by 16 percent.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "improving"},
        "throughputPerWeek": {"weekOne": 8, "weekTwo": 12, "priorAverage": 9},
        "tickets": tickets,
    }


def feb_2026() -> dict[str, Any]:
    created = "2026-01-25"
    eta = "2026-02-26"
    mid_eta = "2026-02-26"
    tickets = [
        ticket("DE-2101", "Pulse NAI real-time tile: license usage by region", "development", "eng-1", "done", "P1", 8, ["pulse-nai", "tableau"], created_at=created, eta=eta),
        ticket("DE-2102", "Pulse NAI tile API behind Genie Space embed", "development", "eng-2", "done", "P1", 5, ["pulse-nai", "genie-space"], created_at=created, eta=eta),
        ticket("DE-2103", "Analytics tracking on the new Balanced Scorecard widgets", "development", "eng-4", "done", "P2", 3, ["balanced-scorecard", "tableau"], created_at=created, eta=eta),
        ticket("DE-2104", "RevOps GRR Weekly rollup: quarterly view", "development", "eng-8", "done", "P1", 5, ["revops-grr", "databricks"], created_at=created, eta=eta),
        ticket("DE-2105", "RevOps GRR Weekly CSV export plus subscription", "development", "eng-8", "done", "P2", 3, ["revops-grr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2106", "Keyboard navigation pass on the Sales QBR workbook", "enhancement", "eng-3", "done", "P2", 2, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2107", "Tableau Server warmup regression on Sales Rep QBR (slow first paint)", "bug", "eng-6", "done", "P2", 3, ["tableau-server", "revops-qbr"], created_at=created, eta=eta),
        ticket("DE-2108", "Jira SSOT onboarding tour illustrations refresh", "enhancement", "eng-5", "done", "P3", 3, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2109", "Jira SSOT onboarding tour copy refresh", "enhancement", "eng-5", "done", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2110", "Genie Space saved view: pin to RevOps starter board", "development", "eng-4", "done", "P2", 3, ["genie-space", "revops-acv"], created_at=created, eta=eta),
        ticket("DE-2111", "Push Pulse NAI real-time tile to staging", "deployment", "eng-7", "done", "P2", 2, ["pulse-nai", "tableau-server"], created_at=created, eta=eta),
        ticket("DE-2112", "Promote RevOps GRR quarterly view to staging", "deployment", "eng-7", "done", "P2", 2, ["revops-grr", "tableau-server"], created_at=created, eta=eta),
        # Mid sprint scope creep: CFO escalation on the Sales QBR view for quarter close.
        ticket("DE-2113", "CFO escalation: Sales QBR pipeline coverage tile shows stale data", "bug", "eng-2", "done", "P0", 5, ["revops-qbr", "databricks"], created_at="2026-02-09", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2114", "Audit log of pipeline coverage tile reads (escalation followup)", "development", "eng-2", "done", "P0", 5, ["revops-qbr", "balanced-scorecard"], created_at="2026-02-10", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2115", "CFO escalation: GRR Weekly tax line off by one row", "bug", "eng-8", "done", "P1", 3, ["revops-grr", "databricks"], created_at="2026-02-10", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2116", "GRR Weekly retroactive recalculation for Q1", "development", "eng-8", "done", "P1", 5, ["revops-grr", "databricks"], created_at="2026-02-11", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2117", "CFO escalation: Genie Space cohort answer mismatch with workbook", "bug", "eng-1", "done", "P1", 3, ["genie-space", "revops-qbr"], created_at="2026-02-12", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2118", "Genie Space query postmortem doc", "enhancement", "eng-7", "done", "P1", 2, ["genie-space", "docs"], created_at="2026-02-12", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2119", "Pulse NCI ranking tweak v2 (cohort weighting fix)", "enhancement", "eng-3", "in-review", "P2", 3, ["pulse-nci", "databricks"], created_at=created, eta=eta),
        ticket("DE-2120", "CX OKR quarterly dashboard shell refresh", "development", "eng-1", "done", "P2", 5, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2121", "CX OKR quarterly per-product cards", "development", "eng-3", "in-review", "P2", 3, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2122", "Resolve flaky CI on the Genie Space embed test", "bug", "eng-2", "done", "P2", 2, ["genie-space", "ci"], created_at=created, eta=eta),
        ticket("DE-2123", "Update Jira SSOT onboarding video thumbnails", "enhancement", "eng-5", "done", "P3", 1, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2124", "Bulk subscription confirm dialog rewrite on Tableau Server", "enhancement", "eng-6", "done", "P2", 3, ["tableau-server"], created_at=created, eta=eta),
        ticket("DE-2125", "Notification preference backend for the dashboard subscription service", "development", "eng-4", "in-review", "P2", 5, ["tableau-server", "databricks"], created_at=created, eta=eta),
        ticket("DE-2126", "Promote pipeline coverage audit log to prod", "deployment", "eng-7", "done", "P0", 2, ["revops-qbr", "tableau-server"], created_at="2026-02-11", eta=mid_eta, added_mid_sprint=True),
        ticket("DE-2127", "Audit log retention policy doc", "enhancement", "eng-7", "todo", "P2", 1, ["docs", "tableau-server"], created_at=created, eta=None),
        ticket("DE-2128", "Investigate Lighthouse perf drop on the Genie Space landing", "enhancement", "eng-8", "todo", "P3", 2, ["genie-space", "perf"], created_at=created, eta=None),
    ]
    return {
        "id": "feb-2026",
        "name": "Feb 2026 Sprint",
        "goal": "Ship the Pulse NAI real-time license tile and the RevOps GRR Weekly quarterly view. Hold cycle time inside the 4.5 day baseline.",
        "startDate": "2026-02-01",
        "endDate": "2026-02-28",
        "status": "completed",
        "scopePlanned": 22,
        "currentDay": None,
        "fourSprintBaseline": 62,
        "summary": "Scope creep. A CFO escalation on day nine added six P0 and P1 tickets mid sprint (Sales QBR pipeline coverage tile, GRR Weekly tax line, Genie Space cohort mismatch). The team absorbed the load and still closed the original scope but velocity finished at 77 SP and three tickets carried over.",
        "tagline": "Scope creep absorbed. CFO escalation added 6 P0/P1 tickets mid sprint, all closed.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "rising"},
        "throughputPerWeek": {"weekOne": 9, "weekTwo": 10, "priorAverage": 9},
        "tickets": tickets,
    }


def mar_2026() -> dict[str, Any]:
    created = "2026-02-22"
    eta = "2026-03-30"
    tickets = [
        ticket("DE-2201", "Fabric Marketing: OneLake to ADF cutover for the Budget Tracker", "development", "eng-2", "blocked", "P0", 8, ["fabric-marketing", "adf"], created_at=created, eta=eta, blocker_note="ADF pipeline needs NextGen team sign-off, blocked since day 4. Owner: eng-2, manager escalation in progress."),
        ticket("DE-2202", "Fabric Marketing: Bronze to Silver PySpark notebook refactor", "development", "eng-2", "blocked", "P0", 5, ["fabric-marketing", "databricks"], created_at=created, eta=eta, blocker_note="Depends on DE-2201 cutover. Currently parked."),
        ticket("DE-2203", "Fabric Marketing: Silver to Gold semantic model in Power BI", "development", "eng-8", "blocked", "P0", 5, ["fabric-marketing", "power-bi"], created_at=created, eta=eta, blocker_note="Depends on DE-2201 cutover. Currently parked."),
        ticket("DE-2204", "Sales Rep QBR redesign polish: new tile order plus icons", "development", "eng-1", "done", "P1", 5, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2205", "Sales Rep QBR tooltip hover states fix", "enhancement", "eng-3", "done", "P2", 2, ["revops-qbr", "figma"], created_at=created, eta=eta),
        ticket("DE-2206", "Sales Rep QBR bug: bad color token on dark mode", "bug", "eng-3", "done", "P2", 1, ["revops-qbr", "figma"], created_at=created, eta=eta),
        ticket("DE-2207", "Genie Space adoption pack for Sales Rep QBR (10 sample questions)", "development", "eng-4", "done", "P1", 5, ["genie-space", "revops-qbr"], created_at=created, eta=eta),
        ticket("DE-2208", "Tableau Supply Chain dashboard refresh: new SKU drilldown", "development", "eng-6", "done", "P2", 3, ["supply-chain", "tableau"], created_at=created, eta=eta),
        ticket("DE-2209", "Supply Chain dashboard backend: weekly SKU rollup", "development", "eng-4", "done", "P2", 3, ["supply-chain", "databricks"], created_at=created, eta=eta),
        ticket("DE-2210", "CFD trend bug: spikes from late-arriving defect ingestion", "bug", "eng-8", "blocked", "P2", 3, ["cfd", "databricks"], created_at=created, eta=eta, blocker_note="Owner pulled to Fabric migration. Carrying to apr."),
        ticket("DE-2211", "PDF export drops trailing newline on the CX OKR readout", "bug", "eng-6", "done", "P2", 2, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2212", "Pipeline coverage audit log retention policy doc finalise", "enhancement", "eng-7", "done", "P2", 1, ["revops-qbr", "docs"], created_at=created, eta=eta),
        ticket("DE-2213", "Sentry alert rules tune for the noisy Tableau Server warmup", "enhancement", "eng-8", "blocked", "P2", 2, ["tableau-server", "observability"], created_at=created, eta=eta, blocker_note="Owner pulled to Fabric migration. Carrying."),
        ticket("DE-2214", "P2 maintenance batch one of two: legacy NCI Pulse view cleanup", "enhancement", "eng-6", "done", "P2", 3, ["pulse-nci", "tableau"], created_at=created, eta=eta),
        ticket("DE-2215", "P2 maintenance batch two of two: Genie Space saved view bulk migrate", "enhancement", "eng-6", "done", "P2", 3, ["genie-space"], created_at=created, eta=eta),
        ticket("DE-2216", "Promote Sales Rep QBR redesign to prod", "deployment", "eng-7", "done", "P1", 2, ["revops-qbr", "tableau-server"], created_at=created, eta=eta),
        ticket("DE-2217", "Promote Supply Chain dashboard refresh to prod", "deployment", "eng-7", "done", "P1", 2, ["supply-chain", "tableau-server"], created_at=created, eta=eta),
        ticket("DE-2218", "Notification subscription perf cleanup", "enhancement", "eng-4", "in-review", "P2", 3, ["tableau-server", "perf"], created_at=created, eta=eta),
        ticket("DE-2219", "Bulk archive confirm dialog rewrite on the Jira SSOT portal", "enhancement", "eng-5", "done", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2220", "Jira SSOT onboarding video step three swap", "enhancement", "eng-5", "done", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2221", "Empty state copy on the CFD zero-defect view", "enhancement", "eng-5", "done", "P3", 1, ["cfd", "tableau"], created_at=created, eta=eta),
        ticket("DE-2222", "Investigate slow render at 1000+ rows on Procurement Open PO", "development", "eng-1", "in-review", "P2", 3, ["fabric-procurement", "perf"], created_at=created, eta=eta),
        ticket("DE-2223", "Tableau Server cron warmup for the Sales Rep QBR workbook", "deployment", "eng-7", "done", "P2", 2, ["tableau-server", "revops-qbr"], created_at=created, eta=eta),
        ticket("DE-2224", "Fabric migration rollback plan doc", "enhancement", "eng-2", "todo", "P0", 2, ["fabric-marketing", "docs"], created_at=created, eta=None),
    ]
    return {
        "id": "mar-2026",
        "name": "Mar 2026 Sprint",
        "goal": "Cut over the Fabric Marketing Budget Tracker from the legacy ETL to OneLake plus ADF. Ship the Sales Rep QBR redesign and the Supply Chain dashboard refresh.",
        "startDate": "2026-03-01",
        "endDate": "2026-03-31",
        "status": "completed",
        "scopePlanned": 24,
        "currentDay": None,
        "fourSprintBaseline": 62,
        "summary": "Blocked sprint. Fabric Marketing migration stalled on day four waiting on a NextGen team sign-off, three engineers idled on the ADF dependency. Sales Rep QBR redesign and the Supply Chain dashboard refresh shipped on plan but the Fabric migration carries cleanly into apr. Velocity 46 SP, the lowest of the four trailing sprints.",
        "tagline": "Blocked sprint. Fabric migration stalled day 4, 3 engineers idled, velocity 46 SP.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "rising"},
        "throughputPerWeek": {"weekOne": 6, "weekTwo": 9, "priorAverage": 9},
        "tickets": tickets,
    }


def apr_2026() -> dict[str, Any]:
    created = "2026-03-25"
    eta = "2026-04-29"
    tickets = [
        ticket("DE-2301", "Fabric Marketing: OneLake to ADF cutover for the Budget Tracker", "development", "eng-2", "done", "P0", 8, ["fabric-marketing", "adf"], created_at=created, eta=eta),
        ticket("DE-2302", "Fabric Marketing: Bronze to Silver PySpark notebook refactor", "development", "eng-2", "done", "P0", 5, ["fabric-marketing", "databricks"], created_at=created, eta=eta),
        ticket("DE-2303", "Fabric Marketing: Silver to Gold semantic model in Power BI", "development", "eng-8", "done", "P0", 5, ["fabric-marketing", "power-bi"], created_at=created, eta=eta),
        ticket("DE-2304", "Fabric Marketing rollback plan doc", "enhancement", "eng-2", "done", "P0", 2, ["fabric-marketing", "docs"], created_at=created, eta=eta),
        ticket("DE-2305", "Promote Fabric Marketing Budget Tracker to staging", "deployment", "eng-7", "done", "P0", 2, ["fabric-marketing", "adf"], created_at=created, eta=eta),
        ticket("DE-2306", "Promote Fabric Marketing Budget Tracker to prod", "deployment", "eng-7", "done", "P0", 2, ["fabric-marketing", "adf"], created_at=created, eta=eta),
        ticket("DE-2307", "Decommission legacy Marketing Budget Tracker pipeline", "deployment", "eng-7", "done", "P1", 1, ["fabric-marketing", "adf"], created_at=created, eta=eta),
        ticket("DE-2308", "CFD trend bug fix: late-arriving defect ingestion handler", "bug", "eng-8", "done", "P2", 3, ["cfd", "databricks"], created_at=created, eta=eta),
        ticket("DE-2309", "Sentry alert rules tune for the Tableau Server warmup", "enhancement", "eng-8", "done", "P2", 2, ["tableau-server", "observability"], created_at=created, eta=eta),
        ticket("DE-2310", "Notification subscription perf cleanup ship", "enhancement", "eng-4", "done", "P2", 3, ["tableau-server", "perf"], created_at=created, eta=eta),
        ticket("DE-2311", "Procurement Open PO render perf fix at 1000+ rows", "development", "eng-1", "done", "P2", 3, ["fabric-procurement", "perf"], created_at=created, eta=eta),
        ticket("DE-2312", "Fabric Procurement: Open PO dashboard build", "development", "eng-3", "done", "P1", 5, ["fabric-procurement", "power-bi"], created_at=created, eta=eta),
        ticket("DE-2313", "Fabric Procurement: AP Invoice Accrual dashboard build", "development", "eng-3", "done", "P1", 3, ["fabric-procurement", "power-bi"], created_at=created, eta=eta),
        ticket("DE-2314", "RevOps Partner Focus dashboard rollup (Q1 view)", "development", "eng-4", "done", "P2", 5, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2315", "RevOps Partner Focus backend: weekly partner aggregate", "development", "eng-4", "done", "P2", 3, ["revops-qbr", "databricks"], created_at=created, eta=eta),
        ticket("DE-2316", "Jira SSOT onboarding step copy refresh", "enhancement", "eng-5", "done", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2317", "Jira SSOT onboarding illustrations refresh", "enhancement", "eng-5", "done", "P3", 3, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2318", "Audit log retention metric dashboard", "enhancement", "eng-6", "done", "P2", 3, ["revops-qbr", "observability"], created_at=created, eta=eta),
        ticket("DE-2319", "Promote audit log retention dashboard to prod", "deployment", "eng-7", "done", "P2", 1, ["tableau-server"], created_at=created, eta=eta),
        ticket("DE-2320", "CX OKR readout PDF header refresh", "enhancement", "eng-6", "done", "P3", 2, ["cx-okr", "figma"], created_at=created, eta=eta),
        ticket("DE-2321", "Empty state on the Genie Space zero-match answer", "enhancement", "eng-5", "done", "P3", 1, ["genie-space", "figma"], created_at=created, eta=eta),
        ticket("DE-2322", "Lighthouse SEO sweep across the public Genie Space landing", "enhancement", "eng-8", "done", "P2", 2, ["genie-space", "perf"], created_at=created, eta=eta),
    ]
    return {
        "id": "apr-2026",
        "name": "Apr 2026 Sprint",
        "goal": "Close out the Fabric Marketing migration cleanly. Burn down the mar carryover. Ship the Fabric Procurement Open PO plus AP Invoice Accrual dashboards.",
        "startDate": "2026-04-01",
        "endDate": "2026-04-30",
        "status": "completed",
        "scopePlanned": 22,
        "currentDay": None,
        "fourSprintBaseline": 58,
        "summary": "Recovery sprint. Fabric Marketing migration shipped end to end with the rollback plan filed. Every mar carryover closed. Fabric Procurement Open PO plus AP Invoice Accrual dashboards shipped on plan. Velocity 65 SP, cycle time held at 4.1 days under the 4.5 day baseline.",
        "tagline": "Recovery sprint. Fabric migration shipped, every mar carryover closed, velocity 65 SP.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "improving"},
        "throughputPerWeek": {"weekOne": 10, "weekTwo": 12, "priorAverage": 9},
        "tickets": tickets,
    }


def may_2026() -> dict[str, Any]:
    created = "2026-04-26"
    eta = "2026-05-30"
    tickets = [
        ticket("DE-2401", "CX OKR quarterly refresh: new business KPI tiles", "development", "eng-1", "done", "P1", 5, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2402", "CX OKR quarterly refresh: per-product breakdown tabs", "development", "eng-1", "done", "P1", 5, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2403", "CX OKR readout PDF template swap", "enhancement", "eng-5", "done", "P2", 2, ["cx-okr", "figma"], created_at=created, eta=eta),
        ticket("DE-2404", "Sales Rep QBR redesign v2: new cohort retention API", "development", "eng-2", "done", "P1", 8, ["revops-qbr", "databricks"], created_at=created, eta=eta),
        ticket("DE-2405", "Sales Rep QBR redesign v2: cohort retention chart", "development", "eng-1", "in-review", "P1", 5, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2406", "Sales Rep QBR redesign v2: funnel chart redesign", "development", "eng-3", "in-progress", "P1", 5, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2407", "Sales Rep QBR redesign v2: funnel chart backend rollup", "development", "eng-2", "in-review", "P1", 5, ["revops-qbr", "databricks"], created_at=created, eta=eta),
        ticket("DE-2408", "Bulk export CSV on the RevOps analytics gallery", "development", "eng-4", "in-progress", "P2", 5, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2409", "Snowflake to Databricks workspace migration discovery doc", "development", "eng-8", "todo", "P2", 3, ["databricks", "docs"], created_at=created, eta=eta),
        ticket("DE-2410", "Genie Space embed shell for the Balanced Scorecard", "development", "eng-3", "done", "P2", 5, ["genie-space", "balanced-scorecard"], created_at=created, eta=eta),
        ticket("DE-2411", "Genie Space embed rows for the Balanced Scorecard", "development", "eng-6", "in-review", "P2", 3, ["genie-space", "balanced-scorecard"], created_at=created, eta=eta),
        ticket("DE-2412", "CX OKR PDF font fallback regression on Windows", "bug", "eng-6", "done", "P2", 2, ["cx-okr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2413", "Workbook switcher keyboard navigation fix on Tableau Server", "bug", "eng-3", "done", "P2", 1, ["tableau-server"], created_at=created, eta=eta),
        ticket("DE-2414", "Balanced Scorecard Genie Space accessibility audit", "enhancement", "eng-8", "blocked", "P2", 2, ["genie-space", "balanced-scorecard"], created_at=created, eta=eta, blocker_note="Waiting on the Figma design tokens refresh from eng-6 by friday."),
        ticket("DE-2415", "Sales Rep QBR funnel chart accessibility audit", "enhancement", "eng-8", "todo", "P2", 2, ["revops-qbr", "figma"], created_at=created, eta=eta),
        ticket("DE-2416", "Jira SSOT onboarding empty state copy refresh", "enhancement", "eng-5", "in-review", "P3", 2, ["jira-ssot", "figma"], created_at=created, eta=eta),
        ticket("DE-2417", "Jira SSOT onboarding video transcript file", "enhancement", "eng-5", "in-progress", "P3", 1, ["jira-ssot", "docs"], created_at=created, eta=eta),
        ticket("DE-2418", "Audit log search filter on the Tableau Server admin", "development", "eng-4", "in-progress", "P2", 3, ["tableau-server"], created_at=created, eta=eta),
        ticket("DE-2419", "Audit log retention dashboard polish", "enhancement", "eng-7", "todo", "P2", 2, ["tableau-server", "observability"], created_at=created, eta=None),
        ticket("DE-2420", "Promote Sales Rep QBR redesign v2 to staging", "deployment", "eng-7", "todo", "P1", 2, ["revops-qbr", "tableau-server"], created_at=created, eta=eta),
        ticket("DE-2421", "Promote CX OKR quarterly refresh to staging", "deployment", "eng-7", "todo", "P1", 2, ["cx-okr", "tableau-server"], created_at=created, eta=eta),
        ticket("DE-2422", "Promote Balanced Scorecard Genie Space embed to staging", "deployment", "eng-7", "todo", "P2", 2, ["genie-space", "balanced-scorecard"], created_at=created, eta=eta),
        ticket("DE-2423", "Sentry alert rules tune for the Sales Rep QBR rollout", "enhancement", "eng-8", "todo", "P2", 2, ["revops-qbr", "observability"], created_at=created, eta=eta),
        ticket("DE-2424", "Investigate flaky e2e on the Tableau Server workbook switcher", "bug", "eng-3", "in-progress", "P2", 3, ["tableau-server", "ci"], created_at=created, eta=eta),
        ticket("DE-2425", "P2 maintenance batch one of two: stale CFD view cleanup", "enhancement", "eng-6", "in-progress", "P2", 3, ["cfd", "tableau"], created_at=created, eta=eta),
        ticket("DE-2426", "P2 maintenance batch two of two: Supply Chain backlog burndown", "enhancement", "eng-6", "todo", "P2", 3, ["supply-chain", "tableau"], created_at=created, eta=None),
    ]
    return {
        "id": "may-2026",
        "name": "May 2026 Sprint",
        "goal": "Ship the CX OKR quarterly refresh and the Sales Rep QBR redesign v2. Land the Genie Space embed for the Balanced Scorecard. Hold cycle time at the four day mark.",
        "startDate": "2026-05-01",
        "endDate": "2026-05-31",
        "status": "in-progress",
        "scopePlanned": 26,
        "currentDay": 17,
        "fourSprintBaseline": 59,
        "summary": "Currently in flight. Day 17 of 31. CX OKR quarterly refresh shipped, Sales Rep QBR redesign v2 in review, Balanced Scorecard Genie Space embed in flight. One blocker on the cohort retention accessibility audit, unblocked friday. Velocity tracking on baseline.",
        "tagline": "In flight. Day 17 of 31. Sales Rep QBR redesign in review, 1 blocker on a11y audit.",
        "cycleTime": {"teamBaseline": 4.0, "trend": "flat"},
        "throughputPerWeek": {"weekOne": 7, "weekTwo": 9, "priorAverage": 9},
        "tickets": tickets,
    }


def jun_2026() -> dict[str, Any]:
    """Backlog sprint: tickets the manager has earmarked for next cycle.

    All tickets at todo. Some carry eta within Jun window, some null
    (manager has not committed an eta yet). No burndown, no velocity.
    """
    created = "2026-05-15"
    eta = "2026-06-29"
    tickets = [
        ticket("DE-2501", "Pulse v2 unified semantic layer: NAI / NC2 / NCI schema reconcile", "development", "eng-2", "todo", "P0", 8, ["pulse-nai", "pulse-nc2", "pulse-nci"], created_at=created, eta=eta),
        ticket("DE-2502", "Pulse v2 unified semantic layer: shared Gold mart definition", "development", "eng-2", "todo", "P0", 5, ["pulse-nai", "databricks"], created_at=created, eta=eta),
        ticket("DE-2503", "Pulse v2 unified executive dashboard shell", "development", "eng-1", "todo", "P1", 5, ["pulse-nai", "tableau"], created_at=created, eta=eta),
        ticket("DE-2504", "Pulse v2 unified executive dashboard tiles", "development", "eng-1", "todo", "P1", 5, ["pulse-nai", "tableau"], created_at=created, eta=eta),
        ticket("DE-2505", "Genie Space adoption pack for RevOps ACV Weekly", "development", "eng-4", "todo", "P1", 8, ["genie-space", "revops-acv"], created_at=created, eta=None),
        ticket("DE-2506", "Genie Space adoption pack for RevOps Sales QBR", "development", "eng-4", "todo", "P1", 5, ["genie-space", "revops-qbr"], created_at=created, eta=None),
        ticket("DE-2507", "Genie Space starter board for the Balanced Scorecard", "development", "eng-3", "todo", "P2", 5, ["genie-space", "balanced-scorecard"], created_at=created, eta=None),
        ticket("DE-2508", "Tableau Server 2024.3 upgrade plan doc", "enhancement", "eng-8", "todo", "P1", 3, ["tableau-server", "docs"], created_at=created, eta=eta),
        ticket("DE-2509", "Tableau Server 2024.3 upgrade staging pass", "development", "eng-8", "todo", "P1", 5, ["tableau-server"], created_at=created, eta=eta),
        ticket("DE-2510", "dbt model coverage for the CFD dashboard backend", "development", "eng-2", "todo", "P2", 5, ["dbt", "cfd"], created_at=created, eta=None),
        ticket("DE-2511", "Promote Pulse v2 unified mart to staging", "deployment", "eng-7", "todo", "P0", 2, ["pulse-nai", "databricks"], created_at=created, eta=eta),
        ticket("DE-2512", "Promote Tableau Server upgrade to staging", "deployment", "eng-7", "todo", "P1", 2, ["tableau-server"], created_at=created, eta=eta),
        ticket("DE-2513", "Figma design tokens refresh for executive readouts", "enhancement", "eng-5", "todo", "P2", 3, ["figma", "tableau"], created_at=created, eta=None),
        ticket("DE-2514", "Bug sweep on the Sales Rep QBR redesign post may rollout", "bug", "eng-6", "todo", "P2", 3, ["revops-qbr", "tableau"], created_at=created, eta=eta),
        ticket("DE-2515", "P2 maintenance batch: stale NCI Pulse views cleanup", "enhancement", "eng-6", "todo", "P3", 3, ["pulse-nci", "tableau"], created_at=created, eta=eta),
        ticket("DE-2516", "Investigate Lighthouse perf drift on the Jira SSOT data portal", "bug", "eng-8", "todo", "P2", 2, ["jira-ssot", "perf"], created_at=created, eta=None),
    ]
    return {
        "id": "jun-2026",
        "name": "Jun 2026 Sprint",
        "goal": "Backlog allocation for next cycle. Pulse v2 unified semantic layer, Genie Space adoption across RevOps, and the Tableau Server 2024.3 upgrade.",
        "startDate": "2026-06-01",
        "endDate": "2026-06-30",
        "status": "planned",
        "scopePlanned": 16,
        "currentDay": None,
        "fourSprintBaseline": 59,
        "summary": "Backlog sprint. Manager has earmarked sixteen tickets across Pulse v2 (unified NAI / NC2 / NCI semantic layer), Genie Space adoption (ACV Weekly plus Sales QBR plus Balanced Scorecard), and the Tableau Server 2024.3 upgrade. Some etas committed, some open. Work has not started.",
        "tagline": "Backlog. 16 tickets earmarked across Pulse v2, Genie Space, Tableau upgrade.",
        "cycleTime": {"teamBaseline": 4.0, "trend": "flat"},
        "throughputPerWeek": {"weekOne": 0, "weekTwo": 0, "priorAverage": 9},
        "tickets": tickets,
    }


SPECS = [jan_2026(), feb_2026(), mar_2026(), apr_2026(), may_2026(), jun_2026()]


def main() -> None:
    summaries = []
    for spec in SPECS:
        fixture = build_fixture(spec)
        out = SPRINT_DIR / f"{spec['id']}.json"
        out.write_text(json.dumps(fixture, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {out.relative_to(REPO)}")
        closed = sum(1 for t in spec["tickets"] if t["status"] == "done")
        sp_completed = sum(t["estimate"] for t in spec["tickets"] if t["status"] == "done")
        sp_total = sum(t["estimate"] for t in spec["tickets"])
        summaries.append(
            {
                "id": spec["id"],
                "name": spec["name"],
                "monthLabel": spec["name"].replace(" Sprint", ""),
                "tagline": spec["tagline"],
                "goal": spec["goal"],
                "startDate": spec["startDate"],
                "endDate": spec["endDate"],
                "status": spec["status"],
                "ticketCount": len(spec["tickets"]),
                "closedCount": closed,
                "openCount": len(spec["tickets"]) - closed,
                "spCompleted": sp_completed,
                "spTotal": sp_total,
            }
        )

    manifest = {
        "version": "3.0.0",
        "generatedAt": "2026-05-17",
        "team": TEAM,
        "totalCapacity": TOTAL_CAPACITY,
        "sprints": summaries,
    }
    (SPRINT_DIR / "index.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(f"wrote {(SPRINT_DIR / 'index.json').relative_to(REPO)}")


if __name__ == "__main__":
    main()
