"""Log W10.D15: light-mode theming pass for Sprint Intelligence charts."""

from pathlib import Path

repo = Path(__file__).resolve().parents[1]
plan_html = repo / "docs" / "plan.html"
plan_md = repo / "docs" / "master-plan.md"

html = plan_html.read_text(encoding="utf-8")

old_d14_close = (
    '            { num: "W10.D14", weekday: "Sat", name: "Filter-aware cross-sprint history table and trend charts", '
    'tasks: ["page.tsx now computes filteredHistoryRows by iterating every full sprint fixture from getAllFullSprints and re-applying the top filter (assignee plus type plus status) to each sprint ticket array. The recomputed totals (ticketCount, closedCount, openCount, spCompleted, spTotal) drive both the SprintHistoryTable and the SprintTrendCharts so the bottom widgets respect the top filter", '
    '"All six fixtures were already in the per-route bundle via the FIXTURES static map so the addition cost zero kB. /sprint/[id] First Load JS held at 50.4 kB", '
    '"Section descriptions on both widgets updated to call out filter awareness so the user knows the top filter scope flows down to the cross-sprint view. With no filter applied, the recomputed totals match the manifest values (parity verified by reading /sprint/may-2026 with no query string)", '
    '"Live deploy verified. Smoke checks across /, /sprints, /sprint/feb-2026, /sprint/feb-2026?assignee=eng-2, /sprint/feb-2026?type=bug, /sprint/may-2026?assignee=eng-1&type=development all returned HTTP 200. Filter combinations now flow through the history table and trend charts so the manager can see eng-1 development tickets across every sprint at a glance"] }\n'
    '          ],'
)
new_d14_plus_d15 = (
    '            { num: "W10.D14", weekday: "Sat", name: "Filter-aware cross-sprint history table and trend charts", '
    'tasks: ["page.tsx now computes filteredHistoryRows by iterating every full sprint fixture from getAllFullSprints and re-applying the top filter (assignee plus type plus status) to each sprint ticket array. The recomputed totals (ticketCount, closedCount, openCount, spCompleted, spTotal) drive both the SprintHistoryTable and the SprintTrendCharts so the bottom widgets respect the top filter", '
    '"All six fixtures were already in the per-route bundle via the FIXTURES static map so the addition cost zero kB. /sprint/[id] First Load JS held at 50.4 kB", '
    '"Section descriptions on both widgets updated to call out filter awareness so the user knows the top filter scope flows down to the cross-sprint view. With no filter applied, the recomputed totals match the manifest values (parity verified by reading /sprint/may-2026 with no query string)", '
    '"Live deploy verified. Smoke checks across /, /sprints, /sprint/feb-2026, /sprint/feb-2026?assignee=eng-2, /sprint/feb-2026?type=bug, /sprint/may-2026?assignee=eng-1&type=development all returned HTTP 200. Filter combinations now flow through the history table and trend charts so the manager can see eng-1 development tickets across every sprint at a glance"] },\n'
    '            { num: "W10.D15", weekday: "Sun", name: "Light-mode theming pass for charts, KPI tiles, heatmap cells", '
    'tasks: ["New chart palette tokens (chart-emerald, chart-amber, chart-violet, chart-rose, chart-slate, chart-blue, chart-indigo) plus heatmap-empty added to packages/design-system/src/tokens/colors.css. Each token gets both a hex form and an RGB triplet so Tailwind utilities like bg-chart-rose/70 work with alpha. The :root,.dark block keeps the existing emerald-300 era shades. The .light block overrides every chart token with a darker saturated equivalent (chart-emerald 5,150,105 emerald-600, chart-rose 225,29,72 rose-600, etc.) so the bars and tiles read on a white card", '
    '"Tailwind config registers the chart palette and the heatmap-empty color in packages/design-system/tailwind.config.ts so utility classes (text-chart-emerald, bg-chart-rose/70) resolve to the CSS variables and theme automatically", '
    '"Component sweep across 17 Sprint Intelligence chart components. Tailwind class swaps in 6 files (TopKpiStrip, StoryPointsStrip, SprintHistoryTable, EtaCard, SprintErrorBoundary, BlockedCard) replace text-emerald-300, text-amber-300, text-violet-300, text-rose-300, text-slate-300 with their text-chart-* equivalents. Inline hex literal swaps in 17 files (DeepDivePanel, SprintTrendCharts, TicketHeatmap, ThroughputChart, AvgDaysInStatusChart, WorkloadByAssignee, AgingTicketsCard, CycleTimeBars, PriorityBreakdownChart, BlockedCard, TeamWorkloadCard, CarryoverCard, ScopeCreepCard, CycleTimeChart, StatusDonut, VelocityBar, BurndownChart) replace #34d399, #fb7185, #fbbf24, #a78bfa, #94a3b8, #60a5fa, #1a1f2e, #6366f1 with var(--chart-*) and var(--heatmap-empty) references", '
    '"ACCENT_HEX in page.tsx now resolves to var() CSS variables instead of fixed hex literals so the per-sprint accent re-themes too. Build clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to prod, smoke checks across 4 routes (including a filtered URL) all returned HTTP 200. Dark mode looks identical to before. Light mode now flips charts and tiles to readable saturated shades on the white card background"] }\n'
    '          ],'
)
if old_d14_close not in html:
    raise SystemExit("Could not locate W10.D14 day-array tail")
