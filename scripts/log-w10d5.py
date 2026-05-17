"""Log W10.D5 Vercel production deploy in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_day = (
    '{ num: "W10.D5", weekday: "Fri", name: "Deploy", '
    'tasks: ["Vercel production deploy", "portfolio.meta.json"] }'
)
new_day = (
    '{ num: "W10.D5", weekday: "Fri", name: "Vercel production deploy", '
    'tasks: ["New Vercel project ai-portfolio-sprint-intelligence created via vercel project add, link file lives at the repo root .vercel folder with each app keeping a copy in apps/<name>/.vercel for future swaps", '
    '"REST API PATCH set rootDirectory to apps/sprint-intelligence plus framework to nextjs so the monorepo deploy resolves pnpm workspace packages from the repo root then builds from the app subdir", '
    '"vercel --prod --yes from the repo root, build clean in Washington DC iad1 on Node 24 with turbo cache cold, 11 static pages generated, /sprint/[id] at 52.2 kB First Load JS, all four sprint slugs prerendered", '
    '"portfolio.meta.json populated with liveUrl https://ai-portfolio-sprint-intelligence.vercel.app and deployedAt 2026-05-17, README header updated with the live link, every route verified to return HTTP 200 via curl"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D5 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 10 · Day 4 (4 tasks - heading order fix, sprint detail metadata, gallery metadata, structural audit)\n'
    '        "10-W10.D4-0", "10-W10.D4-1", "10-W10.D4-2", "10-W10.D4-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 10 · Day 4 (4 tasks - heading order fix, sprint detail metadata, gallery metadata, structural audit)\n'
    '        "10-W10.D4-0", "10-W10.D4-1", "10-W10.D4-2", "10-W10.D4-3",\n'
    '        // Phase 3 · Week 10 · Day 5 (4 tasks - vercel project add, rootDirectory PATCH, production deploy from repo root, portfolio.meta.json plus README)\n'
    '        "10-W10.D5-0", "10-W10.D5-1", "10-W10.D5-2", "10-W10.D5-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W10.D4 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50d W10.D4 - Sprint Intelligence structural a11y plus SEO pass",'
)
desc = (
    "Project 3 is live in production at https://ai-portfolio-sprint-intelligence.vercel.app. "
    "New Vercel project ai-portfolio-sprint-intelligence created on the rishigundlas-projects "
    "team via vercel project add. First deploy attempt from inside apps/sprint-intelligence "
    "failed because the upload context did not include the workspace root and pnpm could not "
    "resolve @rishi/design-system or @rishi/ai-core. Swapped to the monorepo pattern: moved "
    "the link file to the repo root .vercel folder (each app keeps a copy at apps/<name>/.vercel "
    "for future swaps), then PATCH the project via the Vercel REST API to set rootDirectory to "
    "apps/sprint-intelligence plus framework to nextjs. Same workaround used for Project 2, "
    "because the CLI does not surface rootDirectory as a flag. Second deploy from the repo root "
    "ran clean. Vercel detected pnpm-workspace.yaml at the upload root, ran pnpm install for "
    "the whole workspace, then cd into apps/sprint-intelligence and ran the next build through "
    "turbo (38 second build, cold cache, Node 24 on iad1). Eleven static pages generated, "
    "/sprint/[id] First Load JS at 52.2 kB unchanged from the local build, all four sprint "
    "slugs prerendered. Aliased to the stable https://ai-portfolio-sprint-intelligence.vercel.app "
    "URL automatically. Smoke checks via curl on /, /sprints, /sprint/sprint-42, /sprint/sprint-44 "
    "all returned HTTP 200. Updated apps/sprint-intelligence/portfolio.meta.json with the live URL "
    "and deployedAt 2026-05-17, plus the app README header now points at the live link."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f680 W10.D5 - Sprint Intelligence live on production",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D6 - Write the Project 3 case study at docs/case-studies/sprint-intelligence.md. Mirror the narrative-generator case study structure: problem framing, approach, architecture, three engineering moments (the monorepo rootDirectory workaround, the streaming brief panel reuse, the per engineer deep dive URL state pattern), tech stack, impact. Then wire caseStudyUrl in portfolio.meta.json."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50d W10.D4 - Sprint Intelligence structural a11y plus SEO pass",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 4 - Structural a11y plus SEO pass done. Heading order fix on home, '
    'enriched generateMetadata on /sprint/[id] and /sprints with OpenGraph plus Twitter card. '
    'Lighthouse targets on production: 90 plus perf, 95 plus a11y, 100 BP, 100 SEO."'
)
new_day_row = (
    '"Week 10 · Day 5 - Project 3 live in production at ai-portfolio-sprint-intelligence.vercel.app. '
    'Monorepo rootDirectory pattern, eleven static pages, /sprint/[id] First Load JS at 52.2 kB. '
    'portfolio.meta.json populated with liveUrl plus deployedAt."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f50d W10.D4 - Sprint Intelligence structural a11y plus SEO pass"
md_new = (
    "### 2026-05-17 · \U0001f680 W10.D5 - Sprint Intelligence live on production\n"
    "- **Live URL**: <https://ai-portfolio-sprint-intelligence.vercel.app>. All four sprint slugs prerendered, every route returns 200.\n"
    "- **Vercel project**. Created `ai-portfolio-sprint-intelligence` on the `rishigundlas-projects` team via `vercel project add`. First deploy attempt from inside `apps/sprint-intelligence/` failed because the upload context did not include the workspace root and pnpm could not resolve `@rishi/design-system` or `@rishi/ai-core`.\n"
    "- **Monorepo rootDirectory pattern**. Moved the link file to the repo root `.vercel/` folder (each app keeps a copy at `apps/<name>/.vercel/` so the link is recoverable). PATCH the project via the Vercel REST API to set `rootDirectory: apps/sprint-intelligence` plus `framework: nextjs`. Same workaround used for Project 2, because the CLI does not surface `rootDirectory` as a flag.\n"
    "- **Production deploy**. Second `vercel --prod --yes` from the repo root ran clean. Vercel detected `pnpm-workspace.yaml` at the upload root, ran `pnpm install` for the whole workspace, then `cd` into `apps/sprint-intelligence` and ran the `next build` through turbo. 38 second build on Node 24 in iad1 with a cold cache. Eleven static pages, `/sprint/[id]` at 52.2 kB First Load JS, four sprint slugs SSG.\n"
    "- **`portfolio.meta.json`**. Populated `liveUrl: https://ai-portfolio-sprint-intelligence.vercel.app` and `deployedAt: 2026-05-17`. `caseStudyUrl` and `loomUrl` left empty (case study lands W10.D6, Loom skipped same as Projects 1 and 2 per the W5.D5 scope call).\n"
    "- **README** header updated to point at the live link.\n"
    "- **Next**: W10.D6 - Write the Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Mirror the narrative-generator case study structure: problem framing, approach, architecture, three engineering moments (the monorepo rootDirectory workaround, the streaming brief panel reuse, the per engineer deep dive URL state pattern), tech stack, impact. Then wire `caseStudyUrl` in `portfolio.meta.json`.\n"
    "\n"
    "### 2026-05-17 · \U0001f50d W10.D4 - Sprint Intelligence structural a11y plus SEO pass"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D4 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 4 - Structural a11y plus SEO pass done. Heading order fix on home, "
    "enriched `generateMetadata` on `/sprint/[id]` and `/sprints` with OpenGraph plus Twitter card. "
    "Lighthouse targets on production: 90 plus perf, 95 plus a11y, 100 BP, 100 SEO. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 5 - Project 3 live at "
    "`ai-portfolio-sprint-intelligence.vercel.app`. Monorepo rootDirectory pattern, eleven static "
    "pages, `/sprint/[id]` at 52.2 kB First Load JS, `portfolio.meta.json` populated. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
