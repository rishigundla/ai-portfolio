/**
 * Wireframe-mode profiling fixture loader.
 *
 * Parallel to lib/profiling.ts (which serves the 6 ad-hoc datasets) but
 * scoped to the 6 wireframe-mode datasets shipped in W5.D1. Kept as a
 * separate module so the existing ad-hoc flows stay untouched and the
 * wireframe stack (W5.D3's template engine) can resolve fixtures from
 * its own registry.
 *
 * Same Fixture shape as the ad-hoc fixtures: { id, text, metadata }.
 * The 4-heading structure (## Column Classification / Domain Inference /
 * Recommended KPIs / Recommended Charts) matches the heading constants
 * in lib/profiling.ts so any streaming UI watching for those markers
 * (current or future) advances correctly on either fixture set.
 */

import type { Fixture } from '@rishi/ai-core'

import manufacturingProfiling from '../../../fixtures/dashboard-factory/wireframe-profiling/manufacturing-throughput.json'
import realEstateProfiling from '../../../fixtures/dashboard-factory/wireframe-profiling/real-estate-pipeline.json'
import healthcareProfiling from '../../../fixtures/dashboard-factory/wireframe-profiling/healthcare-operations.json'
import educationProfiling from '../../../fixtures/dashboard-factory/wireframe-profiling/education-enrollment.json'
import saasProfiling from '../../../fixtures/dashboard-factory/wireframe-profiling/saas-subscriptions.json'
import logisticsProfiling from '../../../fixtures/dashboard-factory/wireframe-profiling/logistics-fleet.json'

const WIREFRAME_PROFILING: Record<string, Fixture> = {
  'manufacturing-throughput': manufacturingProfiling as Fixture,
  'real-estate-pipeline': realEstateProfiling as Fixture,
  'healthcare-operations': healthcareProfiling as Fixture,
  'education-enrollment': educationProfiling as Fixture,
  'saas-subscriptions': saasProfiling as Fixture,
  'logistics-fleet': logisticsProfiling as Fixture,
}

/**
 * Returns the curated wireframe profiling fixture for a slug, or undefined
 * when the slug isn't a registered wireframe dataset. W5.D3's template
 * engine pairs this with the dataset loader to materialize per-dataset
 * chart picks.
 */
export function getWireframeProfilingFixture(slug: string): Fixture | undefined {
  return WIREFRAME_PROFILING[slug]
}

export function getAllWireframeProfilingSlugs(): string[] {
  return Object.keys(WIREFRAME_PROFILING)
}
