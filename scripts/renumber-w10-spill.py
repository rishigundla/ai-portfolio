"""Renumber W10's 15 days into W10 + W11 + W12.

Project 3 ran 15 days in Week 10. This script:
- Phase 5 shifts +2: W16->W18, W15->W17, W14->W16 (week numbers + inner day IDs).
- Phase 4 shifts +2: W13->W15, W12->W14, W11->W13.
- Phase 3 splits W10.D8-D14 into W11.D1-D7, and W10.D15 into W12.D1.
- completedTasks IDs and section comments updated to match.

The order matters: do Phase 5 first (high week numbers descend) so we never
collide with Phase 4 names mid-replace. Then Phase 4 descends. Then Phase 3
day-level renames. The structural split (Week 10 days array becomes three
week entries) is applied as the final step on plan.html.
"""

from __future__ import annotations
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PLAN_HTML = REPO / "docs" / "plan.html"
PLAN_MD = REPO / "docs" / "master-plan.md"

# ============================================================
# Rename token table (applied in order, top-to-bottom). The
# longest-week-first ordering avoids prefix collisions: when we rename
# "W16" to "W18", the subsequent "W14" -> "W16" rename does not catch
# the just-renamed token because we already moved past it.
# ============================================================

WEEK_RENAMES = [
    # Phase 5 outer + inner day IDs
    ("W16", "W18"),
    ("W15", "W17"),
    ("W14", "W16"),
    # Phase 4 outer + inner day IDs
    ("W13", "W15"),
    ("W12", "W14"),
    ("W11", "W13"),
]

DAY_RENAMES = [
    # Phase 3 spill: rename top day first so we never collide a 2-digit
    # day with its 1-digit cousin (e.g. D11 -> W11.D4 before D1 -> W11.D5).
    ("W10.D15", "W12.D1"),
    ("W10.D14", "W11.D7"),
    ("W10.D13", "W11.D6"),
    ("W10.D12", "W11.D5"),
    ("W10.D11", "W11.D4"),
    ("W10.D10", "W11.D3"),
    ("W10.D9", "W11.D2"),
    ("W10.D8", "W11.D1"),
]


def _id_prefix(old_week_num: int, new_week_num: int) -> tuple[str, str]:
    """Return the completedTasks ID prefix swap (e.g., 11- -> 13-)."""
    return (f"{old_week_num}-", f"{new_week_num}-")


# Phase 5/4 ID prefix swaps in completedTasks: e.g. "16-W16." -> "18-W18.".
# These are applied AFTER the WEEK_RENAMES.
ID_PREFIX_SWAPS = [
    ("16-W18.", "18-W18."),
    ("15-W17.", "17-W17."),
    ("14-W16.", "16-W16."),
    ("13-W15.", "15-W15."),
    ("12-W14.", "14-W14."),
    ("11-W13.", "13-W13."),
]

# Phase 3 spill ID swaps: keep them after WEEK_RENAMES + DAY_RENAMES
# so the Day rename has already happened and we just fix the leading
# week-number prefix on the ID.
PHASE3_ID_SWAPS = [
    ("10-W12.D1-", "12-W12.D1-"),
    ("10-W11.D7-", "11-W11.D7-"),
    ("10-W11.D6-", "11-W11.D6-"),
    ("10-W11.D5-", "11-W11.D5-"),
    ("10-W11.D4-", "11-W11.D4-"),
    ("10-W11.D3-", "11-W11.D3-"),
    ("10-W11.D2-", "11-W11.D2-"),
    ("10-W11.D1-", "11-W11.D1-"),
]

