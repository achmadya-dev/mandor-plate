---
name: mandor-issues
description: >-
  Draft GitHub-ready local issue files from a PRD. Use when breaking a PRD
  into implementable tickets. Does not call gh — use mandor-publish to
  send to GitHub.
---

# Mandor Issues

Break a PRD into vertical-slice local issue **drafts**. **Create only — never publish.**

See [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md). To push issues to GitHub, run **mandor-publish** after review.

## Before creating issues

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for terminology
3. Confirm the PRD exists as a local planning document for the feature
4. Read triage label vocabulary from **mandor-setup** output (or defaults below)

## Workflow

Write one local file per vertical slice using the repo's planning-doc convention.

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

- PRD: the local PRD for this feature
- Domain: CONTEXT.md
```

Split large PRDs into one issue per vertical slice. Each issue should be implementable in a single agent session.

## When ready for publish

When acceptance criteria are complete, set `Status: ready-for-agent`. Stop here — tell the user to review the local draft files and run **mandor-publish** when they want GitHub issues created.

**Never** call `gh issue create` from this skill.

## Status values

| Status            | Meaning                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `draft`           | Still being written or missing criteria                            |
| `ready-for-agent` | Ready for **mandor-publish**                                       |
| `done`            | Merged after implementation (tracked on GitHub after the PR lands) |

## Labels (for publish step)

These apply when **mandor-publish** creates GitHub issues:

| Label             | When                               |
| ----------------- | ---------------------------------- |
| `ready-for-agent` | Fully specified; safe to implement |
| `needs-spec`      | Missing criteria — keep as `draft` |
| `blocked`         | Waiting on dependency              |
