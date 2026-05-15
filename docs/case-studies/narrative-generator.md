# Narrative Generator — Case Study

> Dashboards out, stories back in. Pick a sample dashboard, watch Claude write the executive readout, download a themed PPTX. The other half of the BI workflow.

**Live**: <https://ai-portfolio-narrative-generator.vercel.app> &nbsp;·&nbsp; **Source**: [`apps/narrative-generator`](https://github.com/rishigundla/ai-portfolio/tree/main/apps/narrative-generator) &nbsp;·&nbsp; **Stack**: Next.js 15, React 19, TypeScript, Tailwind, pptxgenjs, Vercel

---

## The problem

Project 1 (Dashboard Factory) showed how to go raw data → dashboard. But shipping the dashboard is only half the BI engineer's job. Once the dashboard exists, the analyst's real work begins: writing the executive readout. Pulling the headline insight. Drafting the bullet narrative. Formatting a PPTX that survives the Monday review.

This is the part nobody outsources well. Vendor narrative tools generate generic captions that read like LinkedIn AI-spam. Manual writing eats hours per week per analyst. And the dashboard-to-deck handoff is exactly where insight quality gets lost — the dashboard has all the context, the deck has none of it, and somebody on a deadline has to do the translation work twice (once in their head, once in PowerPoint).

The hypothesis behind Project 2: if the dashboard's structure (KPIs, charts, supporting rows) is already typed and known at build time, the AI can write a grounded narrative against that structure — not generic prose, real numbers explaining real movements. And the same fixtures that drive the on-screen preview can drive a server-side PPTX builder, so the downloadable deck stays in lockstep with what the analyst saw.

## The approach: three steps, one shared engine

The product is a three-step factory: **pick → read → download**.

1. **Pick a dashboard.** Six curated samples — RevOps, Marketing, Ops, Finance, HR, CX. Each is a finished BI artifact: 5 KPIs, 3 charts, 6-8 supporting rows. Different from Project 1's raw datasets by design.
2. **Watch Claude write the readout.** A streaming panel reveals the narrative word-by-word, structured around 5 sections: Headline → What moved → So what → Talking points → Risks + caveats. A 5-step progress strip advances as each section heading appears in the stream.
3. **Download a themed PPTX.** A 7-slide deck (Title + Headline + 4 narrative sections + Closing recap) generated server-side via `pptxgenjs`, themed to the dashboard's accent color, served from CDN cache.

The wedge is **one shared engine across both projects**. The streaming primitive (`@rishi/ai-core/replayFixture`), the markdown renderer (`AiNarrativeBlock`), the Dialog primitive — all imported from the same monorepo packages as Project 1. Project 2 ships zero copies of those. What's unique to Project 2 is the dashboard + narrative fixture shapes and the PPTX builder.

## Architecture

```
fixtures/narrative-generator/
├── dashboards/                  6 dashboard JSON fixtures + index.json manifest
└── narratives/                  6 narrative fixtures (markdown, exec-readout voice)

apps/narrative-generator/lib/
├── dashboards.ts                Manifest loader (light, drives /dashboards gallery)
├── full-dashboards.ts           Per-slug full fixture (heavy, tree-shaken per route)
├── narratives.ts                Static-imports the 6 narrative fixtures
├── parse-narrative.ts           Markdown-section parser + bullet extractor
├── format-kpi.ts                Shared formatKpiValue + HEX_BY_TOKEN palette
└── build-pptx.ts                Server-side pptxgenjs builder (7 slide builders)

apps/narrative-generator/app/
├── page.tsx                     /
├── dashboards/page.tsx          Gallery, server-rendered
├── generate/[slug]/             Streaming narrative panel
│   ├── page.tsx                 Loads narrative fixture
│   └── _streaming-panel.tsx     Client component · replayFixture
├── deck/[slug]/                 7-slide deck preview
│   ├── page.tsx                 Loads dashboard + narrative
│   └── _slide-preview.tsx       Server component · 7 themed slides
└── api/deck/[slug]/route.ts     PPTX download endpoint (SSG, force-static)
```

Two file-pattern moves carry the weight:

**Two-file loader split** mirrors Project 1. The `/dashboards` gallery only needs the manifest (light, ~6 kB), so it imports `lib/dashboards.ts`. The streaming + deck routes need the full fixture (KPIs + charts + rows + narrative text), so they import `lib/full-dashboards.ts` and `lib/narratives.ts`. Webpack tree-shakes each route's bundle so the gallery never carries the full payload. With six dashboards this is invisible; at sixty it would matter.

**`generateStaticParams` everywhere** — `/generate/[slug]`, `/deck/[slug]`, AND `/api/deck/[slug]` all enumerate the same 6 slugs at build time. The deck preview prerenders to static HTML. The PPTX bytes prerender to static binary files served with `Cache-Control: immutable`. The user's "download" is really just an edge-cached GET.

## Key technical decisions

**`pptxgenjs` over `python-pptx` via a Python service.** `pptxgenjs` runs on Node, fits Vercel's runtime without extra plumbing, ships ~500 KB, and has a clean fluent API. Python-pptx would have meant a separate runtime + glue code, not a fit for "one platform, one deploy" portfolio scope.

**`flattenMarkdown` regex strip over `pptxgenjs`'s rich-text array.** The narrative fixtures use `**bold**` and `*italic*` for emphasis; the basic `addText()` API renders those literally as asterisks. `pptxgenjs` has a rich-text array API that preserves emphasis, but it requires restructuring every slide builder around `[{text, options}]` segments. For v1 the trade-off: lose `**bold**` emphasis in the PPTX (the prose still reads fine), keep the simpler call site. v1.1 polish if it matters.

