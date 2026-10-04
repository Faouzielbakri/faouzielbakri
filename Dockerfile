# Built by GitHub Actions and pushed to ghcr.io; the server only pulls the image.
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
# The install step generates the Prisma client, which needs the schema.
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Baked into the client bundle and the canonical URLs at build time.
ARG NEXT_PUBLIC_SITE_URL=https://faouzielbakri.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
# Prisma CLI for the schema push the entrypoint runs on start.
RUN apk add --no-cache openssl && npm install -g prisma@7.10.0
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# Blog posts are read from disk at request time (src/lib/blog.ts).
COPY --from=build --chown=app:app /app/content ./content
COPY --from=build --chown=app:app /app/prisma ./prisma
COPY --chown=app:app docker-entrypoint.sh ./
USER app
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]
