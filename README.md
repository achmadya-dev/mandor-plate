# Mandor Plate

Full-stack product boilerplate with NestJS API, Next.js dashboard, and agent tooling.

## Quickstart

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm docker:up
pnpm --filter @mandor-plate/api migration:run
pnpm --filter @mandor-plate/api seed:run
pnpm dev
```

| Service | URL                        |
| ------- | -------------------------- |
| API     | http://localhost:3001      |
| Web     | http://localhost:3000      |
| Swagger | http://localhost:3001/docs |
| Maildev | http://localhost:1080      |

Seeded accounts:

| Email                  | Password | Role  |
| ---------------------- | -------- | ----- |
| `admin@example.com`    | `secret` | admin |
| `john.doe@example.com` | `secret` | user  |

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## E2E tests

Requires PostgreSQL and Maildev (via `pnpm docker:up`).

```bash
pnpm test:e2e:prepare   # build apps, migrate, seed
pnpm --filter @mandor-plate/web test:e2e:install   # first run only
pnpm test:e2e           # API Jest E2E + Playwright full-stack suite
```

Playwright specs live in [`apps/web/e2e/`](./apps/web/e2e/) and cover the primary auth journey, RBAC navigation, forgot-password email capture, and avatar upload.

## Agent tooling (once after clone)

```bash
# Install upstream skills (already committed in .agents/skills; re-run to refresh)
pnpm setup:agent-skills

# Configure issue tracker + triage preferences (interactive, run once per team)
# In Cursor: invoke the setup-matt-pocock-skills skill from .agents/skills/

# Verify Sandcastle sandbox config (Docker provider)
pnpm sandcastle

# Run Sandcastle agent (requires .sandcastle/.env)
pnpm sandcastle:run
```

Skills live in [`.agents/skills/`](./.agents/skills/) (24 upstream + 3 project templates). Sandcastle config is in [`.sandcastle/`](./.sandcastle/).

## Implementation order

Work through [docs/agents/backlog.md](./docs/agents/backlog.md) in dependency order:

1. **MP-001** — Monorepo + API core
2. **MP-002**, **MP-003**, **MP-009**, **MP-010** (lint/CI) — parallel after MP-001
3. **MP-004** — Email auth BFF (requires MP-002 + MP-003)
4. **MP-005**–**MP-008** — Password recovery, Google sign-in, RBAC nav, profile (after MP-004)
5. **MP-011** — Full-stack E2E + this README (after MP-004–MP-008)

Critical path: MP-001 → MP-002 + MP-003 → MP-004 → MP-011

## Scripts

| Command                   | Description                         |
| ------------------------- | ----------------------------------- |
| `pnpm dev`                | Start API + web (Turborepo)         |
| `pnpm docker:up`          | Start PostgreSQL + Maildev          |
| `pnpm typecheck`          | TypeScript check all packages       |
| `pnpm test`               | Unit tests all packages             |
| `pnpm test:e2e`           | API + web E2E tests                 |
| `pnpm test:e2e:prepare`   | Build, migrate, and seed for E2E    |
| `pnpm sandcastle`         | Verify Sandcastle configuration     |
| `pnpm sandcastle:run`     | Run Sandcastle agent orchestration  |
| `pnpm setup:agent-skills` | Re-install mattpocock/skills bundle |

## Docs

- [PRD.md](./PRD.md)
- [CONTEXT.md](./CONTEXT.md) — domain vocabulary for agents
- [docs/agents/backlog.md](./docs/agents/backlog.md)
- [docs/agents/domain.md](./docs/agents/domain.md)
- [docs/agents/triage-labels.md](./docs/agents/triage-labels.md)
