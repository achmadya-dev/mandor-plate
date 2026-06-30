---
name: mandor-implement-loop
description: >-
  Autonomously implement the next published GitHub issue (label ready-for-agent),
  sync the linked .scratch file, run quality gates, and commit.
---

# Mandor Implement Loop

Implement published GitHub issues that are marked with `ready-for-agent`. This skill is the worker workflow; a human, webhook receiver, or external scheduler may invoke it.

Planning is scratch-first — see [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md). **Do not implement from scratch files that have no `GitHub: #NN` line** (publish via **mandor-publish** first).

## Before each iteration

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for ubiquitous language
3. Find the next work item:

```bash
gh issue list --label ready-for-agent --state open --json number,title --jq '.[0]'
```

4. Load the linked scratch file (if any) by searching `.scratch/**/issues/*.md` for `GitHub: #<number>`. Prefer the scratch file for acceptance criteria; fall back to the GitHub body if no link exists.

## Per issue

1. Create and switch to a new feature branch prefixed with `feat/` (e.g., `feat/<slug>`) based on the issue title/slug.
2. Read acceptance criteria (scratch file first, then GitHub issue body)
3. Implement the vertical slice (API + web + `packages/shared` + tests as needed)
4. Run `pnpm check`
5. Make one atomic commit: `feat|fix|chore(scope): #NN — title`
6. **GitHub:** comment on the issue with what was done
7. **Scratch (if linked):** check off completed acceptance criteria (`[x]`)
8. If all criteria met:
   - **GitHub:** `gh issue close N --comment "..."`
   - **Scratch:** set `Status: done`

## Stop condition

When no open GitHub issues with label `ready-for-agent` remain, stop the loop and report completion. Do not invent new work unless the user asks.

## Invocation

Invoke **mandor-implement-loop** directly when a published issue is ready for implementation.

For webhook mode, configure the webhook receiver to invoke **mandor-implement-loop** after validating a GitHub `issues.labeled` event where the label is `ready-for-agent`. The webhook is only the trigger; this skill remains the implementation workflow.

For scheduler mode, configure the scheduler outside this skill and invoke **mandor-implement-loop** on each wake.

Use this prompt payload when the runner needs an explicit instruction:

```json
{
  "prompt": "Run the mandor-implement-loop workflow for Mandor Plate. Find the next open ready-for-agent GitHub issue (`gh issue list --label ready-for-agent --state open`). Load the linked scratch file if `GitHub: #NN` exists under `.scratch/**/issues/`. Do not implement unpublished scratch issues (empty GitHub line) — user must run mandor-publish first. Read README.md (Dev workflow) and CONTEXT.md. Create and switch to a new feature branch prefixed with `feat/` (e.g., `feat/<slug>`) based on the issue title/slug. Implement the vertical slice per acceptance criteria (API + web + packages/shared + tests as needed). Run `pnpm check`. Make one atomic commit: `feat|fix|chore(scope): #NN — title`. Comment on GitHub; check off criteria in scratch; close GitHub issue and set scratch Status: done when complete. Stop when no ready-for-agent GitHub issues remain."
}
```
