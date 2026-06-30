# Example: account-status-chip workflow

End-to-end sample for testing the Mandor Plate agent workflow: **skills/commands → scratch → GitHub → queue selection**.

**Two modes:**

| Mode                         | When to use                                             |
| ---------------------------- | ------------------------------------------------------- |
| **A — Generate with skills** | Learn or re-run the full planning pipeline from an idea |
| **B — Use template**         | Skip planning; test publish + `pnpm work:next` only     |

Scratch files live under `.scratch/` (gitignored). The committed template is at `.scratch-template/`.

## Prerequisites

Before running this example:

| Requirement              | Verify                                                   |
| ------------------------ | -------------------------------------------------------- |
| Monorepo running locally | [Quickstart](../../../README.md#quickstart) — `pnpm dev` |
| `gh` authenticated       | `gh auth status`                                         |
| GitHub remote configured | `git remote -v`                                          |
| Core skills available    | `.agents/skills/` present (clone this repo)              |
| Scratch directory        | `mkdir -p .scratch`                                      |

For **Mode A**, invoke the repo skills and commands in order. For **Mode B**, only publish + `pnpm work:next` are needed.

---

## Mode A — Generate PRD & issues with skills

Invoke skills **in this order** (matches [README Dev workflow](../../../README.md#dev-workflow)):

```mermaid
flowchart LR
  G[grill-me] --> P[Draft PRD in .scratch]
  P --> D[domain-modeling]
  D --> I[Draft child issues in .scratch]
  I --> Pub[pnpm publish:parent-child]
  Pub --> L[pnpm work:next]
```

| Step | Skill                    | Invoke                      | Output                                     |
| ---- | ------------------------ | --------------------------- | ------------------------------------------ |
| 1    | **grill-me**             | `grill-me`                  | Sharpen scope (optional)                   |
| 2    | manual PRD draft         | edit `.scratch/...`         | `.scratch/account-status-chip/PRD.md`      |
| 3    | **domain-modeling**      | `domain-modeling`           | Updates `CONTEXT.md` if needed             |
| 4    | manual child issue draft | edit `.scratch/...`         | `.scratch/…/issues/*.md` (`Status: draft`) |
| 5    | parent/child publish     | `pnpm publish:parent-child` | GitHub parent + child issues               |
| 6    | queue selection          | `pnpm work:next`            | Select next eligible issue                 |

### Example prompts

**Step 1 — grill-me** (optional):

```
grill-me

I want to show account status (active/inactive) on the profile page and user nav.
Stress-test scope before we write a PRD.
```

**Step 2 — draft PRD locally**:

```
Feature: account-status-chip
Problem: users can't see account status in the dashboard UI.
Vertical slice: web only, reuse session user status — no new API.
Write PRD to .scratch/account-status-chip/PRD.md
```

**Step 3 — domain-modeling**:

```
domain-modeling

Review .scratch/account-status-chip/PRD.md — add any missing terms to CONTEXT.md
(e.g. account status vs role).
```

**Step 4 — draft child issues** (create only — scratch):

```
Break .scratch/account-status-chip/PRD.md into vertical slices.
Draft issues under .scratch/account-status-chip/issues/.
Set Status: ready-for-agent when criteria are complete. Do not publish.
```

**Step 5 — publish to GitHub**:

```
pnpm publish:parent-child account-status-chip
```

**Step 6 — choose the next work item**:

```
pnpm work:next
```

In automated mode, the queue selector can be used by a runner after child issues are published and labeled `ready-for-agent`.

Compare agent output to the reference template in `.scratch-template/` if helpful.

---

## Mode B — Copy template (skip generate)

Use when you only want to test **publish** and **loop**, not PRD/issue generation.

```bash
mkdir -p .scratch
cp -r docs/examples/account-status-chip/.scratch-template .scratch/account-status-chip
```

Then run `pnpm publish:parent-child account-status-chip` (step 5) and `pnpm work:next` (step 6). Issues are pre-filled with `Status: ready-for-agent`.

---

## Publish manually (or use `pnpm publish:parent-child`)

Prefer `pnpm publish:parent-child`. Equivalent shell:

```bash
ISSUE=.scratch/account-status-chip/issues/01-shared-status-label.md
TITLE=$(sed -n '1s/^# //p' "$ISSUE")
gh issue create \
  --title "$TITLE" \
  --body "$(sed -n '/^## Summary/,$p' "$ISSUE")" \
  --label "ready-for-agent"
# Then edit the scratch file: GitHub: #NN
```

Repeat for `02-profile-status-badge.md` and `03-user-nav-status-chip.md`.

---

## Reference template contents

| File                                                  | Purpose                        |
| ----------------------------------------------------- | ------------------------------ |
| `.scratch-template/PRD.md`                            | Sample PRD (3 vertical slices) |
| `.scratch-template/issues/01-shared-status-label.md`  | Shared status label helper     |
| `.scratch-template/issues/02-profile-status-badge.md` | Profile page badge             |
| `.scratch-template/issues/03-user-nav-status-chip.md` | User nav chip                  |

## Feature summary

Show **account status** (`active` / `inactive`) as a colored badge on the profile page and in the user nav dropdown. Session user already includes `status`; this example adds consistent labeling and UI.

## Cleanup

```bash
rm -rf .scratch/account-status-chip
# Close/delete GitHub issues created during the test
```

## Related docs

- [Issue tracker (scratch-first)](../../agents/issue-tracker.md)
- [grill-me skill](../../../.agents/skills/grill-me/SKILL.md)
- [domain-modeling skill](../../../.agents/skills/domain-modeling/SKILL.md)
- [issue tracker docs](../../agents/issue-tracker.md)
