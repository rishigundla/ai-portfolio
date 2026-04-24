import type { Config } from 'tailwindcss'

/**
 * Shared Tailwind config — apps import this as a preset.
 *
 * Usage in app's tailwind.config.ts:
 *   import baseConfig from '@rishi/design-system/tailwind.config'
 *   export default { presets: [baseConfig], content: ['./src/**\/*.{ts,tsx}'] }
 *
 * All colors map to CSS variables defined in src/tokens/colors.css.
 * Apps must import '@rishi/design-system/tokens' in their root CSS.
 */
const config: Config = {
  darkMode: 'class',
  content: [], // apps override this
  theme: {
    extend: {
      colors: {
        base: {
          900: 'var(--color-base-900)',
          800: 'var(--color-base-800)',
          700: 'var(--color-base-700)',
          600: 'var(--color-base-600)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
          glow: 'var(--color-accent-glow)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          border: 'var(--color-surface-border)',
          elevated: 'var(--color-surface-elevated)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          dim: 'var(--color-text-dim)',
        },
        status: {
          'not-started': 'var(--color-status-not-started)',
          'in-progress': 'var(--color-status-in-progress)',
          completed: 'var(--color-status-completed)',
          blocked: 'var(--color-status-blocked)',
        },
        severity: {
          sev1: 'var(--color-severity-sev1)',
          sev2: 'var(--color-severity-sev2)',
          sev3: 'var(--color-severity-sev3)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: 'var(--container-max)',
        wide: 'var(--container-wide)',
        narrow: 'var(--container-narrow)',
        prose: 'var(--content-max)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'grid-flow': 'gridFlow 20s linear infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        blink: 'blink 1s step-start infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(45, 212, 191, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gridFlow: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 16px rgba(45, 212, 191, 0.15)',
        'glow-md': '0 0 24px rgba(45, 212, 191, 0.15)',
        'glow-lg': '0 0 40px rgba(45, 212, 191, 0.35)',
        card: '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.02)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.25), 0 0 16px rgba(45, 212, 191, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
