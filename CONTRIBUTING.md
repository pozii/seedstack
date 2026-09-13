# Contributing to Seedstack

Thanks for stopping by. Small, focused pull requests beat large ones every time.

## Ground rules

- Keep changes small and explain the why in the pull request body.
- Keep the gates green: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
- Check formatting with `pnpm format:check` before pushing.
- Write code that reads as if a senior engineer wrote it on a calm afternoon. No commented-out code, no placeholders, no debug leftovers.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). The commit-msg hook enforces this.
- Schema changes must ship with their generated migration (`pnpm --filter @seedstack/db db:generate`) in the same pull request.

## Local setup

```sh
pnpm install
docker compose up -d postgres
cp .env.example apps/web/.env
pnpm --filter @seedstack/db db:migrate
pnpm dev
```

## Tests

```sh
pnpm test              # unit tests across workspaces
pnpm --filter @seedstack/web test:e2e   # browser suite, needs a production build first
```

End-to-end tests run against `next start`, so run `pnpm build` before them. They only touch anonymous routes, which keeps them independent of Stripe keys and OAuth credentials.

## Reporting issues

Open an issue with the template that fits. Include the Seedstack commit hash, Node and pnpm versions, and the exact command plus output that failed.
