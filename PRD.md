# PRD: Mandor Plate Boilerplate

## Problem Statement

Teams starting a new full-stack product face a repeated, expensive setup phase. They must manually combine a production-grade API, an admin dashboard, authentication wiring, shared validation contracts, local development infrastructure, CI quality gates, and AI-agent workflow tooling. Each source project solves a slice of this problem in isolation, but they conflict on critical decisions: the frontend starter assumes Clerk for auth, orgs, and billing while the backend boilerplate ships its own JWT auth stack; the reference example application uses a different frontend framework and ORM than the chosen starters; agent skills and sandbox orchestration live in separate repositories with no opinion on how they attach to a product codebase.

Without a unified boilerplate, every new project re-litigates the same architectural forks, strips incompatible modules by hand, and delays building domain features. Developers who want AI-native workflows must additionally scaffold skills, sandcastle configuration, domain vocabulary documents, and agent backlog conventions from scratch.

## Solution

Mandor Plate is a monorepo boilerplate that combines four upstream references into one forkable, production-oriented starting point with agent tooling included out of the box. It delivers a NestJS REST API with JWT authentication, a Next.js admin dashboard with shadcn/ui, a BFF auth layer that keeps tokens in httpOnly cookies, shared Zod validation contracts, hybrid Docker development infrastructure, strict unified CI, and a curated set of agent skills with sandcastle pre-configuration.

A developer forks Mandor Plate, installs dependencies, starts infrastructure containers, runs a single dev command, and lands on an authenticated dashboard with role-based navigation — while agent skills, domain documentation templates, and sandbox orchestration are already wired for immediate use.

## User Stories

### Product Owner / Team Lead

1. As a team lead, I want a single repository that contains both API and web applications, so that onboarding new developers requires cloning one repo instead of coordinating multiple projects.
2. As a team lead, I want authentication to work end-to-end without third-party auth vendor lock-in, so that the team owns the full auth lifecycle and can deploy anywhere.
3. As a team lead, I want CI to run lint, typecheck, unit tests, and E2E tests on every pull request, so that regressions in the auth flow or dashboard are caught before merge.
4. As a team lead, I want agent skills and sandcastle pre-configured in the repo, so that AI-assisted development follows established engineering workflows from day one.
5. As a team lead, I want a domain vocabulary template and agent backlog conventions, so that agents and humans share the same language about the product.
6. As a team lead, I want a documented implementation phase plan, so that the boilerplate can be built incrementally without losing architectural coherence.
7. As a team lead, I want social login limited to Google on day one with other providers stubbed, so that OAuth complexity is controlled while extensibility remains.
8. As a team lead, I want S3 file storage as an environment opt-in, so that local development stays simple while production can use cloud storage.
9. As a team lead, I want Mongoose and MongoDB support removed, so that the data layer has one clear ORM and database choice.
10. As a team lead, I want internationalization removed from the API boilerplate, so that the initial scope stays focused and i18n can be added later via an explicit decision.

### Backend Developer

11. As a backend developer, I want the NestJS boilerplate auth module preserved with email login, registration, forgot password, and reset password, so that I do not rebuild auth from scratch.
12. As a backend developer, I want admin and user roles enforced at the API layer, so that the frontend RBAC navigation reflects real authorization boundaries.
13. As a backend developer, I want TypeORM with PostgreSQL as the only database stack, so that migrations, seeding, and entities remain consistent.
14. As a backend developer, I want a default admin user seeded in development, so that I can log in immediately after setup.
15. As a backend developer, I want nodemailer integrated with a local Maildev container, so that I can test password reset and verification emails without sending real mail.
16. As a backend developer, I want file upload supporting local storage by default, so that avatar uploads work in development without cloud credentials.
17. As a backend developer, I want Swagger documentation auto-generated, so that API contracts are discoverable during integration.
18. As a backend developer, I want refresh token rotation via the existing boilerplate patterns, so that session management follows proven JWT practices.
19. As a backend developer, I want Google OAuth login endpoints available, so that social sign-in can be enabled on the frontend without new backend work.
20. As a backend developer, I want Facebook and Apple OAuth modules present but disabled by default, so that enabling them is an environment configuration change rather than new development.
21. As a backend developer, I want the API to expose a current-user endpoint consumed by the BFF layer, so that the web app can resolve identity and role on each request.
22. As a backend developer, I want E2E tests from the upstream NestJS boilerplate adapted to the monorepo, so that auth endpoints remain covered in CI.

