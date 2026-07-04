# Mandor Plate API

NestJS REST API derived from [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate), scoped to PostgreSQL only.

## Upstream notes

The following features from the upstream boilerplate were removed or not included:

- MongoDB support (PostgreSQL only)
- `@nestjs/cacher` / Redis caching layer
- BullMQ / background workers
- Apple Sign-In adapter (kept as stub, disabled by default)

The following additions were made on top of the upstream:

- Session-aware JWT access tokens (see [ADR 001](../../docs/adr/001-session-aware-jwt-access-tokens.md))
- Zod validation pipe (`src/utils/zod-validation.pipe.ts`)
- Shared Zod schemas in `packages/shared` (single contract for API + web)
- Swagger disabled in production (see `src/main.ts`)

## Quickstart

```bash
# From monorepo root
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm docker:up
pnpm --filter @mandor-plate/api migration:run
pnpm --filter @mandor-plate/api seed:run
pnpm dev
```

API: http://localhost:3001  
Swagger: http://localhost:3001/docs  
Maildev UI: http://localhost:1080

## Default seeded users

| Email                | Password | Role  |
| -------------------- | -------- | ----- |
| admin@example.com    | secret   | admin |
| john.doe@example.com | secret   | user  |
