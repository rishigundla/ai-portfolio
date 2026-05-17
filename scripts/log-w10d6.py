"""Log W10.D6 monthly sprint model refactor and 6-card gallery."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_day = (
    '{ num: "W10.D6", weekday: "Sat", name: "Case Study + Automation", '
    'tasks: ["Write case study MDX", "Trigger automation, merge PRs"] }'
)
new_day = (
    '{ num: "W10.D6", weekday: "Sat", name: "Sprint model refactor and 6-card gallery", '
    'tasks: ["Replaced the four bi-weekly sprints (sprint-42..sprint-45) with six monthly sprints (jan-2026..jun-2026): four completed, one in flight (may, day 17 of 31), one backlog (jun, status planned). New fixtures authored via scripts/generate-monthly-sprints.py with 138 hand curated tickets across the six sprints", '
    '"Ticket schema expanded: TicketType enum is now bug, development, enhancement, deployment (replaces story, bug, task, spike). Every ticket now carries eta (string or null) and createdAt (ISO date) fields to feed the Missing ETA, Overdue, and per ticket cycle time tiles landing in W10.D7 and W10.D8", '
    '"Sprint card colors are now status-driven (getStatusColorToken helper): completed sprints render green, in flight sprint renders amber, planned sprint renders slate. New slate ColorToken added to the design system map. Per sprint colorToken on the manifest is now optional and unused by the new monthly sprints", '
    '"/sprints gallery moved from a two-column grid to a three-column grid on xl viewports (two on md). Six brief fixtures hand authored (jun is a planning brief with allocation highlights plus a watch list rather than a retrospective). Home page step card copy refreshed to call out the four completed plus one in flight plus one backlog story. Build clean: 13 static pages, /sprint/[id] First Load JS at 52.2 kB unchanged"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W10.D6 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 10 · Day 5 (4 tasks - vercel project add, rootDirectory PATCH, production deploy from repo root, portfolio.meta.json plus README)\n'
    '        "10-W10.D5-0", "10-W10.D5-1", "10-W10.D5-2", "10-W10.D5-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 10 · Day 5 (4 tasks - vercel project add, rootDirectory PATCH, production deploy from repo root, portfolio.meta.json plus README)\n'
    '        "10-W10.D5-0", "10-W10.D5-1", "10-W10.D5-2", "10-W10.D5-3",\n'
    '        // Phase 3 · Week 10 · Day 6 (4 tasks - 6 monthly sprint fixtures, ticket schema with eta + createdAt + 4 new types, status-driven colors with slate token, 3-column gallery + 6 brief fixtures)\n'
    '        "10-W10.D6-0", "10-W10.D6-1", "10-W10.D6-2", "10-W10.D6-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W10.D5 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f680 W10.D5 - Sprint Intelligence live on production",'
)
desc = (
    "Sprint Intelligence sprint model rebuilt around calendar months. Replaced the four bi-weekly "
    "sprints sprint-42 through sprint-45 with six monthly sprints jan-2026 through jun-2026. Four "
    "are completed (jan healthy, feb scope creep absorbed, mar blocked on the auth migration, apr "
    "recovered), may is in flight at day 17 of 31, and jun is the backlog sprint that the manager "
    "has already filled with sixteen earmarked tickets across payments v2, mobile app v2 scaffold, "
    "and the telemetry pipeline groundwork. New fixtures were authored via "
    "scripts/generate-monthly-sprints.py with 138 hand curated tickets across the six sprints, plus "
    "scripts/generate-monthly-briefs.py for the six meeting briefs. Brief fixtures keep the same "
    "five section markdown structure (Executive summary, Highlights, Watch list, Recommendations, "
    "Talking points) for the five completed and in flight sprints; the jun planning brief swaps "
    "Executive summary for a Planning summary plus an Allocation highlights section so the tone is "
    "forward looking instead of retrospective. Ticket schema expanded: TicketType enum is now bug, "
    "development, enhancement, deployment (replaces story, bug, task, spike). Every ticket now "
    "carries eta (string or null) and createdAt (ISO date) so the Missing ETA, Overdue, and per "
    "ticket cycle time tiles landing in W10.D7 and W10.D8 have something to read. Sprint card "
    "colors are now status driven via a new getStatusColorToken helper: completed sprints render "
    "green, in flight sprint renders amber, planned sprint renders slate. New slate ColorToken "
    "added to the design system color class map (grey gradient over base-800, slate-200 to slate-400 "
    "text shades). The per sprint colorToken on the manifest is now optional and unused by the new "
    "monthly sprints. /sprints gallery layout shifted from two columns at lg to three columns at xl "
    "(two at md), so six cards render two rows of three on wide screens. Home page step card copy "
    "updated to call out the four completed plus one in flight plus one backlog story. Sprint "
    "detail page reads the color token from status instead of the dropped fixture field. Build "
    "clean via direct next build: 13 static pages (was 11), six sprint slugs prerendered, "
    "/sprint/[id] First Load JS unchanged at 52.2 kB. Type check clean. No deploy this day."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4c5 W10.D6 - Sprint Intelligence monthly sprint model and 6-card gallery",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D7 - Filter bar plus KPI strip rewrite. Add a SprintFilters client component (assignee plus ticket type plus status selectors that read and write search params). Add a TopKpiStrip server component (Total Tickets, Completion %, Done, In Review, In Progress, Open, Avg Cycle Time). Add a StoryPointsStrip server component (SP Completed, In Progress, In Review, Open, Total, Missing). Wire searchParams through page.tsx to filter every downstream KPI. Move the AI brief from the top of the page to the bottom."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f680 W10.D5 - Sprint Intelligence live on production",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 5 - Project 3 live in production at ai-portfolio-sprint-intelligence.vercel.app. '
    'Monorepo rootDirectory pattern, eleven static pages, /sprint/[id] First Load JS at 52.2 kB. '
    'portfolio.meta.json populated with liveUrl plus deployedAt."'
)
new_day_row = (
    '"Week 10 · Day 6 - Sprint model rebuilt around calendar months. Six monthly sprint fixtures '
    '(jan to jun 2026), four ticket types, eta plus createdAt added. Status-driven colors with a '
    'new slate token. Build clean: 13 static pages, /sprint/[id] First Load JS 52.2 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f680 W10.D5 - Sprint Intelligence live on production"
md_new = (
    "### 2026-05-17 · \U0001f4c5 W10.D6 - Sprint Intelligence monthly sprint model and 6-card gallery\n"
    "- **Six monthly sprints replace the bi-weekly four.** `jan-2026` through `jun-2026`. Four completed (jan healthy, feb scope creep absorbed, mar blocked, apr recovered), may in flight at day 17 of 31, jun is the backlog sprint with sixteen tickets already earmarked across payments v2, mobile app v2 scaffold, and the telemetry pipeline groundwork.\n"
    "- **Generator scripts** keep the bulk reproducible. `scripts/generate-monthly-sprints.py` authors 138 hand curated tickets across the six sprints and computes burndown, cycle time, and per engineer cycle time from the ticket data. `scripts/generate-monthly-briefs.py` emits the six brief fixtures.\n"
    "- **Ticket schema expanded.** `TicketType` is now `bug | development | enhancement | deployment` (replaces story / bug / task / spike). Every ticket carries `eta: string | null` and `createdAt: string` so the W10.D7 KPI strip and the W10.D8 per ticket charts have data to read.\n"
    "- **Status driven colors.** New `getStatusColorToken(status)` helper maps `completed` to green, `in-progress` to amber, `planned` to slate. New `slate` `ColorToken` added to the design system color map (grey gradient, slate-200 to slate-400 shades). Per sprint `colorToken` on the manifest is now optional and unused.\n"
    "- **Gallery layout.** Three column grid at `xl` (was two at `lg`), two columns at `md`, one column on mobile. Header copy now reads 'Six monthly sprints across the first half of 2026'. Backlog cards show 'X backlog' instead of 'X tickets' in the meta strip.\n"
    "- **Briefs** kept the same five section markdown structure for the five retrospective briefs. The June planning brief swaps Executive summary for Planning summary plus an Allocation highlights section, so the tone is forward looking (what to watch for next cycle).\n"
    "- **Build clean** via direct `next build`. 13 static pages (was 11), six sprint slugs prerendered, `/sprint/[id]` First Load JS unchanged at 52.2 kB. Type check clean. No deploy this day.\n"
    "- **Next**: W10.D7 - Filter bar plus KPI strip rewrite. Add a `SprintFilters` client component, a `TopKpiStrip` server component, and a `StoryPointsStrip` server component. Wire `searchParams` through `page.tsx` to filter every downstream KPI. Move the AI brief from the top of the page to the bottom.\n"
    "\n"
    "### 2026-05-17 · \U0001f680 W10.D5 - Sprint Intelligence live on production"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D5 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 5 - Project 3 live at "
    "`ai-portfolio-sprint-intelligence.vercel.app`. Monorepo rootDirectory pattern, eleven static "
    "pages, `/sprint/[id]` at 52.2 kB First Load JS, `portfolio.meta.json` populated. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 6 - Sprint model rebuilt around calendar months. Six "
    "monthly sprint fixtures (`jan` to `jun` 2026), four ticket types, `eta` plus `createdAt` "
    "added. Status-driven colors with a new `slate` token. Build clean: 13 static pages. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
