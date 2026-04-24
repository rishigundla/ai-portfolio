/**
 * Core types shared across ai-core and all portfolio apps that consume AI fixtures.
 *
 * These shape the pre-generated-AI workflow:
 *   1. A Scenario describes a curated case the user can pick
 *   2. A Fixture is the pre-generated AI response attached to that scenario
 *   3. StreamConfig controls how the fixture is replayed to feel like live Claude streaming
 */

// ============================================================
// Scenario — a curated case
// ============================================================

/**
 * A Scenario is one of the curated demo cases a user can interact with.
 * Examples:
 *   - Sample dataset in the Dashboard Factory (Project 1)
 *   - Anomaly scenario in the Alerting app (Project 3)
 *   - Failure scenario in the Pipeline Self-Healer (Project 5)
 */
export interface Scenario {
  /** Kebab-case slug used in URLs and fixture file paths. */
  id: string
  /** Human-readable title shown in gallery cards. */
  title: string
  /** Optional one-liner shown beneath the title. */
  description?: string
  /** Optional grouping (e.g. "SCHEMA_DRIFT", "APAC", "Marketing"). */
  category?: string
  /** Arbitrary scenario-specific metadata that shouldn't be surfaced to the user directly. */
  metadata?: Record<string, unknown>
}

// ============================================================
// Fixture — the pre-generated AI response
// ============================================================

/**
 * A Fixture holds the pre-generated Claude response for a Scenario.
 * Created during dev (via Claude Code or generate.ts), committed to git,
 * and replayed at runtime via replay.ts to simulate live streaming.
 */
export interface Fixture {
  /** Must match the Scenario's id this fixture belongs to. */
  id: string
  /** The full AI response. Markdown is supported — consumers render via AiNarrativeBlock. */
  text: string
  /** Optional generation provenance for transparency. */
  metadata?: FixtureMetadata
}

export interface FixtureMetadata {
  /** ISO 8601 timestamp when the fixture was generated. */
  generatedAt?: string
  /** Model used to generate (e.g. 'claude-sonnet-4-6'). */
  model?: string
  /** Input token count from the generating API call. */
  promptTokens?: number
  /** Output token count from the generating API call. */
  completionTokens?: number
  /** Optional notes (e.g. "regenerated after schema change"). */
  notes?: string
}

// ============================================================
// StreamConfig — how the fixture is replayed
// ============================================================

/**
 * Configures how replayFixture progressively reveals text.
 * Defaults match typical Claude streaming cadence (~40 chars/sec).
 */
export interface StreamConfig {
  /** Characters per second target. Default: 40. */
  charsPerSecond?: number
  /** Delay before the first chunk appears (ms). Simulates "AI thinking". Default: 300. */
  initialDelayMs?: number
  /** Random +/- percent variation on each chunk interval. Default: 0.2 (20% jitter). */
  jitterPct?: number
  /** Characters emitted per chunk. Default: derived from charsPerSecond for ~25 updates/sec. */
  chunkSize?: number
  /** Called once per chunk with the accumulated text. */
  onChunk?: (text: string) => void
  /** Called exactly once when streaming completes (receives full text). */
  onComplete?: (text: string) => void
  /** AbortSignal for user-cancelled streams. Throws 'Replay aborted' on abort. */
  signal?: AbortSignal
}

// ============================================================
// AiNarrative — structured narrative output
// ============================================================

/**
 * Structured narrative used for report-style outputs in Projects 2 and 4.
 * Usually parsed from a fixture's text by the consuming app, not stored as JSON.
 */
export interface AiNarrative {
  summary: string
  highlights?: string[]
  risks?: string[]
  opportunities?: string[]
  recommendations?: string[]
  talkingPoints?: string[]
}
