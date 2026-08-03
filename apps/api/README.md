# Mandor Plate API

NestJS REST API derived from [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate), scoped to PostgreSQL only.

The API uses PostgreSQL through TypeORM, JWT sessions, email authentication, optional Google OAuth, and SMTP for transactional email.

## Architecture notes

- PostgreSQL is external and configured through `DATABASE_URL` or the individual `DATABASE_*` variables.
- SMTP is external and configured through the `MAIL_*` variables; production uses Gmail or another SMTP provider.
- Database migrations and the production reference seed run from the application container before startup.
- Swagger is disabled in production (see `src/main.ts`).

The following application capabilities are included:

- Session-aware JWT access tokens with immediate session revocation
- Zod validation pipe (`src/utils/zod-validation.pipe.ts`)
- Shared Zod schemas in `packages/shared` (single contract for API + web)
- Swagger disabled in production (see `src/main.ts`)

## Quickstart

```bash
# From monorepo root
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm dev
```

API: http://localhost:3001  
Swagger: http://localhost:3001/docs

Health endpoints:

- Liveness: `GET /api/health/live`
- Readiness (includes PostgreSQL): `GET /api/health/ready`

Production images run compiled migrations and the production-safe reference seed before starting the API. Set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` for the first production admin.

## Default seeded users

| Email                | Password | Role  |
| -------------------- | -------- | ----- |
| admin@example.com    | secret   | admin |
| john.doe@example.com | secret   | user  |
