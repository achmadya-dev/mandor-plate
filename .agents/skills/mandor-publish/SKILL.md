---
name: mandor-publish
description: >-
  Publish scratch issue drafts to GitHub via gh issue create. Use after
  mandor-issues when Status is ready-for-agent and the user wants issues on
  GitHub. Never creates scratch files — only pushes existing drafts.
---

# Mandor Publish

Push reviewed issue drafts from `.scratch/` to **GitHub Issues**. **Publish only — never draft PRDs or issues here.** Scratch issue files are temporary staging files; delete each one after it has been published successfully.

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

Capture the GitHub issue number returned by `gh issue create` for the publish summary, then delete the published scratch issue file. The GitHub issue becomes the source of truth.

## Publish a feature batch

For each `*.md` in `.scratch/<feature-slug>/issues/` that is `ready-for-agent` with empty `GitHub:`:

1. Run the publish command above
2. Record the returned GitHub issue number in the publish summary
3. Delete the published scratch issue file
4. Report a summary table: deleted scratch path → GitHub issue URL

## Rules

- **Never** call `gh issue create` without a scratch file
- **Never** publish `Status: draft` files — tell the user to finish criteria or set `ready-for-agent` first
- **Never** re-publish a scratch file that already records a GitHub issue number; treat it as stale and use the GitHub issue directly
- After a scratch issue file is published successfully, delete it. Do not keep scratch issues as a second source of truth.
- If a GitHub issue already exists without a scratch file, use the GitHub issue directly; do not recreate scratch just to edit or implement it.

## After publishing

Tell the user they can run **mandor-implement-loop**, or rely on their webhook/scheduler runner if configured, to implement published issues.
