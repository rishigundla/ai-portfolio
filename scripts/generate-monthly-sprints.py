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
from datetime import date, timedelta
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


def _hash_bytes(sprint_id: str, ticket_id: str, salt: str) -> bytes:
    return hashlib.md5(f"{sprint_id}:{ticket_id}:{salt}".encode()).digest()


def _hash_float(sprint_id: str, ticket_id: str, salt: str, idx: int = 0) -> float:
    """Return a deterministic float in [0, 1) for this (ticket, salt, idx)."""
    digest = _hash_bytes(sprint_id, ticket_id, salt)
    return digest[idx % len(digest)] / 255.0


def _is_weekend(sprint_start_iso: str, sprint_day: int) -> bool:
    """Day 1 == sprint_start. Saturday or Sunday is a weekend."""
    start = date.fromisoformat(sprint_start_iso)
    weekday = (start + timedelta(days=sprint_day - 1)).weekday()
    return weekday >= 5


def _next_weekday(sprint_start_iso: str, sprint_day: int, sprint_length: int) -> int:
    """Slide a candidate day forward to the next weekday inside the sprint."""
    day = sprint_day
    while day <= sprint_length and _is_weekend(sprint_start_iso, day):
        day += 1
    return day


PRIORITY_RANK = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}


def _sprint_weeks(sprint_start_iso: str, sprint_length: int) -> list[list[int]]:
    """Return list of weeks. Each week is the 1-indexed sprint days for its Mon-Fri block.

    Partial weeks at sprint boundaries still emitted with whatever weekdays they
    contain.
    """
    start = date.fromisoformat(sprint_start_iso)
    weeks: list[list[int]] = []
    current: list[int] = []
    for day in range(1, sprint_length + 1):
        weekday = (start + timedelta(days=day - 1)).weekday()
        if weekday < 5:
            current.append(day)
        if weekday == 4:
            if current:
                weeks.append(current)
                current = []
    if current:
        weeks.append(current)
    return weeks


def _engineer_profile(
    sprint_id: str, engineer_id: str, role: str
) -> dict[str, Any]:
    """Hash-deterministic cadence profile per (sprint, engineer).

    Gives every engineer a recognizably different heatmap pattern by varying
    pace, week shape, carryover habit, and meeting-day skips.
    """
    role_pace = {
        "Senior BI Engineer": 0.85,
        "Senior Data Engineer": 0.85,
        "Analytics Engineer": 0.95,
        "BI Engineer": 1.0,
        "Junior Analytics Engineer": 1.2,
        "Data Engineering Manager": 1.05,
    }.get(role, 1.0)
    pace_jitter = 0.85 + 0.3 * _hash_float(sprint_id, engineer_id, "pace")
    pace = role_pace * pace_jitter

    carryover_prob = 0.30 + 0.40 * _hash_float(sprint_id, engineer_id, "carryover")
    carryover_extra = 1 + int(_hash_float(sprint_id, engineer_id, "carryover-extra") * 2)
    side_ticket_prob = 0.35 * _hash_float(sprint_id, engineer_id, "side")

    shapes = ["front-loaded", "back-loaded", "steady"]
    shape_idx = int(_hash_float(sprint_id, engineer_id, "shape") * len(shapes))
    week_shape = shapes[min(shape_idx, len(shapes) - 1)]

    return {
        "pace": pace,
        "carryover_prob": carryover_prob,
        "carryover_extra": carryover_extra,
        "side_ticket_prob": side_ticket_prob,
        "week_shape": week_shape,
    }


def _meeting_skip_day(
    sprint_id: str, engineer_id: str, week_idx: int, week_days: list[int]
) -> int | None:
    """Per-week deterministic skip: maybe the engineer had a meeting-heavy day."""
    if len(week_days) < 4:
        return None
    skip_pct = _hash_float(sprint_id, engineer_id, f"skip-{week_idx}")
    if skip_pct > 0.7:
        # Pick a midweek day to skip
        idx = 1 + int(_hash_float(sprint_id, engineer_id, f"skip-pick-{week_idx}") * (len(week_days) - 2))
        return week_days[idx]
    return None


def _run_within_week(
    week_days: list[int],
    work_count: int,
    week_shape: str,
    skip_day: int | None,
    stagger: int = 0,
) -> list[int]:
    """Return up to work_count weekdays inside week_days, shaped by profile.

    stagger shifts the run start by N days so multiple tickets sharing a
    week do not stack on identical days (e.g., two P0 escalations landing
    the same week stagger by 1 day each).
    """
    available = [d for d in week_days if d != skip_day]
    work_count = min(work_count, max(1, len(available) - stagger))
    if work_count <= 0 or not available:
        return []
    if week_shape == "front-loaded":
        start = min(stagger, max(0, len(available) - work_count))
        return available[start:start + work_count]
    if week_shape == "back-loaded":
        # Stagger from the back: each subsequent ticket starts 1 day earlier
        end = len(available) - stagger
        start = max(0, end - work_count)
        return available[start:end if end > 0 else len(available)]
    # steady: center then shift by stagger
    excess = len(available) - work_count
    base_offset = excess // 2
    offset = min(len(available) - work_count, max(0, base_offset + stagger))
    return available[offset:offset + work_count]


