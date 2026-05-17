"""Log W10.D1 polish interactions in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Rewrite W10.D1 day to match shipped scope.
old_day = (
    '{ num: "W10.D1", weekday: "Mon", name: "Interactions + Drill-Downs", '
    'tasks: ["Click engineer name → filter to that person", '
    '"Click blocker → show blocker history"] }'
)
new_day = (
    '{ num: "W10.D1", weekday: "Mon", name: "Polish interactions: team workload drill, blocker history", '
    'tasks: ["TeamWorkloadCard with per engineer bars in Section 2, click an engineer to update the eng URL search param and scroll to the deep dive section", '
    '"EngineerTabs now reads the eng search param as the active engineer so the drill in from the workload card lands on the right tab", '
    '"BlockedCard converted to a client component with a View blocker history button that opens an inline dialog listing every blocked ticket with id, priority, story points, assignee, full blocker note, and labels", '
    '"Section 3 wrapped in an id=per-engineer-section anchor for smooth scroll plus Suspense boundaries around the two useSearchParams consumers so SSG prerendering still works"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D1 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 9 · Day 7 (4 tasks - StreamingBriefPanel component, progress strip, cancel and replay, page wiring)\n'
    '        "9-W9.D7-0", "9-W9.D7-1", "9-W9.D7-2", "9-W9.D7-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 7 (4 tasks - StreamingBriefPanel component, progress strip, cancel and replay, page wiring)\n'
    '        "9-W9.D7-0", "9-W9.D7-1", "9-W9.D7-2", "9-W9.D7-3",\n'
    '        // Phase 3 · Week 10 · Day 1 (4 tasks - team workload card, engineer tabs URL state, blocker history dialog, Suspense plus anchor)\n'
    '        "10-W10.D1-0", "10-W10.D1-1", "10-W10.D1-2", "10-W10.D1-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D7 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f399️ W9.D7 - Sprint Intelligence streaming meeting brief panel",'
)
desc = (
    "Two polish interactions landed on /sprint/[id]. New TeamWorkloadCard component renders "
    "eight engineer rows in Section 2 (a third KPI row below the existing eight cards), each "
    "row carries first name, role glyph (Sr, Jr, EM, Eng), a workload bar tinted by load tone "
    "(rose over 110 percent, gray under 80, accent in the middle band), and the percent "
    "against capacity at the right. Clicking any row sets the eng search param via "
    "router.replace and smooth scrolls down to a new id=per-engineer-section anchor. "
    "EngineerTabs reads the same eng search param via useSearchParams as its active engineer, "
    "with the first engineer as a fallback when the param is missing or invalid. Both "
    "components are wrapped in Suspense fallbacks because Next.js 15 refuses to prerender SSG "
    "pages whose consumers call useSearchParams outside a Suspense boundary. BlockedCard "
    "promoted from server to client component to host modal state. New View blocker history "
    "button opens an inline dialog (fixed inset zero, bg-base-900/80 backdrop-blur-sm overlay, "
    "stopPropagation on the inner card so backdrop click dismisses but content click does "
    "not) that lists every blocked ticket with id, priority, story points, assignee name "
    "(looked up from the team manifest), full blocker note rendered with a rose left border "
    "stripe, and the label chips. Escape key dismisses, body scroll lock while open. Sprint "
    "44 surfaces five blockers with full context in the dialog, sprint 42 and 45 show the all "
    "clear state with no View history button needed. Build clean via direct next build. /sprint/"
    "[id] First Load JS now at 51.7 kB (up from 49.8 kB) because the dialog state lives in "
    "BlockedCard which became a client component. Type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W10.D1 - Sprint Intelligence polish interactions: workload drill and blocker history",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D2 - Responsive polish. Breakpoint testing across 1440 / 1280 / 768. Mobile collapse rules for the deep dive tabs (horizontal scroll on a narrow strip, or convert to an accordion). Mobile bottom sheet pattern for the blocker history dialog."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f399️ W9.D7 - Sprint Intelligence streaming meeting brief panel",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 9 · CLOSED - Project 3 core build complete. /sprint/[id] now leads with a '
    'streaming meeting brief (Section 1), eight team KPI cards across two rows (Section 2), '
    'and an eight engineer deep dive tab strip (Section 3). Project 3 W10 polish plus deploy next."'
)
new_day_row = (
    '"Week 10 · Day 1 - Polish interactions live. TeamWorkloadCard in Section 2 drills into '
    'EngineerTabs via the eng URL search param. BlockedCard opens a dialog with every blocked '
    'ticket plus full notes."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f399️ W9.D7 - Sprint Intelligence streaming meeting brief panel"
md_new = (
    "### 2026-05-17 · \U0001f9ed W10.D1 - Sprint Intelligence polish interactions: workload drill and blocker history\n"
    "- **`TeamWorkloadCard`.** Eight engineer rows in Section 2 (a third KPI row below the existing eight cards). Each row carries first name, role glyph (Sr, Jr, EM, Eng), a workload bar tinted by load tone (rose over 110 percent, gray under 80, accent in the middle band), and the percent against capacity at the right.\n"
    "- **URL state bus.** Clicking any row sets the `eng` search param via `router.replace` (scroll false) and smooth scrolls down to a new `id=per-engineer-section` anchor on Section 3. `EngineerTabs` reads the same `eng` search param via `useSearchParams` as its active engineer with the first engineer as a fallback. The two client components share state through the URL instead of context lifting.\n"
    "- **Suspense boundaries.** Next.js 15 refuses to prerender SSG pages whose consumers call `useSearchParams` outside a Suspense boundary. Wrapped both `TeamWorkloadCard` and `EngineerTabs` in `<Suspense>` with small fallbacks so the rest of the page still prerenders statically while the URL bound subtree resolves on the client.\n"
    "- **`BlockedCard` blocker history dialog.** Component promoted from server to client to host modal state. New `View blocker history` button opens an inline dialog (`fixed inset-0`, `bg-base-900/80 backdrop-blur-sm` overlay, `stopPropagation` on the inner card so backdrop click dismisses but content click does not). Lists every blocked ticket with id, priority, story points, assignee name (looked up from the team manifest), full blocker note rendered with a rose left border stripe, and the label chips. Escape key dismisses. Body scroll locks while open. Sprint 44 surfaces five blockers with full context; sprint 42 and 45 show the all clear state with no `View history` button needed.\n"
    "- **Build clean** via direct `next build`. `/sprint/[id]` First Load JS now at 51.7 kB (up from 49.8 kB) because `BlockedCard` became a client component. Type check clean.\n"
    "- **Next**: W10.D2 - Responsive polish. Breakpoint testing across 1440 / 1280 / 768. Mobile collapse rules for the deep dive tabs (horizontal scroll on a narrow strip, or convert to an accordion). Mobile bottom sheet pattern for the blocker history dialog.\n"
    "\n"
    "### 2026-05-17 · \U0001f399️ W9.D7 - Sprint Intelligence streaming meeting brief panel"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D7 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 9 · CLOSED - Project 3 core build complete. `/sprint/[id]` now leads with a "
    "streaming meeting brief (Section 1), eight team KPI cards across two rows (Section 2), and an eight "
    "engineer deep dive tab strip (Section 3). Project 3 W10 polish plus deploy next. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 1 - Polish interactions live. `TeamWorkloadCard` in Section 2 drills "
    "into `EngineerTabs` via the `eng` URL search param. `BlockedCard` opens a dialog with every blocked "
    "ticket plus full notes. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
