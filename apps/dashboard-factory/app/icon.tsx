import { ImageResponse } from 'next/og'

/**
 * 32×32 favicon. Next.js 15 App Router auto-wires this as `<link rel="icon">`
 * — no manual <head> entry needed. The PNG is generated at build time via
 * next/og's ImageResponse so the source stays inspectable as JSX rather than
 * shipping an opaque binary.
 *
 * Visual mirrors the Nav DF mark in apps/dashboard-factory/app/_components/Nav.tsx:
 * teal gradient (accent → accent-dark) with dark base text. Brand tokens are
 * inlined here because next/og can't resolve CSS variables — there is no
 * stylesheet context at image-render time.
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
        DF
      </div>
    ),
    {
      ...size,
    },
  )
}
