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
 * Hydration-safe: both icons are always rendered; the `.dark` class on
 * <html> (set pre-paint by `<ThemeScript />`) drives a CSS-only swap via
 * Tailwind's `darkMode: 'class'`. This means server and client emit
 * identical DOM regardless of the user's stored preference, avoiding
 * React error #418 on light-mode page loads.
 *
 * Accessibility:
 *   - aria-label is fixed ("Toggle theme") rather than theme-conditioned,
 *     since theme-conditioned attributes would re-introduce a hydration
 *     mismatch. The visible icon already communicates state to sighted
 *     users; screen readers get a stable, equally-clear label.
 *   - The button is focusable and keyboard-activatable; focus-visible
 *     ring uses the accent color.
 *   - Hover/focus rings come from the surrounding nav classes; this
 *     component is intentionally bare so the consumer's nav styling wins.
 */
export function ThemeToggle({ className, iconSize = 18 }: ThemeToggleProps) {
  const { toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        'inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      <Sun
        width={iconSize}
        height={iconSize}
        aria-hidden="true"
        className="hidden dark:block"
      />
      <Moon
        width={iconSize}
        height={iconSize}
        aria-hidden="true"
        className="block dark:hidden"
      />
    </button>
  )
}
