import { ImageResponse } from 'next/og'

/**
 * 180×180 apple-touch-icon. iOS uses this when a user adds the site to their
 * home screen. Same visual as the favicon but scaled up — typography reads
 * properly at this size and the rounded mask reads as a polished app icon.
 */

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0a0a0f',
          background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
          borderRadius: 36,
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
