/**
 * Typed manifest reader for the dashboard-factory fixtures.
 *
 * Imports the JSON manifest at build time (Webpack inlines it) so the gallery
 * renders to static HTML. Individual dataset rows are NOT loaded here — those
 * lazy-load when a user clicks into a card and lands on /generate/[slug].
 */

import manifest from '../../../fixtures/dashboard-factory/datasets/index.json'
import {
  TrendingUp,
  Megaphone,
  Activity,
  Truck,
  FileWarning,
  Users,
  Factory,
  Home,
  Stethoscope,
  GraduationCap,
  Repeat,
  Plane,
  type LucideIcon,
} from 'lucide-react'

// ============================================================
// Types
// ============================================================

export interface DatasetSummary {
  id: string
  title: string
  tagline: string
  domain: string
  colorToken: ColorToken
  icon: string
  rowCount: number
  thumbnail: string
}

export interface DatasetManifest {
  version: string
  generatedAt: string
  datasets: DatasetSummary[]
}

export type ColorToken = 'accent' | 'purple' | 'blue' | 'amber' | 'rose' | 'teal' | 'emerald' | 'lime'

// ============================================================
// Manifest accessors
// ============================================================

export const datasetManifest = manifest as DatasetManifest
export const datasets: DatasetSummary[] = datasetManifest.datasets

export function getDataset(id: string): DatasetSummary | undefined {
  return datasets.find((d) => d.id === id)
}

// ============================================================
// Icon resolution — string name → Lucide component
// ============================================================

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Megaphone,
  Activity,
  Truck,
  FileWarning,
  Users,
  // W5.D1 — wireframe-mode dataset icons
  Factory,
  Home,
  Stethoscope,
  GraduationCap,
  Repeat,
  Plane,
}

export function getDatasetIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Activity
}

// ============================================================
// Color token → Tailwind class map
// IMPORTANT: All class names below are literal so Tailwind's JIT can detect them.
// Do NOT use template literals like `bg-${color}-500/20` — JIT cannot parse those.
// ============================================================

export interface ColorClassSet {
  /** Gradient background for the thumbnail block. */
  thumbBg: string
  /** Border color for the thumbnail. */
  thumbBorder: string
  /** Icon color. */
  iconColor: string
  /** Domain badge background. */
  badgeBg: string
  /** Domain badge text. */
  badgeText: string
  /** Domain badge border. */
  badgeBorder: string
}

// Each token now carries dark + light variants. The unprefixed classes
// are the light-mode defaults (darker Tailwind shades + stronger
// background opacities so the icon + tag read on a white card). The
// `dark:` variants preserve the original brighter `-300` text and `/10`
// opacity values that were designed for dark mode. The gallery cards
// continue to use thumbBg (the gradient) — only the detail-page icon
// containers should swap to the solid badgeBg + badgeBorder set, which
// is wired in the page components themselves.
const COLOR_CLASSES: Record<ColorToken, ColorClassSet> = {
  accent: {
    thumbBg: 'bg-gradient-to-br from-accent/25 via-accent/5 to-base-800',
    thumbBorder: 'border-accent/40 dark:border-accent/20',
    iconColor: 'text-accent',
    badgeBg: 'bg-accent/20 dark:bg-accent/10',
    badgeText: 'text-accent',
    badgeBorder: 'border-accent/50 dark:border-accent/30',
  },
  purple: {
    thumbBg: 'bg-gradient-to-br from-purple-500/25 via-purple-500/5 to-base-800',
    thumbBorder: 'border-purple-500/40 dark:border-purple-500/20',
    iconColor: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-100 dark:bg-purple-500/10',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-500/50 dark:border-purple-500/30',
  },
  blue: {
    thumbBg: 'bg-gradient-to-br from-blue-500/25 via-blue-500/5 to-base-800',
    thumbBorder: 'border-blue-500/40 dark:border-blue-500/20',
    iconColor: 'text-blue-700 dark:text-blue-300',
    badgeBg: 'bg-blue-100 dark:bg-blue-500/10',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-500/50 dark:border-blue-500/30',
  },
  amber: {
    thumbBg: 'bg-gradient-to-br from-amber-500/25 via-amber-500/5 to-base-800',
    thumbBorder: 'border-amber-500/40 dark:border-amber-500/20',
    iconColor: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-100 dark:bg-amber-500/10',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-500/50 dark:border-amber-500/30',
  },
  rose: {
    thumbBg: 'bg-gradient-to-br from-rose-500/25 via-rose-500/5 to-base-800',
    thumbBorder: 'border-rose-500/40 dark:border-rose-500/20',
    iconColor: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-100 dark:bg-rose-500/10',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-500/50 dark:border-rose-500/30',
  },
  teal: {
    thumbBg: 'bg-gradient-to-br from-teal-500/25 via-teal-500/5 to-base-800',
    thumbBorder: 'border-teal-500/40 dark:border-teal-500/20',
    iconColor: 'text-teal-700 dark:text-teal-300',
    badgeBg: 'bg-teal-100 dark:bg-teal-500/10',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-500/50 dark:border-teal-500/30',
  },
  // Emerald — a green hue 160° on the color wheel. Left in the map for
  // backward compatibility but no longer assigned to any card because at
  // 25% / 5% gradient opacity its 10° hue separation from the accent (teal,
  // 170°) collapses into a near-identical wash.
  emerald: {
    thumbBg: 'bg-gradient-to-br from-emerald-500/25 via-emerald-500/5 to-base-800',
    thumbBorder: 'border-emerald-500/40 dark:border-emerald-500/20',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-500/10',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-500/50 dark:border-emerald-500/30',
  },
  // Lime — yellow-green at 75° on the color wheel. Sits in the empty
  // 125° gap between amber (45°) and accent (170°), 95° from the brand
  // teal, so the gradient stays distinct from accent at the 25% / 5%
  // stops in both dark and light mode. Used as the 6th unique gradient
  // on /datasets, /wireframe, and /dashboards.
  lime: {
    thumbBg: 'bg-gradient-to-br from-lime-500/25 via-lime-500/5 to-base-800',
    thumbBorder: 'border-lime-500/40 dark:border-lime-500/20',
    iconColor: 'text-lime-700 dark:text-lime-300',
    badgeBg: 'bg-lime-100 dark:bg-lime-500/10',
    badgeText: 'text-lime-700 dark:text-lime-300',
    badgeBorder: 'border-lime-500/50 dark:border-lime-500/30',
  },
}

// Hex lookup for chart series colors. Each token resolves to a vibrant
// mid-shade that reads on both light and dark surfaces inside chart
// fills (line strokes, bar fills, dot markers, data labels). The accent
// token reuses the design-system accent hex so it tracks with the
// brand. Other tokens use their Tailwind palette -500 hex so the chart
// renders with the same family the icon and tag advertise.
export const HEX_BY_TOKEN: Record<ColorToken, string> = {
  accent: '#2dd4bf',
  purple: '#a78bfa',
  blue: '#60a5fa',
  amber: '#fbbf24',
  rose: '#fb7185',
  teal: '#2dd4bf',
  emerald: '#10b981',
  lime: '#84cc16',
}

export function getColorClasses(token: string): ColorClassSet {
  return COLOR_CLASSES[token as ColorToken] ?? COLOR_CLASSES.accent
}
