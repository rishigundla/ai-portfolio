"""Add per engineer personal cycle time data to each sprint fixture.

Workload, completion rate, status mix, and review queue all derive
from the existing ticket array (no extra data needed). Personal cycle
time cannot be derived from current ticket state without timestamps,
so it lives in the fixture as a small per engineer block."""

import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
sprints_dir = repo / "fixtures" / "sprint-intelligence" / "sprints"

PER_ENGINEER = {
    "sprint-42": {
        # Healthy sprint, team baseline 4.5 days, mostly improving.
        "eng-1": {"personalCycleTime": 3.8},
        "eng-2": {"personalCycleTime": 4.5},
        "eng-3": {"personalCycleTime": 4.0},
        "eng-4": {"personalCycleTime": 3.5},
        "eng-5": {"personalCycleTime": 5.6},
        "eng-6": {"personalCycleTime": 4.0},
        "eng-7": {"personalCycleTime": 5.0},
        "eng-8": {"personalCycleTime": 3.6},
    },
    "sprint-43": {
        # Scope creep, seniors carried the escalation.
        "eng-1": {"personalCycleTime": 4.5},
        "eng-2": {"personalCycleTime": 5.0},
        "eng-3": {"personalCycleTime": 4.0},
        "eng-4": {"personalCycleTime": 4.2},
        "eng-5": {"personalCycleTime": 5.0},
        "eng-6": {"personalCycleTime": 4.0},
        "eng-7": {"personalCycleTime": 4.5},
        "eng-8": {"personalCycleTime": 3.8},
    },
    "sprint-44": {
        # Blocked sprint, auth team idled, others kept moving.
        "eng-1": {"personalCycleTime": 9.0},
        "eng-2": {"personalCycleTime": 7.0},
        "eng-3": {"personalCycleTime": 4.5},
        "eng-4": {"personalCycleTime": 4.0},
        "eng-5": {"personalCycleTime": 4.5},
        "eng-6": {"personalCycleTime": 4.0},
        "eng-7": {"personalCycleTime": 5.0},
        "eng-8": {"personalCycleTime": 4.0},
    },
    "sprint-45": {
        # In flight, day eight, team mostly healthy.
        "eng-1": {"personalCycleTime": 5.0},
        "eng-2": {"personalCycleTime": 3.5},
        "eng-3": {"personalCycleTime": 4.0},
        "eng-4": {"personalCycleTime": 3.8},
        "eng-5": {"personalCycleTime": 4.5},
        "eng-6": {"personalCycleTime": 4.0},
        "eng-7": {"personalCycleTime": 4.0},
        "eng-8": {"personalCycleTime": 3.9},
    },
}


def main() -> None:
    for slug, data in PER_ENGINEER.items():
        path = sprints_dir / f"{slug}.json"
        fixture = json.loads(path.read_text(encoding="utf-8"))
        fixture["perEngineer"] = data
        path.write_text(
            json.dumps(fixture, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"updated {slug}")


if __name__ == "__main__":
    main()
