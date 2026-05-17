/**
 * Full sprint fixture loader.
 *
 * Static imports the four sprint JSONs so webpack tree shakes unused
 * sprints per route at build time. Each /sprint/[id] page loads only
 * its own sprint JSON in its bundle.
 *
 * The gallery at /sprints uses lib/sprints.ts (manifest only). This
 * module is heavier and should only be imported by routes that need
 * ticket level data.
 */

import jan2026 from '../../../fixtures/sprint-intelligence/sprints/jan-2026.json'
import feb2026 from '../../../fixtures/sprint-intelligence/sprints/feb-2026.json'
import mar2026 from '../../../fixtures/sprint-intelligence/sprints/mar-2026.json'
import apr2026 from '../../../fixtures/sprint-intelligence/sprints/apr-2026.json'
import may2026 from '../../../fixtures/sprint-intelligence/sprints/may-2026.json'
import jun2026 from '../../../fixtures/sprint-intelligence/sprints/jun-2026.json'
import type { SprintStatus } from './sprints'

// ============================================================
// Types
// ============================================================

export type TicketStatus =
  | 'todo'
  | 'in-progress'
  | 'in-review'
  | 'done'
  | 'blocked'

export type TicketType = 'bug' | 'development' | 'enhancement' | 'deployment'

export type TicketPriority = 'P0' | 'P1' | 'P2' | 'P3'

export interface TicketSpec {
  id: string
  title: string
  type: TicketType
  assignee: string
  status: TicketStatus
  priority: TicketPriority
  estimate: number
  labels: string[]
  addedMidSprint: boolean
  createdAt: string
  eta: string | null
  daysInStatus: number
  blockerNote?: string
}

export interface SprintMetadata {
  name: string
  goal: string
  startDate: string
  endDate: string
  status: SprintStatus
  summary: string
}

export interface BurndownSeries {
  ideal: number[]
  actual: (number | null)[]
}

export type CycleTimeTrend = 'improving' | 'flat' | 'rising'

export interface CycleTimeSeries {
  days: (number | null)[]
  teamBaseline: number
  trend: CycleTimeTrend
}

export type FilterableTicketStatus = TicketStatus | 'all'
export type FilterableTicketType = TicketType | 'all'

export interface ThroughputPerWeek {
  weekOne: number
  weekTwo: number
  priorAverage: number
}

export interface EngineerSprintData {
  personalCycleTime: number
}

export interface SprintFixture {
  id: string
  metadata: SprintMetadata
  scopePlanned: number
  scopeFinal: number
  tickets: TicketSpec[]
  burndown: BurndownSeries
  currentDay: number | null
  fourSprintBaseline: number
  velocity: number
  cycleTime: CycleTimeSeries
  throughputPerWeek: ThroughputPerWeek
  perEngineer: Record<string, EngineerSprintData>
}

// ============================================================
// Static import map. Webpack tree shakes unused entries per route.
// ============================================================

const FIXTURES: Record<string, SprintFixture> = {
  'jan-2026': jan2026 as SprintFixture,
  'feb-2026': feb2026 as SprintFixture,
  'mar-2026': mar2026 as SprintFixture,
  'apr-2026': apr2026 as SprintFixture,
  'may-2026': may2026 as SprintFixture,
  'jun-2026': jun2026 as SprintFixture,
}

export function getFullSprint(id: string): SprintFixture | undefined {
  return FIXTURES[id]
}

export function getAllFullSprints(): SprintFixture[] {
  return Object.values(FIXTURES)
}

// ============================================================
// Ticket grouping helpers used by the dashboard shell and KPI
// calculators in later days.
// ============================================================

export function ticketsByStatus(
  tickets: TicketSpec[],
): Record<TicketStatus, TicketSpec[]> {
  const empty: Record<TicketStatus, TicketSpec[]> = {
    todo: [],
    'in-progress': [],
    'in-review': [],
    done: [],
    blocked: [],
  }
  for (const t of tickets) {
    empty[t.status].push(t)
  }
  return empty
}

export function ticketsByAssignee(
  tickets: TicketSpec[],
): Record<string, TicketSpec[]> {
  const map: Record<string, TicketSpec[]> = {}
  for (const t of tickets) {
    const bucket = map[t.assignee] ?? []
    bucket.push(t)
    map[t.assignee] = bucket
  }
  return map
}

export function sumEstimates(tickets: TicketSpec[]): number {
  return tickets.reduce((acc, t) => acc + (t.estimate ?? 0), 0)
}