html = html.replace(old_d14_close, new_d14_plus_d15, 1)

insert_marker = '"10-W10.D14-3"\n      ],'
new_tail = (
    '"10-W10.D14-3",\n'
    '        // Phase 3 · Week 10 · Day 15 (4 tasks - chart palette + heatmap tokens added to design system, Tailwind palette registered, 17-component hex sweep + 6-component class sweep, ACCENT_HEX maps to vars)\n'
    '        "10-W10.D15-0", "10-W10.D15-1", "10-W10.D15-2", "10-W10.D15-3"\n'
    "      ],"
)
if insert_marker not in html:
    raise SystemExit("Could not locate W10.D14 completed task tail")
html = html.replace(insert_marker, new_tail, 1)

old_first = (
    "activity: [\n"
    '        {\n'
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50e W10.D14 - Sprint Intelligence filter-aware cross-sprint history and trend charts",'
)
desc = (
    "Light-mode theming pass for the Sprint Intelligence dashboard. Dark mode already looked "
    "good, but light mode broke because chart fills and KPI tile accents were hardcoded to "
    "dark-mode shades (emerald-300, amber-300, etc. plus the dark heatmap empty cell #1a1f2e) "
    "that read washed out or as dark blobs on a white card. Fix: lift the chart palette into "
    "theme-aware CSS variables. Added chart-emerald, chart-amber, chart-violet, chart-rose, "
    "chart-slate, chart-blue, chart-indigo plus heatmap-empty to "
    "packages/design-system/src/tokens/colors.css with both a hex form and an RGB triplet so "
    "Tailwind utilities like bg-chart-rose/70 honor alpha. The :root,.dark block keeps the "
    "existing dark-mode shades. The .light block overrides every chart token with darker "
    "saturated equivalents (chart-emerald becomes #059669 emerald-600 in light mode, "
    "chart-rose becomes #e11d48 rose-600, heatmap-empty becomes #e9ecef so empty cells blend "
    "into a light card). Tailwind config in packages/design-system/tailwind.config.ts now "
    "exposes the chart palette plus the heatmap-empty color via the standard rgb(var() / "
    "<alpha-value>) pattern. Component sweep: 6 files lost their text-emerald-300 / "
    "text-amber-300 / text-violet-300 / text-rose-300 / text-slate-300 Tailwind classes in "
    "favor of text-chart-emerald / text-chart-amber / text-chart-violet / text-chart-rose / "
    "text-chart-slate. 17 files lost their inline hex literals in favor of var(--chart-*) and "
    "var(--heatmap-empty) references. ACCENT_HEX in page.tsx now resolves to var() CSS "
    "variables instead of fixed hex literals so the per-sprint accent re-themes too. Build "
    "clean, type check clean. /sprint/[id] First Load JS unchanged at 50.4 kB. Redeployed to "
    "prod, smoke checks across 4 routes (including a filtered URL) all returned HTTP 200. "
    "Dark mode looks identical to before; light mode now flips charts and tiles to readable "
    "saturated shades on the white card background."
)
new_first = (
    "activity: [\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f31e W10.D15 - Sprint Intelligence light-mode theming pass",\n'
    '          desc: "' + desc + '",\n'
    '          next: "W11.D1 - Project 3 case study at docs/case-studies/sprint-intelligence.md. Three engineering moments: monorepo rootDirectory workaround, search-param-driven filter pattern (now scoped across every dashboard surface and cross-sprint widget), manifest enrichment pattern."\n'
    "        },\n"
    "        {\n"
    '          date: "2026-05-17",\n'
    '          title: "\U0001f50e W10.D14 - Sprint Intelligence filter-aware cross-sprint history and trend charts",'
)
if old_first not in html:
    raise SystemExit("Could not locate activity array start")
html = html.replace(old_first, new_first, 1)

