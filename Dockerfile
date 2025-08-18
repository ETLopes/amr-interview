# Root multi-target Dockerfile for both backend (FastAPI) and frontend (Next.js)

# =========================
# Backend (FastAPI) target
# =========================
FROM python:3.11-alpine AS backend

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps for building and postgres client libs
RUN apk add --no-cache \
    gcc \
    musl-dev \
    postgresql-dev \
    curl \
  && rm -rf /var/cache/apk/*

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/ ./

# Create non-root user
RUN adduser -D -s /bin/sh appuser \
  && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


# =========================
# Frontend (Next.js) target
# =========================
FROM node:20-alpine AS frontend-deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
# Lockfiles if present; fallback to npm install
COPY frontend/package.json frontend/package-lock.json* frontend/yarn.lock* frontend/pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    else npm i --no-audit --no-fund; fi

FROM node:20-alpine AS frontend-builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=frontend-deps /app/node_modules ./node_modules
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS frontend
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary runtime files
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json
COPY --from=frontend-builder /app/next.config.js ./next.config.js
COPY --from=frontend-builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=frontend-builder /app/postcss.config.js ./postcss.config.js
COPY --from=frontend-builder /app/styles ./styles

EXPOSE 3000
CMD ["npm", "run", "start"]


