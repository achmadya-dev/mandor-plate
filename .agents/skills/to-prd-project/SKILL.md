---
name: to-prd-project
description: Draft or extend Mandor Plate PRDs using repo conventions. Use when writing product requirements, extending PRD.md, or planning new vertical slices for this monorepo.
---

# To PRD — Mandor Plate

Wraps the upstream `to-prd` skill with Mandor Plate structure.

## Canonical documents

| Document | Role |
|---|---|
| [PRD.md](../../PRD.md) | Product requirements and user stories |
| [docs/agents/backlog.md](../backlog.md) | Vertical slice tickets (MP-001…) |
| [CONTEXT.md](../../CONTEXT.md) | Ubiquitous language for agents |
| [docs/agents/domain.md](../domain.md) | Auth/User schema design |

## Conventions

- User stories numbered in PRD; backlog tickets reference them
- Each tracer bullet cuts API + web + shared + tests
- Auth flows use BFF httpOnly cookies — never expose JWTs to the browser
- Agent tooling lives at repo root (`.agents/skills`, `.sandcastle/`)

## Output

When extending the PRD, propose changes as sections matching existing PRD tone. Link new backlog tickets in `docs/agents/backlog.md` with dependency graph updates.

Invoke upstream **to-prd** for interview and structuring; apply this skill for repo-specific placement.
