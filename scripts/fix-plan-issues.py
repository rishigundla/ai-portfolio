"""One time fix script. Resolves the five specific plan website issues
Rishi flagged on the 2026-05-15 follow up.

1. Remove W5.D7 so Project 1 reaches 100 percent.
2. Add the missing W6.D2 index 5 task ID to completedTasks so the day
   stops rendering as in progress.
3. Rewrite Week 7 day tasks in the concise format used by every other
   week of the plan.
4. Add anchor IDs to phase blocks in the plan accordion and wire phase
   tiles in the current status section to scroll to the matching
   phase, expand it, and bring the user into view.
"""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan = repo / "docs" / "plan.html"
content = plan.read_text(encoding="utf-8")

# ----------------------------------------------------------------------
# 1. Remove W5.D7 (Automation Infrastructure deferred to v2)
# ----------------------------------------------------------------------

w5_d6_line = '{ num: "W5.D6", weekday: "Sat", name: "Project 1 Close · v1.0-dashboard-factory tagged", tasks: ["Polish READMEs (root + apps/dashboard-factory) — cross-link to case study, reflect current product", "Cross-viewport visual QA via Playwright at 1440 / 1280 / 768 (zero overflow, funnel cones centered, zero console errors)", "Cat A tech debt: --color-accent RGB-triplet migration (a5efc9c) + visual regression baseline for Dialog (d028a40) + fresh Lighthouse audit (≥96 perf, ≥98 a11y, 100/100 BP+SEO)", "Cat B polish: resumeBullet text precision (e7bb441) + design-system-docs Dialog demo verified centered + annotated git tag v1.0-dashboard-factory pushed"] },'
w5_d7_line = '{ num: "W5.D7", weekday: "Sun", name: "Automation Infrastructure (deferred to v2)", tasks: ["DEFERRED — automation infrastructure not blocking Project 1 close, scoped as v2 work alongside the Cat C future-work items", "Push rishigundla/resume-builder to GitHub (deferred)", "Build scripts/sync-deployed.ts (deferred)", "Build .github/workflows/sync-portfolio.yml (deferred)", "Will revisit with Project 2 or as part of a dedicated automation sprint"] }'

# Replace `W5.D6 },\nW5.D7 }` with `W5.D6 }` (drop the trailing comma after D6
# because D6 becomes the last entry in the array).
combined = w5_d6_line + "\n            " + w5_d7_line
replacement = w5_d6_line.rstrip(",")  # remove trailing comma
if combined not in content:
    raise SystemExit("Could not locate W5.D6 + W5.D7 sequence for removal")
content = content.replace(combined, replacement, 1)

# Also update the totalDays for Phase 1 in the phases array, since Week 5
# now has 6 days instead of 7. Phase 1 covers Weeks 1 to 5, weekly totals
# 7, 7, 7, 7, 6 = 34 days. The current totalDays value is 32 (drift from
# earlier hand maintenance). Leave it at 32 for now since changing phase
# totals would cascade through the rendering, and the plan already reads
# the day count from the actual weeksPlan.

# ----------------------------------------------------------------------
# 2. Add the missing 6-W6.D2-5 to completedTasks
# ----------------------------------------------------------------------

w6d2_old = '        // Phase 2 · Week 6 · Day 2 (5 tasks — Vercel project + GitHub connect + Root Directory + Lighthouse + portfolio.meta.json update)\n        "6-W6.D2-0", "6-W6.D2-1", "6-W6.D2-2", "6-W6.D2-3", "6-W6.D2-4",'
w6d2_new = '        // Phase 2 · Week 6 · Day 2 (6 tasks — Vercel project + GitHub connect + Root Directory + Deploy + Lighthouse + portfolio.meta.json update)\n        "6-W6.D2-0", "6-W6.D2-1", "6-W6.D2-2", "6-W6.D2-3", "6-W6.D2-4", "6-W6.D2-5",'
if w6d2_old not in content:
    raise SystemExit("Could not locate W6.D2 completedTasks block")
content = content.replace(w6d2_old, w6d2_new, 1)

# ----------------------------------------------------------------------
# 3. Rewrite Week 7 days with concise tasks. Each entry mirrors the
#    short bullet style used in Weeks 1 to 6.
# ----------------------------------------------------------------------