**Modal-to-anchor swap for the 85× bundle win.** W6.D5 shipped a Radix Dialog stub for the "Download PPTX" CTA — a future-state modal explaining what the export *would* do. W7.D1 wired the real export; the modal was redundant. Replacing `<DialogTrigger>` + state + portal with a plain `<a href download>` reduced `/deck/[slug]`'s First Load JS from 14.2 kB to 167 B (85× smaller), because the Dialog was the only client component on the page. The deck preview became pure server-rendered.

**`dynamic = 'force-static'` + `generateStaticParams` for the PPTX endpoint.** Instead of generating each PPTX on request, all 6 are built at compile time and served as static assets with `Cache-Control: immutable`. Net effect: PPTX downloads are CDN-edge cached, same latency as a static image. Server work happens once, at `next build`, never per request.

## Engineering moments worth telling

The kind of stuff you only find out by shipping.

**The Vercel CLI `rootDirectory` gap.** W6.D2 should have been a 10-minute Vercel deploy. It took three hours. `vercel link` + `vercel deploy --prod` from inside `apps/narrative-generator/` succeeded at creating the project but failed at `npm install` because the deploy only uploaded the leaf directory — `workspace:*` deps from `@rishi/design-system` and `@rishi/ai-core` couldn't resolve. The Vercel CLI doesn't expose project-level `rootDirectory`; that setting is dashboard-only. The workaround: `PATCH /v9/projects/{id}` with `{"rootDirectory": "apps/narrative-generator"}` against the REST API using the CLI's locally-stored auth token. After that, `vercel deploy --prod` from the **monorepo root** (not the app directory, or paths double up) worked. The whole recipe is now in the W6.D2 master-plan activity entry and the project README.

**The Lighthouse a11y regression in W6.D6.** Cross-viewport sweep was clean; Lighthouse audit surfaced two issues on `/dashboards`: card footers used `text-text-dim` (#4b5563) giving 2.37:1 contrast vs the 4.5:1 WCAG AA threshold, and the H1 → H3 heading jump skipped a level. Both were fallout from W6.D3 — adding 6 dashboard cards introduced two small a11y bugs that wouldn't have been caught without a fresh audit. Plus the favicon 404 (no `app/icon.tsx`) dropped Best Practices to 96 on every route. Three fixes, one commit: lift `text-text-dim` → `text-text-muted` (6.4:1 contrast), `<h3>` → `<h2>`, and add `app/icon.tsx` + `app/apple-icon.tsx` with the 'NG' wordmark. Re-audit moved 3 of 4 routes to perfect 100/100/100/100.

**The 14.2 kB → 167 B First Load JS reduction.** When W7.D1 replaced the W6.D5 modal stub with a plain anchor, the deck route's bundle didn't just shrink — it changed *kind*. With the Dialog client component gone, `/deck/[slug]` had zero React hydration, zero state. The 167 B is the route shell, not the slide content (which is server-rendered HTML). Real-world impact: faster First Contentful Paint, less JS to parse on the user's device. Lighthouse score stayed at 100 because there's no "above 100" lane, but the FCP/LCP timings moved.

## What I'd do differently

The `flattenMarkdown` trade-off is the obvious one. Restructuring `build-pptx.ts` to use `pptxgenjs`'s rich-text array would preserve emphasis in the PPTX. Not worth doing for v1, but it would lift visual fidelity in v1.1.

The dashboard + narrative fixtures are hand-curated JSON files. For a real product they'd come from a typed schema + a generation pipeline (probably model-driven, given the AI-native framing). The hand-curation works for a 6-fixture portfolio demo but doesn't scale.

I should have done the Lighthouse audit earlier in the week. The /dashboards a11y regression was W6.D3 fallout that survived 3 days before W6.D6 caught it. Visual regression tests (Project 1's Cat A #2) catch CSS regressions; structural a11y like heading-order skips need a Lighthouse-in-CI check. That's a Project 3 setup item.

## Future work

PPTX font embedding — Space Grotesk + JetBrains Mono fall back to system fonts on machines without them. Embedding fonts in the PPTX would lift visual fidelity but bloats the file ~10×. Reasonable for a paid product, overkill for a portfolio demo.

Dynamic dashboards. Today the 6 dashboards are baked into `fixtures/`. A natural v2 would accept a user-uploaded dashboard (CSV + chart specs) and run the same narrative + PPTX pipeline. The architecture supports it; the missing piece is the parser for the uploaded dashboard shape.

Multi-format export. PPTX is the right primitive for exec readouts; PDF is the right primitive for distribution; Google Slides is the right primitive for collaboration. Same fixture, three export endpoints. Project 3+ infrastructure.

## Footer

This is Project 2 of a five-project AI portfolio. Together with Project 1 (Dashboard Factory), it closes the loop on the BI engineer's workflow: dashboards out, stories back in. Next up: Project 3 (Sprint Intelligence) — synthetic sprints → team + individual KPIs → AI meeting brief.

- **Live demo**: <https://ai-portfolio-narrative-generator.vercel.app>
- **Source**: [`apps/narrative-generator`](https://github.com/rishigundla/ai-portfolio/tree/main/apps/narrative-generator)
- **Project 1 case study**: [`docs/case-studies/dashboard-factory.md`](./dashboard-factory.md)
- **Master plan**: [`docs/master-plan.md`](../master-plan.md)
- **Built by**: [Rishikesh Gundla](https://rishikeshgundla.com)