def _week_index_for_day(weeks: list[list[int]], day: int) -> int:
    for i, week in enumerate(weeks):
        if week and week[0] <= day <= week[-1]:
            return i
    # Day falls before any Mon-Fri block; map to nearest week
    for i, week in enumerate(weeks):
        if week and day <= week[-1]:
            return i
    return max(0, len(weeks) - 1)


def schedule_engineer_queue(
    sprint_id: str,
    engineer_tickets: list[dict[str, Any]],
    sprint_start_iso: str,
    sprint_length: int,
    today_day: int,
    is_in_flight: bool,
    team_lookup: dict[str, dict[str, Any]],
) -> dict[str, list[int]]:
    """Per-week scheduler with per-engineer profile variation.

    Every engineer gets a primary ticket each week (when their queue allows).
    Tickets that don't close in their week carry 1-2 days into the next week.
    Side tickets (small estimate) may share days with the primary at week end.

    Returns: dict mapping ticket_id to its workSchedule list.
    """
    schedules: dict[str, list[int]] = {}
    if not engineer_tickets:
        return schedules

    engineer_id = engineer_tickets[0]["assignee"]
    role = team_lookup.get(engineer_id, {}).get("role", "Engineer")
    profile = _engineer_profile(sprint_id, engineer_id, role)

    weeks = _sprint_weeks(sprint_start_iso, sprint_length)
    n_weeks = len(weeks)
    if n_weeks == 0:
        for t in engineer_tickets:
            schedules[t["id"]] = []
        return schedules

    # Sort active tickets by priority + createdAt
    active = [t for t in engineer_tickets if t["status"] != "todo"]
    todos = [t for t in engineer_tickets if t["status"] == "todo"]
    active.sort(
        key=lambda t: (
            PRIORITY_RANK.get(t.get("priority", "P2"), 3),
            t.get("createdAt", ""),
            t.get("id", ""),
        ),
    )

    for t in todos:
        schedules[t["id"]] = []

    if not active:
        return schedules

    # Assign each active ticket a primary week
    sprint_start = date.fromisoformat(sprint_start_iso)
    ticket_week: dict[str, int] = {}
    week_load: list[list[str]] = [[] for _ in weeks]

    # First pass: mid-sprint additions anchor to their createdAt week
    for t in list(active):
        if t.get("addedMidSprint"):
            created = date.fromisoformat(t["createdAt"])
            created_day = max(1, min(sprint_length, (created - sprint_start).days + 1))
            week_idx = _week_index_for_day(weeks, created_day)
            ticket_week[t["id"]] = week_idx
            week_load[week_idx].append(t["id"])

    # Second pass: spread the remaining active tickets across weeks
    remaining = [t for t in active if t["id"] not in ticket_week]
    if remaining:
        if len(remaining) <= n_weeks:
            # Sparse engineer: spread their few tickets evenly across the weeks
            # so they cover as much of the sprint as possible with gaps.
            step = n_weeks / len(remaining)
            for i, t in enumerate(remaining):
                week_idx = min(n_weeks - 1, int(round(i * step)))
                # Avoid collisions with mid-sprint additions if possible
                while week_idx < n_weeks - 1 and len(week_load[week_idx]) > 0:
                    week_idx += 1
                ticket_week[t["id"]] = week_idx
                week_load[week_idx].append(t["id"])
        else:
            # Dense engineer: round-robin to least-loaded weeks, ensure each week
            # has at least 1 primary, then double up
            for t in remaining:
                week_idx = min(range(n_weeks), key=lambda i: (len(week_load[i]), i))
                ticket_week[t["id"]] = week_idx
                week_load[week_idx].append(t["id"])

    # Engineers with fewer tickets than weeks need stronger carryover to stay
    # visible across the sprint, so we boost their carryover habit.
    sparse_engineer = len(active) < n_weeks
    if sparse_engineer:
        profile = {
            **profile,
            "carryover_prob": max(profile["carryover_prob"], 0.85),
            "carryover_extra": max(profile["carryover_extra"], 2),
        }

    # Track stagger within each week so multiple tickets sharing a week
    # do not stack on identical days.
    week_stagger: dict[int, int] = {i: 0 for i in range(n_weeks)}

    # Third pass: build workSchedule per ticket using the profile
    # Process active in queue order to keep stagger deterministic.
    for t in active:
        tid = t["id"]
        status = t["status"]
        estimate = max(1, t.get("estimate") or 1)
        week_idx = ticket_week[tid]
        week_days = weeks[week_idx]
        if not week_days:
            schedules[tid] = []
            continue

        skip_day = _meeting_skip_day(sprint_id, engineer_id, week_idx, week_days)
        week_len = len([d for d in week_days if d != skip_day])

        if status == "done":
            base = max(1, round(estimate * profile["pace"] * 0.7))
            work_count = min(base, week_len)
        elif status in ("in-progress", "in-review"):
            days_in_status = float(t.get("daysInStatus", 1))
            work_count = max(1, int(round(min(estimate, days_in_status + 1))))
            work_count = min(work_count, week_len)
        elif status == "blocked":
            work_count = 1 + int(_hash_float(sprint_id, tid, "blocked-count") * 3)
            work_count = min(work_count, week_len)
        else:
            work_count = min(estimate, week_len)

        stagger = week_stagger[week_idx]
        run = _run_within_week(
            week_days, work_count, profile["week_shape"], skip_day, stagger
        )
        # Advance the stagger for the next ticket in this week (cap so we
        # never push past the week boundary entirely).
        week_stagger[week_idx] = min(week_stagger[week_idx] + 1, max(0, len(week_days) - 1))

        # Carryover: if estimate exceeds the week length OR per-ticket hash says so,
        # add 1-2 days at the start of the next week. Only for done / in-review tickets.
        if status in ("done", "in-review") and week_idx + 1 < n_weeks:
            carry_roll = _hash_float(sprint_id, tid, "carry")
            should_carry = estimate > week_len or carry_roll < profile["carryover_prob"]
            if should_carry:
                next_week = weeks[week_idx + 1]
                carry_count = min(profile["carryover_extra"], len(next_week))
                # Take the first weekday(s) of next week
                carry_days = next_week[:carry_count]
                run = run + carry_days

        # In-flight in-progress / in-review: anchor end of run at today_day
        if status in ("in-progress", "in-review") and is_in_flight and run:
            last_day = run[-1]
            if last_day != today_day:
                # Truncate or extend so the run ends at or just before today_day
                run = [d for d in run if d <= today_day]
                if not run:
                    # Place a single day at today_day
                    run = [today_day]

        # Clamp to sprint
        run = sorted(set(d for d in run if 1 <= d <= sprint_length))
        schedules[tid] = run

    # Optional side tickets: with prob, a small ticket overlaps the tail of its week
    if profile["side_ticket_prob"] > 0:
        for t in active:
            tid = t["id"]
            if not schedules.get(tid):
                continue
            if t.get("addedMidSprint"):
                continue
            if t["status"] != "done":
                continue
            if (t.get("estimate") or 0) > 2:
                continue
            side_roll = _hash_float(sprint_id, tid, "side-pick")
            if side_roll >= profile["side_ticket_prob"]:
                continue
            week_idx = ticket_week[tid]
            week_days = weeks[week_idx]
            if len(week_days) < 2:
                continue
            # Add one extra weekday tail-of-week tag to a different ticket already in that week
            # The "side" effect: keep schedule small but ensure end-of-week overlap exists.
            tail = week_days[-1:]
            schedules[tid] = sorted(set(schedules[tid] + tail))

    return schedules


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
    is_in_flight = spec["status"] == "in-progress"
    today_day = spec.get("currentDay") or day_count if is_in_flight else day_count
    enriched_tickets: list[dict[str, Any]] = []
    for t in spec["tickets"]:
        e = dict(t)
        e["daysInStatus"] = days_in_status_for(spec["id"], t["id"], t["status"])
        enriched_tickets.append(e)

    # Group by assignee and schedule each engineer's queue sequentially so
    # the heatmap and Gantt reflect realistic week-by-week focus rather
    # than five tickets running in parallel from day 1.
    by_assignee: dict[str, list[dict[str, Any]]] = {}
    for e in enriched_tickets:
        by_assignee.setdefault(e["assignee"], []).append(e)

    team_lookup = {m["id"]: m for m in TEAM}
    schedule_map: dict[str, list[int]] = {}
    for assignee, eng_tickets in by_assignee.items():
        per_engineer = schedule_engineer_queue(
            spec["id"],
            eng_tickets,
            spec["startDate"],
            day_count,
            today_day,
            is_in_flight,
            team_lookup,
        )
        schedule_map.update(per_engineer)

    tickets = []
    for e in enriched_tickets:
        e["workSchedule"] = schedule_map.get(e["id"], [])
        tickets.append(e)

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
