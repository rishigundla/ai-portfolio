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
import sprint42 from '../../../fixtures/sprint-intelligence/briefs/sprint-42.json'
import sprint43 from '../../../fixtures/sprint-intelligence/briefs/sprint-43.json'
import sprint44 from '../../../fixtures/sprint-intelligence/briefs/sprint-44.json'
import sprint45 from '../../../fixtures/sprint-intelligence/briefs/sprint-45.json'

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
  'sprint-42': sprint42 as Fixture,
  'sprint-43': sprint43 as Fixture,
  'sprint-44': sprint44 as Fixture,
  'sprint-45': sprint45 as Fixture,
}

export function getBrief(sprintId: string): Fixture | undefined {
  return BRIEFS[sprintId]
}

export function getAllBriefs(): Fixture[] {
  return Object.values(BRIEFS)
}
