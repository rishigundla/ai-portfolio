# sprint-intelligence

**Project 03 of 5**. AI Sprint Intelligence Dashboard. Pick a synthetic sprint, the dashboard fills with team and individual KPIs, watch a streaming AI authored meeting brief land on top.

**Status**: Scaffold shipped (W9.D1). Production deploy in W10.D5.

## What it does

Three steps.

1. **Pick a sprint** from a curated library. Four synthetic sprints with different stories: a healthy sprint, a scope creep sprint, a blocked sprint, and a currently active sprint. Each has 8 engineers and 20 to 30 tickets with full status history.
2. **The dashboard fills**. Top of the page streams an AI authored meeting brief with executive summary, highlights, watch list, recommendations, and talking points. Middle of the page renders team level KPIs (burndown, velocity vs four sprint baseline, status distribution donut, blocked ticket count and aging, cycle time trend, throughput per week, scope creep tracker, carryover rate). Bottom of the page has a per engineer deep dive tab strip (workload score weighted by priority, completion rate, personal vs team cycle time, review bottleneck callout).
3. **Take it into the room**. The dashboard is the meeting prep, the AI brief is the talking points, no separate slide deck needed for the sprint review.

## Routes

| Route | Kind | Notes |
| --- | --- | --- |
| `/` | Static | Home with the three step product pitch |
| `/sprints` | Static | Gallery of four synthetic sprints |
| `/sprint/[id]` | SSG x 4 | Sprint detail with KPIs, deep dive tabs, and streaming brief |

## Architecture (planned)

```
fixtures/sprint-intelligence/
├── sprints/                       4 sprint JSON fixtures plus index.json manifest
└── briefs/                        4 narrative briefs paired with each sprint

apps/sprint-intelligence/lib/
├── sprints.ts                     Manifest loader, light, drives /sprints gallery
├── full-sprints.ts                Per id full fixture loader, tree shaken per route
└── kpi-calc.ts                    Burndown, velocity, cycle time helpers
```

**Shared with Projects 1 and 2**: the streaming primitive (`@rishi/ai-core/replayFixture`), `AiNarrativeBlock`, design system tokens.

**Unique to Project 3**: sprint specific KPI math, the per engineer deep dive layout, and the meeting brief narrative structure.

## Development

```bash
pnpm dev --filter sprint-intelligence
```

Runs at <http://localhost:3004>.
