# Mandor Plate

Full-stack product boilerplate with NestJS API and agent tooling.

## Quickstart

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm docker:up
pnpm --filter @mandor-plate/api migration:run
pnpm --filter @mandor-plate/api seed:run
pnpm dev
```

| Service | URL |
|---|---|
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/docs |
| Maildev | http://localhost:1080 |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start API dev server (Turborepo) |
| `pnpm docker:up` | Start PostgreSQL + Maildev |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm test` | Unit tests all packages |
| `pnpm test:e2e` | E2E tests (requires running API + infra) |

## Docs

- [PRD.md](./PRD.md)
- [docs/agents/backlog.md](./docs/agents/backlog.md)
- [docs/agents/domain.md](./docs/agents/domain.md)
