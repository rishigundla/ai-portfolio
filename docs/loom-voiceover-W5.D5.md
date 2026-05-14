# W5.D5 — Loom voiceover script

**Target runtime**: ~115s &nbsp;|&nbsp; **Speaking rate**: ~149 wpm (relaxed pace) &nbsp;|&nbsp; **Word count**: ~286

Read each beat at its labeled timestamp. Cues in `[brackets]` are screen actions, not narration.

---

### 0:00 – 0:10 &nbsp;·&nbsp; Problem framing
> Picture this. You've got a CSV. Your VP wants a regional sales dashboard for Monday's exec meeting. You don't want to file a BI ticket.

`[home page in frame, hold on the H1]`

### 0:10 – 0:20 &nbsp;·&nbsp; Home page
> Dashboard Factory has two modes. Ad-hoc dashboards for business users, hi-fi wireframes for developers. Let's start with ad-hoc — Browse sample datasets.

`[click "Browse sample datasets"]`

### 0:20 – 0:30 &nbsp;·&nbsp; /datasets gallery
> Six curated sample datasets — RevOps, marketing, IoT telemetry, supply chain, financial complaints, customer demographics. I'll pick RevOps Sales.

`[hover across the 6 cards, then click RevOps Sales]`

### 0:30 – 0:45 &nbsp;·&nbsp; Profiling stream
> Watch this. Claude is profiling the data live — column classification, domain inference, KPI recommendations, chart picks. It catches real patterns — NAMER Direct dominating ACV, APAC running through Partner channels. This streams every visit.

`[let the streaming text fill the panel; cursor still]`

### 0:45 – 1:05 &nbsp;·&nbsp; Live dashboard + drill-down
> The dashboard. Five KPIs across the top with period-over-period deltas. Four charts in a 12-column grid — ACV by segment, the trend line, a scatter against retention, and a deal funnel. Hover for tooltips, click any bar — drill-down dialog with rows, summary stats, and distribution.

`[scroll the KPI strip, hover a chart for the tooltip, click a bar to open the drill-down, tab through the 3 tabs, close]`

### 1:05 – 1:10 &nbsp;·&nbsp; PDF export
> Export to PDF. html2canvas plus jsPDF. File downloads with every chart intact.

`[click Export PDF, show the capture overlay, downloads tray flash]`

### 1:10 – 1:25 &nbsp;·&nbsp; /wireframe gallery
> Wireframe mode. Six dataset-driven wireframes — manufacturing, real estate, healthcare, education, SaaS, logistics. Each layout generated from the dataset schema, not hand-coded. Let's look at manufacturing throughput.

`[nav to /wireframe, hover the 6 cards, click manufacturing-throughput]`

### 1:25 – 1:40 &nbsp;·&nbsp; Wireframe with funnel cone
> Five-KPI strip and four-chart grid. Notice the funnel — Pass, Rework, Scrap. Stages auto-sorted by value, bars center-aligned. The cone shape emerges from the layout itself. Same machinery as the ad-hoc dashboard.

`[scroll so the Pass→Rework→Scrap funnel is centered; pause 2 beats on the cone shape]`

### 1:40 – 1:50 &nbsp;·&nbsp; Export-to-Figma modal
> Export to Figma. Modal opens — blurred backdrop, future-state vision: Figma MCP would create an editable file from this wireframe. Not wired today; sample data doesn't justify the API spend.

`[click Export to Figma, modal centers with the blurred backdrop, hold for ~2s, close with Got it]`

### 1:50 – 1:55 &nbsp;·&nbsp; Outro
> Source on GitHub. Project one of five — next up: a narrative generator.

`[hover the GitHub link in the nav, fade]`

---

## Pre-recording checklist

- [ ] Chrome window with only the app tab open (no extensions visible, no bookmarks bar)
- [ ] Viewport set to **1440 × 900** (Chrome DevTools → toggle device toolbar → Responsive → 1440×900)
- [ ] Dark mode active (theme toggle is in the top-right of the nav if needed)
- [ ] `localStorage.clear()` in DevTools console so `/generate` plays the streaming animation fresh
- [ ] Cursor visible (system preference)
- [ ] System sounds muted
- [ ] Click highlights enabled (Loom desktop has it built-in; on QuickTime add a cursor highlight overlay)
- [ ] Pre-flight Playwright sweep was clean at this viewport — see W5.D5 prep activity entry in `master-plan.md`

## Recording

- Loom desktop OR QuickTime Screen Recording, **60 fps** preferred
- Single take if possible — cleaner than stitched cuts; the script is structured to support one continuous read
- If you fluff a line, pause for a beat and re-read it from the start of that bullet — easier to trim than overlap

## Post

1. Trim opening/closing dead frames (target ≤ 120s total)
2. Upload to YouTube **unlisted** (avoids the Loom free-tier watermark)
3. Copy the share URL
4. Edit `apps/dashboard-factory/portfolio.meta.json` → set `loomUrl` to the YouTube URL
5. Commit: `docs: add W5.D5 Loom video URL to portfolio.meta.json`
6. Push — Vercel redeploys, the portfolio-site picks up the embed
