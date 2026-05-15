# narrative-generator

**Project 02 of 5** — Dashboard-to-Deck Narrative Generator. Pick a sample dashboard, watch Claude write the executive readout, download a themed PPTX.

**Live**: <https://ai-portfolio-narrative-generator.vercel.app> &nbsp;·&nbsp; **Case study**: [`docs/case-studies/narrative-generator.md`](../../docs/case-studies/narrative-generator.md) (W7.D4) &nbsp;·&nbsp; **Status**: Production · v1.0 in flight

---

## The other half of the BI workflow

Project 1 (Dashboard Factory) goes raw data → dashboard. Project 2 goes dashboard → narrative readout → PPTX-ready deck. Together they close the loop on the BI engineer's full workflow.

> *"Once I ship a dashboard, the analyst's real work begins: writing the executive readout. Pulling the headline insight, drafting the bullet narrative, formatting a PPTX that survives the Monday review. This is the part nobody outsources well."*

Three steps:

1. **Pick a sample dashboard** from a curated library of 6 (RevOps, Marketing, Ops, Finance, HR, CX). Each is a finished BI artifact — 5 KPIs + 3 charts + supporting rows.
2. **Watch Claude write the readout**. The streaming panel reveals the narrative word-by-word with a 5-step progress strip: Headline → What moved → So what → Talking points → Risks + caveats.
3. **Download the deck**. The same fixtures feed a server-side `pptxgenjs` builder that emits a 7-slide PPTX themed to the dashboard's accent color. One click, no template wrangling.

## Routes

| Route | Kind | Notes |
|-------|------|-------|
| `/` | Static | Home with three-step pitch |
| `/dashboards` | Static | Gallery of 6 sample dashboards (3-column responsive grid) |
| `/generate/[slug]` | SSG × 6 | Streaming narrative panel (47.8 kB First Load JS) |
| `/deck/[slug]` | SSG × 6 | 7-slide themed preview (167 B First Load JS — pure server-rendered) |
| `/api/deck/[slug]` | SSG × 6 | PPTX download endpoint (~110 KB per file, ZIP/PPTX bytes baked at build time) |

24 prerendered routes total (3 static + 18 SSG + favicons + not-found). Lighthouse desktop: home 99/98/100/100, all other routes **100/100/100/100**.

## Architecture (shipped)

```
fixtures/narrative-generator/
├── dashboards/                  6 dashboards × KPIs + charts + rows + index.json
└── narratives/                  6 narratives (hand-curated exec-readout voice)

apps/narrative-generator/lib/
├── dashboards.ts                Manifest loader (light, drives /dashboards gallery)
├── full-dashboards.ts           Per-slug full fixture loader (heavy, tree-shaken per route)
├── narratives.ts                Static-imports the 6 narrative fixtures
├── parse-narrative.ts           Markdown-section parser + bullet extractor
├── format-kpi.ts                Shared formatKpiValue + HEX_BY_TOKEN palette
└── build-pptx.ts                Server-side pptxgenjs builder (7 slide builders)

apps/narrative-generator/app/
├── page.tsx                     /
├── dashboards/page.tsx          /dashboards · 6-card gallery
├── generate/[slug]/page.tsx     /generate/[slug] · loads narrative fixture
│   └── _streaming-panel.tsx     Client component · replayFixture + AiNarrativeBlock
├── deck/[slug]/page.tsx         /deck/[slug] · loads both fixtures
│   ├── _slide-preview.tsx       Server component · 7 themed slides
│   └── _pptx-modal.tsx          <a href download> anchor (was a Dialog stub in W6.D5)
└── api/deck/[slug]/route.ts     GET handler · streams PPTX bytes from buildPptxBuffer
```

**Shared with Project 1**: the streaming primitive ([`@rishi/ai-core/replayFixture`](../../packages/ai-core/src/replay.ts)) renders the narrative word-by-word; [`AiNarrativeBlock`](../../packages/design-system/src/components/) handles the markdown + live cursor. The Dialog primitive (W5.D4.4 centering fix) backs every modal across both apps. Project 2 ships zero copies of these — the monorepo design-system + ai-core packages do the work.

**Unique to Project 2**: `lib/build-pptx.ts` (~330 lines, server-side `pptxgenjs` integration) and the narrative-fixture shape that pairs with each dashboard. The PPTX endpoint uses `dynamic = 'force-static'` + `generateStaticParams` so all 6 deck binaries prerender at build time and serve from CDN cache with `Cache-Control: immutable`.

Full architecture walkthrough + key technical decisions + engineering moments will land in the [case study](../../docs/case-studies/narrative-generator.md) in W7.D4.

## Development

```bash
# from repo root
pnpm dev --filter narrative-generator

# or from this directory
pnpm dev
```

Runs at <http://localhost:3003>. (Project 1 dashboard-factory runs on 3002, design-system-docs on 3001.)

```bash
pnpm --filter narrative-generator build       # production build
pnpm --filter narrative-generator check-types # tsc --noEmit
```

## Deployment

Deployed to Vercel on every push to `main` since W6.D2. Production URL: <https://ai-portfolio-narrative-generator.vercel.app>.

Vercel setup quirk worth noting: the CLI doesn't expose `rootDirectory`, so the initial project setup needed a REST `PATCH /v9/projects/{id}` call to set Root Directory to `apps/narrative-generator`. Without it, the CLI uploads only the leaf directory and `pnpm install` fails on `workspace:*` resolutions. See the W6.D2 activity entry in [`docs/master-plan.md`](../../docs/master-plan.md) for the full recipe.

`portfolio.meta.json` carries the project metadata consumed by the [portfolio-site](https://github.com/rishigundla/portfolio-site) project — when `deployedAt` is set and the case study URL is wired, the portfolio site picks up the project card on its next deploy.
