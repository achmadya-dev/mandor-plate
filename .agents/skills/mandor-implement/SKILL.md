---
name: mandor-implement
description: >-
  Implement the next GitHub epic issue that is ready for the agent. Each run
  implements one child issue on the epic branch; the PR is opened only after
  every child issue is implemented.
---

# Mandor Implement

Implement GitHub epic issues that are marked with `ready-for-agent`. This is the implementation worker for cron or direct invocation.

Each run implements at most one child issue from the epic. The epic keeps one branch; later runs add more child-issue commits to that same branch. Do not open the pull request until every child issue is implemented. Do not merge the pull request automatically. Do not close the epic before the pull request is merged.

GitHub Issues are the source of truth. Read [docs/agents/issue-tracker.md](../../../docs/agents/issue-tracker.md) and [CONTEXT.md](../../../CONTEXT.md) before coding.

## Testing mode

Prefer TDD where it helps:

- tests verify behavior through public interfaces
- work in vertical slices, one behavior at a time
- run focused tests during progress
- run `pnpm check` after all child issues in the epic are implemented

Do not write speculative tests in bulk before implementation.

## Before each run

1. Read [README.md](../../../README.md) for the current workflow.
2. Read [CONTEXT.md](../../../CONTEXT.md) for terminology.
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
   - read its acceptance criteria from the GitHub issue body and comments
   - implement that vertical slice
   - run the focused checks that make sense for the touched area
   - make one atomic commit: `feat|fix|chore(scope): #NN — child issue title`
   - push the branch
   - comment on the child issue with the commit/branch link
   - comment on the epic issue with progress
5. If all child issues are now implemented:
   - run `pnpm check`
   - open one pull request to `main` for the epic with `gh pr create`
   - include `Refs #<epic>` and `Closes #<child>` lines for every completed child issue in the PR body
   - include the final check summary in the PR body
   - remove `ready-for-agent` from the epic with `gh issue edit <epic-number> --remove-label ready-for-agent`
   - add `ready-for-human` to the epic with `gh issue edit <epic-number> --add-label ready-for-human`
   - comment on the epic that implementation is complete and the PR is ready for human review

Use normal GitHub review before merge.
