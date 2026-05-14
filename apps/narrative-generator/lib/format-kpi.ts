/**
 * KPI value formatting + color-token resolution.
 *
 * Shared between the on-screen slide preview (_slide-preview.tsx) and
 * the server-side PPTX builder (build-pptx.ts) — both need to format
 * the same values the same way, so the formatter lives here as the
 * single source of truth.
 *
 * Also exports HEX_BY_TOKEN since the PPTX builder needs raw hex
 * strings (pptxgenjs doesn't resolve CSS variables — there's no
 * stylesheet at PPTX render time).
 */

import type { ColorToken } from './dashboards'
import type { KpiSpec } from './full-dashboards'

/**
 * Format a KPI value for display. Mirrors typical exec-readout
 * conventions: compact for big numbers ("$14.4M" not "$14,400,000"),
 * one decimal for percent + ratio + rating.
 */
export function formatKpiValue(kpi: KpiSpec): string {
  if (kpi.format === 'categorical' || typeof kpi.value !== 'number') {
    return String(kpi.value)
  }
  const v = kpi.value
  switch (kpi.format) {
    case 'currency': {
      const symbol = kpi.currency === 'USD' || !kpi.currency ? '$' : ''
      if (Math.abs(v) >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(1)}M`
      if (Math.abs(v) >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}K`
      return `${symbol}${v.toLocaleString()}`
    }
    case 'percent':
      return `${v.toFixed(1)}%`
    case 'duration':
      return `${v}${kpi.unit ? ' ' + kpi.unit : ''}`
    case 'ratio':
      return `${v.toFixed(1)}${kpi.unit ?? ''}`
    case 'rating':
      return `${v.toFixed(1)}${kpi.unit ? ' ' + kpi.unit : ''}`
    case 'score':
      return `${v}`
    case 'count': {
      if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
      if (Math.abs(v) >= 10_000) return `${(v / 1_000).toFixed(1)}K`
      return v.toLocaleString()
    }
    default:
      return String(v)
  }
}

/**
 * Color token → hex string. Used by the PPTX builder where CSS
 * variables aren't available. Values match the Tailwind palette
 * we use in the on-screen preview (Tailwind's *-400/*-500 shades
 * read as "accent" in dark mode UI).
 *
 * The 'accent' token uses the design-system accent (#2dd4bf =
 * teal-400, matches --color-accent in packages/design-system/src/
 * tokens/colors.css).
 */
export const HEX_BY_TOKEN: Record<ColorToken, string> = {
  accent: '#2dd4bf',
  purple: '#a78bfa',
  blue: '#60a5fa',
  amber: '#fbbf24',
  rose: '#fb7185',
  teal: '#2dd4bf',
  green: '#34d399',
}

/**
 * Format a KPI delta line ("↑ 12.4% vs Q2") for both the on-screen
 * preview and the PPTX. Returns null when the KPI has no delta.
 */
export function formatKpiDelta(kpi: KpiSpec): string | null {
  if (typeof kpi.deltaPct !== 'number' || !kpi.deltaDirection) return null
  const arrow = kpi.deltaDirection === 'up' ? '↑' : '↓'
  const window = kpi.deltaWindow ? ` ${kpi.deltaWindow}` : ''
  return `${arrow} ${kpi.deltaPct.toFixed(1)}%${window}`
}
