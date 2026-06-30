---
name: mandor-publish
description: >-
  Publish local issue drafts to GitHub via gh issue create. Use after
  mandor-issues when Status is ready-for-agent and the user wants issues on
  GitHub. Never creates local draft files — only pushes existing drafts.
---

# Mandor Publish

Push reviewed local issue drafts to **GitHub Issues**. **Publish only — never draft PRDs or issues here.** Local draft files are temporary staging files; delete each one after it has been published successfully.

See [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md).

## Before publishing

1. Confirm `gh auth status` succeeds
2. Issues must already exist as local draft files (from **mandor-issues**)
3. Only publish files where:
   - `Status: ready-for-agent`
   - `GitHub:` line is empty (not yet published)

Ask the user which feature to publish (or publish all ready local draft issues if they confirm).

## Publish one issue

```bash
ISSUE=<local issue draft file>
TITLE=$(sed -n '1s/^# //p' "$ISSUE")
gh issue create \
  --title "$TITLE" \
  --body "$(sed -n '/^## Summary/,$p' "$ISSUE")" \
  --label "ready-for-agent"
```

Capture the GitHub issue number returned by `gh issue create` for the publish summary, then delete the published local draft file. The GitHub issue becomes the source of truth.

## Publish a feature batch

For each local draft issue file that is `ready-for-agent` with empty `GitHub:`:

1. Run the publish command above
2. Record the returned GitHub issue number in the publish summary
3. Delete the published local draft file
4. Report a summary table: deleted local draft path → GitHub issue URL

## Rules

- **Never** call `gh issue create` without a local draft file
- **Never** publish `Status: draft` files — tell the user to finish criteria or set `ready-for-agent` first
- **Never** re-publish a local draft file that already records a GitHub issue number; treat it as stale and use the GitHub issue directly
- After a local draft file is published successfully, delete it. Do not keep local drafts as a second source of truth.
- If a GitHub issue already exists without a local draft file, use the GitHub issue directly; do not recreate a local draft just to edit or implement it.

## After publishing

Tell the user they can run **mandor-implement-loop**, or rely on their webhook/scheduler runner if configured, to implement published issues.
