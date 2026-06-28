# PRD: Account status chip

## Problem

Admins and users cannot see account status (`active` / `inactive`) at a glance in the dashboard. Role is shown on the profile page, but status is hidden unless you open the users admin table.

## Goal

Surface account status in two places for the signed-in user:

1. Profile page — badge next to role
2. User nav dropdown — small status chip under email

## Vertical slices

| #   | Slice                                       | Apps                          |
| --- | ------------------------------------------- | ----------------------------- |
| 1   | Shared status label + badge variant mapping | `packages/shared`, `apps/web` |
| 2   | Profile page status badge                   | `apps/web`                    |
| 3   | User nav status chip                        | `apps/web`                    |

## Out of scope

- Admin users table changes
- Editing status from profile
- Email notifications for inactive accounts

## Acceptance criteria (feature-level)

- [ ] Active accounts show a green-leaning badge; inactive show muted/destructive styling
- [ ] Profile and user nav use the same label text and colors
- [ ] No new API endpoints — use existing session user payload
- [ ] Unit test for shared status display helper

## References

- Domain: `CONTEXT.md` (User, Role, Session)
- Web conventions: `apps/web/README.md`
