# Seedstack

Production-ready Next.js SaaS foundation. Auth, organizations, Stripe billing, Postgres, SEO-ready. MIT licensed.

[![CI](https://github.com/pozii/seedstack/actions/workflows/ci.yml/badge.svg)](https://github.com/pozii/seedstack/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pozii/seedstack/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pozii/seedstack/pulls)

Clone it, provision Postgres, and you have sign-up, multi-tenant organizations with roles, per-organization Stripe subscriptions synced by webhooks, and a dashboard. Everything runs from one Turborepo with shared TypeScript, ESLint, UI, database, and billing packages.

## Features

- Email and password auth with optional Google OAuth, backed by Better Auth
- Organizations with owner, admin, and member roles, invitations included
- Stripe billing per organization: checkout, customer portal, webhook-synced subscription status
- Drizzle ORM on Postgres with committed SQL migrations and a seedable local setup
- Protected dashboard routes guarded in server layouts, never in middleware
- Pricing page, billing dashboard, login, and signup screens out of the box
- Tailwind CSS v4 with shared shadcn-style UI primitives
- Health endpoint, Docker Compose for local Postgres, GitHub Actions CI with its own database
- Boots without Stripe or OAuth keys. Billing and social login degrade to clear setup notices

## Quickstart

Prerequisites: Node 22 or newer, pnpm 9 or newer, Docker for local Postgres.

```sh
git clone https://github.com/pozii/seedstack.git
cd seedstack
pnpm install
docker compose up -d postgres
cp .env.example apps/web/.env
pnpm --filter @seedstack/db db:migrate
pnpm dev
```

Open http://localhost:3000, create an account at `/signup`, and you land in `/dashboard`. Add Stripe keys to the env file to unlock `/pricing` checkout and `/dashboard/billing`.

Generate a strong auth secret with `openssl rand -base64 32`.

## Project structure

```text
seedstack/
├── apps/
│   └── web/                  Next.js 15 App Router: marketing, auth, dashboard, API
├── packages/
│   ├── db/                   Drizzle schema, client, migrations, subscription sync
│   ├── stripe/               Plan catalog, Stripe client, webhook verification
│   ├── ui/                   Shared React primitives
│   ├── config-ts/            Shared TypeScript configs
│   └── config-eslint/        Shared ESLint base
├── docker-compose.yml        Local Postgres 16
└── .github/workflows/ci.yml  Install, typecheck, lint, migrate, build
```

Environment files live per app because Next.js loads them from the app directory. `.env.example` at the root documents the full shape.

## Tech stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 15 App Router, React 19, TypeScript strict |
| Monorepo   | Turborepo with pnpm workspaces                    |
| Auth       | Better Auth with organization plugin              |
| Database   | Postgres with Drizzle ORM and postgres-js         |
| Billing    | Stripe SDK with webhook-synced subscriptions      |
| Styling    | Tailwind CSS v4 with shared UI package            |
| Validation | Zod at API boundaries                             |
| CI         | GitHub Actions with Postgres service              |

## Scripts

```sh
pnpm dev          # run everything
pnpm build        # production build
pnpm lint         # lint all workspaces
pnpm typecheck    # typecheck all workspaces
```

Database scripts live in the db package:

```sh
pnpm --filter @seedstack/db db:generate   # SQL from schema
pnpm --filter @seedstack/db db:migrate    # apply to DATABASE_URL
pnpm --filter @seedstack/db db:push       # push without migration files
pnpm --filter @seedstack/db db:studio     # visual database browser
```

## Roadmap

- [x] Turborepo skeleton with web app, shared UI, and CI
- [x] Database package with auth and organization tables
- [x] Better Auth with protected dashboard and roles
- [x] Stripe billing with webhook sync and graceful degradation
- [ ] SEO package with metadata, sitemap, robots, and JSON-LD
- [ ] Internationalization with English default and locale routing
- [ ] Test suite with unit and end-to-end coverage
- [ ] Documentation site and contribution guides

## Contributing

Issues and pull requests are welcome. Keep changes small, keep the gates green (`typecheck`, `lint`, `build`), and write code that reads as if a senior engineer wrote it on a calm afternoon. Migrations for schema changes must be committed alongside the schema.

## License

MIT. See [LICENSE](LICENSE).
