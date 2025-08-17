## aMORA Backend Requirements Checklist

Status legend: [x] done, [ ] pending, [~] optional/nice-to-have

### Core Requirements (from GUIDELINES.md)
- [x] API with FastAPI running under Docker Compose
  - [x] `backend/Dockerfile`
  - [x] `docker-compose.yml` wiring (Postgres, Backend, pgAdmin)
- [x] Database schema for Users and Simulations (PostgreSQL + SQLAlchemy + Alembic)
  - [x] `users` table (email, name, hashed_password, timestamps)
  - [x] `simulations` table (inputs, calculated fields, metadata, timestamps)
  - [x] Migrations present (`alembic` env + versions 001/002)
- [x] Authentication (email + password) and protected routes
  - [x] Registration: `POST /register`
  - [x] Login (JWT): `POST /token` (OAuth2 password flow)
  - [x] Current user: `GET /users/me`
  - [x] Update user name: `PATCH /users/me`
- [x] CRUD of Simulations, linked to the authenticated user (history per user)
  - [x] Create: `POST /simulations`
  - [x] List (paginated): `GET /simulations?skip=&limit=`
  - [x] Retrieve by id: `GET /simulations/{id}`
  - [x] Update: `PUT /simulations/{id}` (recomputes values when inputs change)
  - [x] Delete: `DELETE /simulations/{id}`
  - [x] Stats: `GET /simulations/statistics` (totals/averages)
- [x] Calculation formulas implemented per spec
  - [x] `POST /calculate` for one-off calculations without persisting
- [x] Validation (Pydantic v2; EmailStr with email-validator)
- [x] CORS middleware enabled
- [x] Health endpoint: `GET /health`
- [x] Documentation and run instructions
  - [x] Root `README.md` with run instructions and analysis
  - [x] Backend `README.md`
  - [x] Makefile with common commands (build, up, test, lint, format, migrate)
- [x] Tests
  - [x] Logic tests (`backend/test_simple.py`)
  - [x] API tests (`backend/test_main.py`) — 8/8 passing

### Gaps / Enhancements (not strictly required by GUIDELINES, but recommended)
- [ ] Strengthen configuration & security
  - [ ] Restrict CORS origins via `CORS_ORIGINS` env (avoid `*` in non-dev)
  - [ ] Validate required env vars at startup (e.g., `DATABASE_URL`, `SECRET_KEY`)
  - [ ] Document and rotate `SECRET_KEY` policy for production
  - [ ] Add HTTPS note/reverse proxy guidance for production deployment
- [ ] Testing depth
  - [ ] Add end-to-end tests for all Simulations CRUD endpoints
  - [ ] Add negative/edge-case tests (unauthorized, forbidden, invalid IDs)
  - [ ] Add token expiry/invalid token tests
- [ ] Observability & resilience
  - [ ] Structured logging + request ID correlation
  - [ ] Error handling middleware with consistent error schema
  - [ ] Health/ready endpoints split (liveness vs readiness) for prod
- [ ] Developer experience and CI
  - [ ] GitHub Actions (lint, format, test, build) on PRs
  - [ ] Pre-commit hooks (black, flake8)
  - [ ] Makefile targets for seeding data and dumping/restoring fixtures
- [ ] Database & data lifecycle
  - [ ] Add DB indices for frequent filters (e.g., `simulations.user_id`)
  - [ ] Backup/restore automation documentation (Makefile targets exist — verify on CI)
  - [ ] Optional: soft-delete for simulations with `deleted_at`
- [ ] Security hardening (optional)
  - [ ] Rate limiting on auth endpoints
  - [ ] Brute-force mitigation (lockout/backoff)
  - [ ] Password reset/change flows (if product requires)
  - [ ] Refresh tokens/short-lived access tokens (if needed)
- [ ] API usability
  - [ ] OpenAPI tags/grouping and richer descriptions/examples
  - [ ] Error response models for 4xx/5xx

### Quick Start Checklist (operational)
- [x] `make dev-setup` (build, up, migrate) works
- [x] `make test` passes (12/12)
- [x] `make format` and `make lint` succeed
- [x] `make test-api` shows healthy responses

### Notes
- The GUIDELINES backend requirements are satisfied. The above enhancements are best practices to elevate the service to production-grade quality and developer ergonomics.
