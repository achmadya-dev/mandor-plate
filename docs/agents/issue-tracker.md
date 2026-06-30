# Issue Tracker: GitHub

Issues for this repo live on **GitHub Issues** (`gh` CLI). The automated loop reads GitHub directly.

## Work Shape

Use one epic issue per feature and one child issue per implementation slice.

| Item         | Location      | Labels                          | Purpose                                                         |
| ------------ | ------------- | ------------------------------- | --------------------------------------------------------------- |
| Epic issue   | GitHub Issues | `epic`, `ready-for-agent`       | Defines the feature and groups children                         |
| Child issue  | GitHub Issues | Optional, usually no loop label | Defines one commit-sized vertical slice                         |
| Pull request | GitHub PRs    | N/A                             | One PR per epic, opened only after all children are implemented |

The loop only picks epic issues that are open and have both `epic` and `ready-for-agent`.

## Epic Format

Create the epic directly in GitHub. Include child issue links in a dedicated section:

```markdown
## Summary

<feature goal and relevant context>

## Implementation issues

- #123
- #124
- #125

## Acceptance

- [ ] The linked child issues are implemented
- [ ] `pnpm check` passes
- [ ] One PR is opened for this epic
- [ ] One commit exists per child issue
```

Accepted child section headings:

- `Implementation issues`
- `Child issues`
- `Tasks`

## Child Issue Format

Each child issue should be small enough for one atomic commit:

```markdown
## Summary

<one vertical slice>

## Acceptance criteria

- [ ] ...

## References

- Epic: #122
```

## GitHub Conventions

- **Find next epic**: `gh issue list --label ready-for-agent --label epic --state open --json number,title --jq '.[0]'`
- **Read an issue**: `gh issue view <number> --comments`
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments`
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v`; `gh` does this automatically when run inside a clone.

## Implementation Contract

`mandor-implement`:

1. Finds the next open epic labeled `epic` and `ready-for-agent`.
2. Reads the epic body/comments and linked child issues.
3. Creates or reuses one feature branch for the epic.
4. Does not open a PR while any child issue remains unimplemented.
5. Implements only the next unimplemented child issue in each run.
6. Makes one atomic commit for that child issue.
7. Pushes the branch and comments progress on the child issue and epic.
8. Runs `pnpm check` after all child issues are implemented.
9. Opens one PR with `Refs #<epic>` and `Closes #<child>` lines for every child issue.
10. Removes `ready-for-agent` from the epic so cron does not keep triggering it.
11. Adds `ready-for-human` to the epic and comments that the PR is ready for human review.

The loop does **not** merge PRs and does **not** close the epic before the PR is merged.

## Pull Requests As A Triage Surface

**PRs as a request surface: no.**

When set to `yes`, external PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`)
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`

GitHub shares one number space across issues and PRs, so a bare `#42` may be either; resolve with `gh pr view 42` and fall back to `gh issue view 42`.
