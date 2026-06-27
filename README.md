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

| Service | URL |
|---|---|
| API | http://localhost:3001 |
| Web | http://localhost:3000 |
| Swagger | http://localhost:3001/docs |
| Maildev | http://localhost:1080 |

Seeded admin: `admin@example.com` / `secret`

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

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start API + web (Turborepo) |
| `pnpm docker:up` | Start PostgreSQL + Maildev |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm test` | Unit tests all packages |
| `pnpm test:e2e` | E2E tests (MP-011) |
| `pnpm sandcastle` | Verify Sandcastle configuration |
| `pnpm sandcastle:run` | Run Sandcastle agent orchestration |
| `pnpm setup:agent-skills` | Re-install mattpocock/skills bundle |

## Docs

- [PRD.md](./PRD.md)
- [CONTEXT.md](./CONTEXT.md) — domain vocabulary for agents
- [docs/agents/backlog.md](./docs/agents/backlog.md)
- [docs/agents/domain.md](./docs/agents/domain.md)
- [docs/agents/triage-labels.md](./docs/agents/triage-labels.md)
