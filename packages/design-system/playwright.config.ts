import { defineConfig, devices } from '@playwright/test'

/**
 * Visual regression test config for @rishi/design-system primitives.
 *
 * Tests live in `tests/visual/` and exercise primitives via the
 * design-system-docs app (Project 0) at /primitives. The docs app is
 * always live on Vercel, so the default base URL points there and the
 * tests work without a local dev server.
 *
 * Local development:
 *   VISUAL_TEST_BASE_URL=http://localhost:3001 pnpm test:visual
 *   (requires pnpm --filter design-system-docs dev in another terminal)
 *
 * Updating snapshots after intentional design changes:
 *   pnpm test:visual --update-snapshots
 *
 * First-time setup on a fresh clone:
 *   pnpm install
 *   npx playwright install chromium
 *   pnpm test:visual --update-snapshots
 */
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.VISUAL_TEST_BASE_URL ?? 'https://ai-portfolio-design-system-docs.vercel.app',
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFileName}-{arg}{ext}',
  // Pixel-diff tolerance — the design-system-docs Vercel deploy can have
  // sub-pixel font rendering variance between deploys. 2% catches real
  // regressions while ignoring noise.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
})
