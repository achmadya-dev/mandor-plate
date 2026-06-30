# Happy Path: Parent/Child Workflow

Use this when one feature should be planned and delivered as:

- one parent GitHub issue
- several child GitHub sub-issues
- one aggregate parent PR

## 1. Draft locally

Create:

```text
.scratch/<feature-slug>/
├── PRD.md
└── issues/
    ├── 01-<slug>.md
    └── 02-<slug>.md
```

Requirements:

- `PRD.md` contains the feature plan
- each child issue file has `Status: ready-for-agent`
- optional child metadata may be added near the top:

```markdown
Priority: P1
Required for current parent PR: yes
```

## 2. Publish parent and child issues

```bash
pnpm publish:parent-child <feature-slug>
```

This creates:

- one parent issue
- child issues as native GitHub sub-issues
- parent child-summary lines in the parent issue body

After this step, GitHub is the operational source of truth.

## 3. Pick the next eligible work item

```bash
pnpm work:next
```

Or, to stay within one parent:

```bash
pnpm work:next <parent-issue-number>
```

The selector returns:

- issue number
- mode
- recommended branch name
- dependency status
- progress comment template
- blocked handoff template

## 4. Start child work

For the selected child issue:

- move label `ready-for-agent` -> `in-progress`
- switch to the recommended branch

For parent-managed child issues, use the shared parent branch:

```text
feat/parent-<parent-number>-<parent-slug>
```

For standalone issues, use:

```text
feat/issue-<issue-number>-<issue-slug>
```

## 5. Finish child work

When a parent-managed child is complete:

- update the issue body
- post a structured progress comment
- move label `in-progress` -> `awaiting-parent-pr`

When a standalone issue is complete:

- update the issue body
- post a structured progress comment
- open a PR immediately for that standalone issue

## 6. Open the aggregate parent PR

Check eligibility first:

```bash
pnpm pr:open-parent <parent-issue-number> --dry-run
```

If the dry-run succeeds, open the PR:

```bash
pnpm pr:open-parent <parent-issue-number>
```

The parent PR will only open when:

- the parent is not labeled `hold-pr`
- every child with `Required for current parent PR: yes` is complete
- the current branch matches the shared parent branch shape

## 7. Merge and reconcile

After the parent PR merges:

- GitHub Action `reconcile-parent-pr.yml` should run automatically
- included complete child issues are closed
- the parent issue is updated and closed when eligible

Fallback manual reconciliation:

```bash
pnpm reconcile:parent-pr <pr-number>
```

Dry-run mode:

```bash
pnpm reconcile:parent-pr <pr-number> --dry-run
```

## Rules to keep the workflow healthy

- Do not open the parent PR manually if `pnpm pr:open-parent ... --dry-run` fails.
- Do not leave completed child issues labeled `ready-for-agent`.
- Use `awaiting-parent-pr` for completed parent-managed child work waiting on the aggregate PR merge.
- Treat GitHub issue bodies, labels, and comments as the live source of truth after publish.
