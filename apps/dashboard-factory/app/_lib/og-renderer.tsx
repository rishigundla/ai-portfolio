import { ImageResponse } from 'next/og'

/**
 * Shared 1200×630 social-preview renderer used by both
 * `app/opengraph-image.tsx` and `app/twitter-image.tsx`. Twitter accepts the
 * same OG aspect ratio so visual parity is the right default — but Next.js's
 * convention-file static analyzer can't follow re-exports of `runtime`/`size`,
 * so each entrypoint must declare those itself. This module exports just the
 * ImageResponse-returning function.
 *
 * Brand spec, all inlined — next/og has no stylesheet context:
 *   - background       #0a0a0f (base-900)
 *   - hero gradient    #5eead4 → #2dd4bf (accent-light → accent)
 *   - body text        #cbd5e1
 *   - muted footer     #94a3b8
 *   - typography       Space Grotesk Bold (fetched from Google Fonts)
 *
 * Font fetch falls back to system sans on any failure so a transient network
 * blip doesn't crash image generation.
 */

export const OG_SIZE = { width: 1200, height: 630 }

const FONT_URL =
  'https://fonts.gstatic.com/s/spacegrotesk/v15/V8mDoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.ttf'

async function loadSpaceGrotesk(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(FONT_URL)
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

export async function renderSocialImage() {
  const fontData = await loadSpaceGrotesk()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          background: '#0a0a0f',
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(45, 212, 191, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(94, 234, 212, 0.08) 0%, transparent 50%)',
          color: '#f1f5f9',
          fontFamily: 'SpaceGrotesk, system-ui, sans-serif',
        }}
      >
        {/* Top-left brand block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
              color: '#0a0a0f',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.05em',
            }}
          >
            DF
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#f1f5f9',
            }}
          >
            Dashboard Factory
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Hero title with gradient */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            backgroundImage: 'linear-gradient(90deg, #5eead4 0%, #2dd4bf 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Dashboards in minutes,
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#f1f5f9',
            marginTop: -8,
          }}
        >
          not days.
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            fontWeight: 400,
            color: '#cbd5e1',
            lineHeight: 1.4,
            maxWidth: 980,
          }}
        >
          Pick a sample dataset. Watch Claude profile it. Get a fully designed,
          interactive dashboard.
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: '#2dd4bf',
              }}
            />
            <span>Live · 6 datasets · 3 wireframe templates</span>
          </div>
          <div>Project 01 of 5 · AI portfolio for data engineering</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: fontData
        ? [
            {
              name: 'SpaceGrotesk',
              data: fontData,
              style: 'normal',
              weight: 700,
            },
          ]
        : undefined,
    },
  )
}
