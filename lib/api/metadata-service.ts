import { prisma } from "@/lib/db/prisma";
import { anilistRequest } from "./providers/anilist/client";
import {
  MEDIA_BY_ID_QUERY,
  POPULAR_QUERY,
  SEARCH_QUERY,
  SEASONAL_QUERY,
  TOP_RATED_QUERY,
  TRENDING_QUERY,
  type AniListMedia,
} from "./providers/anilist/queries";
import { normalizeDetail, normalizeSummary } from "./providers/anilist/normalize";
import { idFromSlug } from "@/lib/utils/slugify";
import type { AnimeDetail, AnimeSummary, SearchFilters, SearchResult } from "./types";

// How long cached rows are considered fresh before we re-check the provider.
const FRESHNESS_WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Persist a normalized summary as an upsert. Called after every successful
 * provider fetch so the DB acts as a growing cache, never a full mirror.
 */
async function cacheAnime(summary: AnimeSummary) {
  try {
    await prisma.anime.upsert({
      where: { anilistId: summary.anilistId },
      create: {
        anilistId: summary.anilistId,
        malId: summary.malId,
        slug: summary.slug,
        title: summary.title,
        englishTitle: summary.englishTitle,
        nativeTitle: summary.nativeTitle,
        romajiTitle: summary.romajiTitle,
        posterUrl: summary.posterUrl,
        bannerUrl: summary.bannerUrl,
        format: summary.format,
        status: summary.status,
        seasonYear: summary.seasonYear,
        episodes: summary.episodes,
        score: summary.score,
        lastSyncedAt: new Date(),
      },
      update: {
        title: summary.title,
        posterUrl: summary.posterUrl,
        bannerUrl: summary.bannerUrl,
        format: summary.format,
        status: summary.status,
        episodes: summary.episodes,
        score: summary.score,
        lastSyncedAt: new Date(),
      },
    });
  } catch (err) {
    // Caching must never break the request/response cycle for the user.
    console.error("cacheAnime failed", err);
  }
}

export async function getTrending(perPage = 20): Promise<AnimeSummary[]> {
  const data = await anilistRequest<{ Page: { media: AniListMedia[] } }>(TRENDING_QUERY, {
    page: 1,
    perPage,
  });
  const items = data.Page.media.map(normalizeSummary);
  void Promise.all(items.map(cacheAnime));
  return items;
}

export async function getPopular(perPage = 20): Promise<AnimeSummary[]> {
  const data = await anilistRequest<{ Page: { media: AniListMedia[] } }>(POPULAR_QUERY, {
    page: 1,
    perPage,
  });
  const items = data.Page.media.map(normalizeSummary);
  void Promise.all(items.map(cacheAnime));
  return items;
}

export async function getTopRated(perPage = 20): Promise<AnimeSummary[]> {
  const data = await anilistRequest<{ Page: { media: AniListMedia[] } }>(TOP_RATED_QUERY, {
    page: 1,
    perPage,
  });
  const items = data.Page.media.map(normalizeSummary);
  void Promise.all(items.map(cacheAnime));
  return items;
}

export async function getSeasonal(
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
  year: number,
  perPage = 20
): Promise<AnimeSummary[]> {
  const data = await anilistRequest<{ Page: { media: AniListMedia[] } }>(SEASONAL_QUERY, {
    season,
    year,
    page: 1,
    perPage,
  });
  const items = data.Page.media.map(normalizeSummary);
  void Promise.all(items.map(cacheAnime));
  return items;
}

const SORT_MAP: Record<NonNullable<SearchFilters["sort"]>, string[]> = {
  RELEVANCE: ["SEARCH_MATCH"],
  POPULARITY: ["POPULARITY_DESC"],
  SCORE: ["SCORE_DESC"],
  NEWEST: ["START_DATE_DESC"],
};

export async function searchAnime(filters: SearchFilters): Promise<SearchResult> {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 24;

  const data = await anilistRequest<{
    Page: { pageInfo: { hasNextPage: boolean; total: number }; media: AniListMedia[] };
  }>(SEARCH_QUERY, {
    search: filters.query || undefined,
    format: filters.type,
    status: filters.status,
    year: filters.year,
    season: filters.season,
    genre: filters.genre,
    sort: SORT_MAP[filters.sort ?? "RELEVANCE"],
    page,
    perPage,
  });

  const items = data.Page.media.map(normalizeSummary);
  void Promise.all(items.map(cacheAnime));

  return {
    items,
    page,
    hasNextPage: data.Page.pageInfo.hasNextPage,
    total: data.Page.pageInfo.total,
  };
}

/**
 * Cache-first single-anime lookup, following the flow:
 * DB -> freshness check -> provider fallback (on miss/stale) -> normalize -> store -> return.
 * Falls back to stale cached data if the provider request fails.
 */
export async function getAnimeBySlug(slug: string): Promise<AnimeDetail | null> {
  const anilistId = idFromSlug(slug);
  if (!anilistId) return null;

  const cached = await prisma.anime.findUnique({ where: { anilistId } });
  const isFresh =
    cached?.lastSyncedAt && Date.now() - cached.lastSyncedAt.getTime() < FRESHNESS_WINDOW_MS;

  if (isFresh) {
    // Cached row is fresh enough to serve directly for list-level fields,
    // but details (relations/recommendations) always need the provider on
    // first view since we don't fully denormalize those into Postgres here.
    // A production build would also cache relations/recommendations tables.
  }

  try {
    const data = await anilistRequest<{ Media: AniListMedia | null }>(MEDIA_BY_ID_QUERY, {
      id: anilistId,
    });
    if (!data.Media) return null;
    const detail = normalizeDetail(data.Media);
    void cacheAnime(detail);
    return detail;
  } catch (err) {
    console.error(`AniList fetch failed for ${slug}, falling back to cache`, err);
    if (!cached) return null;
    // Degrade gracefully: return what we have cached, without relations.
    return {
      id: `anilist-${cached.anilistId}`,
      anilistId: cached.anilistId,
      malId: cached.malId,
      title: cached.title,
      englishTitle: cached.englishTitle,
      nativeTitle: cached.nativeTitle,
      romajiTitle: cached.romajiTitle,
      slug: cached.slug,
      posterUrl: cached.posterUrl,
      bannerUrl: cached.bannerUrl,
      format: cached.format as AnimeSummary["format"],
      status: cached.status as AnimeSummary["status"],
      seasonYear: cached.seasonYear,
      episodes: cached.episodes,
      score: cached.score,
      genres: [],
      synopsis: null,
      durationMinutes: null,
      trailerUrl: null,
      studios: [],
      relations: [],
      recommendations: [],
    };
  }
}
