import { test, expect } from '@playwright/test'

/**
 * Visual regression baseline for the Dialog primitive.
 *
 * Why this test exists (W5.D4.4 receipt): an animate-slide-up keyframe
 * silently overwrote DialogContent's inline `translate(-50%, -50%)`
 * centering, sending every modal in the app to the bottom-right
 * quadrant. The bug was caught manually only after the user reported
 * "the popup isn't centered" — a screenshot test would have caught it
 * on the first deploy.
 *
 * Two assertions are intentional:
 *   1. Geometric centering — sharper than a pixel-diff for THIS specific
 *      class of bug. Checks that the dialog's left margin equals its
 *      right margin (and same for top/bottom) within 2px.
 *   2. Screenshot diff — catches future visual regressions on color,
 *      border, typography, animation final-frame state. 2% pixel-ratio
 *      tolerance handles sub-pixel font rendering variance across
 *      deploys.
 *
 * Snapshots live in tests/visual/__snapshots__/. Generate the baseline
 * with `pnpm test:visual --update-snapshots` the first time.
 */
test.describe('Dialog primitive', () => {
  test('opens centered on viewport with backdrop', async ({ page }) => {
    await page.goto('/primitives')
    await page.getByRole('button', { name: 'Open Dialog' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Wait for the dialog-show animation to settle so we capture the
    // resting-state geometry, not a mid-animation frame.
    await page.waitForTimeout(400)

    // Assertion 1 — geometric centering. This is the bug from W5.D4.4
    // captured as a regression test. Box symmetry around the viewport
    // center proves the translate(-50%, -50%) survived any animation.
    const box = await dialog.boundingBox()
    if (!box) throw new Error('Dialog has no bounding box')
    const viewport = page.viewportSize()
    if (!viewport) throw new Error('Page has no viewport size')

    const horizontalDelta = Math.abs(box.x - (viewport.width - (box.x + box.width)))
    const verticalDelta = Math.abs(box.y - (viewport.height - (box.y + box.height)))

    expect(horizontalDelta, 'dialog should be horizontally centered').toBeLessThanOrEqual(2)
    expect(verticalDelta, 'dialog should be vertically centered').toBeLessThanOrEqual(2)

    // Assertion 2 — pixel-diff snapshot for catch-all visual regression.
    // Tolerance is configured globally in playwright.config.ts.
    await expect(dialog).toHaveScreenshot('dialog-open.png')
  })
})
