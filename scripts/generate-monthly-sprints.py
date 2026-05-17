"""Generate the 6 monthly sprint fixtures plus the index manifest.

Each sprint is hand authored at the ticket spec level (id, title, type,
assignee, status, priority, estimate, labels, mid sprint flag, optional
blocker note, optional ETA override). The script computes the rest
(burndown arrays, velocity, throughput, per engineer cycle time) so that
the derived KPIs stay consistent with the ticket data.

Sprints span calendar months. Jan-Apr 2026 are completed. May 2026 is
in flight (today 2026-05-17, day 17 of 31). Jun 2026 is the backlog,
all tickets at todo, manager allocated.
"""

from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[1]
SPRINT_DIR = REPO / "fixtures" / "sprint-intelligence" / "sprints"
SPRINT_DIR.mkdir(parents=True, exist_ok=True)

TEAM = [
    {"id": "eng-1", "name": "Alex Chen", "role": "Senior Engineer", "capacity": 13},
    {"id": "eng-2", "name": "Priya Sharma", "role": "Senior Engineer", "capacity": 13},
    {"id": "eng-3", "name": "Marcus Johnson", "role": "Engineer", "capacity": 10},
    {"id": "eng-4", "name": "Sophia Rodriguez", "role": "Engineer", "capacity": 10},
    {"id": "eng-5", "name": "Kai Tanaka", "role": "Junior Engineer", "capacity": 7},
    {"id": "eng-6", "name": "Emma Williams", "role": "Engineer", "capacity": 10},
    {"id": "eng-7", "name": "Liam Sullivan", "role": "Engineering Manager", "capacity": 5},
    {"id": "eng-8", "name": "Zara Khan", "role": "Senior Engineer", "capacity": 13},
]
TOTAL_CAPACITY = sum(m["capacity"] for m in TEAM)


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
    """Build one ticket dict matching the TicketSpec shape."""
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
    """Linear ideal burndown from total_sp at day 0 to 0 at the last day."""
    if day_count <= 1:
        return [total_sp, 0]
    step = total_sp / (day_count - 1)
    return [round(total_sp - step * i) for i in range(day_count)]


def actual_burndown_completed(
    total_sp: int, day_count: int, ending_sp: int, beat_baseline: bool
) -> list[int | None]:
    """Hand shaped curve for completed sprints.

    beat_baseline=True bows the curve below ideal (healthy week two close).
    beat_baseline=False bows above ideal (carryover, blocked, scope creep).
    """
    if day_count <= 1:
        return [total_sp, ending_sp]
    points: list[int | None] = []
    for i in range(day_count):
        progress = i / (day_count - 1)
        if beat_baseline:
            # Slight bow below the line: faster than ideal in week two
            shape = progress ** 1.3
        else:
            # Slight bow above the line: scope add or blockers slow it
            shape = progress ** 0.75
        sp = round(total_sp - (total_sp - ending_sp) * shape)
        points.append(sp)
    return points


def actual_burndown_inflight(
    total_sp: int, day_count: int, current_day: int, current_sp: int
) -> list[int | None]:
    """Partial curve up to current_day, None for future days."""
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
    """Hand shaped per day cycle time curve for completed sprints."""
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
    """Each engineer gets a personalCycleTime hand jittered around the baseline.

    For deterministic output we seed off the engineer id and the count
    of done tickets they own.
    """
    out: dict[str, dict[str, float]] = {}
    for m in TEAM:
        done = [t for t in tickets if t["assignee"] == m["id"] and t["status"] == "done"]
        if not done:
            personal = team_baseline + 1.0
        else:
            # Junior trails a touch, senior leads
            role_bias = {
                "Senior Engineer": -0.5,
                "Engineer": 0.0,
                "Junior Engineer": 1.0,
                "Engineering Manager": 0.3,
            }.get(m["role"], 0.0)
            personal = team_baseline + role_bias
        out[m["id"]] = {"personalCycleTime": round(personal, 1)}
    return out


