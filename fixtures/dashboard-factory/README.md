# Dashboard Factory · Fixtures

Pre-generated demo data for **Project 01 — Instant Analytics Dashboard Factory**.

## Structure

```
fixtures/dashboard-factory/
├── datasets/
│   ├── index.json                      Manifest — list of all datasets with summaries
│   ├── revops-sales.json               40 rows · Sales domain · accent color
│   ├── marketing-campaigns.json        36 rows · Marketing domain · purple color
│   ├── pulse-telemetry.json            42 rows · Product domain · blue color
│   ├── supply-chain.json               38 rows · Operations domain · amber color
│   ├── financial-complaints.json       36 rows · CX domain · rose color
│   └── customer-demographics.json      38 rows · CX domain · teal color
└── README.md                           This file
```

## Per-dataset JSON shape

```jsonc
{
  "id": "revops-sales",
  "metadata": {
    "title": "RevOps Sales SSOT",
    "tagline": "...",
    "domain": "sales",
    "colorToken": "accent",
    "icon": "TrendingUp",
    "thumbnail": "/datasets/revops-sales.png",
    "rowCount": 40,
    "currency": "USD",
    "schema": [
      { "name": "deal_id", "type": "id", "label": "Deal ID" },
      { "name": "segment", "type": "dimension", "label": "Segment", "values": [...] },
      { "name": "acv_usd", "type": "measure", "label": "ACV", "unit": "$", "aggregation": "sum" },
      ...
    ]
  },
  "rows": [
    { "deal_id": "DL-26-0001", "segment": "Enterprise", ... },
    ...
  ]
}
```

## Schema column types

The `schema` array describes each column so the gallery + profiling can render correctly without LLM inference at runtime:

- `id` — unique identifier (deal_id, customer_id, etc.)
- `dimension` — categorical with optional `values` array for known sets
- `measure` — numeric with `unit` ($, %, ms, etc.) and `aggregation` (sum / avg)
- `time` — date or timestamp

## Realism notes

These fixtures are **anonymised but realistic**. Patterns chosen deliberately:

- **Nutanix-style products** (NAI, NC2, NCI, Files, Move) appear in RevOps + Pulse datasets — recognizable to anyone who has worked in modern cloud infrastructure.
- **Segment / Region distributions** match enterprise SaaS norms (~60% NAMER, ~25% EMEA, ~10% APAC, ~5% LATAM).
- **Pulse telemetry** shows a realistic story: customer CUST-2847 (Acme Corp) ramps NAI usage week-over-week, with health_score gradually declining from 96 → 82 as load increases. This is what a real product team would see right before scaling concerns.
- **Financial complaints** mix products + outcomes the way real CFPB-style data does — Mortgage / Credit Card / Banking lead by volume, fraud complaints have fastest resolution times, mortgage modifications have longest.

## Consumers

| Day | Consumer | Usage |
|-----|----------|-------|
| Week 2 Day 3 | `apps/dashboard-factory/app/datasets/page.tsx` | Reads `index.json` to render the gallery |
| Week 2 Day 4 | `apps/dashboard-factory/app/generate/[slug]/page.tsx` | Reads `<slug>.json` for dataset preview during streaming |
| Week 2 Day 5 | Profiling fixture generation script | Uses dataset rows + schema to generate AI profiling output |
| Week 3 Days 1-3 | `apps/dashboard-factory/app/dashboard/[slug]/page.tsx` | Reads `<slug>.json` rows to render the actual interactive dashboard |

## Adding a new dataset

1. Create `datasets/<new-slug>.json` matching the shape above
2. Append a summary entry to `datasets/index.json` (keep it alphabetical or by curation priority)
3. Update profiling fixtures in `fixtures/dashboard-factory/profiling/<new-slug>.json` (Day 5)
4. Optionally add a thumbnail to `apps/dashboard-factory/public/datasets/<new-slug>.png`

The gallery and profiling code never need to change.
