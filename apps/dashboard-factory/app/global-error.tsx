'use client'

import * as React from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Last-resort error boundary. Catches errors thrown in the root layout itself
 * (e.g., a metadata function blew up, or a font import failed at runtime).
 * Replaces the entire <html>/<body> tree, so we can NOT rely on globals.css,
 * Tailwind classes, or any layout chrome — those all live inside the root
 * layout that just failed to render.
 *
 * Inline styles only. Self-contained <html>/<body>.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#0a0e1a',
          color: '#f1f5f9',
          fontFamily:
            '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '36rem', textAlign: 'center' }}>
          <div
            style={{
              fontFamily:
                '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#fb7185',
              marginBottom: '1rem',
            }}
          >
            Critical · root render failed
          </div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: '0 0 1.5rem 0',
            }}
          >
            Something broke at the root.
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              margin: '0 0 1rem 0',
            }}
          >
            The page failed to render. This usually means a deploy regressed or a transient build
            error. Reloading the page should recover it.
          </p>
          {error.digest && (
            <p
              style={{
                fontFamily:
                  '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: '0 0 2rem 0',
              }}
            >
              Reference: <span style={{ color: '#cbd5e1' }}>{error.digest}</span>
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#2dd4bf',
              color: '#0a0e1a',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
