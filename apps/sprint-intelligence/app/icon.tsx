import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          fontSize: 16,
          fontFamily: 'monospace',
          letterSpacing: -0.5,
        }}
      >
        SI
      </div>
    ),
    { ...size },
  )
}
