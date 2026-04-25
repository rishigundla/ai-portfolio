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

export type ColorToken = 'accent' | 'purple' | 'blue' | 'amber' | 'rose' | 'teal'

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

const COLOR_CLASSES: Record<ColorToken, ColorClassSet> = {
  accent: {
    thumbBg: 'bg-gradient-to-br from-accent/25 via-accent/5 to-base-800',
    thumbBorder: 'border-accent/20',
    iconColor: 'text-accent',
    badgeBg: 'bg-accent/10',
    badgeText: 'text-accent',
    badgeBorder: 'border-accent/30',
  },
  purple: {
    thumbBg: 'bg-gradient-to-br from-purple-500/25 via-purple-500/5 to-base-800',
    thumbBorder: 'border-purple-500/20',
    iconColor: 'text-purple-300',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
  },
  blue: {
    thumbBg: 'bg-gradient-to-br from-blue-500/25 via-blue-500/5 to-base-800',
    thumbBorder: 'border-blue-500/20',
    iconColor: 'text-blue-300',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
  },
  amber: {
    thumbBg: 'bg-gradient-to-br from-amber-500/25 via-amber-500/5 to-base-800',
    thumbBorder: 'border-amber-500/20',
    iconColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
  },
  rose: {
    thumbBg: 'bg-gradient-to-br from-rose-500/25 via-rose-500/5 to-base-800',
    thumbBorder: 'border-rose-500/20',
    iconColor: 'text-rose-300',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
  },
  teal: {
    thumbBg: 'bg-gradient-to-br from-teal-500/25 via-teal-500/5 to-base-800',
    thumbBorder: 'border-teal-500/20',
    iconColor: 'text-teal-300',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
  },
}

export function getColorClasses(token: string): ColorClassSet {
  return COLOR_CLASSES[token as ColorToken] ?? COLOR_CLASSES.accent
}
