<div align="center">

<img src="docs/assets/mandor-mascot.png" width="480" alt="" />

# Mandor Plate

**Full-stack monorepo for shipping dashboards with AI agents at your side.**

NestJS API · Next.js dashboard · PostgreSQL · Turborepo · agent skills workflow

<br />

[![CI](https://github.com/achmadya-dev/mandor-plate/actions/workflows/ci.yml/badge.svg)](https://github.com/achmadya-dev/mandor-plate/actions/workflows/ci.yml)
![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

<br />

[**Quickstart**](#quickstart) · [**Dev workflow**](#dev-workflow) · [**Scripts**](#scripts) · [CONTEXT.md](./CONTEXT.md) · [CLAUDE.md](./CLAUDE.md)

</div>

---

## Before you build

Start with **`grill-me`** (`/grilling`) to stress-test an idea, plan, or design — one question at a time — before writing a PRD or opening issues.

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

<table>
<thead>
<tr><th>Service</th><th>URL</th></tr>
</thead>
<tbody>
<tr><td>API</td><td><a href="http://localhost:3001">localhost:3001</a></td></tr>
<tr><td>Web</td><td><a href="http://localhost:3000">localhost:3000</a></td></tr>
<tr><td>Swagger</td><td><a href="http://localhost:3001/docs">localhost:3001/docs</a></td></tr>
<tr><td>Maildev</td><td><a href="http://localhost:1080">localhost:1080</a></td></tr>
</tbody>
</table>

Seeded accounts:

<table>
<thead>
<tr><th>Email</th><th>Password</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td><code>admin@example.com</code></td><td><code>secret</code></td><td>admin</td></tr>
<tr><td><code>john.doe@example.com</code></td><td><code>secret</code></td><td>user</td></tr>
</tbody>
</table>

## Quality gates

```bash
pnpm check      # lint + typecheck + unit tests (before commit / PR)
pnpm lint
pnpm typecheck
pnpm test
```

Pre-commit runs lint-staged only. CI runs the full pipeline including E2E.

## E2E tests

Requires PostgreSQL and Maildev (via `pnpm docker:up`).

```bash
pnpm test:e2e:prepare   # build apps, migrate, seed
pnpm --filter @mandor-plate/web test:e2e:install   # first run only
pnpm test:e2e           # Playwright full-stack suite
```

Playwright specs live in [`apps/web/e2e/`](./apps/web/e2e/).

## Dev workflow

Planning docs are **not** committed — generate them with skills when needed. Read [CONTEXT.md](./CONTEXT.md) before coding.

```mermaid
flowchart LR
  subgraph start [Start]
    G[grill-me]
  end

  subgraph plan [Plan]
    P[to-prd-project]
    D[domain-modeling]
    I[to-issues-project]
  end

  subgraph code [Build]
    M[implement / tdd]
    C[pnpm check]
    R[review]
  end

  subgraph auto [Optional batch]
    L["/loop /issue-loop"]
  end

  G --> P
  P --> D
  D --> I
  I --> M
  M --> C
  C --> R
  I --> L
  L --> M
```

<table>
<colgroup>
<col width="22%" />
<col width="28%" />
<col width="50%" />
</colgroup>
<thead>
<tr><th>Step</th><th>Skill / command</th><th>Output</th></tr>
</thead>
<tbody>
<tr><td>Sharpen the plan</td><td><code>grill-me</code></td><td>Scope, trade-offs, open questions</td></tr>
<tr><td>Write PRD</td><td><code>to-prd-project</code></td><td>GitHub issue or <code>.scratch/&lt;feature&gt;/PRD.md</code></td></tr>
<tr><td>Domain terms</td><td><code>domain-modeling</code></td><td>Updates <code>CONTEXT.md</code></td></tr>
<tr><td>Create tickets</td><td><code>to-issues-project</code></td><td>GitHub issues (<code>ready-for-agent</code>)</td></tr>
<tr><td>Implement</td><td><code>implement</code>, <code>tdd</code></td><td>Code in monorepo</td></tr>
<tr><td>Quality gate</td><td><code>pnpm check</code></td><td>Lint, typecheck, unit tests</td></tr>
<tr><td>Review</td><td><code>review</code></td><td>Standards + spec check</td></tr>
<tr><td>Batch work</td><td><code>/loop /issue-loop</code></td><td>Next open <code>ready-for-agent</code> issue</td></tr>
</tbody>
</table>

Core skills live in [`.agents/skills/`](./.agents/skills/) (committed — invoke directly in Cursor).

**Agent setup:** This repo already ships with issue tracker, triage labels, and domain doc layout in [`docs/agents/`](./docs/agents/) and [`CLAUDE.md`](./CLAUDE.md). After clone, skip `setup-matt-pocock-skills` and go straight to planning skills. Re-run it only if you want to switch issue trackers or change triage label vocabulary.

**Issue tracker:** GitHub Issues — see [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md). Local drafts go to `.scratch/` (gitignored).

**Reference docs:** [CONTEXT.md](./CONTEXT.md) (vocabulary), [apps/web/README.md](./apps/web/README.md) (forms, themes, web conventions).

## Credits

Mandor Plate is built on these open-source projects:

<table>
<colgroup>
<col width="18%" />
<col width="32%" />
<col width="50%" />
</colgroup>
<thead>
<tr><th>Area</th><th>Source</th><th>Notes</th></tr>
</thead>
<tbody>
<tr><td>API</td><td><a href="https://github.com/brocoders/nestjs-boilerplate">brocoders/nestjs-boilerplate</a></td><td>NestJS REST API foundation (PostgreSQL only)</td></tr>
<tr><td>Web dashboard</td><td><a href="https://github.com/Kiranism/next-shadcn-dashboard-starter">next-shadcn-dashboard-starter</a></td><td>Dashboard shell, forms, and UI patterns</td></tr>
<tr><td>UI components</td><td><a href="https://ui.shadcn.com">shadcn/ui</a></td><td>Radix + Tailwind component primitives</td></tr>
<tr><td>Agent skills</td><td><a href="https://github.com/mattpocock/skills">mattpocock/skills</a></td><td>PRD, triage, review, TDD, and related workflow skills</td></tr>
<tr><td>Agent skill packs</td><td><a href="https://github.com/vercel-labs/agent-skills">vercel-labs/agent-skills</a></td><td><code>shadcn</code>, Next.js best practices, React composition</td></tr>
</tbody>
</table>

See also [apps/api/README.md](./apps/api/README.md) for API-specific upstream notes.

## Scripts

<table>
<colgroup>
<col width="38%" />
<col width="62%" />
</colgroup>
<thead>
<tr><th>Command</th><th>Description</th></tr>
</thead>
<tbody>
<tr><td><code>pnpm dev</code></td><td>Start API + web (Turborepo)</td></tr>
<tr><td><code>pnpm check</code></td><td>Lint, typecheck, and unit tests</td></tr>
<tr><td><code>pnpm docker:up</code></td><td>Start PostgreSQL + Maildev</td></tr>
<tr><td><code>pnpm typecheck</code></td><td>TypeScript check all packages</td></tr>
<tr><td><code>pnpm test</code></td><td>Unit tests all packages</td></tr>
<tr><td><code>pnpm test:e2e</code></td><td>API + web E2E tests</td></tr>
<tr><td><code>pnpm test:e2e:prepare</code></td><td>Build, migrate, and seed for E2E</td></tr>
</tbody>
</table>

## Optional skills

Core set is already in `.agents/skills/`. Install extras when needed:

```bash
npx skills add mattpocock/skills@teach -y
npx skills add mattpocock/skills@prototype -y
npx skills add vercel-labs/agent-skills@web-design-guidelines -y
npx skills add anthropics/skills@frontend-design -y
```

See [mattpocock/skills](https://github.com/mattpocock/skills) and [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills).
