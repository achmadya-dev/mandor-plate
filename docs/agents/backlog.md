# Backlog: Mandor Plate

Issues for this repo are tracked here as draft tickets until the GitHub remote is initialized. Each ticket is a **vertical slice** (tracer bullet) that cuts through every integration layer end-to-end — not a horizontal layer task.

**Parent:** [PRD.md](../../PRD.md)

## Conventions

When the GitHub remote exists, publish each ticket with:

```bash
gh issue create --title "MP-00N: <title>" --body-file docs/agents/tickets/MP-00N.md --label "ready-for-agent"
```

Until then, execute tickets in dependency order using the bodies below.

### Dependency graph

```
MP-001 ─┬─► MP-002 ──┐
        ├─► MP-003 ──┼─► MP-004 ─┬─► MP-005
        └─► MP-009   │            ├─► MP-006
                     │            ├─► MP-007 ──► MP-008
                     │            └─► (MP-008 also needs MP-004)
                     │
MP-001 ──────────────┴─► MP-010 (lint/typecheck early; E2E stage completes in MP-011)
MP-004…MP-008 ─────────► MP-011
```

### Parallel work opportunities

| After completing | Can start in parallel                                      |
| ---------------- | ---------------------------------------------------------- |
| MP-001           | MP-002, MP-003, MP-009, MP-010 (lint/typecheck stage only) |
| MP-004           | MP-005, MP-006, MP-007                                     |
| MP-007           | MP-008                                                     |

---

## MP-001: Monorepo foundation and API production core

**Blocked by:** None — can start immediately

**User stories covered:** 1, 9, 10, 11–22, 44, 45, 51

### What to build

Bootstrap the monorepo and deliver a running NestJS API with PostgreSQL, stripped of out-of-scope modules. A developer runs infrastructure containers, starts the API, and authenticates via direct HTTP — proving the backend production core works before any frontend integration.

End-to-end behavior:

1. Clone repo, install dependencies, copy environment template.
2. Start PostgreSQL and Maildev via root Docker Compose.
3. Start the API dev server via Turborepo.
4. Migrations run and a default admin user is seeded.
5. Email login against the API returns access and refresh tokens with user role.
6. Swagger docs are reachable.
7. Adapted API auth unit and integration tests pass.

Includes removing Mongoose/MongoDB dual-database support and the i18n module from the upstream NestJS boilerplate.

### Acceptance criteria

- [x] pnpm workspace monorepo with Turborepo configured at the root
- [x] API application lives under the apps directory, derived from brocoders/nestjs-boilerplate
- [x] Mongoose, MongoDB configuration, and nestjs-i18n module fully removed with no dead imports
- [x] Root Docker Compose starts PostgreSQL and Maildev; documented ports match API mail configuration
- [x] Environment variable template documents all required API configuration
- [x] `pnpm docker:up` starts infrastructure; `pnpm dev` starts the API dev server
- [x] TypeORM migrations run successfully against PostgreSQL
- [x] Seeded default admin user exists and can log in via the email login endpoint
- [x] Swagger documentation is accessible in development
- [x] Retained modules work: email auth, admin/user roles, nodemailer, local file upload, Google OAuth endpoint, stubbed Facebook/Apple OAuth, token refresh
- [x] Adapted API auth unit tests and API-level E2E/integration tests pass

---

## MP-002: Shared validation contracts

**Blocked by:** MP-001

**User stories covered:** 39

### What to build

Create the shared package exporting Zod schemas and inferred TypeScript types for the auth and user domains. Both applications consume this package as the single validation contract boundary.

End-to-end behavior:

1. Shared package builds independently.
2. Auth request schemas validate login, register, forgot-password, and reset-password payloads.
3. User schemas include profile shape and role enum (admin, user).
4. API application imports shared schemas for input validation on auth endpoints.
5. Unit tests assert valid input passes and invalid input is rejected with meaningful errors.

### Acceptance criteria

- [x] Shared package exists under the packages directory with its own build configuration
- [x] Zod schemas exported for login, register, forgot password, reset password requests
- [x] Zod schemas exported for user profile and role enum (admin, user)
- [x] TypeScript types inferred from schemas and re-exported
- [x] API application depends on the shared package and uses schemas on auth endpoints
- [x] Unit tests cover valid and invalid inputs for every exported schema
- [x] Shared package builds and tests pass via root `pnpm test`

---

## MP-003: Dashboard shell without Clerk

**Blocked by:** MP-001

**User stories covered:** 23, 26–31, 37, 38, 40, 41

