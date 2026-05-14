# narrative-generator

**Project 02 of 5** — Dashboard-to-Deck Narrative Generator. Pick a sample dashboard, watch Claude write the executive narrative, get a polished PPTX-ready deck.

**Live**: <https://ai-portfolio-narrative-generator.vercel.app> &nbsp;·&nbsp; **Case study**: _coming with v1.0_ &nbsp;·&nbsp; **Status**: W6.D2 deployed (scaffold)

---

## The other half of the BI workflow

Project 1 (Dashboard Factory) goes raw data → dashboard. This project goes dashboard → narrative readout → polished deck. Together they close the loop on the BI engineer's full workflow.

> "Once I ship a dashboard, the analyst's real work begins: writing the executive readout. Pulling the headline insight, drafting the bullet narrative, formatting a PPTX that survives the Monday review. This is the part nobody outsources well."

Pick a sample dashboard from the curated library, watch the streaming narrative explain hero metric + week-over-week delta + the contextual one-liner, get a slide deck themed to the same design system as Project 1.

## Routes

| Route | Status | Lands |
|-------|--------|-------|
| `/` | W6.D1 scaffold | W6.D1 |
| `/dashboards` | W6.D1 placeholder | W6.D3 (sample dashboard library) |
| `/generate/[slug]` | W6.D1 placeholder | W7.D1-D3 (streaming narrative panel) |
| `/deck/[slug]` | W6.D1 placeholder | W7.D4-D5 (slide preview + PPTX export) |

## Architecture (planned)

Mirrors the Project 1 pattern with one key difference: the input is a dashboard fixture (KPIs + chart specs + sample rows), not a raw CSV. The streaming primitive (`@rishi/ai-core/replayFixture`) is reused, just consuming a narrative fixture instead of a profiling fixture.

PPTX generation will use `pptxgenjs` (or `pptx-automizer` for richer template control). Design-system tokens (colors, typography, spacing) get applied to slide backgrounds, headings, accent fills — so the output looks like it came from the same design team that built the live web app.

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

Vercel project lands in W6.D2 — production URL will follow the convention `ai-portfolio-narrative-generator.vercel.app`.
