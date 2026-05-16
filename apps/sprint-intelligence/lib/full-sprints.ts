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

import sprint42 from '../../../fixtures/sprint-intelligence/sprints/sprint-42.json'
import sprint43 from '../../../fixtures/sprint-intelligence/sprints/sprint-43.json'
import sprint44 from '../../../fixtures/sprint-intelligence/sprints/sprint-44.json'
import sprint45 from '../../../fixtures/sprint-intelligence/sprints/sprint-45.json'
import type { ColorToken, SprintStatus } from './sprints'

// ============================================================
// Types
// ============================================================

export type TicketStatus =
  | 'todo'
  | 'in-progress'
  | 'in-review'
  | 'done'
  | 'blocked'

export type TicketType = 'story' | 'bug' | 'task' | 'spike'

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
  blockerNote?: string
}

export interface SprintMetadata {
  name: string
  goal: string
  startDate: string
  endDate: string
  status: SprintStatus
  colorToken: ColorToken
  summary: string
}

export interface BurndownSeries {
  ideal: number[]
  actual: (number | null)[]
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
}

// ============================================================
// Static import map. Webpack tree shakes unused entries per route.
// ============================================================

const FIXTURES: Record<string, SprintFixture> = {
  'sprint-42': sprint42 as SprintFixture,
  'sprint-43': sprint43 as SprintFixture,
  'sprint-44': sprint44 as SprintFixture,
  'sprint-45': sprint45 as SprintFixture,
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