### Frontend Developer

23. As a frontend developer, I want Clerk completely removed from the dashboard starter, so that auth is owned by the NestJS API and BFF layer.
24. As a frontend developer, I want custom login, register, forgot password, and reset password pages, so that users can authenticate without a third-party auth UI.
25. As a frontend developer, I want a Google sign-in button on the login page, so that OAuth users can authenticate with one click.
26. As a frontend developer, I want the pre-built dashboard layout with sidebar, header, and content area preserved, so that I skip layout boilerplate.
27. As a frontend developer, I want theme switching with multiple themes preserved, so that the dashboard looks polished out of the box.
28. As a frontend developer, I want analytics charts and data tables preserved as reference implementations, so that I have patterns for common dashboard UI.
29. As a frontend developer, I want TanStack Form with Zod validation preserved, so that form patterns remain consistent with the shared validation package.
30. As a frontend developer, I want TanStack Query for data fetching preserved, so that server state management patterns are ready to use.
31. As a frontend developer, I want Command+K navigation preserved, so that power-user navigation is available from the start.
32. As a frontend developer, I want RBAC navigation wired to NestJS admin and user roles, so that menu items filter by the authenticated user's role instead of Clerk permissions.
33. As a frontend developer, I want auth tokens stored in httpOnly cookies set by Next.js route handlers, so that tokens are not exposed to client-side JavaScript.
34. As a frontend developer, I want Next.js middleware to protect dashboard routes, so that unauthenticated users are redirected to login.
35. As a frontend developer, I want authenticated server and client fetch patterns documented, so that TanStack Query calls work through the BFF without CORS issues.
36. As a frontend developer, I want a profile or settings page with avatar upload, so that the file upload API has a visible integration point.
37. As a frontend developer, I want Clerk Organizations, Billing, and Sentry removed, so that the starter is not coupled to paid third-party services.
38. As a frontend developer, I want ESLint and Prettier as the linting standard, so that the web app shares tooling with the rest of the monorepo.

### Full-Stack Developer

39. As a full-stack developer, I want a shared package exporting Zod schemas and API types, so that validation rules are defined once and consumed by both API and web.
40. As a full-stack developer, I want Turborepo orchestrating parallel dev servers for API and web, so that I run one command to start the full stack.
41. As a full-stack developer, I want environment variable templates for both applications, so that configuration is documented and copy-pasteable.
42. As a full-stack developer, I want the BFF route handlers to proxy auth requests to NestJS and set cookies on success, so that the browser never talks directly to the API for auth.
43. As a full-stack developer, I want the BFF to inject the Authorization header when calling protected API endpoints server-side, so that token handling is centralized.
44. As a full-stack developer, I want a root Docker Compose file running PostgreSQL and Maildev, so that infrastructure starts with one command while apps run natively for fast HMR.
45. As a full-stack developer, I want pnpm workspaces configured at the monorepo root, so that dependencies are hoisted and linked correctly across packages.

### DevOps / Platform Engineer

46. As a platform engineer, I want a GitHub Actions workflow running on every pull request, so that quality gates are automated.
47. As a platform engineer, I want the CI pipeline to run lint, typecheck, unit tests, and E2E tests in sequence, so that failures are ordered from cheapest to most expensive.
48. As a platform engineer, I want E2E tests to use a PostgreSQL service container in GitHub Actions, so that integration tests run against a real database.
49. As a platform engineer, I want Husky pre-commit hooks with lint-staged running ESLint and Prettier, so that formatting issues are caught before push.
50. As a platform engineer, I want git guardrails hooks blocking destructive git operations, so that agents and developers avoid accidental data loss.
51. As a platform engineer, I want Docker used only for infrastructure and sandcastle sandboxes, so that application hot reload is not degraded by container file system overhead.

### AI / Agent Workflow User

