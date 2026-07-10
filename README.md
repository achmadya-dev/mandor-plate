<div align="center">

<img src="docs/assets/mandor-mascot.png" width="420" alt="Mandor Plate mascot" />

# Mandor Plate

**Clean fullstack dashboard boilerplate for production-minded teams.**

NestJS API · Next.js dashboard · PostgreSQL · TypeScript · Turborepo

<br />

[![CI](https://github.com/achmadya-dev/mandor-plate/actions/workflows/ci.yml/badge.svg)](https://github.com/achmadya-dev/mandor-plate/actions/workflows/ci.yml)
![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

<br />

[Prerequisites](#prerequisites) · [Quickstart](#quickstart) · [What is included](#what-is-included) · [Scripts](#scripts) · [Quality gates](#quality-gates) · [Customization checklist](#customization-checklist)

</div>

---

## What is Mandor Plate?

Mandor Plate is a fullstack dashboard starter that combines a real backend, a modern admin UI, shared validation contracts, local infrastructure, and test tooling in one monorepo.

Use it when you want to start from a working product foundation instead of stitching together API auth, dashboard layout, database migrations, forms, tables, and tests from scratch.

## What is included

| Area             | Stack                                | Notes                                                |
| ---------------- | ------------------------------------ | ---------------------------------------------------- |
| Monorepo         | pnpm workspaces + Turborepo          | API, web app, and shared package in one repository   |
| API              | NestJS 11                            | REST API, Swagger, JWT auth, RBAC-ready structure    |
| Web              | Next.js 16 + React 19                | Dashboard shell, BFF route handlers, protected pages |
| Database         | PostgreSQL + TypeORM                 | Migrations, seed data, local Docker Compose service  |
| Shared contracts | Zod                                  | Reusable schemas for API and web validation          |
| UI               | shadcn/ui, Radix, Tailwind CSS 4     | Components, themes, forms, tables, charts            |
| Data fetching    | TanStack Query                       | Server prefetch + client hydration patterns          |
| Forms            | TanStack Form + Zod                  | Type-safe form patterns and reusable fields          |
| Testing          | Jest + Playwright                    | Unit tests and fullstack E2E tests                   |
| Tooling          | ESLint, Prettier, Husky, lint-staged | Baseline quality checks before commits               |

## Prerequisites

| Requirement      | Notes                                                         |
| ---------------- | ------------------------------------------------------------- |
| Node.js >= 20    | See `engines` in [`package.json`](./package.json)             |
| pnpm 10.12.1     | `corepack enable && corepack prepare pnpm@10.12.1 --activate` |
| Docker + Compose | Runs PostgreSQL and Maildev locally                           |

## Quickstart

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm docker:up
pnpm --filter @mandor-plate/api migration:run
pnpm --filter @mandor-plate/api seed:run
pnpm dev
```

| Service       | URL                        |
| ------------- | -------------------------- |
| Web dashboard | http://localhost:3000      |
| API           | http://localhost:3001      |
| Swagger       | http://localhost:3001/docs |
| Maildev       | http://localhost:1080      |

Seeded accounts:

| Email                  | Password | Role  |
| ---------------------- | -------- | ----- |
| `admin@example.com`    | `secret` | admin |
| `john.doe@example.com` | `secret` | user  |

## Monorepo layout

```text
.
├── apps/
│   ├── api/              # NestJS REST API
│   └── web/              # Next.js dashboard + BFF
├── packages/
│   └── shared/           # Shared Zod schemas and typed contracts
├── docs/
│   ├── adr/              # Architecture decision records
│   └── assets/           # README and documentation assets
├── docker-compose.yml    # PostgreSQL + Maildev
├── package.json          # Root scripts and workspace tooling
├── pnpm-workspace.yaml   # pnpm workspace config
└── turbo.json            # Turborepo pipeline
```

## Environment files

Copy the examples before running the app:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Keep real secrets out of Git. If you add new environment variables, update the relevant `.env.example` file and document what each value is used for.

## Scripts

Run these from the repository root.

| Command                 | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `pnpm dev`              | Start API and web in development mode           |
| `pnpm build`            | Build all packages/apps through Turborepo       |
| `pnpm lint`             | Lint all workspaces                             |
| `pnpm typecheck`        | Run TypeScript checks across workspaces         |
| `pnpm test`             | Run unit tests across workspaces                |
| `pnpm check`            | Run lint, typecheck, and unit tests             |
| `pnpm format`           | Format the repository with Prettier             |
| `pnpm format:check`     | Check formatting without writing changes        |
| `pnpm docker:up`        | Start PostgreSQL and Maildev                    |
| `pnpm docker:down`      | Stop local Docker services                      |
| `pnpm docker:logs`      | Follow Docker service logs                      |
| `pnpm test:e2e:prepare` | Build, migrate, seed, and prepare for E2E tests |
| `pnpm test:e2e`         | Run Playwright fullstack E2E tests              |

## Quality gates

Before opening a PR or handing work to another developer, run:

```bash
pnpm check
```

For fullstack verification with local infrastructure:

```bash
pnpm docker:up
pnpm test:e2e:prepare
pnpm test:e2e
```

Playwright specs live in [`apps/web/e2e/`](./apps/web/e2e/).

## Development notes

- API-specific notes: [`apps/api/README.md`](./apps/api/README.md)
- Web-specific notes: [`apps/web/README.md`](./apps/web/README.md)
- Architecture decisions: [`docs/adr/`](./docs/adr/)
- Shared contracts: [`packages/shared`](./packages/shared)

Recommended feature flow:

1. Add or update shared Zod contracts in `packages/shared` when API and web need the same validation shape.
2. Implement API behavior in `apps/api` with migrations/seeds when needed.
3. Add or update BFF/client API helpers in `apps/web/src/lib` or `apps/web/src/features/<feature>/api`.
4. Build UI under `apps/web/src/features/<feature>`.
5. Add unit tests close to the code and E2E tests for critical user paths.
6. Run `pnpm check`, then E2E tests if the feature touches auth, database, or fullstack flows.

## Customization checklist

Use this when starting a new product from the boilerplate:

- [ ] Rename packages from `@mandor-plate/*` if you want project-specific scopes.
- [ ] Replace branding, logo, metadata, and dashboard copy.
- [ ] Review seeded users and remove demo credentials before production.
- [ ] Update auth providers, mail settings, storage settings, and CORS origins.
- [ ] Replace demo dashboard data with real domain entities.
- [ ] Audit environment variables and deployment secrets.
- [ ] Add product-specific migrations, seeds, tests, and CI checks.
- [ ] Review Docker Compose settings before using outside local development.

## Credits

Mandor Plate builds on these open-source foundations:

| Area          | Source                                                                                     | Notes                                            |
| ------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| API           | [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate)            | NestJS REST API foundation, scoped to PostgreSQL |
| Web dashboard | [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) | Dashboard shell, forms, tables, and UI patterns  |
| UI components | [shadcn/ui](https://ui.shadcn.com)                                                         | Radix + Tailwind component primitives            |
