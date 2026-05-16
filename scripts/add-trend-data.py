"""Add cycle time and throughput data to each sprint fixture so the
W9.D4 KPI cards (cycle time trend, throughput per week, scope creep,
carryover rate) have real numbers to render.

cycleTime.days is the rolling team cycle time per sprint day. Nulls
mark future days for the in flight sprint.

cycleTime.teamBaseline is the trailing team baseline used as the
comparison line on the trend chart.

throughputPerWeek pairs week one and week two completed ticket counts
for the four sprints. Used by the bar chart."""

import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
sprints_dir = repo / "fixtures" / "sprint-intelligence" / "sprints"

TREND_DATA = {
    "sprint-42": {
        "cycleTime": {
            "days": [5.2, 5.0, 4.8, 4.5, 4.3, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.5, 3.4],
            "teamBaseline": 4.5,
            "trend": "improving",
        },
        "throughputPerWeek": {
            "weekOne": 8,
            "weekTwo": 12,
            "priorAverage": 9,
        },
    },
    "sprint-43": {
        "cycleTime": {
            # Calm first four days then jumps when the escalation lands.
            "days": [4.6, 4.5, 4.4, 4.3, 4.2, 5.2, 5.5, 5.3, 5.0, 4.8, 4.6, 4.5, 4.4, 4.3],
            "teamBaseline": 4.5,
            "trend": "flat",
        },
        "throughputPerWeek": {
            "weekOne": 6,
            "weekTwo": 16,
            "priorAverage": 9,
        },
    },
    "sprint-44": {
        "cycleTime": {
            # Blocker hits on day five, cycle time climbs hard.
            "days": [4.6, 4.5, 4.5, 4.6, 5.0, 6.0, 7.0, 7.5, 7.8, 8.0, 8.0, 7.8, 7.5, 7.2],
            "teamBaseline": 4.5,
            "trend": "rising",
        },
        "throughputPerWeek": {
            "weekOne": 5,
            "weekTwo": 10,
            "priorAverage": 9,
        },
    },
    "sprint-45": {
        "cycleTime": {
            # In flight at day eight. Future days null.
            "days": [4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, None, None, None, None, None, None],
            "teamBaseline": 4.5,
            "trend": "improving",
        },
        "throughputPerWeek": {
            "weekOne": 8,
            "weekTwo": 4,
            "priorAverage": 9,
        },
    },
}


def main() -> None:
    for slug, data in TREND_DATA.items():
        path = sprints_dir / f"{slug}.json"
        fixture = json.loads(path.read_text(encoding="utf-8"))
        fixture["cycleTime"] = data["cycleTime"]
        fixture["throughputPerWeek"] = data["throughputPerWeek"]
        path.write_text(
            json.dumps(fixture, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"updated {slug}")


if __name__ == "__main__":
    main()
