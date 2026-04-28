import { renderSocialImage, OG_SIZE } from './_lib/og-renderer'

/**
 * Twitter card image. Same content + dimensions as the Open Graph image —
 * Twitter accepts the 1200×630 aspect via summary_large_image. Configs
 * declared inline (Next.js cannot detect re-exports of `runtime`/`size`).
 */

export const runtime = 'nodejs'
export const alt = 'Dashboard Factory · Dashboards in minutes, not days.'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function TwitterImage() {
  return renderSocialImage()
}
