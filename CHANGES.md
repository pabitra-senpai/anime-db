# Watchlist / Favorites / Ratings — changed & new files only

No Prisma schema changes — User/UserFavorite/UserWatchlist/UserRating
already existed exactly as needed. `npx prisma db push` is NOT required.

## A note on identity

There's still no real auth (that's still on the roadmap). These features
work today via a temporary anonymous, cookie-based identity — see the
comment at the top of `lib/auth/session.ts`. A first-time visitor who
favorites/tracks/rates something gets an httpOnly cookie (`animedb_uid`)
and a matching `User` row created automatically; nothing to configure.
When real auth ships later, only `getOrCreateGuestUser()`/`getGuestId()`
need to change — everything downstream (actions, buttons, `/watchlist`
page) reads `User.id` and doesn't care how it was resolved.

## Modified (already existed in your repo)

- `lib/api/metadata-service.ts` — the AniList cache write on the anime
  detail path is now `await`ed instead of fire-and-forget, so the Anime
  row is guaranteed to exist before the page (and its buttons) render.
  List endpoints (trending/popular/etc.) are untouched — still
  fire-and-forget there.
- `app/anime/[slug]/page.tsx` — wires in the three new buttons and fetches
  this guest's current favorite/watchlist/rating state.
- `components/layout/Header.tsx` — added a "My List" nav link.

## New

- `lib/auth/session.ts` — anonymous cookie-based identity (temporary
  auth stand-in).
- `lib/db/user-library.ts` — reads one guest's favorite/watchlist/rating
  state for a given anime (used to hydrate the buttons' initial state).
- `lib/actions/user-library.ts` — Server Actions: `toggleFavorite`,
  `setWatchlistStatus`, `setRating`. All three resolve the anime's cached
  row by `anilistId`, mutate, then `revalidatePath` the anime page and
  `/watchlist`.
- `lib/api/from-cached.ts` — maps a cached Prisma `Anime` row back into
  the internal `AnimeSummary` shape, for `/watchlist` (which lists straight
  from the DB rather than going back to AniList).
- `components/anime/FavoriteButton.tsx` — heart toggle, optimistic UI.
- `components/anime/WatchlistButton.tsx` — status dropdown (Watching /
  Plan to Watch / On Hold / Completed / Dropped / Remove), optimistic UI.
- `components/anime/RatingWidget.tsx` — 1–10 star picker, click the same
  value again to clear, optimistic UI.
- `app/watchlist/page.tsx` — "My List" page: favorites rail + one rail per
  watchlist status, empty state if the guest has nothing saved yet.

## Verification

- `npx tsc --noEmit` and `npx eslint` both ran clean against every file
  above.
- Couldn't run a full `next build` in this sandbox — no network access to
  `binaries.prisma.sh` to run `prisma generate`, so a few Prisma-typed
  spots show as `any` here. Same limitation as last time; run
  `npx prisma generate && npm run build` locally before deploying to
  confirm end-to-end.