### What to build

Import the Next.js dashboard starter, remove all Clerk and third-party auth dependencies, and verify the dashboard shell renders. The web application starts cleanly and displays the layout, themes, charts, tables, and Command+K navigation — without authentication wired yet.

End-to-end behavior:

1. Web application lives under the apps directory, derived from the shadcn dashboard starter.
2. Clerk, Clerk Organizations, Clerk Billing, and Sentry fully removed — no runtime errors from missing Clerk keys.
3. Dashboard layout (sidebar, header, content area) renders on a public dev route.
4. Theme switcher, sample charts, data tables, and Command+K still function.
5. OxLint/Oxfmt replaced by the root ESLint and Prettier configuration.
6. Turborepo `pnpm dev` starts both API and web in parallel.

### Acceptance criteria

- [x] Web application starts without Clerk, Sentry, or billing environment variables
- [x] No Clerk imports, middleware, or provider wrappers remain
- [x] Dashboard layout with sidebar and header renders correctly
- [x] Theme switcher works with multiple themes
- [x] Sample analytics charts and data tables render
- [x] Command+K navigation opens and lists routes
- [x] TanStack Form, TanStack Query, and Zod patterns preserved in existing demo pages
- [x] Web application uses root ESLint and Prettier configuration (OxLint/Oxfmt removed)
- [x] Environment variable template documents required web configuration
- [x] Root `pnpm dev` starts API and web concurrently via Turborepo

---

## MP-004: Email authentication end-to-end

**Blocked by:** MP-002, MP-003

**User stories covered:** 2, 24, 33–35, 42–43, 61–62, 67–68

### What to build

Deliver the first complete tracer bullet: a user registers or logs in through the web application, tokens are stored in httpOnly cookies via BFF route handlers, middleware protects dashboard routes, and the session persists across page refresh.

End-to-end behavior:

1. User opens the login page and submits email and password.
2. Browser posts to a web auth route handler (BFF), which proxies to the NestJS email login endpoint.
3. On success, BFF sets access and refresh tokens in httpOnly cookies and returns user data.
4. User is redirected to the dashboard.
5. Middleware blocks unauthenticated access to protected routes and redirects to login.
6. Page refresh maintains the session via cookie-based token refresh.
7. User registers a new account via the registration page — same BFF pattern.
8. User logs out — cookies cleared, redirected to login.
9. Expired or missing session redirects to login from protected routes.

Forms use shared Zod schemas from the shared package. Browser never sends credentials directly to the NestJS API.

### Acceptance criteria

- [x] BFF route handlers exist for login, register, logout, refresh, and current-user
- [x] Successful auth responses set access and refresh tokens in httpOnly cookies with secure attributes
- [x] Login page renders and submits via TanStack Form with shared Zod validation
- [x] Registration page renders and creates a new user through the BFF
- [x] Next.js middleware protects dashboard routes; unauthenticated requests redirect to login
- [x] Authenticated user reaches the dashboard after login
- [x] Session persists across browser page refresh
- [x] Logout clears cookies and redirects to login
- [x] Server-side API calls inject Authorization header from cookies
- [x] Documented pattern for authenticated client-side data fetching through the BFF
- [x] Integration tests verify BFF proxy behavior, cookie setting, and error forwarding
- [x] Tokens are never stored in localStorage or exposed to client-side JavaScript

---

## MP-005: Password recovery flow

**Blocked by:** MP-004

**User stories covered:** 15, 64

### What to build

A user who forgot their password requests a reset email, receives it in Maildev, follows the reset link, sets a new password, and logs in with the new credentials — full stack from UI through BFF to API and mail delivery.

End-to-end behavior:

1. User submits email on the forgot-password page.
2. BFF proxies to the API forgot-password endpoint; nodemailer sends email captured by Maildev.
3. User clicks the reset link in the email, landing on the reset-password page with token.
4. User submits a new password; BFF proxies to the API reset endpoint.
5. User logs in with the new password successfully.

### Acceptance criteria

- [x] Forgot-password page renders and submits through the BFF
- [x] Reset-password page accepts token from URL and submits new password through the BFF
- [x] Password reset email arrives in Maildev during local development
- [x] Reset link from email leads to a working reset form
- [x] User can log in with the new password after reset
- [x] Invalid or expired reset token shows a clear error state
- [x] Forms validated with shared Zod schemas

---

## MP-006: Google social sign-in

**Blocked by:** MP-004

**User stories covered:** 7, 19, 20, 25, 63

### What to build

