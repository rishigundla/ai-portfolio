/**
 * Profiling fixture loader and placeholder text generator.
 *
 * Primary path: each dataset has a hand-curated profiling fixture at
 * fixtures/dashboard-factory/profiling/<slug>.json (authored Day 5 via
 * Claude Code, referencing real column names + observed patterns).
 *
 * Fallback path: if a slug doesn't yet have a curated fixture (e.g. when
 * adding a new dataset), buildPlaceholderFixture() generates a domain-aware
 * stub from the dataset metadata so the streaming panel still works.
 *
 * The 4-heading structure (## Column Classification / Domain Inference /
 * Recommended KPIs / Recommended Charts) is what the client streaming
 * panel watches for to advance progress steps. Both curated and placeholder
 * fixtures must follow it.
 */

import type { Fixture } from '@rishi/ai-core'
import type { FullDataset } from './full-datasets'

// Curated fixtures imported statically so webpack tree-shakes per route.
import revopsSalesProfiling from '../../../fixtures/dashboard-factory/profiling/revops-sales.json'
import marketingCampaignsProfiling from '../../../fixtures/dashboard-factory/profiling/marketing-campaigns.json'
import pulseTelemetryProfiling from '../../../fixtures/dashboard-factory/profiling/pulse-telemetry.json'
import supplyChainProfiling from '../../../fixtures/dashboard-factory/profiling/supply-chain.json'
import financialComplaintsProfiling from '../../../fixtures/dashboard-factory/profiling/financial-complaints.json'
import customerDemographicsProfiling from '../../../fixtures/dashboard-factory/profiling/customer-demographics.json'

const CURATED_FIXTURES: Record<string, Fixture> = {
  'revops-sales': revopsSalesProfiling as Fixture,
  'marketing-campaigns': marketingCampaignsProfiling as Fixture,
  'pulse-telemetry': pulseTelemetryProfiling as Fixture,
  'supply-chain': supplyChainProfiling as Fixture,
  'financial-complaints': financialComplaintsProfiling as Fixture,
  'customer-demographics': customerDemographicsProfiling as Fixture,
}

/**
 * Returns the curated profiling fixture for a slug, or undefined if none exists.
 * Use as the primary path; pair with buildPlaceholderFixture() for fallback.
 */
export function getCuratedProfilingFixture(slug: string): Fixture | undefined {
  return CURATED_FIXTURES[slug]
}

/**
 * Convenience: curated fixture if available, else placeholder generated from dataset.
 * This is the function /generate/[slug]/page.tsx should call.
 */
export function getProfilingFixture(slug: string, dataset: FullDataset): Fixture {
  return getCuratedProfilingFixture(slug) ?? buildPlaceholderFixture(dataset)
}

// Heading markers — the streaming UI watches for these to advance progress steps.
// Keep these in sync with PROFILING_STEPS in the streaming panel.
export const HEADING_COLUMN_CLASSIFICATION = '## Column Classification'
export const HEADING_DOMAIN_INFERENCE = '## Domain Inference'
export const HEADING_KPI_RECOMMENDATIONS = '## Recommended KPIs'
export const HEADING_CHART_RECOMMENDATIONS = '## Recommended Charts'

const DOMAIN_LABELS: Record<string, string> = {
  sales: 'a Sales / Revenue Operations',
  marketing: 'a Marketing campaign performance',
  product: 'a Product telemetry / observability',
  operations: 'an Operations / Supply Chain',
  cx: 'a Customer Experience',
  finance: 'a Financial',
  hr: 'an HR / People Ops',
}

