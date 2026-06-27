---
name: to-prd-project
description: Draft product requirements for Mandor Plate features. Use when writing a PRD, scoping a vertical slice, or planning work before creating GitHub issues.
---

# To PRD — Mandor Plate

Draft product requirements for Mandor Plate features.

## Read first

| Document                          | Role                             |
| --------------------------------- | -------------------------------- |
| [README.md](../../../README.md)   | Dev workflow and monorepo layout |
| [CONTEXT.md](../../../CONTEXT.md) | Ubiquitous language              |

## Interview (one question at a time)

Use **grill-me** first if scope is fuzzy. Then flesh out:

1. **Problem** — who is blocked, and how?
2. **Vertical slice** — what ships in API + web + `packages/shared`?
3. **Out of scope** — what are we explicitly not doing?
4. **Acceptance criteria** — testable, ordered smallest-first
5. **Risks / open questions** — auth, migrations, breaking changes

## Conventions

- Each feature is a **vertical slice** — cuts API + web + shared + tests
- Auth flows use BFF httpOnly cookies — never expose JWTs to the browser
- Schema contracts live in `packages/shared` (Zod)

## Where to write the PRD

Follow the issue tracker configured by **setup-matt-pocock-skills**:

| Tracker                     | Output                                                                |
| --------------------------- | --------------------------------------------------------------------- |
| **GitHub Issues** (default) | Create a tracking issue with the full PRD in the body, or link a gist |
| **Local markdown**          | `.scratch/<feature-slug>/PRD.md` (gitignored — not committed)         |

Do not recreate a root `PRD.md` or `docs/agents/` unless the user explicitly asks.

## After the PRD

1. Run **domain-modeling** to update `CONTEXT.md` with new terms
2. Run **to-issues-project** to break the PRD into implementable issues
3. Label issues `ready-for-agent` when acceptance criteria are complete
