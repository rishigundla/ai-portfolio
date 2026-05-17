"""Log W12.D2: Sprint Intelligence README polish + portfolioCard refresh + root README update."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Append W12.D2 IDs to the completedTasks array, right after the W12.D1 IDs.
old_tail = (
    '        // Phase 3 · Week 12 · Day 1 (4 tasks - chart palette + heatmap tokens added to design system, Tailwind palette registered, 17-component hex sweep + 6-component class sweep, ACCENT_HEX maps to vars)\n'
    '        "12-W12.D1-0", "12-W12.D1-1", "12-W12.D1-2", "12-W12.D1-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 12 · Day 1 (4 tasks - chart palette + heatmap tokens added to design system, Tailwind palette registered, 17-component hex sweep + 6-component class sweep, ACCENT_HEX maps to vars)\n'
    '        "12-W12.D1-0", "12-W12.D1-1", "12-W12.D1-2", "12-W12.D1-3",\n'
    '        // Phase 3 · Week 12 · Day 2 (4 tasks - app README rewrite, portfolioCard refresh, root README demos refresh, plan files reflect 25 / 22 days for project 3)\n'
    '        "12-W12.D2-0", "12-W12.D2-1", "12-W12.D2-2", "12-W12.D2-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W12.D1 completedTasks tail")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f31e W12.D1 - Sprint Intelligence light-mode theming pass",'
)
# The renumber-w10-spill.py pass rewrote the prior entry title from W10.D15 to
# W12.D1 globally, so we anchor on the renamed title here.
desc = (
    "Project 3 wrap-up day one. Three artifacts refreshed to reflect the final shipped "
    "product. apps/sprint-intelligence/README.md fully rewritten: live URL banner at the top, "
    "what-it-does walks through the six monthly sprint roster plus the filter bar plus the "
    "seven dashboard surfaces plus the AI meeting brief at the bottom. Routes table updated to "
    "show 13 static pages with the SSG-x-6 detail routes. Architecture section enumerates every "
    "fixture file, every lib file, and every component file with a one-line role. Engineering "
    "moments section lifts the three case-study patterns into the README so a casual reader "
    "gets the punch lines without leaving GitHub. apps/sprint-intelligence/portfolio.meta.json "
    "portfolioCard refreshed: problem framing kept (sprint review prep is expensive), approach "
    "now references the six sprint roster plus the filter bar plus every dashboard surface, "
    "impact now calls out the activity heatmap plus the three engineering moments by name. "
    "resumeBullet text refreshed to match. Root README live demos list now includes Project 3 "
    "at the same Live position Projects 1 and 2 hold, the five-projects table flips Project 3 "
    "from Not started to Live, and the Status line tracks Phase 3 plus 320 / 436 tasks plus "
    "the three wrap-up days W12.D2 through W12.D4. Case study line in the README left as a "
    "placeholder pointing at the W12.D3 publish target so the file path is reserved. Validator "
    "green. The case study itself lands W12.D3."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4dd W12.D2 - Sprint Intelligence README polish + portfolioCard refresh + root demos refresh",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W12.D3 - Sprint Intelligence case study at docs/case-studies/sprint-intelligence.md (~1500 words, 9 sections mirroring narrative-generator.md). Three engineering moments to detail: the monorepo rootDirectory workaround for the Vercel deploy, the search param driven filter pattern that feeds every dashboard surface, and the manifest enrichment pattern that keeps cross sprint widgets at zero First Load JS cost. Wire caseStudyUrl in portfolio.meta.json."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f31e W12.D1 - Sprint Intelligence light-mode theming pass",'
)
if old_first not in html:
    raise SystemExit("Could not locate W12.D1 activity entry")
html = html.replace(old_first, new_first, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = (
    "| **Current Week** | Week 12 of 18 (Project 3 wrap-up in flight) |\n"
    "| **Current Day** | Week 12 · Day 1 - Sprint Intelligence light-mode theming pass shipped."
)
md_new = (
    "| **Current Week** | Week 12 of 18 (Project 3 wrap-up in flight, 2 of 4 days closed) |\n"
    "| **Current Day** | Week 12 · Day 2 - Sprint Intelligence README polish + portfolioCard refresh + root README live demos refresh shipped."
)
if md_old in md:
    md = md.replace(md_old, md_new, 1)

# Also append a brief activity log entry to master-plan.md (top of activity log).
# The master-plan.md does not maintain an activity log mirror in the same shape
# as plan.html, but it has the "Current Day" cell which we already updated.
# No further edits needed in master-plan.md for this day.

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
