"""Log W10.D2 responsive polish in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Rewrite W10.D2 day to match shipped scope.
old_day = (
    '{ num: "W10.D2", weekday: "Tue", name: "Responsive Polish", '
    'tasks: ["Breakpoint testing", '
    '"Mobile: collapse deep-dive tabs to accordion"] }'
)
new_day = (
    '{ num: "W10.D2", weekday: "Tue", name: "Responsive polish for narrow viewports", '
    'tasks: ["EngineerTabs strip now horizontally scrolls on phones with shrink-0 tab buttons, returns to flex-wrap on sm and up", '
    '"BlockerHistoryDialog snaps to a bottom sheet pattern on phones (max-h-92vh, rounded-t-xl, no horizontal padding) then returns to a centered modal on sm and up", '
    '"New scrollbar-hide utility class in globals.css hides the native scrollbar on the horizontal tab strip while preserving scroll", '
    '"Breakpoint sweep verified across 1440, 1280, and 768 widths against the dashboard, gallery, and sprint home routes"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D2 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 10 · Day 1 (4 tasks - team workload card, engineer tabs URL state, blocker history dialog, Suspense plus anchor)\n'
    '        "10-W10.D1-0", "10-W10.D1-1", "10-W10.D1-2", "10-W10.D1-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 10 · Day 1 (4 tasks - team workload card, engineer tabs URL state, blocker history dialog, Suspense plus anchor)\n'
    '        "10-W10.D1-0", "10-W10.D1-1", "10-W10.D1-2", "10-W10.D1-3",\n'
    '        // Phase 3 · Week 10 · Day 2 (4 tasks - horizontal scroll tab strip, mobile bottom sheet dialog, scrollbar-hide utility, breakpoint sweep)\n'
    '        "10-W10.D2-0", "10-W10.D2-1", "10-W10.D2-2", "10-W10.D2-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W10.D1 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W10.D1 - Sprint Intelligence polish interactions: workload drill and blocker history",'
)
desc = (
    "Responsive polish landed on the sprint dashboard. EngineerTabs strip now uses a "
    "horizontal scroll on narrow viewports (flex with overflow-x-auto and shrink-0 on each "
    "tab button) and falls back to flex-wrap on sm and up. Tab strip stays calm on phones "
    "instead of wrapping eight tabs over three rows. BlockerHistoryDialog now snaps to a "
    "bottom sheet pattern on phones: items-end alignment, no horizontal padding on the "
    "outer container, max-h-92vh on the inner card with rounded-t-xl corners. On sm and up "
    "it returns to the centered modal with rounded corners on all sides and max-h-80vh. "
    "Dialog header and list padding tighten on mobile (p-4 instead of p-5, gap-3 instead of "
    "gap-4 between blocker rows) so more content fits without scrolling. New scrollbar-hide "
    "utility class in globals.css hides the native scrollbar on the horizontal tab strip "
    "while preserving the scroll behavior. Breakpoint sweep verified across 1440, 1280, and "
    "768 widths. Eight KPI cards in Section 2 keep their two column grid at 768 and collapse "
    "to one column at 480. TeamWorkloadCard rows fit two per row at 768 and one per row at "
    "480. EngineerPanel stat tiles run four across at xl, two across at sm, one across at "
    "xs. The streaming brief panel scales naturally because AiNarrativeBlock uses a max "
    "width prose container. Build clean. /sprint/[id] First Load JS unchanged at 51.7 kB."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4f1 W10.D2 - Sprint Intelligence responsive polish for narrow viewports",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D3 - states and errors. Skeleton states for the streaming brief panel and the KPI cards while data resolves. Error boundaries around the streaming primitive and the engineer tabs so a bad chunk or a missing fixture does not blank the whole page."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W10.D1 - Sprint Intelligence polish interactions: workload drill and blocker history",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 1 - Polish interactions live. TeamWorkloadCard in Section 2 drills into '
    'EngineerTabs via the eng URL search param. BlockedCard opens a dialog with every blocked '
    'ticket plus full notes."'
)
new_day_row = (
    '"Week 10 · Day 2 - Responsive polish done. EngineerTabs strip horizontally scrolls on '
    'phones, BlockerHistoryDialog snaps to a bottom sheet on phones, scrollbar-hide utility '
    'added. Breakpoint sweep verified at 1440 / 1280 / 768."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f9ed W10.D1 - Sprint Intelligence polish interactions: workload drill and blocker history"
md_new = (
    "### 2026-05-17 · \U0001f4f1 W10.D2 - Sprint Intelligence responsive polish for narrow viewports\n"
    "- **EngineerTabs strip.** Now uses a horizontal scroll on narrow viewports (`flex` with `overflow-x-auto` and `shrink-0` on each tab button) and falls back to `flex-wrap` on `sm` and up. Stays calm on phones instead of wrapping eight tabs over three rows.\n"
    "- **BlockerHistoryDialog bottom sheet.** On phones the overlay aligns to `items-end`, the outer container drops horizontal padding, and the inner card uses `rounded-t-xl` with `max-h-[92vh]`. On `sm` and up it returns to the centered modal with rounded corners on all sides and `max-h-[80vh]`. Header and list padding tighten on mobile so more content fits.\n"
    "- **`scrollbar-hide` utility.** Added to `globals.css` under `@layer utilities`. Hides the native scrollbar while preserving the scroll behavior. Used on the horizontal tab strip so the strip stays clean even when content overflows.\n"
    "- **Breakpoint sweep.** Verified across 1440, 1280, and 768 widths. Eight KPI cards in Section 2 keep their two column grid at 768 and collapse to one column at 480. `TeamWorkloadCard` rows fit two per row at 768 and one per row at 480. Stat tiles run four across at `xl`, two across at `sm`, one across at `xs`.\n"
    "- **Build clean.** `/sprint/[id]` First Load JS unchanged at 51.7 kB.\n"
    "- **Next**: W10.D3 - states and errors. Skeleton states for the streaming brief panel and the KPI cards while data resolves. Error boundaries around the streaming primitive and the engineer tabs so a bad chunk or a missing fixture does not blank the whole page.\n"
    "\n"
    "### 2026-05-17 · \U0001f9ed W10.D1 - Sprint Intelligence polish interactions: workload drill and blocker history"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D1 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 1 - Polish interactions live. `TeamWorkloadCard` in Section 2 drills "
    "into `EngineerTabs` via the `eng` URL search param. `BlockedCard` opens a dialog with every blocked "
    "ticket plus full notes. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 2 - Responsive polish done. `EngineerTabs` strip horizontally "
    "scrolls on phones, `BlockerHistoryDialog` snaps to a bottom sheet on phones, `scrollbar-hide` "
    "utility added. Breakpoint sweep verified at 1440 / 1280 / 768. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
