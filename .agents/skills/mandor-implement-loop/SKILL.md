---
name: mandor-implement-loop
description: >-
  Autonomously implement the next GitHub epic issue (label ready-for-agent),
  commit one child issue per run, push an epic branch, and open one pull request
  only after every child issue is implemented.
---

# Mandor Implement Loop

Implement GitHub epic issues that are marked with `ready-for-agent`. This skill is the worker workflow; a human, cron job, webhook receiver, or external scheduler may invoke it.

Each run implements at most one child issue from the epic. The epic keeps one branch; later runs add more child-issue commits to that same branch. **Do not open the pull request until every child issue is implemented. Do not merge the pull request automatically. Do not close the source issue before the pull request is merged.**

GitHub Issues are the source of truth — see [`docs/agents/issue-tracker.md`](../../../docs/agents/issue-tracker.md). Do not use local draft files for this loop.

## Before each iteration

1. Read [README.md](../../../README.md) → Dev workflow
2. Read [CONTEXT.md](../../../CONTEXT.md) for ubiquitous language
3. Find the next epic work item:

```bash
gh issue list --label ready-for-agent --label epic --state open --json number,title --jq '.[0]'
```

4. Load the epic issue body and comments.
5. Extract child issue numbers from the epic body. Prefer a section named `Implementation issues`, `Child issues`, or `Tasks`.
6. Load each child issue body and comments with `gh issue view <number> --comments`.
7. Find the existing epic branch if one exists. Use branch commits and issue comments to determine which child issues are already implemented.

## Per epic

1. Use one feature branch prefixed with `feat/` based on the epic title/slug. Create it if this is the first child issue; otherwise check out the existing remote branch for the epic.
2. Do not open a pull request while any child issue remains unimplemented.
3. Pick the first child issue from the epic that has not already been implemented on the epic branch.
4. Implement only that child issue in this run:
   - Read its acceptance criteria from the GitHub issue body and comments
   - Implement that vertical slice
   - Run the focused checks that make sense for the touched area
   - Make one atomic commit: `feat|fix|chore(scope): #NN — child issue title`
   - Push the branch
   - Comment on the child issue with the commit/branch link
   - Comment on the epic issue with progress
5. If all child issues are now implemented:
   - Run `pnpm check`
   - Open one pull request to `main` for the epic with `gh pr create`
   - Include `Refs #<epic>` and `Closes #<child>` lines for every completed child issue in the PR body
   - Include the final check summary in the PR body
   - Remove `ready-for-agent` from the epic with `gh issue edit <epic-number> --remove-label ready-for-agent`
   - Add `ready-for-human` to the epic with `gh issue edit <epic-number> --add-label ready-for-human`
   - Comment on the epic that implementation is complete and the PR is ready for human review

Do **not** merge the PR, even if all checks pass. Do **not** close the epic issue before the PR has been merged. Let GitHub close child issues through the PR body when the PR merges.

## Stop condition

When no open GitHub epic issues with labels `ready-for-agent` and `epic` have a remaining unimplemented child issue, stop the loop and report completion. Do not invent new work unless the user asks.

## Invocation

Invoke **mandor-implement-loop** directly when a GitHub epic issue is ready for implementation.

For webhook mode, configure the webhook receiver to invoke **mandor-implement-loop** after validating a GitHub `issues.labeled` event where the label is `ready-for-agent`. The webhook is only the trigger; this skill remains the implementation workflow.

For scheduler mode, configure the scheduler outside this skill and invoke **mandor-implement-loop** on each wake.

Use this prompt payload when the runner needs an explicit instruction:

```json
{
  "prompt": "Run the mandor-implement-loop workflow for Mandor Plate. Find the next open GitHub epic issue with labels ready-for-agent and epic (`gh issue list --label ready-for-agent --label epic --state open`). Read the epic body/comments and its linked child issues from GitHub as the source of truth. Read README.md (Dev workflow) and CONTEXT.md. Use one feature branch per epic. If the epic already has a branch, continue it. Do not open a PR while any child issue remains unimplemented. Pick the first child issue from the epic that is not already implemented in branch commits or issue comments. Implement only that child issue in this run, make one atomic commit using the child issue number in the commit message, run focused checks, push the branch, and comment on the child and epic with progress. If all child issues are implemented, run pnpm check, open one PR to main for the epic, add Refs for the epic and Closes lines for every completed child issue, remove ready-for-agent from the epic, add ready-for-human to the epic, and comment that the epic is ready for human review. Do not merge the PR. Do not close the epic before the PR is merged. Stop when no ready-for-agent epic has remaining unimplemented child issues."
}
```
