---
name: to-issues-project
description: Create GitHub issues for Mandor Plate vertical slices. Use when breaking a PRD into implementable tickets or preparing ready-for-agent work items.
---

# To Issues — Mandor Plate

Create GitHub issues for Mandor Plate vertical slices.

## Before creating issues

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for terminology
3. Read triage label vocabulary from **setup-matt-pocock-skills** output (or defaults below)

## Issue template

```markdown
## Summary

<one paragraph vertical slice goal>

## Acceptance criteria

- [ ] ...

## References

- PRD: GitHub #NN or `.scratch/<feature>/PRD.md`
- Domain: CONTEXT.md
```

## Labels

| Label             | When                                |
| ----------------- | ----------------------------------- |
| `ready-for-agent` | Fully specified; safe to implement  |
| `needs-spec`      | Missing criteria — do not implement |
| `blocked`         | Waiting on dependency               |

## Publish

**GitHub (default):**

```bash
gh issue create --title "<title>" --body-file /tmp/issue-body.md --label "ready-for-agent"
```

**Local fallback:**

```bash
# .scratch/<feature>/issues/01-<slug>.md
```

Split large PRDs into one issue per vertical slice. Each issue should be implementable in a single agent session with clear acceptance criteria.
