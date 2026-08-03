# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --filter @mandor-plate/api... --frozen-lockfile --config.node-linker=hoisted

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN pnpm --filter @mandor-plate/shared build \
 && pnpm --filter @mandor-plate/api build \
 && pnpm --filter @mandor-plate/api deploy --prod --legacy /prod/api

# ---- Runtime stage ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build --chown=node:node /prod/api ./apps/api
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist

RUN mkdir -p /app/files && chown -R node:node /app
USER node

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.APP_PORT||3001)+'/api/health/ready',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "apps/api/dist/main.js"]
