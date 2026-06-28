# Example: account-status-chip workflow

End-to-end sample for testing the agent workflow (PRD → scratch issues → GitHub → issue-loop).

**This is a documentation example only.** Copy into `.scratch/` before running skills — scratch files are gitignored and stay local.

## Copy to scratch

```bash
mkdir -p .scratch
cp -r docs/examples/account-status-chip/.scratch-template .scratch/account-status-chip
```

## Test the workflow

| Step | Skill / command | What to verify                                                                |
| ---- | --------------- | ----------------------------------------------------------------------------- |
| 1    | Read PRD        | `.scratch/account-status-chip/PRD.md`                                         |
| 2    | Review issues   | Three files under `.scratch/account-status-chip/issues/`                      |
| 3    | Publish         | **to-issues-project** — set `Status: ready-for-agent`, then `gh issue create` |
| 4    | Batch implement | `/loop /issue-loop` — one commit per issue, close when done                   |

## Publish one issue (manual)

```bash
ISSUE=.scratch/account-status-chip/issues/01-shared-status-label.md
TITLE=$(sed -n '1s/^# //p' "$ISSUE")
gh issue create \
  --title "$TITLE" \
  --body "$(sed -n '/^## Summary/,$p' "$ISSUE")" \
  --label "ready-for-agent"
# Then edit the scratch file: GitHub: #NN
```

## Feature summary

Show **account status** (`active` / `inactive`) as a colored badge on the profile page and in the user nav dropdown. Session user already includes `status`; this example adds consistent labeling and UI.

## Cleanup

```bash
rm -rf .scratch/account-status-chip
# Close/delete GitHub issues created during the test
```
