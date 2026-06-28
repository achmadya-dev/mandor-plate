# Mandor Plate API

NestJS REST API derived from [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate), scoped to PostgreSQL only.

## Quickstart

```bash
# From monorepo root
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm docker:up
pnpm --filter @mandor-plate/api migration:run
pnpm --filter @mandor-plate/api seed:run
pnpm dev
```

API: http://localhost:3001  
Swagger: http://localhost:3001/docs  
Maildev UI: http://localhost:1080

## Default seeded users

| Email                | Password | Role  |
| -------------------- | -------- | ----- |
| admin@example.com    | secret   | admin |
| john.doe@example.com | secret   | user  |
