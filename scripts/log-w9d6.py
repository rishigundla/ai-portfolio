"""Log W9.D6 meeting brief fixtures in the plan files."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

# Rewrite W9.D6 day to reflect what actually shipped (four briefs plus a loader).
old_day = (
    '{ num: "W9.D6", weekday: "Sat", name: "Generate Meeting Brief Fixtures", '
    'tasks: ["Use Claude Code to generate brief per sprint", '
    '"Each: exec summary, highlights, watch list, recommendations, talking points"] }'
)
new_day = (
    '{ num: "W9.D6", weekday: "Sat", name: "Meeting brief fixtures and the brief loader", '
    'tasks: ["Four hand curated brief JSON fixtures under fixtures/sprint-intelligence/briefs/ (sprint 42 healthy, sprint 43 scope creep, sprint 44 blocked, sprint 45 in flight)", '
    '"Each brief carries five sections: Executive summary, Highlights, Watch list, Recommendations, Talking points", '
    '"References fixture values verbatim (velocity, baseline, carryover counts, blocker context) so the prose stays grounded", '
    '"lib/briefs.ts loader with section heading constants and a per id getBrief plus getAllBriefs export"] }'
)
if old_day not in html:
    raise SystemExit("Could not locate W9.D6 day entry")
html = html.replace(old_day, new_day, 1)

old_tail = (
    '        // Phase 3 · Week 9 · Day 5 (5 tasks - engineer tabs, workload score, completion rate, personal cycle time, review queue)\n'
    '        "9-W9.D5-0", "9-W9.D5-1", "9-W9.D5-2", "9-W9.D5-3", "9-W9.D5-4"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 9 · Day 5 (5 tasks - engineer tabs, workload score, completion rate, personal cycle time, review queue)\n'
    '        "9-W9.D5-0", "9-W9.D5-1", "9-W9.D5-2", "9-W9.D5-3", "9-W9.D5-4",\n'
    '        // Phase 3 · Week 9 · Day 6 (4 tasks - four brief fixtures, five section structure, fixture grounded prose, loader)\n'
    '        "9-W9.D6-0", "9-W9.D6-1", "9-W9.D6-2", "9-W9.D6-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W9.D5 trailing block")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-20",\n'
    '          title: "\U0001f465 W9.D5 - Sprint Intelligence per engineer deep dive tabs",'
)
desc = (
    "Four hand curated meeting brief fixtures landed under fixtures/sprint-intelligence/briefs/. "
    "One per sprint. Each brief carries the same five section structure (Executive summary, "
    "Highlights, Watch list, Recommendations, Talking points), matching the markdown section "
    "pattern Project 2's narrative fixtures used. Each brief references the corresponding "
    "fixture verbatim: sprint 42 mentions the 67 SP velocity against a 58 SP baseline, the 1.8 "
    "day cycle time improvement, and the two P3 carryovers. Sprint 43 calls out the day four "
    "Acme escalation that expanded scope from 22 to 28 tickets with a 73 SP close. Sprint 44 "
    "frames the identity provider blocker as a process failure of the upstream provider rather "
    "than a team execution failure, salvaged value at 41 SP. Sprint 45 is mid flight with a "
    "concrete war room recommendation for the day twelve auth cutover. Each brief reads as "
    "leadership grade prose with one to three sentence paragraphs, bold callouts on the "
    "headline metrics, and a five bullet talking points section. lib/briefs.ts loader follows "
    "Project 2's narratives loader pattern: static imports the four JSONs, exports BRIEF_SECTIONS "
    "metadata with section markers, and exposes getBrief plus getAllBriefs. The Fixture shape "
    "is the same @rishi/ai-core type that replayFixture consumes so W9.D7 can stream the brief "
    "without any glue. BUILD CLEAN: ten routes prerendered through next build directly (turbo "
    "parallelism was racing on .next writes, direct next build sidesteps the issue). "
    "/sprint/[id] First Load JS is 108 kB after the EngineerTabs client bundle, baseline 102 "
    "kB shared. Type check clean."
)
new_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4dd W9.D6 - Sprint Intelligence meeting brief fixtures and loader",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W9.D7 - StreamingBriefPanel client component on /sprint/[id]. Mirror Project 2 pattern: replayFixture streams the brief markdown into AiNarrativeBlock, five step progress strip advances as section headings appear, Cancel and Replay buttons available, panel sits as Section 0 above the team header so the brief lands first."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-20",\n'
    '          title: "\U0001f465 W9.D5 - Sprint Intelligence per engineer deep dive tabs",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 9 · Day 5 - Per engineer deep dive tabs live. EngineerTabs swaps content for eight '
    'team members, each panel shows workload, completion, personal cycle time, and review '
    'queue tiles plus priority mix and assigned ticket list."'
)
new_day_row = (
    '"Week 9 · Day 6 - Four meeting brief fixtures shipped under fixtures/sprint-intelligence/briefs/ '
    'with the five section structure (Executive summary, Highlights, Watch list, Recommendations, '
    'Talking points). lib/briefs.ts loader exposes getBrief, getAllBriefs, and BRIEF_SECTIONS."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-20 · \U0001f465 W9.D5 - Sprint Intelligence per engineer deep dive tabs"
md_new = (
    "### 2026-05-17 · \U0001f4dd W9.D6 - Sprint Intelligence meeting brief fixtures and loader\n"
    "- **Four meeting brief fixtures.** Hand curated, one per sprint, under `fixtures/sprint-intelligence/briefs/`. Same five section structure as the Project 2 narrative fixtures: Executive summary, Highlights, Watch list, Recommendations, Talking points.\n"
    "- **Fixture grounded prose.** Sprint 42 mentions the 67 SP velocity against a 58 SP baseline, the 1.8 day cycle time improvement, and the two P3 carryovers. Sprint 43 calls out the day four Acme escalation that expanded scope from 22 to 28 tickets with a 73 SP close. Sprint 44 frames the identity provider blocker as a process failure of the upstream provider rather than a team execution failure, salvaged value at 41 SP. Sprint 45 is mid flight with a concrete war room recommendation for the day twelve auth cutover.\n"
    "- **Leadership grade voice.** One to three sentence paragraphs, bold callouts on the headline metrics, a five bullet talking points section that reads as slide ready.\n"
    "- **`lib/briefs.ts` loader.** Follows Project 2's narratives loader pattern. Static imports the four JSONs, exports `BRIEF_SECTIONS` metadata with section heading markers, and exposes `getBrief` plus `getAllBriefs`. The `Fixture` shape is the same `@rishi/ai-core` type that `replayFixture` consumes so W9.D7 can stream the brief without any glue.\n"
    "- **Build clean.** Ten routes prerendered through `next build` directly (turbo parallelism was racing on `.next` writes during this run, direct `next build` sidesteps the issue). `/sprint/[id]` First Load JS is 108 kB after the EngineerTabs client bundle, baseline 102 kB shared. Type check clean.\n"
    "- **Next**: W9.D7 - `StreamingBriefPanel` client component on `/sprint/[id]`. Mirror Project 2 pattern: `replayFixture` streams the brief markdown into `AiNarrativeBlock`, five step progress strip advances as section headings appear, Cancel and Replay buttons available, panel sits as Section 0 above the team header so the brief lands first.\n"
    "\n"
    "### 2026-05-20 · \U0001f465 W9.D5 - Sprint Intelligence per engineer deep dive tabs"
)
if md_old not in md:
    raise SystemExit("Could not locate W9.D5 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 9 · Day 5 - Per engineer deep dive tabs live. EngineerTabs swaps content for eight "
    "team members, each panel shows workload, completion, personal cycle time, and review queue tiles plus "
    "priority mix and assigned ticket list. |"
)
md_new_day = (
    "| **Current Day** | Week 9 · Day 6 - Four meeting brief fixtures shipped under `fixtures/sprint-intelligence/briefs/` "
    "with the five section structure (Executive summary, Highlights, Watch list, Recommendations, Talking points). "
    "`lib/briefs.ts` loader exposes `getBrief`, `getAllBriefs`, and `BRIEF_SECTIONS`. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
