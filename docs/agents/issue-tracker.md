# Issue tracker: GitHub

Issues and PRDs for this repo live on **GitHub Issues** (`gh` CLI). **All planning drafts start in `.scratch/`** (gitignored) before anything is published.

## Create vs publish

| Action         | Skill              | Writes to                         |
| -------------- | ------------------ | --------------------------------- |
| Draft PRD      | **mandor-prd**     | `.scratch/<feature>/PRD.md`       |
| Draft issues   | **mandor-issues**  | `.scratch/<feature>/issues/*.md`  |
| Publish issues | **mandor-publish** | GitHub Issues (`gh issue create`) |

Create skills **never** call `gh`. Publish skill **never** drafts new scratch files.

| Stage           | Location                                        | Committed?      |
| --------------- | ----------------------------------------------- | --------------- |
| PRD draft       | `.scratch/<feature-slug>/PRD.md`                | No              |
| Issue draft     | `.scratch/<feature-slug>/issues/<NN>-<slug>.md` | No              |
| Published issue | GitHub Issues                                   | Yes (on GitHub) |

### Scratch layout

```
.scratch/<feature-slug>/
├── PRD.md
└── issues/
    ├── 01-<slug>.md
    └── 02-<slug>.md
```

### Scratch issue file format

```markdown
# <title>

Status: draft
GitHub:

## Summary

<one paragraph vertical slice goal>

## Acceptance criteria

- [ ] ...

## References

- PRD: `.scratch/<feature-slug>/PRD.md`
- Domain: CONTEXT.md
```

**Status values:** `draft` → `ready-for-agent` (ready to publish) → update `GitHub: #NN` after publish.

## Publish flow

1. **Draft** — write or update the file under `.scratch/<feature-slug>/issues/`
2. **Review** — set `Status: ready-for-agent` when acceptance criteria are complete
3. **Publish** — only then. Use the `#` line for `--title`. For the body, pass everything from `## Summary` onward (omit `Status:`, `GitHub:`, and the `#` title line):

```bash
gh issue create \
  --title "<title from # heading>" \
  --body "$(sed -n '/^## Summary/,$p' .scratch/<feature-slug>/issues/<NN>-<slug>.md)" \
  --label "ready-for-agent"
```

4. **Link back** — record the issue number in the scratch file: `GitHub: #42`

Do not skip step 1–2. If an issue already exists on GitHub without a scratch file, create the scratch file from the GitHub body before editing or republishing.

## GitHub conventions

- **Publish an issue**: via **mandor-publish** and the publish flow above
- **Read an issue**: `gh issue view <number> --comments`
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Pull requests as a triage surface

**PRs as a request surface: no.**

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`)
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Use **mandor-publish** (not **mandor-issues**):

1. Ensure the scratch file exists and `Status:` is `ready-for-agent`
2. Run `gh issue create` using the publish flow above
3. Write `GitHub: #NN` back into the scratch file

## When a skill says "fetch the relevant ticket"

- **Scratch path given** — read `.scratch/<feature-slug>/issues/<NN>-<slug>.md`
- **GitHub number given** — run `gh issue view <number> --comments`; prefer the linked scratch file if `GitHub: #NN` is recorded locally