A user clicks "Sign in with Google" on the login page, completes OAuth, and lands on the authenticated dashboard with session cookies set — without email/password.

End-to-end behavior:

1. Login page displays a Google sign-in button.
2. OAuth flow completes via BFF proxy to the NestJS Google auth endpoint.
3. Session cookies are set; user reaches the dashboard.
4. Facebook and Apple OAuth remain stubbed and disabled unless enabled via environment configuration.

### Acceptance criteria

- [x] Google sign-in button visible on the login page
- [x] OAuth flow completes and sets httpOnly session cookies
- [x] Authenticated user reaches the dashboard after Google sign-in
- [x] Facebook and Apple providers are present in the API but disabled by default
- [x] Enabling Facebook or Apple requires only environment configuration, not code changes
- [x] OAuth error states display a clear message on the login page

---

## MP-007: Role-based navigation

**Blocked by:** MP-004

**User stories covered:** 12, 32, 65

### What to build

Dashboard navigation filters menu items based on the authenticated user's role from the NestJS API. Admin users see admin-only items; regular users see a reduced menu.

End-to-end behavior:

1. After login, the BFF current-user endpoint returns the user's role.
2. Navigation component filters menu items by role (admin vs user).
3. Admin user sees admin-only navigation entries.
4. Regular user does not see admin-only entries.
5. Direct URL access to admin-only pages returns forbidden or redirects for unauthorized roles.

### Acceptance criteria

- [x] Navigation reads role from the authenticated session (current-user BFF endpoint)
- [x] Admin role sees all navigation items including admin-only entries
- [x] User role sees only permitted navigation items
- [x] Admin-only routes reject or redirect non-admin users
- [x] Navigation updates correctly after login without manual page reload
- [x] Test coverage verifies menu filtering by role (component or E2E)

---

## MP-008: Profile and avatar upload

**Blocked by:** MP-004

**User stories covered:** 8, 16, 36, 66

### What to build

An authenticated user opens profile/settings, uploads an avatar image, and sees it displayed — exercising the file upload API through the BFF with local storage in development.

End-to-end behavior:

1. User navigates to profile/settings from the dashboard.
2. User selects an image file and uploads via the BFF proxy to the API file upload endpoint.
3. API stores the file locally (default driver) and returns the file URL.
4. Avatar displays on the profile page.
5. S3 storage remains available via environment opt-in without code changes.

### Acceptance criteria

- [x] Profile or settings page accessible from the dashboard navigation
- [x] Avatar upload form submits through the BFF to the API file upload endpoint
- [x] Uploaded avatar image displays on the profile page
- [x] Local file storage works in development without cloud credentials
- [x] S3 driver configurable via environment variable without code changes
- [x] Upload errors (file too large, invalid type) show clear user-facing messages
- [x] Only authenticated users can upload to their own profile

---

## MP-009: Agent tooling bundle

**Blocked by:** MP-001

**User stories covered:** 4, 5, 52–60

### What to build

Install the curated agent skills, initialize sandcastle, and scaffold agent documentation templates so AI-assisted development workflows are ready from day one.

End-to-end behavior:

1. Twenty-five upstream skills from mattpocock/skills installed under the agent skills directory.
2. Three project-specific skill templates created with repo-aware context.
3. Sandcastle initialized with Docker as the default sandbox provider.
4. CONTEXT.md template exists at the repo root.
5. Agent documentation covers triage labels and domain conventions.
6. A developer runs the sandcastle command and the setup skill successfully.

Skills to install:

- **Engineering (15):** ask-matt, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, improve-codebase-architecture, implement, prototype, resolving-merge-conflicts, review, setup-matt-pocock-skills, tdd, to-issues, to-prd, triage
- **Productivity (5):** grill-me, handoff, obsidian-vault, teach, writing-great-skills
- **Misc (4):** git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit

Project templates: to-issues-project, to-prd-project, improve-codebase-architecture-project

Excluded: caveman, write-a-skill, github-triage

### Acceptance criteria

- [x] Twenty-five upstream skills installed and discoverable by the agent runtime
- [x] Three project-specific skill templates reference Mandor Plate context
- [x] Sandcastle initialized with Docker provider, prompt template, and environment example
- [x] `pnpm sandcastle` (or equivalent root script) runs without error
- [x] CONTEXT.md template exists with placeholder domain vocabulary sections
- [x] docs/agents/triage-labels.md documents label vocabulary
- [x] docs/agents/domain.md documents CONTEXT.md and ADR conventions
- [x] README documents running setup-matt-pocock-skills once after clone

