---
name: mandor-issues
description: >-
  Draft GitHub-ready issue files in .scratch from a PRD. Use when breaking a PRD
  into implementable tickets. Does not call gh — use mandor-publish to
  send to GitHub.
---

# Mandor Issues

Break a PRD into vertical-slice issue **drafts** in `.scratch/`. **Create only — never publish.**

See [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md). To push issues to GitHub, run **mandor-publish** after review.

## Before creating issues

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for terminology
3. Confirm the PRD exists at `.scratch/<feature-slug>/PRD.md`
4. Read triage label vocabulary from **mandor-setup** output (or defaults below)

## Workflow

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

## When ready for publish

When acceptance criteria are complete, set `Status: ready-for-agent`. Stop here — tell the user to review the scratch files and run **mandor-publish** when they want GitHub issues created.

**Never** call `gh issue create` from this skill.

## Status values

| Status            | Meaning                                 |
| ----------------- | --------------------------------------- |
| `draft`           | Still being written or missing criteria |
| `ready-for-agent` | Ready for **mandor-publish**            |
| `done`            | Implemented (set by **mandor-loop**)    |

## Labels (for publish step)

These apply when **mandor-publish** creates GitHub issues:

| Label             | When                               |
| ----------------- | ---------------------------------- |
| `ready-for-agent` | Fully specified; safe to implement |
| `needs-spec`      | Missing criteria — keep as `draft` |
| `blocked`         | Waiting on dependency              |
