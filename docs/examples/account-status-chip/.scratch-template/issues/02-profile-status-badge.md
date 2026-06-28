# Profile page account status badge

Status: ready-for-agent
GitHub:

## Summary

Show account status on the profile page using the shared status label helper, displayed alongside the existing role badge.

## Acceptance criteria

- [ ] Profile sidebar card shows status badge when `user.status.name` is present
- [ ] Account details section "Status" row uses the same helper (replace plain text if any)
- [ ] Badge styling matches helper `variant`; capitalize label via helper
- [ ] No layout regression on mobile (`pnpm --filter @mandor-plate/web test` or manual check documented in issue comment)
- [ ] `pnpm check` passes

## References

- PRD: `.scratch/account-status-chip/PRD.md`
- Domain: CONTEXT.md
- Depends on: issue 01 (shared status label helper)
- File: `apps/web/src/features/profile/components/profile-view-page.tsx`
