import type { Anime as PrismaAnime, Genre } from "@prisma/client";
import type { AnimeFormat, AnimeStatus, AnimeSummary } from "./types";

type CachedAnimeWithGenres = PrismaAnime & { genres?: { genre: Genre }[] };

/**
 * The only place outside lib/api/providers/* that reads an Anime row and
 * needs it in AnimeSummary shape — used for pages (like /watchlist) that
 * list a user's saved anime straight from the cache instead of going back
 * to AniList.
 */
export function toAnimeSummary(anime: CachedAnimeWithGenres): AnimeSummary {
  return {
    id: `anilist-${anime.anilistId}`,
    anilistId: anime.anilistId,
    malId: anime.malId,
    title: anime.title,
    englishTitle: anime.englishTitle,
    nativeTitle: anime.nativeTitle,
    romajiTitle: anime.romajiTitle,
    slug: anime.slug,
    posterUrl: anime.posterUrl,
    bannerUrl: anime.bannerUrl,
    format: anime.format as AnimeFormat,
    status: anime.status as AnimeStatus,
    seasonYear: anime.seasonYear,
    episodes: anime.episodes,
    score: anime.score,
    genres: (anime.genres ?? []).map((g) => g.genre.name),
  };
}
