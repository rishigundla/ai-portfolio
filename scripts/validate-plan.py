"""Plan data validator. Runs before every commit so the plan website
cannot drift quietly. Catches the specific failure modes that have
broken the website in the past.

Exit code zero on success, one on any validation error. Stderr lists
every error found so the user can fix them in one pass.

Run manually as `python3 scripts/validate-plan.py`. The pre commit hook
runs it automatically when docs/plan.html or docs/master-plan.md is in
the staged change set.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

PLAN = Path(__file__).resolve().parents[1] / "docs" / "plan.html"

# Characters that are not allowed inside task strings or other prose
# fields. Hyphens are conditionally allowed (only inside identifiers,
# numeric ranges, and code spans) so they are handled separately.
FORBIDDEN_IN_PROSE = ["—", "–", ";"]

# Compound modifier hyphens we always treat as drift. Anything matching
# these is a prose violation regardless of context.
FORBIDDEN_HYPHEN_PHRASES = [
    "week-over-week",
    "year-over-year",
    "quarter-over-quarter",
    "Dashboard-to-Deck",
    "dashboard-to-deck",
]

CONTRACTIONS = [
    "I'm",
    "I've",
    "I'll",
    "I'd",
    "we've",
    "we're",
    "we'll",
    "we'd",
    "you're",
    "you've",
    "you'll",
    "you'd",
    "they're",
    "they've",
    "they'll",
    "they'd",
    "it's",
    "that's",
    "there's",
    "what's",
    "here's",
    "let's",
    "who's",
    "don't",
    "doesn't",
    "didn't",
    "won't",
    "wouldn't",
    "shouldn't",
    "couldn't",
    "can't",
    "isn't",
    "aren't",
    "wasn't",
    "weren't",
    "hasn't",
    "haven't",
    "hadn't",
]


def extract_days(content: str) -> dict[str, dict[str, object]]:
    """Find every `{ num: "Wx.Dy", weekday: ..., name: ..., tasks: [...] }`
    in plan.html and return a map of day id to (week, task list).

    Naive regex parsing breaks when a task string contains a literal
    bracket like `/deck/[slug]`, so this walks the content with a tiny
    state machine that tracks string quoting and bracket depth."""
    days: dict[str, dict[str, object]] = {}
    for match in re.finditer(r'num:\s*"(W\d+\.D\d+)"', content):
        num = match.group(1)
        week = int(num.split(".")[0][1:])

        # Find the day's name field.
        name_match = re.search(r'name:\s*"((?:[^"\\]|\\.)*)"', content[match.end():])
        name = name_match.group(1) if name_match else ""

        tasks_idx = content.find("tasks:", match.end())
        if tasks_idx < 0:
            continue
        open_bracket = content.find("[", tasks_idx)
        if open_bracket < 0:
            continue

        i = open_bracket + 1
        depth = 1
        in_string = False
        escape = False
        while i < len(content):
            ch = content[i]
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif in_string:
                if ch == '"':
                    in_string = False
            elif ch == '"':
                in_string = True
            elif ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    break
            i += 1

        tasks_blob = content[open_bracket + 1 : i]
        task_strings = re.findall(r'"((?:[^"\\]|\\.)*)"', tasks_blob)
        days[num] = {"week": week, "name": name, "tasks": task_strings}
    return days


def extract_completed_ids(content: str) -> list[str]:
    block = re.search(r"completedTasks:\s*\[(.*?)\]\s*,", content, re.DOTALL)
    if not block:
        return []
    return re.findall(r'"(\d+-W\d+\.D\d+-\d+)"', block.group(1))


def check_prose(text: str, where: str) -> list[str]:
    errors: list[str] = []
    for ch in FORBIDDEN_IN_PROSE:
        if ch in text:
            errors.append(f"{where}: contains forbidden character '{ch}'")
    for phrase in FORBIDDEN_HYPHEN_PHRASES:
        if phrase in text:
            errors.append(f"{where}: contains forbidden hyphen phrase '{phrase}'")
    for contraction in CONTRACTIONS:
        # Word boundary check to avoid false positives on identifiers
        if re.search(r"\b" + re.escape(contraction) + r"\b", text):
            errors.append(f"{where}: contains forbidden contraction '{contraction}'")
    # Live HTML tags in task strings would break the renderer the same
    # way the old activity log <button> bug did.
    if re.search(r"</?(?:button|a|div|span|script|iframe|svg|input|form)\b", text):
        errors.append(f"{where}: contains HTML tag, will be parsed as live HTML by innerHTML")
    return errors


def validate() -> int:
    content = PLAN.read_text(encoding="utf-8")
    errors: list[str] = []

    days = extract_days(content)
    if not days:
        errors.append("No day entries found in weeksPlan; the parser regex may be out of sync")

    # 1. Every completed task ID must match an existing day and an
    #    existing index inside that day.
    completed_ids = extract_completed_ids(content)
    seen: set[str] = set()
    for cid in completed_ids:
        if cid in seen:
            errors.append(f"completedTasks: duplicate id '{cid}'")
        seen.add(cid)
        match = re.match(r"(\d+)-(W\d+\.D\d+)-(\d+)", cid)
        if not match:
            errors.append(f"completedTasks: malformed id '{cid}'")
            continue
        week_str, day_id, idx_str = match.group(1), match.group(2), int(match.group(3))
        if day_id not in days:
            errors.append(f"completedTasks: '{cid}' references nonexistent day '{day_id}'")
            continue
        day = days[day_id]
        if int(week_str) != day["week"]:
            errors.append(
                f"completedTasks: '{cid}' week prefix {week_str} does not match day week {day['week']}"
            )
        tasks = day["tasks"]  # type: ignore[index]
        if idx_str >= len(tasks):
            errors.append(
                f"completedTasks: '{cid}' index {idx_str} out of range (day has {len(tasks)} tasks)"
            )

    # 2. Every day must have at least one task.
    for day_id, day in days.items():
        tasks = day["tasks"]  # type: ignore[index]
        if len(tasks) == 0:
            errors.append(f"{day_id}: tasks array is empty")

    # 3. Prose violations inside task strings and day names.
    for day_id, day in days.items():
        errors.extend(check_prose(str(day["name"]), f"{day_id} name"))
        for i, task in enumerate(day["tasks"]):  # type: ignore[index]
            errors.extend(check_prose(task, f"{day_id} task {i}"))

    if errors:
        print(f"\nplan validation FAILED with {len(errors)} error(s):\n", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        print(
            "\nFix the items above before committing, or run `git commit --no-verify` to bypass (not recommended).",
            file=sys.stderr,
        )
        return 1

    total_tasks = sum(len(day["tasks"]) for day in days.values())  # type: ignore[arg-type]
    print(
        f"plan.html OK. {len(days)} days, {total_tasks} tasks, {len(completed_ids)} marked complete."
    )
    return 0


if __name__ == "__main__":
    sys.exit(validate())
