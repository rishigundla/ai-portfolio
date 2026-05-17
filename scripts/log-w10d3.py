"""Log W10.D3 skeletons and error boundary in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_day = (
    '{ num: "W10.D3", weekday: "Wed", name: "States + Errors", '
    'tasks: ["Skeleton states", "Error boundaries"] }'
)
new_day = (
    '{ num: "W10.D3", weekday: "Wed", name: "Skeleton states and error boundary", '
    'tasks: ["Three skeleton components (BriefSkeleton, TeamWorkloadSkeleton, EngineerTabsSkeleton) replace the plain text Suspense fallbacks", '
    '"SprintErrorBoundary class component with a graceful fallback card plus a Try again reset button", '
    '"Streaming brief panel, TeamWorkloadCard, and EngineerTabs each wrapped in SprintErrorBoundary so a render error cannot blank the whole page", '
    '"Streaming brief panel falls back to the fixture.metadata.summary text inside an inline rose tinted card if the streaming render fails"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D3 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 10 · Day 2 (4 tasks - horizontal scroll tab strip, mobile bottom sheet dialog, scrollbar-hide utility, breakpoint sweep)\n'
    '        "10-W10.D2-0", "10-W10.D2-1", "10-W10.D2-2", "10-W10.D2-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 10 · Day 2 (4 tasks - horizontal scroll tab strip, mobile bottom sheet dialog, scrollbar-hide utility, breakpoint sweep)\n'
    '        "10-W10.D2-0", "10-W10.D2-1", "10-W10.D2-2", "10-W10.D2-3",\n'
    '        // Phase 3 · Week 10 · Day 3 (4 tasks - three skeletons, error boundary class, wired across three panels, streaming brief fallback)\n'
    '        "10-W10.D3-0", "10-W10.D3-1", "10-W10.D3-2", "10-W10.D3-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W10.D2 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4f1 W10.D2 - Sprint Intelligence responsive polish for narrow viewports",'
)
desc = (
    "States and errors pass landed on /sprint/[id]. Three new skeleton components in "
    "_components/skeletons.tsx replace the plain text Suspense fallbacks. BriefSkeleton "
    "matches the streaming brief shape (progress strip plus prose block) and stays around "
    "for the milliseconds between page paint and React hydration. TeamWorkloadSkeleton "
    "mirrors the eight engineer rows. EngineerTabsSkeleton mirrors the tab strip plus the "
    "engineer panel layout with four stat tile placeholders plus a priority mix plus ticket "
    "list pair. Each skeleton uses Tailwind animate-pulse with consistent base-700 placeholder "
    "bars. New SprintErrorBoundary in _components/SprintErrorBoundary.tsx is a small React "
    "class component (React still requires a class for getDerivedStateFromError plus "
    "componentDidCatch). The default fallback renders an inline rose tinted card with an "
    "AlertOctagon eyebrow, a short explanation, the error message in a mono pre tag, and a "
    "Try again button that resets the boundary state. componentDidCatch console.errors the "
    "failure so a developer can pick it up. Wired into three places. Streaming brief panel "
    "gets a custom fallback that falls back to the fixture.metadata.summary inline so the "
    "section still has a sprint summary even when the streaming primitive throws. "
    "TeamWorkloadCard and EngineerTabs each wrap their Suspense in the default boundary so a "
    "bad URL state or a malformed engineer fixture stays contained. Build clean via direct "
    "next build. /sprint/[id] First Load JS at 51.7 kB, unchanged from W10.D2 because the "
    "boundary and skeletons are small additions. Type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f6e1️ W10.D3 - Sprint Intelligence skeleton states and error boundary",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D4 - Lighthouse pass plus SEO. Run a fresh Lighthouse audit against /, /sprints, /sprint/sprint-42 (representative). Target 90 plus perf, 95 plus a11y, 100 BP, 100 SEO. Fix any structural a11y issues (heading order, contrast, focus order). Make sure each /sprint/[id] route has generateMetadata that names the sprint."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4f1 W10.D2 - Sprint Intelligence responsive polish for narrow viewports",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 2 - Responsive polish done. EngineerTabs strip horizontally scrolls on '
    'phones, BlockerHistoryDialog snaps to a bottom sheet on phones, scrollbar-hide utility '
    'added. Breakpoint sweep verified at 1440 / 1280 / 768."'
)
new_day_row = (
    '"Week 10 · Day 3 - Skeleton states plus SprintErrorBoundary live. Three skeletons match '
    'the brief, team workload, and engineer tabs panels. Boundary catches render errors and '
    'shows a Try again card instead of blanking the page."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f4f1 W10.D2 - Sprint Intelligence responsive polish for narrow viewports"
md_new = (
    "### 2026-05-17 · \U0001f6e1️ W10.D3 - Sprint Intelligence skeleton states and error boundary\n"
    "- **Three skeleton components** in `_components/skeletons.tsx`. `BriefSkeleton` matches the streaming brief shape (progress strip plus prose block). `TeamWorkloadSkeleton` mirrors the eight engineer rows. `EngineerTabsSkeleton` mirrors the tab strip plus engineer panel layout with four stat tile placeholders plus a priority mix plus ticket list pair. Each uses Tailwind `animate-pulse` with consistent `base-700` placeholder bars.\n"
    "- **`SprintErrorBoundary`** in `_components/SprintErrorBoundary.tsx`. Small React class component (React still requires a class for `getDerivedStateFromError` plus `componentDidCatch`). Default fallback renders an inline rose tinted card with an `AlertOctagon` eyebrow, a short explanation, the error message in a mono `<pre>`, and a `Try again` button that resets the boundary state. `componentDidCatch` logs the failure so a developer can pick it up.\n"
    "- **Wired into three places.** Streaming brief panel gets a custom fallback that drops to the `fixture.metadata.summary` text inline so the section still has a sprint summary even when the streaming primitive throws. `TeamWorkloadCard` and `EngineerTabs` each wrap their Suspense in the default boundary so a bad URL state or a malformed engineer fixture stays contained.\n"
    "- **Build clean** via direct `next build`. `/sprint/[id]` First Load JS at 51.7 kB, unchanged from W10.D2 because the boundary and skeletons are small additions. Type check clean.\n"
    "- **Next**: W10.D4 - Lighthouse pass plus SEO. Run a fresh Lighthouse audit against `/`, `/sprints`, `/sprint/sprint-42` (representative). Target 90 plus perf, 95 plus a11y, 100 BP, 100 SEO. Fix any structural a11y issues (heading order, contrast, focus order). Make sure each `/sprint/[id]` route has `generateMetadata` that names the sprint.\n"
    "\n"
    "### 2026-05-17 · \U0001f4f1 W10.D2 - Sprint Intelligence responsive polish for narrow viewports"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D2 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 2 - Responsive polish done. `EngineerTabs` strip horizontally "
    "scrolls on phones, `BlockerHistoryDialog` snaps to a bottom sheet on phones, `scrollbar-hide` "
    "utility added. Breakpoint sweep verified at 1440 / 1280 / 768. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 3 - Skeleton states plus `SprintErrorBoundary` live. Three "
    "skeletons match the brief, team workload, and engineer tabs panels. Boundary catches render "
    "errors and shows a Try again card instead of blanking the page. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
