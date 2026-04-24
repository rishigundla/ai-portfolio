/**
 * Dev-only Anthropic SDK client for generating fixtures programmatically.
 *
 * IMPORTANT: This is NOT called at runtime by any deployed app. It exists
 * so Rishi can optionally batch-generate fixtures via the Anthropic API
 * during development, as an alternative to manual curation through Claude Code.
 *
 * Setup:
 *   1. Set ANTHROPIC_API_KEY in .env.local (never commit)
 *   2. Write a scripts/generate-fixtures/*.ts entry using generateFixture()
 *   3. Run via pnpm tsx — output JSON, save to fixtures/ manually, commit
 *
 * Because this module imports @anthropic-ai/sdk it should never be imported
 * from an app's runtime code path. Guard with NODE_ENV checks if uncertain.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { Fixture, Scenario } from './types/index'

export interface GenerateConfig {
  /** Anthropic API key. Defaults to process.env.ANTHROPIC_API_KEY. */
  apiKey?: string
  /** Claude model. Default: 'claude-sonnet-4-6' (best balance for narrative generation). */
  model?: string
  /** Max response tokens. Default: 4096. */
  maxTokens?: number
  /** System prompt. Cached via prompt caching when set. */
  system?: string
  /** Sampling temperature (0-1). Default: 0.7. */
  temperature?: number
  /** Enable Anthropic prompt caching on the system prompt (90% discount on repeats). */
  cacheSystemPrompt?: boolean
}

const DEFAULT_MODEL = 'claude-sonnet-4-6'
const DEFAULT_MAX_TOKENS = 4096
const DEFAULT_TEMPERATURE = 0.7

/**
 * Generate a single Fixture from a Scenario by calling the Anthropic API.
 *
 * Usage in a dev script:
 *   const fixture = await generateFixture(
 *     { id: 'emea-firmware-drop', title: 'EMEA firmware anomaly', ... },
 *     'Analyze this anomaly: ...',
 *     { system: ANOMALY_RCA_SYSTEM_PROMPT, cacheSystemPrompt: true }
 *   )
 *   await fs.writeFile(`fixtures/anomaly-alerting/${fixture.id}.json`, JSON.stringify(fixture, null, 2))
 */
export async function generateFixture(
  scenario: Scenario,
  userPrompt: string,
  config: GenerateConfig = {},
): Promise<Fixture> {
  const apiKey = config.apiKey ?? process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY not set. Set it in .env.local or pass config.apiKey.',
    )
  }

  const client = new Anthropic({ apiKey })
  const model = config.model ?? DEFAULT_MODEL

  const systemBlocks = config.system
    ? config.cacheSystemPrompt
      ? [{ type: 'text' as const, text: config.system, cache_control: { type: 'ephemeral' as const } }]
      : config.system
    : undefined

  const response = await client.messages.create({
    model,
    max_tokens: config.maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: config.temperature ?? DEFAULT_TEMPERATURE,
    ...(systemBlocks && { system: systemBlocks }),
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')

  return {
    id: scenario.id,
    text,
    metadata: {
      generatedAt: new Date().toISOString(),
      model,
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
    },
  }
}

/**
 * Generate fixtures for many scenarios in series.
 * Sequential (not parallel) to respect rate limits on free-tier accounts.
 *
 * @returns Array of generated fixtures in the same order as input scenarios.
 */
export async function generateFixtures(
  scenarios: Scenario[],
  promptFor: (scenario: Scenario) => string,
  config: GenerateConfig = {},
): Promise<Fixture[]> {
  const results: Fixture[] = []
  for (const scenario of scenarios) {
    const userPrompt = promptFor(scenario)
    // eslint-disable-next-line no-await-in-loop
    const fixture = await generateFixture(scenario, userPrompt, config)
    results.push(fixture)
  }
  return results
}
