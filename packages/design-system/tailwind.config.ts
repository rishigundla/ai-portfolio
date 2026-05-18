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
          // base-900 uses the RGB-triplet form so `bg-base-900/85` (used by
          // the sticky nav backdrop) resolves to a translucent dark layer.
          // Other base-* values are solid-only and stay on the hex var.
          900: 'rgb(var(--color-base-900-rgb) / <alpha-value>)',
          800: 'var(--color-base-800)',
          700: 'var(--color-base-700)',
          600: 'var(--color-base-600)',
        },
        accent: {
          // accent + accent-light use the RGB-triplet form so every
          // `bg-accent/X` and `border-accent/X` utility across the app
          // actually renders. accent-dark + accent-glow are solid-only.
          // See packages/design-system/src/tokens/colors.css for the
          // dual-track pattern rationale.
          DEFAULT: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light-rgb) / <alpha-value>)',
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
          // status-completed uses RGB-triplet form for the streaming-panel
          // success-state badge background (bg-status-completed/10).
          completed: 'rgb(var(--color-status-completed-rgb) / <alpha-value>)',
          blocked: 'var(--color-status-blocked)',
        },
        severity: {
          sev1: 'var(--color-severity-sev1)',
          sev2: 'var(--color-severity-sev2)',
          sev3: 'var(--color-severity-sev3)',
        },
        // Chart palette — theme-aware fills for Sprint Intelligence charts,
        // heatmap cells, and KPI tile accents. Dark-mode values are the
        // pre-W10.D15 hard-coded shades; light-mode values are darker
        // saturated equivalents defined in colors.css.
        chart: {
          emerald: 'rgb(var(--chart-emerald-rgb) / <alpha-value>)',
          amber: 'rgb(var(--chart-amber-rgb) / <alpha-value>)',
          violet: 'rgb(var(--chart-violet-rgb) / <alpha-value>)',
          rose: 'rgb(var(--chart-rose-rgb) / <alpha-value>)',
          slate: 'rgb(var(--chart-slate-rgb) / <alpha-value>)',
          blue: 'rgb(var(--chart-blue-rgb) / <alpha-value>)',
          indigo: 'rgb(var(--chart-indigo-rgb) / <alpha-value>)',
        },
        'heatmap-empty': 'rgb(var(--heatmap-empty-rgb) / <alpha-value>)',
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
        // Dialog-specific entrance that preserves the translate(-50%,-50%)
        // centering applied to DialogContent. Plain slide-up overwrites the
        // translate at the final keyframe and ends up bottom-right of viewport.
        'dialog-show': 'dialogContentShow 0.25s ease-out forwards',
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
        // Composite transform keeps the centering translate while sliding
        // up. Without these explicit translate-x/y, the animation's final
        // keyframe overrides the inline `translate(-50%, -50%)` that
        // DialogContent uses for centering.
        dialogContentShow: {
          '0%': { opacity: '0', transform: 'translate(-50%, calc(-50% + 8px))' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%)' },
        },
        pulseGlow: {
          // Themed via the accent RGB triplet so the glow tracks the
          // active theme (dark teal-400, light teal-600). Mirrors the
          // portfolio-site pulseGlow keyframe.
          '0%, 100%': { boxShadow: '0 0 20px rgb(var(--color-accent-rgb) / 0.3)' },
          '50%': { boxShadow: '0 0 40px rgb(var(--color-accent-rgb) / 0.6)' },
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
        // Glow tokens route through the accent RGB triplet so the glow
        // re-themes between dark (teal-400) and light (teal-600). The
        // `card` shadow stays neutral (no accent component) and is left
        // untouched. The `card-hover` shadow keeps its neutral drop
        // shadow plus an accent-tinted halo that now themes.
        'glow-sm': '0 0 16px rgb(var(--color-accent-rgb) / 0.15)',
        'glow-md': '0 0 24px rgb(var(--color-accent-rgb) / 0.15)',
        'glow-lg': '0 0 40px rgb(var(--color-accent-rgb) / 0.35)',
        card: '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.02)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.25), 0 0 16px rgb(var(--color-accent-rgb) / 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
