---
name: mandor-prd
description: Draft product requirements for Mandor Plate features as local planning docs. Use when writing a PRD or scoping work before mandor-issues. Does not publish to GitHub.
---

# Mandor PRD

Draft product requirements for Mandor Plate features.

## Read first

| Document                          | Role                             |
| --------------------------------- | -------------------------------- |
| [README.md](../../../README.md)   | Dev workflow and monorepo layout |
| [CONTEXT.md](../../../CONTEXT.md) | Ubiquitous language              |

## Interview (one question at a time)

Use **mandor-grill-me** first if scope is fuzzy. Then flesh out:

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

**Always draft locally first** as a planning document for the feature.

Do not publish a PRD directly to GitHub. Local issue drafts are a separate optional planning step; GitHub publish is a separate step via **mandor-publish**.

Do not recreate a root `PRD.md` or committed planning docs unless the user explicitly asks.

## After the PRD

1. Run **mandor-domain** to update `CONTEXT.md` with new terms
2. Run **mandor-issues** to draft local implementation issues if you want a local planning pass first
3. Review those draft issues; set `Status: ready-for-agent` when criteria are complete
4. Run **mandor-publish** to push to GitHub (only when the user asks)
