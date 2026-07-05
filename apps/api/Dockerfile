# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN pnpm --filter @mandor-plate/shared build \
 && pnpm --filter @mandor-plate/api build

# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy needed source files for production install
COPY --from=build /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/package.json /app/.npmrc ./
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/dist ./apps/api/dist

# Install production deps from lockfile (creates flat hoisted node_modules)
RUN corepack enable && \
    cd /app/apps/api && \
    pnpm install --prod --frozen-lockfile --ignore-scripts

# Symlink shared package so api can resolve @mandor-plate/shared
RUN mkdir -p /app/apps/api/node_modules/@mandor-plate && \
    ln -s /app/packages/shared /app/apps/api/node_modules/@mandor-plate/shared

RUN mkdir -p /app/files && chown -R node:node /app
USER node

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.APP_PORT||3001)+'/',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "apps/api/dist/main.js"]
