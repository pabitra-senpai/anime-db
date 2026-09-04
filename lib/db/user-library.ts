import { prisma } from "@/lib/db/prisma";

export interface LibraryState {
  isFavorited: boolean;
  watchlistStatus: string | null;
  rating: number | null;
}

const EMPTY_STATE: LibraryState = { isFavorited: false, watchlistStatus: null, rating: null };

/**
 * Server-side read of one guest's favorite/watchlist/rating state for a
 * single anime, used to hydrate the initial state of the interactive
 * buttons on the anime details page. Returns EMPTY_STATE (never throws)
 * whenever there's no guest cookie yet, no matching user, or the anime
 * isn't cached — all of which just mean "nothing saved yet".
 */
export async function getLibraryState(
  anilistId: number,
  guestId: string | null
): Promise<LibraryState> {
  if (!guestId) return EMPTY_STATE;

  const user = await prisma.user.findUnique({ where: { authId: guestId } });
  if (!user) return EMPTY_STATE;

  const anime = await prisma.anime.findUnique({ where: { anilistId }, select: { id: true } });
  if (!anime) return EMPTY_STATE;

  const [favorite, watchlist, rating] = await Promise.all([
    prisma.userFavorite.findUnique({
      where: { userId_animeId: { userId: user.id, animeId: anime.id } },
    }),
    prisma.userWatchlist.findUnique({
      where: { userId_animeId: { userId: user.id, animeId: anime.id } },
    }),
    prisma.userRating.findUnique({
      where: { userId_animeId: { userId: user.id, animeId: anime.id } },
    }),
  ]);

  return {
    isFavorited: !!favorite,
    watchlistStatus: watchlist?.status ?? null,
    rating: rating?.score ?? null,
  };
}