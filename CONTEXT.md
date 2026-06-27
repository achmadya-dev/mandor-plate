# Mandor Plate — Domain Context

> Agent-readable project vocabulary. Keep terms stable; extend via the **domain-modeling** skill.

## Product

Mandor Plate is a full-stack monorepo: NestJS API, Next.js dashboard, shared Zod contracts, and agent tooling.

## Ubiquitous language

| Term    | Meaning                                                                |
| ------- | ---------------------------------------------------------------------- |
| User    | Person with an account (`id`, email, role, status)                     |
| Role    | `admin` or `user` — drives RBAC navigation                             |
| Session | JWT access + refresh tokens stored in httpOnly cookies via the web BFF |
| BFF     | Next.js route handlers that proxy auth to the NestJS API               |

## Architecture seams

- **Validation:** `packages/shared` (Zod) — single contract for API + web
- **Auth:** Web BFF sets cookies; API validates Bearer tokens
- **Files:** API `files/upload`; web proxies via `/api/profile/avatar`

## Key paths

| Path                 | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `apps/api`           | NestJS REST API                            |
| `apps/web`           | Next.js dashboard + BFF                    |
| `apps/web/README.md` | Web app guide (forms, themes, conventions) |
| `packages/shared`    | Zod schemas                                |
| `CONTEXT.md`         | This file — ubiquitous language            |
| `.agents/skills/`    | Agent skills (see README Dev workflow)     |

## Decisions

<!-- Link irreversible decisions to docs/adr/NNN-title.md when domain-modeling creates them -->
