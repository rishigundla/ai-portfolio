# Visual regression tests — `@rishi/design-system`

Playwright screenshot tests for design-system primitives. The intent is to catch the class of bug from W5.D4.4 (Dialog centering overridden by an animation keyframe) and W5.D4.2 (`bg-accent/X` resolving to transparent) on the first deploy, not after a user reports them.

## What's covered today

- **Dialog** (`tests/visual/dialog.spec.ts`) — centered on viewport, geometric centering assertion + pixel-diff snapshot.

## Running

```bash
# First-time setup on a fresh clone
pnpm install
npx playwright install chromium

# Generate baseline snapshots (first run, or after intentional changes)
pnpm test:visual --update-snapshots

# Run tests against the deployed design-system-docs (default)
pnpm test:visual

# Run against a local dev server
VISUAL_TEST_BASE_URL=http://localhost:3001 pnpm test:visual
# (in another terminal: pnpm dev --filter design-system-docs)
```

## How tests target primitives

Tests exercise primitives via the design-system-docs app (Project 0). The docs app already has demos for every primitive, so the test harness is free — just navigate to `/primitives` or `/components` and click into the demo.

Default base URL is `https://ai-portfolio-design-system-docs.vercel.app` so tests work without spinning up a local server. Override via `VISUAL_TEST_BASE_URL` for local dev.

## Adding a test

1. Write the spec in `tests/visual/<primitive>.spec.ts`.
2. Use semantic queries (`page.getByRole`, `page.getByLabel`) — they survive markup refactors.
3. Pair geometric assertions (`boundingBox`, `getComputedStyle`) with screenshot diffs. Geometric assertions are sharper for known bug classes; screenshot diffs catch unknown future regressions.
4. Generate the baseline: `pnpm test:visual --update-snapshots`.
5. Commit the test + the `__snapshots__/*.png` files.

## CI integration (future)

Not wired today. Would land as a GitHub Action that runs `pnpm test:visual` against a deployed preview URL on every PR. Until then, run locally before pushing visual changes.
