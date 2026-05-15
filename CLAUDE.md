# Project rules for the AI Portfolio repo

These notes add project specific rules on top of the global writing style file at `C:\Users\Rishi\.claude\CLAUDE.md`. The global file is authoritative for prose conventions (no em dashes, no en dashes, no hyphens or semicolons in sentences, no contractions). Nothing below relaxes those rules.

## Plan file sync

The canonical plan lives in `docs/master-plan.md` and `docs/plan.html` inside this repo. A read only mirror lives at `..\ai-portfolio-projects\ai-portfolio-projects-master.md` and `..\ai-portfolio-projects\index.html`. The mirror is the file Rishi opens in a browser as the visual dashboard.

A git post commit hook keeps the mirror current. Every commit that modifies either canonical plan file triggers `scripts/sync-plan.sh`, which copies the files into the mirror directory. Commits that do not touch the plan files are not slowed down. If the mirror directory is missing the hook exits quietly.

Activation runs once after a fresh clone:

    git config --local core.hooksPath .githooks

After activation the hook fires automatically on every `git commit`. Verify with:

    git config --local --get core.hooksPath

To force a sync without a commit:

    bash scripts/sync-plan.sh

## Daily plan update workflow

Every day end update of the plan must:

1. Edit `docs/master-plan.md` with the activity entry, status row, and next action.
2. Edit `docs/plan.html` so the rendered dashboard mirrors the markdown.
3. Commit both files together. The post commit hook copies them to the mirror.

Do not commit only one of the two files. The dashboard and the markdown must agree.

## What lives where

- `apps/<project>/` Next.js apps. Each deploys to its own Vercel project. Routes shown in the per app README.
- `packages/design-system/` and `packages/ai-core/` shared workspace packages consumed by every app.
- `fixtures/<project>/` pre generated AI responses checked into git, reviewed as source files.
- `docs/master-plan.md` canonical day by day plan.
- `docs/plan.html` interactive dashboard rendering of the same plan.
- `docs/case-studies/` per project case studies.
- `scripts/` repo wide automation. `sync-plan.sh` is the only entry today.
- `.githooks/` versioned git hooks. Activated via `git config --local core.hooksPath .githooks`.

## Conventions inherited from the root README

- No runtime AI calls in any deployed app. Every demo streams pre generated fixtures.
- Commits state what changed and why. No AI co author tags unless Rishi asks for them.
- Visible app prose must follow the global writing style rules.
