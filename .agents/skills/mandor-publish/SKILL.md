---
name: mandor-publish
description: >-
  Publish scratch issue drafts to GitHub via gh issue create. Use after
  mandor-issues when Status is ready-for-agent and the user wants issues on
  GitHub. Never creates scratch files — only pushes existing drafts.
---

# Mandor Publish

Push reviewed issue drafts from `.scratch/` to **GitHub Issues**. **Publish only — never draft PRDs or issues here.**

See [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md).

## Before publishing

1. Confirm `gh auth status` succeeds
2. Issues must already exist under `.scratch/<feature-slug>/issues/*.md` (from **mandor-issues**)
3. Only publish files where:
   - `Status: ready-for-agent`
   - `GitHub:` line is empty (not yet published)

Ask the user which feature slug to publish (or publish all ready issues under `.scratch/` if they confirm).

## Publish one issue

```bash
ISSUE=.scratch/<feature-slug>/issues/<NN>-<slug>.md
TITLE=$(sed -n '1s/^# //p' "$ISSUE")
gh issue create \
  --title "$TITLE" \
  --body "$(sed -n '/^## Summary/,$p' "$ISSUE")" \
  --label "ready-for-agent"
```

Then update the scratch file: `GitHub: #NN` (use the number returned by `gh`).

## Publish a feature batch

For each `*.md` in `.scratch/<feature-slug>/issues/` that is `ready-for-agent` with empty `GitHub:`:

1. Run the publish command above
2. Write `GitHub: #NN` back into that scratch file
3. Report a summary table: scratch path → GitHub issue URL

## Rules

- **Never** call `gh issue create` without a scratch file
- **Never** publish `Status: draft` files — tell the user to finish criteria or set `ready-for-agent` first
- **Never** re-publish if `GitHub: #NN` is already set (edit scratch + GitHub separately if needed)
- If a GitHub issue exists without a scratch file, create the scratch file first via **mandor-issues**, not by publishing blindly

## After publishing

Tell the user they can run **mandor-implement-loop**, or rely on their webhook/scheduler runner if configured, to implement published issues.
