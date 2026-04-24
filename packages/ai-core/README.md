# @rishi/ai-core

Shared AI utilities for the AI Portfolio monorepo. Streaming replay infrastructure, types, dev-time Anthropic SDK client, and prompt templates.

## Philosophy

Every deployed app in the portfolio uses **pre-generated AI responses** replayed via `streamText`-style streaming. This means:

- **$0 runtime cost** — no Anthropic API calls when visitors browse the site
- **Instant responses** — no waiting for LLM inference
- **100% reliability** — no API rate limits or service outages
- **Curated quality** — you curate the best AI responses once, every visitor sees them

This package provides the infrastructure. Apps provide the fixtures.

## What's Inside

### `@rishi/ai-core` (barrel)

```ts
import { replayFixture, type Fixture, type Scenario } from '@rishi/ai-core'
```

Safe for client + server. Pure TypeScript, no runtime deps.

### `@rishi/ai-core/replay`

```ts
import { replayFixture, fixtureToReadableStream } from '@rishi/ai-core/replay'
```

Core streaming primitives:
- `replayFixture(fixture, config)` — async generator that yields accumulated text
- `replayFixtureToString(fixture, config)` — collect replay into a Promise<string>
- `fixtureToReadableStream(fixture, config)` — web-native ReadableStream for Response()
- `ReplayAbortedError` — thrown when config.signal aborts mid-stream
- `DEFAULT_STREAM_CONFIG` — exported defaults (40 cps, 300ms initial delay, 20% jitter)

### `@rishi/ai-core/types`

```ts
import type { Scenario, Fixture, StreamConfig, AiNarrative } from '@rishi/ai-core/types'
```

### `@rishi/ai-core/prompts`

```ts
import { ANOMALY_RCA_SYSTEM, dashboardProfilingPrompt } from '@rishi/ai-core/prompts'
```

Reusable system prompts and prompt builders for each of the 5 projects.

### `@rishi/ai-core/generate` (dev-only)

```ts
// Only import this in scripts/ or local dev tooling, never in client code
import { generateFixture } from '@rishi/ai-core/generate'
```

Thin wrapper around the Anthropic SDK for batch-generating fixtures. Requires `ANTHROPIC_API_KEY` environment variable. Supports prompt caching for 90% cost reduction on repeated system prompts.

## Example: Client-side Replay

```tsx
'use client'
import * as React from 'react'
import { replayFixture, type Fixture } from '@rishi/ai-core'
import { AiNarrativeBlock } from '@rishi/design-system/components'

export function Demo({ fixture }: { fixture: Fixture }) {
  const [text, setText] = React.useState('')
  const [streaming, setStreaming] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  const start = async () => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setText('')
    setStreaming(true)
    try {
      for await (const chunk of replayFixture(fixture, { signal: ac.signal })) {
        setText(chunk)
      }
    } finally {
      if (!ac.signal.aborted) setStreaming(false)
    }
  }

  React.useEffect(() => () => abortRef.current?.abort(), [])

  return (
    <>
      <button onClick={start} disabled={streaming}>Stream</button>
      <AiNarrativeBlock text={text} streaming={streaming} />
    </>
  )
}
```

## Example: Server-side Streaming Endpoint

```ts
// app/api/stream/[id]/route.ts
import { fixtureToReadableStream } from '@rishi/ai-core/replay'
import fixtures from '@/fixtures/index.json'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const fixture = fixtures[params.id]
  if (!fixture) return new Response('Not found', { status: 404 })
  return new Response(fixtureToReadableStream(fixture), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

## Example: Generating a Fixture (dev-only)

```ts
// scripts/generate-fixtures/anomaly.ts
import { generateFixture } from '@rishi/ai-core/generate'
import { ANOMALY_RCA_SYSTEM } from '@rishi/ai-core/prompts'
import * as fs from 'node:fs/promises'

const scenario = {
  id: 'emea-firmware-drop',
  title: 'EMEA NC2 feature_adoption_rate drop',
}

const fixture = await generateFixture(
  scenario,
  `Metric: NC2 feature_adoption_rate\nEMEA, dropped 14% yesterday...`,
  { system: ANOMALY_RCA_SYSTEM, cacheSystemPrompt: true }
)

await fs.writeFile(
  `fixtures/anomaly-alerting/${scenario.id}.json`,
  JSON.stringify(fixture, null, 2)
)
```

## Verification

This package is integration-tested by the [design-system-docs](../../apps/design-system-docs) showcase site at `/components`. The "Simulate Claude streaming" button uses `replayFixture` against a demo fixture — if that works, `ai-core` works.

See also: [../../docs/master-plan.md](../../docs/master-plan.md) for the full build schedule.
