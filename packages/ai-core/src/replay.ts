/**
 * Replay a pre-generated Fixture to feel like live Claude streaming.
 *
 * Used at runtime by every app in the portfolio — Projects 1-5 all ship
 * pre-generated AI responses and stream them via this module instead of
 * calling the Anthropic API. Zero cost, instant responses, perfect reliability.
 *
 * The streaming cadence (default 40 chars/sec with jitter) matches typical
 * Claude Sonnet streaming rhythm so the replay is visually indistinguishable
 * from a live API call.
 */

import type { Fixture, StreamConfig } from './types/index'

export const DEFAULT_STREAM_CONFIG: Required<
  Pick<StreamConfig, 'charsPerSecond' | 'initialDelayMs' | 'jitterPct'>
> = {
  charsPerSecond: 40,
  initialDelayMs: 300,
  jitterPct: 0.2,
}

/**
 * Async generator that progressively yields accumulated text from a Fixture.
 *
 * Usage (server or client):
 *   for await (const text of replayFixture(fixture, { charsPerSecond: 60 })) {
 *     setDisplayed(text)  // React state update per chunk
 *   }
 *
 * @param fixture The pre-generated fixture to replay.
 * @param config Streaming behavior. Merged with DEFAULT_STREAM_CONFIG.
 * @yields Accumulated text string (monotonically grows).
 * @returns The final full text once streaming completes.
 * @throws 'Replay aborted' if config.signal is aborted mid-stream.
 */
export async function* replayFixture(
  fixture: Fixture,
  config: StreamConfig = {},
): AsyncGenerator<string, string, unknown> {
  const charsPerSecond = config.charsPerSecond ?? DEFAULT_STREAM_CONFIG.charsPerSecond
  const initialDelayMs = config.initialDelayMs ?? DEFAULT_STREAM_CONFIG.initialDelayMs
  const jitterPct = config.jitterPct ?? DEFAULT_STREAM_CONFIG.jitterPct
  // Emit ~25 visual updates per second → smooth streaming without excessive React re-renders
  const chunkSize = config.chunkSize ?? Math.max(1, Math.round(charsPerSecond / 25))

  if (initialDelayMs > 0) {
    await sleep(initialDelayMs, config.signal)
  }

  const msPerChunk = (chunkSize / charsPerSecond) * 1000
  let accumulated = ''

  for (let i = 0; i < fixture.text.length; i += chunkSize) {
    if (config.signal?.aborted) {
      throw new ReplayAbortedError()
    }

    accumulated = fixture.text.slice(0, i + chunkSize)
    config.onChunk?.(accumulated)
    yield accumulated

    // Only wait if there's more text to emit
    if (i + chunkSize < fixture.text.length) {
      const jitter = 1 + (Math.random() * 2 - 1) * jitterPct
      await sleep(msPerChunk * jitter, config.signal)
    }
  }

  config.onComplete?.(fixture.text)
  return fixture.text
}

/**
 * Convenience wrapper that collects the replay into a single promise.
 * Use when you want the streaming cadence but don't need incremental updates
 * (e.g. for logging or analytics).
 */
export async function replayFixtureToString(
  fixture: Fixture,
  config: StreamConfig = {},
): Promise<string> {
  let final = ''
  for await (const chunk of replayFixture(fixture, config)) {
    final = chunk
  }
  return final
}

/**
 * Convert a replay into a native ReadableStream.
 * Lets you hand the stream directly to Response() in route handlers:
 *
 *   return new Response(fixtureToReadableStream(fixture))
 */
export function fixtureToReadableStream(
  fixture: Fixture,
  config: StreamConfig = {},
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  let emittedLength = 0

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const accumulated of replayFixture(fixture, config)) {
          const delta = accumulated.slice(emittedLength)
          emittedLength = accumulated.length
          controller.enqueue(encoder.encode(delta))
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
    cancel() {
      // If consumer cancels the stream, signal abort upstream
      // (no-op here since we don't expose a cancel reason; config.signal handles it)
    },
  })
}

// ============================================================
// Internals
// ============================================================

export class ReplayAbortedError extends Error {
  constructor(message = 'Replay aborted') {
    super(message)
    this.name = 'ReplayAbortedError'
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ReplayAbortedError())
      return
    }
    const id = setTimeout(resolve, ms)
    if (signal) {
      const onAbort = () => {
        clearTimeout(id)
        reject(new ReplayAbortedError())
      }
      signal.addEventListener('abort', onAbort, { once: true })
    }
  })
}
