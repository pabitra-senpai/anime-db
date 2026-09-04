# AnimeDB

An IMDb-style database and discovery platform for anime, built with the
Next.js App Router. AniList (GraphQL) is the primary metadata source, with
Jikan (MyAnimeList) and Kitsu wired in as automatic enrichment fallbacks for
data AniList doesn't fully provide — full episode lists and cast/staff
credits in particular.

This is a standalone project — no shared branding, code, or architecture
with any other tool.

## Features

- Homepage discovery rails: trending, popular, top-rated, seasonal
- Search with URL-persisted filters (format, status, year, season, genre,
  sort) and pagination
- Anime detail pages with synopsis, studio/format/status info, genre chips,
  relations, and recommendations
- Episode list, and character/voice-actor and staff credits, enriched from
  Jikan/Kitsu when AniList's data is incomplete
- Dynamic SEO metadata, `sitemap.ts`, `robots.ts`
- Genre / trending / popular / top-rated / airing / upcoming / seasonal
  listing pages
- Responsive header, mobile nav, and footer with empty/error/skeleton states
- Docker and docker-compose for local or containerized deployment

## Stack

| Layer       | Choice                                                             |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Next.js 14 (App Router) + TypeScript                                |
| Styling     | Tailwind CSS (design tokens in `app/globals.css`)                   |
| Database    | PostgreSQL + Prisma ORM                                             |
| Primary API | [AniList](https://anilist.co) GraphQL (no key required for reads)   |
| Enrichment  | [Jikan](https://jikan.moe) (MyAnimeList), [Kitsu](https://kitsu.io) |

## Architecture

The UI never touches a raw provider response. Everything flows through a
single normalization boundary:

```
Provider adapter  →  normalizer  →  internal model  →  UI
lib/api/providers/*   normalize.ts   lib/api/types.ts   app/, components/
```

`lib/api/metadata-service.ts` is the only place that orchestrates providers.
For anime detail pages it:

1. Fetches from AniList and normalizes into `AnimeDetail`.
2. Caches the result to Postgres (`prisma.anime.upsert`) — the DB is a
   growing cache, not a full mirror.
3. Runs enrichment: if AniList returned no episode list or cast, it calls
   Jikan by MAL ID; if synopsis or age-rating is still missing, it calls
   Kitsu. All enrichment calls are best-effort and fail silently — a slow
   or unavailable third-party source never breaks the page.
4. On an AniList request failure, falls back to the last cached row instead
   of erroring out.

```
app/            Routes (App Router) — pages, layouts, metadata, sitemap
components/     Reusable UI (ui/, layout/, anime/, search/)
lib/api/        Provider adapters + normalizers + metadata service (cache-first)
lib/api/providers/anilist/   Primary source — GraphQL client, queries, normalizer
lib/api/providers/jikan/     Enrichment — episodes, cast fallback
lib/api/providers/kitsu/     Enrichment — synopsis/age-rating fallback
lib/db/         Prisma client singleton
lib/utils/      Small shared helpers (slugify, etc.)
prisma/         schema.prisma — full data model
```

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

   This starts Postgres on `localhost:5432` with credentials already
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

### Other useful scripts

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run db:studio   # Prisma Studio (browse/edit data)
```

## Deployment

### Why not GitHub Pages

GitHub Pages only serves **static** files (plain HTML/CSS/JS). This project
needs a Node.js server for Next.js Server Components and API routes, a
PostgreSQL database, and server-side secrets — none of which GitHub Pages
can run. GitHub is still exactly where the **code** lives; the app itself
needs a platform that can run a server and talk to a database.

### Recommended: GitHub + Vercel + a managed Postgres

The standard, low-friction path for a Next.js + Prisma app:

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

A production-ready multi-stage `Dockerfile` and a `docker-compose.yml` (app
+ Postgres) are included.

```bash
docker compose up --build
```

For Railway or Render: create a new service from this GitHub repo — they
detect the `Dockerfile` automatically. Set `DATABASE_URL` (Railway/Render
can also provision the Postgres instance for you) and
`NEXT_PUBLIC_SITE_URL` in the service's environment variables.

## Roadmap

The schema and architecture already account for the following; they need
UI/route wiring:

- Authentication
- Watchlist / favorites / ratings — interactive UI backed by the existing
  `UserWatchlist`, `UserFavorite`, `UserRating` tables
- Admin dashboard
- Automated tests

## License

MIT — see `LICENSE`.
