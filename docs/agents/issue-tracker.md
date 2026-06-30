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

## GitHub-native issue forms

For GitHub-native planning and execution, the repo provides two issue forms under `.github/ISSUE_TEMPLATE/`:

- `parent-managed.yml` — use for a parent issue that acts as the control plane for a batch of child issues
- `execution.yml` — use for either a standalone execution issue or a child issue in a parent-managed batch

### Parent-managed issue form

Use the parent form when you need one issue to hold compact PRD sections plus child issue rollout state. Fill these sections consistently:

- `Mode`: always `parent-managed`
- `Priority`: default priority inherited by child issues unless a child overrides it
- `Feature slug`: stable short identifier for local drafting or references
- `Context`, `Goal`, `Non-goals`
- `Acceptance criteria`: feature-level done conditions
- `Child issue summary`: one parseable line per child issue
- `PR readiness rule`: exact rule for when the aggregate PR may be opened

### Execution issue form

Use the execution form for either:

- a `standalone` issue that opens its own PR when complete
- a `parent-managed-child` issue that is implemented on the parent branch and stays open until the aggregate PR merges

Fill these sections consistently:

- `Mode`
- `Parent`: required for parent-managed child issues
- `Priority`
- `Depends on`
- `Required for current parent PR`
- `What to build`
- `Acceptance criteria`
- `Implementation checklist`
- `Quality gates`

Keep labels, body fields, and comments distinct:

- labels are queryable state such as `ready-for-agent` or `in-progress`
- body fields are structured planning and execution metadata
- comments are audit trail for commits, handoff, and blockers

See `docs/agents/triage-labels.md` for the canonical execution-state, gating, and priority label vocabulary.

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

## Parent-managed publish flow

Use this flow when one local feature draft should become one parent issue plus child sub-issues on GitHub.

### Scratch inputs

Expected layout:

```text
.scratch/<feature-slug>/
├── PRD.md
└── issues/
    ├── 01-<slug>.md
    └── 02-<slug>.md
```

Parent input:

- `PRD.md` remains the planning source for parent publish
- after publish, the script writes `GitHub: #NN` back into `PRD.md`

Child input:

- use the usual scratch issue files under `issues/`
- `Status:` must be `ready-for-agent`
- `GitHub:` must be empty for unpublished issues
- `## Blocked by` may reference GitHub issues such as `#123` or earlier local draft files such as `01-setup.md`

Optional child metadata lines may be added near the top of the scratch file:

```markdown
Priority: P1
Required for current parent PR: yes
```

If omitted, the publish flow defaults to `Priority: P1` and `Required for current parent PR: yes`.

### Command

```bash
pnpm publish:parent-child <feature-slug>
```

What the command does:

1. Creates the parent issue from `PRD.md` if it has not been published yet
2. Publishes each ready child issue as a native GitHub sub-issue of that parent
3. Applies initial labels consistently:
   - parent: priority label such as `P1`
   - child: `ready-for-agent` plus a priority label
   - missing workflow labels such as `P0/P1/P2`, `in-progress`, `awaiting-parent-pr`, `cancelled`, and `hold-pr` are created or updated automatically
4. Writes `GitHub: #NN` back into the local scratch files
5. Updates the parent issue body with a parseable child issue summary that includes real GitHub issue numbers

After publish, GitHub issue bodies, labels, and comments become the operational source of truth. `.scratch/` remains a local archive or drafting artifact only.

## Implementation queue rules

Use these rules for the GitHub-native worker loop.

### Queue selection

Use:

```bash
pnpm work:next
```

The selector inspects open GitHub issues and returns the highest-priority eligible work item. It understands:

- `standalone`
- `parent-managed-child`

The selector only considers issues that are open and labeled `ready-for-agent`.

### Standalone issue rules

A standalone issue is eligible when:

- it is open
- it is labeled `ready-for-agent`

When work starts:

- move the label from `ready-for-agent` to `in-progress`
- create or switch to branch `feat/issue-<number>-<slug>`

When implementation is complete:

- keep the issue body current
- post a structured progress comment with commit, checklist updates, and quality-gate results
- open a PR immediately for that standalone issue

### Parent-managed child rules

A parent-managed child is eligible when:

- it is open
- it is labeled `ready-for-agent`
- all issues listed under `## Depends on` are satisfied

For dependency purposes, an issue is satisfied when it is:

- closed, or
- labeled `awaiting-parent-pr`

When work starts:

- move the label from `ready-for-agent` to `in-progress`
- create or switch to the shared parent branch `feat/parent-<parent-number>-<parent-slug>`

When implementation is complete:

- update the child issue body to reflect current state
- post a structured progress comment with commit, completed checklist items, and quality-gate results
- move the child from `in-progress` to `awaiting-parent-pr`
- do not open a PR per child

### Blocked handoff

If a worker cannot continue:

- keep the issue in `in-progress` when context needs to be preserved
- post a structured blocked handoff comment with blocker type, attempts made, current branch, and next action needed
- only return an issue to `ready-for-agent` when the attempt is cleanly abandoned and no special context must be preserved

### Parent locality

When several child issues are eligible in the same parent:

- stay on the shared parent branch
- prefer continuing within that parent before switching context elsewhere

The selector supports an optional parent filter:

```bash
pnpm work:next <parent-issue-number>
```

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
