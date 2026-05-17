"""Log W12.D4: Project 3 closed at v1.0 plus Cat A prune plus plan close."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"

html = plan_html.read_text(encoding="utf-8")

old_tail = (
    '        // Phase 3 · Week 12 · Day 3 (4 tasks - case study published, caseStudyUrl wired, READMEs link to case study, plan files reflect case study landed)\n'
    '        "12-W12.D3-0", "12-W12.D3-1", "12-W12.D3-2", "12-W12.D3-3"\n'
    "      ],"
)
new_tail = (
    '        // Phase 3 · Week 12 · Day 3 (4 tasks - case study published, caseStudyUrl wired, READMEs link to case study, plan files reflect case study landed)\n'
    '        "12-W12.D3-0", "12-W12.D3-1", "12-W12.D3-2", "12-W12.D3-3",\n'
    '        // Phase 3 · Week 12 · Day 4 (4 tasks - Pending Follow-ups section in master plan, Cat A tech debt prune, annotated v1.0 tag, Project 3 row flipped to Shipped v1.0 across plan files)\n'
    '        "12-W12.D4-0", "12-W12.D4-1", "12-W12.D4-2", "12-W12.D4-3"\n'
    "      ],"
)
if old_tail not in html:
    raise SystemExit("Could not locate W12.D3 completedTasks tail")
html = html.replace(old_tail, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4d6 W12.D3 - Sprint Intelligence case study published, caseStudyUrl wired, READMEs link to case study",'
)
desc = (
    "Project 3 close out. Annotated git tag v1.0-sprint-intelligence pushed at the v1.0 commit. "
    "Cat A tech debt: dead TeamWorkloadCard.tsx (replaced by WorkloadByAssignee in W11.D1 but "
    "never deleted) pruned from apps/sprint-intelligence/app/sprint/[id]/_components/. Section "
    "eyebrow audit on /sprint/[id]/page.tsx confirmed already descriptive (the page uses Filter "
    "bar, Top KPIs, Story Points, Status and priority, Per ticket signals, Sprint health, Per "
    "engineer deep dive, Sprint history, Cross sprint trends, Streaming brief as section "
    "eyebrows, not numbered Section X of Y so no rework needed). Lighthouse in CI carries "
    "forward to Project 4 as inherited setup work for W13.D1. Pending Follow-ups section added "
    "to docs/master-plan.md after the Project 2 section mirroring the Project 1 and Project 2 "
    "close-out structure with Cat A (tech debt) listing TeamWorkloadCard prune (done), section "
    "eyebrow audit (done), Lighthouse in CI (deferred to Project 4 setup), Cat B (polish) "
    "listing accentHex prop cleanup plus getColorClasses deprecation pass plus /sprints "
    "gallery planned card hover state, and Cat C (future work) listing per sprint comparison "
    "view plus heatmap drill in plus real time Jira API plus real Tooltip primitive plus "
    "custom domain. Phase Progress Overview row for Project 3 in docs/plan.html (phases array, "
    "id 3) flipped from weeks 8-9 totalDays 14 done 0 status not-started to weeks 9-12 "
    "totalDays 25 done 25 status completed with tag v1.0-sprint-intelligence plus liveUrl plus "
    "caseStudyUrl. master-plan.md Phase Progress Overview table row mirrored. Current Phase, "
    "Current Week, Current Day, Overall Progress, Status, Next Action, Blockers cells in both "
    "plan files refreshed to signal Project 3 SHIPPED v1.0 plus awaiting Project 4 "
    "confirmation. Validator green: 115 days, 436 tasks, 332 marked complete."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f3c1 W12.D4 - Project 3 SHIPPED v1.0 (v1.0-sprint-intelligence tagged) plus Cat A prune plus Pending Follow-ups plus plan close",\n'
    '          desc: "' + desc + '",\n'
    '          next: "Awaiting user confirmation before starting Project 4 (Anomaly Alerting). Per the 18 week plan, Project 4 is synthetic historical time series feeding curated anomaly scenarios feeding streaming AI root cause narration. W13.D1 would scaffold apps/anomaly-alerting/ (new Next.js 15 app, mirror sprint-intelligence bootstrap pattern: workspace:* deps, design-system Tailwind preset, route shell stubs, fixture loaders). Cat A items inherited from Project 3 (Lighthouse in CI shared infrastructure) are reasonable W13 setup work to land before Project 4 ramps up."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f4d6 W12.D3 - Sprint Intelligence case study published, caseStudyUrl wired, READMEs link to case study",'
)
if old_first not in html:
    raise SystemExit("Could not locate W12.D3 activity entry")
html = html.replace(old_first, new_first, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")
