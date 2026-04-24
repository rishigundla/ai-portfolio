/**
 * @rishi/ai-core — barrel export for the most common imports.
 *
 * Prefer deep imports for tree-shaking in production:
 *   import { replayFixture } from '@rishi/ai-core/replay'
 *   import type { Fixture, Scenario } from '@rishi/ai-core/types'
 *
 * Or use this barrel for convenience in apps / scripts:
 *   import { replayFixture, type Fixture } from '@rishi/ai-core'
 */

export * from './types/index'
export * from './replay'
// Note: generate.ts is NOT re-exported here because it imports @anthropic-ai/sdk
// which pulls in Node-only code and a client needing a runtime API key. Import
// directly from '@rishi/ai-core/generate' in dev scripts only.
