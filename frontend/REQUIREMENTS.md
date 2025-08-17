## aMORA Frontend Requirements (Next.js 15.4)

This document tracks the scope, tasks, and subtasks for the aMORA frontend, aligned with `GUIDELINES.md`.

### Goals
- Build a production-grade Next.js app that:
  - Implements a complete simulation flow (form, calculation preview, persist)
  - Shows each user’s simulation history (CRUD)
  - Integrates securely with the FastAPI backend
  - Prioritizes a pleasant and responsive UX per aMORA brand

### Tech Stack
- Next.js 15.4 (App Router)
- TypeScript
- UI: Tailwind CSS + Radix UI (primitives) + a small design system
- Forms & validation: React Hook Form + Zod
- Data fetching & caching: TanStack Query (v5) with fetch
- Auth: JWT Bearer (from backend `/token`) stored securely (see Security)
- Testing: Vitest + Testing Library + Playwright (e2e)
- Lint/format: ESLint + Prettier + Stylelint (optional)
- Env: `.env.local` with `NEXT_PUBLIC_API_BASE_URL`
- Docker: Node 20 Alpine image; dev + prod targets

### Pages & Routes (App Router)
- `/` Landing or redirect to `/dashboard` if authenticated
- `/auth/login` Login page
- `/auth/register` Registration page
- `/dashboard` Authenticated home with:
  - Simulation form (create new)
  - Quick calculation (without saving)
  - Recent simulations list
- `/simulations` Paginated list of user simulations
- `/simulations/[id]` Simulation details page
- `/simulations/[id]/edit` Edit simulation page
- `/profile` View/update user profile (name)
- `/(public)/health` Health check page (optional, developer aid)

### API Integration
- Auth
  - `POST /register`
  - `POST /token` → receive `access_token`
  - `GET /users/me`
  - `PATCH /users/me` (update name)
- Simulation
  - `POST /calculate` (no auth needed)
  - `POST /simulations`
  - `GET /simulations?skip=&limit=`
  - `GET /simulations/{id}`
  - `PUT /simulations/{id}`
  - `DELETE /simulations/{id}`
  - `GET /simulations/statistics`

### UX Requirements (from GUIDELINES.md)
- Responsive design (mobile-first)
- Intuitive simulation form with clear field help and validation errors
- Visually pleasing layout and spacing
- Clear calls to action for save vs calculate-only
- Accessible components (keyboard and screen reader friendly)

### Security & Auth
- Store JWT access token with minimal exposure surface:
  - Preferred: in-memory + refresh on login; fallback to `localStorage` behind a thin abstraction
  - Attach `Authorization: Bearer <token>` on authenticated requests
  - Handle token expiry and 401 auto-logout
- Do not expose secrets in frontend env files (only NEXT_PUBLIC_*)

### State & Data
- TanStack Query for caching user data, simulations, and statistics
- Query keys scoped per-user (invalidate on logout)
- Mutations: optimistic updates for update/delete, with rollback

### Form & Validation
- React Hook Form + Zod schema mirroring backend constraints:
  - property_value: number > 0
  - down_payment_percentage: 0–100
  - contract_years: 1–30
  - email: Zod string email
  - password: min 6 chars
- Re-validate server responses and display field-level messages

### Components
- Layout: Header (brand, nav), Sidebar (optional), Footer
- Auth: LoginForm, RegisterForm
- Simulations: SimulationForm, SimulationList, SimulationCard, SimulationStats
- Feedback: Toasts (success/error), Loading spinners, Empty states
- Common: Button, Input, Select, Textarea, Dialog/Modal, ConfirmDelete

### Error Handling
- API layer normalizes errors to a common shape
- Global error boundary for unexpected errors
- Graceful handling of 401 (logout + redirect)
- User-friendly messages for validation and server errors

### Accessibility (a11y)
- Keyboard focus management, visible focus rings
- Proper labels/aria attributes
- Color contrast adherence
- Skip to content link

### Internationalization (optional, nice-to-have)
- i18n-ready strings with a lightweight solution (e.g., next-intl)

### Performance
- Avoid unnecessary client-side JS; prefer server components where possible
- Cache GET requests with TanStack Query
- Image optimization (Next Image)

### Testing
- Unit: Vitest + React Testing Library for components and hooks
- Integration: testing form flows and API-client interactions
- E2E: Playwright basic flows (login, create simulation, edit, delete)

### Tooling & DX
- ESLint + Prettier configured for Next.js + TypeScript
- Strict TypeScript settings
- Path aliases (e.g., `@/components`, `@/lib`)
- Makefile targets: `frontend-dev`, `frontend-build`, `frontend-test`, `frontend-lint`

### Docker & Compose
- `frontend/Dockerfile` with multi-stage build (builder → runner)
- Add `frontend` service to `docker-compose.yml` (ports 3000)
- Depend on `backend` for API URL, use `NEXT_PUBLIC_API_BASE_URL`

### CI (follow-up)
- GitHub Actions: install, lint, test, build

### Deliverables
- Next.js app scaffold
- Themed UI with Tailwind + Radix
- Fully wired auth + CRUD + calculate flow
- Tests and lint passing
- Dockerized frontend integrated into compose

### Tasks & Subtasks
- [ ] Project Setup
  - [ ] Initialize Next.js 15.4 with `create-next-app` (TypeScript, App Router)
  - [ ] Setup Tailwind CSS
  - [ ] Install and configure ESLint + Prettier
  - [ ] Install TanStack Query, React Hook Form, Zod, Radix UI
  - [ ] Setup absolute imports (`@/*`)
  - [ ] Environment variables (`NEXT_PUBLIC_API_BASE_URL`)
- [ ] API Client Layer
  - [ ] Base fetch wrapper with interceptors
  - [ ] Auth endpoints (`/register`, `/token`, `/users/me`, `/users/me` PATCH)
  - [ ] Simulation endpoints (CRUD + `/calculate` + `/statistics`)
  - [ ] Error normalization util
- [ ] Auth Flow
  - [ ] Token storage (in-memory + optional localStorage)
  - [ ] Login, Logout, Register actions
  - [ ] Auth guard (server + client components where needed)
- [ ] UI & Pages
  - [ ] Layout & Navigation
  - [ ] Login/Register pages
  - [ ] Dashboard with simulation form + recent list
  - [ ] Simulations list/detail/edit pages
  - [ ] Profile page (name update)
  - [ ] Empty states, loaders, error states
- [ ] Forms & Validation
  - [ ] Zod schemas matching backend
  - [ ] React Hook Form integration
  - [ ] Field-level validation + server error mapping
- [ ] Data & Caching
  - [ ] Query/mutation hooks for simulations and user
  - [ ] Cache invalidation on mutations and logout
- [ ] Testing
  - [ ] Unit/component tests (Vitest + RTL)
  - [ ] Integration tests for forms and API layer
  - [ ] E2E basic flows (Playwright)
- [ ] Accessibility & Performance
  - [ ] Keyboard navigation and focus management
  - [ ] Contrast and aria checks
  - [ ] Server components where possible
- [ ] Docker & Makefile
  - [ ] `frontend/Dockerfile` (multi-stage)
  - [ ] Compose service (port 3000)
  - [ ] Makefile targets for dev/test/build

### Open Questions
- Should we persist tokens in httpOnly cookies via backend support, or keep SPA-managed tokens? (Current backend uses OAuth2 token response without cookies.)
- Theming: do we want light/dark mode toggles now or later?
- i18n: required for initial scope?
