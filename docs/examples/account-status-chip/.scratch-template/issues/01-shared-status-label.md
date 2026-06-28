# Shared account status label helper

Status: ready-for-agent
GitHub:

## Summary

Add a small shared helper that maps `status.name` (`active` | `inactive`) to display label and badge variant for the web app. Keeps profile and user nav consistent.

## Acceptance criteria

- [ ] Export `getAccountStatusDisplay(status)` from `apps/web` (or `packages/shared` if a pure string map) returning `{ label, variant }`
- [ ] `active` → label "Active", variant suitable for success/active styling
- [ ] `inactive` → label "Inactive", variant suitable for muted/inactive styling
- [ ] Unit test covers both statuses and unknown/missing status fallback
- [ ] `pnpm check` passes

## References

- PRD: `.scratch/account-status-chip/PRD.md`
- Domain: CONTEXT.md
- Existing: `packages/shared/src/user/role.ts` (`statusSchema`)
