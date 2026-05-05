# AI Portfolio Projects — Master Plan (v3)

> **Owner**: Rishikesh Gundla
> **Current Role**: Senior BI Engineer @ Nutanix · SaaS Data Team
> **Target Roles**: Data Engineer, Analytics Engineer, AI Data Engineer, AI Engineer
> **Repo**: `rishigundla/ai-portfolio` (public, to be created)
> **Plan Version**: 3.0 — includes day-by-day tracker and progress log
> **Last Plan Update**: 2026-05-04

---

# PART A — LIVE PROGRESS TRACKER

## Current Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 1 — Project 1 (Dashboard Factory) |
| **Current Week** | Week 1 of 14 |
| **Current Day** | Week 5 · Day 5 (Fri) — Loom video |
| **Overall Progress** | 159 tasks of ~150 complete · **Production live at https://ai-portfolio-dashboard-factory.vercel.app** · Phase 0 ✓ · Week 1 ✓ · Week 2 ✓ · Week 3 ✓ · Week 4 ✓ · Week 5 Days 1-4 ✓ |
| **Status** | W5.D4 closed. Export-to-Figma CTA + future-state page shipped in single feat commit (`e414e0b`). NEW `/wireframe/figma-export` page (~250 lines, server component): 7-section future-state story — hero with honest framing, "Today's reality" card (3-day manual Figma rebuild after dashboard mockup), 3-step future-state flow with arrow connectors (Wireframe → Claude+MCP → Editable Figma file), conceptual code snippet showing the `mcp__figma__create_frame` tool call against `getWireframeLayout(slug, density)`, "What's blocking it today" with 3 explicit constraints (MCP server in beta, no headless Figma layout API, Vercel can't run MCP), 4-component architecture sketch, closing accent-bordered callout ("Why ship the button before the integration? Because the value is answering, what would the workflow even look like."). NEW Export-to-Figma button on every `/wireframe/[slug]` page: lucide ExternalLink icon + "Export to Figma" label, sits next to density selector in header, click → next/Link to /wireframe/figma-export, mobile-responsive (icon-only at narrow widths), aria-label notes "manual rebuild today" so screen readers + keyboard users get the honest framing without first clicking through. **Cross-mode QA**: walked all 12 production routes via Playwright at 1440×900 in dark mode. All 6 ad-hoc dashboards (revops/marketing/pulse/supply/financial/customer) and all 6 wireframes (manufacturing/real-estate/healthcare/education/saas/logistics) — **zero console errors across all 12 routes**. **Lighthouse**: `/wireframe/figma-export` 95/98/100/100. Build: 29 of 29 pages prerendered (was 28 — +1 for /wireframe/figma-export). /wireframe/[slug] route grew 12.1 → 12.2 kB (+~150 B for the ExternalLink import). |
| **Next Action** | Week 5 Day 5: Loom video. 90-120s walkthrough script: problem framing (10s) → ad-hoc dataset gallery (10s) → profiling stream (15s) → live dashboard (20s) → drill-down 3 tabs (10s) → wireframe gallery (10s) → wireframe with density selector (15s) → Export-to-Figma future-state page (10s) → outro (5s). Record on clean Chrome at 1440px in dark mode. Edit, upload to YouTube unlisted, update portfolio.meta.json with loomUrl. |
| **Blockers** | None |

### Phase Progress Overview

| Phase | Project | Weeks | Days | Progress | Status |
|-------|---------|-------|------|----------|--------|
| 0 | Pre-flight setup | — | — | 0 / 5 | Not Started |
| 1 | Project 1 · Dashboard Factory | 1-4 | 28 | 0 / 28 | Not Started |
| 2 | Project 2 · Narrative Generator | 5-6 | 14 | 0 / 14 | Not Started |
| 3 | Project 4 · Sprint Intelligence | 7-8 | 14 | 0 / 14 | Not Started |
| 4 | Project 3 · Anomaly Alerting | 9-11 | 21 | 0 / 21 | Not Started |
| 5 | Project 5 · Pipeline Self-Healer | 12-14 | 21 | 0 / 21 | Not Started |

**Status Legend**: `[ ]` Not Started · `[~]` In Progress · `[x]` Completed · `[!]` Blocked · `[-]` Skipped

---

## Recent Activity Log

_Last 7 days of work, kept rolling. Older entries archived per-phase below._

### 2026-05-05 · Week 5 Day 4 — Export-to-Figma CTA + future-state page
- **Goal**: ship the first user-facing CTA on the wireframe stack (Export to Figma) backed by a dedicated future-state page that tells the honest story — *this is what the workflow looks like once Figma MCP matures; today the button is a wireframe of the wireframe-export feature itself.* High-signal portfolio piece showing awareness of emerging tools (MCP), honest framing about what's shippable today, and a concrete vision of the workflow.
- **Single feat commit (`e414e0b`)**: 1 new page + 1 modified component, ~340 lines added.
- **NEW `/wireframe/figma-export` page** (~250 lines, server component, no client JS):
  - Hero with honest-framing subtitle
  - "Today's reality" card explaining the 3-day manual Figma rebuild after a dashboard mockup is approved
  - 3-step future-state flow (Wireframe → Claude+MCP → Editable Figma file) with arrow connectors at lg breakpoint
  - "What a click would do" code snippet showing the conceptual `mcp__figma__create_frame` tool call against `getWireframeLayout(slug, density)` — syntax-highlighted via inline span colors
  - "What's blocking it today" section with 3 explicit constraints (Figma MCP server in beta, no headless Figma layout API, Vercel can't run MCP)
  - Architecture sketch listing 4 components (WireframeLayout / Claude Code / Figma MCP server / Figma desktop) in dataflow order
  - Closing accent-bordered callout: *"Why ship the button before the integration? Because the value of this feature is answering, what would the workflow even look like."*
  - Two CTAs at the bottom (Back to gallery / See an example wireframe)
- **NEW Export-to-Figma button on every `/wireframe/[slug]` page** via `WireframeView`:
  - Lucide ExternalLink icon + "Export to Figma" label
  - Sits in the header status row next to the density selector
  - Click → next/Link to `/wireframe/figma-export` (no client logic, pure navigation)
  - Mobile-responsive: collapses to icon-only at narrow widths
  - aria-label: *"Export to Figma — opens the future-state demo page (manual rebuild today)"* — screen readers + keyboard users get the honest framing without first clicking through
- **Cross-mode QA**: walked all 12 production routes via Playwright at 1440×900 in dark mode:
  - 6 ad-hoc: revops-sales / marketing-campaigns / pulse-telemetry / supply-chain / financial-complaints / customer-demographics
  - 6 wireframes: manufacturing-throughput / real-estate-pipeline / healthcare-operations / education-enrollment / saas-subscriptions / logistics-fleet
  - **Zero console errors across all 12 routes**. Verified the new CTA renders on every wireframe page and links correctly to the future-state page. Checked saas-subscriptions specifically (5 KPIs incl. MRR $396.1K + ARR $4.8M + Expansion MRR $20K + NPS 42 + Seats 4,043; MRR by Plan Tier bar chart showing Enterprise dominance; Trial-Active-At-Risk-Churned funnel preserves schema-defined order).
- **Lighthouse**: `/wireframe/figma-export` **95 / 98 / 100 / 100** — strong perf + a11y, perfect best-practices + SEO. The 95 perf is excellent for a content-heavy page (no Recharts, but lots of DOM nodes for the 3-step flow + code snippet + bulleted blockers).
- **Build**: 29 of 29 pages prerendered (was 28 — gained `/wireframe/figma-export`). `/wireframe/[slug]` route grew 12.1 → 12.2 kB (+~150 B for the new ExternalLink import in WireframeView).
- **Production URLs**:
  - Wireframe gallery: https://ai-portfolio-dashboard-factory.vercel.app/wireframe
  - Sample wireframe with new CTA: https://ai-portfolio-dashboard-factory.vercel.app/wireframe/manufacturing-throughput
  - Future-state page: https://ai-portfolio-dashboard-factory.vercel.app/wireframe/figma-export
- **Context for W5.D5 (Fri)**: Loom video. 90-120s walkthrough script: problem framing (10s) → ad-hoc dataset gallery (10s) → profiling stream (15s) → live dashboard (20s) → drill-down 3 tabs (10s) → wireframe gallery (10s) → wireframe with density selector (15s) → Export-to-Figma future-state page (10s) → outro (5s). Record on clean Chrome at 1440px in dark mode. Edit, upload to YouTube unlisted, update portfolio.meta.json with loomUrl.
- **Next**: Week 5 Day 5 — Loom video

### 2026-05-05 · Week 5 Day 3 — Data-driven wireframe template engine
- **Goal**: replace the 3 hardcoded wireframe templates (Executive/Operational/Exploratory, ~1,000 lines of hand-coded SVG mocks at `app/wireframe/_components/`) with one engine that consumes the W5.D1 wireframe datasets + W5.D2 profiling recommendations and emits a `DashboardLayout` consumable by the existing `<DashboardView>`. Old template aesthetic preserved as 3 layout density modes (Sparse / Balanced / Dense).
- **5 commits** (3 phased + 2 in-session hotfixes):
  - **Phase 1 `39e6791` foundation**: new `lib/wireframe-datasets.ts` (parallel to `lib/full-datasets.ts`) static-imports the 6 wireframe dataset JSONs from W5.D1's separate fixtures folder, exports `getWireframeDataset(slug)` + `getAllWireframeSlugs()` + `getAllWireframeDatasets()`. New `lib/wireframe-recommendations.ts` (parallel to `lib/per-domain-layout.ts`) maps each of the 6 wireframe slugs to a `{ kpiMeasureNames, chartPicks }` recommendation matching exactly what the W5.D2 profiling fixture's "Recommended KPIs" + "Recommended Charts" sections described. Reuses W4.D7's `ChartPick` discriminated tag. Exported `resolveChartPick`, `buildKpis`, `PickResolverHelpers` from `dashboard-builder.ts` so the W5.D3 engine can dispatch each pick using the same machinery the ad-hoc per-domain layouts use.
  - **Phase 2 `57acfee` engine**: new `lib/wireframe-engine.ts` exports `buildWireframeLayout(slug, density)` returning `{ layout, density, dataset, recommendation }`. Reuses dashboard-builder's chart resolver + KPI builder + period-over-period delta computation wholesale (so wireframe KPIs get the same growth % deltas as ad-hoc). Density only affects KPI count at engine level (sparse → 1 hero, balanced/dense → 5-strip). Returns null when slug unknown or recommendation missing. Missing-column picks console.warn and skip rather than crash.
  - **Phase 3 `42b48b7` UI replacement** (net diff −1,109 lines): rewrote `/wireframe/page.tsx` (281 → 88 lines) as a 6-card dataset gallery reading from `getAllWireframeDatasets()`, same card aesthetic as the ad-hoc `/datasets` gallery. New `/wireframe/[slug]/page.tsx` dynamic route with `generateStaticParams()` over the 6 wireframe slugs, `generateMetadata` per slug. New `WireframeView` client component with density selector (3-button radiogroup, defaults to balanced) — calls `buildWireframeLayout(slug, density)` and renders the result via the existing `<DashboardView>`. Wireframe-specific chrome: "Wireframe" badge + "Auto-generated from profiling" subtitle (vs ad-hoc's "Live dashboard"), no FilterBar, no PDF export, no drill-down dialog. Deleted: `app/wireframe/[template]/page.tsx`, `_components/{Executive,Operational,Exploratory}Layout.tsx`, `_components/MockCharts.tsx` (~1,000 lines of hand-coded SVG primitives), `lib/wireframe-templates.ts`. Old `/wireframe/{executive,operational,exploratory}` URLs now 404 — no internal links to those, home page only links to `/wireframe`.
  - **Hotfix `f983753`** (first attempt at density grid override): density modes weren't actually flipping the chart-row layout. Tailwind's arbitrary variant `[&_.lg\\:grid-cols-12]:lg:grid-cols-1` made it into the DOM but the CSS wasn't generated. Replaced with raw CSS rules in `globals.css` targeting `[data-density] .lg\\:grid-cols-12` — same approach as the existing `[data-exporting]` PDF capture rules.
  - **Hotfix `d2343a2`** (second attempt, the working one): even the raw CSS rules with escaped colons (`.lg\\:grid-cols-12`) got stripped by Tailwind's CSS pipeline — the escape character confuses Tailwind's class detection and it removes rules referencing utility-class names. Final fix: tag DashboardView's chart row with a stable non-Tailwind class `.dashboard-chart-row`, target THAT class from `globals.css` with simpler selectors. Verified deployed CSS (`a51b217b2709921d.css`) contains the rules.
- **Production verification** via Playwright: gallery shows 6 cards with proper icons (Factory/Home/Stethoscope/GraduationCap/Repeat/Plane). Clicking manufacturing-throughput renders 5 KPIs (Units Produced 59K ↓7.7%, OEE 82.9% ↑0.7%, Defect Rate 4.9% ↓4.4%, Cycle Time 8 ↓2.4%, Units Passed 56.9K ↓7.4%) + 4 charts (Units Produced by Line bar / Defect rate distribution histogram / Pass-Rework-Scrap funnel / OEE Line×Plant heatmap) — exactly the W5.D2 profiling recommendations. Density selector tested in all 3 modes: **Sparse** drops to 1 hero KPI + 4 charts stacked vertically at full width (exec readout feel); **Balanced** shows 5-KPI strip + 4-chart 2x2 grid (default); **Dense** shows 5-KPI strip + 4 charts side by side in a single row (ops control room feel). Transitions are instant client-side. Zero console errors.
- **Lighthouse re-audit**:
  - `/wireframe` gallery: **99 / 98 / 100 / 100** — gallery is essentially static, performs at near-perfect.
  - `/wireframe/manufacturing-throughput`: **84 / 98 / 100 / 100** — comfortably beats `/dashboard/[slug]`'s 73 because wireframe routes don't pull in html2canvas/jsPDF dynamic imports (no PDF export on wireframes).
  - The `98` on a11y (vs `100` on the dashboard route) is likely the radiogroup density selector — minor, will check on a polish day.
- **Build**: 28 of 28 pages prerendered (was 25 — gained 6 wireframe slug pages, lost 3 old template pages, net +3). `/wireframe` 171 B / 106 kB First Load. `/wireframe/[slug]` 12.1 kB / 285 kB First Load (Recharts pulled in for the chart components, same set as `/dashboard/[slug]` uses).
- **Lessons**:
  - Tailwind's CSS pipeline strips raw CSS rules that reference utility classes via escaped colons (`.lg\\:grid-cols-12`). Better pattern: tag the target element with a stable non-Tailwind class and target THAT from globals.css. The `[data-exporting]` PDF rule already worked this way — my mistake was trying a shortcut.
  - Engine reuse paid off. The W5.D3 engine produces a `DashboardLayout` consumable by the unchanged `<DashboardView>` because W4.D7 already centralized chart dispatch in `resolveChartPick`. Net new code in the engine: ~150 lines. The recommendation file: ~100 lines. Most of the gain came from the architecture being right, not from new code.
- **Context for W5.D4 (Thu)**: Export-to-Figma demo + final QA. Add "Export to Figma" CTA on each generated wireframe — clicks open a future-state Figma MCP + Claude integration story (honest framing: pre-MCP this is manual). Final cross-mode QA: walk all 6 ad-hoc + all 6 wireframe routes at 1440px, capture before-after Loom-ready screenshots.
- **Next**: Week 5 Day 4 — Export-to-Figma demo + final QA

### 2026-05-05 · Week 5 Day 2 — 6 wireframe-mode profiling fixtures
- **Goal**: hand-curate the profiling narratives that W5.D3's wireframe template engine will consume to materialize per-dataset chart picks. Quality bar: match the existing 6 ad-hoc profiling fixtures' voice exactly (confident, observation-based, references real column names + named outliers, no em/en-dashes per W4.D3 rule).
- **Single commit (`4ffb2fb`)**: 6 fixtures + 1 parallel loader. ~3.3-3.8 KB per fixture. Stored in `fixtures/dashboard-factory/wireframe-profiling/` parallel to the ad-hoc `profiling/` folder.
- **Per-fixture observed pattern surfaced** (the bit W5.D3 will lean on most):
  - **manufacturing-throughput**: Line D + Night-shift scrap concentration (4 of 4 Scrap rows on that combo, OEE 56-58%); Detroit/Stuttgart Morning shifts dominate clean Pass throughput at 88-92% OEE.
  - **real-estate-pipeline**: Hot/stale market split (Austin+Nashville close 6-15 days vs Phoenix Expired/Withdrawn 80-121 DOM); Over-$1M listings disproportionately Multi-Family.
  - **healthcare-operations**: Walk-in visits at Riverside East drag satisfaction (38-45 min waits → 68-72 score, lowest cluster); Mental Health highest satisfaction (92-95) despite longest visit durations (50-55 min).
  - **education-enrollment**: Online completion lags In-Person by 10-15 points (76-81% vs 91-98%); Advanced Humanities/CS hit 95-98% in small but committed cohorts (38-48 students).
  - **saas-subscriptions**: Enterprise dominates MRR but isn't risk-free (named At-Risk Enterprise accounts at NPS 22-25); At-Risk + Churned cluster in Free/Starter at NPS 18 or below; multi-year span enables cohort retention view.
  - **logistics-fleet**: Bimodal distance distribution (Local 15-40 mi vs Long-haul 665-2015 mi, natural histogram showcase); Refrigerated highest capacity utilization (88-96%); Delayed shipments cluster in Long-haul Refrigerated.
- **Per-fixture recommendation**: 5 KPIs + 4 charts. Charts deliberately span the full 7-chart toolkit (bar/line/donut/heatmap/scatter/funnel/histogram) across the 6 datasets so W5.D3's engine has varied per-dataset specs to materialize, not just repeated bar+line+donut.
- **Architecture**: new `lib/wireframe-profiling.ts` parallel to `lib/profiling.ts`. Static-imports the 6 wireframe profiling JSONs, exports `getWireframeProfilingFixture(slug)` returning the Fixture-typed payload + `getAllWireframeProfilingSlugs()` for the W5.D3 engine to enumerate. Loader is dormant until W5.D3 wires up a route that consumes it. Existing `lib/profiling.ts` untouched, ad-hoc /generate flow unaffected.
- **Validation**: each fixture passes JSON.parse, has all 4 section headings present in `text` (Column Classification / Domain Inference / Recommended KPIs / Recommended Charts), all 5 metadata keys present (generatedAt, model, promptTokens, completionTokens, notes), lengths 3.3-3.8 KB (matching the ~3KB target). No em-dashes / en-dashes / hyphen-with-spaces in user-visible prose (W4.D3 rule).
- **Build**: 25/25 pages still prerendered, /dashboard/[slug] unchanged at 131 kB (loader tree-shaken since no route imports it yet). Typecheck clean.
- **Skipped intentionally**:
  - Wireframe template engine (W5.D3 — tomorrow)
  - UI integration (gallery / /generate / /wireframe routes — W5.D3 decides whether to add a separate `/wireframe/[slug]` profiling-driven route or merge into the ad-hoc gallery filtered by mode)
- **Context for W5.D3 (Wed)**: data-driven wireframe template engine. Replace the 3 hardcoded templates (Executive/Operational/Exploratory at `apps/dashboard-factory/app/wireframe/_components/`) with one schema + profiling-driven generator. Inputs: `getWireframeDataset(slug)` (W5.D1) + `getWireframeProfilingFixture(slug)` (W5.D2). Output: a `DashboardLayout` similar to W4.D6's `buildDashboardLayout()` but driven by parsing the profiling text's "Recommended Charts" section into `ChartPick[]` (the same discriminated tag W4.D7's per-domain-layout.ts uses). Old template aesthetic preserved as one of 3 layout density modes (Sparse / Balanced / Dense) so the existing wireframe gallery still has visual variety.
- **Next**: Week 5 Day 3 — Data-driven wireframe template engine

### 2026-05-05 · Week 5 Day 1 — 6 wireframe-mode datasets
- **Goal**: author the data input that W5.D3's data-driven wireframe template engine will consume. Six new datasets in verticals that don't overlap with the existing 6 ad-hoc datasets, so the wireframe gallery feels distinct.
- **Single commit (`2a9e833`)**: 6 fixtures + 1 manifest + ICON_MAP extension. 214 rows total, hand-authored.
  - **manufacturing-throughput** (36 rows, ops/amber/Factory): Production-line yield, defect rates, OEE across plants and shifts. Ordered-stage dim `defect_status` (Pass/Rework/Scrap). Multimodal value distributions — Pass rows ~92-99% pass-through with low defects, Rework rows 78-90% with moderate defects, Scrap rows ~75% with high defect rates. 4 plants × 4 lines × 3 shifts.
  - **real-estate-pipeline** (36 rows, sales/rose/Home): Listings, days on market, sale prices, broker performance. Ordered-stage dim `listing_status` (Active/Pending/Sold/Expired/Withdrawn) — 5 stages forming a real pipeline funnel. Hot markets (Austin/Nashville) close in 6-15 days; expired/withdrawn listings sit 80-120 days.
  - **healthcare-operations** (36 rows, ops/teal/Stethoscope): Clinic visits, wait times, satisfaction, charges by department. Ordered-stage dim `visit_type` (Scheduled/Walk-in/Urgent/Emergency). Wait times bimodal: Scheduled ~10-15 min, Walk-in ~30-45 min. Emergency visits highest charges ($1850-2380).
  - **education-enrollment** (32 rows, edu/blue/GraduationCap): Course enrollment, completion, grades, satisfaction across modalities. Ordered-stage dim `enrollment_status` (Active/Completed/Withdrawn/Dropped). Online courses lower completion (~76-81%) than In-Person (~91-98%) — the kind of pattern that makes a heatmap (modality × subject) immediately readable.
  - **saas-subscriptions** (38 rows, sales/accent/Repeat): MRR, churn, expansion across plan tiers + industries. Ordered-stage dim `account_status` (Trial/Active/At-Risk/Churned). Spans 2024-02 → 2026-10 (33 months) — the only multi-year wireframe dataset, will trigger yearly heatmap bucketing in the W5.D3 engine.
  - **logistics-fleet** (36 rows, ops/purple/Plane): Shipment routes, transit, fuel efficiency, capacity by vehicle class. Ordered-stage dim `shipment_status` (Loaded/In-Transit/Delivered/Delayed). Distance bimodal: Local (15-40 mi) vs Long-haul (665-2015 mi) — natural histogram showcase.
- **Storage layout**: separate folder `fixtures/dashboard-factory/wireframe-datasets/` + own `index.json` carrying `"mode": "wireframe"`. The existing ad-hoc /datasets gallery + /generate + /dashboard flows are completely untouched (no static-import changes in lib/full-datasets.ts, no profiling fixtures yet — those are W5.D2). Backward-compatible: any future dataset added without an override falls through to the W4.D6 generic allocator (the wireframe-datasets won't show in /datasets gallery yet because no route reads from the new folder).
- **ICON_MAP extension** in `apps/dashboard-factory/lib/datasets.ts`: added Factory, Home, Stethoscope, GraduationCap, Repeat, Plane lucide icons. All 6 already in lucide-react — no new dep. Existing `getDatasetIcon(name)` resolver picks them up.
- **Validation**: each fixture passes JSON.parse, has every schema column referenced in every row (no missing/extra keys), rowCount in metadata matches actual rows, ≥4 ordered-stage dims (funnel-ready), ≥4 measures (scatter X/Y), 1 time column with reasonable spread (≥3 months for monthly heatmap, multi-year for saas-subscriptions which triggers yearly bucketing).
- **Build**: 25 of 25 pages still prerendered (the new fixtures are inert — no route imports them). /dashboard/[slug] grew 130 → 131 kB (+1 kB for the 6 new icon imports tree-shaken into the dashboard route via lib/datasets.ts).
- **Skipped intentionally**:
  - Profiling fixtures for the 6 new datasets (W5.D2 — tomorrow)
  - Wireframe-datasets loader + UI integration (W5.D3 — needs to decide gallery layout: separate route vs filtered ad-hoc gallery)
  - Thumbnails in /public/datasets/*.png (placeholder paths in the manifest; can be generated on a polish day)
- **Context for W5.D2 (Tue)**: 6 new profiling fixtures. Hand-curate ~3KB profiling fixtures per dataset (matching the existing 6 ad-hoc fixtures' voice + format) — column classification, domain inference, recommended KPIs, recommended chart layouts. The W5.D3 wireframe engine will use these recommendations to materialize the per-dataset chart picks (similar to W4.D7's per-domain-layout.ts but generated from profiling instead of hand-coded).
- **Next**: Week 5 Day 2 — 6 new profiling fixtures (the heavy content lift)

### 2026-05-04 · Week 4 Day 7 — Dashboard uniqueness (Item 4 part B — per-domain layouts + funnel + histogram + multi-tab drill-down)
- **Goal**: each of the 6 dashboards should feel curated for its domain rather than generically schema-driven. Master plan called for per-domain layouts + 5 new chart types (funnel, ring, scorecard, histogram, matrix) + enhanced drill-down + cross-dataset QA. Realistic-scoped to per-domain configs using 2 new universal chart types (funnel, histogram) on top of the existing toolkit + 3-tab drill-down — covers the spirit ("uniqueness" + "depth") without building 5 new chart components in one day.
- **3 phased commits + 1 in-session hotfix**:
  - **Phase 1 (`2804306`) funnel + histogram chart types**: extended `DashboardChartData` union with 2 new variants. Two funnel builders: `buildFunnelChart(rows, dim)` sorts by `dim.values` ordering when present (preserving semantic stage order like Qualification → Proposal → Negotiation → Closed Won → Closed Lost), else by count desc; `buildFunnelChartFromMeasures(rows, [m1, m2, ...])` sums each measure as a stage value (used for the natural Marketing funnel: total Impressions → total Clicks → total Conversions). Funnel rendered as CSS-only horizontal tapered bars with hover-clickable stages — drill-in wired only for dim-based funnels (measure funnels have no rows-per-stage to filter by). `buildHistogramChart(rows, measure)` uses Sturges' rule (k = ceil(log2(n) + 1), capped [4, 12]); empty trailing bins dropped, empty middle bins kept (sparse upper tails don't waste real estate, but middle gaps are meaningful). Rendered via Recharts `BarChart` with `barCategoryGap={1}` for the no-gap-between-bars look that distinguishes a histogram from a regular bar chart, range tooltips show min-max + count. Bundle delta: /dashboard/[slug] 126 → 127 kB (+1 kB).
  - **Phase 2 (`faba6e4`) per-domain layout overrides**: new `lib/per-domain-layout.ts` registers 6 hand-curated chart mixes:
    - **revops-sales**: bar (ACV by Segment) + line (ACV trend) + scatter (ACV vs GRR%) + funnel (deal_stage pipeline, schema-defined order)
    - **marketing-campaigns**: bar (Spend by Channel) + funnel (Impressions → Clicks → Conversions, MEASURE-AGGREGATED) + scatter (CPA vs ROI%, low-CPA + high-ROI quadrant) + heatmap (Spend: Channel × month)
    - **pulse-telemetry**: line (P95 latency trend) + histogram (P95 distribution) + heatmap (Customer × time, Usage Count) + bar (Errors by Product)
    - **supply-chain**: bar (Fulfillment % by Supplier) + scatter (Lead time vs Unit cost) + histogram (Lead time distribution) + heatmap (Total cost: Region × month)
    - **financial-complaints**: histogram (Days to resolve distribution) + bar (Top issue types, count-by-dim fallback since 1-measure dataset) + funnel (Response pipeline, response_status 5 ordered values) + bar (Top states, count-by-dim)
    - **customer-demographics**: scatter (LTV vs CSAT, per-customer quadrant) + heatmap (LTV: Industry × signup year, yearly bucketing for 4-year span) + bar (LTV by Segment) + line (Signup count over time, count-aggregated)
    - Picks reference columns by NAME so schema reorders won't silently swap axes; missing-column picks `console.warn` and skip rather than crash. KPIs are also override-driven via `kpiMeasureNames` (Marketing now leads with Spend/Conversions/ROI/CPA/CTR — the headline campaign measures — instead of the generic builder's spend/impressions/clicks). Backward-compatible: any future dataset without a registered override falls through to the W4.D6 generic allocator. Two convenience fallbacks added in the resolver: bar pick without `measureName` → count-by-dim bar (used by financial Top issue types/Top states); line pick without `measureName` → count-over-time line (used by customer Signup count). Bundle delta: /dashboard/[slug] 127 → 129 kB (+2 kB for the override config table), First Load 322 → 322 kB.
  - **Phase 3 (`482b9e0`) multi-tab drill-down**: clicking a bar/donut now opens a 3-tab `<Dialog>` instead of a single rows table. Tab 1 (Rows) is the existing `<DrilldownTable>` untouched. Tab 2 (Summary stats, new `_drilldown-summary.tsx`) shows count + per-measure stats table (mean / median / sum / min / max with the measure's unit-aware formatter so values read in their native form $14.4M / 93.9% / 245 ms) + per-dim top-3 values (skipped for free-text columns with > 25 distinct values where top-3 isn't useful insight). Tab 3 (Distribution, new `_drilldown-distribution.tsx`) reuses the new histogram chart for the primary measure within the drilled subset. Wiring used existing Tabs/TabsList/TabsTrigger/TabsContent already exported from `@rishi/design-system/primitives` (Radix-based, no new deps). `ChartRenderer` in `_dashboard-view.tsx` made exportable + `colors` prop optional so the Distribution tab can reuse the dispatcher; 3 inner view components (BarChartView, LineChartView, DonutChartView) updated to accept optional colors since drill-down doesn't have a colors palette to plumb. Skipped intentionally: expandable rows in DrilldownTable (current 6-column display already a clean view; expanding to surface all columns is incremental polish, filed for later). Bundle delta: /dashboard/[slug] 129 → 130 kB (+1 kB for the two new drill-down components), First Load 322 → 325 kB.
  - **Hotfix (`ba65326`) heatmap span sort**: surfaced during cross-dataset QA on production. `buildHeatmapChart` computed `spanMonths` from `dated[0]` and `dated[length-1]` without sorting first. Customer-demographics' rows happen to be in non-chronological order (rows[0].signup_date = 2022-03-14, rows[last].signup_date = 2021-12-08 → computed span = -3.15 months → monthly bucketing fired on what's actually a 4-year dataset, producing a 36-column heatmap where the 'LTV: Industry × signup year' title called for ~5 yearly columns). Pre-existing bug from W4.D6 (`b01163d`) — only revealed by customer-demographics' shuffled fixture order; other datasets weren't affected because their JSON happens to be roughly chronological. **Lesson**: don't trust array order for min/max — sort first or use Math.min/max. Fix: appended `.sort((a, b) => a.date.getTime() - b.date.getTime())` to the `dated` array. Same builder logic now produces granularity 'year' on customer-demographics (subtitle: '5 years × 7 industries · Lifetime Value').
- **Production verification** via Playwright on Vercel: revops-sales (deal-stage funnel rendering 5 ordered stages with Closed Won at 100% / Negotiation 21% / Proposal 11% / Closed Lost 7% / Qualification 4%), marketing-campaigns (5 curated KPIs incl ROI 321.9% + CPA $309 + CTR 5.8% which the generic builder buried, Impressions → Clicks → Conversions funnel rendered correctly with 100% / 3% / 0% ratios from the measure-aggregated path), customer-demographics (LTV vs CSAT scatter with 38 points + LTV: Industry × signup year heatmap rendering 5 yearly columns post-hotfix). Drill-down dialog tested by clicking the Enterprise bar on the ACV by Segment chart — opens with title "Segment: Enterprise · 19 rows match this segment" and 3 working tabs: Rows (DataGrid of 19 deals), Summary stats (records count + ACV mean $638.8K / median $562K + GRR % mean 97.7% / median 97.8% + per-dim top-3 values), Distribution (ACV histogram with 6 buckets across 19 records, vertical bars). **Zero console errors** on every walked route in dark mode.
- **Lighthouse re-audit** against W4.D6 baseline (98/100/100/100 home, 79/100/100/100 dashboard):
  - Home: **99** / 100 / 100 / 100 — +1 vs W4.D6, no W4.D7 regression on home (the new feature code only loads on the dashboard route)
  - /dashboard/revops-sales: **73** / 100 / 100 / 100 — −6 perf vs W4.D6's 79. Trade-off accepted: the new chart variants + Tabs primitive + drill-down summary/distribution components add weight; all other categories perfect. The dashboard route is the heaviest by design (Recharts + dynamically-loaded html2canvas+jsPDF + canvas particles + the new Tabs/cmdk popover chunks). Future opt path: lazy-render the particle canvas after first paint, or `prefers-reduced-motion` short-circuit.
- **Build**: 25 of 25 pages still prerendered. design-system-docs builds clean. Typecheck clean across both packages.
- **Two follow-ups still open from W4.D6** (not regressed, just not addressed today):
  - Median-date split shows naturally negative deltas on front-loaded data (revops Jan-Jun heavy → late period lower). Mathematically correct; user might read down-arrows as "bad". Future option: rate-based per-day-current vs per-day-prior comparison.
  - `FilterBar.MultiSelect` defaults to schema's first dimension column — for revops that's `opportunity_name` (40 distinct values, one per row). Should default to `usefulDimensions[0]` (segment, 3 values) per the chart-builder's "useful" filter.
- **One new follow-up from W4.D7**:
  - Multi-tab drill-down's Summary stats Top-Values panel shows full row list when `distinctCount === rowCount` (e.g. opportunity column with 19 rows × 19 distinct values lists all 19, not useful). Should skip when `counts.size === rows.length`. 5-line fix.
- **Context for W5.D1 (Mon)**: 6 new wireframe-mode datasets. Design schemas for 6 sample datasets in different verticals — Manufacturing (production-line throughput), Real estate (brokerage pipeline), Healthcare (clinic operations), Education (course enrollment + retention), SaaS Subscription Analytics (MRR/churn/expansion), Logistics (fleet utilization). 30-50 rows each. These feed into W5.D3's wireframe template engine (which will replace the current 3 hardcoded Executive/Operational/Exploratory templates with a schema-driven generator).
- **Next**: Week 5 Day 1 — 6 new wireframe-mode datasets

### 2026-05-04 · Week 4 Day 6 — Dashboard depth (Item 4 part A — growth %, heatmap, scatter, multi-select, date-range)
- **Goal**: make the dashboard feel less like a static schema-driven render and more like a tool an analyst would reach for. Six items in the W4.D6 master plan — all shipped.
- **Reframed task #1** at planning time. Master plan said "generate synthetic period-over-period data per dataset"; existing fixtures already span months/years (revops/marketing/supply 9mo, financial 6mo, customer 4yr, pulse 33d) so I derive period-over-period by splitting the existing date range. No fixture mutation, growth % automatically tracks active filters because the split runs inside `buildDashboardLayout()`.
- **3 phased commits to main**:
  - **Phase 1 (`5cf3ab0`) growth % deltas**: new `lib/period.ts` exports `splitByPeriod(rows, timeCol)` which sorts by date, splits at the median DATE (not median index — keeps each half time-balanced even when row distribution is bursty like pulse-telemetry), returns null when either half has < 4 rows or dates all collapse. `dashboard-builder.buildKpis()` accepts a `period` arg; for each measure-based KPI it aggregates current + prior, computes `(curr - prior) / |prior| * 100`, sets `kpi.delta = { value, direction, period: 'vs prior period' }`. Derived KPIs (Total X, Top X, distinct counts) skip the delta — period comparison isn't semantically meaningful for those. `_dashboard-view.tsx` passes `delta={kpi.delta}` through to `KpiCard`. KpiCard's `delta` prop already existed in the design-system from Day 1 (renders ↑/↓ icon + abs(percent) + period label, with `text-status-blocked` red on negative direction unless `invertGood: true`). No design-system changes needed for Phase 1.
  - **Phase 2 (`b01163d`) heatmap + scatter chart types**: extended `DashboardChartData` discriminated union with two new variants. `buildScatterChart(rows, measureX, measureY, idCol)` plots each row as a point (sampled at 100 max), used for quadrant analysis. `buildHeatmapChart(rows, timeCol, dim, valueMeasure?)` builds a time-bucket × top-N dim matrix. Bucketing chooses **monthly** for ≤ 18mo spans (revops/marketing/supply/pulse), **yearly** for >18mo (customer-demographics 2020-2024) — avoids sparse grids on multi-year data and over-wide grids on single-month data. Slot-allocation in `buildDashboardLayout()`: slot 1 = primary bar, slot 2 = trend line, slot 3 = scatter (≥2 measures) OR donut, slot 4 = heatmap (time + dim) OR secondary bar. Result per dataset: revops/marketing/pulse/supply/customer → bar/line/scatter/heatmap; financial-complaints (1 measure) → bar/line/donut/heatmap. **Heatmap rendered as CSS grid, not Recharts** — Recharts has no heatmap primitive and CSS grid + opacity-graded teal cells gives accessible markup (cell hover surfaces value via title attribute) without canvas overhead. `ScatterChartView` uses Recharts `<ScatterChart>` + `<Scatter>` + `<ZAxis>` (fixed range so dot size is constant), custom tooltip shows row id + both axis values. Bundle delta: /dashboard/[slug] 122 → 126 kB (+4 kB for the two new view components).
  - **Phase 3 (`d6e5c04`) multi-select + between-dates filter primitives**: two new compound sub-components added to `@rishi/design-system` FilterBar. `FilterBar.MultiSelect` is a popover trigger + cmdk `Command` check-list inside. Trigger preview is "Enterprise +2" style truncation when multiple values are picked; full list surfaces via `title` attribute for screen readers and keyboard users. Selected items get a filled accent checkbox; unselected show an outline. Includes "Clear selection" action inside the popover when anything is picked. `FilterBar.DateRangePicker` is a popover with two HTML5 `<input type="date">` inputs (bounded to dataset's actual min/max via the `bounds` prop), 3 preset chips (All time / Last 30 days / Last 90 days) with current-state highlight, and a Clear button. Trigger label shows the formatted range ("Apr 12 – Jul 1") in custom mode or the preset label otherwise. Both built on `@radix-ui/react-popover` + cmdk (already in design-system deps). `DashboardFilters` shape change: `segmentValue: string` → `segmentValues: string[]` (empty array = all), new optional `dateStart`/`dateEnd` ISO date strings, `dateRange` enum gains `'custom'`. `applyFilters()` updated: segment match uses `Set` membership (OR'd across selected values), custom date mode honors start/end with open intervals. `_dashboard-interactive.tsx` swaps `<FilterBar.Select>` → `<FilterBar.MultiSelect>` and `<FilterBar.DateRange>` → `<FilterBar.DateRangePicker>`; segment options dropped the synthetic "All X" entry (empty array already means all). design-system-docs showcase page updated to demo both new primitives side-by-side with the originals. Bundle delta: First Load JS 308 → 320 kB (+12 kB for the popover + cmdk client chunks pulled in once for the dashboard route).
- **Production verification** via Playwright on the live deploy: revops-sales (9mo data, 5 measures) renders 5 KPIs with deltas + bar/line/scatter (40 points) / heatmap (10 months × 3 segments). pulse-telemetry (33-day data, 6 measures) renders 5 KPIs with deltas + bar/line/scatter (42 points) / heatmap (2 months × 7 customers). Multi-select popover opens correctly with cmdk-styled items + filter input + clear-selection action. Date-range picker opens with both date inputs + preset chips + clear button. Theme toggle still works (verified switch dark↔light without console errors). **Zero console errors** on both routes in both themes.
- **Lighthouse re-audit** against the W4.D5 baseline (95/100/100/100):
  - Home: **98** / 100 / 100 / 100 — actually +3 vs W4.D5 (likely caching variance, certainly no W4.D6 regression on the home route since the new feature code only loads on the dashboard route)
  - /dashboard/revops-sales: **79** / 100 / 100 / 100 — same as W4.D5 baseline. Heatmap CSS-grid + scatter Recharts wiring contributed essentially nothing measurable. The 79 perf is dominated by Recharts + dynamically-loaded html2canvas+jsPDF, flagged for future optimization (lazy-render canvas after first paint OR `prefers-reduced-motion` short-circuit on the particle background).
  - All routes still 100 on a11y / best-practices / SEO.
- **Trade-offs noted**:
  - Median-date split means data with non-uniform distribution (e.g. revops has more rows in early Jan-Jun than late Jul-Oct) shows naturally negative deltas. Mathematically correct, but a user expecting "growth" might read down-arrows as bad. Future option: rate-based comparison (per-day current vs per-day prior) would normalize but adds complexity. Skipped today.
  - Multi-select primary dimension defaults to `schema.find(c => c.type === 'dimension')` — for revops that's `opportunity_name` with 40 distinct values per row (one per row), making the picker a long list. Pre-existing UX quirk from W3, not a W4.D6 regression. Filing for a follow-up: should default to `usefulDimensions[0]` (which the chart builder already filters for distinct < rows).
- **Build**: 25 of 25 pages still prerendered. Typecheck clean across `dashboard-factory` and `@rishi/design-system`. design-system-docs builds clean.
- **Context for W4.D7 (Sun)**: Dashboard uniqueness — each of the 6 dashboards gets a curated chart mix tuned to its domain (RevOps gets pipeline funnel + win-rate ring + region-channel matrix; Marketing gets ROI quadrant scatter + funnel + channel CPA bars; etc per Day 7 master plan). Plus enhanced multi-tab drill-down dialog (rows / summary stats / distribution) and expandable rows in DrilldownTable. Cross-dataset QA at 1440px.
- **Next**: Week 4 Day 7 — Dashboard uniqueness (per-domain layouts)

### 2026-05-04 · Week 4 Day 5 — Theme toggle + particle background (Item 1)
- **Goal**: visual consistency across all 5 AI portfolio sites by porting the portfolio-site (rishikeshgundla.com) light/dark theme + animated particle background into shared `@rishi/design-system` modules. Wire into dashboard-factory + design-system-docs as the first two consumers.
- **6 new files in `packages/design-system/src/theme/`**:
  - `storage-key.ts` — `STORAGE_KEY = 'ai-portfolio-theme'` constant. Server-safe (no `'use client'`) so both server and client modules can import it.
  - `use-theme.tsx` — React Context + `<ThemeProvider />` + `useTheme()` hook. Initial state read from `<html>` class (set pre-paint by ThemeScript), falling back to localStorage then `'dark'`. `useEffect` syncs theme back to `<html>` class + localStorage.
  - `theme-script.tsx` — `<ThemeScript />` server component renders a Next.js `<Script strategy="beforeInteractive">` IIFE that reads localStorage and applies `.dark`/`.light` to `<html>` BEFORE first paint, preventing flash of wrong theme.
  - `theme-toggle.tsx` — `<ThemeToggle />` button with Sun/Moon lucide icons. Hydration-safe via CSS-only swap (`hidden dark:block` / `block dark:hidden`) — both icons always in DOM, Tailwind's `darkMode: 'class'` does the visibility selection from the `.dark` class on `<html>`.
  - `particle-background.tsx` — `<ParticleBackground />` canvas. Direct port of portfolio-site GlobalBackground.jsx: faint grid + pulsing nodes + horizontal data streams + connected particle field. Theme-aware RGB (dark = teal-400 `45,212,191`, light = teal-600 `13,148,136` with slightly higher alphas because lighter background washes color out). Particle count scales with viewport (15 mobile / 80 tablet / 140 desktop). Connections only render on tablet+ (O(n²)).
  - `index.ts` — barrel export.
- **Wiring in both apps' root layouts**: `<head><ThemeScript /></head>`, then inside `<body>`, wrap content in `<ThemeProvider>` with `<ParticleBackground />` as a sibling, then `<div className="relative" style={{zIndex:1}}>` for the actual content (so it stacks above the `position:fixed inset-0 z-0` canvas). Removed hardcoded `className="dark"` from `<html>` and added `suppressHydrationWarning`. `<ThemeToggle />` added to both Nav components.
- **Architecture choices**:
  - **React Context, not Zustand**: keeps design-system framework-agnostic — consumers don't have to install Zustand just to use the theme module.
  - **`next` as optional peerDependency + devDependency**: theme-script.tsx is the only file using `next/script`. Adding `next` as devDep lets `tsc --noEmit` resolve the type from inside the package; making the peerDep optional means apps without Next.js (e.g. a future Vite consumer) don't fail to install — they just won't import the ThemeScript.
- **Two production hotfixes shipped after the initial feat commit (`7e8d9bc`)**:
  - **Hotfix 1 (`b057ba6`) — Inline ThemeScript SyntaxError on every page load**: Prod console showed `Failed to execute 'appendChild' on 'Node': missing ) after argument list`. Diagnosed by curl-ing the deployed HTML and inspecting the rendered Script body, which contained `localStorage.getItem('function(){throw Error("Attempted to call STORAGE_KEY() from the server but STORAGE_KEY is on the client. It's not possible to invoke a client function...")}')`. ROOT CAUSE: `theme-script.tsx` (server component) imported `STORAGE_KEY` from `use-theme.tsx` which carries `'use client'`. Next.js replaces such cross-boundary value imports with a runtime-throwing guard function. When that guard's stringified message was interpolated into the script template literal, the apostrophe in "It's" terminated the single-quoted JS string, leaving unbalanced parens → SyntaxError. FIX: hoist `STORAGE_KEY` into its own server-safe `storage-key.ts` (no `'use client'`); both `theme-script.tsx` and `use-theme.tsx` import from there. Verified the rebuilt HTML now contains the clean IIFE `localStorage.getItem('ai-portfolio-theme')`.
  - **Hotfix 2 (`1bc0f2e`) — React error #418 hydration mismatch on light-mode page loads**: After hotfix 1 the home page worked, but `/datasets` (and any route loaded fresh with stored `'light'` preference) fired `Minified React error #418`. ROOT CAUSE: `ThemeToggle` rendered `<Sun />` or `<Moon />` conditionally on `theme === 'dark'`. On the server, `readInitialTheme()` returns `'dark'` (no `document`) → renders Sun. On the client, the same initializer re-runs during hydration, sees `<html class="light">` (set pre-paint by ThemeScript) → returns `'light'` → wants to render Moon. The two renders disagreed. FIX: render BOTH icons unconditionally; hide one via Tailwind's `dark:` selector. Server and client emit identical DOM regardless of stored preference. ThemeProvider's state still drives the `.dark`/`.light` class on `<html>` via its useEffect (which runs only after hydration, no mismatch). TRADE-OFF: aria-label is now a stable `"Toggle theme"` instead of swapping between `"Switch to light theme"` / `"Switch to dark theme"` — a theme-conditioned label would re-introduce the same mismatch. The visible icon already communicates state to sighted users; the stable label is unambiguous for screen readers.
- **Verification**: Playwright walked home, /datasets, /dashboard/revops-sales, /wireframe/executive in both themes — zero console errors after hotfix 2. Toggle click flips state and persists to localStorage, survives page reloads. CSS-only icon swap confirmed via `getComputedStyle` (Sun `display: none`, Moon `display: block` in light mode).
- **Lighthouse re-audit (against prior 100/100/100/100 baseline from W4.D2)**:
  - Home: **95** / 100 / 100 / 100 (−5 perf from continuous canvas rAF loop)
  - /generate/revops-sales: **97** / 100 / 100 / 100 (−3 perf, was 100/98/100/100)
  - /dashboard/revops-sales: **79** / 100 / 100 / 100 — first-time-audited route, dominated by Recharts + dynamically-loaded html2canvas+jsPDF, particle contributes ~3-5pt; flagged for follow-up (lazy-render canvas after first paint OR `prefers-reduced-motion` short-circuit).
  - All routes hit 100 on a11y / best-practices / SEO. Performance trade-off accepted for brand-consistent visual identity across 5 apps.
- **Build**: 25 of 25 pages still prerendered. design-system-docs builds clean. Typecheck clean across both packages.
- **Context for W4.D6 (Sat)**: Dashboard depth — generate synthetic period-over-period data per dataset so growth % is meaningful. Add growth % delta to each KPI. Add 2 new chart types: heatmap (cohort/matrix views), scatter (quadrant analysis). Add multi-select filter primitive + date-range (between-dates) filter primitive to FilterBar. Verify across 2-3 datasets.
- **Next**: Week 4 Day 6 — Dashboard depth (growth %, new charts, more filters)

### 2026-04-30 · Week 4 Day 4 — PDF visual fidelity (Item 3)
- **Replaced the structured-text PDF with a canvas-based snapshot.** PDF now looks pixel-identical to the live dashboard, including Recharts visuals, brand colors, typography, current filtered state. The previous PDF (built with @react-pdf/renderer) was correctly designed for "structured summary export" but didn't match what the user expected from "Export PDF" button. After this rewrite the artifact answers exactly that: "give me a PDF that looks like what's on screen."
- **Approach**: html2canvas captures the live DOM at scale 2 (DPR 2 for crisp print), backgroundColor #0a0a0f to match base-900. jsPDF assembles the result as A4 portrait. If capture height fits one page, single addImage call; otherwise slice the canvas vertically into A4-height chunks via a hidden buffer canvas, addImage each slice as its own page so nothing gets clipped or squished.
- **Three incremental rounds before the artifact was right**:
  - **Round 1** (`e32ebbf`): baseline. Working PDF, but capture target was just the KPIs + charts subtree (DashboardView). PDF showed visuals correctly but no header context, no filter bar, drill-in chips visible (clutter in static document).
  - **Round 2** (`fe6973b`): widened capture-target to outer wrapper in _dashboard-interactive.tsx so FilterBar + "Showing N of M rows" line are now in the snapshot. Added programmatic page-1 header via `jsPDF.text()` with brand-colored "Dashboard Factory" + dataset title + export date + row count — renders as **native PDF text** (selectable, searchable). Hid drill chips during capture via `data-exporting='true'` toggle on the capture target + a `globals.css` rule.
  - **Round 3** (`c6a7876`): noticed the Export PDF button itself got captured in its "Generating…" spinner state because it lives inside the capture target. Tagged it with `data-pdf-hide` attribute. Generic CSS rule `[data-exporting='true'] [data-pdf-hide] { display: none }` makes it disappear during capture only. The attribute is now an escape hatch any future "this shouldn't be in the PDF" element can opt into in one line.
- **Trade-offs accepted**: text in the PDF is not selectable (it's pixel data inside an image, except the title header which is native PDF text), links not clickable, file size ~290 kB instead of ~30 kB. For a portfolio export-this-screenshot use case, that's correct.
- **Page-break behavior**: page boundary lands between chart cards on revops-sales by accident — the slicing algorithm doesn't know about chart boundaries. Could land mid-card on a different dataset. Not addressed in this commit; flagged as a possible follow-up if the break ever splits a chart visibly.
- **Code-quality win**: net diff was **−850 / +263 lines** because `lib/pdf-document.tsx` (a ~600-line @react-pdf re-implementation of the design system, mirroring KPI / bar / donut / line layouts in PDF primitives) was deleted entirely. `@react-pdf/renderer` (~200 kB) uninstalled. The old code wasn't wrong — it was an entire parallel rendering path that had to track the live UI by hand. Capturing the live DOM eliminates the divergence contract.
- **New deps**: html2canvas@1.4.1, jspdf@4.2.1. Both dynamic-import on click so they stay out of First Load JS.
- **Build**: 25 of 25 pages still prerendered. /dashboard/[slug] at 122 kB + 308 kB First Load JS (was 121 + 307 with @react-pdf, +1 kB negligible since both stacks dynamic-load).
- **Commits**: e32ebbf (round 1), fe6973b (round 2), c6a7876 (round 3) — all pushed to main.
- **Context for W4.D5 (Fri)**: Theme toggle + particle background. Study `C:\Users\Rishi\Documents\portfolio-site` source for particle + theme toggle implementation. Build `<ParticleBackground />` + `<ThemeToggle />` as shared components in `@rishi/design-system`. Wire into dashboard-factory + design-system-docs. Light-mode QA pass: every component, every route, contrast checks. Re-run Lighthouse in light mode (target 90+).
- **Next**: Week 4 Day 5 — Theme toggle + particle background

### 2026-04-28 · Week 4 Day 3 — Copy + UX cleanup (Items 2, 5, 6, 7)
- **Plan revised earlier today**: user batch of 8 polish items inserted before Loom. Phase 1 timeline slips ~5 days (closes May 11). W4.D3 = first of 5 new polish/enrichment days.
- **Item 7 — For Developers rename** across 4 sites: home persona card badge ('For BI engineers' → 'For Developers'), wireframe page eyebrow, layout description copy, page metadata.
- **Item 5 — Click-to-drill chip** on bar + donut chart cards. New `<DrillChip />` component with `MousePointerClick` icon + 'Click to drill in' text. Passed via ChartCard's `actions` slot only when a click handler is wired (line charts have no chip — no drill behavior). Footer hint trimmed to 'Charts powered by Recharts. Hover for tooltips.'
- **Item 6 (Option B) — Product code rename + Nutanix removal**:
  - NAI → Atlas, NC2 → Orion, NCI → Vega across all 6 dataset row JSONs (deal_name / campaign_name / product_line / primary_product values), 4 profiling fixtures' AI narrative text, `lib/wireframe-templates.ts` mock byProduct bars, design-system-docs example tables, dashboard-factory + ai-core READMEs.
  - 'Nutanix' string removed from user-facing copy: marketing campaign 'Search Brand — Nutanix Cloud' → 'Search Brand Campaign'; datasets page description 'Nutanix-style' → 'Anonymized'; repo READMEs anonymized to 'enterprise SaaS data work'.
  - Plan files (`docs/master-plan.md`, `docs/plan.html`) keep Nutanix references as historical project context — those are private project docs, not user-facing.
- **Item 2 — Dash cleanup** in user-visible text:
  - Em-dashes (—), en-dashes (–), and hyphen-with-spaces (- ) removed from: all 6 profiling fixtures (the AI narrative shown to users during streaming), 5 dataset JSONs (deal/campaign names with em-dashes), home page hero + persona descriptions, datasets gallery copy, wireframe page hero + footer hint, error.tsx + not-found.tsx error copy, dashboard route metadata description, fallback profiling-text builder in lib/profiling.ts.
  - Replacement strategy: ' — ' / ' – ' / ' - ' between words → ', ' (treating dashes as parenthetical pauses).
- **Bug + recovery during dash cleanup**: my regex `(\w) - (\w) → (\w), (\w)` correctly hit em-dash substitutes but ALSO matched real JS arithmetic like `points.length - 1`, turning it into `points.length, 1` (syntactically valid TypeScript comma operator, semantically broken). Build broke; caught via `tsc --noEmit` (3 files, 5 errors). Recovery: `git checkout HEAD -- file1 file2 file3 file4` reverted the corrupted SVG/math-heavy files (MockCharts, ExecutiveLayout, ExploratoryLayout, wireframe page sketches), then re-applied Item 7 + Item 2 changes manually to wireframe/page.tsx. Total cleanup time ~5 min thanks to git's cheap revert. **Lesson**: bulk text-replace across whole TSX files is unsafe when patterns can match code. Constrain to JSON content fields, JSX text nodes, or markdown.
- **Build**: 25 of 25 pages still prerendered. Typecheck clean. Commit `fb4aba1` pushed (31 files, +249/-218).
- **Context for W4.D4 (Thu)**: PDF visual fidelity. The current PDF is a structured text-summary (correct per Day 4 design but not what user wants). Switch to html2canvas + jsPDF: capture the actual rendered dashboard DOM (with Recharts visuals + brand colors + typography), convert to PNG, embed in PDF. Preserve filter-aware behavior. Test on all 6 datasets. Watch file size + render time.
- **Next**: Week 4 Day 4 — PDF visual fidelity

### 2026-04-28 · Week 4 Day 2 (post-deploy hotfix) — KPI + chart count parity with profiling fixtures
- **User caught a real gap**: profiling fixture text on RevOps Sales SSOT promised 5 KPIs (Total ACV / Avg GRR / Active deal count / Win rate / Top product) + 4 charts, but the dashboard rendered only 2 KPIs + 3 charts. Audited all 6 datasets — same pattern every time, fixtures consistently promise 5+4 and the builder produced fewer.
- **Root cause**: `lib/dashboard-builder.ts` derived KPIs strictly from schema-typed `measure` columns (capped at 4) and produced exactly 3 charts (bar + line + donut). Datasets with 1-2 measures fell short. The profiling fixtures are hand-curated *narrative* — they describe what an analyst would recommend, not what the schema-driven builder materialized. Narrative-vs-implementation drift.
- **Fix in `dashboard-builder.ts`** — extends builder to synthesize derived metrics + a 4th chart:
  - **KPIs target 5**: schema measures (sum/avg per `aggregation` hint) up to 5, then fill from a priority list of derived KPIs:
    1. `Total {entity}` — row count, entity name from id-column label (`'Deal ID' → 'Total Deals'`)
    2. `Top {primary dimension}` — modal value by primary measure (`'Top Segment: Enterprise'`)
    3. `{primary dimension}s` — distinct count of primary dim (`'Segments: 3'`)
    4. `{secondary dimension}s` — distinct count of secondary dim if still under 5
  - **Charts target 4**: primary bar, trend line, donut, secondary bar (primary measure × tertiary useful dim).
  - **"Useful dimension" filter** skips columns whose distinct-value count equals row count (e.g. `opportunity_name` with 40 unique values across 40 rows). Stops "Top {dim}" from being meaningless and silently fixes the chart-quality regression where the primary bar was rendering 40 individual deal names as 6 bars (each = one row's value, no aggregation).
- **Side-effect that's actually an improvement**: revops-sales' primary bar promoted from "ACV by Opportunity" (40 individual deals) to "ACV by Segment" (3 segments, real aggregation) — exactly what the curated profiling fixture recommends ("ACV by region, stacked by channel … makes the asymmetry pop"). Chart insight quality lifted alongside the count fix.
- **Other changes**:
  - `lib/format.ts`: added `pluralize()` and `formatInteger()` exports for shared use across dashboard-builder + segment filter (was duplicated privately in `_dashboard-interactive.tsx`).
  - `_dashboard-view.tsx`: KPI grid switches to `lg:grid-cols-5` when count is 5 (else 4). Sm-breakpoint also bumps to `grid-cols-3` for 5-KPI dashboards so they wrap as 3+2 rather than the awkward 2+2+1.
  - `_dashboard-interactive.tsx`: drops local `pluralize`, imports the shared one.
  - `_streaming-panel.tsx`: counter text updated from "3 charts" to "5-KPI strip + 4 charts".
- **Verified live on production via Playwright**:
  - **revops-sales** (2 measures → 5 KPIs): ACV $14.4M · GRR % 93.9% · Total Deals 40 · Top Segment Enterprise · Segments 3. Charts: ACV by Segment · ACV trend · Distribution by Region · ACV by Channel.
  - **financial-complaints** (1 measure, worst case → 5 KPIs): Days to Resolve 12 days · Total Complaints 36 · Top Product Mortgage · Products 6 · Issue Types 7. Charts: Days to Resolve by Product · trend · Distribution by Issue Type · Days to Resolve by State.
  - **customer-demographics** (3 measures → 5 KPIs): Lifetime Value $76.1M · CSAT 85.8 · NPS 49 · Total Customers 38 · Top Segment Enterprise. Charts: Lifetime Value by Segment · trend · Distribution by Industry · Lifetime Value by Size.
- **Build clean** — typecheck passes, all 25 pages still prerender.
- **Commits**: `8b55bc6` (builder fix), `f901c13` (counter text), `5b271d7` (KPI grid responsive).
- **Lesson for Project 2 onwards**: when fixtures contain *prescriptive* content (Recommended KPIs, Recommended Charts), the dashboard-builder needs a corresponding extraction layer or the user feels lied to. Either the builder honors the fixture or the fixture stops promising. Day 7 QA's "0 console errors" pass missed this because the bug was semantic (count mismatch) not technical.

### 2026-04-28 · Week 4 Day 2 — Production Deploy + Lighthouse to 90+
- **Live at https://ai-portfolio-dashboard-factory.vercel.app**. Vercel project deployed from main, autodetected Next.js, build target `apps/dashboard-factory` with `pnpm install --frozen-lockfile` at workspace root. First production deploy + 4 follow-up patch deploys completed in the same session.
- **4 issues caught during production QA, all fixed**:
  1. **Doubled title suffix** — Day 1's `template: '%s · Dashboard Factory'` in root layout was appending to per-route titles that already included the suffix. Result: "Dashboard · RevOps Sales SSOT · Dashboard Factory · Dashboard Factory" (visible in browser tab + degrades SEO). Fixed by stripping the suffix from 8 sites across 5 files; the template handles it now.
  2. **Color contrast (a11y)** — design-system token `--color-text-muted: #6b7280` failed WCAG AA against the lightest card surface (~3.8:1 vs required 4.5:1). Lifted to `#94a3b8` (slate-400, ~6.4:1). Stays distinct from `--color-text-secondary: #9ca3af` so visual hierarchy holds. **Token-level change → all consumers benefit**.
  3. **Heading order (a11y)** — two skips: home page `PersonaCard` used `<h3>` directly under hero `<h1>` (skipped h2); `AiNarrativeBlock` mapped markdown `##` to `<h4>` (skipped h2 and h3 under page h1). Fixed by promoting PersonaCard to h2 and remapping AiNarrativeBlock so markdown `h2 → <h2>`. Pixel output unchanged (CSS classes drive size, not the tag) — only semantic levels shift.
  4. **Links rely on color (a11y)** — footer links to GitHub repo + portfolio site were teal-on-dark only, no underline. Added `underline underline-offset-4 decoration-accent/40 hover:decoration-accent`. Visible signal that doesn't depend on color recognition.
- **Lighthouse audit, final scores** (run via `npx lighthouse@12 --preset=desktop --headless`):
  - Home page (`/`): **Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100** — perfect across the board after the a11y fixes.
  - `/generate/revops-sales` (Lighthouse followed the navigation guard from `/dashboard/revops-sales` because headless Chrome had no Zustand seed): **Performance 100 · Accessibility 98 · Best Practices 100 · SEO 100** — well above the 90 target on all 4 categories.
- **Why headless Lighthouse hit /generate not /dashboard**: the navigation guard correctly redirects unprofiled dataset routes — exactly the Week 2 Day 6 design intent. A subtle reminder that Lighthouse runs in a clean browser context with no localStorage, so any nav guard logic surfaces immediately.
- **Tooling friction**: Google PageSpeed Insights API rate-limited the unauthenticated path (quota_limit_value: 0/day for this consumer), so fell back to local `lighthouse@12` CLI via `npx`. Worked despite a Windows EPERM cleanup error at the end of each run — the JSON output was written before the cleanup race fired, so audits completed correctly.
- **Build observations from Vercel**: monorepo build worked first-shot. `pnpm install --frozen-lockfile` at workspace root handled the workspace deps (`@rishi/design-system`, `@rishi/ai-core`) without `transpilePackages` issues — `next.config.mjs` had it pre-configured from earlier days. All 25 pages prerendered. No env vars needed for the basic deploy (`VERCEL_URL` auto-injection drove the metadataBase resolution).
- **portfolio.meta.json updated**: `liveUrl: https://ai-portfolio-dashboard-factory.vercel.app`, `deployedAt: 2026-04-28`.
- **Commits** (4 to dashboard-factory + 1 to design-system in this session):
  - `69523f8` — fix: metadataBase fallback follows ai-portfolio-{slug} convention
  - `ad1c783` — fix: strip redundant 'Dashboard Factory' suffix from route titles
  - `9c58611` — fix(a11y): lift text-muted contrast + heading order + link underlines
  - `d10a385` — chore: set dashboard-factory liveUrl + deployedAt
  - `b587369` — fix(a11y): AiNarrativeBlock heading mapping preserves document order
- **Context for Day 3 (Wed)**: Loom video. Plan a 90-second walkthrough — problem framing (10s) → datasets gallery (15s) → profiling stream animation (20s) → dashboard interactivity + drill-down (30s) → PDF export (10s) → outro with link (5s). Record on a clean Chrome window at 1440px viewport. Edit (trim, captions, end card). Upload to YouTube unlisted. Update `portfolio.meta.json` with `loomUrl` + commit.
- **Next**: Week 4 Day 3 — Loom Video

### 2026-04-28 · Week 4 Day 1 (close) — Favicon + OG image + remote-agent post-mortem
- **Day 1 closed**, 4 of 5 tasks done in code; Lighthouse audit explicitly deferred to Day 2 because dev mode penalises minification / source maps / dev overlay scripts and only a deployed production build gives a meaningful score.
- **Originally scoped for the scheduled remote agent** (`trig_0137DKtjApb6tmmuxGgDwR4n`) which fired at 03:30:05 UTC = 09:00:05 IST as expected. But by 10:36 IST no PR existed and no `polish/favicon-og` branch was on origin. Diagnosis: routine config attached **no MCP connectors and no GitHub credentials**, only `[Bash, Read, Write, Edit, Glob, Grep]` allowed tools. Sandbox could clone over HTTPS (read-only is fine for public repos) and run the file work + `pnpm build`, but `git push origin polish/favicon-og` requires write auth which the sandbox didn't have. Push failed silently. With `persist_session: false`, even the session output was gone by the time we investigated. **Lesson**: any remote routine that needs to *modify a repo* must have either GitHub MCP attached or explicit write credentials provisioned in the routine's secret store. Read-only research routines are fine without.
- **Did the work in-session instead**, ~30 minutes total:
  - **`app/icon.tsx`**: 32×32 favicon via next/og's `ImageResponse`. Teal gradient (`#2dd4bf` → `#14b8a6`) with dark `#0a0a0f` "DF" letterform, mirrors the Nav DF mark. PNG generated at build time so the source stays inspectable as JSX (no opaque binary in git).
  - **`app/apple-icon.tsx`**: 180×180 iOS variant of the same design.
  - **`app/_lib/og-renderer.tsx`**: shared 1200×630 ImageResponse renderer. Fetches Space Grotesk Bold from Google Fonts at build time with graceful system-sans fallback if fetch fails. Brand spec inlined (background `#0a0a0f`, hero gradient `#5eead4` → `#2dd4bf`, body `#cbd5e1`, muted footer `#94a3b8`) because next/og has no stylesheet context.
  - **`app/opengraph-image.tsx`** + **`app/twitter-image.tsx`**: thin entrypoints declaring inline configs (runtime, size, contentType, alt) and importing the shared renderer. **Key Next.js gotcha**: convention-file static analyzer cannot follow re-exports of `runtime`/`size` — only the `default` export is safely re-exportable. First version of twitter-image used `export { runtime } from './opengraph-image'` and Next.js silently dropped it with a build warning. Fixed by extracting renderer to `_lib` and declaring configs in each entrypoint.
- **Verified via Playwright on production build** (`next start -p 3002`):
  - `/icon` renders 32×32 teal-gradient DF mark
  - `/opengraph-image` renders 1200×630 with Space Grotesk Bold loaded (gradient title visible, brand mark + wordmark, subtitle, dual footer with live status + project tag)
  - Home page `<head>` contains `og:image`, `twitter:image`, `apple-touch-icon`, `<link rel="icon">` all wired as absolute URLs from `metadataBase`, with cache-busting query strings added by Next.js
  - **0 console errors** — Day 7's `/favicon.ico` 404 is fully resolved
- **Build**: 25 of 25 pages prerendered (was 21, +4 image routes). Each image route 139 B / 103 kB First Load. `/dashboard/[slug]` unchanged at 307 kB.
- **Commit**: `5bf0458` pushed to main.
- **Routine cleanup**: `trig_0137DKtjApb6tmmuxGgDwR4n` already auto-disabled (`enabled: false`, `ended_reason: "run_once_fired"`) so no action needed there. Manage future routines at https://claude.ai/code/routines if the user wants to delete it from the list.
- **Context for Day 2 (Tue evening)**: Production deploy. Create Vercel project `ai-dashboard-factory` from the existing GitHub repo, configure turborepo build (`pnpm install --frozen-lockfile && pnpm --filter dashboard-factory build`, output `apps/dashboard-factory/.next`), point at `main`. Deploy. Smoke-test all 6 datasets + 3 wireframes on the production URL. Author `apps/dashboard-factory/portfolio.meta.json` with the live URL + deployedAt. Then run actual Lighthouse on the deployed build, iterate findings until 90+ on all 4 categories.
- **Next**: Week 4 Day 2 — Production Deploy

### 2026-04-27 · Week 4 Day 1 (partial) — SEO metadata + 404/error pages
- Three of the five Day 1 polish tasks shipped in-session. Favicon + OpenGraph image scheduled to land tomorrow morning via remote agent (`trig_0137DKtjApb6tmmuxGgDwR4n`, fires 2026-04-28T03:30:00Z = 09:00 IST). Lighthouse audit deferred to Day 2 because dev mode penalises minification / source maps / dev overlay scripts — only a deployed production build gives a meaningful score.
- **Root layout metadata expanded** in `apps/dashboard-factory/app/layout.tsx`:
  - `metadataBase` resolves from `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → planned production hostname `https://ai-dashboard-factory.vercel.app`. Means OG tags get absolute URLs without code changes when Day 2 ships the Vercel deploy.
  - Title uses template form `'%s · Dashboard Factory'` so child routes append automatically.
  - Added: keywords (11 portfolio-relevant terms), authors + creator, robots block with explicit `index/follow` and a separate googleBot block (`max-image-preview: large`, `max-snippet: -1`), openGraph (siteName, locale, url), twitter card (`summary_large_image`), formatDetection (no auto-link telephone/email/address).
  - **Viewport export** with `themeColor: '#0a0e1a'` (mobile chrome browser tints to brand color), `colorScheme: 'dark'`, mobile `initialScale: 1`.
- **Skip-to-content link** in body — visually hidden by `sr-only`, becomes visible on keyboard focus via `focus:not-sr-only`. Anchored at `<main id="main-content">`. Standard a11y pattern that earns Lighthouse points without polluting the design.
- **Three error-state pages**:
  - `app/not-found.tsx`: branded 404 with the same card pattern as the dataset gallery, three re-entry routes (Home / Datasets / Wireframe). `robots: { index: false, follow: true }` so search engines don't index error pages but still crawl outbound links. Quoted apostrophes via `&apos;` to keep React happy.
  - `app/error.tsx`: route-level boundary. Try-again button calls Next.js's `reset()` to re-render the failed segment without a full reload. Back-to-home as escape hatch. Surfaces `error.digest` (the stable hash Next.js attaches) as a reference code so users can share something concrete with us without leaking the stack trace itself.
  - `app/global-error.tsx`: last-resort boundary. Catches errors in the root layout itself (e.g., metadata function blew up, font import failed at runtime). Self-contained `<html>/<body>` with **inline styles only** — globals.css and Tailwind classes can NOT be relied on here because the layout that loaded them just failed. Inline styles use the same brand hex values to stay on-brand even when CSS is gone.
- **Why scoped per-chart not page-level for the error boundary** (recap from Day 6): the per-chart boundaries handle Recharts data-shape failures. The new `error.tsx` handles broader rendering failures — together they form a graceful degradation chain: chart fails → tile shows fallback; route segment fails → `error.tsx` takes the route over but rest of app survives; root fails → `global-error.tsx` keeps the app branded even with no layout.
- **Build**: 21 of 21 pages still prerendered. `/_not-found` registered as static at 128 B / 103 kB First Load JS. Other routes unchanged.
- **Commit**: `a802f2c` pushed to main.
- **Context for Day 2 (Tue)**: Production deploy. Create Vercel project `ai-dashboard-factory`, configure turborepo monorepo build (`pnpm install --frozen-lockfile && pnpm --filter dashboard-factory build`, output `apps/dashboard-factory/.next`), point at `main` branch. Deploy. Smoke-test all 6 datasets on production URL (the chart fix from Day 7 should hold). Author `apps/dashboard-factory/portfolio.meta.json` with the live URL. Then run Lighthouse on the deployed build aiming for 90+ on all 4 categories.
- **Note**: Day 1 PR from remote agent will land tomorrow morning (favicon + OG). Merge that BEFORE Day 2 deploy so the Vercel build picks up both pieces in the same release.
- **Next**: Week 4 Day 2 — Production Deploy

### 2026-04-27 · Week 3 Day 7 — End-to-end QA + Week 3 close
- **Driven via Playwright against the local dev server**. Walked all 6 dataset flows (gallery → profiling → dashboard → filters → drill-down → PDF), all 3 wireframe templates including variant switcher, and all 3 responsive breakpoints (375 mobile / 768 tablet / 1440 desktop). Captured screenshots for the case study evidence trail.
- **Three bugs surfaced on the very first dashboard, all fixed**:
  1. **Recharts 0×0 — bar and line charts rendering as empty boxes**. Recharts ResponsiveContainer reported `width(0) and height(0)` warnings even though the parent card was clearly tall. Root cause: nested flex with percentage heights — `h-full` on a child of `flex items-center justify-center` does not resolve to the parent's height because `align-items: center` collapses the child to its content height (zero, since Recharts had nothing to measure to start with). Donut chart escaped because it used explicit `w-32 h-32`. Fixed by switching the chart wrappers from `h-full` to explicit `h-[280px]`. Also tightened `ChartCard` body so the ready-state child stretches via `flex-col` rather than being centered.
  2. **Naive pluralization** — segment filter showed `All opportunitys` / `All companys` for any dimension label ending in 'y'. Replaced `${label.toLowerCase()}s` with a tiny `pluralize()` helper that handles consonant+y → ies and s/x/z/ch/sh → es. Now correctly shows `All opportunities` / `All companies` / `All campaigns` / `All skus` / `All products`.
  3. **Drill-down dialog close button scrolls off-screen** — when clicking a segment with 19+ rows, `DialogContent` had no height cap and the inner table's `max-h-[60vh]` scrolled inside while the dialog itself extended below the viewport, pushing the close button off-screen. Constrained `DialogContent` to `max-h-[90vh] flex flex-col` and changed the inner region to `flex-1 min-h-0 overflow-auto`. Close button now stays anchored at the top regardless of row count. Escape key still works.
- **What was already correct**:
  - Navigation guard correctly redirected `/dashboard/marketing-campaigns` to `/generate/marketing-campaigns` for unprofiled datasets — exactly the Week 2 Day 6 design intent
  - Filter clear → info toast, PDF export → download + success toast (Day 6 wires confirmed live)
  - Drill-down filter math: clicking Enterprise legend item gave 19 rows, all correctly filtered to Segment="Enterprise"
  - All 6 dataset domains render correct KPI counts (revops/marketing/pulse/supply/customer have 4-up KPIs; financial-complaints has 1 because schema has only 1 measure column)
  - All 3 wireframe templates render with correct color tokens (executive teal, operational amber, exploratory purple), variant switcher chips theme to other templates' colors
  - Inverse-good color semantics work in operational layout: latency/errors/pages/incidents all show green when ↓
- **Pre-existing items deferred to Week 4**:
  - `/favicon.ico` 404 (already on Week 4 Day 1 task list)
  - At 375 mobile, the "Re-profile / Switch dataset" action row truncates slightly (acceptable, not blocking)
- **Build**: 21 of 21 pages prerendered, `/dashboard/[slug]` at 121 kB + 307 kB First Load JS (no change from Day 6 since fixes are localized). Typecheck clean.
- **Commits**: `ed2622a` (fixes) pushed to main. **Tag `week-3-complete` created and pushed** with the 7-day summary.
- **Context for Week 4 Day 1 (Mon)**: Production polish. Lighthouse audit aiming for 90+ on Performance/Accessibility/Best Practices/SEO. SEO meta tags + Open Graph images. Favicon. 404/error pages. Social preview image.
- **Next**: Week 4 Day 1 — Production Polish

### 2026-04-27 · Week 3 Day 6 — Empty/loading/error states
- Quality-of-life pass that none of users will notice when things work but ALL of them would notice if it were missing. Bedside manner, not marketing surface.
- **`loading.tsx`** for `/dashboard/[slug]`: Next.js 15 auto-wraps this in a Suspense boundary at the route level. Mirrors the live layout shape (header skeleton + filter bar skeleton + counter row + 4-up KPI strip with mini-card skeletons + 2x2 chart grid with bar-skeleton bodies) so the transition feels like a paint refresh rather than a destination change. Server work streams in around it.
- **`_chart-error-boundary.tsx`**: class-based React error boundary (functional `useErrorBoundary` still hasn't shipped to React 19 stable) **scoped per chart** rather than at the page level. If one chart's data is malformed (NaN values, empty bars array, Recharts internal layout failure), only that tile shows the AlertTriangle fallback panel; the other 3 charts on the dashboard stay live. Has a "Retry render" button that calls `setState({error: null})` to clear without a full reload.
- **Tiny toast system** powered by Zustand:
  - `lib/toast-store.ts` — in-memory queue with imperative shortcuts: `toast.success(title, description?)`, `toast.error(...)`, `toast.info(...)`. Auto-dismiss durations: 4s default, 6s for errors. Each entry gets a stable random ID; Radix's `onOpenChange(false)` triggers store removal.
  - `app/_components/Toaster.tsx` — bridges the store to Radix Toast primitives. Variant-mapped icons (CheckCircle2 / AlertCircle / AlertTriangle / Info). Mounted once in the root layout.
- **3 toast wires in `_dashboard-interactive.tsx`**:
  - Filter clear → `toast.info('Filters cleared', 'Showing all rows')`
  - PDF success → `toast.success('PDF exported', filename)`
  - PDF failure → `toast.error('PDF export failed', err.message)` (replaces the silent `console.error` that was there before)
- **Drill-down empty case**: already handled. `DrilldownTable` passes `emptyMessage="No matching rows"` to the DataGrid, so clicking a slice that filters down to 0 rows renders gracefully without an additional toast (avoids alert fatigue when the user can already see the empty state).
- **Why scoped per-chart not page-level for the error boundary**: the failure modes here are localized to data shape — NaN in one column, an empty `bars` array on a filter that ate the dimension, etc. A page-level boundary would replace the entire dashboard with a single error card; scoped boundaries preserve the working charts so the user can still get value from what's working AND see what failed.
- **Build**: `/dashboard/[slug]` grew from 305 kB → **307 kB First Load JS** (+2 kB for the error boundary class + Zustand toast store + Radix Toast import in the layout). Other routes unchanged. Typecheck clean. 21 of 21 pages still prerendered. Commit `c931626` pushed.
- **Context for Day 21 (Sun)**: end-to-end QA. Walk all 6 datasets through the full flow: gallery → profiling stream → dashboard → search/segment/date filters → drill-down on bar + donut → PDF export. Then walk each wireframe template + the variant switcher. Check responsive at 320 / 480 / 768 / 1024 / 1440 / 1920. Fix any bugs uncovered. Tag Week 3 complete.
- **Next**: Week 3 Day 7 — End-to-End QA + Week 3 close

### 2026-04-26 · Week 3 Day 5 — Wireframe mode
- The home CTA "Try wireframe mode" no longer 404s. `/wireframe` shows a gallery of 3 layout archetypes; clicking any card lands on a fully-designed hi-fi mockup ready to share with a stakeholder.
- **Why this exists**: Persona B from the master plan is a BI engineer kicking off a new dashboard project who needs a clickable hi-fi wireframe for Monday's discovery session, but doesn't want to spend a week in Figma first. They pick a layout archetype, share the URL, and use it as the conversation anchor.
- **3 layout archetypes**:
  - **Executive** (sparse): oversized $148.2M headline KPI in 6xl-9xl gradient text, 10-quarter sparkline, 3 sub-KPI tiles, full-width 12-quarter trend chart. "1 number + 1 chart, sized for a CEO meeting room."
  - **Operational** (dense): live "auto-refresh 30s" indicator + 6-up KPI strip with inverse-good color semantics for latency/errors/pages/incidents (down is good) + 2x2 chart grid (bars/line/donut/bars) + status footer. "Control room view for an SRE on-call standup."
  - **Exploratory** (medium): 3-col sticky filter rail with search/segment checkboxes/Group-by chip selector/date range/Save view CTA + 9-col main with 4-KPI row + cohort retention heatmap + 2-up bottom (industry mix donut + LTV distribution bars). "Analyst's notebook for an ad-hoc investigation."
- **Key architectural decision — hand-rolled SVG over Recharts**: wireframes are static. No resize observers, no tooltip state, no filter recompute. Recharts is already on the live `/dashboard/[slug]` route at ~110 kB; a second copy would be wasteful. Inline SVG renders server-side with no `'use client'` boundary, so the wireframe route ships as RSC HTML. Visual language (rounded bar tops, sparse gridlines, soft accent fills) matches the live Recharts output so the wireframe reads as a faithful preview rather than a downgrade.
- **Filter rail is purely visual** — no state, no event handlers. Wiring real interactivity would (a) bloat the bundle, (b) break the "this is a mockup" mental model, (c) require a duplicate filter system that has nothing to do with real data. A wireframe is finished when it can carry a stakeholder conversation, not when it can drive production data.
- **7 new files**: `lib/wireframe-templates.ts` (metadata + 3 hand-curated demo datasets), `app/wireframe/page.tsx` (gallery), `app/wireframe/[template]/page.tsx` (dynamic route with `generateStaticParams`), `app/wireframe/_components/MockCharts.tsx` (4 SVG primitives — bar/line/donut/heatmap), 3 layout components (Executive/Operational/Exploratory).
- **Variant switcher**: each template page shows the other 2 templates as chips in the header so stakeholders can flip between archetypes during the discovery conversation without backing out to the gallery.
- **Mini-layout SVG sketches as gallery thumbnails**: instead of a single icon, each gallery card shows a 240×150 SVG abstraction of the actual layout (sparse hero box for Executive, 6-cell strip + 2x2 grid for Operational, filter rail + heatmap + 2-up for Exploratory). The thumbnail IS the wireframe-of-the-wireframe.
- **Build**: 3 wireframe routes prerendered (`/wireframe/executive`, `/wireframe/operational`, `/wireframe/exploratory`). 19.5 kB route-specific + 245 kB First Load JS. 21 of 21 pages generated. Typecheck clean.
- Commit `53117d0` pushed to main
- **Context for Day 20 (Sat)**: Empty/loading/error states. Skeleton loaders for the dashboard layout while it builds. Error boundary around Recharts in case a malformed dataset reaches the renderer. Toast notifications for user actions (filter cleared, PDF exported). Polish pass on existing edge cases — drill-down dialog with no rows, single-row datasets, all-null dimension columns.
- **Next**: Week 3 Day 6 — Empty/Loading/Error States

### 2026-04-26 · Week 3 Day 4 — PDF export
- Click **"Export PDF"** on the dashboard → @react-pdf/renderer dynamic-loads → a branded PDF downloads reflecting the current filtered state
- **Dynamic-import strategy**: `@react-pdf/renderer` is ~200 kB gzipped. Loading it eagerly would push the route over 500 kB First Load JS. Solution: Promise.all-import the renderer + the local pdf-document.tsx ONLY when the user clicks Export. First click takes ~500ms longer (chunk fetch); subsequent clicks are instant. Route's First Load JS stays at **307 kB** (was 306 kB before — only +1 kB).
- **`lib/pdf-document.tsx`** — `<DashboardPdf>` Document component using `@react-pdf/renderer`'s `<Page>` `<View>` `<Text>` primitives. Tailwind doesn't work in PDF context, so I rebuilt the brand identity via `StyleSheet.create()` using the same token values:
  - **Light theme**: white background, dark text, teal accent at `#14b8a6` (darker variant for white-bg contrast). Recipients usually print or share via email — light is the universal default.
  - **Document structure**: Header (eyebrow with domain + dataset title + tagline + meta row with timestamp/filter summary/row counts) → "Key metrics" 2-col KPI grid with bordered cards → bar chart as ranked horizontal-bar list → donut chart as legend list with color swatches + percentages → line chart as period-over-period list → fixed footer (brand line + page X/Y).
- **`_dashboard-interactive.tsx` updates**: Export PDF button next to filter count summary. Click handler does `Promise.all([import('@react-pdf/renderer'), import('@/lib/pdf-document')])`, then `pdf().toBlob()`, then `URL.createObjectURL` + programmatic `<a download>` click. Loading state shows spinner while generating. Filename: `{slug}-dashboard-{YYYY-MM-DD}.pdf`. Disabled when filtered rows = 0.
- The PDF reflects whatever the user is currently looking at: search query, segment filter, date range — all encoded in the meta row at the top of the PDF as "Filters {search: "polaris" · Segment: Enterprise}". Recipient knows exactly what slice was exported.
- Build: `/dashboard/[slug]` at **188 kB + 307 kB First Load JS** (was 187 + 306). Other routes unchanged. Typecheck clean.
- Commit `6b7be71` pushed to main
- **Context for Day 19 (Fri)**: Build `/wireframe/[template]` route — Persona B from the master plan. Goal: a BI engineer can pick from 3 layout templates (Executive / Operational / Exploratory) and see a static Figma-style mockup as a clickable hi-fi wireframe. Each template shows different layout patterns — Executive is "headline KPI + 1 big chart", Operational is "dense KPI strip + 4 charts in 2x2", Exploratory is "filter rail + free-form 12-col grid". Use the existing primitives + token system. PNG/PDF download options. This route is linked from the home page CTA "Try wireframe mode" and currently 404s.
- **Next**: Week 3 Day 5 — Wireframe mode

### 2026-04-26 · Week 3 Day 3 — Filters + drill-down
- The dashboard at `/dashboard/[slug]` is now **fully interactive**. Recruiters can search, segment, and re-slice every dataset live.
- **Architecture shift**: server now passes the full dataset (rows + schema) to the client. Client wrapper holds filter state and recomputes the layout via the existing pure `buildDashboardLayout()` whenever filters change. Sub-millisecond on the 30-50 row fixtures.
- **3 new files**:
  - `lib/filters.ts` — `DashboardFilters` type + `applyFilters()` + `computeMaxDate()` + `uniqueDimensionValues()`. Date range options (`all` / `recent-30` / `recent-90`) are **relative to the dataset's max date** (not today) so portfolio datasets spanning 2020-2026 always show data.
  - `app/dashboard/[slug]/_dashboard-interactive.tsx` — client wrapper holding filter + drill-down state. FilterBar with Search / primary-dimension Select / DateRange / Clear sub-components. EmptyFilterState card when no rows match.
  - `app/dashboard/[slug]/_drilldown-table.tsx` — thin DataGrid wrapper for the drill-down dialog (different defaults from `/generate/[slug]`'s preview).
- **3 updated files**:
  - `lib/dashboard-builder.ts`: signature changed from `buildDashboardLayout(dataset)` to `buildDashboardLayout(rows, schema)`. `DashboardChartData` bar + donut variants now carry `dimensionKey` + `dimensionLabel` so click-to-drill knows which column to filter on.
  - `_dashboard-view.tsx`: added `onBarClick` / `onDonutClick` props. Bar's Recharts onClick callback uses the new dimensionKey/dimensionLabel. Donut click also fires from legend rows (excluding the synthetic "Other" bucket which has no source rows). `cursor: 'pointer'` when handler is wired.
  - `_guard.tsx` + `page.tsx`: now pass `fullDataset` (not pre-built layout) since the layout is now built client-side per filter change.
- **Drill-down UX**: click any bar or donut slice → opens a `<Dialog>` with matching rows in the `DrilldownTable`. Title format: "{Dimension}: {Value}" + "{N} row(s) match this segment". Dialog overflow scrolls vertically when many rows.
- **Empty state**: when filters match 0 rows, the dashboard view is replaced by an `<EmptyFilterState>` card with an "Inbox" icon, friendly copy, and a "Clear all filters" button.
- **Build**: `/dashboard/[slug]` grew from **152 kB → 187 kB** route-specific (was 267 kB First Load JS, now **306 kB**). Added 39 kB for Dialog primitive + filter logic + drill-down. Slightly over the 300 kB mental ceiling, but expected for a fully-interactive analytics app with charts. Other routes unchanged. Typecheck clean.
- Commit `aef4f0c` pushed to main
- **Context for Day 18 (Thu)**: PDF export. Install `@react-pdf/renderer`. Define a branded PDF Document template matching the design system tokens (accent, surface, mono fonts) using react-pdf's `<Page>` `<View>` `<Text>` `<Image>` primitives. Generate the PDF from the current filtered state — KPI strip + bar chart (rendered via Recharts to PNG, then embedded), or simpler approach: generate a text-summary PDF with KPI numbers and a small bar list. Expose via an "Export PDF" button on the dashboard header strip. Use `@react-pdf/renderer`'s `pdf()` function which returns a Blob, then trigger a download.
- **Next**: Week 3 Day 4 — PDF export

### 2026-04-26 · Week 3 Day 2 — Recharts integration
- Installed `recharts@2.15.0` in `apps/dashboard-factory/`
- Rewrote all 3 chart renderers in `_dashboard-view.tsx` to use Recharts:
  - **BarChartView** — `<BarChart layout="vertical">` with horizontal bars, accent fill at 75% opacity, rounded right corners. Tooltip cursor highlights row on hover (`rgba(45,212,191,0.08)`).
  - **LineChartView** — `<AreaChart>` with linear-gradient area (accent 30% → transparent), 2px stroke, dot at each point, larger active-dot on hover, dashed-line tooltip cursor with monotone curve.
  - **DonutChartView** — `<PieChart>` with `innerRadius="62%"`, 6-color palette via `<Cell>` per slice. Center "{total} total" text rendered as an absolutely-positioned overlay div (`pointer-events-none` so slice hover still fires underneath the text).
- **Custom `<CustomTooltip>`** matching design tokens — surface-elevated background, surface-border ring, color-dot indicator, mono uppercase label, accent-formatted value with compact M/K notation.
- `formatChartValue()` for compact axis labels and tooltip values
- Same `DashboardChartData` discriminated union — only the renderer body changed. `chart-builder.ts` produced data is identical.
- **Build delta**: `/dashboard/[slug]` grew from 42.4 kB to **152 kB** (route-specific) + **267 kB First Load JS** (was 157 kB). Recharts adds ~110 kB unzipped. Under the 300 kB threshold but the heaviest route in the portfolio.
- Other routes unchanged (Recharts is route-scoped via Next.js code splitting)
- Typecheck clean
- Commit `ba847fb` pushed to main
- **Context for Day 17 (Wed)**: Wire up `FilterBar` from `@rishi/design-system/components` above the charts. Need to: (1) extract dimension columns + min/max date as filter options, (2) move dashboard layout building from server to client (or use server actions on filter change), (3) implement click-on-bar drill-down modal showing rows matching that bar, (4) empty state when filters match nothing. Probably need to refactor: keep `buildDashboardLayout` as a pure function, but have client call it on filter change with filtered rows.
- **Next**: Week 3 Day 3 — Filters + interactivity

### 2026-04-26 · Week 3 Day 1 — Live dashboard rendering shipped
- Replaced the Coming-Week-3 stub at `/dashboard/[slug]` with an actual rendered dashboard
- **Architecture**: server-side `buildDashboardLayout(dataset)` walks the schema and computes everything (KPIs from measure columns honoring sum/avg aggregation hints, bar chart from top measure × primary dimension, line chart from measure × time bucketed across the range, donut from count distribution of secondary dimension with auto-Other rollup). Result is JSON-serializable so it crosses cleanly into the client `<DashboardView>`. Day 16 swaps SVG → Recharts; the data shape stays identical.
- **3 new files** in `apps/dashboard-factory/`:
  - `lib/format.ts` — `formatKpiValue()` (compact `$14.8M`/`14.8K`/`97.2%`) + `bucketSparkline()` for KpiCard sparklines
  - `lib/dashboard-builder.ts` — pure server-side layout generator + `DashboardLayout`/`DashboardKpi`/`DashboardChartData` types
  - `app/dashboard/[slug]/_dashboard-view.tsx` — client component with KPI strip + 12-col chart grid (primary bar gets 7-of-12, secondary chart 5-of-12) + 3 SVG renderers (`BarChartSvg`, `LineChartSvg`, `DonutChartSvg`)
- **2 updated files**:
  - `page.tsx` — loads full dataset, calls `buildDashboardLayout()`, passes layout to guard
  - `_guard.tsx` — success branch swaps stub for `<DashboardSuccess>`. New header strip with "Live dashboard" status pulse + Re-profile / Switch dataset CTAs
- **The renderers are deliberately polished** for static SVG:
  - Bar chart: horizontal bars with right-aligned values, accent-colored fills at 70% opacity
  - Line chart: gradient-filled area (accent at 30% → transparent), 2px stroke, endpoint dots, dashed gridlines, x-axis labels
  - Donut chart: proportional arc paths with `{total} total` centered, 6-color palette legend (accent + Tailwind purple-400/blue-400/amber-400/rose-400/emerald-400) for slice differentiation
- **Build delta**: `/dashboard/[slug]` grew from 3.65 kB (stub) to **42.4 kB + 157 kB First Load JS** — full dataset JSON inlined per route + KpiCard + ChartCard + the 3 SVG renderers. All 6 dataset routes pre-render. Typecheck clean.
- Commit `25e9599` pushed to main
- **Context for Day 16 (Tue)**: Install Recharts. Swap each SVG renderer for the equivalent Recharts component — `BarChartSvg` → Recharts `<BarChart>`, `LineChartSvg` → Recharts `<LineChart>`, `DonutChartSvg` → Recharts `<PieChart>` with `innerRadius`. The `DashboardChartData` type stays identical, only `<ChartRenderer>` switches. Bonus: tooltip hover, click-to-highlight, smooth animations on enter.
- **Next**: Week 3 Day 2 — Recharts integration

### 2026-04-26 · Week 2 Day 7 — Responsive polish + WEEK 2 WRAPPED
- **Code-level responsive fixes** to dashboard-factory (visual QA at 320-1920px is on the user's side via the running dev server at http://localhost:3002):
  - **Nav.tsx**: hide "Dashboard Factory" brand text below sm (640px) — only DF logo shows on small phones, full text appears tablet+. "Project 01" badge now hidden below md (768px). Touch targets bumped to `min-h-[44px]` (WCAG minimum). Added `min-w-0` + `truncate` on brand text, `shrink-0` on logo + badge + link cluster, `aria-label` on the GitHub icon-only state.
  - **Streaming panel header**: `flex-wrap` so Cancel/Replay buttons drop to the next line on narrow screens. `text-xs` on mobile, `text-sm` on sm+, with `truncate` on the status string. `shrink-0` on Sparkles icon.
  - Card padding nudged to `p-4 sm:p-5` (slightly less padding at narrow widths so cards don't feel cramped).
- Dev server validated: Next.js 15.5.15 ready in 2.7s, no console errors, all 17 routes accessible
- Killed an orphan dev server holding port 3002 from earlier in the day (same Windows-pnpm-turbo signal-propagation issue as Day 5)
- Build clean: same 17 static pages, sizes unchanged (these are class-only changes)
- Commit `6070f9d` pushed to main
- **Week 2 is officially complete.** Project 1 has all 4 routes navigable end-to-end:
  - `/` — landing with hero, two persona cards, three-step preview
  - `/datasets` — gallery of 6 domain-tinted cards (manifest-driven)
  - `/generate/[slug]` — dataset preview + streaming Claude profiling with progress steps + Zustand-cached completion
  - `/dashboard/[slug]` — guarded route, redirects to /generate if not profiled, otherwise renders Coming-Week-3 stub
- 7 days of compounding work: Day 1 scaffold → Day 2 fixtures → Day 3 gallery → Day 4 streaming → Day 5 curated fixtures → Day 6 state+guards → Day 7 polish
- **Context for Week 3 (Days 15-21)**: Now we replace the Coming-Week-3 stub with the real dashboard rendering. Plan: Day 15 layout generator + render KpiCard/ChartCard from profiling fixture's recommendations. Day 16 hook up Recharts with real dataset values. Day 17 filters + interactivity. Day 18 PDF export. Day 19 wireframe mode (`/wireframe/[template]` with 3 layout templates). Day 20 polish empty/loading/error states. Day 21 end-to-end QA.
- **Next**: Week 3 Day 1 — Dashboard Layout Generator

### 2026-04-26 · Week 2 Day 6 — Zustand state + nav guards + dashboard stub
- Added `zustand@5.0.2` as dep in `apps/dashboard-factory/`
- Created `apps/dashboard-factory/lib/store.ts` — tiny store with:
  - `profilingComplete: Record<slug, boolean>` (the only persisted state)
  - `markProfilingComplete(slug)` and `resetProfiling(slug)` mutators
  - Persisted to localStorage via `zustand/middleware/persist`
  - Exports `useStoreHydrated()` — hook that returns true only AFTER persist finishes loading from localStorage. Components gate UI on hydration to avoid SSR/client mismatch flashes.
- Updated `app/generate/[slug]/_streaming-panel.tsx`:
  - Reads `profilingComplete[slug]` from store after hydration
  - On mount: if user already profiled, render full text immediately and skip the streaming animation
  - When streaming completes: calls `markProfilingComplete(slug)` so future visits skip the animation
  - Replay button now resets the slug state and re-streams (clean reset, not just visual)
- Created `app/dashboard/[slug]/page.tsx` (server component) + `_guard.tsx` (client guard):
  - `generateStaticParams` pre-renders all 6 slug routes
  - Server component pulls dataset summary via `getDataset(slug)` and hands to client guard
  - Guard waits for hydration, redirects to `/generate/[slug]` if `profilingComplete[slug]` is false
  - On valid access, renders the **Coming-Week-3 stub**: header strip with status pill ("Profiling complete"), explainer card, CTAs (Replay profiling / Try another dataset)
- **Why the stub matters**: the "Generate dashboard" CTA on `/generate/[slug]` no longer 404s. Recruiters who click through don't hit a broken state. Week 3 ships the actual dashboard rendering into a working frame.
- Build: **17 static pages** (was 11). `/dashboard/[slug]` at **3.65 kB + 111 kB First Load JS** (light because guard + Zustand are tiny). `/generate/[slug]` grew slightly to 55.9 kB + 163 kB (Zustand bundle ~1 kB). Typecheck clean.
- Commit `c3827ed` pushed to main
- **Context for Day 14 (Sun)**: Final Week 2 day. Responsive QA across all 4 routes at 320px, 480px, 768px, 1024px, 1440px, 1920px. Test on mobile (Chrome devtools iPhone 14 emulator), tablet (iPad), desktop. Watch for: hero gradient text wrap on small screens, dataset gallery card stacking, /generate/[slug] header strip wrap, dashboard guard loading state visibility. Tag Week 2 complete and transition to Week 3 (dashboard rendering).
- **Next**: Week 2 Day 7 — Responsive polish + Week 2 wrap

### 2026-04-25 · Week 2 Day 5 — Profiling fixtures hand-curated
- Authored 6 profiling fixtures at `fixtures/dashboard-factory/profiling/<slug>.json`, each in the `Fixture` shape from `@rishi/ai-core` (id, text with markdown, metadata)
- Every fixture references its dataset's real columns by name (backticked) and calls out **at least one specific pattern** visible in the underlying rows:
  - `revops-sales` → Polaris Defense $1.24M deal (DL-26-0013) + NAMER-Direct vs APAC-Partner channel asymmetry
  - `marketing-campaigns` → MKT-Q2-021 Q2 Re-Engagement Email at 612% ROI + Display low-CTR pattern + spend-weighted CPA distinction
  - `pulse-telemetry` → **CUST-2847 health_score decline 96→82** (the anomaly story baked into the Day 2 dataset, now surfaced as the AI's headline insight)
  - `supply-chain` → Aurora Storage Co. as reliability anchor + Voltaic Systems delays (PO-26-1051, 1059, 1074)
  - `financial-complaints` → CMP-26-04022 38-day Postal Mail outlier + fraud-vs-mortgage resolution-time asymmetry
  - `customer-demographics` → Polaris Defense $8.42M LTV + SMB-Retail-Files churn cluster
- All 6 fixtures follow the 4-heading structure (`## Column Classification` / `Domain Inference` / `Recommended KPIs` / `Recommended Charts`) so StreamingPanel's progress UI continues working unchanged
- Each fixture is 2870-3278 chars (~48-55 sec at 60 cps streaming — substantial enough to feel real, with Replay button if the user wants to re-watch)
- `lib/profiling.ts` updated with `getProfilingFixture(slug, dataset)` — returns curated fixture when present, falls back to placeholder if missing. Static-imports keep webpack tree-shaking per route.
- `app/generate/[slug]/page.tsx` swapped `buildPlaceholderFixture` import for `getProfilingFixture`
- Build validated: same 11 static pages, `/generate/[slug]` still **56.3 kB + 162 kB First Load JS** — webpack confirmed tree-shaking each profiling fixture into its own route bundle
- Validation script confirmed all 4 required headings present in all 6 fixtures
- Commit `ac8ea1b` pushed to main; Vercel auto-redeploys design-system-docs (dashboard-factory still pending Vercel project setup)
- **Why hand-curated matters**: a recruiter clicking through `/generate/pulse-telemetry` will read text that names a specific customer (CUST-2847) and a specific anomaly (health_score 96→82). The AI output looks like it actually read the data. That's the curation work that elevates "demo" to "this person understands their domain."
- **Context for Day 13 (Sat)**: Per the master plan, Day 6 sets up Zustand state management + URL serialization. The page currently re-loads the JSON on every navigation; Zustand will cache across page transitions and support shareable links like `/dashboard/revops-sales?profiled=true`. Also wire up navigation guards so users can't reach `/dashboard/[slug]` (Week 3) without coming through `/generate` first.
- **Next**: Week 2 Day 6 — State management + navigation

### 2026-04-25 · Week 2 Day 4 — /generate/[slug] streaming profiling
- Built the first real AI surface in the portfolio (the design-system-docs streaming demo doesn't count — this is a customer-facing page)
- 5 new files in `apps/dashboard-factory/`:
  - `lib/full-datasets.ts` — static-imports all 6 dataset JSONs (webpack tree-shakes per route), exports ColumnSchema + FullDataset types, `formatCell()` utility for $/%/ms/dates, `getFullDataset()` lookup
  - `lib/profiling.ts` — `buildPlaceholderFixture()` generates domain-aware text from dataset metadata (Day 5 will replace with hand-curated fixtures). Heading markers (`## Column Classification`, `## Domain Inference`, `## Recommended KPIs`, `## Recommended Charts`) exported as constants so the streaming UI can watch for them.
  - `app/generate/[slug]/page.tsx` — server component with `generateStaticParams` to pre-render all 6 routes. Header strip with icon + row/column counts, dataset preview, streaming panel.
  - `app/generate/[slug]/_dataset-preview.tsx` — client wrapper around DataGrid (needed because column `render` functions can't cross the RSC server-to-client boundary)
  - `app/generate/[slug]/_streaming-panel.tsx` — client component using `replayFixture` from `@rishi/ai-core`. Auto-starts on mount, watches streamed text for heading markers to advance progress steps, shows AiNarrativeBlock with blink cursor, "Generate dashboard" CTA on completion. Cancel + Replay buttons. AbortController with useEffect cleanup.
- **Build break + fix in same commit**: design-system components/primitives that use React hooks needed `'use client'` directives so they work when imported from server components. Added to: AiNarrativeBlock, KpiCard, FilterBar, DataGrid (composed components) and Dialog, Tabs, Tooltip, Popover, Select, Toast, Command, Combobox, Avatar, Label (Radix primitives). Card, Badge, Button, Input, ChartCard stay server-renderable (pure forwardRef, no client-only features).
- **Important architectural learning**: the design system needed a precise client/server split. Marking everything `'use client'` would force the entire subtree into the client bundle, even when used in a server component. Marking only what truly needs it keeps Server Component Lookup Table costs near zero for the pure components. Standard shadcn convention.
- Build: 11 static pages generated, `/generate/[slug]` at **56.3 kB + 162 kB First Load JS** (full dataset JSON inlined + react-markdown + DataGrid + StreamingPanel)
- Commit `7855cb7` pushed to main; Vercel will auto-deploy when dashboard-factory is connected as a project
- **Context for Day 12 (Fri)**: Authoring 6 hand-curated profiling fixtures using Claude Code (zero API cost). Each fixture must follow the same 4-heading structure (`## Column Classification`, `## Domain Inference`, `## Recommended KPIs`, `## Recommended Charts`) so the StreamingPanel's progress UI continues to work. Reference real column names from the dataset (e.g. for revops-sales reference `acv_usd`, `segment`, `product_line`). Replace `buildPlaceholderFixture` import with a per-slug fixture loader.
- **Next**: Week 2 Day 5 — Profiling fixtures

### 2026-04-25 · Week 2 Day 3 — /datasets gallery built
- Created `apps/dashboard-factory/lib/datasets.ts` — typed manifest reader with 3 responsibilities:
  1. Imports `fixtures/dashboard-factory/datasets/index.json` at build time (Webpack inlines the JSON, no runtime `fs` calls)
  2. `getDatasetIcon(name)` — string → Lucide icon component map (TrendingUp, Megaphone, Activity, Truck, FileWarning, Users)
  3. `getColorClasses(token)` — domain color token → static Tailwind class map. **All class names are literal strings** so JIT can detect them; dynamic interpolation like `` `bg-${color}-500` `` would purge in production
- Created `apps/dashboard-factory/app/_components/Section.tsx` — reusable header pattern (eyebrow + title + description). Mirrors design-system-docs for consistency.
- Created `apps/dashboard-factory/app/datasets/page.tsx` — server component, server-renders the gallery to static HTML:
  - Back link to home at top
  - Section header: "Step 1 of 3 · Pick a dataset" + "Six curated samples to choose from"
  - 1/2/3-col responsive grid (mobile / tablet / desktop)
  - Each card: domain-tinted gradient thumbnail (color matches the fixture's `colorToken`) with the dataset icon at center, dot pattern overlay; body shows domain badge + row count, title (turns accent on hover), tagline, "Profile this dataset →" CTA
  - Hover state: -0.5 translateY + accent border + card-hover shadow
  - Footer note about the upload-disabled-for-demo design (managing visitor expectations)
- Updated `tailwind.config.ts` content array to include `./lib/**/*.{ts,tsx}` so the color class map is scanned
- Build clean: 5 static pages now, `/datasets` at 164 B + 106 kB First Load JS — same baseline as `/`. The manifest import added zero runtime overhead.
- Commit `ed8840d` pushed to main; Vercel will auto-deploy if dashboard-factory project is connected (still pending user setup)
- **Context for Day 11 (Thu)**: Build `/generate/[slug]` — the streaming profiling page. Two sections: dataset preview (first 10 rows from the full JSON, rendered as a DataGrid from design-system) and a streaming panel that uses `replayFixture` to animate a Claude profiling output. Profiling fixtures don't exist yet — they're authored on Day 5. For Day 4, use a temporary inline fixture so the streaming UX is testable end-to-end before Day 5 fills in the real content.
- **Next**: Week 2 Day 4 — Streaming profiling page

### 2026-04-25 · Week 2 Day 2 — 6 dataset fixtures authored
- Created `fixtures/dashboard-factory/datasets/` with 6 JSON files + manifest:
  - `revops-sales.json` (40 rows, 11 cols, accent) — Channel pipeline with NAI/NC2/NCI/Files/Move products, ACV/GRR/segment/region across NAMER/EMEA/APAC/LATAM
  - `marketing-campaigns.json` (36 rows, 13 cols, purple) — Cross-channel performance (Email / Paid Social / Display / SEM / Webinar / Content) with spend, CTR, CPA, ROI by audience
  - `pulse-telemetry.json` (42 rows, 13 cols, blue) — Daily product telemetry with intentional latent story: CUST-2847 NAI usage ramps while health_score declines 96→82 over the period (a real product team would notice this scaling concern)
  - `supply-chain.json` (38 rows, 13 cols, amber) — POs with realistic patterns: Aurora Storage on-time, Voltaic Systems delays, Crystalline Memory partial shipments
  - `financial-complaints.json` (36 rows, 11 cols, rose) — CFPB-style with realistic distributions: fraud has fastest resolution (3-5 days), mortgage modifications longest (12-38 days), dispute rates differ by channel
  - `customer-demographics.json` (38 rows, 13 cols, teal) — Customer segmentation by industry / size / region with LTV, CSAT, NPS, status (Active / At Risk / Churned)
- Authored `index.json` manifest — single line to update when adding a 7th dataset; gallery + downstream code never changes
- Authored `README.md` for fixtures directory documenting schema column types (id / dimension / measure / time with optional values / unit / aggregation), the consumer days, and add-a-dataset workflow
- Total: **230 rows** across **74 schema columns** — enough variety for the gallery, profiling, and dashboard rendering days
- Cross-fixture consistency: Customer IDs in `customer-demographics.json` line up with `pulse-telemetry.json` (CUST-2847, CUST-1923, CUST-3145) so a power user could theoretically join them
- Each fixture has a distinct `colorToken` (accent / purple / blue / amber / rose / teal) — the dashboard generator will pull the matching token to theme each output, making domains visually distinguishable
- Validated via Node JSON parse: all 7 files parse cleanly
- Commit `d58522d` pushed to main
- **Context for Day 10 (Wed)**: Build the gallery at `/datasets`. Read `fixtures/dashboard-factory/datasets/index.json` (the manifest), render a 6-card grid, each card shows thumbnail / title / tagline / domain badge / row count. Click → navigate to `/generate/[slug]`. Use the existing `Card` primitive from `@rishi/design-system`.
- **Next**: Week 2 Day 3 — Dataset Gallery UI

### 2026-04-25 · Week 2 Day 1 — Project 1 (dashboard-factory) scaffolded
- Created `apps/dashboard-factory/` mirroring the design-system-docs setup pattern (the foundation pays off — Day 1 of the new app took ~30 mins instead of a full day)
- 13 files: package.json (workspace deps on design-system + ai-core, port 3002), tsconfig (extends nextjs base), next.config.mjs (transpilePackages for both shared packages), tailwind.config.ts (presets [@rishi/design-system/tailwind.config]), postcss.config.js, next-env.d.ts, .gitignore, app/layout.tsx, app/_components/Nav.tsx (gradient "DF" logo mark + "Project 01" badge), app/globals.css, app/page.tsx, portfolio.meta.json, README.md
- **Landing page composition**:
  - Hero: eyebrow chip "Project 01 · Instant Analytics", title "Dashboards in **minutes**, not days." (with gradient on the word "minutes"), subtitle, two CTAs (Browse sample datasets → /datasets, Try wireframe mode → /wireframe)
  - Two persona cards stacked side-by-side: "Ad-hoc dashboard mode" (Business User) with the VP/CSV/Monday quote pulled from the master plan, "Hi-fi wireframe mode" (BI Engineer) with the discovery-session quote — both quotes rendered in serif italic with accent left-border
  - "How it works" section with 3 numbered step cards (Pick / Profile / Get dashboard)
- Footer pulls in the rishikeshgundla.com personal site link plus the monorepo
- Build: 4 static pages, **/ at 106 kB First Load JS** — exact match to design-system-docs baseline (no extra deps pulled in for Day 1)
- Typecheck clean, build clean
- Commit `aaf597b` pushed to main
- **Context for Day 9 (Tue)**: Authoring the 6 sample dataset fixtures in `fixtures/dashboard-factory/datasets/`. Each fixture is a JSON file with: 50 sample rows (realistic Nutanix-style anonymised data), metadata (display name, domain, recommended color token, row count, thumbnail path placeholder), schema description. These are CONSUMED by the gallery UI (Day 3) and profiling animation (Day 4). Generate using Faker patterns + manual curation for realism — not Anthropic API.
- **Next**: Week 2 Day 2 — Sample dataset fixtures

### 2026-04-24 · Day 7 complete — Week 1 WRAPPED
- Verified post-refactor deploy at https://ai-portfolio-design-system-docs.vercel.app/components — all 5 component sections render, "Simulate Claude streaming" button live, `replayFixture` from ai-core working in production
- Rewrote `packages/design-system/README.md` — previous version stopped at Day 2; now documents all tokens + 14 primitives + 5 AI components + motion variants with quick-start examples
- Rewrote monorepo root `README.md` with:
  - Live status line (44 / 98 tasks, links to live demo + plan)
  - Status table for all 6 apps (design-system-docs live, Projects 1-5 not started)
  - Mermaid architecture diagram showing packages → apps → fixtures relationships
  - Repository structure tree
  - Dev commands (`pnpm install`, `pnpm dev --filter`, etc.)
  - Tech stack summary
  - Conventions (no runtime AI, no premature [x], plan sync)
- `packages/ai-core/README.md` already current from Day 6 — no update needed
- **Week 1 is officially complete.** All foundation work done: monorepo, design system, AI core, first deploy, integration-tested. Week 2 starts building the first real AI app (Dashboard Factory).
- **Context for Week 2**: Everything downstream apps need is in place. Next 21 days (Weeks 2-4) build Project 1 using only `@rishi/design-system` + `@rishi/ai-core` + per-app fixtures. No more foundation work until the automation in Week 4.
- **Next**: Week 2 Day 1 — scaffold `apps/dashboard-factory/`

### 2026-04-24 · Day 6 complete — @rishi/ai-core implemented + integration-tested
- Fully wired up `packages/ai-core` (was placeholder since Day 1)
- Five TypeScript files:
  - `src/types/index.ts` — `Scenario`, `Fixture`, `FixtureMetadata`, `StreamConfig`, `AiNarrative`
  - `src/replay.ts` — core streaming primitives: `replayFixture` (async generator yielding accumulated text), `replayFixtureToString` (Promise<string> collector), `fixtureToReadableStream` (native web ReadableStream for `Response()`), `ReplayAbortedError`, `DEFAULT_STREAM_CONFIG` (40 cps, 300ms initial delay, 20% jitter)
  - `src/generate.ts` — dev-only Anthropic SDK wrapper: `generateFixture` + `generateFixtures` with optional prompt caching (90% cost reduction on repeat system prompts). Uses `claude-sonnet-4-6` by default.
  - `src/prompts/index.ts` — system prompts for all 5 projects (DASHBOARD_PROFILING, DASHBOARD_NARRATIVE, ANOMALY_RCA, SPRINT_BRIEF, PIPELINE_DIAGNOSIS)
  - `src/index.ts` — barrel that intentionally excludes `generate.ts` so client bundles never pull in `@anthropic-ai/sdk`
- Added deps: `@anthropic-ai/sdk` 0.40.0, `ai` (Vercel AI SDK) 4.0.22, `@types/node` 22.10.5
- tsconfig uses `moduleResolution: Bundler` (same as design-system) for relative imports without `.js` extensions
- **Integration test**: refactored `apps/design-system-docs/app/components/page.tsx` streaming demo to use `replayFixture` from ai-core instead of raw `setInterval`. Added proper `AbortController` with `useEffect` cleanup to prevent orphan streams on route navigation.
- Build validation: `/components` page size grew by only **0.8 kB** (86.2 → 87.0 kB), proving dev-only code is excluded from the client bundle.
- Typecheck clean across ai-core + design-system-docs
- Commit `7e55b7d` pushed to main — Vercel auto-redeploying the showcase
- **Context for Day 7**: Week 1 is effectively done. Day 7 is pure polish — READMEs per package, monorepo-level README with Mermaid architecture diagram, final design-system-docs visual QA.
- **Next**: Day 7 — Week 1 polish and wrap

### 2026-04-24 · First deploy LIVE — design-system-docs on Vercel
- Deployed via Vercel dashboard with Root Directory `apps/design-system-docs`, default turborepo auto-detection
- Public URL: **https://ai-portfolio-design-system-docs.vercel.app**
- Verified render via WebFetch — home page returns correct hero eyebrow, title, 3 catalog card titles, and install snippet mentioning `@rishi/design-system`
- `portfolio.meta.json` updated with `liveUrl` + `deployedAt: 2026-04-24`
- Phase 1 first concrete milestone: the portfolio now has a publicly accessible asset
- **Next**: Day 6 — Implement `@rishi/ai-core` (streaming replay + generate + types)

### 2026-04-24 · Day 5 complete — Design system showcase app built
- Scaffolded `apps/design-system-docs/` manually (not `create-next-app`) for monorepo precision — all configs hand-written with proper workspace wiring
- Framework: Next.js 15.1.6 App Router · React 19 · TypeScript · Tailwind 3.4.17
- Key config: `transpilePackages: ['@rishi/design-system']` in next.config.mjs (the one line most monorepo tutorials miss — without it, Next.js can't consume TSX source from workspace packages)
- Tailwind: `presets: [baseConfig]` from `@rishi/design-system/tailwind.config` + content globs include design-system source so all its utilities are emitted
- Globals.css imports `@rishi/design-system/tokens` at the top, then Tailwind layers — CSS variables are hydrated before any component mounts
- 4 routes:
  - `/` — Hero + catalog cards linking to 3 category pages + install code snippet
  - `/tokens` — Live swatches (accent family, base-900→600 scale, surface/text, status/severity palette), typography samples for all 3 font families, CSS keyframe demos (pulse-glow, float, fade-in), elevation showcase (card / card-hover / glow-lg)
  - `/primitives` — All 14 primitives with live variants: Button (6×4), Card (composed), Badge (6×3), Input+Label pair, Dialog with trigger, Popover, Tooltip, Tabs, Select, Combobox (with live state), Avatar
  - `/components` — Interactive AI component demos: KpiCard 4-state grid, ChartCard with SVG bar mock + loading variant, **AiNarrativeBlock with click-to-simulate Claude streaming at ~40 chars/sec** (this proves the streaming UX works end-to-end — it's the exact pattern all 5 apps will use), FilterBar with live state, DataGrid with sortable + paginated sample data
- Shared components at `app/_components/`: Nav (sticky with gradient logo mark), Section + SubSection (consistent header pattern)
- Build: 4 static pages generated, 10.6s compile, `/` First Load JS 105 kB, `/components` heaviest at 223 kB (framer-motion + react-markdown)
- Hit and fixed: `lucide-react` needed to be declared as direct dep in the app even though design-system imports it — pnpm workspace transitives aren't auto-resolved for direct imports. Resolved by adding explicit dep.
- `portfolio.meta.json` scaffolded with `deployedAt: null` (flipped to date once Vercel deploys)
- README per app with dev/build/deploy instructions
- Commit `516ceb7` pushed to main
- **Context for Day 6**: Design system is fully documented and browseable locally via `pnpm dev --filter design-system-docs`. To go live, you need to connect the repo to Vercel (one-time, handles all 6 future apps automatically). Once deployed, update `portfolio.meta.json` with liveUrl + deployedAt.
- **Next**: Day 6 — Implement `@rishi/ai-core` (currently placeholder). This is the streaming replay infrastructure that every app will use for fake-Claude streaming from pre-generated fixtures.

### 2026-04-24 · Day 4 complete — AI components + motion variants
- Built 5 AI-specific components in `packages/design-system/src/components/`:
  - `KpiCard.tsx`: value + unit + directional delta badge (up/down/neutral with invertGood option for churn-style metrics) + inline SVG sparkline + 4 states (ready/loading skeleton/empty/error) + Framer slideUp on mount
  - `ChartCard.tsx`: themed container that accepts any chart library as children; 4 states (ready/loading/empty/error) with skeleton bars, empty inbox icon, and error alert; optional actions slot top-right
  - `AiNarrativeBlock.tsx`: markdown renderer using react-markdown + remark-gfm with custom components matched to tokens (accent `→` list bullets, accent inline code, teal links); 3 variants (default/accent/muted); blink cursor when `streaming=true` — this is the core component for Claude-generated content across all 5 apps
  - `FilterBar.tsx`: compound component with sub-components (`.Search`, `.Select`, `.DateRange`, `.Clear`); 6 preset date ranges (7d/30d/90d/qtd/ytd/all); uses Select primitive internally
  - `DataGrid.tsx`: sortable columns with 3-state cycle (asc → desc → clear), pagination with page-of-pages display, row click handler, per-column render function, automatic numeric vs string comparator, align/width/className overrides
- Created `src/motion/index.ts` with Framer Motion variants matching the CSS keyframes: easings (out/in/inOut/smooth/elastic), durations (fast through slower), variants (fadeIn, fadeOut, slideUp, slideDown, slideLeft, scaleIn, staggerContainer, staggerItem, pulseGlow, float), shared transitions and layoutTransition
- Added deps: `framer-motion` 11.15.0, `react-markdown` 9.0.3, `remark-gfm` 4.0.0 (+100 total new packages)
- Updated `package.json` exports to expose `./components` barrel
- Created `src/components/index.ts` barrel
- `pnpm install` clean, `pnpm tsc --noEmit` clean
- Commit `5658a44` pushed to main
- **Context for Day 5**: Design system is feature-complete. Day 5 ships the public showcase site that renders every token + primitive + component with live examples, serving as both internal documentation and visible proof of the design system's polish.
- **Next**: Day 5 — Create `apps/design-system-docs/` Next.js 16 project

### 2026-04-24 · Day 3 complete — 13 shadcn primitives themed to tokens
- Manually set up shadcn pattern inside `packages/design-system/` (CLI is app-oriented, not library-friendly for monorepos — correct engineering choice)
- Installed 16 new deps: 9 @radix-ui/* packages + class-variance-authority + clsx + tailwind-merge + cmdk + lucide-react + react + react-dom + @types/react
- Created `src/lib/cn.ts` — clsx + tailwind-merge utility used by all primitives
- Built 14 primitive files in `src/primitives/`:
  - `button.tsx` (6 variants × 4 sizes via cva)
  - `card.tsx` (Card + Header/Title/Description/Content/Footer composition)
  - `badge.tsx` (6 variants × 3 sizes for status display)
  - `input.tsx` (with accent-ring focus state)
  - `label.tsx` (Radix accessible label)
  - `dialog.tsx` (Modal with animated overlay)
  - `tabs.tsx` (Accent-highlighted active tab)
  - `tooltip.tsx` (Directional animations)
  - `popover.tsx` (Portal-rendered with slide-up animation)
  - `select.tsx` (Complete dropdown with scroll buttons)
  - `toast.tsx` (4 variants with viewport + actions)
  - `command.tsx` (cmdk-based command palette)
  - `combobox.tsx` (Composed: Command + Popover + Button)
  - `avatar.tsx` (Image + fallback)
  - `index.ts` (barrel)
- Fixed TS moduleResolution from `NodeNext` → `Bundler` (correct for React libs consumed by bundlers; the NodeNext default would require `.js` extensions on every import)
- `pnpm install` clean (+62 packages), `pnpm tsc --noEmit` clean
- Commit `f7e2874` pushed to main
- **Context for Day 4**: All primitives exported via `@rishi/design-system/primitives`. Tokens, primitives, and Tailwind preset are ready for composition into AI-specific components.
- **Next**: Day 4 — Build KpiCard, ChartCard, AiNarrativeBlock, FilterBar, DataGrid + motion variants

### 2026-04-24 · Day 2 complete — Design system tokens extracted
- Created `packages/design-system/src/tokens/` with 7 files: `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `shadows.css`, `index.css` (barrel), `index.ts` (typed exports)
- `colors.css`: teal accent (`#2dd4bf`), base-900→600 scale, surface/text/status/severity tokens, dark + light theme variants
- `typography.css`: Space Grotesk + JetBrains Mono + Source Serif 4 font face imports + size/weight/line-height/tracking scales
- `spacing.css`: 4px base spacing scale, radius scale, container widths, border widths
- `motion.css`: durations, easings, keyframes (fadeIn, slideUp, pulseGlow, float, gridFlow, shimmer, blink) + utility classes
- `shadows.css`: elevation system + accent glow shadows + card variants + focus rings
- `tailwind.config.ts`: shared Tailwind preset that all 5 apps will consume via `presets: [baseConfig]`
- `tsconfig.json`: extends `@repo/typescript-config/react-library`
- `package.json`: added `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono`, `@fontsource/source-serif-4` dependencies + `tailwindcss` 3.4.17 + `typescript` 5.9.2 devDeps
- README: full usage documentation with consumer examples
- `pnpm install` succeeded; `pnpm tsc --noEmit` clean
- Commit `f23762e` pushed to main
- **Context for Day 3**: Design system tokens ready. Next is installing shadcn primitives and theming them. Note: used Tailwind v3.4.17 (stable, matches portfolio-site) instead of v4 to avoid v4 breaking changes — can upgrade later.
- **Next**: Day 3 — Install shadcn primitives

### 2026-04-24 · Day 1 complete — Monorepo scaffolded and live on GitHub
- Installed pnpm 10.33.2 globally
- Created GitHub repo `rishigundla/ai-portfolio` (public)
- Scaffolded monorepo at `C:\Users\Rishi\Documents\ai-portfolio` with `create-turbo@latest`
- Removed default `apps/web`, `apps/docs`, `packages/ui` from starter
- Created placeholder `packages/design-system` (@rishi/design-system) and `packages/ai-core` (@rishi/ai-core) with README + package.json
- Created `fixtures/`, `scripts/`, `docs/case-studies/`, `.github/workflows/` directories
- Copied master-plan.md and plan.html (interactive dashboard) into `docs/`
- Wrote custom root README (portfolio overview, architecture, development commands, automation notes)
- Added `.prettierrc`
- Committed + pushed to main at https://github.com/rishigundla/ai-portfolio
- **Context for Day 2**: `packages/design-system` has empty `src/tokens/`, `src/primitives/`, `src/components/`, `src/motion/` subdirectories ready. Source material is `C:\Users\Rishi\Documents\portfolio-site\tailwind.config.js` (teal `#2dd4bf`, Space Grotesk, base-900→600 scale, motion keyframes).
- **Next**: Day 2 — Extract Tailwind tokens into CSS variables

### 2026-04-24 · Plan finalized (earlier)
- Locked all 5 projects, final architecture (Vercel + pre-generated fixtures), 14-week build sequence
- Locked GitHub repo name, monorepo tool (pnpm + turborepo), deployment strategy, automation design
- Master plan doc v3 finalized with day-by-day tracking

---

## Daily Workflow — How to Use This Doc

**At the start of each day**:
1. Open this file
2. Check "Current Status" at top — confirms where we are
3. Scroll to the current day's section in Part C (the 14-Week Plan)
4. Read the day's planned tasks
5. Read "Context for Next Session" from the previous day's entry

**During the day**:
- Update task checkboxes from `[ ]` → `[~]` when starting
- Mark `[x]` when complete

**At the end of each day**:
1. Mark all completed tasks `[x]`
2. Add entry to "Recent Activity Log" with: what was done, blockers (if any), next action
3. Update "Current Status" at top (day number, progress count)
4. Fill in the day's "Context for Next Session" so tomorrow's session starts with clarity

This way, starting fresh tomorrow means reading only: Current Status + Recent Activity Log + Today's planned section. ~30 seconds of context reload.

---

# PART B — STRATEGIC CONTEXT

## Why These Projects

Existing portfolio (Tableau, Power BI, Databricks, SQL) demonstrates traditional BI + data engineering. It does NOT yet show AI-native systems built on top of that foundation. These 5 projects fill that gap with AI-powered systems anchored to real Nutanix work.

## How They Map to Nutanix Work

| Project | Nutanix Anchor | What It Pushes Further |
|---------|----------------|------------------------|
| 1. Dashboard Factory | Enterprise Dashboard Design System (Figma) + Figma MCP | Automates hi-fi wireframes + ad-hoc dashboards |
| 2. Narrative Generator | Marketing Weekly, ACV/GRR Weekly, Balanced Scorecard QBR, CX OKR QBR | PDF → polished stakeholder slide deck with AI insights |
| 3. Anomaly Alerting | Pulse SSOT (NAI/NC2/NCI), RevOps SSOT, CX OKR | AI root-cause narration on Gold-layer KPIs |
| 4. Sprint Intelligence | Jira SSOT Data Portal + Project Progress/Velocity | Auto-curated Monday sprint-review prep |
| 5. Pipeline Self-Healer | All SSOT pipelines | AI-diagnosed and auto-healed PySpark Medallion failures |

## AI Tooling Stack (Already in Use Daily)

- Claude Code, Cursor AI
- Figma MCP (hi-fi mockups)
- PostgreSQL MCP (database interaction)
- Genie Space (conversational analytics on Gold tables)
- GitHub MCP (repo operations)

---

# PART C — THE 5 PROJECTS

## Project 1 — Instant Analytics Dashboard Factory

### One-Line Pitch
Gallery of curated sample datasets. Pick one, watch Claude profile it via streaming animation, get a fully designed interactive dashboard. Also a power-user wireframe mode for hi-fi mockups.

### Demo Scope (Option C — pre-generated)
- 6 curated sample datasets (RevOps Sales, Marketing Campaigns, Pulse Telemetry, Supply Chain, Financial Complaints, Customer Demographics)
- Pre-generated profiling + dashboard configuration per dataset
- 3 wireframe templates (Executive, Operational, Exploratory)

### Why It Wins Interviews
Your Enterprise Dashboard Design System productised. Shows: design system expertise, business-user + power-user UX thinking, AI orchestration. Directly extends your Nutanix Figma MCP workflow.

### Tech Stack
- Next.js 16 App Router · Vercel
- `@rishi/design-system` (tokens + shadcn primitives)
- Recharts for visualizations
- `@react-pdf/renderer` for export
- Vercel AI SDK for streaming simulation
- Pre-generated fixtures in `/fixtures/dashboard-factory/`

### Scope: 4 weeks (Weeks 1-4)

---

## Project 2 — Dashboard-to-Deck Narrative Generator

### One-Line Pitch
Gallery of curated sample dashboards. Pick one, see the PDF preview, watch Claude generate the narrative, download a polished PPTX ready for the stakeholder meeting.

### Demo Scope (Option C — pre-generated)
- 4-6 sample dashboards (ACV & GRR Weekly, Marketing Weekly, Balanced Scorecard, CX OKR Quarterly)
- Pre-generated narrative + talking points per dashboard
- Pre-generated PPTX files stored in Vercel Blob for download
- Simulated Slack / email delivery UI

### Why It Wins Interviews
Automates the exact manual workflow your RevOps / Marketing teams do every Monday. Directly extends your "data storytelling" resume bullet. Shows semantic understanding (PDF → structured KPIs → narrative → slide deck).

### Tech Stack
- Next.js 16 App Router · Vercel
- `pptxgenjs` for slide generation (pure JS, no Python)
- PDF preview via `pdfjs-dist`
- Vercel Blob for PPTX storage
- Pre-generated fixtures in `/fixtures/narrative-generator/`

### Scope: 2 weeks (Weeks 5-6)

---

## Project 3 — Smart Metric Anomaly Alerting

### One-Line Pitch
Dashboard of synthetic Pulse/RevOps/CX historical data. Gallery of curated anomaly scenarios. Click one → streaming AI root cause explanation with correlation analysis.

### Demo Scope (Option C — pre-generated)
- Historical data for NAI/NC2/NCI Pulse metrics + RevOps ACV/GRR + CX CSAT/NPS
- 6-8 curated anomaly scenarios
- Pre-generated RCAs with correlation hypotheses, confidence scores, recommended actions
- Simulated MLflow-style trace view
- Simulated deployment log for context

### Why It Wins Interviews
Vendor tools detect anomalies; this explains WHY. Correlation-aware causation engine is the hard part. Demonstrates the shift from reactive to proactive analytics your Q12 interview answer references.

### Tech Stack
- Next.js 16 App Router · Vercel
- Recharts for time-series + correlation heatmaps
- Vercel KV for user session (selected scenario)
- Pre-generated fixtures in `/fixtures/anomaly-alerting/`

### Scope: 3 weeks (Weeks 9-11)

---

## Project 4 — AI Sprint Intelligence Dashboard

### One-Line Pitch
Dropdown selector for synthetic sprint weeks. Pick a sprint → dashboard populates with team + individual KPIs → streaming AI meeting brief appears on top with workload rebalancing recommendations.

### Demo Scope (Option C — pre-generated)
- 3-4 synthetic sprint weeks of Jira-SSOT-style data
- Pre-generated AI meeting briefs per sprint
- All KPIs computed in-browser from static JSON (no Postgres needed)
- Sprint burndown, velocity, cycle time, scope creep, carryover, blocked tickets
- Per-engineer workload deep dives

### Why It Wins Interviews
Directly extends your Jira SSOT Data Portal work at Nutanix. Auto-curated before-meeting brief is a universally recognized pain point. Shows end-to-end thinking: data model → aggregation → narrative → recommendation.

### Tech Stack
- Next.js 16 App Router · Vercel
- Static JSON fixtures (no database)
- Recharts for sprint metrics
- Pre-generated fixtures in `/fixtures/sprint-intelligence/`

### Scope: 2 weeks (Weeks 7-8)

---

## Project 5 — AI Pipeline Debugger and Self-Healer

### One-Line Pitch
Gallery of curated PySpark Medallion pipeline failures. Pick one (SCHEMA_DRIFT, NULL_EXPLOSION, DATA_SKEW, etc.) → streaming diagnosis → generated PySpark patch → mock Slack approve/reject UI.

### Demo Scope (Option C — pre-generated)
- 6-8 failure scenarios based on real Nutanix pain points (Q14 + Q17 interview stories)
- Pre-generated diagnoses + PySpark patches per scenario
- Schema diff visualization
- Sample-first validation simulation
- Mock Slack approval UI with approve/reject/escalate buttons
- MTTR trend chart, incident history timeline
- Per-category breakdown dashboard

### Why It Wins Interviews
Signature Data Engineer project. Maps directly to your Q17 (Jira SSOT Silver-layer partition tuning) and Q14 (Informatica schema drift). Shows deepest Databricks + PySpark + AI integration. Staff-level engineering signal.

### Tech Stack
- Next.js 16 App Router · Vercel
- Syntax highlighter for PySpark code (Shiki or Prism)
- Mock Slack UI with Block Kit styling
- Pre-generated fixtures in `/fixtures/pipeline-healer/`

### Scope: 3 weeks (Weeks 12-14)

---

## Cross-Project System

```
              Project 1
              Dashboard Factory
              (Design System Source)
                      |
          +-----------+-----------+
          |           |           |
     Project 3   Project 4   Project 5
     Anomaly     Sprint      Pipeline
     Alerts      Intel       Self-Healer
          ^                       |
          |                       |
          +-----------------------+
       Pipeline metrics from P5 flow into P3

     Project 2
     PDF -> Deck
     Consumes dashboards from 1, 3, 4, 5 as inputs
```

---

# PART D — LOCKED DECISIONS

| # | Dimension | Decision |
|---|-----------|----------|
| 1 | Design system source | Extract from portfolio-site tokens (accent `#2dd4bf`, Space Grotesk, JetBrains Mono, Source Serif 4, dark theme). Package as `@rishi/design-system` |
| 2 | Repo | Single public monorepo `rishigundla/ai-portfolio` |
| 3 | Monorepo tool | **pnpm workspaces + turborepo** |
| 4 | Demo data | Anonymised Nutanix-style synthetic fixtures |
| 5 | Deployment | All 5 apps on Vercel |
| 6 | AI at runtime | **None** — pre-generated JSON fixtures replayed via Vercel AI SDK streaming |
| 7 | AI during dev | Claude Code (covered by Claude Max — $0) |
| 8 | Cost | **$0/month ongoing** |
| 9 | Domains | Vercel-generated URLs (e.g., `ai-dashboard-factory.vercel.app`) |
| 10 | Video demos | Yes — 90-120s Loom per project |
| 11 | Showcase strategy | Monorepo + portfolio-site cards + case-study pages + resume bullet |

---

# PART E — REPOSITORY ARCHITECTURE

```
ai-portfolio/                           Root of rishigundla/ai-portfolio
├── packages/
│   ├── design-system/                  Extracted from portfolio-site
│   │   ├── src/
│   │   │   ├── tokens/                 CSS variables (colors, typography, spacing, motion)
│   │   │   ├── primitives/             shadcn-themed (Button, Dialog, Card, etc.)
│   │   │   ├── components/             KPI cards, chart wrappers, AI-narrative blocks,
│   │   │   │                            data-grid tables, filter bars
│   │   │   └── motion/                 Framer Motion variants
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   └── ai-core/
│       ├── src/
│       │   ├── replay.ts               streamText wrapper (chunks fixture JSON)
│       │   ├── generate.ts             Dev-only: Anthropic SDK for fixture generation
│       │   ├── prompts/                Reusable prompt templates
│       │   └── types/                  Fixture, Scenario, StreamConfig types
│       └── package.json
├── apps/
│   ├── design-system-docs/             Week 1 · Component showcase
│   ├── dashboard-factory/              Project 1
│   ├── narrative-generator/            Project 2
│   ├── sprint-intelligence/            Project 4
│   ├── anomaly-alerting/               Project 3
│   └── pipeline-healer/                Project 5
├── fixtures/                           Pre-generated AI responses per project
│   ├── dashboard-factory/
│   ├── narrative-generator/
│   ├── anomaly-alerting/
│   ├── sprint-intelligence/
│   └── pipeline-healer/
├── docs/
│   ├── master-plan.md                  This file (copy)
│   └── case-studies/                   MDX per project for portfolio-site
├── scripts/
│   ├── sync-deployed.ts                Automation: portfolio + resume sync
│   └── generate-fixtures/              Per-project fixture generators
├── .github/
│   └── workflows/
│       └── sync-portfolio.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.json
├── .gitignore
├── .prettierrc
├── .eslintrc.json
└── README.md
```

### Per-App Shared Stack (all 5 apps)
- **Framework**: Next.js 16 App Router on Vercel
- **AI**: Vercel AI SDK `streamText` replaying static JSON fixtures
- **Data**: Static JSON in `/fixtures`, fetched at request time
- **State**: Vercel KV for session (selected scenario)
- **Storage**: Vercel Blob for Project 2 PPTX files

---

# PART F — 14-WEEK IMPLEMENTATION PLAN (DAY-BY-DAY)

> Each day has planned tasks with checkboxes. Update `[ ]` → `[x]` as you complete work. End-of-day entries go in "Recent Activity Log" at top of doc.

## Phase 0 — Pre-flight (One-Time Setup)

**Goal**: Tooling installed, GitHub repo created, ready to scaffold.

### Pre-flight Checklist — COMPLETED 2026-04-24
- [x] Install pnpm globally: v10.33.2 installed
- [x] Verify pnpm: `pnpm --version` → 10.33.2
- [x] Create GitHub repo `rishigundla/ai-portfolio` (public) — live at https://github.com/rishigundla/ai-portfolio (created manually by user; GitHub MCP returned auth error)
- [x] Set description + README — description set on creation, custom README committed in `d572a1e`
- [x] Confirm Node 24, npm, git ready — Node v24.14.0, npm 10.9.4, git 2.53.0
- [-] Push resume-builder to GitHub as `rishigundla/resume-builder` — **DEFERRED to Week 4 Day 5** per plan (only needed when automation wires up)

---

## Phase 1 — Project 1 · Dashboard Factory (Weeks 1-4)

### Week 1 — Monorepo Foundation + Design System

**Week goal**: Design system package extracted and deployed as showcase site.

#### Day 1 (Mon) · Monorepo Scaffolding — COMPLETED 2026-04-24
- [x] Install pnpm globally (v10.33.2)
- [x] Create GitHub repo `rishigundla/ai-portfolio` (public)
- [x] Create local directory `C:\Users\Rishi\Documents\ai-portfolio`
- [x] Scaffold with `pnpm dlx create-turbo@latest ai-portfolio --package-manager pnpm`
- [x] Clean out default `apps/web` and `apps/docs` from starter; removed `packages/ui` too
- [x] Kept default `pnpm-workspace.yaml`, `turbo.json`, root `package.json` (already configured correctly by create-turbo)
- [x] Added `.prettierrc` · kept existing `.gitignore` · ESLint + TS configs via `packages/eslint-config` + `packages/typescript-config` (modern turborepo pattern)
- [x] `pnpm install` (5 workspace projects registered)
- [x] Initial commit `d572a1e` + push to `main` at https://github.com/rishigundla/ai-portfolio
- [x] Copied master-plan.md and plan.html into `docs/` (rich interactive dashboard included)

**Context for Next Session (Day 2)**:
- Monorepo at `C:\Users\Rishi\Documents\ai-portfolio` is clean and pushed
- Packages `@rishi/design-system` and `@rishi/ai-core` are placeholder with README + package.json only
- Empty subdirectories ready: `packages/design-system/src/{tokens,primitives,components,motion}/`
- Day 2 source material: `C:\Users\Rishi\Documents\portfolio-site\tailwind.config.js` — teal `#2dd4bf` accent, Space Grotesk + JetBrains Mono + Source Serif 4, base-900→base-600 dark scale, motion keyframes (fadeIn, slideUp, pulseGlow, float, gridFlow)
- Day 2 target: create `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`, `tokens/motion.css`, `tokens/shadows.css` as CSS variables, plus Tailwind v4 config consuming them
- Repo root README, docs, and all placeholder packages are live and browseable on GitHub

#### Day 2 (Tue) · Extract Portfolio-Site Tokens — COMPLETED 2026-04-24
- [x] Create `packages/design-system/` with package.json + tsconfig (package.json updated with deps, tsconfig.json extends `@repo/typescript-config/react-library`)
- [x] Referenced `tailwind.config.js` and `src/index.css` tokens from portfolio-site (teal `#2dd4bf`, base scale, Space Grotesk, motion keyframes)
- [x] Created `src/tokens/colors.css` with accent / base / surface / text / status / severity + light theme
- [x] Created `src/tokens/typography.css` with 3 font families + size / weight / line-height / tracking scales
- [x] Created `src/tokens/spacing.css`, `motion.css`, `shadows.css`
- [x] Created `tailwind.config.ts` shared preset (chose v3.4.17 for stability — matches portfolio-site; v4 can come later)
- [x] Exported tokens barrel: `src/tokens/index.css` (CSS side-effect import) + `src/tokens/index.ts` (typed constants)

**Context for Next Session (Day 3)**:
- Design system tokens complete and consumable via `@rishi/design-system/tokens` (CSS) and `@rishi/design-system/tokens/typed` (TS)
- Tailwind preset at `@rishi/design-system/tailwind.config` ready to be imported by all 5 apps
- Next: `pnpm dlx shadcn@latest init` inside `packages/design-system/` to scaffold shadcn setup
- Primitives to install: Button, Dialog, Tabs, Tooltip, Popover, Card, Input, Select, Toast, Command, Combobox, Badge, Avatar
- All primitives must be themed to the existing CSS variables (e.g., `bg-accent`, `text-text-primary`, `border-surface-border`)
- `pnpm install` state: 5 workspace projects, 298 packages, clean (no warnings)
- `pnpm tsc --noEmit` in design-system: passes

#### Day 3 (Wed) · Install shadcn Primitives — COMPLETED 2026-04-24
- [x] Set up shadcn pattern manually inside `packages/design-system/` (CLI is app-oriented; manual setup is correct for monorepo library packages)
- [x] Built 13 primitives + Label bonus: Button, Dialog, Tabs, Tooltip, Popover, Card, Input, Select, Toast, Command, Combobox, Badge, Avatar, Label
- [x] All primitives themed to token system — `bg-accent`, `text-text-primary`, `border-surface-border`, `shadow-glow-sm`, etc.
- [x] Visual-tested every primitive with teal accent + Space Grotesk — **VERIFIED 2026-04-24** via live deploy at https://ai-portfolio-design-system-docs.vercel.app/primitives (all 14 primitives render correctly: Button variants, Card composition, Badge palette, Input focus ring, Dialog modal, Popover, Tooltip, Tabs active state, Select dropdown, Combobox search, Avatar fallback). Typecheck was clean on Day 3; visual confirmation came on Day 5 deploy.

**Context for Next Session (Day 4)**:
- All primitives exported at `@rishi/design-system/primitives` (barrel) and individually via subpaths
- Supporting: `@rishi/design-system/lib/cn` (clsx + tailwind-merge helper used by every primitive)
- Fixed TS `moduleResolution` from `NodeNext` to `Bundler` — required for React component libraries consumed by Next.js / Vite. NodeNext would force `.js` extensions on every relative import.
- Day 4 plan: compose primitives into AI-specific components (`KpiCard` = Card + Badge + sparkline; `ChartCard` wraps Card for Recharts; `AiNarrativeBlock` uses markdown + blink cursor; `FilterBar` composes Select/Combobox/Popover; `DataGrid` is its own component). Also set up `src/motion/` with Framer Motion variants.

#### Day 4 (Thu) · AI-Specific Components — COMPLETED 2026-04-24
- [x] Built `KpiCard` — value, delta indicator with direction + invertGood, inline SVG sparkline, 4 states (ready/loading/empty/error), Framer slideUp animation on mount
- [x] Built `ChartCard` — library-agnostic themed container (works with Recharts/Tremor/any chart lib as children), 4 states, optional actions slot
- [x] Built `AiNarrativeBlock` — react-markdown + remark-gfm with token-matched styling (accent arrow bullets, accent inline code, teal links), blink cursor when streaming, 3 variants
- [x] Built `FilterBar` — compound component with `.Search`, `.Select`, `.DateRange` (6 preset ranges), `.Clear` sub-components
- [x] Built `DataGrid` — sortable columns (3-state cycle), pagination, row click, per-column render/align/width/className, automatic numeric vs string sort
- [x] Created `src/motion/index.ts` — Framer Motion variants (fadeIn, fadeOut, slideUp, slideDown, slideLeft, scaleIn, staggerContainer, staggerItem, pulseGlow, float) + shared easings/durations/transitions

**Context for Next Session (Day 5)**:
- Design system is feature-complete: 5 token files + 14 primitives + 5 AI components + motion variants + Tailwind preset + typed token exports
- All exports available via `@rishi/design-system/{tokens,primitives,components,motion,tailwind.config,lib/cn}`
- Day 5 plan: scaffold `apps/design-system-docs/` as Next.js 16 App Router app that imports the design system and renders live examples of every export. One page per category (/tokens, /primitives, /components). Deploy to Vercel.
- Consider: this showcase site becomes the first public demonstration of the design system. Keep the visual polish high.

#### Day 5 (Fri) · Design System Showcase App — COMPLETED 2026-04-24
- [x] Created `apps/design-system-docs/` as Next.js 15.1 App Router project (chose 15.1 over 16 for stable React 19 support)
- [x] Installed `@rishi/design-system` as workspace dep; also added `lucide-react` directly for icon imports
- [x] Built a page per category: `/`, `/tokens`, `/primitives`, `/components` — covering all 14 primitives and 5 AI components with live interactive variants
- [x] Deploy to Vercel — **LIVE at https://ai-portfolio-design-system-docs.vercel.app** (deployed 2026-04-24, WebFetch verified render of home + catalog cards + install snippet)
- [x] Added `apps/design-system-docs/README.md` with dev/build/deploy instructions

**Context for Next Session (Day 6)**:
- Showcase app builds cleanly: 4 static pages, 10.6s build time, 105 kB First Load JS on home
- `AiNarrativeBlock` streaming simulation is validated — click-to-stream at ~40 chars/sec renders exactly how live Claude streaming will look. This is the pattern all 5 apps reuse via `@rishi/ai-core`.
- Day 6 wires up `@rishi/ai-core`: `replay.ts` takes a fixture JSON + target ReadableStream and chunks text progressively; `generate.ts` is the dev-only Anthropic SDK client Rishi uses locally when curating fixtures. Types go in `src/types/`.
- Run locally: `pnpm dev --filter design-system-docs` (serves on :3001)
- To deploy: connect `rishigundla/ai-portfolio` to Vercel via dashboard, set root directory to `apps/design-system-docs`, build command `pnpm build --filter design-system-docs...`, output directory `.next`

#### Day 6 (Sat) · Build `packages/ai-core` — COMPLETED 2026-04-24
- [x] Created `packages/ai-core/tsconfig.json` extending `@repo/typescript-config/base` with `moduleResolution: Bundler`; package.json was scaffolded on Day 1
- [x] Installed `ai` (Vercel AI SDK) 4.0.22, `@anthropic-ai/sdk` 0.40.0, `@types/node` 22.10.5
- [x] Built `src/replay.ts` — async generator `replayFixture` + ReadableStream variant `fixtureToReadableStream` + Promise collector + ReplayAbortedError. Default cadence 40 cps with 300ms initial delay and 20% jitter.
- [x] Built `src/generate.ts` — `generateFixture` + `generateFixtures` with optional prompt caching (cache_control: ephemeral). Defaults to `claude-sonnet-4-6`. Excluded from the barrel so client bundles don't pull in Anthropic SDK.
- [x] Defined types in `src/types/index.ts`: `Scenario`, `Fixture`, `FixtureMetadata`, `StreamConfig`, `AiNarrative`. Plus system prompt templates for all 5 projects in `src/prompts/index.ts`.
- [x] Verified end-to-end via the design-system-docs `/components` streaming demo: refactored from raw setInterval to `replayFixture(DEMO_FIXTURE, { signal: ac.signal })` with AbortController cleanup. Build size delta just 0.8 kB confirms no Anthropic SDK in client bundle.

**Context for Next Session (Day 7)**:
- All Week 1 functional work is done. Day 7 is polish:
  - Verify `@rishi/ai-core/README.md` covers client + server + dev usage (already updated Day 6)
  - Verify `@rishi/design-system/README.md` is current with final export list
  - Write monorepo root README with a Mermaid architecture diagram showing packages + apps + fixtures flow
  - Visually spot-check the deployed site at https://ai-portfolio-design-system-docs.vercel.app (Vercel should have auto-redeployed with the ai-core integration)
  - Tag Week 1 as complete and transition to Week 2 (Project 1 core)

#### Day 7 (Sun) · Week 1 Polish — COMPLETED 2026-04-24
- [x] `packages/ai-core/README.md` already current from Day 6; `packages/design-system/README.md` rewritten to cover the final state (tokens + 14 primitives + 5 AI components + motion + tailwind preset)
- [x] Monorepo root `README.md` rewritten with live status table for all 6 apps, Mermaid architecture diagram (packages → apps → fixtures), repository tree, dev commands, tech stack, conventions
- [x] Visual QA: fetched https://ai-portfolio-design-system-docs.vercel.app/components post-ai-core-integration deploy; all 5 component sections render, streaming button works. No visual bugs.
- [x] Week 1 tagged complete in the tracker in this plan doc

**Week 1 Deliverables**:
- Monorepo live on GitHub
- `@rishi/design-system` + `@rishi/ai-core` working
- design-system-docs site deployed on Vercel

---

### Week 2 — Project 1 Core (Dataset Gallery + Profiling Animation)

**Week goal**: User picks a sample dataset, watches streaming Claude "profiling" animation.

#### Day 1 (Mon) · App Scaffolding — COMPLETED 2026-04-25
- [x] Created `apps/dashboard-factory/` as Next.js 15.1 App Router (port 3002)
- [x] Installed `@rishi/design-system` + `@rishi/ai-core` as workspace deps; `lucide-react` as direct dep
- [x] Tailwind config extends `@rishi/design-system/tailwind.config` preset
- [x] Root layout with dark theme, sticky Nav (DF logo mark + Project 01 badge), brand-aware footer
- [x] Landing page with hero (gradient "minutes" word), two persona cards (serif italic quotes pulled from master plan), three-step "How it works" section, dual CTAs to /datasets + /wireframe

**Context for Next Session (Day 9)**:
- App scaffolded at port 3002; build clean (106 kB First Load JS, matches design-system-docs baseline)
- portfolio.meta.json scaffolded with full resumeBullet + portfolioCard ready for Week 4 sync automation; `deployedAt: null` until first deploy
- Day 2 (Tue) authors 6 sample dataset JSON fixtures — see `fixtures/dashboard-factory/datasets/` schema in next day's plan
- Routes /datasets and /wireframe link from the landing CTAs but don't exist yet (built Days 3 + 5)
- Local dev: `pnpm dev --filter dashboard-factory` opens on http://localhost:3002

#### Day 2 (Tue) · Sample Dataset Fixtures — COMPLETED 2026-04-25
- [x] Created `fixtures/dashboard-factory/datasets/` with 6 sample JSON files:
  - [x] `revops-sales.json` (40 rows, 11 cols, accent · ACV/GRR/segment/region across NAI/NC2/NCI/Files/Move)
  - [x] `marketing-campaigns.json` (36 rows, 13 cols, purple · cross-channel performance with spend/CTR/CPA/ROI)
  - [x] `pulse-telemetry.json` (42 rows, 13 cols, blue · daily product telemetry with intentional health_score 96→82 ramp story)
  - [x] `supply-chain.json` (38 rows, 13 cols, amber · POs with realistic delays + partial shipments)
  - [x] `financial-complaints.json` (36 rows, 11 cols, rose · CFPB-style with realistic resolution-time distributions)
  - [x] `customer-demographics.json` (38 rows, 13 cols, teal · industry / size / region with LTV / CSAT / NPS / status)
- [x] Each dataset has metadata: title, tagline, domain, color token, icon name, thumbnail path, row count, **typed schema** with id / dimension / measure / time annotations
- [x] Bonus: `index.json` manifest + `README.md` for fixtures directory

**Context for Next Session (Day 10)**:
- Total: 230 rows across 74 schema columns
- Each fixture's `metadata.schema` describes column types — downstream rendering doesn't need LLM type inference
- Customer IDs are consistent across `customer-demographics` and `pulse-telemetry` (CUST-2847, CUST-1923, CUST-3145) for potential joins
- Day 3 reads ONLY `index.json` (the manifest) for the gallery — full dataset JSON loads on click in Day 4
- Use `Card` from `@rishi/design-system/primitives` and `Badge` for the domain tag

#### Day 3 (Wed) · Dataset Gallery UI — COMPLETED 2026-04-25
- [x] Built `/datasets` route (chose `/datasets` instead of `/` since `/` is the marketing landing) with 6-card responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [x] Card shows: domain-tinted gradient thumbnail with Lucide icon, domain badge, row count, title (hover: turns accent), tagline, "Profile this dataset →" CTA
- [x] Hover state: -0.5 translateY + accent border + card-hover shadow
- [x] Click navigates to `/generate/[slug]` via Next.js Link (404 until Day 4 builds the route)

**Context for Next Session (Day 11)**:
- Manifest reader at `lib/datasets.ts` is reusable — Day 4's `/generate/[slug]` route imports `getDataset(id)`, `getDatasetIcon`, `getColorClasses` from the same module
- For Day 4 streaming demo: use an inline fixture (or temporary stub) since real profiling fixtures don't exist until Day 5
- The full dataset JSON loads only when a user clicks into a card on Day 4 — the gallery uses just the manifest summary
- Build size to watch: Day 4 will pull in `replayFixture` from ai-core + DataGrid component from design-system; expect ~30-50 kB increase on the /generate route

#### Day 4 (Thu) · Streaming Profiling Page — COMPLETED 2026-04-25
- [x] Built `/generate/[slug]` route with `generateStaticParams` pre-rendering all 6 datasets
- [x] Top: dataset preview using DataGrid (10 rows, ID columns in monospace, measures right-aligned, formatted cells via `formatCell()` utility)
- [x] Middle: "Claude is analyzing..." streaming panel that auto-starts on mount
- [x] Wired up `@rishi/ai-core` `replayFixture` with AbortController cleanup pattern
- [x] Progress indicators per step (4 steps with 'pending' / 'active' / 'done' states + check icons), advances by watching streamed text for `## ` heading markers
- [x] "Generate dashboard" CTA appears on completion, links to `/dashboard/[slug]` (404 until Week 3)

**Context for Next Session (Day 12)**:
- Placeholder fixture generator at `lib/profiling.ts` produces working text but doesn't reference actual column names. Day 5 replaces it with hand-curated per-slug fixtures.
- Heading markers are exported constants (`HEADING_COLUMN_CLASSIFICATION`, etc.) — Day 5 fixtures must keep the same 4 headings so the StreamingPanel's progress UI continues to work
- Authoring strategy: open each dataset's full JSON, ask Claude Code (via Max plan, $0 cost) to write profiling output that references real column names + spotted patterns (e.g. for `pulse-telemetry` mention CUST-2847's health_score decline 96→82)
- Save to `fixtures/dashboard-factory/profiling/<slug>.json` matching the Fixture shape from `@rishi/ai-core` (id, text, metadata)
- Update `lib/profiling.ts` to add `getProfilingFixture(slug)` function that imports from the new location, falling back to placeholder if missing
- **Architectural note**: this Day's `'use client'` audit on design-system primitives is permanent. All future apps inherit the correct client/server boundaries automatically.

#### Day 5 (Fri) · Generate Profiling Fixtures — COMPLETED 2026-04-25
- [x] Hand-curated 6 profiling fixtures via Claude Code (zero API cost via Max plan)
- [x] Each fixture references real column names + calls out specific patterns from the dataset (e.g. CUST-2847 health_score decline, Polaris Defense $1.24M deal, Voltaic Systems delays)
- [x] Saved to `fixtures/dashboard-factory/profiling/<slug>.json` (one directory level cleaner than the originally-planned `<slug>/profiling.json`)
- [x] All 6 verified: validation script confirmed 4 required heading markers present, JSON parses clean, build size unchanged (webpack tree-shakes per route)

**Context for Next Session (Day 13)**:
- `getProfilingFixture(slug, dataset)` is the right loader pattern for adding new fixtures — drop a JSON in `fixtures/dashboard-factory/profiling/`, add to the static-import map in `lib/profiling.ts`, done
- Each fixture is ~3000 chars = ~50 sec stream at 60 cps. Replay button is essential for letting users re-watch
- Day 6 wires Zustand for client-side state caching + URL serialization. The current architecture works without it (each route re-loads from JSON), but Zustand prevents redundant re-streaming when users back-navigate from /dashboard/[slug] to /generate/[slug]
- Also Day 6: navigation guards. Users shouldn't be able to land on `/dashboard/[slug]` (Week 3) without having profiled first. Track `profilingComplete` in Zustand, block the route if false.

#### Day 6 (Sat) · State Management + Navigation — COMPLETED 2026-04-26
- [x] Set up Zustand store at `lib/store.ts` — `profilingComplete: Record<slug, boolean>` persisted to localStorage. `useStoreHydrated()` hook prevents SSR/client mismatch flashes.
- [x] Navigation guards — `app/dashboard/[slug]/_guard.tsx` redirects to `/generate/[slug]` if profiling not complete
- [x] Back button flow — every page has explicit "Back to..." link respecting the natural flow
- [-] URL state serialization — **deferred**. Slug is already in the path (`/generate/revops-sales` is itself a shareable link). Adding `?profiled=true` would only matter if recruiters share mid-stream URLs, which is unlikely. Skipped to keep scope tight.

**Context for Next Session (Day 14)**:
- Day 7 is responsive QA day. Test all 4 routes (`/`, `/datasets`, `/generate/[slug]`, `/dashboard/[slug]`) at 320px / 480px / 768px / 1024px / 1440px / 1920px.
- Watch for: hero gradient text wrap on small screens, dataset gallery card stacking (1 col mobile / 2 tablet / 3 desktop), `/generate/[slug]` header strip wrap, dashboard guard loading state visibility on slow connections, DataGrid horizontal overflow on narrow viewports.
- Tag Week 2 complete after the QA pass. Week 3 builds the actual dashboard rendering inside the existing guarded route.

#### Day 7 (Sun) · Responsive Polish — COMPLETED 2026-04-26
- [~] Test gallery at 320 / 480 / 768 / 1024 / 1440 / 1920 — code-level audit done; visual confirmation pending on the user's side via the running dev server (http://localhost:3002/datasets)
- [~] Test profiling page at same breakpoints — code-level audit done; user verification pending
- [x] Fix mobile nav: hidden brand text below sm, hidden Project 01 badge below md, touch targets at WCAG-minimum 44px, truncate + shrink-0 + min-w-0 patterns, aria-label on icon-only GitHub link. **No hamburger needed** — only 2 nav items, fits 320px after brand-text hide.
- [x] Tag Week 2 complete — all 7 days shipped, full app navigable end-to-end on production-ready code

**Week 2 Deliverables**:
- Dashboard Factory app scaffolded
- 6 working "pick dataset → see profiling" flows
- Streaming animation pattern validated

---

### Week 3 — Project 1 Dashboard Rendering

**Week goal**: Full interactive dashboard with filters, drill-downs, PDF export, wireframe mode.

#### Day 1 (Mon) · Dashboard Layout Generator — COMPLETED 2026-04-26
- [x] `/dashboard/[slug]` route now renders an actual dashboard (was a Coming-Week-3 stub from Week 2)
- [x] Layout derived from the **dataset schema** (not parsed from profiling text — schema's typed annotations are reliable; markdown parsing is fragile). KPIs from measure columns honoring sum/avg aggregation hints. Charts: bar (top measure × primary dimension), line (measure × time bucketed), donut (count distribution by secondary dimension).
- [x] KPI strip renders 4 `KpiCard` components from `@rishi/design-system` with computed values + sparklines
- [x] 3 `ChartCard` containers render with inline-SVG previews of the actual aggregated data (Day 2 swaps SVG → Recharts)
- [x] 12-col responsive grid: KPIs at 1/2/4 col responsive; charts at 1-col mobile, 7-of-12 + 5-of-12 split for primary + secondary on desktop

**Context for Next Session (Day 16 = Week 3 Day 2)**:
- The `DashboardChartData` type contract is **the integration boundary** for Day 2. SVG renderers consume it today; Recharts consumes it tomorrow. Same prop shape, only the `<ChartRenderer>` switch changes.
- Install plan: `pnpm add recharts` in `apps/dashboard-factory/`. Recharts 2.x supports React 19.
- Recharts components needed: `<BarChart>`, `<LineChart>`, `<PieChart>` (with `innerRadius` for the donut), `<XAxis>`, `<YAxis>`, `<Tooltip>`, `<ResponsiveContainer>`, `<Bar>`, `<Line>`, `<Pie>`, `<Cell>`
- Theme alignment: Recharts accepts a `stroke` / `fill` prop on each shape — pass our token-based colors via the existing `ColorClassSet`
- Don't forget to add `'use client'` to the new chart wrapper if Recharts components need it (most do due to ResponsiveContainer)

#### Day 2 (Tue) · Chart Rendering — COMPLETED 2026-04-26
- [x] Integrated Recharts 2.15 (chose Recharts over Tremor — Recharts is more flexible for the donut center-text overlay we needed)
- [x] Support bar, line, donut chart types out of the gate. Heatmap + scatter deferred — not used by any of the 6 datasets' layouts. Can add when a 7th dataset needs them.
- [x] All charts themed to design-system tokens via CSS variables (accent fills, surface-border gridlines, text-muted axis labels, surface-elevated tooltip background)
- [x] Charts wired to real dataset rows via the `DashboardChartData` contract from `lib/dashboard-builder.ts` — server aggregates, client renders

**Context for Next Session (Day 17 = Week 3 Day 3)**:
- Day 3 wires `FilterBar` from `@rishi/design-system/components` above the chart grid. Filters apply reactively to KPIs + charts.
- Refactor needed: `buildDashboardLayout(dataset)` currently runs once on the server with all rows. To support filters, move the layout building to a client-side function that takes `(dataset, filters)` and returns the new `DashboardLayout` whenever filters change. Pure function, fast on 50-row fixtures.
- Filter inputs: date range (from `time` column min/max), one dimension dropdown ("All segments" vs specific values), search box across `id` columns.
- Drill-down modal: click a bar → opens `<Dialog>` with rows filtered to that bar's category. Use `<Dialog>` from design-system primitives.
- Empty state: when filtered rows == 0, swap chart content for `EmptyChart` with a "Clear filters" button.

#### Day 3 (Wed) · Filters + Interactivity — COMPLETED 2026-04-26
- [x] FilterBar on dashboard with Search / Segment-dimension Select / DateRange / Clear sub-components from `@rishi/design-system/components`
- [x] Filters recompute the dashboard layout reactively via `useMemo` — KPIs and charts both update on every filter change
- [x] Click any **bar OR donut slice** → opens `<Dialog>` drill-down with rows matching that segment (donut legend rows are also clickable; "Other" bucket excluded since it has no source rows)
- [x] Empty state card with `Inbox` icon + "Clear all filters" button when filters match 0 rows

**Context for Next Session (Day 18 = Week 3 Day 4)**:
- Day 4 = PDF export. Install `@react-pdf/renderer` (compatible with React 19).
- Approach: build a server-side React component tree using `<Document>` `<Page>` `<View>` `<Text>` primitives that mirrors the dashboard layout (header + KPI strip + bar list + chart-as-summary). Don't try to embed Recharts SVGs directly — they don't translate well to PDF. Instead render a textual chart summary or use react-pdf's primitive `<Svg>` shapes.
- Generate via `pdf(MyDocument).toBlob()`, then trigger download via `URL.createObjectURL(blob)`.
- Wire to "Export PDF" button on the dashboard header strip (next to "Switch dataset"). Pass current `filteredRows` + `filters` so the export reflects what the user is looking at.

#### Day 4 (Thu) · PDF Export — COMPLETED 2026-04-26
- [x] Installed `@react-pdf/renderer@4.1.6` (compatible with React 19)
- [x] Built `lib/pdf-document.tsx` — branded light-theme PDF using StyleSheet.create with the same token VALUES (`#14b8a6` accent darker variant for white bg). Header / KPI grid / bar list / donut summary / line list / fixed footer with page numbers.
- [x] "Export PDF" button next to filter count summary, dynamic-imports the renderer + pdf-document ONLY when clicked, downloads as `{slug}-dashboard-{YYYY-MM-DD}.pdf`
- [x] Footer with dataset attribution + page numbers; KPI values + bar/donut/line summaries; meta row encodes the active filters so recipients know exactly which slice was exported

**Context for Next Session (Day 19 = Week 3 Day 5)**:
- Day 5 = wireframe mode (Persona B from master plan). Build `/wireframe/[template]` with 3 layout templates: Executive (headline KPI + 1 big chart), Operational (dense KPI strip + 4 charts in 2×2), Exploratory (filter rail + free-form 12-col grid).
- Each template is a static Figma-style mockup using design-system primitives + token system. No real data — placeholder chart shapes ARE the point (it's a hi-fi wireframe, not a working dashboard).
- Reuse the SVG renderer code from Day 1 (the bar/line/donut SVG components I deleted) for the static mockups, since they don't need interactivity.
- Wire up the home CTA `<Link href="/wireframe">` to redirect to a default template (or build a `/wireframe` index page that links to all 3).
- Optional: PNG/PDF download per template using the same dynamic-import pattern as Day 4.

#### Day 5 (Fri) · Wireframe Mode — COMPLETED 2026-04-26
- [x] Built `/wireframe` gallery (3 cards with mini-layout SVG sketches per template)
- [x] Built `/wireframe/[template]` dynamic route — all 3 templates (`executive`, `operational`, `exploratory`) prerendered statically via `generateStaticParams`
- [x] **Executive layout**: oversized headline KPI ($148.2M FY26 Bookings) with 6xl-9xl scale + gradient text + delta chip + 10-quarter sparkline strip + 3 sub-KPI tiles + full-width 12-quarter trend chart
- [x] **Operational layout**: live indicator strip + 6-up dense KPI strip (Active Clusters / Healthy% / P95 Latency / Errors / Pages / Incidents — with inverse-good color semantics for latency/errors/pages/incidents) + 2x2 chart grid (bars/line/donut/bars) + status footer
- [x] **Exploratory layout**: 3-col filter rail (search input shell + 5-segment checkbox list + 4-dimension Group-by chip selector + date range dropdown + "Save current view" CTA) + 9-col main with 4-KPI row + full-width cohort heatmap + 2-up bottom (donut + bars)
- [x] `MockCharts.tsx` — 4 reusable inline-SVG primitives (`MockBarChart`, `MockLineChart`, `MockDonutChart`, `MockCohortHeatmap`) — all server-renderable, no `'use client'`
- [x] `lib/wireframe-templates.ts` — template metadata (`TEMPLATES` array) + hand-curated demo data per template (`EXECUTIVE_DATA`, `OPERATIONAL_DATA`, `EXPLORATORY_DATA`)
- [x] Variant switcher on each template page — chip links to the other 2 templates
- [x] Build: 3 wireframe routes prerendered, 19.5 kB route-specific + 245 kB First Load JS, 21 of 21 pages generated successfully
- [x] Commit `53117d0` pushed to main

**Why hand-rolled SVG instead of Recharts**: wireframes are static — no resize observers, no tooltip state, no filter recompute. Recharts is already on the live `/dashboard/[slug]` route at ~110 kB; a wireframe gallery doesn't need a second copy. Inline SVG renders server-side with no client boundary, so the entire wireframe route ships as RSC HTML and the page stays under 250 kB First Load.

**Context for Next Session (Day 20 = Week 3 Day 6)**:
- Day 6 = empty/loading/error states. Skeleton loaders for the dashboard route while the layout builds. Error boundary around Recharts in case a malformed dataset reaches the renderer. Empty state for "no rows match filters" already exists in `_dashboard-interactive.tsx` — needs visual polish + Toast notifications for user actions like "Filter cleared" / "PDF exported".
- Lower-priority polish items: loading state on the Generate button when the streaming hasn't started yet; hardening the drill-down dialog when no rows are present; verifying every chart degrades gracefully on weird shapes (e.g., 1-row dataset, all-null dimension column).

#### Day 6 (Sat) · Empty/Loading/Error States — COMPLETED 2026-04-27
- [x] `loading.tsx` route-level Suspense skeleton mirrors the dashboard layout (header / filter bar / counter row / 4-up KPI strip / 2x2 chart grid with bar-skeleton bodies)
- [x] Empty state for no-data-match: `EmptyFilterState` card with Inbox icon already shipped Day 3; drill-down dialog inherits `emptyMessage="No matching rows"` from DataGrid for the 0-rows-in-segment case
- [x] `_chart-error-boundary.tsx` class-based per-chart React error boundary; one bad chart's render failure doesn't break the other tiles. AlertTriangle fallback + "Retry render" button to clear error state.
- [x] Toast notifications via Zustand-backed queue (`lib/toast-store.ts` + `app/_components/Toaster.tsx`) wired to Radix Toast in the root layout. Three trigger points: filter clear (info), PDF success (success), PDF failure (error). Auto-dismiss 4s default, 6s for errors.

**Context for Next Session (Day 21 = Week 3 Day 7)**:
- End-to-end QA day. Walk every dataset through the full flow and document any bugs.
- Test the 3 wireframe templates including the variant switcher chip cross-links.
- Smoke-test responsive at 320 / 480 / 768 / 1024 / 1440 / 1920 px (the same breakpoints from Week 2 Day 7's responsive pass).
- Tag Week 3 complete in commit log.
- Week 3 deliverables checklist (top of Week 3 section): all 6 datasets render full interactive dashboards ✓, filters/drill-downs/PDF working ✓, wireframe mode with 3 templates ✓, mobile responsive — verify in QA.

#### Day 7 (Sun) · End-to-End QA — COMPLETED 2026-04-27
- [x] Tested all 6 datasets via Playwright (gallery → profiling → dashboard → filters → drill-down → PDF) — 0 console errors after fixes
- [x] Tested filters: search, segment select, date range, clear; drill-down dialog with 19-row table; PDF export with success toast
- [x] Tested all 3 wireframe templates (executive / operational / exploratory) + variant switcher chips
- [x] Fixed 3 bugs uncovered: Recharts 0×0 chart rendering, naive pluralization (`opportunitys` → `opportunities`), drill-down dialog close button scrolling off-screen
- [x] **Tag `week-3-complete` created and pushed** with 7-day summary

**Week 3 Deliverables — all met**:
- ✓ All 6 datasets render as full interactive dashboards
- ✓ Filters, drill-downs, PDF export working (0 console errors after Day 7 fixes)
- ✓ Wireframe mode with 3 templates + variant switcher
- ✓ Mobile responsive — smoke-tested at 375 (mobile) / 768 (tablet) / 1440 (desktop)

---

### Week 4 — Project 1 Polish, Deploy, Automation Setup

**Week goal**: Live on production, Loom published, automation infrastructure deployed.

#### Day 1 (Mon-Tue) · Production Polish — COMPLETED 2026-04-28 (5 of 5)
- [x] Lighthouse audit — Ran on Day 2 against the deployed build (dev mode would have penalised minification / source maps / dev overlay). Home 100/100/100/100, /generate 100/98/100/100. Code-side prep happened on Day 1; the actual audit ran once production was up.
- [x] SEO meta tags — root layout extended with metadataBase, keywords, authors, openGraph (siteName/locale/url), twitter card, robots, formatDetection, viewport (themeColor + colorScheme)
- [x] Favicon — `app/icon.tsx` (32×32) + `app/apple-icon.tsx` (180×180) via next/og ImageResponse, teal gradient + dark DF mark mirroring Nav. Closes the Day 7 `/favicon.ico` 404.
- [x] 404 + error pages — `app/not-found.tsx` (branded with 3 re-entry cards + `robots: noindex`), `app/error.tsx` (route-level, `reset()` + `error.digest`), `app/global-error.tsx` (last-resort, inline styles, can't rely on globals.css)
- [x] Social preview image — `app/opengraph-image.tsx` + `app/twitter-image.tsx` at 1200×630, brand-styled with Space Grotesk Bold, shared renderer in `app/_lib/og-renderer.tsx`. Verified via Playwright.
- [x] Skip-to-content a11y link added (focus-revealed, anchored at `<main id="main-content">`)
- [x] **Bonus**: documented remote-agent failure mode + diagnosis (sandbox needs MCP/credentials for write-back operations; routine `trig_0137DKtjApb6tmmuxGgDwR4n` fired but couldn't push)

**Context for Next Session (Week 4 Day 2)**:
- Day 2 = production deploy. Create Vercel project `ai-dashboard-factory`, configure turborepo build (`pnpm install --frozen-lockfile && pnpm --filter dashboard-factory build`), point at main branch. Deploy.
- **Important**: Merge the remote agent's `polish/favicon-og` PR BEFORE Day 2 deploy so Vercel's first build includes favicon + OG image.
- Then smoke-test all 6 dataset flows on the production URL — the Day 7 chart-rendering fix should hold in prod.
- Author `apps/dashboard-factory/portfolio.meta.json` with the live URL + deployedAt.
- Then run actual Lighthouse audit on the deployed build (the deferred Day 1 task), iterate on findings until 90+ on all 4 categories.

#### Day 2 (Tue) · Production Deploy — COMPLETED 2026-04-28
- [x] Vercel project `ai-portfolio-dashboard-factory` created (matching `ai-portfolio-design-system-docs` naming convention)
- [x] Build settings: Root Directory `apps/dashboard-factory`, Install Command `pnpm install --frozen-lockfile`, framework autodetected as Next.js
- [x] Deployed to production at https://ai-portfolio-dashboard-factory.vercel.app
- [x] Smoke-tested all 6 dataset flows + 3 wireframe templates on the live URL via Playwright — 0 console errors
- [x] portfolio.meta.json updated with liveUrl + deployedAt 2026-04-28
- [x] **Bonus**: Lighthouse run + iterated to all-green. Home 100/100/100/100, /generate 100/98/100/100. Fixed 4 issues found during the deploy: doubled title suffix, color contrast on text-muted, heading order, color-only links.

**Context for Next Session (Week 4 Day 3)**:
- Plan revised 2026-04-28: 8 polish/enrichment items inserted before Loom. Phase 1 closes ~May 11 instead of May 4.
- Day 3 = Copy + UX cleanup. Quick-win batch.

#### Day 3 (Wed) · Copy + UX cleanup — COMPLETED 2026-04-28
- [x] **Item 7** Rename "For BI engineers" → "For Developers" (4 sites: home persona, wireframe eyebrow + description, page metadata)
- [x] **Item 5** Click-to-drill chip on bar + donut ChartCards (`<DrillChip />` with MousePointerClick icon + "Click to drill in" text in `actions` slot when handlers present)
- [x] **Item 6 Option B** NAI/NC2/NCI → Atlas/Orion/Vega across 6 datasets + 4 profiling fixtures + wireframe mock data + design-system-docs examples + READMEs. "Nutanix" string removed from user-facing copy.
- [x] **Item 2** Em/en/hyphen-with-spaces dashes removed from user-visible text in 6 profiling fixtures + 5 dataset JSONs + home/datasets/wireframe/error/dashboard pages + fallback profiling-text builder. SVG/math-heavy files reverted (no user-visible dashes worth fixing) after a regex caused build break.

**Context for Next Session (Week 4 Day 4)**:
- Day 4 = PDF visual fidelity. Switch from text-summary PDF to canvas-based capture (html2canvas + jsPDF) so PDF looks pixel-identical to dashboard on screen.
- Preserve filter-aware behavior + test on all 6 datasets + verify file size and render time stay reasonable.

#### Day 4 (Thu) · PDF visual fidelity — COMPLETED 2026-04-30
- [x] **Item 3** Replaced @react-pdf/renderer + lib/pdf-document.tsx with html2canvas + jsPDF canvas-based snapshot. Net diff -850 / +263 lines.
- [x] PDF looks pixel-identical to on-screen dashboard. Title header + filters + 5 KPIs + 4 charts all captured. Brand styling preserved.
- [x] Filter-aware: capture happens at the dashboard's current state, so the "Showing N of M rows" line + filtered chart values are in the export.
- [x] File size ~290 kB at JPEG quality 0.92. Render time ~1-2 s on a typical dashboard. Both reasonable.
- [x] Verified on production via Playwright on revops-sales. Other 5 datasets share the same code path (same exportPdf handler, same capture target id). Smoke checks deferred to W4.D7 final QA.
- [x] **Bonus**: introduced `data-pdf-hide` attribute as a generic escape hatch. Any element can opt out of being in the PDF in one line. Already used on the Export PDF button + drill-in chips.

**Context for Next Session (Week 4 Day 5)**:
- Day 5 = Theme toggle + particle background. Study `C:\Users\Rishi\Documents\portfolio-site` for the particle + theme toggle implementation pattern.
- Build shared `<ParticleBackground />` + `<ThemeToggle />` in `@rishi/design-system`. Wire into dashboard-factory + design-system-docs.
- Light-mode QA pass — every route, every component, contrast checks. Re-run Lighthouse in light mode (target 90+).

#### Day 5 (Fri) · Theme toggle + particle background — COMPLETED 2026-05-04
- [x] **Item 1 part A** Study portfolio-site source at `C:\Users\Rishi\Documents\portfolio-site` — extract particle-canvas + theme-toggle implementation — **DONE**: ported GlobalBackground.jsx + Navbar theme toggle pattern; replaced react-icons with lucide-react Sun/Moon to avoid duplicating the icon stack; replaced Zustand with React Context to keep design-system framework-agnostic.
- [x] Build shared `<ParticleBackground />` component in `@rishi/design-system` (the teal accent particles) — **DONE**: `packages/design-system/src/theme/particle-background.tsx`. Theme-aware RGB (dark teal-400, light teal-600 with bumped alpha). Particle count scales with viewport (15/80/140). O(n²) connections only on tablet+.
- [x] Build shared `<ThemeToggle />` primitive in `@rishi/design-system` (sun/moon icon) — **DONE**: `theme-toggle.tsx`. Hydration-safe via CSS-only swap (`hidden dark:block` / `block dark:hidden`); aria-label fixed to "Toggle theme". Also shipped: `<ThemeProvider />`, `<ThemeScript />` (pre-paint init via Next.js Script strategy=beforeInteractive), `useTheme()` hook, `STORAGE_KEY` (server-safe constant in its own module).
- [x] Wire both into dashboard-factory app layout — **DONE**: removed hardcoded `className="dark"` from `<html>`, added `suppressHydrationWarning`, `<ThemeScript />` in `<head>`, `<ThemeProvider><ParticleBackground /><div className="relative" style={{zIndex:1}}>...</div></ThemeProvider>` body wrapping, `<ThemeToggle />` in Nav.
- [x] Wire both into design-system-docs app layout (consistency across portfolio) — **DONE**: same wiring pattern.
- [x] Light-mode QA pass: every route, every component, contrast checks — **DONE** via Playwright on production. Walked /, /datasets, /dashboard/revops-sales, /wireframe/executive in both themes. Zero console errors after hotfix 2. Toggle click flips theme and persists across reloads. Bottom paragraph color in light mode `rgb(73,80,87)` (text-text-secondary, neutral dark gray, fine).
- [x] Re-run Lighthouse in light mode, ensure 90+ holds — **DONE**. Home 95/100/100/100, /generate 97/100/100/100, /dashboard/revops 79/100/100/100. Particle canvas costs ~3-5pt perf. Dashboard route's 79 is Recharts-driven (heavier route) not particle-driven.

**Context for Next Session (Week 4 Day 6)**:
- Day 6 = Dashboard depth. Generate synthetic period-over-period data per dataset so growth % is meaningful (currently the single-period rows can't compute deltas).
- Add growth % delta to each KPI on dashboard — small ↑/↓ chip + percentage next to value.
- Add 2 new chart types: heatmap (cohort/matrix views, e.g. retention by signup month × tenure) and scatter (quadrant analysis, e.g. ROI vs spend).
- Add multi-select filter primitive (e.g. multiple regions at once) + date-range filter primitive (between-dates) to FilterBar.
- Verify across 2-3 datasets. RevOps + Marketing + Pulse cover scatter / heatmap / time-series respectively.

#### Day 6 (Sat) · Dashboard depth (growth %, new charts, more filters) — COMPLETED 2026-05-04
- [x] **Item 4 part A** Generate synthetic period-over-period data per dataset (so growth % is meaningful) — **REFRAMED + DONE**: existing fixtures already span enough date range (revops/marketing/supply 9mo, financial 6mo, customer 4yr, pulse 33d), so derived period-over-period via `lib/period.ts splitByPeriod()` (median-date split) instead of mutating fixtures. Cleaner and growth % automatically tracks active filters.
- [x] Add growth % delta to each KPI on dashboard — **DONE**: `dashboard-builder.computeMeasureDelta()` aggregates current + prior, produces `KpiDelta { value, direction, period }`. Skipped for derived KPIs (Total X, Top X, distinct counts). Wired through `_dashboard-view.tsx` to existing KpiCard `delta` prop. Phase 1 commit `5cf3ab0`.
- [x] Add 2 new chart types — heatmap (cohort/matrix views), scatter (quadrant analysis) — **DONE**: extended `DashboardChartData` union. `buildHeatmapChart` (CSS grid, monthly/yearly bucketing by span, top-6 dim values + Other) and `buildScatterChart` (Recharts ScatterChart, 100-point cap, custom tooltip with row id + both axes). Slot allocation: scatter at slot 3 when ≥2 measures, heatmap at slot 4 when time + dim. Phase 2 commit `b01163d`.
- [x] Add multi-select filter primitive to FilterBar — **DONE**: `FilterBar.MultiSelect` in design-system. Popover trigger + cmdk Command check-list inside. "Enterprise +2" trigger truncation, full list via title for screen readers, clear-selection action when ≥1 picked. Phase 3 commit `d6e5c04`.
- [x] Add date-range (between-dates) filter primitive to FilterBar — **DONE**: `FilterBar.DateRangePicker`. Popover with 2× HTML5 `<input type="date">` (bounded to dataset min/max), 3 preset chips with current-state highlight, Clear button. `DashboardFilters` shape change: added `'custom'` to `dateRange` enum + optional `dateStart`/`dateEnd` ISO strings. Phase 3 commit `d6e5c04`.
- [x] Verify across 2-3 datasets — **DONE**: Playwright on production verified revops-sales (9mo, 5 measures, 5 KPIs with deltas + 4 charts incl scatter 40pts + heatmap 10mo×3seg) and pulse-telemetry (33-day, 6 measures, 5 KPIs with deltas + 4 charts incl scatter 42pts + heatmap 2mo×7cust). Multi-select popover opens correctly. Date-range picker popover opens correctly. Theme toggle works in both modes. Zero console errors. Lighthouse: home **98**/100/100/100, /dashboard/revops **79**/100/100/100 (same as W4.D5 baseline — no regression).

**Context for Next Session (Week 4 Day 7)**:
- Day 7 = Dashboard uniqueness (per-domain layouts). Each of the 6 dashboards gets a curated chart mix tuned to its domain. The current generic builder (W3.D2 + W4.D2 hotfix + W4.D6) produces good general-purpose dashboards but doesn't differentiate between domains.
- Per-domain configs in master plan: RevOps pipeline funnel + win-rate ring + region-channel matrix; Marketing ROI quadrant scatter + funnel + channel CPA bars; Pulse latency heatmap + health histogram + cluster size mix; Supply fulfillment scorecard + supplier scatter + lead-time distribution; Financial resolution-time distribution + state breakdown + dispute funnel; Customer cohort retention matrix + LTV scatter + segment quadrant.
- Plus: enhanced multi-tab drill-down dialog (rows | summary stats | distribution) and expandable rows in `DrilldownTable`.
- Cross-dataset QA at 1440px.
- **Two follow-ups noted from W4.D6**: (a) median-date split shows naturally negative deltas when data is front-loaded (revops Jan-Jun heavy) — could add rate-based comparison option later; (b) `primaryDimension` for the FilterBar.MultiSelect picks the first dim regardless of usefulness — should default to `usefulDimensions[0]` so revops shows segment (3 values) instead of opportunity_name (40 values).

#### Day 7 (Sun) · Dashboard uniqueness (per-domain layouts) — COMPLETED 2026-05-04
- [x] **Item 4 part B** Per-domain layout configs — each of the 6 dashboards uses different chart mix — **DONE** via `lib/per-domain-layout.ts` registering hand-curated chart picks per dataset. The full-fidelity master-plan list called for some chart types (win-rate ring, region-channel matrix, scorecard) that would only ship for one or two datasets each — instead I added 2 universal new chart types (funnel + histogram) that 5 of 6 datasets use, plus targeted picks against the existing toolkit (bar/line/donut/heatmap/scatter). Result per dataset:
  - RevOps: ACV by Segment bar + ACV trend line + ACV vs GRR% scatter + deal_stage funnel
  - Marketing: Spend by Channel bar + Impressions → Clicks → Conversions funnel (measure-aggregated) + CPA vs ROI% scatter + Spend Channel × month heatmap
  - Pulse: P95 latency line + P95 latency histogram + Customer × time heatmap + Errors by Product bar
  - Supply: Fulfillment % by Supplier bar + Lead time vs Unit cost scatter + Lead time histogram + Region × month heatmap
  - Financial: Days to resolve histogram + Top issue types bar (count) + Response pipeline funnel + Top states bar (count)
  - Customer: LTV vs CSAT scatter + LTV: Industry × signup year heatmap + LTV by Segment bar + Signup count line (count-aggregated)
- [x] Enhanced drill-down (multi-tab dialog: rows | summary stats | distribution) — **DONE** via `_drilldown-summary.tsx` (per-measure stats table + per-dim top-3) + `_drilldown-distribution.tsx` (histogram of primary measure within drilled subset, reusing the new histogram chart type from Phase 1). Wrapped existing drill-down content in Tabs/TabsList/TabsTrigger/TabsContent (Radix-based, already exported from `@rishi/design-system/primitives`). `ChartRenderer` made exportable + `colors` prop optional so the Distribution tab can reuse the dispatcher.
- [-] Expandable rows in DrilldownTable — **DEFERRED**. Current 6-column drill-down view is already a clean view; expanding to surface remaining columns is incremental polish, not a missing capability. Skipped today, not blocking.
- [x] Cross-dataset QA at 1440px — **DONE**: Playwright walked revops + marketing + customer-demographics + pulse-telemetry on production. All 4 chart slots render correctly per-dataset; drill-down 3 tabs all functional. Zero console errors. Surfaced + fixed a pre-existing W4.D6 heatmap-sort bug during QA (`ba65326`).

**Context for Next Session (Week 5 Day 1)**:
- Day 1 (Mon May 5) = 6 new wireframe-mode datasets in different verticals (Manufacturing / Real estate / Healthcare / Education / SaaS Subscription / Logistics).
- 30-50 rows each, with full schema (id + dimensions + measures + time + values for ordered dimensions where applicable).
- Add to `fixtures/dashboard-factory/datasets/` + `index.json` manifest.
- These feed into W5.D2 (6 new profiling fixtures) and W5.D3 (data-driven wireframe template engine that replaces the current 3 hardcoded templates).
- **Three follow-ups to remember from W4.D6+D7** (file before W5 if any of these block):
  - Rate-based delta comparison (currently uses median-date split; front-loaded data shows naturally negative deltas)
  - `FilterBar.MultiSelect` smart-default to `usefulDimensions[0]` instead of first dim
  - Drill-down Summary tab Top Values panel — skip dim columns where `distinctCount === rowCount` (5-line fix)

---

### Week 5 — Wireframe reframe + Loom + Case Study + Automation (revised)

**Week goal**: Reframe wireframe mode as dataset-driven (parallel to ad-hoc mode), then ship Loom + case study + automation.

#### Day 1 (Mon May 5) · 6 new wireframe-mode datasets — COMPLETED 2026-05-05
- [x] Design schemas for 6 new sample datasets in different verticals — **DONE**: each fixture has 1 id + 5 dimensions + 4-5 measures + 1 time column. Every dataset includes ≥4 ordered-stage dimensions (so W5.D3's funnel charts will have semantic stage ordering).
  1. Manufacturing — production-line throughput (36 rows)
  2. Real estate — brokerage pipeline (36 rows)
  3. Healthcare — clinic operations (36 rows)
  4. Education — course enrollment + retention (32 rows)
  5. SaaS Subscription Analytics — MRR/churn/expansion (38 rows)
  6. Logistics — fleet utilization (36 rows)
- [x] Author 30-50 row JSON for each — **DONE**: 214 rows total. All hand-authored with realistic patterns (multimodal distributions, plausible value ranges, time-ordered, some segments deliberately dominant).
- [x] Add to `fixtures/dashboard-factory/datasets/` index — **REFRAMED**: stored in a separate `fixtures/dashboard-factory/wireframe-datasets/` folder with its own `index.json` carrying `"mode": "wireframe"`. Cleaner than mixing into the ad-hoc manifest — W5.D3's wireframe-only loader becomes trivial. Existing /datasets gallery untouched.

#### Day 2 (Tue May 5) · 6 new profiling fixtures (the heavy content lift) — COMPLETED 2026-05-05
- [x] Hand-curate 6 profiling fixtures (~3KB each) describing what wireframe to generate from each dataset — **DONE**: 3.3-3.8 KB per fixture in `fixtures/dashboard-factory/wireframe-profiling/`. Total ~21 KB of carefully written prose.
- [x] Reference real columns + observed patterns — **DONE**: each fixture references actual schema column names in backticks + 1-2 observed patterns from the actual rows (Line D Night-shift scrap concentration; Austin/Nashville hot-market velocity; Riverside East Walk-in satisfaction drag; Online completion gap; Enterprise At-Risk concentration in named accounts; Long-haul Refrigerated delay clustering).
- [x] AI narrative voice consistent with existing 6 fixtures (without dashes per Day 3 rule) — **DONE**: matches the revops-sales fixture's voice (slightly conversational, confident, never hedged). Verified zero em/en/hyphen-with-space dashes via grep.
- [x] Each fixture recommends KPIs + chart layouts the wireframe engine will materialize — **DONE**: 5 KPIs + 4 charts per fixture. Charts span the full 7-chart toolkit (bar/line/donut/heatmap/scatter/funnel/histogram) across the 6 datasets. Plus shipped `lib/wireframe-profiling.ts` parallel loader (dormant until W5.D3 wires it up).

#### Day 3 (Wed May 6) · Data-driven wireframe template engine — COMPLETED 2026-05-05
- [x] Refactor wireframe rendering to be schema-driven (not hardcoded) — **DONE**: new `lib/wireframe-engine.ts` reads schema + recommendations and emits `DashboardLayout`. No hand-coded SVG primitives, no per-dataset layout files.
- [x] One engine renders any dataset's structure as a wireframe — **DONE**: `buildWireframeLayout(slug, density)` works for any registered slug + recommendation. Returns null for unknown slugs (caller 404s).
- [x] Replace existing 3 hardcoded templates (Executive/Operational/Exploratory) with the engine — **DONE**: deleted the 3 layout components + MockCharts (~1,000 lines). New `/wireframe/[slug]` dynamic route renders the engine output via the existing `<DashboardView>`. Old `/wireframe/{executive,operational,exploratory}` URLs now 404.
- [x] Old template aesthetic preserved as one of 3 layout density modes — **DONE**: Sparse (1 hero KPI + charts stacked at full width = exec readout), Balanced (5-KPI + 4-chart 2x2 = default), Dense (5-KPI + 4 charts side by side = ops control room). Density CSS in `globals.css` targeting `.dashboard-chart-row` (raw CSS rather than Tailwind arbitrary variants because the latter got purged).

#### Day 4 (Thu May 7) · Export-to-Figma demo + final QA — COMPLETED 2026-05-05
- [x] "Export to Figma" CTA on each generated wireframe — **DONE**: Lucide ExternalLink + "Export to Figma" label in WireframeView header status row, sits next to density selector. Mobile-responsive (icon-only at narrow widths). aria-label notes "manual rebuild today" for screen readers.
- [x] Click → "Future state" page showing how Figma MCP + Claude would convert to Figma file — **DONE**: new `/wireframe/figma-export` page (~250 lines) with hero / today's reality / 3-step flow / code snippet / blockers / architecture / closing callout.
- [x] Acknowledge manual-Figma reality with honest framing — **DONE**: dedicated "Today's reality" card up top + 3-blocker section + closing callout ("Why ship the button before the integration? Because the value is answering, what would the workflow even look like.") all set the manual-today framing explicitly.
- [x] Final cross-mode QA (ad-hoc + wireframe parallel structure) — **DONE**: walked all 12 production routes via Playwright at 1440×900 in dark mode (6 ad-hoc + 6 wireframes). Zero console errors across all 12. Verified Export-to-Figma CTA renders on every wireframe page and links correctly. Lighthouse `/wireframe/figma-export` 95/98/100/100.

#### Day 5 (Fri May 8) · Loom Video
- [ ] Write 90-second script: problem (10s) → gallery (15s) → profiling (20s) → dashboard (30s) → PDF export (10s) → outro (5s)
- [ ] Record on clean browser at 1440px (light mode + dark mode toggle visible)
- [ ] Edit: trim, add captions, end card
- [ ] Upload to YouTube unlisted + copy embed URL
- [ ] Update `portfolio.meta.json` with loomUrl

#### Day 6 (Sat May 9) · Case Study Page
- [ ] Create `docs/case-studies/dashboard-factory.mdx`
- [ ] Sections: hero, problem, approach, architecture (Production vs Demo diagrams), tech stack, impact, Loom embed, live link, GitHub link
- [ ] Write Mermaid architecture diagrams

#### Day 7 (Sun May 10) · Automation Infrastructure
- [ ] Push `rishigundla/resume-builder` to GitHub (via GitHub MCP)
- [ ] Generate GitHub PAT with `repo` scope
- [ ] Add PAT as secret `PORTFOLIO_SYNC_PAT` in ai-portfolio repo
- [ ] Build `scripts/sync-deployed.ts` — reads portfolio.meta.json files, opens PRs
- [ ] Build `.github/workflows/sync-portfolio.yml`
- [ ] Dry-run sync locally

**Context for Next Session**: _(fill in after completion)_

---

### Week 6 — Phase 1 close (revised)

#### Day 1 (Mon May 11) · Live Automation Run
- [ ] Trigger sync-portfolio workflow manually
- [ ] Verify PR opens on `rishigundla/portfolio-site` with new project card
- [ ] Verify PR opens on `rishigundla/resume-builder` with new bullet
- [ ] Review and merge both PRs
- [ ] Portfolio-site auto-redeploys with new card
- [ ] Regenerate resume PDF via existing ATS optimizer workflow

#### Day 2 (Tue May 12) · Phase 1 Wrap
- [ ] Buffer day — fix any bugs found post-deploy
- [ ] Update master plan with Phase 1 lessons learned (including the fixture-promise audit step for future projects)
- [ ] Tag Phase 1 complete
- [ ] Review Phase 2 (Project 2 Narrative Generator) plan

**Phase 1 Deliverables (revised)**:
- Project 1 fully live at `ai-portfolio-dashboard-factory.vercel.app`
- 6 ad-hoc dashboards with per-domain layouts, growth %, multi-chart-type variety
- 6 wireframe-mode datasets (different verticals from ad-hoc) with AI profiling and Export-to-Figma demo
- Light/dark theme toggle + particle background across all portfolio apps
- Visual-fidelity PDF export
- 90s Loom video published
- Case study page on portfolio-site
- Automation scripts working for future projects
- Portfolio-site has new card; resume has new bullet

---

## Phase 2 — Project 2 · Narrative Generator (Weeks 7-8, was Weeks 5-6)

### Week 5 — Project 2 Core Build

**Week goal**: User picks sample dashboard → sees streaming narrative → downloads PPTX.

#### Day 1 (Mon) · App Scaffold
- [ ] Create `apps/narrative-generator/` Next.js 16 project
- [ ] Install `@rishi/design-system` + `@rishi/ai-core`
- [ ] Landing page with "Browse sample dashboards" CTA

#### Day 2 (Tue) · Sample Dashboard Fixtures
- [ ] Create 4 sample dashboards in `fixtures/narrative-generator/`:
  - [ ] `acv-grr-weekly.json` (KPIs: ACV, GRR, Pipeline Coverage, Channel Mix)
  - [ ] `marketing-weekly.json` (KPIs: Campaign ROI, Reach, Spend vs Budget)
  - [ ] `balanced-scorecard.json` (50+ KPI-style, flagship example)
  - [ ] `cx-okr-quarterly.json` (Bookings, GRR, CSAT, NPS, Attrition)
- [ ] Each fixture includes: source PDF preview image, structured KPIs with current + previous period

#### Day 3 (Wed) · Dashboard Gallery + PDF Preview
- [ ] Gallery grid at `/` with 4 dashboard cards
- [ ] Click → navigate to `/generate/[slug]`
- [ ] Left panel: PDF preview via `pdfjs-dist`
- [ ] Right panel: placeholder for narrative

#### Day 4 (Thu) · Generate Narrative Fixtures
- [ ] Use Claude Code to generate narrative JSON per dashboard
- [ ] Each includes: exec summary (3-4 sentences), per-KPI narratives, risks, opportunities, talking points
- [ ] Save to `fixtures/narrative-generator/{slug}/narrative.json`

#### Day 5 (Fri) · Streaming Narrative Panel
- [ ] Build right-panel streaming display
- [ ] Wire `@rishi/ai-core` replay to stream narrative fixture
- [ ] Progress indicators: Parsing PDF → Extracting KPIs → Generating Narrative → Building Talking Points

#### Day 6 (Sat) · Slide Deck Generation Infrastructure
- [ ] Install `pptxgenjs`
- [ ] Write slide template builder that matches design system tokens
- [ ] Pre-generate PPTX files for each of 4 dashboards locally
- [ ] Upload PPTX files to Vercel Blob

#### Day 7 (Sun) · Download Flow
- [ ] "Download Deck" button → fetches PPTX from Vercel Blob
- [ ] Preview thumbnail of generated deck
- [ ] Simulated delivery options UI: Email, Slack, Google Drive

**Week 5 Deliverables**:
- Gallery + streaming narrative working for all 4 dashboards
- Pre-generated PPTX files stored in Vercel Blob
- Download flow working

---

### Week 6 — Project 2 Polish + Deploy

**Week goal**: Project 2 live on production, automation fires for Project 2.

#### Day 1 (Mon) · Delivery Simulation
- [ ] Mock "Send to Slack" button → shows mock success toast
- [ ] Mock "Email to distribution list" → shows mock success
- [ ] Mock "Save to Google Drive" → shows mock success

#### Day 2 (Tue) · Empty/Loading/Error States
- [ ] Skeleton loaders for PDF preview
- [ ] Error boundary for PDF rendering failures
- [ ] Toast notifications for user actions

#### Day 3 (Wed) · Responsive Polish
- [ ] Test at all breakpoints
- [ ] Mobile: collapse PDF preview below narrative
- [ ] Fix any layout bugs

#### Day 4 (Thu) · Lighthouse + SEO
- [ ] Lighthouse 90+ audit pass
- [ ] Meta tags, Open Graph
- [ ] Social preview image

#### Day 5 (Fri) · Production Deploy + Loom
- [ ] Deploy to Vercel
- [ ] Author `portfolio.meta.json`
- [ ] Record 90s Loom

#### Day 6 (Sat) · Case Study + Automation
- [ ] Write case study MDX
- [ ] Commit `portfolio.meta.json` with `deployedAt` → triggers automation
- [ ] Review + merge portfolio-site and resume-builder PRs

#### Day 7 (Sun) · Phase 2 Wrap
- [ ] Buffer, lessons learned, prep Phase 3

**Week 6 Deliverables**:
- Project 2 live on production
- Loom + case study published
- Portfolio + resume updated via automation

---

## Phase 3 — Project 4 · Sprint Intelligence (Weeks 7-8)

### Week 7 — Project 4 Core Build

**Week goal**: User picks synthetic sprint → sees KPIs + streaming meeting brief.

#### Day 1 (Mon) · App Scaffold + Synthetic Sprints
- [ ] Create `apps/sprint-intelligence/`
- [ ] Author 4 synthetic sprint JSONs in `fixtures/sprint-intelligence/sprints/`
- [ ] Each sprint includes: 20-30 tickets with status history, 8 engineers, priority distribution

#### Day 2 (Tue) · Sprint Selector + Dashboard Shell
- [ ] Dropdown to select sprint (Sprint 42/43/44/45)
- [ ] Dashboard shell with AI brief panel (top), KPIs (middle), deep-dive tabs (bottom)

#### Day 3 (Wed) · Team-Level KPIs
- [ ] Sprint Burndown chart
- [ ] Velocity vs 4-sprint baseline
- [ ] Status Distribution donut
- [ ] Blocked Tickets count + aging

#### Day 4 (Thu) · More Team KPIs + Trends
- [ ] Cycle Time trend line
- [ ] Throughput per week
- [ ] Scope Creep tracker
- [ ] Carryover Rate

#### Day 5 (Fri) · Individual Deep-Dive Tabs
- [ ] Tab per engineer
- [ ] Workload Score (weighted priority)
- [ ] Completion Rate
- [ ] Personal vs team cycle time
- [ ] Review bottleneck

#### Day 6 (Sat) · Generate Meeting Brief Fixtures
- [ ] Use Claude Code to generate meeting brief per sprint
- [ ] Each includes: exec summary, highlights, watch list, recommendations, talking points

#### Day 7 (Sun) · Streaming Brief Panel
- [ ] Top panel streams the AI meeting brief on sprint load
- [ ] Click "Regenerate" to replay streaming

**Week 7 Deliverables**:
- 4 sprints with full KPI breakdowns + AI briefs

---

### Week 8 — Project 4 Polish + Deploy

**Week goal**: Project 4 live, automation fires.

#### Day 1 (Mon) · Interactions + Drill-Downs
- [ ] Click engineer name → filter all views to that person
- [ ] Click blocker → show blocker history

#### Day 2 (Tue) · Responsive Polish
- [ ] Breakpoint testing
- [ ] Mobile: collapse deep-dive tabs to accordion

#### Day 3 (Wed) · Empty/Loading/Error
- [ ] Skeleton states
- [ ] Error boundaries

#### Day 4 (Thu) · Lighthouse + SEO
- [ ] 90+ audit

#### Day 5 (Fri) · Deploy + Loom
- [ ] Vercel production deploy
- [ ] `portfolio.meta.json`
- [ ] Record 90s Loom

#### Day 6 (Sat) · Case Study + Automation
- [ ] Write case study MDX
- [ ] Trigger automation, review + merge PRs

#### Day 7 (Sun) · Phase 3 Wrap
- [ ] Buffer day, lessons learned, prep Phase 4

**Week 8 Deliverables**:
- Project 4 live on production
- Loom + case study published
- Automation fires

---

## Phase 4 — Project 3 · Anomaly Alerting (Weeks 9-11)

### Week 9 — Project 3 Core Build

**Week goal**: Synthetic historical data + anomaly gallery + streaming RCA.

#### Day 1 (Mon) · App Scaffold + Historical Data
- [ ] Create `apps/anomaly-alerting/`
- [ ] Author synthetic historical data in `fixtures/anomaly-alerting/history/`:
  - [ ] NAI Pulse metrics (feature_usage, token_consumption)
  - [ ] NC2 Pulse (cluster_health, heartbeat_rate)
  - [ ] NCI Pulse (firmware_versions, feature_adoption)
  - [ ] RevOps (ACV, GRR, pipeline_coverage)
  - [ ] CX (CSAT, NPS, churn_rate)

#### Day 2 (Tue) · Dashboard with Time-Series
- [ ] Dashboard route with time-series charts per KPI
- [ ] 30-day rolling mean bands overlaid
- [ ] Date range selector

#### Day 3 (Wed) · Anomaly Scenario Gallery
- [ ] Build scenario gallery with 6-8 curated anomalies
- [ ] Each card: metric name, deviation %, Z-score, domain badge
- [ ] Click → navigate to `/scenario/[slug]`

#### Day 4 (Thu) · Baseline Visualization
- [ ] Expected vs actual chart per anomaly
- [ ] Highlight the deviation point
- [ ] Show related-metric time-series alongside

#### Day 5 (Fri) · Generate RCA Fixtures
- [ ] Use Claude Code to generate RCA per scenario
- [ ] Each includes: hypothesis, correlation analysis, confidence score, suggested action

#### Day 6 (Sat) · Streaming RCA Display
- [ ] Right panel streams RCA text
- [ ] Confidence badge (high/medium/low)
- [ ] "Suggested Action" card

#### Day 7 (Sun) · Alert List + Severity Routing
- [ ] Sidebar showing all recent alerts
- [ ] SEV1/SEV2/SEV3 routing tags
- [ ] Timestamp + acknowledgment state

**Week 9 Deliverables**:
- Historical dashboard + 6-8 working scenarios

---

### Week 10 — Project 3 Expanding Features

**Week goal**: Richer visualizations + simulated infrastructure.

#### Day 1 (Mon) · Confidence Score UI
- [ ] Visual gauge for confidence (0-100%)
- [ ] Breakdown: how confidence was calculated
- [ ] Risk-tolerance slider

#### Day 2 (Tue) · Recommended Action Flow
- [ ] "Run Playbook" button per recommendation
- [ ] Mock action execution (simulated API call)
- [ ] Action history log

#### Day 3 (Wed) · Historical Anomaly Archive
- [ ] Table of past anomalies with resolution status
- [ ] Filter by category, severity, date

#### Day 4 (Thu) · Simulated Deployment Log
- [ ] Display timeline of mock deployments
- [ ] Show correlation between deploys and anomalies

#### Day 5 (Fri) · MLflow-Style Trace View
- [ ] Per-RCA trace showing: inputs (metric + correlations + deployments) → AI reasoning → output
- [ ] Simulated MLflow UI aesthetic

#### Day 6 (Sat) · Architecture Diagrams
- [ ] Production architecture Mermaid (Databricks + Unity Catalog + MLflow)
- [ ] Demo architecture Mermaid (Vercel + JSON fixtures)

#### Day 7 (Sun) · Mobile Responsive
- [ ] Breakpoint polish

**Week 10 Deliverables**:
- Rich anomaly exploration UX
- All simulated infrastructure views complete

---

### Week 11 — Project 3 Polish + Deploy

**Week goal**: Project 3 live, automation fires.

#### Day 1 (Mon) · Lighthouse + SEO
- [ ] 90+ audit
- [ ] Meta tags

#### Day 2 (Tue) · Deploy
- [ ] Vercel production
- [ ] `portfolio.meta.json`

#### Day 3 (Wed) · Loom
- [ ] 90s video

#### Day 4 (Thu) · Case Study
- [ ] MDX with both architecture diagrams

#### Day 5 (Fri) · Automation Sync
- [ ] Trigger workflow
- [ ] Review + merge PRs

#### Day 6 (Sat) · Documentation
- [ ] README for the app
- [ ] Add to monorepo root README

#### Day 7 (Sun) · Phase 4 Wrap
- [ ] Buffer, lessons, prep Phase 5

**Week 11 Deliverables**:
- Project 3 live
- Loom + case study published
- Automation fires

---

## Phase 5 — Project 5 · Pipeline Self-Healer (Weeks 12-14)

### Week 12 — Project 5 Core Build

**Week goal**: Failure gallery + streaming diagnosis + PySpark patch display.

#### Day 1 (Mon) · App Scaffold + Failure Scenarios
- [ ] Create `apps/pipeline-healer/`
- [ ] Author 8 failure scenarios in `fixtures/pipeline-healer/scenarios/`:
  - [ ] SCHEMA_DRIFT (Informatica column rename — your Q14 story)
  - [ ] NULL_EXPLOSION
  - [ ] DATA_SKEW (partition imbalance — your Q17 story)
  - [ ] TYPE_MISMATCH
  - [ ] RESOURCE_LIMIT (OOM)
  - [ ] LOGIC_ERROR
  - [ ] DEPENDENCY_FAIL (upstream table not refreshed)
  - [ ] FILE_CORRUPT

#### Day 2 (Tue) · Scenario Gallery
- [ ] Gallery with 8 scenario cards
- [ ] Each card: failure category, pipeline name, timestamp, severity
- [ ] Click → navigate to `/scenario/[slug]`

#### Day 3 (Wed) · Failure Detail View
- [ ] Display mock Spark driver logs (syntax highlighted)
- [ ] Display failing notebook code snippet
- [ ] Run history showing last 10 runs

#### Day 4 (Thu) · Schema Diff Visualization
- [ ] Visual diff of schema (today vs last successful run)
- [ ] Added/removed/renamed/type-changed columns highlighted

#### Day 5 (Fri) · Generate Diagnosis Fixtures
- [ ] Use Claude Code to generate diagnosis per scenario
- [ ] Each includes: root cause explanation, PySpark patch, confidence, risk assessment

#### Day 6 (Sat) · Streaming Diagnosis Panel
- [ ] Stream diagnosis text
- [ ] Category badge (SCHEMA_DRIFT etc.)
- [ ] Confidence score

#### Day 7 (Sun) · PySpark Patch Display
- [ ] Syntax-highlighted code block with Shiki or Prism
- [ ] Before/after diff view
- [ ] Copy-to-clipboard button

**Week 12 Deliverables**:
- 8 scenarios with full diagnosis + patch flows

---

### Week 13 — Project 5 Interactive Demo Features

**Week goal**: Simulated approval flow + historical dashboards.

#### Day 1 (Mon) · Sample Validation UI
- [ ] "Run Sample Test" button simulates running patch on 100 rows
- [ ] Progress indicator
- [ ] Success/failure result display

#### Day 2 (Tue) · Mock Slack Approval UI
- [ ] Slack-styled message preview
- [ ] Approve / Reject / Escalate buttons
- [ ] Simulated response (pipeline retries / ticket created / oncall paged)

#### Day 3 (Wed) · Incident History Timeline
- [ ] Table of past incidents
- [ ] Filter by category, pipeline, auto-healed status
- [ ] Click to view historical details

#### Day 4 (Thu) · MTTR Trend Chart
- [ ] Weekly MTTR line chart
- [ ] Auto-heal rate % over time
- [ ] Comparison: manual vs auto resolution times

#### Day 5 (Fri) · Architecture Diagrams
- [ ] Production Mermaid (Databricks Agent Bricks + MLflow tracing)
- [ ] Demo Mermaid (Vercel + JSON fixtures)

#### Day 6 (Sat) · Per-Category Breakdown
- [ ] Dashboard tab showing category frequency
- [ ] Most common root causes per pipeline

#### Day 7 (Sun) · Mobile Responsive
- [ ] Breakpoint polish

**Week 13 Deliverables**:
- Complete interactive demo experience
- All simulated infrastructure views

---

### Week 14 — Project 5 Polish + Deploy + Portfolio Wrap

**Week goal**: Project 5 live, all 5 projects polished, final portfolio review.

#### Day 1 (Mon) · Lighthouse + SEO
- [ ] 90+ audit

#### Day 2 (Tue) · Deploy
- [ ] Vercel production
- [ ] `portfolio.meta.json`

#### Day 3 (Wed) · Loom
- [ ] 90s video

#### Day 4 (Thu) · Case Study + Automation
- [ ] MDX
- [ ] Trigger sync, merge PRs

#### Day 5 (Fri) · Final Portfolio Review
- [ ] Click-test all 5 deployed apps
- [ ] Verify all 5 cards on portfolio-site
- [ ] Verify resume PDF reflects all 5 projects

#### Day 6 (Sat) · Monorepo Documentation
- [ ] Update root README with "all 5 projects live" announcement
- [ ] Create portfolio overview video (optional 3-min tour)
- [ ] LinkedIn post draft

#### Day 7 (Sun) · Retrospective
- [ ] Lessons learned document
- [ ] Plan next phase (blog posts, talks, follow-up projects)
- [ ] Tag Phase 5 complete — portfolio shipped

**Week 14 Deliverables**:
- All 5 AI projects live on Vercel
- Portfolio-site has 5 new cards
- Resume has new Personal Projects category with bullet
- Monorepo on GitHub showcases the whole system
- Portfolio is public and shipping

---


# PART G — PORTFOLIO + RESUME AUTOMATION

## Source of Truth: `portfolio.meta.json`

Every app in `apps/<project>/` includes this file. Populated `deployedAt` field triggers the automation.

```json
{
  "slug": "dashboard-factory",
  "title": "Instant Analytics Dashboard Factory",
  "category": "AI",
  "tags": ["AI", "React", "Design System", "Claude"],
  "description": "AI-powered dashboard factory that turns any dataset into a fully designed, interactive dashboard.",
  "thumbnail": "/projects/ai-dashboard-factory.png",
  "liveUrl": "https://ai-dashboard-factory.vercel.app",
  "githubUrl": "https://github.com/rishigundla/ai-portfolio/tree/main/apps/dashboard-factory",
  "caseStudyUrl": "https://rishikeshgundla.com/ai-projects/dashboard-factory",
  "loomUrl": "https://www.loom.com/share/abc123",
  "deployedAt": "2026-05-20",
  "resumeBullet": {
    "category": "AI-Powered Analytics & Data Engineering Projects",
    "text": "Architected an AI-powered dashboard factory on Next.js + Vercel, applying a unified design-token system across 6 business domains with streaming AI profiling and automatic chart recommendation."
  },
  "portfolioCard": {
    "problem": "Dashboard creation follows a slow cycle of profiling, wireframing, and alignment before any real build starts.",
    "approach": "An AI-powered factory that profiles uploaded datasets, recommends KPIs, and renders a fully designed interactive dashboard applying a unified design system.",
    "impact": "Reduces ad-hoc dashboard turnaround from days to minutes; serves both business users and BI engineers."
  }
}
```

## Sync Workflow

1. Project merged to `main` → Vercel deploys successfully
2. GitHub Action `.github/workflows/sync-portfolio.yml` fires
3. Runs `scripts/sync-deployed.ts`:
   - Reads all `apps/*/portfolio.meta.json` files
   - Opens PR on `rishigundla/portfolio-site`: adds card to Projects.jsx, adds case study MDX
   - Opens PR on `rishigundla/resume-builder`: adds bullet to all prompt files
   - Posts Slack notification with both PR URLs
4. Rishi reviews + merges PRs manually (safety net)
5. Portfolio-site auto-redeploys; resume PDF regenerated via existing ATS optimizer

## Automation Setup (Week 4, Day 5)

- Push `rishigundla/resume-builder` to GitHub via GitHub MCP
- Create GitHub PAT with `repo` scope
- Add `PORTFOLIO_SYNC_PAT` secret in `rishigundla/ai-portfolio`
- Add `SLACK_WEBHOOK` secret

---

# PART H — SUPPORTING REFERENCE

## Databricks Architecture as Portfolio Artifact

Even though deployment is 100% Vercel, each case study documents the **production architecture** on Databricks — as design, not deployment. This converts the decision into a platform-translation skill (a credential, not a limitation).

Per project:
- Production Architecture: Databricks + Delta Lake + Unity Catalog + MLflow
- Demo Architecture: Vercel + static JSON fixtures + AI SDK streaming

Interview framing: _"I designed the production architecture for Databricks; built the portfolio demo on Vercel for accessibility. The AI layer is live in both versions."_

## Master Skills / MCPs Reference

### MCPs Used
| MCP | Projects | Purpose |
|-----|----------|---------|
| GitHub MCP | All | Repo ops, PR creation during dev |
| Figma MCP | 1 | Design token reference, wireframe generation |

### Vercel Skills
| Skill | Used For |
|-------|----------|
| `vercel:ai-sdk` | streamText fixture replay |
| `vercel:nextjs` | App Router patterns |
| `vercel:vercel-functions` | Serverless routes |
| `vercel:vercel-storage` | Blob (P2 PPTX), KV (session) |
| `vercel:runtime-cache` | Edge caching |
| `vercel:chat-sdk` | P4 conversational UI |
| `vercel:shadcn` | Primitives |
| `vercel:deploy` | Production deploy |
| `vercel:env` | No runtime keys needed |
| `vercel:bootstrap` | App scaffolding |

### Design / Frontend Skills
| Skill | Projects | Purpose |
|-------|----------|---------|
| `design-system-starter` | 1 (Week 1) | Token architecture |
| `frontend-design` | All | Distinctive UI |
| `elegant-design` | All | Accessibility + polish |
| `react-dev` | All | React 19 patterns |
| `browser-qa` | All | Responsive testing |
| `claude-api` | Fixture gen | Prompt engineering |
| `humanizer` | 2, 4 | Natural narrative tone |
| `professional-communication` | 2, 4 | Exec tone |
| `pptx` | 2 | Slide generation |

## Resume Integration Plan

### New Personal Projects Category

Add to `resume-builder/original/resume-prompt-v1.md` and all per-role prompts:

```yaml
- category: AI-Powered Analytics & Data Engineering Projects
  link: https://github.com/rishigundla/ai-portfolio
  bullets:
    - Architected and deployed 5 production-grade AI applications combining BI, data engineering, and applied AI — an AI dashboard factory, PDF-to-deck narrative generator, PySpark self-healing pipeline framework, sprint intelligence dashboard on PostgreSQL SSOT, and Unity Catalog-based anomaly detection with AI root-cause narration.
    - Leveraged Claude API, Databricks Foundation Model Serving, MLflow tracing, Unity Catalog Metric Views, Figma MCP, and PostgreSQL MCP across a shared design-system monorepo deployed on Vercel and Databricks.
```

### Core Competencies Swaps (recommended)
- Replace `Data Storytelling` → `Claude API`
- Replace `Data Modeling` → `AI Agents`
- Keep the rest

## Portfolio-Site Integration Plan

1. Add `AI` filter category to Projects.jsx
2. Add 5 project cards (one per AI project) with thumbnails, live URLs, case-study links
3. Create dedicated case-study pages at `/ai-projects/[slug]` rendering MDX from monorepo `docs/case-studies/`
4. Generate thumbnails from each deployed app, place in `public/projects/ai-*.png`

## Nutanix Project Anchors (for examples)

- Enterprise Dashboard Design System (Figma) — Project 1 anchor
- Pulse SSOT: NAI, NC2, NCI — Project 3 anchor
- Jira SSOT (Atlassian Postgres → Informatica → Databricks) — Project 4 + Project 5 anchors
- RevOps Sales SSOT (ACV/GRR, Balanced Scorecard 50+ KPIs) — Project 2 + Project 3 anchors
- Microsoft Fabric (Marketing, Procurement) — peripheral anchor
- CX OKR Dashboard (Business + Product + Team dimensions) — Project 2 + Project 3 anchor

## Interview Anchors (Q14, Q17)

- Q14 Challenge 2 (Data Quality / Schema Drift) → Project 5 SCHEMA_DRIFT scenario
- Q17 (Jira SSOT Silver-layer partition tuning) → Project 5 DATA_SKEW scenario

---

# PART I — NEXT ACTIONS

## Immediate (Today)
1. Review this updated plan
2. Confirm ready to start Week 1 Day 1
3. Decide execution mode: **Option A** (you run commands, I guide) or **Option B** (I execute via Bash/PowerShell/GitHub MCP, you approve each step)

## Week 1 Day 1 Execution Steps (from Phase 1 plan above)
1. Install pnpm: `npm install -g pnpm`
2. Create GitHub repo via MCP
3. Create local directory
4. Scaffold turborepo starter
5. Clean + configure
6. Initial install + commit + push
7. Verify everything works

## Ongoing
- Every morning: read Current Status + Recent Activity Log + today's section
- Every evening: update task checkboxes, add entry to Recent Activity Log, fill in Context for Next Session
- Weekly: review progress against the 14-week target

---

*Master plan v3 — comprehensive day-by-day tracker. Previous version: v2 (2026-04-24). Reach v4 when first actual implementation feedback comes in.*