52. As an agent user, I want twenty-five curated upstream skills installed in the project, so that engineering, productivity, and tooling workflows are available without manual selection from the full skills catalog.
53. As an agent user, I want three project-specific skill templates for issues, PRDs, and architecture improvement, so that agents use repo-aware wrappers instead of generic skills.
54. As an agent user, I want sandcastle pre-configured with Docker as the default sandbox provider, so that I can orchestrate coding agents in isolation immediately.
55. As an agent user, I want a CONTEXT.md template at the repo root, so that agents learn the project's domain vocabulary before making changes.
56. As an agent user, I want agent documentation for backlog management, triage labels, and domain conventions, so that issue tracking and triage follow a consistent pattern.
57. As an agent user, I want the setup skill runnable once to configure issue tracker and triage preferences, so that agent tooling is personalized to the team's workflow.
58. As an agent user, I want skills for grilling, PRD generation, issue creation, triage, TDD, review, and implementation, so that the full plan-to-code agent loop is supported.
59. As an agent user, I want the migrate-to-shoehorn skill available, so that test type assertions can be migrated to shoehorn as tests are written.
60. As an agent user, I want the setup-pre-commit skill available, so that hook configuration can be automated if the initial setup needs adjustment.

### End User (Dashboard Consumer)

61. As an end user, I want to register with email and password, so that I can create an account without a social provider.
62. As an end user, I want to log in with email and password, so that I can access the dashboard securely.
63. As an end user, I want to log in with Google, so that I can authenticate without creating a separate password.
64. As an end user, I want to reset my password via email, so that I can recover access if I forget my credentials.
65. As an end user, I want to see only navigation items appropriate to my role, so that the interface is not cluttered with unauthorized actions.
66. As an end user, I want to upload a profile avatar, so that my account feels personalized.
67. As an end user, I want to stay logged in across page refreshes via secure cookies, so that I am not prompted to log in on every navigation.
68. As an end user, I want to be redirected to login when my session expires, so that protected pages are never shown to unauthenticated visitors.

### Documentation Consumer

69. As a new contributor, I want a README with quickstart commands for install, infrastructure, dev, test, and sandcastle, so that I can be productive within minutes of cloning.
70. As a new contributor, I want the implementation organized into numbered phases, so that I understand the intended build order if contributing to the boilerplate itself.

## Implementation Decisions

### Monorepo Structure

- The repository is a pnpm workspace monorepo orchestrated by Turborepo.
- Two applications live under an apps directory: the API application (NestJS, derived from brocoders/nestjs-boilerplate) and the web application (Next.js 16, derived from Kiranism/next-shadcn-dashboard-starter).
- A shared package under packages provides Zod schemas, API type definitions, and shared constants consumed by both applications.
- Agent tooling, sandcastle configuration, domain documentation, and CI configuration live at the monorepo root.

### Authentication Architecture

- NestJS JWT is the single source of truth for authentication. Clerk is fully removed from the web application.
- The web application implements a Backend-for-Frontend (BFF) pattern using Next.js Route Handlers. The browser never sends credentials directly to the NestJS API for auth operations.
- On successful authentication, the BFF sets access and refresh tokens in httpOnly cookies. Tokens are never stored in localStorage or exposed to client-side JavaScript.
- Next.js middleware reads session cookies to protect dashboard routes and redirects unauthenticated requests to the login page.
- Server-side fetches from the web application to the API inject the Authorization header from the cookie. Client-side data fetching goes through BFF route handlers or server actions to avoid CORS and token exposure.
- The auth flow sequence: browser posts to a web auth route handler, the handler proxies to the NestJS auth endpoint, NestJS validates credentials against PostgreSQL, returns tokens and user payload, the BFF sets httpOnly cookies and returns user data to the browser.

### Auth API Contracts

- Email login: accepts email and password, returns access token, refresh token, and user object including role.
- Email registration: accepts registration fields, creates user, returns tokens or triggers verification depending on upstream boilerplate behavior.
- Forgot password: accepts email, triggers nodemailer email via Maildev in development.
- Reset password: accepts token and new password, updates credentials.
- Google social login: accepts OAuth token or authorization code per upstream boilerplate pattern, returns tokens and user.
- Current user: returns authenticated user profile and role for session resolution.
- Token refresh: accepts refresh token from cookie, returns new access token.

### Backend Module Scope

- **Retained:** email auth, Google social login (day-one), Facebook and Apple social login (stubbed, enable via environment), admin and user roles, nodemailer mailing, local file upload with S3 opt-in via environment driver variable, Swagger, database seeding with default admin user, TypeORM with PostgreSQL, Config Service, Docker support adapted to monorepo root.
- **Removed:** Mongoose and MongoDB dual-database support, nestjs-i18n internationalization module and all translation files.

### Frontend Module Scope

