# Mandor Plate

Full-stack monorepo (NestJS API + Next.js dashboard). See [README.md](./README.md) for quickstart and dev workflow.

## Agent skills

### Issue tracker

GitHub Issues via `gh` CLI; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The repo uses both canonical triage roles and GitHub-native workflow state labels. See `docs/agents/triage-labels.md` for:

- intake labels such as `needs-triage` and `ready-for-agent`
- execution labels such as `in-progress`, `awaiting-parent-pr`, and `cancelled`
- parent gating label `hold-pr`
- priority labels `P0`, `P1`, `P2`

### Domain docs

Single-context — `CONTEXT.md` at repo root + `docs/adr/`. See `docs/agents/domain.md`.
