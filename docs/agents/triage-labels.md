# Triage Labels

The repo uses two related label vocabularies:

1. triage labels for intake and routing
2. workflow labels for agent execution state

Keep these small and stable. Labels should carry queryable state, not rich planning metadata.

## Canonical triage roles

The skills speak in terms of five canonical triage roles. This table maps those roles to the actual label strings used in this repo's issue tracker.

| Default label     | Label in our tracker | Meaning                                  |
| ----------------- | -------------------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`      | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human` | `ready-for-human`    | Requires human implementation            |
| `wontfix`         | `wontfix`            | Will not be actioned                     |

When a skill mentions a role such as "apply the AFK-ready triage label", use the corresponding label string from this table.

## Workflow labels

These labels support the GitHub-native execution workflow.

### Execution state labels

| Label                | Meaning                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `ready-for-agent`    | Eligible to be picked up by an agent                                    |
| `in-progress`        | Currently being worked on by an agent or human                          |
| `awaiting-parent-pr` | Implemented on the parent branch and waiting for the aggregate PR merge |
| `cancelled`          | No longer active work; preserved for audit trail                        |

### Parent gating labels

| Label     | Meaning                                                       |
| --------- | ------------------------------------------------------------- |
| `hold-pr` | Prevent opening the aggregate parent PR even if children pass |

### Priority labels

| Label | Meaning                  |
| ----- | ------------------------ |
| `P0`  | Highest priority work    |
| `P1`  | Default planned priority |
| `P2`  | Lower priority work      |

## Mutual exclusivity

These labels should be treated as mutually exclusive for one issue at one time:

- `ready-for-agent`
- `in-progress`
- `awaiting-parent-pr`
- `cancelled`

Priority labels should also be mutually exclusive:

- `P0`
- `P1`
- `P2`

`hold-pr` may coexist with other labels because it is a parent-level gate, not an execution state.

## Expected state transitions

### Standalone issue

- intake or drafting state
- `ready-for-agent`
- `in-progress`
- PR opened
- issue closes through PR closing keywords on merge

### Parent-managed child issue

- intake or drafting state
- `ready-for-agent`
- `in-progress`
- `awaiting-parent-pr`
- issue closes only after the included parent PR merges

### Cancelled work

Cancelled work should:

- lose active execution labels such as `ready-for-agent`, `in-progress`, or `awaiting-parent-pr`
- gain `cancelled`
- stay visible on the parent issue if it belongs to a parent-managed batch

## Labels vs body fields vs comments

Use each surface for a different kind of state:

- labels: queryable execution state, hold state, and priority
- body fields: mode, parent reference, dependencies, inclusion in current parent PR, acceptance criteria, implementation checklist, and quality gates
- comments: audit trail such as commit updates, blocker handoff, and reconciliation notes

Do not encode dependencies, checklist state, or PR inclusion only in labels.
