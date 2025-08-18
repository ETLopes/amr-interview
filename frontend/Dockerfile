# syntax=docker/dockerfile:1

# --- Base ---
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# --- Dependencies ---
FROM base AS deps
ENV NODE_ENV=development
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci || npm install

# --- Builder ---
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production runner ---
FROM base AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Create non-root user
RUN adduser -D -s /bin/sh appuser \
  && chown -R appuser:appuser /app
USER appuser

# Copy only required build artifacts
COPY --from=builder /app/next.config.* .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
