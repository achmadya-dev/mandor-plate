---
name: to-issues-project
description: Create GitHub issues from Mandor Plate backlog conventions. Use when breaking backlog tickets into GitHub issues, publishing MP-00N tickets, or preparing ready-for-agent work items for this repo.
---

# To Issues — Mandor Plate

Wraps the upstream `to-issues` skill with repo-specific context.

## Before creating issues

1. Read [docs/agents/backlog.md](../../docs/agents/backlog.md) for ticket format and dependencies
2. Read [docs/agents/triage-labels.md](../triage-labels.md) for label vocabulary
3. Read [CONTEXT.md](../../CONTEXT.md) and [docs/agents/domain.md](../domain.md) for terminology

## Issue template

```markdown
## Summary
<one paragraph tracer bullet goal>

## Acceptance criteria
- [ ] ...

## References
- Backlog: MP-00N
- PRD: user story N
- Domain: docs/agents/domain.md
```

## Labels

Apply `ready-for-agent` when criteria are complete. Add `sandcastle` if the issue should be picked up by AFK agents.

## Publish command

```bash
gh issue create --title "MP-00N: <title>" --body-file docs/agents/tickets/MP-00N.md --label "ready-for-agent"
```

Then invoke upstream **to-issues** skill patterns for refinement and splitting if needed.
