# Security Policy

## Supported Versions

Only the latest release line of Mandor Plate receives security updates.

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |
| older   | No        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for suspected security problems.

Email security concerns to **madyardwn@gmail.com** with:

- a minimal reproducible description,
- the affected commit or release,
- any proof-of-concept code.

You should receive an initial response within 72 hours. Please avoid public disclosure until a fix has been shipped.

## Hardening notes for downstream users

This boilerplate ships with safe defaults, but you must override them before going to production:

- Generate independent strong (at least 32 character) random values for every `AUTH_*_SECRET` variable. The API refuses the checked-in placeholders in production.
- Set `DATABASE_SSL_ENABLED=true` and provide CA/cert/key when connecting to managed Postgres.
- Keep refresh-token lifetime aligned with the web cookie lifetime (the default is 30 days), and rotate the refresh secret if tokens are compromised.
- Review `helmet`, CORS, and `@nestjs/throttler` configuration before exposing the API publicly.
- Swagger docs are disabled in production (`NODE_ENV=production`). To enable, override the guard in `src/main.ts`.
- Auth endpoints (login, register, forgot/reset password) have stricter rate limits than the global default (5 req/min for login/register/reset, 3 req/min for forgot-password).
- Run `pnpm audit --prod --audit-level=high` before every release; CI enforces the same threshold.
- Follow the backup, migration, and rollback controls in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
