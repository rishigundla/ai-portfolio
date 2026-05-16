"""Log W9.D2 Sprint Intelligence work. Updates the W9.D2 task list to
match the four deliverables that actually shipped, marks them complete,
and adds a new activity entry to both plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

# --- plan.html ---------------------------------------------------------
html = plan_html.read_text(encoding="utf-8")

# Replace the W9.D2 day entry so the four shipped tasks line up.
old_day = (
    '{ num: "W9.D2", weekday: "Tue", name: "Sprint Selector + Shell", '
    'tasks: ["Dropdown to select sprint (42/43/44/45)", '
    '"Dashboard shell: brief panel (top), KPIs (middle), tabs (bottom)"] }'
)
new_day = (
    '{ num: "W9.D2", weekday: "Tue", name: "Sprint gallery, dashboard shell, typed loaders", '
    'tasks: ["lib/sprints.ts manifest loader with TeamMember, SprintSummary, status icons, and color classes", '
    '"lib/full-sprints.ts per id loader with SprintFixture and TicketSpec types plus ticketsByStatus and ticketsByAssignee helpers", '
    '"Sprint gallery at /sprints with four cards, status badges, date ranges, and ticket counts", '
    '"Dashboard shell at /sprint/[id] with brief panel, KPI slot grid, and per engineer deep dive sections plus generateStaticParams over four sprints"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W9.D2 day entry")
html = html.replace(old_day, new_day, 1)

# Append four W9.D2 ids to completedTasks.
old_tail = (
    '        // Phase 3 · Week 9 · Day 1 (3 tasks - app scaffold, 4 sprint JSONs, manifest)\n'
    '        "9-W9.D1-0", "9-W9.D1-1", "9-W9.D1-2"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 1 (3 tasks - app scaffold, 4 sprint JSONs, manifest)\n'
    '        "9-W9.D1-0", "9-W9.D1-1", "9-W9.D1-2",\n'
    '        // Phase 3 · Week 9 · Day 2 (4 tasks - manifest loader, full sprint loader, gallery, dashboard shell)\n'
    '        "9-W9.D2-0", "9-W9.D2-1", "9-W9.D2-2", "9-W9.D2-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D1 trailing block")
html = html.replace(old_tail, new_tail, 1)

# Insert a W9.D2 activity entry above the W9.D1 entry.
old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-16",\n'
    '          title: "\U0001f680 W9.D1 - Project 3 (Sprint Intelligence) kickoff",'
)
desc = (
    "Sprint Intelligence dashboard shell and typed loaders shipped. Mirrors Project 2 split: "
    "manifest only loader is light, full sprint loader is heavy, tree shaken per route. "
    "lib/sprints.ts wraps the manifest with TeamMember, SprintSummary, SprintStatus, "
    "ColorToken, status icon mapping, color class sets per token (accent, purple, blue, "
    "amber, rose, teal, green), formatSprintDateRange, and sprintDaysElapsed helpers. "
    "lib/full-sprints.ts static imports the four sprint JSONs, exports SprintFixture and "
    "TicketSpec with explicit TicketStatus, TicketType, and TicketPriority unions, plus "
    "ticketsByStatus, ticketsByAssignee, and sumEstimates helpers used by the KPI math "
    "landing in W9.D3 to D4. Real gallery at /sprints renders four cards in a two column "
    "responsive grid. Each card surfaces the sprint name, status badge with icon and "
    "pulsing dot for the in flight sprint, date range, tagline, ticket count, team size, "
    "and capacity. Hover lifts the border and slides the arrow. Dashboard shell at "
    "/sprint/[id] generates static params over all four sprint ids so each route "
    "prerenders. Header shows the status badge, sprint name, goal pulled from the fixture "
    "metadata, date range with elapsed days, ticket count, and the planned versus final "
    "scope split. Body is three labeled sections (Meeting brief, Team KPIs, Per engineer "
    "deep dive) with eyebrow numbering, descriptive subhead naming the future delivery day "
    "for each, and a placeholder zone where the real KPI cards arrive on W9.D3. BUILD "
    "CLEAN: nine routes prerendered (three static plus four SSG /sprint/[slug] plus two "
    "icons), 102 kB First Load JS shared. Type check clean after one strict null fix in "
    "ticketsByAssignee."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f9ed W9.D2 - Sprint Intelligence gallery, dashboard shell, typed loaders",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W9.D3 - Team level KPIs. Sprint burndown chart with ideal versus actual line, velocity bar versus four sprint baseline, status distribution donut, blocked ticket count and aging. Render inside the Team KPIs section. Drop the placeholder zone."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-16",\n'
    '          title: "\U0001f680 W9.D1 - Project 3 (Sprint Intelligence) kickoff",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

# Update Current Day in the status object.
old_day_row = (
    '"Week 9 · Day 1 - Project 3 (Sprint Intelligence) scaffold shipped. '
    'apps/sprint-intelligence/ mirroring the narrative generator bootstrap, '
    'four synthetic sprint fixtures, build clean."'
)
new_day_row = (
    '"Week 9 · Day 2 - Sprint Intelligence gallery and dashboard shell live. '
    'lib/sprints.ts manifest loader and lib/full-sprints.ts per id loader in place, '
    'four sprint pages prerender as SSG."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

# --- master-plan.md ---------------------------------------------------
md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-16 · \U0001f680 W9.D1 - Project 3 (Sprint Intelligence) kickoff"
md_new = (
    "### 2026-05-17 · \U0001f9ed W9.D2 - Sprint Intelligence gallery, dashboard shell, typed loaders\n"
    "- **Typed loaders.** `lib/sprints.ts` wraps the manifest with `TeamMember`, `SprintSummary`, `SprintStatus`, `ColorToken`, status icon mapping, color class sets per token (`accent`, `purple`, `blue`, `amber`, `rose`, `teal`, `green`), and `formatSprintDateRange` plus `sprintDaysElapsed` helpers. `lib/full-sprints.ts` static imports the four sprint JSONs, exports `SprintFixture` and `TicketSpec` with explicit `TicketStatus`, `TicketType`, and `TicketPriority` unions, plus `ticketsByStatus`, `ticketsByAssignee`, and `sumEstimates` helpers used by the KPI math landing in W9.D3 to D4.\n"
    "- **Real gallery at `/sprints`.** Four cards in a two column responsive grid. Each card surfaces the sprint name, status badge with icon and a pulsing dot for the in flight sprint, date range, tagline, ticket count, team size, and capacity. Hover lifts the border and slides the arrow.\n"
    "- **Dashboard shell at `/sprint/[id]`.** Generates static params over all four sprint ids so each route prerenders. Header shows the status badge, sprint name, goal pulled from the fixture metadata, date range with elapsed days, ticket count, and planned versus final scope. Body is three labeled sections (`Meeting brief`, `Team KPIs`, `Per engineer deep dive`) with eyebrow numbering, descriptive subhead naming the future delivery day for each, and a placeholder zone where the real KPI cards arrive on W9.D3.\n"
    "- **Build clean.** Nine routes prerendered (three static plus four SSG `/sprint/[id]` plus two icons), 102 kB First Load JS shared. Type check clean after one strict null fix in `ticketsByAssignee`.\n"
    "- **Next**: W9.D3 team level KPIs. Sprint burndown chart with ideal versus actual line, velocity bar versus four sprint baseline, status distribution donut, blocked ticket count and aging. Render inside the Team KPIs section. Drop the placeholder zone.\n"
    "\n"
    "### 2026-05-16 · \U0001f680 W9.D1 - Project 3 (Sprint Intelligence) kickoff"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D1 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

# Update Current Day
md_old_day = (
    "| **Current Day** | Week 9 · Day 1 - Project 3 (Sprint Intelligence) scaffold shipped. "
    "`apps/sprint-intelligence/` mirroring the narrative generator bootstrap, "
    "four synthetic sprint fixtures, build clean. |"
)
md_new_day = (
    "| **Current Day** | Week 9 · Day 2 - Sprint Intelligence gallery and dashboard shell live. "
    "`lib/sprints.ts` manifest loader and `lib/full-sprints.ts` per id loader in place, "
    "four sprint pages prerender as SSG. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
