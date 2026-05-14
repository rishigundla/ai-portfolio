/**
 * Narrative fixture loader.
 *
 * Static-imports the 6 hand-curated narrative fixtures so each
 * /generate/[slug] page only ships its own narrative payload (webpack
 * tree-shakes the other 5). Mirror of Project 1's lib/full-datasets.ts
 * pattern.
 *
 * Fixture shape conforms to @rishi/ai-core's Fixture type so the
 * streaming primitive (replayFixture) consumes it directly.
 */

import type { Fixture } from '@rishi/ai-core'
import revopsQ3 from '../../../fixtures/narrative-generator/narratives/revops-q3-readout.json'
import marketingQ3 from '../../../fixtures/narrative-generator/narratives/marketing-q3-performance.json'
import opsUptime from '../../../fixtures/narrative-generator/narratives/ops-uptime-quality.json'
import financeQuarter from '../../../fixtures/narrative-generator/narratives/finance-quarter-close.json'
import hrEngagement from '../../../fixtures/narrative-generator/narratives/hr-engagement-attrition.json'
import cxCsatNps from '../../../fixtures/narrative-generator/narratives/cx-csat-nps.json'

// ============================================================
// Section heading markers
// ============================================================
//
// Each narrative is structured around 5 markdown section headings.
// The StreamingPanel watches for these markers in the streamed text
// to advance the per-section progress strip. The deck renderer (W7.D1)
// will use the same markers to split the narrative into slide chunks.

export const HEADING_HEADLINE = '## Headline'
export const HEADING_WHAT_MOVED = '## What moved'
export const HEADING_SO_WHAT = '## So what'
export const HEADING_TALKING_POINTS = '## Talking points'
export const HEADING_RISKS = '## Risks + caveats'

export const NARRATIVE_SECTIONS = [
  { id: 'headline', label: 'Headline', marker: HEADING_HEADLINE },
  { id: 'what-moved', label: 'What moved', marker: HEADING_WHAT_MOVED },
  { id: 'so-what', label: 'So what', marker: HEADING_SO_WHAT },
  { id: 'talking-points', label: 'Talking points', marker: HEADING_TALKING_POINTS },
  { id: 'risks', label: 'Risks + caveats', marker: HEADING_RISKS },
] as const

// ============================================================
// Fixture map — keyed by dashboard slug (not narrative slug)
// ============================================================

const NARRATIVES: Record<string, Fixture> = {
  'revops-q3-readout': revopsQ3 as Fixture,
  'marketing-q3-performance': marketingQ3 as Fixture,
  'ops-uptime-quality': opsUptime as Fixture,
  'finance-quarter-close': financeQuarter as Fixture,
  'hr-engagement-attrition': hrEngagement as Fixture,
  'cx-csat-nps': cxCsatNps as Fixture,
}

export function getNarrativeFixture(dashboardSlug: string): Fixture | undefined {
  return NARRATIVES[dashboardSlug]
}
