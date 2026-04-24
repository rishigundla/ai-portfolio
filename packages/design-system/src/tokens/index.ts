/**
 * Typed token constants — programmatic access to the CSS variables.
 *
 * CSS variables are defined in ./index.css. Import that for styling:
 *   import '@rishi/design-system/tokens'
 *
 * This module is for inline styles, styled-components, and anywhere you need
 * the token reference as a JavaScript string.
 */

export const tokens = {
  color: {
    accent: 'var(--color-accent)',
    accentLight: 'var(--color-accent-light)',
    accentDark: 'var(--color-accent-dark)',
    accentGlow: 'var(--color-accent-glow)',
    accentGlowStrong: 'var(--color-accent-glow-strong)',

    base900: 'var(--color-base-900)',
    base800: 'var(--color-base-800)',
    base700: 'var(--color-base-700)',
    base600: 'var(--color-base-600)',

    surface: 'var(--color-surface)',
    surfaceHover: 'var(--color-surface-hover)',
    surfaceBorder: 'var(--color-surface-border)',
    surfaceElevated: 'var(--color-surface-elevated)',

    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    textMuted: 'var(--color-text-muted)',
    textDim: 'var(--color-text-dim)',

    statusNotStarted: 'var(--color-status-not-started)',
    statusInProgress: 'var(--color-status-in-progress)',
    statusCompleted: 'var(--color-status-completed)',
    statusBlocked: 'var(--color-status-blocked)',

    severitySev1: 'var(--color-severity-sev1)',
    severitySev2: 'var(--color-severity-sev2)',
    severitySev3: 'var(--color-severity-sev3)',
  },

  font: {
    display: 'var(--font-display)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
    serif: 'var(--font-serif)',
  },

  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
    '6xl': 'var(--font-size-6xl)',
    '7xl': 'var(--font-size-7xl)',
  },

  space: {
    0: 'var(--space-0)',
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    12: 'var(--space-12)',
    16: 'var(--space-16)',
    20: 'var(--space-20)',
    24: 'var(--space-24)',
  },

  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    full: 'var(--radius-full)',
  },

  duration: {
    instant: 'var(--duration-instant)',
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
    slower: 'var(--duration-slower)',
  },

  easing: {
    linear: 'var(--ease-linear)',
    in: 'var(--ease-in)',
    out: 'var(--ease-out)',
    inOut: 'var(--ease-in-out)',
    smooth: 'var(--ease-smooth)',
    elastic: 'var(--ease-elastic)',
  },

  shadow: {
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    glowSm: 'var(--shadow-glow-sm)',
    glowMd: 'var(--shadow-glow-md)',
    glowLg: 'var(--shadow-glow-lg)',
    card: 'var(--shadow-card)',
    cardHover: 'var(--shadow-card-hover)',
    focus: 'var(--shadow-focus)',
  },
} as const

export type DesignTokens = typeof tokens
export type ColorToken = keyof typeof tokens.color
export type FontToken = keyof typeof tokens.font
export type SpaceToken = keyof typeof tokens.space
export type DurationToken = keyof typeof tokens.duration
