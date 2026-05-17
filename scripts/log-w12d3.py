"""Log W12.D3: Sprint Intelligence case study + caseStudyUrl wired + README cross-links."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_tail = (
    '        // Phase 3 · Week 12 · Day 2 (4 tasks - app README rewrite, portfolioCard refresh, root README demos refresh, plan files reflect 25 / 22 days for project 3)\n'
    '        "12-W12.D2-0", "12-W12.D2-1", "12-W12.D2-2", "12-W12.D2-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 12 · Day 2 (4 tasks - app README rewrite, portfolioCard refresh, root README demos refresh, plan files reflect 25 / 22 days for project 3)\n'
    '        "12-W12.D2-0", "12-W12.D2-1", "12-W12.D2-2", "12-W12.D2-3",\n'
    '        // Phase 3 · Week 12 · Day 3 (4 tasks - case study published, caseStudyUrl wired, READMEs link to case study, plan files reflect case study landed)\n'
    '        "12-W12.D3-0", "12-W12.D3-1", "12-W12.D3-2", "12-W12.D3-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W12.D2 completedTasks tail")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4dd W12.D2 - Sprint Intelligence README polish + portfolioCard refresh + root demos refresh",'
)
desc = (
    "Project 3 wrap-up day two. docs/case-studies/sprint-intelligence.md published, "
    "approximately 1500 words across nine sections mirroring docs/case-studies/narrative-generator.md. "
    "Hero blockquote plus Live + Source + Stack line. The problem section frames sprint review "
    "prep as the hour per cycle a lead loses consolidating Jira plus writing the one-page narrative. "
    "The approach section walks through the three steps: pick a monthly sprint, read the filterable "
    "analysis, take the AI brief into the room. Architecture section enumerates the fixture tree plus "
    "the lib tree plus the components tree. Key technical decisions section covers four: six monthly "
    "sprints over four bi-weekly, sequential per engineer queue scheduler over parallel, status driven "
    "sprint card colors over per sprint colors, chart palette tokens in the design system over "
    "hardcoded hex. Engineering moments section details three: the monorepo rootDirectory workaround "
    "for the Vercel deploy (recipe: vercel project add plus REST API PATCH), the search param driven "
    "filter pattern across every dashboard surface (one URL state feeds the KPI strips plus status "
    "mix plus blocked plus workload plus per engineer deep dive plus heatmap plus cross sprint history "
    "table plus trend charts), and the manifest enrichment pattern that keeps cross sprint widgets at "
    "zero First Load JS cost (closedCount, openCount, spCompleted, spTotal pre computed at fixture "
    "generation). What I would do differently section names the day count slip plus the hand curation "
    "limit plus the missing Tooltip primitive. Future work section names the per sprint comparison "
    "view, the activity heatmap drill in, and the real time data swap. Footer cross-links back to "
    "Projects 1 and 2 case studies plus the master plan plus the author site. caseStudyUrl wired in "
    "apps/sprint-intelligence/portfolio.meta.json to the GitHub blob URL. apps/sprint-intelligence/"
    "README.md case study line dropped the lands W12.D3 marker. Root README.md live demos list and "
    "five-projects table both replaced the case study lands W12.D3 marker with the actual case study "
    "link. Validator green."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4d6 W12.D3 - Sprint Intelligence case study published, caseStudyUrl wired, READMEs link to case study",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W12.D4 - v1.0-sprint-intelligence annotated git tag plus Cat A/B/C audit plus plan close. Add Project 3 Pending Follow-ups section in master-plan.md mirroring Projects 1 and 2 close-out structure. Cat A tech debt: prune dead TeamWorkloadCard.tsx, section eyebrow re-numbering on /sprint/[id] page.tsx. Cat C: real Tooltip primitive replacement of native title attributes for mobile. Push the annotated tag with a summary message. Flip Project 3 row to Shipped v1.0 in plan.html Phase Progress Overview tile plus master-plan.md table. Refresh Current Phase, Current Week, Current Day, Status, Next Action, Blockers cells."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4dd W12.D2 - Sprint Intelligence README polish + portfolioCard refresh + root demos refresh",'
)
if old_first not in html:
    raise SystemExit("Could not locate W12.D2 activity entry")
html = html.replace(old_first, new_first, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = (
    "| **Current Week** | Week 12 of 18 (Project 3 wrap-up in flight, 2 of 4 days closed) |\n"
    "| **Current Day** | Week 12 · Day 2 - Sprint Intelligence README polish + portfolioCard refresh + root README live demos refresh shipped."
)
md_new = (
    "| **Current Week** | Week 12 of 18 (Project 3 wrap-up in flight, 3 of 4 days closed) |\n"
    "| **Current Day** | Week 12 · Day 3 - Sprint Intelligence case study published at docs/case-studies/sprint-intelligence.md (~1500 words, nine sections, three engineering moments). caseStudyUrl wired in portfolio.meta.json. READMEs updated to link the published case study."
)
if md_old in md:
    md = md.replace(md_old, md_new, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
