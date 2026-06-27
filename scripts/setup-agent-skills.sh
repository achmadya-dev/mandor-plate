#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SOURCE="mattpocock/skills"
SKILLS=(
  ask-matt
  codebase-design
  diagnosing-bugs
  domain-modeling
  grill-with-docs
  improve-codebase-architecture
  implement
  prototype
  resolving-merge-conflicts
  review
  setup-matt-pocock-skills
  tdd
  to-issues
  to-prd
  triage
  grill-me
  handoff
  obsidian-vault
  teach
  writing-great-skills
  git-guardrails-claude-code
  migrate-to-shoehorn
  scaffold-exercises
  setup-pre-commit
)

echo "Installing ${#SKILLS[@]} upstream skills from ${SOURCE}..."
for skill in "${SKILLS[@]}"; do
  echo "→ ${skill}"
  npx --yes skills add "${SOURCE}@${skill}" -y
done

echo "Installed skills under .agents/skills/"
