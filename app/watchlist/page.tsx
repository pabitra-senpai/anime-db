import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeRail } from "@/components/anime/AnimeGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { getGuestId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { toAnimeSummary } from "@/lib/api/from-cached";
import type { WatchlistStatus } from "@/lib/actions/user-library";

export const metadata: Metadata = { title: "My List" };

const STATUS_ORDER: WatchlistStatus[] = [
  "WATCHING",
  "PLAN_TO_WATCH",
  "ON_HOLD",
  "COMPLETED",
  "DROPPED",
];

const STATUS_LABEL: Record<WatchlistStatus, string> = {
  WATCHING: "Watching",
  PLAN_TO_WATCH: "Plan to Watch",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
};

const EMPTY_LIST = (
  <Container className="py-16">
    <EmptyState
      title="Your list is empty"
      description="Favorite an anime or add it to your watchlist from its details page to see it here."
    />
  </Container>
);

export default async function WatchlistPage() {
  // Reading, not creating: a guest who has never favorited/tracked
  // anything has no cookie yet, and that's just an empty list, not an
  // error — see lib/auth/session.ts.
  const guestId = getGuestId();
  const user = guestId ? await prisma.user.findUnique({ where: { authId: guestId } }) : null;

  if (!user) return EMPTY_LIST;

  const [watchlist, favorites] = await Promise.all([
    prisma.userWatchlist.findMany({
      where: { userId: user.id },
      include: { anime: { include: { genres: { include: { genre: true } } } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.userFavorite.findMany({
      where: { userId: user.id },
      include: { anime: { include: { genres: { include: { genre: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const groupedWatchlist = STATUS_ORDER.map((status) => ({
    status,
    animes: watchlist
      .filter((entry) => entry.status === status)
      .map((entry) => toAnimeSummary(entry.anime)),
  })).filter((group) => group.animes.length > 0);

  const favoriteAnimes = favorites.map((entry) => toAnimeSummary(entry.anime));

  if (groupedWatchlist.length === 0 && favoriteAnimes.length === 0) return EMPTY_LIST;

  return (
    <Container className="space-y-10 py-10">
      <h1 className="text-2xl font-bold text-fg">My List</h1>

      {favoriteAnimes.length > 0 && <AnimeRail title="Favorites" animes={favoriteAnimes} />}

      {groupedWatchlist.map((group) => (
        <AnimeRail key={group.status} title={STATUS_LABEL[group.status]} animes={group.animes} />
      ))}
    </Container>
  );
}