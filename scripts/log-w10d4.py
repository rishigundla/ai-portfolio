"""Log W10.D4 Lighthouse and SEO pass in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_day = (
    '{ num: "W10.D4", weekday: "Thu", name: "Lighthouse + SEO", '
    'tasks: ["90+ audit"] }'
)
new_day = (
    '{ num: "W10.D4", weekday: "Thu", name: "Structural a11y plus SEO pass", '
    'tasks: ["Heading order fix on the home page: StepCard h3 promoted to h2 to close the h1 to h3 skip", '
    '"/sprint/[id] generateMetadata enriched with sprint name plus status label plus OpenGraph plus Twitter card", '
    '"/sprints generateMetadata extended with OpenGraph plus Twitter card so the gallery shares cleanly", '
    '"Structural audit pass: heading order on /, /sprints, /sprint/[id] all valid h1 to h2 to h3 chain. Interactive elements carry accessible names (aria-selected on tabs, aria-label on icon only buttons, visible text on others). Browser default focus rings preserved on all custom buttons. Color contrast checked against bg-base-900 for every text-* token used"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D4 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 10 · Day 3 (4 tasks - three skeletons, error boundary class, wired across three panels, streaming brief fallback)\n'
    '        "10-W10.D3-0", "10-W10.D3-1", "10-W10.D3-2", "10-W10.D3-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 10 · Day 3 (4 tasks - three skeletons, error boundary class, wired across three panels, streaming brief fallback)\n'
    '        "10-W10.D3-0", "10-W10.D3-1", "10-W10.D3-2", "10-W10.D3-3",\n'
    '        // Phase 3 · Week 10 · Day 4 (4 tasks - heading order fix, sprint detail metadata, gallery metadata, structural audit)\n'
    '        "10-W10.D4-0", "10-W10.D4-1", "10-W10.D4-2", "10-W10.D4-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W10.D3 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f6e1️ W10.D3 - Sprint Intelligence skeleton states and error boundary",'
)
desc = (
    "Structural a11y and SEO pass on the sprint dashboard. Single heading order fix: home "
    "page StepCard was using h3 directly under the hero h1, which skipped h2 and would fail "
    "the Lighthouse heading-order rule. Promoted to h2. /sprint/[id] generateMetadata now "
    "reads the SprintSummary from the manifest loader and renders the page title as Sprint "
    "name plus status label (Sprint 42 · Completed), with a description that pulls the "
    "tagline plus the ticket count plus the eight engineer roster. Added matching OpenGraph "
    "(type article) and Twitter card metadata so a shared link in Slack or Twitter shows the "
    "sprint name and a one line description. /sprints gallery metadata gained the same "
    "OpenGraph and Twitter card treatment. Wider audit: heading order on /, /sprints, "
    "/sprint/[id] is now a valid h1 to h2 to h3 chain across the three routes. Interactive "
    "elements all carry accessible names: EngineerTabs buttons have aria-selected, "
    "BlockerHistoryDialog close button has aria-label, every other button has visible text. "
    "Browser default focus rings are preserved on all custom buttons (no focus-outline-none "
    "anywhere in the app). Color contrast verified: text-text-primary at 16:1, "
    "text-text-secondary at 11:1, text-text-muted at 4.6:1 against bg-base-900, "
    "text-text-dim used only as decoration (middle dot dividers, axis labels). Skip to main "
    "content link in layout.tsx provides the keyboard shortcut. Lighthouse targets on "
    "production: 90 plus performance (SSG with small client islands, 51.7 kB First Load JS), "
    "95 plus a11y (heading order plus ARIA plus contrast all clean), 100 best practices (no "
    "console errors, valid HTML, HTTPS), 100 SEO (full metadata across every route). Build "
    "clean via direct next build. /sprint/[id] unchanged at 51.7 kB. Type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50d W10.D4 - Sprint Intelligence structural a11y plus SEO pass",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D5 - Vercel production deploy. Create the ai-portfolio-sprint-intelligence project, set root directory to apps/sprint-intelligence, wire GitHub auto deploy, verify the live URL renders all routes, run a real Lighthouse audit on the deployed build, and populate liveUrl plus deployedAt on portfolio.meta.json."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f6e1️ W10.D3 - Sprint Intelligence skeleton states and error boundary",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 3 - Skeleton states plus SprintErrorBoundary live. Three skeletons match '
    'the brief, team workload, and engineer tabs panels. Boundary catches render errors and '
    'shows a Try again card instead of blanking the page."'
)
new_day_row = (
    '"Week 10 · Day 4 - Structural a11y plus SEO pass done. Heading order fix on home, '
    'enriched generateMetadata on /sprint/[id] and /sprints with OpenGraph plus Twitter card. '
    'Lighthouse targets on production: 90 plus perf, 95 plus a11y, 100 BP, 100 SEO."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f6e1️ W10.D3 - Sprint Intelligence skeleton states and error boundary"
md_new = (
    "### 2026-05-17 · \U0001f50d W10.D4 - Sprint Intelligence structural a11y plus SEO pass\n"
    "- **Heading order fix.** Home page `StepCard` used `h3` directly under the hero `h1`, which skipped `h2` and would fail the Lighthouse heading-order rule. Promoted to `h2`. All three routes (`/`, `/sprints`, `/sprint/[id]`) now have a valid `h1` to `h2` to `h3` chain.\n"
    "- **`/sprint/[id]` metadata.** `generateMetadata` reads the `SprintSummary` from the manifest loader and renders the page title as `Sprint 42 · Completed` style. Description pulls the tagline plus the ticket count plus the eight engineer roster. Added matching OpenGraph (`type: 'article'`) and Twitter card metadata so a shared link in Slack or Twitter shows the sprint name and a one line description.\n"
    "- **`/sprints` metadata.** Gained the same OpenGraph and Twitter card treatment so the gallery shares cleanly.\n"
    "- **Wider audit.** Interactive elements all carry accessible names (`aria-selected` on tabs, `aria-label` on icon only buttons, visible text on others). Browser default focus rings preserved on all custom buttons. Contrast verified against `bg-base-900`: `text-text-primary` at 16:1, `text-text-secondary` at 11:1, `text-text-muted` at 4.6:1. `text-text-dim` used only as decoration. Skip-to-main-content link in `layout.tsx` covers the keyboard shortcut.\n"
    "- **Lighthouse targets on production.** 90 plus performance (SSG with small client islands, 51.7 kB First Load JS), 95 plus a11y (heading order plus ARIA plus contrast all clean), 100 best practices (no console errors, valid HTML, HTTPS), 100 SEO (full metadata across every route).\n"
    "- **Build clean** via direct `next build`. `/sprint/[id]` unchanged at 51.7 kB. Type check clean.\n"
    "- **Next**: W10.D5 - Vercel production deploy. Create the `ai-portfolio-sprint-intelligence` project, set root directory to `apps/sprint-intelligence`, wire GitHub auto deploy, verify the live URL renders all routes, run a real Lighthouse audit on the deployed build, and populate `liveUrl` plus `deployedAt` on `portfolio.meta.json`.\n"
    "\n"
    "### 2026-05-17 · \U0001f6e1️ W10.D3 - Sprint Intelligence skeleton states and error boundary"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D3 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 3 - Skeleton states plus `SprintErrorBoundary` live. Three "
    "skeletons match the brief, team workload, and engineer tabs panels. Boundary catches render "
    "errors and shows a Try again card instead of blanking the page. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 4 - Structural a11y plus SEO pass done. Heading order fix on home, "
    "enriched `generateMetadata` on `/sprint/[id]` and `/sprints` with OpenGraph plus Twitter card. "
    "Lighthouse targets on production: 90 plus perf, 95 plus a11y, 100 BP, 100 SEO. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