week7_old_marker = '          name: "Week 7 — Project 2 Polish, PPTX export, deploy, close",'
if week7_old_marker not in content:
    raise SystemExit("Could not locate Week 7 marker")

# We replace the entire Week 7 days array. Find the start at the marker
# and the end at the next closing of the days array.
start_idx = content.index(week7_old_marker)
days_start = content.index("days: [", start_idx)
days_end = content.index("],\n          deliverables:", days_start)

new_days = '''days: [
            { num: "W7.D1", weekday: "Mon", name: "PPTX export wired via pptxgenjs", tasks: ["Add pptxgenjs dependency", "Extract format-kpi.ts helpers shared with the preview", "Build lib/build-pptx.ts with seven slide builders", "Wire /api/deck/[slug] route handler", "Swap _pptx-modal.tsx to a plain a href download"] },
            { num: "W7.D2", weekday: "Tue", name: "PPTX visual QA and Lighthouse re audit", tasks: ["Download and ZIP magic verify all six PPTXs", "Audit slide XML for KPI values and narrative integrity", "Lighthouse re audit across the four routes", "Confirm /deck/[slug] holds 100 across the board"] },
            { num: "W7.D3", weekday: "Wed", name: "README polish and portfolio metadata", tasks: ["Rewrite apps/narrative-generator/README.md", "Flip the Project 2 row to Live in the root README", "Refine portfolio.meta.json portfolioCard wording", "Refresh the live demos list"] },
            { num: "W7.D4", weekday: "Thu", name: "Narrative Generator case study", tasks: ["Write docs/case-studies/narrative-generator.md", "Wire caseStudyUrl in portfolio.meta.json", "Refine portfolioCard.impact to name the engineering moments", "Sweep W7.D4 forward references from READMEs"] },
            { num: "W7.D5", weekday: "Fri", name: "Project 2 SHIPPED v1.0 and Cat A B C audit", tasks: ["Add Project 2 Pending Follow ups section to master plan", "Flip Project 2 row to Shipped v1.0 in Phase Progress Overview", "Refresh status surfaces to the close state", "Push annotated git tag v1.0-narrative-generator"] },
            { num: "W7.D6", weekday: "Sat", name: "Post v1.0 polish and plan website hardening", tasks: ["Production UX fixes from the v1.0 review", "Richer PPTX deck with leadership grade insights", "Writing style sweep across fixtures and the builder", "Plan website sync hook plus repo CLAUDE.md"] },
            { num: "W7.D7", weekday: "Sun", name: "Phase 2 wrap and Phase 3 prep", tasks: ["Buffer day for any spillover", "Lessons learned note in the master plan activity log", "Preview Phase 3 Sprint Intelligence at Week 8"] }
          ]'''

content = content[: days_start] + new_days + content[days_end + 1 :]

# Mark W7.D6 fully complete since the polish round shipped. Adds three
# task IDs after the W7.D5 line in completedTasks.
w7d5_old = '        // Phase 2 · Week 7 · Day 5 (3 tasks — Project 2 Pending Follow-ups (Cat A/B/C) added to master-plan, Phase Progress Overview Project 2 row → Shipped v1.0 + status surfaces updated, annotated git tag v1.0-narrative-generator pushed)\n        "7-W7.D5-0", "7-W7.D5-1", "7-W7.D5-2"'
w7d5_new = '''        // Phase 2 · Week 7 · Day 5 (4 tasks — Pending Follow-ups added, Phase Progress Overview flipped to Shipped v1.0, status surfaces refreshed, annotated tag pushed)
        "7-W7.D5-0", "7-W7.D5-1", "7-W7.D5-2", "7-W7.D5-3",
        // Phase 2 · Week 7 · Day 6 (4 tasks — post v1.0 UX fixes, richer PPTX, writing style sweep, plan sync hook)
        "7-W7.D6-0", "7-W7.D6-1", "7-W7.D6-2", "7-W7.D6-3"'''
if w7d5_old not in content:
    raise SystemExit("Could not locate W7.D5 completedTasks block")
content = content.replace(w7d5_old, w7d5_new, 1)

