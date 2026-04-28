import { renderSocialImage, OG_SIZE } from './_lib/og-renderer'

/**
 * Open Graph image. Inline config exports are required — Next.js's
 * convention-file static analyzer cannot follow re-exports of `runtime`,
 * `size`, etc. The renderer itself lives in _lib/og-renderer.tsx so the
 * Twitter card stays in lockstep without duplicating ~150 lines of JSX.
 */

export const runtime = 'nodejs'
export const alt = 'Dashboard Factory · Dashboards in minutes, not days.'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return renderSocialImage()
}
