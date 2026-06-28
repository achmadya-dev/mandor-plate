# Security Policy

## Supported Versions

Only the latest release line of Mandor Plate receives security updates.

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |
| older   | ❌        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for suspected security problems.

Email security concerns to **madyardwn@gmail.com** with:

- a minimal reproducible description,
- the affected commit or release,
- any proof-of-concept code.

You should receive an initial response within 72 hours. Please avoid public disclosure until a fix has been shipped.

## Hardening notes for downstream users

This boilerplate ships with safe defaults, but you must override them before going to production:

- Generate strong (≥32 character) random values for every `AUTH_*_SECRET` env var. The API refuses to start in production if a placeholder is detected.
- Set `DATABASE_SSL_ENABLED=true` and provide CA/cert/key when connecting to managed Postgres.
- Rotate `AUTH_REFRESH_TOKEN_EXPIRES_IN` and the refresh secret together if either is compromised.
- Review `helmet`, CORS, and `@nestjs/throttler` configuration before exposing the API publicly.
