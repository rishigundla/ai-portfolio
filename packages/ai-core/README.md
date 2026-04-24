# @rishi/ai-core

Shared AI utilities for the AI Portfolio monorepo. Streaming replay, prompt templates, and types used across all apps.

## Status

Placeholder — to be implemented on **Phase 1 · Week 1 · Day 6** per [master plan](../../docs/master-plan.md).

## Target Contents

- `src/replay.ts` — Vercel AI SDK `streamText` wrapper that chunks pre-generated JSON fixtures word-by-word (simulated Claude streaming)
- `src/generate.ts` — Dev-only Anthropic SDK client for generating fixtures via Claude Code workflow
- `src/prompts/` — Reusable prompt templates per project
- `src/types/` — Shared TypeScript types: `Fixture`, `Scenario`, `StreamConfig`, `AiNarrative`
