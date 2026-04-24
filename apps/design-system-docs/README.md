# design-system-docs

Live showcase for [`@rishi/design-system`](../../packages/design-system/). Tokens, primitives, and AI-specific components documented with interactive examples.

## Pages

- `/` — Hero + catalog + install snippet
- `/tokens` — Color swatches, typography, motion, shadows, status palettes
- `/primitives` — All 14 primitives with live variants (Button, Card, Dialog, Tabs, etc.)
- `/components` — AI components with interactive demos including AiNarrativeBlock streaming simulation

## Development

```bash
# from repo root
pnpm dev --filter design-system-docs
# or from this directory
pnpm dev
```

Runs at http://localhost:3001.

## Build

```bash
pnpm build
```

## Deployment

Deployed to Vercel when connected to the GitHub repo. `portfolio.meta.json` will be populated with `liveUrl` and `deployedAt` once the first deploy succeeds, triggering the portfolio + resume sync automation.
