import { ImageResponse } from 'next/og'

/**
 * 32×32 favicon. Next.js 15 App Router auto-wires this as `<link rel="icon">`
 * — no manual <head> entry needed. The PNG is generated at build time via
 * next/og's ImageResponse.
 *
 * Visual mirrors the Nav NG mark in app/_components/Nav.tsx:
 * teal gradient (accent → accent-dark) with dark base text. Brand tokens
 * are inlined here because next/og can't resolve CSS variables — there
 * is no stylesheet context at image-render time.
 *
 * Without this file (and apple-icon.tsx), every route on the deployed
 * app logs a /favicon.ico 404 to the console, which Lighthouse counts
 * as a `errors-in-console` failure — knocking Best Practices to 96.
 * Added in W6.D6 polish pass after the Lighthouse audit surfaced it.
 */

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0a0a0f',
          background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
          borderRadius: 6,
        }}
      >
        NG
      </div>
    ),
    {
      ...size,
    },
  )
}