export function buildPlaceholderProfilingText(dataset: FullDataset): string {
  const { metadata, rows } = dataset
  const cols = metadata.schema
  const ids = cols.filter((c) => c.type === 'id')
  const dims = cols.filter((c) => c.type === 'dimension')
  const measures = cols.filter((c) => c.type === 'measure')
  const times = cols.filter((c) => c.type === 'time')

  const domainLabel = DOMAIN_LABELS[metadata.domain] ?? `a ${metadata.domain}`

  const topMeasures = measures.slice(0, 4).map((m) => `\`${m.label}\``).join(', ')
  const keyDims = dims.slice(0, 3).map((d) => `\`${d.label}\``).join(' · ')

  return `${HEADING_COLUMN_CLASSIFICATION}

I scanned **${rows.length} rows** across **${cols.length} columns** in your **${metadata.title}** dataset. Here's what I found:

- **${ids.length}** identifier column${ids.length === 1 ? '' : 's'} (${ids.map((c) => `\`${c.name}\``).join(', ') || ', '})
- **${dims.length}** dimension column${dims.length === 1 ? '' : 's'} for grouping (${keyDims}${dims.length > 3 ? ', and more' : ''})
- **${measures.length}** measure column${measures.length === 1 ? '' : 's'} for aggregation (${topMeasures}${measures.length > 4 ? ', and more' : ''})
- **${times.length}** time column${times.length === 1 ? '' : 's'} for trend analysis

${HEADING_DOMAIN_INFERENCE}

This looks like **${domainLabel}** dataset. The combination of ${keyDims || 'these dimensions'} alongside ${topMeasures || 'these measures'} is a strong signal that the natural unit of analysis is the ${ids[0]?.label.toLowerCase() ?? 'record'}.

For dashboards, this means the audience is most likely **${getAudience(metadata.domain)}**, and the questions they'll want answered are around **${getQuestions(metadata.domain)}**.

${HEADING_KPI_RECOMMENDATIONS}

Based on the column types and inferred domain, I'd track:

${measures
  .slice(0, 5)
  .map((m, i) => {
    const pre = ['Total', 'Average', 'Top-performing', 'Distribution of', 'Trend in'][i] ?? 'Total'
    const agg = m.aggregation === 'avg' ? 'average' : m.aggregation === 'sum' ? 'total' : (m.aggregation ?? 'sum')
    return `- **${pre} ${m.label.toLowerCase()}**, ${agg}${dims[0] ? ` by \`${dims[0].label}\`` : ''}`
  })
  .join('\n')}

These five give you the at-a-glance answer to "is this dataset healthy?" without drilling into specific cohorts.

${HEADING_CHART_RECOMMENDATIONS}

For this layout I recommend four chart types:

1. **KPI cards** at the top for the headline measures, ${topMeasures}
2. **Bar chart** comparing ${measures[0]?.label.toLowerCase() ?? 'a key measure'} by \`${dims[0]?.label ?? 'dimension'}\`
3. **Line chart** over time using ${times[0] ? `\`${times[0].label}\`` : 'the time column'} to spot trends
4. **Donut chart** showing the distribution of \`${dims[1]?.label ?? dims[0]?.label ?? 'a categorical dimension'}\`

Bar + line + donut covers ~80% of analytical questions for this domain. Drill-downs and detail tables can sit below the fold.`
}

function getAudience(domain: string): string {
  switch (domain) {
    case 'sales':
      return 'RevOps leadership, sales managers, and channel partners'
    case 'marketing':
      return 'CMO and demand-generation team'
    case 'product':
      return 'product managers and SRE / platform reliability teams'
    case 'operations':
      return 'supply chain ops, procurement leads, and CFO'
    case 'cx':
      return 'CX leadership and customer success teams'
    default:
      return 'business stakeholders'
  }
}

function getQuestions(domain: string): string {
  switch (domain) {
    case 'sales':
      return 'pipeline health, segment / region attribution, and deal stage progression'
    case 'marketing':
      return 'channel effectiveness, spend efficiency, and conversion outcomes'
    case 'product':
      return 'usage trends, customer health, and reliability hotspots'
    case 'operations':
      return 'supplier reliability, fulfillment velocity, and cost control'
    case 'cx':
      return 'segment-level satisfaction, churn risk, and lifetime value drivers'
    default:
      return 'performance, comparison, and trend'
  }
}

/**
 * Wrap the generated text in the @rishi/ai-core Fixture shape so it can be
 * passed straight into replayFixture.
 */
export function buildPlaceholderFixture(dataset: FullDataset): Fixture {
  return {
    id: `${dataset.id}-profiling-placeholder`,
    text: buildPlaceholderProfilingText(dataset),
    metadata: {
      generatedAt: new Date().toISOString(),
      model: 'placeholder',
      notes: 'Day 4 placeholder. Day 5 replaces with hand-curated fixtures.',
    },
  }
}
