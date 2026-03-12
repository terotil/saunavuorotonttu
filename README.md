# Saunavuorotonttu

Weekly sauna schedule rotation optimizer web app ("saunavuorotonttu"). Built with SvelteKit deployed to Cloudflare Workers, with Cloudflare D1 (SQLite) as the database.

This project was created with [`sv`](https://github.com/sveltejs/cli) using the fhe following configuration:

```sh
npx sv@0.12.5 create --template minimal --types ts --install npm saunavuorotonttu
```

## Developing

```sh
npm install           # Install dependencies

npm run dev           # Start dev server
npm run dev -- --open # Start dev server
npm run check         # Type-check with svelte-check
npm run check:watch   # Type-check in watch mode
```

## Deploying

To create a production version of your app:

```sh
npm run build         # Build for production
npm run preview       # Preview production build locally
```

Remember to set `database_id` in `wrangler.toml` after creating db.  Deployment uses Wrangler (Cloudflare CLI):

```sh
npx wrangler d1 create saunavuorotonttu  # Create D1 db
npx wrangler deploy   # Deploy to Cloudflare Workers
npx wrangler dev      # Local dev with Cloudflare bindings
```