- **Retained:** dashboard layout (sidebar, header, content), theme switcher with multiple themes, analytics charts, data tables with TanStack Query, forms with TanStack Form and Zod, Command+K interface, RBAC navigation rewired to NestJS roles, profile/settings page with avatar upload integration.
- **Removed:** Clerk authentication, Clerk Organizations, Clerk Billing, Sentry error tracking, all Clerk-dependent navigation and permission filtering logic.
- **Built new:** login page, registration page, forgot password page, reset password page, Google sign-in button, auth BFF route handlers, session middleware, authenticated fetch utilities.

### Shared Package

- Exports Zod schemas for auth requests and responses (login, register, forgot password, reset password).
- Exports Zod schemas for user profile and role enums (admin, user).
- Exports TypeScript types inferred from Zod schemas for consumption by both applications.
- Serves as the single validation contract boundary between API input validation and frontend form validation.

### Database

- PostgreSQL is the sole database, managed by TypeORM in the API application.
- Existing user, session, role, and file entities from the upstream NestJS boilerplate are retained.
- Migrations and seeding scripts are adapted to the monorepo layout.
- No Drizzle ORM. No SQLite. The course-video-manager example informs agent workflow patterns only, not data layer choices.

### Development Environment

- Hybrid approach: Docker Compose at the monorepo root runs PostgreSQL and Maildev only.
- API and web applications run natively via Turborepo parallel dev task for fast hot module replacement.
- Sandcastle uses Docker as its sandbox provider independently of the infrastructure compose file.
- Root-level scripts: install, docker up, dev (parallel API and web), sandcastle, lint, typecheck, test, test e2e.

### CI/CD and Tooling

- Single toolchain across the monorepo: ESLint and Prettier replace OxLint and Oxfmt from the upstream frontend starter.
- GitHub Actions workflow on every pull request: lint, then typecheck, then unit tests, then E2E tests.
- E2E tests run against a PostgreSQL service container in GitHub Actions.
- Husky pre-commit hooks with lint-staged execute ESLint fix and Prettier write on staged files.
- Git guardrails hooks block destructive git operations.

### Agent Tooling

- Twenty-five upstream skills installed from mattpocock/skills, organized by bucket:
  - **Engineering (15):** ask-matt, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, improve-codebase-architecture, implement, prototype, resolving-merge-conflicts, review, setup-matt-pocock-skills, tdd, to-issues, to-prd, triage.
  - **Productivity (5):** grill-me, handoff, obsidian-vault, teach, writing-great-skills.
  - **Misc (4):** git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit.
- Three project-specific skill templates with repo-aware context: to-issues-project, to-prd-project, improve-codebase-architecture-project.
- Skills explicitly excluded from upstream: caveman (removed upstream), write-a-skill (replaced by writing-great-skills), github-triage (does not exist upstream; triage skill is sufficient).
- Sandcastle initialized at monorepo root with Docker provider, prompt template, and environment example for agent OAuth token.
- Agent documentation directory containing backlog management guide (GitHub issues via gh CLI), triage label conventions, and domain documentation conventions.
- CONTEXT.md template at repo root for domain vocabulary.
- setup-matt-pocock-skills is run once during initial boilerplate setup to configure issue tracker and triage preferences.

### Implementation Phases

1. **Scaffold:** Initialize monorepo, adapt upstream NestJS and Next.js projects into apps directory, configure root workspace and Turborepo.
2. **Backend strip:** Remove Mongoose, i18n, and associated dead code from the API application.
3. **Agent tooling:** Install skills, initialize sandcastle, create CONTEXT.md template and agent documentation.
4. **Auth BFF:** Build Next.js route handlers, httpOnly cookie management, auth pages, and session middleware.
5. **Frontend strip:** Remove Clerk and dependents, rewire RBAC navigation to NestJS roles, preserve dashboard core.
6. **Shared package:** Define Zod schemas and types for auth and user domains.
7. **Docker and CI:** Root Docker Compose, GitHub Actions workflow, pre-commit hooks.
8. **E2E and docs:** Auth flow E2E tests, README quickstart.

Estimated total effort: seven to eight working days.

## Testing Decisions

### What Makes a Good Test

Tests assert externally observable behavior only — HTTP response status codes, response body shapes, cookie presence and attributes, redirect targets, rendered page content, and navigation visibility by role. Tests do not assert internal implementation details such as which service class handles a request, how many database queries run, or which middleware function executes first.

### Primary Test Seam

The highest test seam is the **end-to-end authentication journey** spanning browser, BFF route handlers, NestJS API, and PostgreSQL. This single seam validates the most critical integration surface and catches regressions across all layers simultaneously.