---

## MP-010: Unified CI and quality gates

**Blocked by:** MP-001 (full E2E stage completes after MP-011)

**User stories covered:** 3, 46–50

### What to build

Single ESLint and Prettier toolchain across the monorepo, pre-commit hooks, git guardrails, and a GitHub Actions pipeline running lint, typecheck, unit tests, and E2E tests on every pull request.

End-to-end behavior:

1. Developer commits code; Husky pre-commit runs lint-staged with ESLint fix and Prettier write.
2. Destructive git commands are blocked by guardrails hooks.
3. Pull request triggers CI: lint → typecheck → unit tests → E2E tests.
4. E2E stage uses a PostgreSQL service container in GitHub Actions.
5. All packages and applications share one lint and format configuration.

Implement lint, typecheck, and unit test stages after MP-001. Wire the E2E stage once MP-011 delivers the full-stack test suite.

### Acceptance criteria

- [x] Root ESLint configuration covers API, web, and shared packages
- [x] Root Prettier configuration covers the entire monorepo
- [x] OxLint and Oxfmt fully removed from the web application
- [x] Husky pre-commit hook runs lint-staged on staged files
- [x] Git guardrails hooks block destructive git operations
- [x] GitHub Actions workflow triggers on pull requests
- [x] CI pipeline runs lint, typecheck, and unit tests in sequence
- [x] CI E2E stage runs against a PostgreSQL service container (enabled after MP-011)
- [x] Root scripts expose lint, typecheck, test, and test:e2e commands via Turborepo

---

## MP-011: Full-stack E2E and contributor documentation

**Blocked by:** MP-004, MP-005, MP-006, MP-007, MP-008

**User stories covered:** 22, 69, 70

### What to build

Author the canonical full-stack E2E test suite covering the primary auth journey seam and secondary scenarios. Complete the README quickstart so a new contributor is productive within minutes.

Primary E2E scenario (the single highest test seam):

1. Register a new user (or use seeded admin).
2. Log in via the web login page.
3. Assert httpOnly session cookies are set.
4. Navigate to a protected dashboard route.
5. Assert dashboard renders with role-appropriate navigation.
6. Log out or expire session.
7. Assert redirect to login on protected route access.

Secondary scenarios: forgot-password email in Maildev, admin vs user navigation, avatar upload.

End-to-end behavior:

1. New contributor clones repo, follows README quickstart.
2. All commands work: install, docker up, dev, test, test e2e, sandcastle.
3. Full-stack E2E tests pass locally and in CI.

### Acceptance criteria

- [x] E2E test runner configured (Playwright or adapted upstream runner)
- [x] Primary auth journey E2E test passes: register/login → cookies → dashboard → RBAC nav → logout → redirect
- [x] Secondary E2E: forgot-password flow captures email in Maildev
- [x] Secondary E2E: admin user sees admin nav items; regular user does not
- [x] Secondary E2E: avatar upload succeeds and image is visible on profile
- [x] README documents quickstart: install, environment setup, docker up, dev, test, test e2e, sandcastle
- [x] README documents implementation ticket order referencing this backlog
- [x] CI E2E stage from MP-010 passes with the full test suite
- [x] Root `pnpm test:e2e` runs all E2E tests successfully

---

## Summary

| Ticket | Title                                        | Blocked by     | Est. effort |
| ------ | -------------------------------------------- | -------------- | ----------- |
| MP-001 | Monorepo foundation and API production core  | None           | 1 day       |
| MP-002 | Shared validation contracts                  | MP-001         | 0.5 day     |
| MP-003 | Dashboard shell without Clerk                | MP-001         | 1 day       |
| MP-004 | Email authentication end-to-end              | MP-002, MP-003 | 2–3 days    |
| MP-005 | Password recovery flow                       | MP-004         | 0.5 day     |
| MP-006 | Google social sign-in                        | MP-004         | 0.5 day     |
| MP-007 | Role-based navigation                        | MP-004         | 0.5 day     |
| MP-008 | Profile and avatar upload                    | MP-004         | 0.5 day     |
| MP-009 | Agent tooling bundle                         | MP-001         | 0.5 day     |
| MP-010 | Unified CI and quality gates                 | MP-001         | 1 day       |
| MP-011 | Full-stack E2E and contributor documentation | MP-004–MP-008  | 1 day       |

**Total estimated effort:** 7–8 working days

**Critical path:** MP-001 → MP-002 + MP-003 → MP-004 → MP-011
