"""Final wrap up for Project 2. Marks W7.D7 complete, adds a closing
activity entry that documents the post v1.0 polish round across the
deck, the plan website, and the writing style sweep, and refreshes
the Project 2 close status."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

# --- plan.html ---------------------------------------------------------
html = plan_html.read_text(encoding="utf-8")

# Mark W7.D7 fully complete. The day has 3 tasks.
old = (
    '        "7-W7.D6-0", "7-W7.D6-1", "7-W7.D6-2", "7-W7.D6-3"\n'
    '      ],'
)
new = (
    '        "7-W7.D6-0", "7-W7.D6-1", "7-W7.D6-2", "7-W7.D6-3",\n'
    '        // Phase 2 · Week 7 · Day 7 (3 tasks - buffer day, lessons learned note, Phase 3 preview)\n'
    '        "7-W7.D7-0", "7-W7.D7-1", "7-W7.D7-2"\n'
    '      ],'
)
if old not in html:
    raise SystemExit("W7.D6 completedTasks block not found")
html = html.replace(old, new, 1)

# Add a closing activity entry above the W7.D5 entry.
title_w7d5 = '"\U0001f3c1 W7.D5 — Project 2 SHIPPED v1.0 · v1.0-narrative-generator tagged"'
old_first = (
    'activity: [\n'
    '        {\n'
    '          date: "2026-05-15",\n'
    '          title: ' + title_w7d5 + ','
)

closing_desc = (
    "Wrapped Project 2 with three substantive polish commits plus a plan "
    "website hardening pass. PPTX rewrite. Seven themed slides driven by a "
    "single accent color per dashboard. Cover, headline metric, performance "
    "snapshot, what moved, so what, talking points, and risks plus closing "
    "recap. Three slides now render as bullet lists rather than condensed "
    "prose so the canvas fills with content. The headline slide right "
    "column was repositioned so the Top driver and Watch callouts no longer "
    "overflow the footer line on any dashboard. Cat A 1 from W7.D5 "
    "(flattenMarkdown to richText array for emphasis fidelity) shipped here. "
    "A toRichText helper plus a parseInline parser convert a small subset of "
    "markdown (bold, italic, inline code) into the rich text array shape "
    "pptxgenjs accepts. Generate route redesign. The route now leads with a "
    "Project 1 style dashboard preview (five KPI tiles, three inline SVG "
    "charts, sample rows table) and a Generate Narrative button in the page "
    "header. Clicking the button mounts a streaming analysis panel below "
    "the preview that ends with a direct Download PPTX link rather than a "
    "navigation hop. Universal dashboard titles. Six dashboards renamed "
    "across fixtures, master plan, and README so Q3 anchors disappear. "
    "Revenue Operations Dashboard, Marketing Performance Analytics "
    "Dashboard, Platform Operations Dashboard, Finance QBR Reporting, "
    "People and Engagement Dashboard, Customer Experience Dashboard. Slugs "
    "preserved so URLs and the case study links keep working. Writing style "
    "sweep. Every em dash, en dash, sentence flow hyphen, semicolon, and "
    "contraction across the six narrative fixtures, the six dashboard "
    "fixtures, and the PPTX builder removed. A reusable scripts clean prose "
    "script runs the same sweep on demand. A global CLAUDE.md plus a memory "
    "entry now hold the rules so they apply across every Claude session "
    "regardless of working directory. Plan website hardening. A post commit "
    "hook syncs docs master plan md and docs plan html into the standalone "
    "mirror automatically, ending the daily manual cp dance. A pre commit "
    "hook runs scripts validate plan py whenever the staged change set "
    "touches the plan files and refuses the commit on these failure modes. "
    "completedTasks ids referencing nonexistent days, indexes past the end "
    "of a day task list, empty tasks arrays, em dashes and en dashes and "
    "semicolons and banned compound hyphens and contractions inside any "
    "task or day name, and live HTML tags inside a task string. Five "
    "reported plan website issues fixed at the data layer. W5.D7 removed "
    "so Project 1 reads 100 percent complete, W6.D2 completed task list "
    "corrected, Week 7 day tasks rewritten in the concise format, Phase "
    "tiles in the current status section wired to navigate into the "
    "matching phase block in the plan accordion. Project 2 is fully closed. "
    "Awaiting user confirmation to begin Project 3."
)
closing_block = (
    'activity: [\n'
    '        {\n'
    '          date: "2026-05-16",\n'
    '          title: "\U0001f381 W7.D6-D7 - Project 2 post v1.0 polish round and final wrap",\n'
    '          desc: "' + closing_desc + '",\n'
    '          next: "Awaiting user confirmation before starting Project 3 (Sprint Intelligence)."\n'
    '        },\n'
    '        {\n'
    '          date: "2026-05-15",\n'
    '          title: ' + title_w7d5 + ','
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, closing_block, 1)

# Update Current Day status row to reflect the close
old_status = (
    '"Week 7 · CLOSED — Project 2 SHIPPED v1.0 (v1.0-narrative-generator tagged). '
    "Awaiting confirmation to begin Project 3.\""
)
new_status = (
    '"Week 7 · CLOSED — Project 2 SHIPPED v1.0 (v1.0-narrative-generator tagged) plus '
    'post v1.0 polish round (W7.D6-D7 closed Cat A 1 plus deck redesign plus plan website hardening). '
    'Awaiting confirmation to begin Project 3."'
)
if old_status in html:
    html = html.replace(old_status, new_status, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

# --- master-plan.md ---------------------------------------------------
md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-15 · \U0001f3c1 W7.D5 — Project 2 SHIPPED v1.0 · `v1.0-narrative-generator` tagged"
md_new = (
    "### 2026-05-16 · \U0001f381 W7.D6-D7 - Project 2 post v1.0 polish round and final wrap\n"
    "- **Cat A 1 from W7.D5 shipped.** `flattenMarkdown` to `pptxgenjs` rich text array. `lib/build-pptx.ts` now uses `toRichText` plus a `parseInline` parser that converts bold, italic, and inline code markdown into the rich text array shape `pptxgenjs` accepts. Bold and italic emphasis survive end to end and match the on-screen preview.\n"
    "- **PPTX rewrite.** Seven themed slides driven by a single accent color per dashboard. Three slides (`What moved`, `So what`, `Risks and caveats`) moved from prose blocks to bullet lists so the canvas fills with content. The headline slide right column was repositioned so the `Top driver` and `Watch` callouts no longer overflow the footer line on any dashboard.\n"
    "- **Generate route redesign.** `/generate/[slug]` now leads with a Project 1 style dashboard preview (five KPI tiles, three inline SVG charts, sample rows table) and a `Generate Narrative` button in the page header. Clicking the button mounts a streaming analysis panel below the preview that ends with a direct Download PPTX link rather than a navigation hop.\n"
    "- **Universal dashboard titles.** Six dashboards renamed across fixtures, master plan, and README so the `Q3` anchor disappears. Revenue Operations Dashboard, Marketing Performance Analytics Dashboard, Platform Operations Dashboard, Finance QBR Reporting, People and Engagement Dashboard, Customer Experience Dashboard. Slugs preserved so URLs and the case study links keep working.\n"
    "- **Writing style sweep.** Every em dash, en dash, sentence flow hyphen, semicolon, and contraction across the six narrative fixtures, the six dashboard fixtures, and the PPTX builder removed. `scripts/clean-prose.py` runs the same sweep on demand. A global `C:\\Users\\Rishi\\.claude\\CLAUDE.md` plus a memory entry now hold the rules so they apply across every Claude session regardless of working directory.\n"
    "- **Plan website hardening.** A post commit hook syncs `docs/master-plan.md` and `docs/plan.html` into the standalone mirror automatically. A pre commit hook runs `scripts/validate-plan.py` whenever the staged change set touches the plan files and refuses the commit on these failure modes. `completedTasks` ids referencing nonexistent days, indexes past the end of a day task list, empty tasks arrays, em dashes and en dashes and semicolons and banned compound hyphens and contractions inside any task or day name, and live HTML tags inside a task string.\n"
    "- **Five reported plan website issues fixed at the data layer.** `W5.D7` removed so Project 1 reads 100 percent complete. `W6.D2` completed task list corrected. Week 7 day tasks rewritten in the concise format. Phase tiles in the current status section wired to navigate into the matching phase block in the plan accordion.\n"
    "- **Project 2 close state.** All seven days of Week 7 marked complete (`7-W7.D1` through `7-W7.D7`). Pending Follow-ups now reflect that Cat A 1 shipped, Cat A 2 (Lighthouse in CI) and the Cat B items stay as small follow-ups, Cat C remains deferred by design.\n"
    "- **Next**: awaiting user confirmation to begin Project 3 (Sprint Intelligence). Per the 14 week plan, Project 3 is synthetic sprints to team and individual KPIs to AI meeting brief. W8.D1 scope is scaffolding `apps/sprint-intelligence/` mirroring the narrative generator bootstrap pattern.\n"
    "\n"
    "### 2026-05-15 · \U0001f3c1 W7.D5 - Project 2 SHIPPED v1.0 · `v1.0-narrative-generator` tagged"
)
if md_old not in md:
    raise SystemExit("Could not locate W7.D5 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 7 · CLOSED — Project 2 SHIPPED v1.0 "
    "(`v1.0-narrative-generator` tagged). **Awaiting confirmation to begin Project 3.** |"
)
md_new_day = (
    "| **Current Day** | Week 7 · CLOSED — Project 2 SHIPPED v1.0 "
    "(`v1.0-narrative-generator` tagged) plus post v1.0 polish round (W7.D6-D7 "
    "closed Cat A 1 plus deck redesign plus plan website hardening). "
    "**Awaiting confirmation to begin Project 3.** |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
