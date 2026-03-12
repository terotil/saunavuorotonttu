# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

- **SvelteKit** with `@sveltejs/adapter-cloudflare` — routes map to Workers handlers
- **Cloudflare D1** (SQLite) — accessed via `platform.env.DB` in server-side code (`+page.server.ts`, `+server.ts` files)
- The `platform` environment is typed in `src/app.d.ts` under `App.Platform`
- `src/lib/` — shared utilities and components
- Svelte 5 with runes syntax is used (not legacy Svelte 4 options API)

## Cloudflare-specific notes

- The D1 binding name is `DB` (defined in `wrangler.toml`)
- The `database_id` in `wrangler.toml` is a placeholder — must be replaced with the real ID after running `wrangler d1 create`
- `nodejs_compat` flag is enabled, so Node.js APIs are available in Workers
- Use `wrangler dev` (not `npm run dev`) when you need to test D1 database access locally
