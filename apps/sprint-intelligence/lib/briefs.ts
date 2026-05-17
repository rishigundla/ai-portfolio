/**
 * Meeting brief fixture loader.
 *
 * Static imports the four hand curated sprint briefs so each
 * /sprint/[id] page only ships its own brief payload (webpack tree
 * shakes the other three). Mirrors Project 2's lib/narratives.ts
 * pattern.
 *
 * Each fixture conforms to @rishi/ai-core's Fixture type so the
 * streaming primitive (replayFixture) consumes it directly in W9.D7.
 */

import type { Fixture } from '@rishi/ai-core'
import jan2026 from '../../../fixtures/sprint-intelligence/briefs/jan-2026.json'
import feb2026 from '../../../fixtures/sprint-intelligence/briefs/feb-2026.json'
import mar2026 from '../../../fixtures/sprint-intelligence/briefs/mar-2026.json'
import apr2026 from '../../../fixtures/sprint-intelligence/briefs/apr-2026.json'
import may2026 from '../../../fixtures/sprint-intelligence/briefs/may-2026.json'
import jun2026 from '../../../fixtures/sprint-intelligence/briefs/jun-2026.json'

// ============================================================
// Section heading markers
// ============================================================
//
// Each brief is structured around five markdown section headings.
// The StreamingPanel (W9.D7) watches for these markers to advance a
// per section progress strip.

export const HEADING_EXECUTIVE = '## Executive summary'
export const HEADING_HIGHLIGHTS = '## Highlights'
export const HEADING_WATCH = '## Watch list'
export const HEADING_RECOMMENDATIONS = '## Recommendations'
export const HEADING_TALKING_POINTS = '## Talking points'

export const BRIEF_SECTIONS = [
  { id: 'executive', label: 'Executive summary', marker: HEADING_EXECUTIVE },
  { id: 'highlights', label: 'Highlights', marker: HEADING_HIGHLIGHTS },
  { id: 'watch', label: 'Watch list', marker: HEADING_WATCH },
  { id: 'recommendations', label: 'Recommendations', marker: HEADING_RECOMMENDATIONS },
  { id: 'talking-points', label: 'Talking points', marker: HEADING_TALKING_POINTS },
] as const

// ============================================================
// Fixture map, keyed by sprint id
// ============================================================

const BRIEFS: Record<string, Fixture> = {
  'jan-2026': jan2026 as Fixture,
  'feb-2026': feb2026 as Fixture,
  'mar-2026': mar2026 as Fixture,
  'apr-2026': apr2026 as Fixture,
  'may-2026': may2026 as Fixture,
  'jun-2026': jun2026 as Fixture,
}

export function getBrief(sprintId: string): Fixture | undefined {
  return BRIEFS[sprintId]
}

export function getAllBriefs(): Fixture[] {
  return Object.values(BRIEFS)
}
