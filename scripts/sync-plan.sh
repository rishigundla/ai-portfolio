#!/usr/bin/env bash
# Mirror docs/master-plan.md and docs/plan.html into the standalone
# viewer directory at ../ai-portfolio-projects.
#
# Run automatically by .githooks/post-commit whenever a commit touches
# either source file. Can also be invoked manually as `bash scripts/sync-plan.sh`.

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
mirror_dir="${repo_root}/../ai-portfolio-projects"

if [ ! -d "${mirror_dir}" ]; then
  echo "[sync-plan] mirror directory not found at ${mirror_dir}, skipping"
  exit 0
fi

cp "${repo_root}/docs/master-plan.md" "${mirror_dir}/ai-portfolio-projects-master.md"
cp "${repo_root}/docs/plan.html" "${mirror_dir}/index.html"

echo "[sync-plan] mirrored docs/master-plan.md and docs/plan.html into ${mirror_dir}"
