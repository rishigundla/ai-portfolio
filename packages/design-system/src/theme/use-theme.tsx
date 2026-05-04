'use client'

import * as React from 'react'
import { STORAGE_KEY } from './storage-key'

/**
 * Theme state for the AI Portfolio apps.
 *
 * The system mirrors the portfolio-site (rishikeshgundla.com) implementation
 * intentionally so toggling between project sites feels like a single brand
 * surface. The applied class on `<html>` is `'dark'` or `'light'`; the design-
 * system's `colors.css` already declares both palettes scoped to those classes.
 *
 * The `<ThemeScript />` component (separate file) sets the class BEFORE first
 * paint via an inline script so we don't get a flash of the wrong theme on
 * the first render. This Provider then reads what the script set and uses it
 * as the initial state.
 *
 * STORAGE_KEY itself lives in `./storage-key` (no `'use client'`) so server
 * components like `<ThemeScript />` can import the same constant without
 * tripping Next.js's client-boundary guard, which would otherwise replace the
 * import with a runtime-throwing function whose stringified message contains
 * apostrophes that break inline single-quoted script literals.
 */

export { STORAGE_KEY }
export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (next: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  // Mirror what ThemeScript wrote to <html>. If neither class is present yet
  // (e.g. ThemeScript was skipped), fall back to localStorage, then dark.
  const root = document.documentElement
  if (root.classList.contains('light')) return 'light'
  if (root.classList.contains('dark')) return 'dark'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // localStorage may be blocked in some environments; ignore.
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(readInitialTheme)

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook for reading + toggling the current theme.
 *
 * Must be used inside `<ThemeProvider />`. Throws otherwise so a misconfigured
 * tree doesn't render with an undefined theme silently.
 */
export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider />')
  }
  return ctx
}