def build_fixture(spec: dict[str, Any]) -> dict[str, Any]:
    start = date.fromisoformat(spec["startDate"])
    end = date.fromisoformat(spec["endDate"])
    day_count = days_in_month(start, end)
    tickets = spec["tickets"]
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
            total_sp,
            day_count,
            current_day=spec["currentDay"],
            current_sp=open_sp,
        )
        cycle_days = cycle_time_inflight(
            spec["cycleTime"]["teamBaseline"],
            spec["cycleTime"]["trend"],
            day_count,
            spec["currentDay"],
        )
    else:
        # Planned sprint: nothing has happened yet.
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
# Sprint specs. Each ticket entry is a hand authored tuple.
# Ticket id ranges keep each sprint visually distinct.
# Ticket types: bug, development, enhancement, deployment.
# ============================================================


def jan_2026() -> dict[str, Any]:
    created = "2025-12-22"
    eta = "2026-01-30"
    tickets = [
        ticket("ENG-2001", "Dashboard hero redesign with KPI strip", "development", "eng-1", "done", "P1", 5, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2002", "Filter bar refactor with multi select", "development", "eng-1", "done", "P1", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2003", "Magic link signup auth flow", "development", "eng-2", "done", "P1", 8, ["backend", "auth"], created_at=created, eta=eta),
        ticket("ENG-2004", "Magic link email template copy review", "enhancement", "eng-6", "done", "P2", 3, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2005", "Magic link rate limiting plus abuse guard", "development", "eng-2", "done", "P1", 3, ["backend", "security"], created_at=created, eta=eta),
        ticket("ENG-2006", "Chart legend overflow on narrow viewports", "bug", "eng-3", "done", "P2", 2, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2007", "Search index spike for v2 filters", "development", "eng-4", "done", "P2", 3, ["backend", "search"], created_at=created, eta=eta),
        ticket("ENG-2008", "Cohort retention chart on the dashboard", "development", "eng-1", "done", "P1", 5, ["frontend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2009", "Bulk export CSV regression on the gallery", "bug", "eng-3", "done", "P2", 2, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2010", "Light mode contrast audit fixes", "enhancement", "eng-6", "done", "P2", 3, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2011", "Auth session refresh edge case patch", "bug", "eng-2", "done", "P1", 2, ["backend", "auth"], created_at=created, eta=eta),
        ticket("ENG-2012", "Notifications panel pagination", "development", "eng-4", "done", "P2", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2013", "Promote auth migration to staging", "deployment", "eng-7", "done", "P2", 2, ["devops", "auth"], created_at=created, eta=eta),
        ticket("ENG-2014", "Vercel edge config sync job", "deployment", "eng-7", "done", "P2", 3, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2015", "Reduce home page bundle by 8 kB", "enhancement", "eng-8", "done", "P2", 3, ["frontend", "perf"], created_at=created, eta=eta),
        ticket("ENG-2016", "Empty state copy refresh on /workspace", "enhancement", "eng-5", "done", "P3", 2, ["frontend", "copy"], created_at=created, eta=eta),
        ticket("ENG-2017", "Lighthouse SEO regression on /report", "bug", "eng-8", "done", "P2", 2, ["frontend", "seo"], created_at=created, eta=eta),
        ticket("ENG-2018", "Cohort retention API endpoint", "development", "eng-2", "done", "P1", 5, ["backend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2019", "P2 backlog burndown sweep one of two", "enhancement", "eng-6", "done", "P2", 3, ["maintenance"], created_at=created, eta=eta),
        ticket("ENG-2020", "P2 backlog burndown sweep two of two", "enhancement", "eng-6", "done", "P2", 3, ["maintenance"], created_at=created, eta=eta),
        ticket("ENG-2021", "Onboarding empty state copy refresh", "enhancement", "eng-5", "todo", "P3", 2, ["frontend", "design"], created_at=created, eta=None),
        ticket("ENG-2022", "Onboarding empty state illustration swap", "enhancement", "eng-5", "todo", "P3", 3, ["frontend", "design"], created_at=created, eta=None),
    ]
    return {
        "id": "jan-2026",
        "name": "Jan 2026 Sprint",
        "goal": "Ship the dashboard redesign and the magic link auth flow. Burn down the P2 backlog by ten tickets.",
        "startDate": "2026-01-01",
        "endDate": "2026-01-31",
        "status": "completed",
        "scopePlanned": 22,
        "currentDay": None,
        "fourSprintBaseline": 58,
        "summary": "Healthy sprint. Team hit the goal, velocity at 67 story points (well within capacity), only two tickets carried over. Cycle time and review bottleneck both improved versus the four sprint baseline.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "improving"},
        "throughputPerWeek": {"weekOne": 8, "weekTwo": 12, "priorAverage": 9},
        "tickets": tickets,
    }


def feb_2026() -> dict[str, Any]:
    created = "2026-01-25"
    eta = "2026-02-26"
    mid_eta = "2026-02-26"
    tickets = [
        ticket("ENG-2101", "Real time presence indicator", "development", "eng-1", "done", "P1", 8, ["frontend", "realtime"], created_at=created, eta=eta),
        ticket("ENG-2102", "Presence indicator websocket fallback", "development", "eng-2", "done", "P1", 5, ["backend", "realtime"], created_at=created, eta=eta),
        ticket("ENG-2103", "Analytics tracking on new dashboard widgets", "development", "eng-4", "done", "P2", 3, ["frontend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2104", "Quarterly billing rollup report", "development", "eng-8", "done", "P1", 5, ["backend", "billing"], created_at=created, eta=eta),
        ticket("ENG-2105", "Billing rollup CSV export", "development", "eng-8", "done", "P2", 3, ["backend", "billing"], created_at=created, eta=eta),
        ticket("ENG-2106", "Workspace switcher keyboard nav", "enhancement", "eng-3", "done", "P2", 2, ["frontend", "a11y"], created_at=created, eta=eta),
        ticket("ENG-2107", "Lighthouse perf regression on /reports", "bug", "eng-6", "done", "P2", 3, ["frontend", "perf"], created_at=created, eta=eta),
        ticket("ENG-2108", "Onboarding empty state illustrations", "enhancement", "eng-5", "done", "P3", 3, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2109", "Onboarding empty state copy refresh", "enhancement", "eng-5", "done", "P3", 2, ["frontend", "copy"], created_at=created, eta=eta),
        ticket("ENG-2110", "Notifications mark all as read", "development", "eng-4", "done", "P2", 3, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2111", "Push presence service to staging", "deployment", "eng-7", "done", "P2", 2, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2112", "Promote billing rollup to staging", "deployment", "eng-7", "done", "P2", 2, ["devops", "billing"], created_at=created, eta=eta),
        # Mid sprint scope creep: customer escalation introduces 6 P0/P1 tickets
        ticket("ENG-2113", "Customer escalation: workspace data leak on cross account share", "bug", "eng-2", "done", "P0", 5, ["backend", "security"], created_at="2026-02-09", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2114", "Audit log of cross account share events", "development", "eng-2", "done", "P0", 5, ["backend", "security"], created_at="2026-02-10", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2115", "Customer escalation: billing rollup wrong tax line", "bug", "eng-8", "done", "P1", 3, ["backend", "billing"], created_at="2026-02-10", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2116", "Billing rollup retroactive recalculation", "development", "eng-8", "done", "P1", 5, ["backend", "billing"], created_at="2026-02-11", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2117", "Customer escalation: presence indicator stuck on logout", "bug", "eng-1", "done", "P1", 3, ["frontend", "realtime"], created_at="2026-02-12", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2118", "Presence service incident postmortem", "enhancement", "eng-7", "done", "P1", 2, ["docs"], created_at="2026-02-12", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2119", "Search ranking improvements v2", "enhancement", "eng-3", "in-review", "P2", 3, ["backend", "search"], created_at=created, eta=eta),
        ticket("ENG-2120", "Workspace template gallery shell", "development", "eng-1", "done", "P2", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2121", "Workspace template gallery cards", "development", "eng-3", "in-review", "P2", 3, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2122", "Resolve presence websocket flake in CI", "bug", "eng-2", "done", "P2", 2, ["ci", "realtime"], created_at=created, eta=eta),
        ticket("ENG-2123", "Update onboarding video thumbnails", "enhancement", "eng-5", "done", "P3", 1, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2124", "Bulk delete confirm dialog rewrite", "enhancement", "eng-6", "done", "P2", 3, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2125", "Notification preference toggles backend", "development", "eng-4", "in-review", "P2", 5, ["backend"], created_at=created, eta=eta),
        ticket("ENG-2126", "Promote audit log to prod", "deployment", "eng-7", "done", "P0", 2, ["devops", "security"], created_at="2026-02-11", eta=mid_eta, added_mid_sprint=True),
        ticket("ENG-2127", "Audit log retention policy doc", "enhancement", "eng-7", "todo", "P2", 1, ["docs"], created_at=created, eta=None),
        ticket("ENG-2128", "Investigate Lighthouse SEO drop on /report", "enhancement", "eng-8", "todo", "P3", 2, ["frontend", "seo"], created_at=created, eta=None),
    ]
    return {
        "id": "feb-2026",
        "name": "Feb 2026 Sprint",
        "goal": "Ship the real time presence indicator and the quarterly billing rollup. Hold cycle time inside the 4.5 day baseline.",
        "startDate": "2026-02-01",
        "endDate": "2026-02-28",
        "status": "completed",
        "scopePlanned": 22,
        "currentDay": None,
        "fourSprintBaseline": 62,
        "summary": "Scope creep. A customer escalation on day nine added six P0 and P1 tickets mid sprint. The team absorbed the load and still closed the original scope but velocity finished six points under capacity and three tickets carried over.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "rising"},
        "throughputPerWeek": {"weekOne": 9, "weekTwo": 10, "priorAverage": 9},
        "tickets": tickets,
    }


def mar_2026() -> dict[str, Any]:
    created = "2026-02-22"
    eta = "2026-03-30"
    tickets = [
        ticket("ENG-2201", "Auth migration: cutover schema for v2 sessions", "development", "eng-2", "blocked", "P0", 8, ["backend", "auth"], created_at=created, eta=eta, blocker_note="Migration script needs database team sign off, blocked since day 4. Owner: eng-2, manager escalation in progress."),
        ticket("ENG-2202", "Auth migration: dual write to old and new tables", "development", "eng-2", "blocked", "P0", 5, ["backend", "auth"], created_at=created, eta=eta, blocker_note="Depends on ENG-2201 cutover. Currently parked."),
        ticket("ENG-2203", "Auth migration: dual read fallback in API", "development", "eng-8", "blocked", "P0", 5, ["backend", "auth"], created_at=created, eta=eta, blocker_note="Depends on ENG-2201 cutover. Currently parked."),
        ticket("ENG-2204", "Workspace template gallery polish", "development", "eng-1", "done", "P1", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2205", "Workspace template card hover states", "enhancement", "eng-3", "done", "P2", 2, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2206", "Workspace template card bug: bad accent on dark", "bug", "eng-3", "done", "P2", 1, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2207", "Search ranking improvements v2 ship", "development", "eng-4", "done", "P1", 5, ["backend", "search"], created_at=created, eta=eta),
        ticket("ENG-2208", "Notification preference toggles UI", "development", "eng-6", "done", "P2", 3, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2209", "Notification preference toggles wiring to backend", "development", "eng-4", "done", "P2", 3, ["frontend", "backend"], created_at=created, eta=eta),
        ticket("ENG-2210", "Lighthouse SEO regression on /report fix", "bug", "eng-8", "blocked", "P2", 3, ["frontend", "seo"], created_at=created, eta=eta, blocker_note="Owner pulled to auth migration cleanup. Carrying to apr."),
        ticket("ENG-2211", "PDF export drops trailing newline", "bug", "eng-6", "done", "P2", 2, ["frontend", "pdf"], created_at=created, eta=eta),
        ticket("ENG-2212", "Audit log retention policy doc finalise", "enhancement", "eng-7", "done", "P2", 1, ["docs"], created_at=created, eta=eta),
        ticket("ENG-2213", "Sentry alert rules tune for noisy frontend", "enhancement", "eng-8", "blocked", "P2", 2, ["observability"], created_at=created, eta=eta, blocker_note="Owner pulled to auth migration. Carrying."),
        ticket("ENG-2214", "P2 backlog burndown one of two", "enhancement", "eng-6", "done", "P2", 3, ["maintenance"], created_at=created, eta=eta),
        ticket("ENG-2215", "P2 backlog burndown two of two", "enhancement", "eng-6", "done", "P2", 3, ["maintenance"], created_at=created, eta=eta),
        ticket("ENG-2216", "Promote search v2 to prod", "deployment", "eng-7", "done", "P1", 2, ["devops", "search"], created_at=created, eta=eta),
        ticket("ENG-2217", "Promote workspace templates to prod", "deployment", "eng-7", "done", "P1", 2, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2218", "Notifications backend perf cleanup", "enhancement", "eng-4", "in-review", "P2", 3, ["backend", "perf"], created_at=created, eta=eta),
        ticket("ENG-2219", "Bulk archive confirm dialog rewrite", "enhancement", "eng-5", "done", "P3", 2, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2220", "Onboarding video step three swap", "enhancement", "eng-5", "done", "P3", 2, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2221", "Empty state copy on /reports zero state", "enhancement", "eng-5", "done", "P3", 1, ["frontend", "copy"], created_at=created, eta=eta),
        ticket("ENG-2222", "Investigate slow gallery render at 1000 items", "development", "eng-1", "in-review", "P2", 3, ["frontend", "perf"], created_at=created, eta=eta),
        ticket("ENG-2223", "Add presence service to staging cron warmup", "deployment", "eng-7", "done", "P2", 2, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2224", "Auth migration: rollback plan doc", "enhancement", "eng-2", "todo", "P0", 2, ["docs", "auth"], created_at=created, eta=None),
    ]
    return {
        "id": "mar-2026",
        "name": "Mar 2026 Sprint",
        "goal": "Cut over auth to the v2 session table. Ship workspace templates and search v2.",
        "startDate": "2026-03-01",
        "endDate": "2026-03-31",
        "status": "completed",
        "scopePlanned": 24,
        "currentDay": None,
        "fourSprintBaseline": 62,
        "summary": "Blocked sprint. Auth migration stalled on day four waiting on a database team sign off, three engineers idled on the dependency. Workspace templates and search v2 shipped on plan but auth carries cleanly into apr. Velocity 46 SP, the lowest of the four trailing sprints.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "rising"},
        "throughputPerWeek": {"weekOne": 6, "weekTwo": 9, "priorAverage": 9},
        "tickets": tickets,
    }


def apr_2026() -> dict[str, Any]:
    created = "2026-03-25"
    eta = "2026-04-29"
    tickets = [
        ticket("ENG-2301", "Auth migration: cutover schema for v2 sessions", "development", "eng-2", "done", "P0", 8, ["backend", "auth"], created_at=created, eta=eta),
        ticket("ENG-2302", "Auth migration: dual write to old and new tables", "development", "eng-2", "done", "P0", 5, ["backend", "auth"], created_at=created, eta=eta),
        ticket("ENG-2303", "Auth migration: dual read fallback in API", "development", "eng-8", "done", "P0", 5, ["backend", "auth"], created_at=created, eta=eta),
        ticket("ENG-2304", "Auth migration: rollback plan doc", "enhancement", "eng-2", "done", "P0", 2, ["docs", "auth"], created_at=created, eta=eta),
        ticket("ENG-2305", "Promote auth v2 to staging", "deployment", "eng-7", "done", "P0", 2, ["devops", "auth"], created_at=created, eta=eta),
        ticket("ENG-2306", "Promote auth v2 to prod", "deployment", "eng-7", "done", "P0", 2, ["devops", "auth"], created_at=created, eta=eta),
        ticket("ENG-2307", "Decommission old session table", "deployment", "eng-7", "done", "P1", 1, ["devops", "auth"], created_at=created, eta=eta),
        ticket("ENG-2308", "Lighthouse SEO regression on /report fix", "bug", "eng-8", "done", "P2", 3, ["frontend", "seo"], created_at=created, eta=eta),
        ticket("ENG-2309", "Sentry alert rules tune for noisy frontend", "enhancement", "eng-8", "done", "P2", 2, ["observability"], created_at=created, eta=eta),
        ticket("ENG-2310", "Notifications backend perf cleanup ship", "enhancement", "eng-4", "done", "P2", 3, ["backend", "perf"], created_at=created, eta=eta),
        ticket("ENG-2311", "Slow gallery render fix at 1000 items", "development", "eng-1", "done", "P2", 3, ["frontend", "perf"], created_at=created, eta=eta),
        ticket("ENG-2312", "Workspace template create flow", "development", "eng-3", "done", "P1", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2313", "Workspace template delete flow", "development", "eng-3", "done", "P1", 3, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2314", "Bulk move workspace items", "development", "eng-4", "done", "P2", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2315", "Bulk move backend wiring", "development", "eng-4", "done", "P2", 3, ["backend"], created_at=created, eta=eta),
        ticket("ENG-2316", "Update onboarding step copy", "enhancement", "eng-5", "done", "P3", 2, ["frontend", "copy"], created_at=created, eta=eta),
        ticket("ENG-2317", "Onboarding step illustrations refresh", "enhancement", "eng-5", "done", "P3", 3, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2318", "Audit log retention metric dashboard", "enhancement", "eng-6", "done", "P2", 3, ["observability"], created_at=created, eta=eta),
        ticket("ENG-2319", "Promote audit dashboard to prod", "deployment", "eng-7", "done", "P2", 1, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2320", "PDF export header refresh", "enhancement", "eng-6", "done", "P3", 2, ["frontend", "pdf"], created_at=created, eta=eta),
        ticket("ENG-2321", "Empty state on /search zero matches", "enhancement", "eng-5", "done", "P3", 1, ["frontend", "copy"], created_at=created, eta=eta),
        ticket("ENG-2322", "Lighthouse SEO sweep across /reports family", "enhancement", "eng-8", "done", "P2", 2, ["frontend", "seo"], created_at=created, eta=eta),
    ]
    return {
        "id": "apr-2026",
        "name": "Apr 2026 Sprint",
        "goal": "Close out the auth migration cleanly. Burn down the carryover from mar. Ship the workspace template create plus delete flows.",
        "startDate": "2026-04-01",
        "endDate": "2026-04-30",
        "status": "completed",
        "scopePlanned": 22,
        "currentDay": None,
        "fourSprintBaseline": 58,
        "summary": "Recovery sprint. Auth migration shipped end to end with rollback plan filed. Every mar carryover closed. Workspace template create plus delete shipped on plan. Velocity 65 SP, cycle time held at 4.1 days against a 4.5 day baseline.",
        "cycleTime": {"teamBaseline": 4.5, "trend": "improving"},
        "throughputPerWeek": {"weekOne": 10, "weekTwo": 12, "priorAverage": 9},
        "tickets": tickets,
    }


def may_2026() -> dict[str, Any]:
    created = "2026-04-26"
    eta = "2026-05-30"
    tickets = [
        ticket("ENG-2401", "Onboarding redesign hero refresh", "development", "eng-1", "done", "P1", 5, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2402", "Onboarding step strip new component", "development", "eng-1", "done", "P1", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2403", "Onboarding step three video swap", "enhancement", "eng-5", "done", "P2", 2, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2404", "Analytics revamp: new cohort retention API", "development", "eng-2", "done", "P1", 8, ["backend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2405", "Analytics revamp: cohort retention chart", "development", "eng-1", "in-review", "P1", 5, ["frontend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2406", "Analytics revamp: funnel chart redesign", "development", "eng-3", "in-progress", "P1", 5, ["frontend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2407", "Analytics revamp: funnel chart backend API", "development", "eng-2", "in-review", "P1", 5, ["backend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2408", "Bulk export CSV on the analytics gallery", "development", "eng-4", "in-progress", "P2", 5, ["frontend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2409", "Search index v3 spike", "development", "eng-8", "todo", "P2", 3, ["backend", "search"], created_at=created, eta=eta),
        ticket("ENG-2410", "Notifications inbox redesign shell", "development", "eng-3", "done", "P2", 5, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2411", "Notifications inbox redesign rows", "development", "eng-6", "in-review", "P2", 3, ["frontend"], created_at=created, eta=eta),
        ticket("ENG-2412", "PDF export font fallback regression", "bug", "eng-6", "done", "P2", 2, ["frontend", "pdf"], created_at=created, eta=eta),
        ticket("ENG-2413", "Workspace switcher keyboard nav fix", "bug", "eng-3", "done", "P2", 1, ["frontend", "a11y"], created_at=created, eta=eta),
        ticket("ENG-2414", "Cohort retention chart accessibility audit", "enhancement", "eng-8", "blocked", "P2", 2, ["frontend", "a11y"], created_at=created, eta=eta, blocker_note="Waiting on design tokens refresh from eng-6 by friday."),
        ticket("ENG-2415", "Funnel chart accessibility audit", "enhancement", "eng-8", "todo", "P2", 2, ["frontend", "a11y"], created_at=created, eta=eta),
        ticket("ENG-2416", "Onboarding empty state copy refresh", "enhancement", "eng-5", "in-review", "P3", 2, ["frontend", "copy"], created_at=created, eta=eta),
        ticket("ENG-2417", "Onboarding video transcript file", "enhancement", "eng-5", "in-progress", "P3", 1, ["copy"], created_at=created, eta=eta),
        ticket("ENG-2418", "Audit log search filter", "development", "eng-4", "in-progress", "P2", 3, ["backend"], created_at=created, eta=eta),
        ticket("ENG-2419", "Audit log retention dashboard polish", "enhancement", "eng-7", "todo", "P2", 2, ["observability"], created_at=created, eta=None),
        ticket("ENG-2420", "Promote analytics revamp to staging", "deployment", "eng-7", "todo", "P1", 2, ["devops", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2421", "Promote onboarding redesign to staging", "deployment", "eng-7", "todo", "P1", 2, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2422", "Promote notifications inbox to staging", "deployment", "eng-7", "todo", "P2", 2, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2423", "Sentry alert tune for analytics rollout", "enhancement", "eng-8", "todo", "P2", 2, ["observability"], created_at=created, eta=eta),
        ticket("ENG-2424", "Investigate flaky e2e on workspace switcher", "bug", "eng-3", "in-progress", "P2", 3, ["ci"], created_at=created, eta=eta),
        ticket("ENG-2425", "P2 backlog burndown one of two", "enhancement", "eng-6", "in-progress", "P2", 3, ["maintenance"], created_at=created, eta=eta),
        ticket("ENG-2426", "P2 backlog burndown two of two", "enhancement", "eng-6", "todo", "P2", 3, ["maintenance"], created_at=created, eta=None),
    ]
    return {
        "id": "may-2026",
        "name": "May 2026 Sprint",
        "goal": "Ship the onboarding redesign plus the analytics revamp. Hold cycle time at the four day mark.",
        "startDate": "2026-05-01",
        "endDate": "2026-05-31",
        "status": "in-progress",
        "scopePlanned": 26,
        "currentDay": 17,
        "fourSprintBaseline": 59,
        "summary": "Currently in flight. Day 17 of 31. Onboarding redesign shipped, analytics revamp in review, notifications inbox in flight. One blocker on the cohort retention a11y audit, unblocked friday. Velocity tracking on baseline.",
        "cycleTime": {"teamBaseline": 4.0, "trend": "flat"},
        "throughputPerWeek": {"weekOne": 7, "weekTwo": 9, "priorAverage": 9},
        "tickets": tickets,
    }


def jun_2026() -> dict[str, Any]:
    """Backlog sprint: tickets manager has allocated for next cycle.

    All tickets at todo. Some carry eta within Jun window, some null
    (manager has not committed an eta yet). No burndown, no velocity.
    """
    created = "2026-05-15"
    eta = "2026-06-29"
    tickets = [
        ticket("ENG-2501", "Payments v2: new pricing tier engine", "development", "eng-2", "todo", "P0", 8, ["backend", "billing"], created_at=created, eta=eta),
        ticket("ENG-2502", "Payments v2: usage metering ingest", "development", "eng-2", "todo", "P0", 5, ["backend", "billing"], created_at=created, eta=eta),
        ticket("ENG-2503", "Payments v2: invoice render template", "development", "eng-1", "todo", "P1", 5, ["frontend", "billing"], created_at=created, eta=eta),
        ticket("ENG-2504", "Payments v2: pricing page redesign", "development", "eng-1", "todo", "P1", 5, ["frontend", "design"], created_at=created, eta=eta),
        ticket("ENG-2505", "Mobile app v2: shell scaffold", "development", "eng-4", "todo", "P1", 8, ["mobile"], created_at=created, eta=None),
        ticket("ENG-2506", "Mobile app v2: auth flow port", "development", "eng-4", "todo", "P1", 5, ["mobile", "auth"], created_at=created, eta=None),
        ticket("ENG-2507", "Mobile app v2: dashboard read only", "development", "eng-3", "todo", "P2", 5, ["mobile"], created_at=created, eta=None),
        ticket("ENG-2508", "Telemetry pipeline: event schema doc", "enhancement", "eng-8", "todo", "P1", 3, ["docs", "observability"], created_at=created, eta=eta),
        ticket("ENG-2509", "Telemetry pipeline: producer SDK", "development", "eng-8", "todo", "P1", 5, ["backend", "observability"], created_at=created, eta=eta),
        ticket("ENG-2510", "Telemetry pipeline: consumer in BigQuery", "development", "eng-2", "todo", "P2", 5, ["backend", "observability"], created_at=created, eta=None),
        ticket("ENG-2511", "Promote payments v2 to staging", "deployment", "eng-7", "todo", "P0", 2, ["devops", "billing"], created_at=created, eta=eta),
        ticket("ENG-2512", "Promote telemetry producer to staging", "deployment", "eng-7", "todo", "P1", 2, ["devops"], created_at=created, eta=eta),
        ticket("ENG-2513", "Customer onboarding video v2 record", "enhancement", "eng-5", "todo", "P2", 3, ["copy", "design"], created_at=created, eta=None),
        ticket("ENG-2514", "Bug sweep on the analytics revamp post may", "bug", "eng-6", "todo", "P2", 3, ["frontend", "analytics"], created_at=created, eta=eta),
        ticket("ENG-2515", "P2 backlog burndown one of one", "enhancement", "eng-6", "todo", "P3", 3, ["maintenance"], created_at=created, eta=eta),
        ticket("ENG-2516", "Investigate Lighthouse perf drift on /home", "bug", "eng-8", "todo", "P2", 2, ["frontend", "perf"], created_at=created, eta=None),
    ]
    # Future sprint has no burndown / velocity / throughput at this point.
    # We still emit the fixture but with empty / zero arrays.
    return {
        "id": "jun-2026",
        "name": "Jun 2026 Sprint",
        "goal": "Backlog allocation for next cycle. Payments v2, mobile app v2 scaffold, and the telemetry pipeline groundwork.",
        "startDate": "2026-06-01",
        "endDate": "2026-06-30",
        "status": "planned",
        "scopePlanned": 16,
        "currentDay": None,
        "fourSprintBaseline": 59,
        "summary": "Backlog sprint. Manager has earmarked sixteen tickets across payments v2, mobile app v2 scaffold, and the telemetry pipeline groundwork. Some etas committed, some open. Work has not started.",
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
                "tagline": spec["summary"].split(". ")[0] + ".",
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
        "version": "2.0.0",
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
