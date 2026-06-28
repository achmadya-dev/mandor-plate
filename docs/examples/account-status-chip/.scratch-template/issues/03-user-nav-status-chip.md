# User nav dropdown status chip

Status: ready-for-agent
GitHub:

## Summary

Add a compact account status chip in the user nav dropdown (under email) so status is visible from any dashboard page.

## Acceptance criteria

- [ ] `UserNav` dropdown shows status badge below email when session user has `status.name`
- [ ] Uses the same shared status label helper as the profile page
- [ ] Chip is visually smaller than profile badge (text-xs / compact padding)
- [ ] Logged-out / loading states unchanged
- [ ] `pnpm check` passes

## References

- PRD: `.scratch/account-status-chip/PRD.md`
- Domain: CONTEXT.md
- Depends on: issue 01 (shared status label helper)
- File: `apps/web/src/components/layout/user-nav.tsx`
