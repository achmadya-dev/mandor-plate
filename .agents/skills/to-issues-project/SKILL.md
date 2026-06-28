---
name: to-issues-project
description: Create GitHub issues for Mandor Plate vertical slices. Use when breaking a PRD into implementable tickets or preparing ready-for-agent work items.
---

# To Issues — Mandor Plate

Create implementable tickets from a PRD. **Scratch first, GitHub second** — see [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md).

## Before creating issues

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for terminology
3. Confirm the PRD exists at `.scratch/<feature-slug>/PRD.md`
4. Read triage label vocabulary from **setup-matt-pocock-skills** output (or defaults below)

## Workflow (always in this order)

### 1. Draft locally

Write one file per vertical slice:

```
.scratch/<feature-slug>/issues/01-<slug>.md
.scratch/<feature-slug>/issues/02-<slug>.md
```

Use this template:

```markdown
# <title>

Status: draft
GitHub:

## Summary

<one paragraph vertical slice goal>

## Acceptance criteria

- [ ] ...

## References

- PRD: `.scratch/<feature-slug>/PRD.md`
- Domain: CONTEXT.md
```

Split large PRDs into one issue per vertical slice. Each issue should be implementable in a single agent session.

### 2. Review

When acceptance criteria are complete, set `Status: ready-for-agent`. **Do not publish until the user confirms** (or explicitly asks to publish all ready scratch issues).

### 3. Publish to GitHub

Only for scratch files with `Status: ready-for-agent` and an empty `GitHub:` line:

```bash
gh issue create \
  --title "<title from # heading>" \
  --body "$(sed -n '/^## Summary/,$p' .scratch/<feature-slug>/issues/<NN>-<slug>.md)" \
  --label "ready-for-agent"
```

Then update the scratch file: `GitHub: #NN`.

**Never** call `gh issue create` without a scratch file first. If republishing, edit the scratch file and create a new GitHub issue only when the user asks.

## Labels

| Label             | When                               |
| ----------------- | ---------------------------------- |
| `ready-for-agent` | Fully specified; safe to implement |
| `needs-spec`      | Missing criteria — keep as `draft` |
| `blocked`         | Waiting on dependency              |
