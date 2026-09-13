# Seedstack

Production-ready Next.js SaaS foundation. Auth, DB, billing, SEO, i18n-ready.

## Quickstart

```sh
pnpm install
docker compose up -d postgres
cp .env.example .env
pnpm dev
```

Web runs on http://localhost:3000. Health check: `/api/health`.

## Workspaces

- `apps/web` — Next.js 15 App Router marketing, auth, dashboard
- `packages/ui` — shared React components
- `packages/config-ts` — shared TypeScript configs
- `packages/config-eslint` — shared ESLint config

## Scripts

```sh
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

## License

MIT. See LICENSE.
