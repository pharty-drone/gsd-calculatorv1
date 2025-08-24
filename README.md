# GSD Calculator v1

A secure web-based Ground Sample Distance (GSD) calculator for drone mapping.

## Environment variables

Copy the provided examples and adjust for your deployment:

```bash
cp server/.env.example server/.env
cp client/.env.production.example client/.env.production
```

## Local Dev

- `npm run dev` – start Express and Vite together.
- `npm run build` followed by `npm run serve:client` – build a production bundle and preview it locally.

## Deploy

### A) GitHub Pages (static UI)
1. Ensure `vite.config.js` uses `base: '/gsd-calculatorv1/'`.
2. Deploy the frontend with the included `pages.yml` workflow or run `npm run build:pages` and publish `client/dist`.
3. Host the backend separately and set `VITE_API_URL` in `client/.env.production` to its URL.
4. Configure the backend with `API_TOKEN` and `PROD_ORIGIN`.

### B) Full‑stack host (Render/Railway/Fly/Heroku)
1. Deploy `/server` to your host (set `API_TOKEN`, `PROD_ORIGIN`, and `SERVER_PORT`).
2. Serve the static files from `client/dist` either from the same host or from GitHub Pages.

### Embed

```html
<iframe src="https://your-domain/gsd-calculatorv1/" width="100%" height="900" style="border:0;"></iframe>
```

## Security

- All `/api/*` requests require an `x-api-token` header in production.
- Rotate the token by updating `API_TOKEN` on the server; clients will be prompted again.
- CORS is locked down to `PROD_ORIGIN` in production.
- Client-side obfuscation deters casual inspection but does not provide strong security.

## Notes

- `npm run lint` runs ESLint on both client and server.
- `npm run copy:docs` can copy the built client into `/docs` for an alternate Pages setup.
