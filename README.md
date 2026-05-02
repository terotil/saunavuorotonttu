# Saunavuorotonttu

Weekly sauna schedule rotation optimizer web app ("saunavuorotonttu"). Built with SvelteKit deployed to Cloudflare Workers, with Cloudflare D1 (SQLite) as the database.

## Developing

Copy `.dev.vars.example` to `.dev.vars` and fill in values.

```sh
npx wrangler d1 create saunavuorotonttu  # Create D1 db
# Apply schema to local D1:
npx wrangler d1 execute saunavuorotonttu --local --file=src/lib/db/schema.sql
```
Set `database_id` in `wrangler.toml` after creating db.

```sh
npm run dev           # Start dev server
npm run build         # Build for production
npm run check         # Type-check with svelte-check
npm run check:watch   # Type-check in watch mode

# Local dev with D1 database (cloud or local depending on .dev.vars):
npx wrangler dev
```

## Architecture

- **SvelteKit** with `@sveltejs/adapter-cloudflare` — routes map to Workers handlers
- **Cloudflare D1** (SQLite) — accessed via `platform!.env.DB` in server-side code
- **Svelte 5** runes syntax throughout (`$state`, `$derived`, `$props`, `{@render children()}`)
- `src/app.d.ts` declares `App.Platform` with `DB`, `ADMIN_PASSWORD`, `ADMIN_SECRET`
- `@cloudflare/workers-types` is referenced in `tsconfig.json` for the `D1Database` type

## Code structure

```
src/lib/
  db/              — All D1 query helpers (typed, one file per entity)
    schema.sql     — Run with wrangler d1 execute to create tables
    types.ts       — Row interfaces for all tables
    index.ts       — Re-exports everything
  auth/admin.ts    — HMAC-SHA256 signed session cookie helpers
  allocation/
    optimize.ts    — Pure allocation algorithm (no DB access, unit-testable)
  utils.ts         — Finnish day names, status labels, slot formatting
```

## Database schema

7 tables: `residents`, `allocations`, `resident_priority`, `slots`, `locked_reservations`, `preferences` + `preference_slots`, `assignments`.

Key design: no groups — priority is per-allocation via `resident_priority(allocation_id, resident_id, rank)`.

## Routes

- `/` — apartment entry, sets `resident_id` cookie
- `/preferences` — resident preference editor (requires `resident_id` cookie + open allocation)
- `/results` — published rotation calendar
- `/admin` — allocation list + create (HMAC cookie auth, password from `ADMIN_PASSWORD` env var)
- `/admin/setup` — residents CRUD
- `/admin/allocations/[id]` — period lifecycle (draft→open→closed→optimized→published)
- `/admin/allocations/[id]/slots` — define weekly recurring slots
- `/admin/allocations/[id]/residents` — set priority order (drag with ↑↓ buttons)
- `/admin/allocations/[id]/locked` — pre-assign slots before optimization
- `/admin/allocations/[id]/results` — view + publish optimizer output

## Allocation algorithm

`runOptimization()` in `src/lib/allocation/optimize.ts`:
1. Apply locked reservations (immutable)
2. Sort residents by `priority` (1=highest), tiebreak alphabetically
3. Pass 1: assign each resident their highest-ranked available preferred slot
4. Pass 2: assign second slot (for `slots_requested=2`), gap cost as secondary sort key
5. Return `{ assignments, warnings }` — never assigns outside preference list

## Deploying

Deployment uses Wrangler (Cloudflare CLI). To create a production version of your app:

```sh
npm run build         # Build for production
npm run preview       # Preview production build locally
npx wrangler d1 create saunavuorotonttu  # Create D1 db, unless you did it already
npx wrangler d1 execute saunavuorotonttu --remote --file=src/lib/db/schema.sql
```

Set `database_id` in `wrangler.toml` after creating db.

```sh
npx wrangler deploy   # Deploy to Cloudflare Workers
```

- `nodejs_compat` flag enables Node.js APIs in Workers
- Admin secrets (`ADMIN_PASSWORD`, `ADMIN_SECRET`) and support contact mail (`ADMIN_EMAIL`) set via `wrangler secret put` for production
