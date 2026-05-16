"""Add burndown series and the four sprint velocity baseline to each
sprint fixture so the KPI charts on W9.D3 have real data to render.

Each sprint runs 14 days. `ideal` is the linear burndown from the
final scope to zero. `actual` is the realistic shape per sprint
character (healthy, scope creep, blocked, in flight). `currentDay`
marks the active position for the in flight sprint (null for
completed sprints). `fourSprintBaseline` is the average velocity of
the prior four sprints, used for the velocity comparison bar."""

import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
sprints_dir = repo / "fixtures" / "sprint-intelligence" / "sprints"

# Per sprint analytics. Numbers tell distinct stories so the rendered
# charts show meaningful variation across the gallery.
SPRINT_ANALYTICS = {
    "sprint-42": {
        # Healthy completion. Started 70 SP, finished 5 carryover, smooth burn.
        "burndown": {
            "ideal": [70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5],
            "actual": [70, 70, 67, 62, 58, 55, 50, 45, 38, 30, 22, 15, 10, 5],
        },
        "currentDay": None,
        "fourSprintBaseline": 58,
        "velocity": 67,
    },
    "sprint-43": {
        # Scope creep. Day five customer escalation jumped scope 70 -> 95.
        # Final velocity 73 SP across the enlarged scope.
        "burndown": {
            "ideal": [95, 88, 81, 74, 67, 60, 53, 46, 39, 32, 25, 18, 11, 4],
            "actual": [70, 68, 66, 64, 62, 92, 87, 80, 72, 62, 50, 40, 30, 22],
        },
        "currentDay": None,
        "fourSprintBaseline": 60,
        "velocity": 73,
    },
    "sprint-44": {
        # Blocked sprint. Identity provider blocker hit on day five.
        # Three engineers idled for nine days. Velocity 41 SP.
        "burndown": {
            "ideal": [78, 72, 67, 61, 55, 50, 44, 39, 33, 28, 22, 17, 11, 6],
            "actual": [78, 75, 72, 68, 64, 60, 58, 56, 54, 53, 50, 47, 43, 37],
        },
        "currentDay": None,
        "fourSprintBaseline": 63,
        "velocity": 41,
    },
    "sprint-45": {
        # Currently in flight at day eight of fourteen. On track for ~70 SP.
        "burndown": {
            "ideal": [82, 76, 70, 64, 58, 52, 47, 41, 35, 29, 23, 17, 11, 5],
            "actual": [82, 80, 77, 73, 68, 62, 55, 48, None, None, None, None, None, None],
        },
        "currentDay": 8,
        "fourSprintBaseline": 60,
        "velocity": 34,
    },
}


def main() -> None:
    for slug, data in SPRINT_ANALYTICS.items():
        path = sprints_dir / f"{slug}.json"
        fixture = json.loads(path.read_text(encoding="utf-8"))
        fixture["burndown"] = data["burndown"]
        fixture["currentDay"] = data["currentDay"]
        fixture["fourSprintBaseline"] = data["fourSprintBaseline"]
        fixture["velocity"] = data["velocity"]
        path.write_text(
            json.dumps(fixture, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"updated {slug}")


if __name__ == "__main__":
    main()
