/**
 * Wireframe-mode dataset loader.
 *
 * Parallel to `lib/full-datasets.ts` (which loads the 6 ad-hoc datasets) but
 * scoped to the 6 wireframe-mode datasets shipped in W5.D1. Kept as a
 * separate module so the existing ad-hoc /datasets gallery + /generate +
 * /dashboard flows stay completely untouched.
 *
 * The W5.D3 wireframe template engine reads from this loader to produce
 * data-driven wireframe layouts (replacing the 3 hand-coded templates).
 *
 * Same `FullDataset` + `ColumnSchema` types as the ad-hoc loader — the JSON
 * shape is identical, only the storage location differs.
 */

import manufacturing from '../../../fixtures/dashboard-factory/wireframe-datasets/manufacturing-throughput.json'
import realEstate from '../../../fixtures/dashboard-factory/wireframe-datasets/real-estate-pipeline.json'
import healthcare from '../../../fixtures/dashboard-factory/wireframe-datasets/healthcare-operations.json'
import education from '../../../fixtures/dashboard-factory/wireframe-datasets/education-enrollment.json'
import saas from '../../../fixtures/dashboard-factory/wireframe-datasets/saas-subscriptions.json'
import logistics from '../../../fixtures/dashboard-factory/wireframe-datasets/logistics-fleet.json'
import type { FullDataset } from './full-datasets'

const WIREFRAME_DATASETS: Record<string, FullDataset> = {
  'manufacturing-throughput': manufacturing as FullDataset,
  'real-estate-pipeline': realEstate as FullDataset,
  'healthcare-operations': healthcare as FullDataset,
  'education-enrollment': education as FullDataset,
  'saas-subscriptions': saas as FullDataset,
  'logistics-fleet': logistics as FullDataset,
}

export function getWireframeDataset(slug: string): FullDataset | undefined {
  return WIREFRAME_DATASETS[slug]
}

export function getAllWireframeSlugs(): string[] {
  return Object.keys(WIREFRAME_DATASETS)
}

export function getAllWireframeDatasets(): FullDataset[] {
  return Object.values(WIREFRAME_DATASETS)
}
