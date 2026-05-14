/**
 * Typed manifest reader for the narrative-generator fixtures.
 *
 * Imports the JSON manifest at build time (Webpack inlines it) so the
 * gallery renders to static HTML. Individual dashboard payloads are NOT
 * loaded here — those static-import via lib/full-dashboards.ts when a
 * user lands on /generate/[slug] or /deck/[slug].
 *
 * Same pattern as dashboard-factory's lib/datasets.ts split.
 */

import manifest from '../../../fixtures/narrative-generator/dashboards/index.json'
import {
  TrendingUp,
  Megaphone,
  Activity,
  DollarSign,
  Users,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'

// ============================================================
// Types
// ============================================================

export type ColorToken =
  | 'accent'
  | 'purple'
  | 'blue'
  | 'amber'
  | 'rose'
  | 'teal'
  | 'green'

export interface DashboardSummary {
  id: string
  title: string
  tagline: string
  domain: string
  colorToken: ColorToken
  icon: string
  thumbnail: string
  kpiCount: number
  chartCount: number
  rowCount: number
}

export interface DashboardManifest {
  version: string
  generatedAt: string
  dashboards: DashboardSummary[]
}

// ============================================================
// Manifest accessors
// ============================================================

export const dashboardManifest = manifest as DashboardManifest
export const dashboards: DashboardSummary[] = dashboardManifest.dashboards

export function getDashboardSummary(id: string): DashboardSummary | undefined {
  return dashboards.find((d) => d.id === id)
}

export function getAllDashboardSlugs(): string[] {
  return dashboards.map((d) => d.id)
}

// ============================================================
// Icon resolution — string name → Lucide component
// ============================================================

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Megaphone,
  Activity,
  DollarSign,
  Users,
  MessageSquare,
}

export function getDashboardIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Activity
}

// ============================================================
// Color token → Tailwind class map
// IMPORTANT: All class names are literal strings so Tailwind's JIT can
// detect them at build time. Do NOT use template literals.
// ============================================================

export interface ColorClassSet {
  thumbBg: string
  thumbBorder: string
  iconColor: string
  badgeBg: string
  badgeText: string
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
  green: {
    thumbBg: 'bg-gradient-to-br from-green-500/25 via-green-500/5 to-base-800',
    thumbBorder: 'border-green-500/20',
    iconColor: 'text-green-300',
    badgeBg: 'bg-green-500/10',
    badgeText: 'text-green-300',
    badgeBorder: 'border-green-500/30',
  },
}

export function getColorClasses(token: ColorToken): ColorClassSet {
  return COLOR_CLASSES[token] ?? COLOR_CLASSES.accent
}
