# Production Deployment With Coolify

Production uses the root `docker-compose.yml`. It contains only the application services and can be deployed directly as a Docker Compose resource in Coolify.

## Development

Development does not start database or mail containers from this repository. Provision a development PostgreSQL database and SMTP account separately, then put their credentials in `apps/api/.env` based on [`apps/api/.env.example`](../apps/api/.env.example). A separate Gmail account with an App Password is recommended for development so test emails do not mix with production mail.

Run the applications directly with:

```bash
pnpm install
pnpm dev
```

To run the application containers locally instead, fill the same environment variables and run `pnpm docker:app`. The compose file runs migrations and the production seed before starting the API.

## Create The Resource

1. Create a new Coolify resource from the Git repository.
2. Select **Docker Compose** as the build pack.
3. Set Base Directory to `/` and Docker Compose Location to `/docker-compose.yml`.
4. Add all required environment variables shown in [`ENVIRONMENT.md`](./ENVIRONMENT.md). Compose provides convenience defaults for some values but does not replace explicit production secret configuration.
5. Assign the public domain only to the `web` service and target container port `3000`, for example `https://app.example.com`. The port is the internal container port; the public URL normally does not include `:3000` behind Coolify's proxy.
6. Set `APP_URL=https://app.example.com`. Do not add public domains or host port mappings to `api`.

The Compose stack contains only `api` and `web`. The web container calls the API through the private Compose hostname `http://api:3001`. PostgreSQL and SMTP are external services configured through environment variables. Uploaded files are exposed through the web rewrite at `/api/v1/files/*`.

Create PostgreSQL separately, either as a separate Coolify database resource or through a managed database provider. Set its connection string as `DATABASE_URL` in the application resource. Do not add the database service to this repository's Compose file.

## Required Secrets

Set these as locked Coolify secrets:

- `DATABASE_URL` (managed PostgreSQL connection string)
- `AUTH_JWT_SECRET`
- `AUTH_REFRESH_SECRET`
- `AUTH_FORGOT_SECRET`
- `AUTH_CONFIRM_EMAIL_SECRET`
- `MAIL_PASSWORD` (Gmail App Password)
- `SECRET_ACCESS_KEY` when using S3

Set `APP_URL`, `MAIL_USER`, and `MAIL_DEFAULT_EMAIL`. Gmail production defaults are `smtp.gmail.com:587` with TLS required. Use a dedicated Gmail account with 2-Step Verification and an App Password; do not use the normal Gmail password. Review every optional value in [`ENVIRONMENT.md`](./ENVIRONMENT.md) before the first deploy.

## First Admin

For the first deployment, set `BOOTSTRAP_ADMIN_EMAIL` and a unique `BOOTSTRAP_ADMIN_PASSWORD` of at least 12 characters. The production seed is idempotent: it creates the admin only when the email does not exist and never resets an existing password.

After the first successful login, remove both bootstrap variables from Coolify. Demo users are never seeded by the production stack.

## Migrations And Health

The API startup command runs compiled TypeORM migrations, upserts required role/status reference data, optionally bootstraps the first admin, and then starts NestJS. A failure in any setup step prevents the API from becoming healthy.

- API liveness: `/api/health/live`
- API readiness: `/api/health/ready` (checks the external PostgreSQL database)
- Web health: `/api/health`

Coolify should only route traffic to healthy containers. Keep migrations backward-compatible for rolling deploys: add columns before using them, deploy code, backfill, then remove old columns in a later release.

## Storage And Backups

The stack persists local uploads in `uploaded-files`. PostgreSQL backups and point-in-time recovery must be configured on the managed database provider before accepting production traffic and tested regularly.

For horizontally scaled or replaceable API containers, set `FILE_DRIVER=s3` or `s3-presigned` instead of local storage. Database backups do not include uploaded files.

## Rollback

1. Select the previous successful commit in Coolify and redeploy it.
2. Do not automatically revert a migration unless its down migration has been tested against production-like data.
3. Restore the managed PostgreSQL database and uploads together when recovering from data loss.
4. Verify all three health endpoints and an authenticated user journey after rollback.

## Release Checklist

- `pnpm check` and `pnpm format:check` pass.
- `pnpm audit --prod --audit-level=high` passes.
- API production build and health checks pass.
- Both Docker images build from a clean checkout.
- Production secrets differ from development examples.
- Database and upload backups have a tested restore path.
- Google OAuth authorized origins and SMTP sender domains match `APP_URL`.