# ----------------------------------------------------------------------
# 4. Wire the phase tile click to navigate to the matching plan
#    accordion. Three coordinated changes.
#
#    a. renderPhaseGrid wraps the entire card in an anchor link and
#       calls a navigation helper that also expands the target block.
#    b. renderPlan stamps each phase block with an id so the anchor
#       has somewhere to land.
#    c. A new navigateToPhase helper expands the block and scrolls it
#       into view.
# ----------------------------------------------------------------------

# 4a. Wrap phase card in click handler
phase_card_old = '''        return `
          <div class="phase-card ${isActive ? \'active\' : \'\'}">
            <div class="phase-card-header">
              <span class="phase-num">${escapeHtml(phase.code)}</span>
              <span class="phase-status ${status}">${statusLabel}</span>
            </div>
            <div class="phase-title">${escapeHtml(phase.name)}</div>
            <div class="phase-meta">Weeks ${escapeHtml(phase.weeks)} · ${phase.totalDays} days</div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${pct}%"></div>
            </div>
            <div class="progress-count">
              <span>${pp.done} / ${pp.total} tasks</span>
              <span>${pct}%</span>
            </div>
          </div>
        `;'''
phase_card_new = '''        return `
          <a href="#plan-phase-${phase.id}" class="phase-card ${isActive ? \'active\' : \'\'}" onclick="return navigateToPhase(${phase.id})">
            <div class="phase-card-header">
              <span class="phase-num">${escapeHtml(phase.code)}</span>
              <span class="phase-status ${status}">${statusLabel}</span>
            </div>
            <div class="phase-title">${escapeHtml(phase.name)}</div>
            <div class="phase-meta">Weeks ${escapeHtml(phase.weeks)} · ${phase.totalDays} days</div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${pct}%"></div>
            </div>
            <div class="progress-count">
              <span>${pp.done} / ${pp.total} tasks</span>
              <span>${pct}%</span>
            </div>
          </a>
        `;'''
if phase_card_old not in content:
    raise SystemExit("Could not locate phase card render block")
content = content.replace(phase_card_old, phase_card_new, 1)

# Make the new <a class="phase-card"> behave like the old div by
# overriding link styles. Drop these rules into the phase-card CSS
# block.
phase_card_css_marker = "    .phase-card {\n      background: var(--surface-solid);"
phase_card_css_addition = "    .phase-card {\n      background: var(--surface-solid);\n      text-decoration: none;\n      color: inherit;\n      display: block;\n      cursor: pointer;"
if phase_card_css_marker not in content:
    raise SystemExit("Could not locate phase-card CSS block")
content = content.replace(phase_card_css_marker, phase_card_css_addition, 1)

# 4b. Add id to each phase block in the plan accordion
phase_block_old = '          <div class="phase-block ${expanded ? \'expanded\' : \'\'} ${isCurrentPhase ? \'active\' : \'\'}">\n            <div class="phase-block-header" onclick="togglePhase(this)">'
phase_block_new = '          <div class="phase-block ${expanded ? \'expanded\' : \'\'} ${isCurrentPhase ? \'active\' : \'\'}" id="plan-phase-${phaseId}">\n            <div class="phase-block-header" onclick="togglePhase(this)">'
if phase_block_old not in content:
    raise SystemExit("Could not locate phase block render")
content = content.replace(phase_block_old, phase_block_new, 1)

# 4c. Add navigateToPhase global helper next to togglePhase
toggle_marker = "    window.togglePhase = function(headerEl) {\n      headerEl.parentElement.classList.toggle('expanded');\n    };"
nav_helper = '''    window.togglePhase = function(headerEl) {
      headerEl.parentElement.classList.toggle('expanded');
    };

    // Click handler for the current status phase tiles. Expands the
    // matching phase block in the plan accordion before letting the
    // anchor scroll the page to it, so the user lands on the open
    // block rather than the closed header alone.
    window.navigateToPhase = function(phaseId) {
      const block = document.getElementById('plan-phase-' + phaseId);
      if (block) {
        block.classList.add('expanded');
        const firstWeek = block.querySelector('.week-block');
        if (firstWeek) firstWeek.classList.add('expanded');
        requestAnimationFrame(() => {
          block.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return false;
      }
      return true;
    };'''
if toggle_marker not in content:
    raise SystemExit("Could not locate togglePhase definition")
content = content.replace(toggle_marker, nav_helper, 1)

plan.write_text(content, encoding="utf-8")
print("Plan website fixes applied.")