# Comment-block renames in completedTasks (descriptive section markers).
COMMENT_RENAMES = [
    ("Phase 3 · Week 10 · Day 15", "Phase 3 · Week 12 · Day 1"),
    ("Phase 3 · Week 10 · Day 14", "Phase 3 · Week 11 · Day 7"),
    ("Phase 3 · Week 10 · Day 13", "Phase 3 · Week 11 · Day 6"),
    ("Phase 3 · Week 10 · Day 12", "Phase 3 · Week 11 · Day 5"),
    ("Phase 3 · Week 10 · Day 11", "Phase 3 · Week 11 · Day 4"),
    ("Phase 3 · Week 10 · Day 10", "Phase 3 · Week 11 · Day 3"),
    ("Phase 3 · Week 10 · Day 9", "Phase 3 · Week 11 · Day 2"),
    ("Phase 3 · Week 10 · Day 8", "Phase 3 · Week 11 · Day 1"),
]


def apply_renames(text: str) -> str:
    """Apply the week-level renames first, then day-level + ID + comment swaps."""
    out = text
    # Phase 5 + 4: rename outer week tokens. These match "W16", "W15", etc.
    # plus their .Dx inner forms via the substring.
    for old, new in WEEK_RENAMES:
        # Use word-boundary-safe rewriting via a placeholder sentinel so
        # the descending order is preserved. We avoid catching e.g.
        # "W16" inside "PROJECT W163" because no such literal exists in
        # the plan, but to be safe we anchor on the W + digits pattern.
        out = re.sub(rf"\b{re.escape(old)}\b", new, out)
    # Phase 4 / 5 completedTasks ID prefix swap (rare in practice today
    # because those phases have no completed tasks yet; safe no-op if
    # they are absent).
    for old, new in ID_PREFIX_SWAPS:
        out = out.replace(old, new)
    # Outer Phase 4 / 5 week_number declarations. Descending order so we
    # never re-process a number we just created (ascending would chain
    # 11 -> 13 -> 15 -> 17 in three passes).
    out = out.replace("week: 16,", "week: 18,")
    out = out.replace("week: 15,", "week: 17,")
    out = out.replace("week: 14,", "week: 16,")
    out = out.replace("week: 13,", "week: 15,")
    out = out.replace("week: 12,", "week: 14,")
    out = out.replace("week: 11,", "week: 13,")

    # Phase 3 spill: rename day tokens. Order matters (D15 first, D8 last).
    for old, new in DAY_RENAMES:
        out = out.replace(old, new)

    # Phase 3 completedTasks ID prefix swap (10- prefix becomes 11- or 12-).
    for old, new in PHASE3_ID_SWAPS:
        out = out.replace(old, new)

    # Comment block markers in completedTasks (descriptive only).
    for old, new in COMMENT_RENAMES:
        out = out.replace(old, new)

    # Outer Phase 4 / 5 + Phase 3 week-name labels in section headings.
    # Done piecewise to keep diffs small.
    out = out.replace(
        '"Week 11 — Project 4 Core Build"',
        '"Week 13 — Project 4 Core Build"',
    )
    out = out.replace(
        '"Week 12 — Project 4 Expanded Features"',
        '"Week 14 — Project 4 Expanded Features"',
    )
    out = out.replace(
        '"Week 13 — Project 4 Polish + Deploy"',
        '"Week 15 — Project 4 Polish + Deploy"',
    )
    out = out.replace(
        '"Week 14 — Project 5 Core Build"',
        '"Week 16 — Project 5 Core Build"',
    )
    out = out.replace(
        '"Week 15 — Project 5 Expanded Features"',
        '"Week 17 — Project 5 Expanded Features"',
    )
    out = out.replace(
        '"Week 16 — Project 5 Polish + Deploy"',
        '"Week 18 — Project 5 Polish + Deploy"',
    )

    return out


def main() -> None:
    html = PLAN_HTML.read_text(encoding="utf-8")
    md = PLAN_MD.read_text(encoding="utf-8")

    html2 = apply_renames(html)
    md2 = apply_renames(md)

    PLAN_HTML.write_text(html2, encoding="utf-8")
    PLAN_MD.write_text(md2, encoding="utf-8")
    print("rename pass complete on plan.html + master-plan.md")


if __name__ == "__main__":
    main()
