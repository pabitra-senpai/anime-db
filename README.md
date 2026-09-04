# AnimeDB

An IMDb-style anime database and discovery website. Built with Next.js (App
Router), TypeScript, Tailwind CSS, PostgreSQL and Prisma, pulling primary
metadata from AniList (GraphQL), with Jikan/MyAnimeList and Kitsu planned as
secondary/enrichment sources.

This is a separate project from any Telegram bot or other existing tools —
no shared branding, code, or architecture.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (design tokens in `app/globals.css`)
- PostgreSQL + Prisma ORM
- AniList GraphQL API (primary data source, no API key required for reads)

## Project structure

```
app/            Routes (App Router) — pages, layouts, metadata, sitemap
components/     Reusable UI (ui/, layout/, anime/, search/)
lib/api/        Provider adapters + normalizer + metadata service (cache-first)
lib/db/         Prisma client singleton
lib/utils/      Small shared helpers (slugify, etc.)
prisma/         schema.prisma — full data model
```

The UI never touches raw AniList response shapes — everything flows through
`lib/api/metadata-service.ts`, which normalizes provider data into the
internal model in `lib/api/types.ts` before it reaches any component.

## Local development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in `DATABASE_URL` with a PostgreSQL connection string. The quickest
   way to get one locally is Docker:

   ```bash
   docker compose up -d db
   ```

   This starts Postgres on `localhost:5432` with the credentials already
   matching `.env.example`.

3. **Push the schema**

   ```bash
   npx prisma db push
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`.

## Deployment

### Why not GitHub Pages

GitHub Pages only serves **static** files (plain HTML/CSS/JS). This project
needs a Node.js server for Next.js Server Components and API routes, a
PostgreSQL database, and server-side secrets — none of which GitHub Pages can
run. GitHub is still exactly where the **code** lives; the app itself needs a
platform that can run a server and talk to a database.

### Recommended: GitHub + Vercel + a managed Postgres

This is the standard, low-friction path for a Next.js + Prisma app:

1. Push this repository to GitHub.
2. Create a free Postgres database on [Neon](https://neon.tech) or
   [Supabase](https://supabase.com) and copy its connection string.
3. Go to [vercel.com](https://vercel.com) → **New Project** → import the
   GitHub repo.
4. In the Vercel project's **Environment Variables**, add:
   - `DATABASE_URL` — the connection string from step 2
   - `NEXT_PUBLIC_SITE_URL` — your production URL (e.g.
     `https://your-app.vercel.app`)
5. Deploy. Vercel builds and redeploys automatically on every push to `main`.
6. After the first deploy, run `npx prisma db push` locally (pointed at the
   production `DATABASE_URL`) once to create the tables, or wire it into a
   build step.

### Alternative: Docker (Railway / Render / self-hosted VPS)

A production-ready multi-stage `Dockerfile` and a `docker-compose.yml` (app +
Postgres) are included.

```bash
docker compose up --build
```

For Railway or Render: create a new service from this GitHub repo, they will
detect the `Dockerfile` automatically — just set `DATABASE_URL` (Railway/
Render can also provision the Postgres instance for you) and
`NEXT_PUBLIC_SITE_URL` in the service's environment variables.

## What's implemented vs. left as follow-up

Implemented: design system/tokens, AniList provider adapter + normalizer,
cache-first metadata service, full Prisma schema (users, anime, genres,
studios, characters, episodes, relations, watchlist/favorites/ratings
tables), homepage discovery rails, search with URL-persisted filters and
pagination, anime details page with dynamic SEO metadata, sitemap.ts /
robots.ts, genre/trending/popular/top-rated/airing/upcoming/seasonal list
pages, responsive header/mobile nav/footer, empty/error/skeleton states,
Dockerfile + docker-compose.

Left as follow-up (the schema and architecture already account for these,
they just need UI/route wiring): authentication, watchlist/favorites/
ratings interactions, episode list + character/staff sections on the
details page, Jikan/Kitsu/SIMKL enrichment adapters, admin dashboard, and
automated tests.

## License

MIT — see `LICENSE`.
