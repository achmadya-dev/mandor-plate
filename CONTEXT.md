# Mandor Plate — Domain Context

> Template for agent-readable project vocabulary. Keep terms stable; link implementation details to `docs/agents/domain.md`.

## Product

Mandor Plate is a full-stack monorepo boilerplate: NestJS API + Next.js dashboard + shared Zod contracts + agent tooling.

## Ubiquitous language

<!-- Add domain terms as the product grows. Start from docs/agents/domain.md -->

| Term | Meaning |
|---|---|
| User | Person with an account (`id`, email, role, status) |
| Role | `admin` or `user` — drives RBAC navigation |
| Session | JWT access + refresh tokens stored in httpOnly cookies via the web BFF |
| BFF | Next.js route handlers that proxy auth to the NestJS API |

## Architecture seams

- **Validation:** `packages/shared` (Zod) — single contract for API + web
- **Auth:** Web BFF sets cookies; API validates Bearer tokens
- **Files:** API `files/upload`; web proxies via `/api/profile/avatar`

## Key paths

| Path | Purpose |
|---|---|
| `apps/api` | NestJS REST API |
| `apps/web` | Next.js dashboard + BFF |
| `packages/shared` | Zod schemas |
| `docs/agents/backlog.md` | Vertical slice tickets (MP-001…) |
| `docs/agents/domain.md` | Auth/User domain design |
| `PRD.md` | Product requirements |

## Agent workflow

1. Read `docs/agents/backlog.md` for the next unchecked ticket
2. Follow `docs/agents/domain.md` for schema and naming
3. Run `pnpm typecheck && pnpm test` before committing
4. One atomic commit per vertical slice

## Decisions

<!-- Link irreversible decisions to docs/adr/NNN-title.md when created -->

See `docs/agents/domain.md` → ADR candidates.
