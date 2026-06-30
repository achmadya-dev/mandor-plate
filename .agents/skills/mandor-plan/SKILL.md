---
name: mandor-plan
description: >-
  The planning entry point. Stress-test the idea, align domain language,
  prepare local planning docs if useful, and optionally publish an epic plus
  child issues to GitHub.
---

# Mandor Plan

Use this as the single planning entry point.

This skill absorbs four concerns:

- scope sharpening
- domain vocabulary alignment
- local planning docs
- optional GitHub publish

The user decides whether planning stays local first or is pushed to GitHub immediately.

## Read first

| Document                                                              | Role                             |
| --------------------------------------------------------------------- | -------------------------------- |
| [README.md](../../../README.md)                                       | Dev workflow and monorepo layout |
| [CONTEXT.md](../../../CONTEXT.md)                                     | Ubiquitous language              |
| [docs/agents/issue-tracker.md](../../../docs/agents/issue-tracker.md) | GitHub issue contract            |
| [docs/agents/triage-labels.md](../../../docs/agents/triage-labels.md) | Workflow labels                  |

## Step 1: Sharpen the plan

Work through these one at a time:

1. problem
2. who is blocked
3. vertical slice
4. out of scope
5. acceptance criteria
6. risks and open questions
7. whether to stay local first or publish to GitHub now

If the user is vague, keep grilling one question at a time until the feature can be expressed as one epic and several child issues.

## Step 2: Align domain language

Before creating artifacts:

1. read `CONTEXT.md`
2. reuse existing terminology where possible
3. if a term is missing, update `CONTEXT.md` as part of the planning work

Do not invent new terms casually when the repo already has stable language.

## Step 3: Local planning mode

If the user wants local planning first:

1. Draft a local PRD for the feature.
2. Draft one local issue file per vertical slice.
3. Keep statuses as `draft` until criteria are complete.
4. Promote each local issue to `ready-for-agent` only when its acceptance criteria are stable.

Use the repo's local planning-doc convention for filenames and directories.

## Step 4: GitHub publish mode

If the user wants GitHub publish now, or after local planning is reviewed:

1. Confirm `gh auth status` succeeds.
2. Create one epic GitHub issue with labels `epic` and `ready-for-agent`.
3. Create one child GitHub issue per vertical slice.
4. Add child issue links to the epic body under `Implementation issues`.
5. Delete local draft issue files after successful publish, if they exist.
6. Treat GitHub as the source of truth after publish.

Epic body shape:

```markdown
## Summary

<feature goal and relevant context>

## Implementation issues

- #123
- #124
- #125

## Acceptance

- [ ] Each linked child issue is implemented
- [ ] One branch exists for this epic
- [ ] One PR is opened after all child issues are implemented
- [ ] `pnpm check` passes
```

Child issue shape:

```markdown
## Summary

<one vertical slice>

## Acceptance criteria

- [ ] ...

## References

- Epic: #122
```

## Step 5: Output

If still local:

- local PRD
- local issue drafts
- optional `CONTEXT.md` updates

If published:

- epic GitHub issue
- child GitHub issues
- optional `CONTEXT.md` updates
- local issue drafts removed

After publish, tell the user they can run **mandor-implement** or rely on their cron/webhook runner.