old_day_row = (
    '"Week 10 · Day 14 - Filter awareness extended to the cross-sprint widgets. '
    'SprintHistoryTable and SprintTrendCharts now recompute every sprint’s totals against the '
    'active filter, so assignee+type+status combinations scope the bottom-of-page view too. '
    'Zero bundle cost (all six fixtures already in the static map). Live deploy 50.4 kB."'
)
new_day_row = (
    '"Week 10 · Day 15 - Light-mode theming pass. New chart palette tokens (chart-emerald, '
    'chart-amber, chart-violet, chart-rose, chart-slate, chart-blue, chart-indigo) plus '
    'heatmap-empty added to the design system. 17 chart components swept from hardcoded hex '
    'literals to var(--chart-*) references. Dark mode unchanged, light mode now reads cleanly '
    'on the white card backgrounds. Live deploy 50.4 kB."'
)
if old_day_row in html:
    html = html.replace(old_day_row, new_day_row, 1)

plan_html.write_text(html, encoding="utf-8")
print("plan.html updated")

md = plan_md.read_text(encoding="utf-8")

md_old = "### 2026-05-17 · \U0001f50e W10.D14 - Sprint Intelligence filter-aware cross-sprint history and trend charts"
md_new = (
    "### 2026-05-17 · \U0001f31e W10.D15 - Sprint Intelligence light-mode theming pass\n"
    "- **Theme-aware chart palette**. Added `chart-emerald`, `chart-amber`, `chart-violet`, `chart-rose`, `chart-slate`, `chart-blue`, `chart-indigo` plus `heatmap-empty` tokens to `packages/design-system/src/tokens/colors.css`. Each token has a hex form plus an RGB triplet so Tailwind utilities like `bg-chart-rose/70` honor alpha. Dark-mode values match the previous hardcoded shades. Light-mode overrides use darker saturated equivalents (`chart-emerald` = `#059669`, `chart-rose` = `#e11d48`, `heatmap-empty` = `#e9ecef`) that read on a white card.\n"
    "- **Tailwind config registration**. `packages/design-system/tailwind.config.ts` exposes the chart palette and the `heatmap-empty` color so `text-chart-emerald`, `bg-chart-rose/70`, `bg-heatmap-empty` all theme.\n"
    "- **Component sweep**. 6 files lost their `text-emerald-300` / `text-amber-300` / `text-violet-300` / `text-rose-300` / `text-slate-300` classes in favor of `text-chart-*`. 17 files lost their inline hex literals (`#34d399`, `#fb7185`, `#fbbf24`, `#a78bfa`, `#94a3b8`, `#60a5fa`, `#1a1f2e`, `#6366f1`) in favor of `var(--chart-*)` and `var(--heatmap-empty)` references in inline styles.\n"
    "- **`ACCENT_HEX` map in `page.tsx`** now resolves to `var(--chart-*)` and `var(--color-accent)` CSS variables instead of fixed hex literals so the per-sprint accent re-themes too.\n"
    "- **Build clean, type check clean**. `/sprint/[id]` First Load JS unchanged at 50.4 kB. Redeployed to prod, smoke checks across 4 routes (including a filtered URL) all returned HTTP 200.\n"
    "- **Dark mode looks identical** to before. **Light mode** now flips charts and tiles to readable saturated shades on the white card background.\n"
    "- **Next**: W11.D1 - Project 3 case study at `docs/case-studies/sprint-intelligence.md`. Three engineering moments: monorepo `rootDirectory` workaround, search-param-driven filter pattern, manifest enrichment pattern.\n"
    "\n"
    "### 2026-05-17 · \U0001f50e W10.D14 - Sprint Intelligence filter-aware cross-sprint history and trend charts"
)
if md_old not in md:
    raise SystemExit("Could not locate W10.D14 heading in master-plan.md")
md = md.replace(md_old, md_new, 1)

md_old_day = (
    "| **Current Day** | Week 10 · Day 14 - Filter awareness extended to the cross-sprint "
    "widgets. `SprintHistoryTable` and `SprintTrendCharts` now recompute every sprint's totals "
    "against the active filter, so `assignee + type + status` combinations scope the "
    "bottom-of-page view too. Zero bundle cost (all six fixtures already in the static map). "
    "Live deploy 50.4 kB. |"
)
md_new_day = (
    "| **Current Day** | Week 10 · Day 15 - Light-mode theming pass. New chart palette tokens "
    "(`chart-emerald`, `chart-amber`, `chart-violet`, `chart-rose`, `chart-slate`, `chart-blue`, "
    "`chart-indigo`) plus `heatmap-empty` added to the design system. 17 chart components swept "
    "from hardcoded hex literals to `var(--chart-*)` references. Dark mode unchanged, light "
    "mode now reads cleanly on the white card backgrounds. Live deploy 50.4 kB. |"
)
if md_old_day in md:
    md = md.replace(md_old_day, md_new_day, 1)

plan_md.write_text(md, encoding="utf-8")
print("master-plan.md updated")
