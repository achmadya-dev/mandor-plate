# Environment Variables

The checked-in `.env.example` files are the development defaults. Production values belong in the deployment platform, never in Git.

## API

| Variable                                                                                               | Required    | Purpose                                                                                                                           |
| ------------------------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV`                                                                                             | Yes         | Use `production` outside local development.                                                                                       |
| `APP_PORT`                                                                                             | Yes         | API listen port; Docker uses `3001`.                                                                                              |
| `APP_NAME`                                                                                             | Yes         | Service name used in API responses and email.                                                                                     |
| `API_PREFIX`                                                                                           | Yes         | Global route prefix; defaults to `api`.                                                                                           |
| `FRONTEND_DOMAIN`                                                                                      | Yes         | Exact public web origin for CORS and email links.                                                                                 |
| `BACKEND_DOMAIN`                                                                                       | Yes         | Public origin used for uploaded-file URLs. With the BFF rewrite this is normally the web URL.                                     |
| `DATABASE_URL`                                                                                         | Conditional | Complete PostgreSQL URL. Recommended for Coolify with a managed database. When absent, use the individual `DATABASE_*` variables. |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`            | Conditional | PostgreSQL connection settings.                                                                                                   |
| `DATABASE_SYNCHRONIZE`                                                                                 | Yes         | Keep `false`; schema changes are migration-only.                                                                                  |
| `DATABASE_SSL_ENABLED`, `DATABASE_REJECT_UNAUTHORIZED`, `DATABASE_CA`, `DATABASE_KEY`, `DATABASE_CERT` | Conditional | TLS settings for an external managed database.                                                                                    |
| `FILE_DRIVER`                                                                                          | Yes         | `local`, `s3`, or `s3-presigned`.                                                                                                 |
| `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `AWS_S3_REGION`, `AWS_DEFAULT_S3_BUCKET`                         | Conditional | Required for S3 file drivers.                                                                                                     |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_DEFAULT_EMAIL`, `MAIL_DEFAULT_NAME`                                    | Yes         | SMTP connection and sender identity.                                                                                              |
| `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_IGNORE_TLS`, `MAIL_SECURE`, `MAIL_REQUIRE_TLS`                     | Conditional | SMTP authentication and TLS behavior.                                                                                             |
| `AUTH_JWT_SECRET`, `AUTH_REFRESH_SECRET`, `AUTH_FORGOT_SECRET`, `AUTH_CONFIRM_EMAIL_SECRET`            | Yes         | Independent random secrets, each at least 32 characters.                                                                          |
| `AUTH_*_TOKEN_EXPIRES_IN`                                                                              | Yes         | Access, refresh, reset, and confirmation expiration values.                                                                       |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                                             | No          | Enables Google sign-in on the API.                                                                                                |
| `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`                                                    | No          | Creates the first admin once. Set both together; password minimum is 12 characters.                                               |
| `BOOTSTRAP_ADMIN_FIRST_NAME`, `BOOTSTRAP_ADMIN_LAST_NAME`                                              | No          | Optional first-admin display name.                                                                                                |

Generate independent secrets with `openssl rand -base64 48`. Do not reuse a secret between token purposes.

## Web

| Variable                              | Phase             | Purpose                                                                       |
| ------------------------------------- | ----------------- | ----------------------------------------------------------------------------- |
| `API_URL`                             | Build and runtime | Internal NestJS URL. Compose uses `http://api:3001`.                          |
| `NEXT_PUBLIC_APP_URL`                 | Runtime           | Public canonical web URL.                                                     |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`        | Build             | Browser Google OAuth client ID. Must match the API client ID.                 |
| `AUTH_REFRESH_COOKIE_MAX_AGE_SECONDS` | Runtime           | Refresh-cookie lifetime; keep it aligned with the API refresh-token lifetime. |
| `PORT`, `HOSTNAME`                    | Runtime           | Container listener; defaults are `3000` and `0.0.0.0`.                        |

Variables prefixed with `NEXT_PUBLIC_` are embedded into browser assets. Changing Google OAuth configuration therefore requires a rebuild.

For Gmail SMTP, use `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_SECURE=false`,
`MAIL_REQUIRE_TLS=true`, `MAIL_USER` as the Gmail address, and `MAIL_PASSWORD` as a
Google App Password created with 2-Step Verification enabled.
