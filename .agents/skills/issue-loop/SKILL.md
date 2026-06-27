---
name: issue-loop
description: >-
  Autonomously implement the next open GitHub issue (label ready-for-agent) or
  local .scratch issue, run quality gates, and commit. Use with Cursor /loop
  for batch issue runs.
---

# Issue Loop — Mandor Plate

Work through open issues one at a time. Pair with the Cursor **loop** skill for recurring autonomous runs.

## Before each iteration

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for ubiquitous language
3. Find the next work item:
   - **GitHub (default):** `gh issue list --label ready-for-agent --state open`
   - **Local fallback:** `.scratch/<feature>/issues/*.md` with `Status: ready-for-agent`

## Per issue

1. Read the issue body and acceptance criteria
2. Implement the vertical slice (API + web + `packages/shared` + tests as needed)
3. Run `pnpm check`
4. Make one atomic commit: `feat|fix|chore(scope): #NN — title` (GitHub) or reference the scratch file slug
5. **GitHub:** comment on the issue with what was done; close if all criteria met (`gh issue close N`)
6. **Scratch:** update `Status:` in the issue file

## Stop condition

When no open `ready-for-agent` issues remain, stop the loop and report completion. Do not invent new work unless the user asks.

## Usage with /loop

```
/loop /issue-loop
/loop 30m /issue-loop
```

Dynamic mode (no interval) lets the agent choose when the next iteration is worthwhile.
