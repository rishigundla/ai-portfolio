/**
 * Typed manifest reader for the sprint-intelligence fixtures.
 *
 * Imports the JSON manifest at build time (webpack inlines it) so the
 * gallery renders to static HTML. Individual sprint payloads are NOT
 * loaded here. Those static import via lib/full-sprints.ts when a user
 * lands on /sprint/[id].
 *
 * Same pattern as narrative-generator's lib/dashboards.ts split.
 */

import manifest from '../../../fixtures/sprint-intelligence/sprints/index.json'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
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
  | 'slate'

export type SprintStatus = 'completed' | 'in-progress' | 'planned'

export interface TeamMember {
  id: string
  name: string
  role: string
  capacity: number
}

export interface SprintSummary {
  id: string
  name: string
  monthLabel?: string
  tagline: string
  startDate: string
  endDate: string
  status: SprintStatus
  ticketCount: number
  /**
   * Optional per sprint color override. New monthly sprints rely on
   * status driven colors (see getStatusColorToken). Kept for back
   * compat with any older fixture that still ships a token.
   */
  colorToken?: ColorToken
}

export interface SprintManifest {
  version: string
  generatedAt: string
  team: TeamMember[]
  totalCapacity: number
  sprints: SprintSummary[]
}

// ============================================================
// Manifest accessors
// ============================================================

export const sprintManifest = manifest as SprintManifest
export const sprints: SprintSummary[] = sprintManifest.sprints
export const team: TeamMember[] = sprintManifest.team
export const totalCapacity: number = sprintManifest.totalCapacity

export function getSprintSummary(id: string): SprintSummary | undefined {
  return sprints.find((s) => s.id === id)
}

export function getAllSprintIds(): string[] {
  return sprints.map((s) => s.id)
}

export function getTeamMember(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id)
}

// ============================================================
// Status mapping
// ============================================================

const STATUS_ICONS: Record<SprintStatus, LucideIcon> = {
  completed: CheckCircle2,
  'in-progress': Activity,
  planned: Clock,
}

export function getSprintStatusIcon(status: SprintStatus): LucideIcon {
  return STATUS_ICONS[status] ?? AlertTriangle
}

export function getSprintStatusLabel(status: SprintStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'in-progress':
      return 'In progress'
    case 'planned':
      return 'Planned'
  }
}

// ============================================================
// Color token to Tailwind class map
// IMPORTANT: every class is a literal string so the Tailwind JIT
// picks them up at build time.
// ============================================================

export interface ColorClassSet {
  cardBg: string
  cardBorder: string
  iconColor: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  accentLine: string
}

const COLOR_CLASSES: Record<ColorToken, ColorClassSet> = {
  accent: {
    cardBg: 'bg-gradient-to-br from-accent/20 via-accent/5 to-base-800',
    cardBorder: 'border-accent/20',
    iconColor: 'text-accent',
    badgeBg: 'bg-accent/10',
    badgeText: 'text-accent',
    badgeBorder: 'border-accent/30',
    accentLine: 'bg-accent',
  },
  purple: {
    cardBg: 'bg-gradient-to-br from-purple-500/20 via-purple-500/5 to-base-800',
    cardBorder: 'border-purple-500/20',
    iconColor: 'text-purple-300',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
    accentLine: 'bg-purple-400',
  },
  blue: {
    cardBg: 'bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-base-800',
    cardBorder: 'border-blue-500/20',
    iconColor: 'text-blue-300',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
    accentLine: 'bg-blue-400',
  },
  amber: {
    cardBg: 'bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-base-800',
    cardBorder: 'border-amber-500/20',
    iconColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    accentLine: 'bg-amber-400',
  },
  rose: {
    cardBg: 'bg-gradient-to-br from-rose-500/20 via-rose-500/5 to-base-800',
    cardBorder: 'border-rose-500/20',
    iconColor: 'text-rose-300',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    accentLine: 'bg-rose-400',
  },
  teal: {
    cardBg: 'bg-gradient-to-br from-teal-500/20 via-teal-500/5 to-base-800',
    cardBorder: 'border-teal-500/20',
    iconColor: 'text-teal-300',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
    accentLine: 'bg-teal-400',
  },
  green: {
    cardBg: 'bg-gradient-to-br from-green-500/20 via-green-500/5 to-base-800',
    cardBorder: 'border-green-500/20',
    iconColor: 'text-green-300',
    badgeBg: 'bg-green-500/10',
    badgeText: 'text-green-300',
    badgeBorder: 'border-green-500/30',
    accentLine: 'bg-green-400',
  },
  slate: {
    cardBg: 'bg-gradient-to-br from-slate-500/15 via-slate-500/5 to-base-800',
    cardBorder: 'border-slate-500/30',
    iconColor: 'text-slate-300',
    badgeBg: 'bg-slate-500/10',
    badgeText: 'text-slate-200',
    badgeBorder: 'border-slate-500/40',
    accentLine: 'bg-slate-400',
  },
}

export function getColorClasses(token: ColorToken): ColorClassSet {
  return COLOR_CLASSES[token] ?? COLOR_CLASSES.accent
}

/**
 * Status driven color binding for sprint cards. Completed sprints are
 * green, in flight sprints are amber, planned sprints are slate.
 */
export function getStatusColorToken(status: SprintStatus): ColorToken {
  switch (status) {
    case 'completed':
      return 'green'
    case 'in-progress':
      return 'amber'
    case 'planned':
      return 'slate'
  }
}

// ============================================================
// Date formatting helpers
// ============================================================

export function formatSprintDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(s)} to ${fmt(e)}`
}

export function sprintDaysElapsed(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  const ms = e.getTime() - s.getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1)
}
