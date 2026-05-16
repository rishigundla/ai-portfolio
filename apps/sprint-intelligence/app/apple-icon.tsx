import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
          color: '#07090f',
          fontWeight: 700,
          fontSize: 90,
          fontFamily: 'monospace',
          letterSpacing: -2,
        }}
      >
        SI
      </div>
    ),
    { ...size },
  )
}
