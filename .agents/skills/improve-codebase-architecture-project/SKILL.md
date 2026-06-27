---
name: improve-codebase-architecture-project
description: Improve Mandor Plate module design using deep-module patterns. Use when refactoring API/web/shared seams, deepening modules, or planning architecture changes in this monorepo.
---

# Improve Codebase Architecture — Mandor Plate

Deepen Mandor Plate modules using **codebase-design** patterns.

## Key seams in this repo

| Seam              | Deep module examples                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `packages/shared` | Zod validation contracts — one import boundary for API + web              |
| `apps/web` BFF    | `lib/auth/*` — cookies, session, RBAC; browser never calls API directly   |
| `apps/api`        | `ZodValidationPipe`, `mail-copy.ts` — NestJS adapters over shared schemas |
| File upload       | API `files/upload` + web `/api/profile/avatar` BFF                        |

## Process

1. Read [CONTEXT.md](../../../CONTEXT.md) and `packages/shared` for schema contracts
2. Use **codebase-design** vocabulary (depth, seam, adapter, leverage)
3. Prefer extending existing deep modules over new horizontal layers
4. Run `pnpm check` after each incremental change

## Out of scope without ADR

- Replacing TypeORM or NestJS
- Re-introducing Clerk or MongoDB
- Moving auth tokens to localStorage

Record irreversible decisions via **domain-modeling** → `docs/adr/NNN-title.md` (created on demand).
