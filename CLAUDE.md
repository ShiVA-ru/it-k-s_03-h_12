# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev       # Start dev server (nodemon + ts compilation, port from .env)
pnpm run watch     # TypeScript compiler in watch mode
pnpm run test      # Run all E2E tests (Node ESM experimental-vm-modules)
pnpm run jest      # Run tests single-threaded (-i flag)
pnpm run lint      # ESLint with auto-fix
pnpm run format    # Prettier formatting
```

Run a single test file:
```bash
pnpm jest --testPathPattern="blogs.api"
```

Build: TypeScript compiles to `dist/` — no explicit build script, `watch` drives it.

## Environment Setup

Copy `.env.example` to `.env` and fill in:
- `MONGO_URL` — MongoDB connection string
- `JWT_PRIVATE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- Email credentials for nodemailer (registration confirmation)
- Collection name overrides (optional, have defaults)

## Architecture

**Express + MongoDB/Mongoose + Inversify IoC container.**

Entry: `src/index.ts` → `src/setup-app.ts` (middleware + routers) → `src/composition-root.ts` (DI bindings).

### Feature Structure (DDD)

Each feature under `src/features/<feature>/` follows this layering:

```
routers/          → Express router + controller (HTTP layer)
application/      → Service classes (business logic)
domain/           → Mongoose entity/schema definitions
repositories/     → Write repo + Query repo (separate read/write)
  mappers/        → DB document → view model transformations
types/            → DTOs, view models, query/DB types
validation/       → express-validator middleware chains
constants/        → Default query filters, sort options
```

Features: `auth`, `users`, `blogs`, `posts`, `comments`, `devices`.

### DI Pattern

All services, repositories, and controllers are registered in `src/composition-root.ts` using Inversify. Decorators `@injectable()` / `@inject()` wire dependencies. Controllers receive injected services; routers call controller methods bound with `.bind()`.

### Repository Pattern

Each feature has two repositories:
- `*.repository.ts` — write operations (create, update, delete)
- `*.query.repository.ts` — read operations (find, paginate)

Pagination/sorting logic lives in `src/core/utils/build-db-query-options.ts`.

### Auth Flow

- **Access token** (short-lived JWT in Authorization header) + **Refresh token** (longer-lived JWT in httpOnly cookie)
- Refresh tokens are tied to device sessions tracked in the `devices` collection
- Guards: `access-token.guard.ts`, `refresh-token.guard.ts`, `super-admin.guard.ts` (Basic auth)
- Rate limiting on auth endpoints via `rate-limit.guard.ts` (IP + URL, configurable via env)

### Testing

All tests are E2E in `__tests__/e2e/`. Tests use:
- `supertest` against a real Express app instance
- Real MongoDB (not mocked)
- `common.test-manager.ts` for app init/teardown
- Feature-specific managers (e.g., `blogs.test-manager.ts`) for setup helpers
- A `/testing/all-data` DELETE endpoint to wipe DB between tests
