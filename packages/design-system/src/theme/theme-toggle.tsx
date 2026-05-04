'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './use-theme'
import { cn } from '../lib/cn'

interface ThemeToggleProps {
  /** Optional override for the wrapper class. */
  className?: string
  /** Override the rendered size of the icon (px). Defaults to 18. */
  iconSize?: number
}

/**
 * Theme toggle button. Mirrors the portfolio-site Navbar toggle: shows Sun
 * when in dark mode (clicking switches to light), Moon when in light mode
 * (clicking switches to dark). Uses lucide icons (already in design-system)
 * instead of `react-icons` to avoid duplicating the icon stack.
 *
 * Accessibility:
 *   - aria-label updates dynamically with current state
 *   - aria-pressed reflects whether dark mode is active (treated as the
 *     "default" toggled-on state since the design optimizes for dark)
 *   - Hover/focus rings come from the surrounding nav classes; this
 *     component is intentionally bare so the consumer's nav styling wins.
 */
export function ThemeToggle({ className, iconSize = 18 }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      {isDark ? (
        <Sun width={iconSize} height={iconSize} aria-hidden="true" />
      ) : (
        <Moon width={iconSize} height={iconSize} aria-hidden="true" />
      )}
    </button>
  )
}
