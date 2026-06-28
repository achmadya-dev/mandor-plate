---
name: mandor-prd
description: Draft product requirements for Mandor Plate features in .scratch. Use when writing a PRD or scoping work before mandor-issues. Does not publish to GitHub.
---

# Mandor PRD

Draft product requirements for Mandor Plate features.

## Read first

| Document                          | Role                             |
| --------------------------------- | -------------------------------- |
| [README.md](../../../README.md)   | Dev workflow and monorepo layout |
| [CONTEXT.md](../../../CONTEXT.md) | Ubiquitous language              |

## Interview (one question at a time)

Use **mandor-grill** first if scope is fuzzy. Then flesh out:

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

**Always draft locally first:**

```
.scratch/<feature-slug>/PRD.md
```

Do not publish a PRD directly to GitHub. Issue drafts go to `.scratch/` via **mandor-issues**; GitHub publish is a separate step via **mandor-publish**.

Do not recreate a root `PRD.md` or committed planning docs unless the user explicitly asks.

## After the PRD

1. Run **mandor-domain** to update `CONTEXT.md` with new terms
2. Run **mandor-issues** to draft issues under `.scratch/<feature-slug>/issues/`
3. Review scratch issues; set `Status: ready-for-agent` when criteria are complete
4. Run **mandor-publish** to push to GitHub (only when the user asks)
