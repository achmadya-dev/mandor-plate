# Contributing to Mandor Plate

Thanks for considering a contribution! This document captures the short list of conventions; pair it with [README.md](./README.md) for the full workflow.

## Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm docker:up
pnpm --filter @mandor-plate/api migration:run
pnpm --filter @mandor-plate/api seed:run
```

Node ≥ 20 and pnpm 10 are required (see `engines` fields).

## Before opening a PR

```bash
pnpm check        # lint + typecheck + unit tests
pnpm format:check # prettier verification
```

Pre-commit only runs `lint-staged`. CI runs the full pipeline including E2E, so a clean local `pnpm check` is the minimum bar.

## Branching and commits

- Branch off `main` using a `feat/`, `fix/`, `chore/`, `docs/`, or `refactor/` prefix.
- Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`.
- Keep commits focused; small PRs review faster.

## Agent-driven workflow

The repo ships skills in `.agents/skills/` (e.g. `mandor-prd`, `mandor-issues`, `mandor-publish`, `mandor-review`). When an agent is doing the work, prefer routing through that workflow instead of opening ad-hoc PRs.

## Reporting bugs

Open a GitHub issue with the `needs-triage` label. Include reproduction steps, expected vs. actual behaviour, and relevant env (Node, pnpm, OS, Postgres version). See [SECURITY.md](./SECURITY.md) for security reports — those should not go through public issues.
