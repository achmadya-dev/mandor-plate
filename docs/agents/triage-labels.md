# Triage labels

Vocabulary for GitHub issues and Sandcastle automation in Mandor Plate.

## Primary labels

| Label | When to use |
|---|---|
| `ready-for-agent` | Ticket is fully specified; an agent may implement without further clarification |
| `needs-spec` | Missing acceptance criteria or domain decisions — do not implement yet |
| `blocked` | Waiting on dependency, external decision, or upstream fix |
| `sandcastle` | Issue may be picked up by Sandcastle AFK agents (see `.sandcastle/`) |

## Workflow

1. Draft tickets live in `docs/agents/backlog.md` until the GitHub remote exists
2. Publish with `gh issue create --label ready-for-agent` (see backlog conventions)
3. Run `setup-matt-pocock-skills` once after clone to configure issue tracker preferences
4. Sandcastle filters on the `sandcastle` label when using GitHub Issues mode

## Issue body checklist

- Link to PRD user story or backlog ticket (MP-00N)
- Acceptance criteria as checkboxes
- Note blockers (e.g. "Blocked by MP-004")
- For auth/file work: reference `docs/agents/domain.md`

## Sandcastle integration

- Default issue tracker: GitHub Issues (`--issue-tracker github-issues` in `.sandcastle/`)
- Optional label: `sandcastle` — create via `sandcastle init --create-label true` if desired
- Agent prompt template: `.sandcastle/prompt.md`
