"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateGuestUser } from "@/lib/auth/session";

export const WATCHLIST_STATUSES = [
  "WATCHING",
  "COMPLETED",
  "PLAN_TO_WATCH",
  "ON_HOLD",
  "DROPPED",
] as const;

export type WatchlistStatus = (typeof WATCHLIST_STATUSES)[number];

/**
 * The anime detail page always caches its AniList row before rendering
 * (see metadata-service.getAnimeBySlug), so by the time these actions can
 * be invoked from the page's buttons, the row is expected to exist. If it
 * genuinely doesn't (e.g. cache write failed), we surface a clear error
 * instead of silently no-op-ing.
 */
async function resolveAnimeId(anilistId: number): Promise<string> {
  const anime = await prisma.anime.findUnique({
    where: { anilistId },
    select: { id: true },
  });
  if (!anime) {
    throw new Error(`Anime with anilistId ${anilistId} isn't cached yet — reload the page.`);
  }
  return anime.id;
}

export async function toggleFavorite(anilistId: number, slug: string) {
  const user = await getOrCreateGuestUser();
  const animeId = await resolveAnimeId(anilistId);
  const key = { userId_animeId: { userId: user.id, animeId } };

  const existing = await prisma.userFavorite.findUnique({ where: key });
  if (existing) {
    await prisma.userFavorite.delete({ where: key });
  } else {
    await prisma.userFavorite.create({ data: { userId: user.id, animeId } });
  }

  revalidatePath(`/anime/${slug}`);
  revalidatePath("/watchlist");
  return { isFavorited: !existing };
}

export async function setWatchlistStatus(
  anilistId: number,
  slug: string,
  status: WatchlistStatus | null
) {
  const user = await getOrCreateGuestUser();
  const animeId = await resolveAnimeId(anilistId);
  const key = { userId_animeId: { userId: user.id, animeId } };

  if (status === null) {
    await prisma.userWatchlist.deleteMany({ where: { userId: user.id, animeId } });
  } else {
    await prisma.userWatchlist.upsert({
      where: key,
      create: { userId: user.id, animeId, status },
      update: { status },
    });
  }

  revalidatePath(`/anime/${slug}`);
  revalidatePath("/watchlist");
  return { watchlistStatus: status };
}

export async function setRating(anilistId: number, slug: string, score: number | null) {
  if (score !== null && (score < 1 || score > 10)) {
    throw new Error("Rating must be between 1 and 10.");
  }

  const user = await getOrCreateGuestUser();
  const animeId = await resolveAnimeId(anilistId);
  const key = { userId_animeId: { userId: user.id, animeId } };

  if (score === null) {
    await prisma.userRating.deleteMany({ where: { userId: user.id, animeId } });
  } else {
    await prisma.userRating.upsert({
      where: key,
      create: { userId: user.id, animeId, score },
      update: { score },
    });
  }

  revalidatePath(`/anime/${slug}`);
  revalidatePath("/watchlist");
  return { rating: score };
}