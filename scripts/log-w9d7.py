"""Log W9.D7 streaming brief panel in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Rewrite W9.D7 day to match the shipped scope.
old_day = (
    '{ num: "W9.D7", weekday: "Sun", name: "Streaming Brief Panel", '
    'tasks: ["Top panel streams brief on sprint load", '
    '"Regenerate button to replay streaming"] }'
)
new_day = (
    '{ num: "W9.D7", weekday: "Sun", name: "Streaming meeting brief panel", '
    'tasks: ["StreamingBriefPanel client component using replayFixture and AiNarrativeBlock", '
    '"Five step progress strip advancing as Executive summary, Highlights, Watch list, Recommendations, Talking points markers appear", '
    '"Cancel button during streaming plus Replay button on completion", '
    '"Wired into Section 1 of /sprint/[id] so the brief lands on page load above the KPIs"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W9.D7 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 9 · Day 6 (4 tasks - four brief fixtures, five section structure, fixture grounded prose, loader)\n'
    '        "9-W9.D6-0", "9-W9.D6-1", "9-W9.D6-2", "9-W9.D6-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 6 (4 tasks - four brief fixtures, five section structure, fixture grounded prose, loader)\n'
    '        "9-W9.D6-0", "9-W9.D6-1", "9-W9.D6-2", "9-W9.D6-3",\n'
    '        // Phase 3 · Week 9 · Day 7 (4 tasks - StreamingBriefPanel component, progress strip, cancel and replay, page wiring)\n'
    '        "9-W9.D7-0", "9-W9.D7-1", "9-W9.D7-2", "9-W9.D7-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D6 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4dd W9.D6 - Sprint Intelligence meeting brief fixtures and loader",'
)
desc = (
    "Streaming meeting brief panel landed on /sprint/[id]. StreamingBriefPanel is a small "
    "client component that auto starts on mount, calls replayFixture from @rishi/ai-core with "
    "the brief from lib/briefs.ts, and pushes each streamed chunk into AiNarrativeBlock for "
    "the typed cursor animation. Five step progress strip sits above the narrative block and "
    "advances as the section markers appear in the streamed text (Executive summary, "
    "Highlights, Watch list, Recommendations, Talking points). Same pattern as the Project 2 "
    "narrative generator panel, same primitives, same 60 chars per second cadence. Controls "
    "row above the strip shows the live status (Claude is writing the brief... while "
    "streaming, Brief complete on done), with a Cancel button visible only while streaming "
    "and a Replay button visible only on completion. Wired into Section 1 of the sprint "
    "detail page so the brief lands above the team KPIs. The fixture.metadata.summary string "
    "still renders as a fallback if a brief is missing for a sprint id, but all four sprints "
    "have briefs in the loader. BUILD CLEAN through direct next build. /sprint/[id] First "
    "Load JS jumped from 3.08 kB to 49.8 kB (162 kB total) because the panel pulls in "
    "@rishi/ai-core plus react-markdown via AiNarrativeBlock. Same scale as Project 2 (48 kB "
    "for the same primitive chain). Type check clean. Week 9 closes Project 3 core build "
    "(seven of seven days done). W10 covers polish plus deploy."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f399️ W9.D7 - Sprint Intelligence streaming meeting brief panel",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W10.D1 - polish pass. Interactions plus drill downs. Click engineer name in EngineerTabs filters tickets to that person. Click a blocker shows the blocker history note in a dialog. Mobile responsive polish for the dashboard."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4dd W9.D6 - Sprint Intelligence meeting brief fixtures and loader",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 9 · Day 6 - Four meeting brief fixtures shipped under fixtures/sprint-intelligence/briefs/ '
    'with the five section structure (Executive summary, Highlights, Watch list, Recommendations, '
    'Talking points). lib/briefs.ts loader exposes getBrief, getAllBriefs, and BRIEF_SECTIONS."'
)
new_day_row = (
    '"Week 9 · CLOSED - Project 3 core build complete. /sprint/[id] now leads with a '
    'streaming meeting brief (Section 1), eight team KPI cards across two rows (Section 2), '
    'and an eight engineer deep dive tab strip (Section 3). Project 3 W10 polish plus deploy next."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f4dd W9.D6 - Sprint Intelligence meeting brief fixtures and loader"
md_new = (
    "### 2026-05-17 · \U0001f399️ W9.D7 - Sprint Intelligence streaming meeting brief panel\n"
    "- **`StreamingBriefPanel` client component.** Auto starts on mount. Calls `replayFixture` from `@rishi/ai-core` with the brief from `lib/briefs.ts` and pushes each streamed chunk into `AiNarrativeBlock` for the typed cursor animation. Same pattern as the Project 2 narrative generator panel, same primitives, same 60 chars per second cadence.\n"
    "- **Five step progress strip.** Sits above the narrative block. Advances as section markers (`Executive summary`, `Highlights`, `Watch list`, `Recommendations`, `Talking points`) appear in the streamed text. Status row reads `Claude is writing the brief...` while streaming, `Brief complete` on done.\n"
    "- **Controls.** A `Cancel` button is visible only while streaming, and a `Replay` button is visible only on completion.\n"
    "- **Wired into Section 1 of `/sprint/[id]`.** The brief lands above the team KPIs. The `fixture.metadata.summary` string still renders as a fallback if a brief is missing for a sprint id, but all four sprints have briefs in the loader so the streaming path is the default.\n"
    "- **Build clean** through direct `next build`. `/sprint/[id]` First Load JS jumped from 3.08 kB to 49.8 kB (162 kB total) because the panel pulls in `@rishi/ai-core` plus `react-markdown` via `AiNarrativeBlock`. Same scale as Project 2 (48 kB for the same primitive chain). Type check clean.\n"
    "- **Week 9 closed.** Project 3 core build complete (seven of seven days done). `/sprint/[id]` now reads as a coherent dashboard: streaming brief on top, eight KPI cards in the middle, eight engineer deep dive tabs at the bottom.\n"
    "- **Next**: W10.D1 - polish pass. Interactions plus drill downs. Click engineer name in `EngineerTabs` filters tickets to that person. Click a blocker shows the blocker history note in a dialog. Mobile responsive polish for the dashboard.\n"
    "\n"
    "### 2026-05-17 · \U0001f4dd W9.D6 - Sprint Intelligence meeting brief fixtures and loader"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D6 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 9 · Day 6 - Four meeting brief fixtures shipped under `fixtures/sprint-intelligence/briefs/` "
    "with the five section structure (Executive summary, Highlights, Watch list, Recommendations, Talking points). "
    "`lib/briefs.ts` loader exposes `getBrief`, `getAllBriefs`, and `BRIEF_SECTIONS`. |"
)
md_new_day = (
    "| **Current Day** | Week 9 · CLOSED - Project 3 core build complete. `/sprint/[id]` now leads with a "
    "streaming meeting brief (Section 1), eight team KPI cards across two rows (Section 2), and an eight "
    "engineer deep dive tab strip (Section 3). Project 3 W10 polish plus deploy next. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
