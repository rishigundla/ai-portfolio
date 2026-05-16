"""Log W9.D1 Project 3 kickoff into the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

# --- plan.html ---------------------------------------------------------
html = plan_html.read_text(encoding="utf-8")

# Append W9.D1 ids to completedTasks (3 tasks per the weeksPlan day entry).
old_tail = (
    '        // Phase 2 · Week 7 · Day 7 (3 tasks - buffer day, lessons learned note, Phase 3 preview)\n'
    '        "7-W7.D7-0", "7-W7.D7-1", "7-W7.D7-2"\n'
    "      ],"
)
new_tail = (
    '        // Phase 2 · Week 7 · Day 7 (3 tasks - buffer day, lessons learned note, Phase 3 preview)\n'
    '        "7-W7.D7-0", "7-W7.D7-1", "7-W7.D7-2",\n'
    '        // Phase 3 · Week 9 · Day 1 (3 tasks - app scaffold, 4 sprint JSONs, manifest)\n'
    '        "9-W9.D1-0", "9-W9.D1-1", "9-W9.D1-2"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W7.D7 trailing block")
html = html.replace(old_tail, new_tail, 1)

# Insert a new activity entry above the W7.D6 to D7 closing entry.
old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-16",\n'
    '          title: "\U0001f381 W7.D6-D7 - Project 2 post v1.0 polish round and final wrap",'
)
desc = (
    "Project 3 (Sprint Intelligence) kickoff. apps/sprint-intelligence/ scaffold shipped "
    "matching the narrative generator bootstrap pattern. package.json (port 3004), next.config, "
    "tailwind preset, tsconfig, postcss, .gitignore, portfolio.meta.json skeleton, README, and "
    "the app shell layout with ParticleBackground, ThemeProvider, Nav, and a footer credit row "
    "all in place. Four route surfaces stubbed: / (home with three step pitch), /sprints "
    "(placeholder gallery), /sprint/[id] (placeholder detail), plus auto generated /icon and "
    "/apple-icon (SI wordmark on a teal accent gradient). Four synthetic sprint fixtures "
    "authored under fixtures/sprint-intelligence/sprints/. Sprint 42 (Healthy completion, 22 "
    "tickets, dashboard redesign plus new auth flow shipped on plan). Sprint 43 (Scope creep, "
    "22 to 28 tickets after a customer escalation on day four, velocity 73 SP). Sprint 44 "
    "(Blocked sprint, identity provider breaking change blocked three engineers for nine "
    "days, velocity 41 SP). Sprint 45 (Currently in flight, day eight of fourteen, onboarding "
    "redesign behind a flag plus analytics revamp tab plus auth migration retry). Each fixture "
    "carries 22 to 28 tickets with id, title, type (story/bug/task/spike), assignee, status "
    "(done/in-progress/in-review/todo/blocked), priority (P0 to P3), estimate (story points), "
    "labels, and a flag for tickets added mid sprint. Shared team of 8 engineers (3 senior, 3 "
    "mid, 1 junior, 1 EM) with role and capacity per engineer (total capacity 81 SP per "
    "sprint). Manifest at fixtures/sprint-intelligence/sprints/index.json drives the gallery. "
    "BUILD VERIFIED: pnpm install picked up the new workspace, pnpm --filter sprint-intelligence "
    "build emits 7 routes (3 static plus 2 dynamic for /sprint/[id] plus 2 icon routes), 102 kB "
    "First Load JS shared. Type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-16",\n'
    '          title: "\U0001f680 W9.D1 - Project 3 (Sprint Intelligence) kickoff",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W9.D2 - sprint selector dropdown, dashboard shell with three column structure (brief panel top, KPIs middle, deep dive tabs bottom), lib/sprints.ts manifest loader, lib/full-sprints.ts per id loader."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-16",\n'
    '          title: "\U0001f381 W7.D6-D7 - Project 2 post v1.0 polish round and final wrap",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

# Update Current Phase + Current Day in the in-script status object.
old_phase = '"Phase 2 · CLOSED → Phase 3 (Sprint Intelligence) awaits"'
new_phase = '"Phase 3 · Project 3 (Sprint Intelligence) IN PROGRESS"'
if old_phase in html:
    html = html.replace(old_phase, new_phase, 1)

old_day = (
    '"Week 7 · CLOSED - Project 2 SHIPPED v1.0 (v1.0-narrative-generator tagged) plus '
    'post v1.0 polish round (W7.D6-D7 closed Cat A 1 plus deck redesign plus plan website hardening). '
    'Awaiting confirmation to begin Project 3."'
)
new_day = (
    '"Week 9 · Day 1 - Project 3 (Sprint Intelligence) scaffold shipped. apps/sprint-intelligence/ '
    'mirroring the narrative generator bootstrap, four synthetic sprint fixtures, build clean."'
)
if old_day in html:
    html = html.replace(old_day, new_day, 1)

old_next = (
    '"Awaiting user confirmation before starting Project 3 (Sprint Intelligence). Per the 14-week plan, '
    'Project 3 is synthetic sprints → team + individual KPIs → AI meeting brief.'
)
if old_next in html:
    # truncate the long old nextAction string; we replace it via partial match
    start = html.find(old_next)
    # find the end of the string literal (next unescaped quote)
    end = start + len(old_next)
    while end < len(html) and html[end] != '"':
        if html[end] == '\\':
            end += 2
        else:
            end += 1
    html = (
        html[:start]
        + '"W9.D2 sprint selector dropdown plus dashboard shell with three column structure plus lib loaders. Then W9.D3 to W9.D5 build out team and individual KPIs, W9.D6 to D7 wire the streaming brief panel, W10 polish and deploy."'
        + html[end + 1 :]
    )

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

# --- master-plan.md ---------------------------------------------------
md = plan_md.read_text(encoding="utf-8")

# Insert a new activity entry above W7.D6-D7
md_old = "### 2026-05-16 · \U0001f381 W7.D6-D7 - Project 2 post v1.0 polish round and final wrap"
md_new = (
    "### 2026-05-16 · \U0001f680 W9.D1 - Project 3 (Sprint Intelligence) kickoff\n"
    "- **App scaffold shipped.** `apps/sprint-intelligence/` mirrors the narrative generator bootstrap pattern. `package.json` (port 3004), `next.config`, tailwind preset, tsconfig, postcss, `.gitignore`, `portfolio.meta.json` skeleton, `README`, and the app shell with `ParticleBackground`, `ThemeProvider`, `Nav`, and a footer credit row all in place.\n"
    "- **Four route surfaces stubbed.** `/` home with the three step pitch, `/sprints` placeholder gallery, `/sprint/[id]` placeholder detail, plus auto generated `/icon` and `/apple-icon` (SI wordmark on a teal accent gradient).\n"
    "- **Four synthetic sprint fixtures authored.** `fixtures/sprint-intelligence/sprints/sprint-42.json` (healthy, 22 tickets, dashboard redesign plus auth flow shipped on plan). `sprint-43.json` (scope creep, 22 to 28 tickets after a day four customer escalation, velocity 73 SP). `sprint-44.json` (blocked, identity provider breaking change idled three engineers for nine days, velocity 41 SP). `sprint-45.json` (in flight, day eight of fourteen, onboarding redesign behind a flag plus analytics revamp plus auth migration retry).\n"
    "- **Ticket schema.** Each fixture carries 22 to 28 tickets with id, title, type (story/bug/task/spike), assignee, status (done/in-progress/in-review/todo/blocked), priority (P0 to P3), estimate (story points), labels, and `addedMidSprint` flag. Blocked tickets carry a `blockerNote`.\n"
    "- **Shared team of eight engineers.** Three senior, three mid, one junior, one engineering manager. Each with role and capacity. Total sprint capacity 81 SP. Manifest at `fixtures/sprint-intelligence/sprints/index.json` drives the gallery.\n"
    "- **Build verified.** `pnpm install` picked up the new workspace cleanly. `pnpm --filter sprint-intelligence build` emits seven routes (three static plus two dynamic for `/sprint/[id]` plus two icon routes), 102 kB First Load JS shared. Type check clean.\n"
    "- **Next**: W9.D2 sprint selector dropdown, dashboard shell with three column structure (brief panel top, KPIs middle, deep dive tabs bottom), `lib/sprints.ts` manifest loader and `lib/full-sprints.ts` per id loader mirroring the narrative generator split pattern.\n"
    "\n"
    "### 2026-05-16 · \U0001f381 W7.D6-D7 - Project 2 post v1.0 polish round and final wrap"
)
if md_old not in md:
    raise SystemExit("Could not locate W7.D6-D7 heading")
md = md.replace(md_old, md_new, 1)

# Update Current Phase row
md_old_phase = "| **Current Phase** | Phase 2 · CLOSED → Phase 3 (Sprint Intelligence) awaits |"
md_new_phase = "| **Current Phase** | Phase 3 · Project 3 (Sprint Intelligence) IN PROGRESS |"
if md_old_phase in md:
    md = md.replace(md_old_phase, md_new_phase, 1)

md_old_day = (
    "| **Current Day** | Week 7 · CLOSED - Project 2 SHIPPED v1.0 "
    "(`v1.0-narrative-generator` tagged) plus post v1.0 polish round (W7.D6-D7 "
    "closed Cat A 1 plus deck redesign plus plan website hardening). "
    "**Awaiting confirmation to begin Project 3.** |"
)
md_new_day = (
    "| **Current Day** | Week 9 · Day 1 - Project 3 (Sprint Intelligence) scaffold shipped. "
    "`apps/sprint-intelligence/` mirroring the narrative generator bootstrap, "
    "four synthetic sprint fixtures, build clean. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
