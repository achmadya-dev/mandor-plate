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

Node >= 20 and pnpm 10 are required. See the `engines` fields in `package.json` files.

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

## Pull requests

A good PR includes:

- A short summary of what changed and why.
- Screenshots or screen recordings for UI changes.
- Notes for migrations, seed changes, environment variables, or deployment impact.
- Test evidence: at minimum `pnpm check`, plus E2E tests for auth, database, or fullstack changes.

## Reporting bugs

Open a GitHub issue using the bug report template. Include reproduction steps, expected vs. actual behavior, and relevant environment details such as Node, pnpm, OS, browser, and PostgreSQL version.

Security issues should not be reported through public issues. See [SECURITY.md](./SECURITY.md).
