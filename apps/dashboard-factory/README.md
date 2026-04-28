# dashboard-factory

**Project 01 of 5** — Instant Analytics Dashboard Factory.

Pick a sample dataset. Watch Claude profile it via streaming. Get a fully designed interactive dashboard.

## Two modes

### Ad-hoc dashboard (Persona A — Business User)

> "My VP wants Q3 vs Q2 regional sales for Monday's leadership meeting. I have a CSV. I don't want to file a BI ticket."

Pick from 6 curated sample datasets, watch streaming AI profiling explain column types and business domain, get an interactive dashboard with filters / drill-downs / PDF export.

### Hi-fi wireframe (Persona B — BI Engineer / Power User)

> "I'm kicking off a new CX dashboard project. I need a clickable hi-fi mockup for Monday's discovery session, but I don't want to spend a week in Figma first."

Pick a layout template (Executive / Operational / Exploratory), get a fully designed clickable mockup themed to the design system. Export to Figma for stakeholder refinement.

## Routes (build order)

| Route | Status | Day |
|-------|--------|-----|
| `/` | **Built** | Week 2 Day 1 |
| `/datasets` | Pending — dataset gallery | Week 2 Day 3 |
| `/generate/[slug]` | Pending — streaming profiling | Week 2 Day 4 |
| `/dashboard/[slug]` | Pending — interactive dashboard | Week 3 Day 1-3 |
| `/wireframe/[template]` | Pending — wireframe mode | Week 3 Day 5 |

## Sample datasets (planned)

1. **RevOps Sales** — ACV / GRR / segment / region (50 rows)
2. **Marketing Campaigns** — campaign / channel / spend / ROI
3. **Pulse Telemetry** — Atlas/Orion/Vega product telemetry
4. **Supply Chain**
5. **Financial Complaints**
6. **Customer Demographics**

Fixtures will live under [`fixtures/dashboard-factory/`](../../fixtures/dashboard-factory/).

## Development

```bash
# from repo root
pnpm dev --filter dashboard-factory
# or from this directory
pnpm dev
```

Runs at http://localhost:3002.

## Deployment

Once `portfolio.meta.json#deployedAt` is set, the Week 4 sync automation will open PRs on `rishigundla/portfolio-site` and `rishigundla/resume-builder` to add this project's card and bullet automatically.