The canonical E2E scenario:

1. Register a new user via the web registration page (or use seeded admin).
2. Log in via the web login page.
3. Assert httpOnly session cookies are set.
4. Navigate to a protected dashboard route.
5. Assert the dashboard renders with navigation items matching the user's role.
6. Log out (or expire session).
7. Assert redirect to login on protected route access.

Secondary E2E scenarios extend this seam:

- Forgot password flow triggers email (assert via Maildev API or test mailbox).
- Google OAuth login completes and sets session cookies (may require mock in CI).
- Admin user sees admin navigation items; regular user does not.
- Avatar upload on profile page succeeds and image URL is returned.

### Modules Tested

| Layer | Test Type | Scope |
|---|---|---|
| Auth E2E journey | E2E (Playwright or upstream boilerplate E2E runner) | Full stack: web → BFF → API → database |
| NestJS auth endpoints | E2E / integration (adapted from brocoders/nestjs-boilerplate) | API-level auth: login, register, refresh, me |
| Shared Zod schemas | Unit | Schema validation accepts valid input, rejects invalid input |
| BFF route handlers | Integration | Proxy behavior, cookie setting, error forwarding |
| RBAC navigation | Component or E2E | Menu items filtered by role |

### Prior Art

- brocoders/nestjs-boilerplate ships E2E tests with Docker-based CI (GitHub Actions workflow for docker-e2e). Adapt these tests to the monorepo layout and extend with web-layer assertions.
- brocoders/nestjs-boilerplate ships unit tests for auth services. Retain and adapt.
- Kiranism/next-shadcn-dashboard-starter does not ship E2E tests; new E2E coverage must be authored for the auth and dashboard flow.
- mattpocock/course-video-manager uses Vitest for unit tests and Evalite for evals. Mandor Plate adopts Vitest for web unit tests and Jest for API unit tests per upstream conventions, unified under Turborepo test task.

### CI Test Execution Order

1. Lint (cheapest, no runtime dependencies).
2. Typecheck (static analysis, no runtime dependencies).
3. Unit tests (fast, no external services except in-memory mocks).
4. E2E tests (slowest, requires PostgreSQL service container and running API + web servers).

## Out of Scope

- Clerk authentication, Clerk Organizations, Clerk Billing, and any Clerk-dependent features.
- Mongoose and MongoDB support.
- API internationalization (nestjs-i18n).
- Sentry error tracking integration.
- Drizzle ORM or migration from TypeORM to Drizzle.
- React Router or Vite frontend (course-video-manager frontend patterns are not adopted; only agent workflow patterns are).
- Full mattpocock/skills catalog installation (only the curated twenty-five skills plus three project templates).
- Custom github-triage skill (triage skill from upstream is sufficient).
- caveman and write-a-skill skills (removed or replaced upstream).
- Facebook and Apple social login enabled by default (stubbed only).
- S3 file storage enabled by default (local storage only; S3 via environment opt-in).
- Multi-tenant organization management and billing/subscription features.
- Production deployment configuration (Kubernetes, Vercel, AWS, etc.) — only local dev infrastructure and CI are in scope.
- Domain-specific business features beyond auth, dashboard shell, profile, and file upload.
- Mobile applications or native clients.
- Real-time features (WebSockets, SSE).
- Content management or page builder functionality.

## Further Notes

- The project name is **Mandor Plate**. The workspace repository is currently empty; this PRD describes greenfield implementation.
- The grilling session that produced these decisions covered ten architectural questions with unanimous agreement on the recommended option in each case.
- course-video-manager serves as the reference for agent workflow integration (CONTEXT.md, docs/agents, sandcastle, project-specific skills) but not for frontend framework, ORM, or application architecture choices.
- obsidian-vault skill is included for personal documentation workflows and is not coupled to any Obsidian configuration in the boilerplate itself.
- scaffold-exercises skill is included for potential training or course use cases but does not require exercise scaffolding in the initial boilerplate build.
- After boilerplate implementation is complete, run setup-matt-pocock-skills once to finalize agent tooling configuration for the team's issue tracker and triage label preferences.
- Internationalization, additional social providers, Sentry, and multi-tenant billing may be added in future PRDs via explicit architectural decision records.
- Estimated implementation effort is seven to eight working days across eight phases. Phase 4 (Auth BFF) is the highest-effort and highest-risk phase.
