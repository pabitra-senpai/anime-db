import type { AnimeDetail, AnimeFormat, AnimeStatus, AnimeSummary } from "@/lib/api/types";
import { slugify } from "@/lib/utils/slugify";
import type { AniListMedia } from "./queries";

const FORMAT_MAP: Record<string, AnimeFormat> = {
  TV: "TV",
  TV_SHORT: "TV_SHORT",
  MOVIE: "MOVIE",
  SPECIAL: "SPECIAL",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "MUSIC",
};

const STATUS_MAP: Record<string, AnimeStatus> = {
  FINISHED: "FINISHED",
  RELEASING: "RELEASING",
  NOT_YET_RELEASED: "NOT_YET_RELEASED",
  CANCELLED: "CANCELLED",
  HIATUS: "HIATUS",
};

function pickTitle(media: AniListMedia): string {
  return media.title.english ?? media.title.romaji ?? media.title.native ?? "Untitled";
}

export function normalizeSummary(media: AniListMedia): AnimeSummary {
  const title = pickTitle(media);
  return {
    id: `anilist-${media.id}`,
    anilistId: media.id,
    malId: media.idMal,
    title,
    englishTitle: media.title.english,
    nativeTitle: media.title.native,
    romajiTitle: media.title.romaji,
    slug: slugify(title, media.id),
    posterUrl: media.coverImage.extraLarge,
    bannerUrl: media.bannerImage,
    format: FORMAT_MAP[media.format ?? ""] ?? "UNKNOWN",
    status: STATUS_MAP[media.status ?? ""] ?? "FINISHED",
    seasonYear: media.seasonYear,
    episodes: media.episodes,
    score: media.averageScore,
    genres: media.genres ?? [],
  };
}

export function normalizeDetail(
  media: AniListMedia & {
    relations?: { edges: { relationType: string; node: AniListMedia }[] };
    recommendations?: { nodes: { mediaRecommendation: AniListMedia | null }[] };
  }
): AnimeDetail {
  return {
    ...normalizeSummary(media),
    synopsis: media.description,
    durationMinutes: media.duration,
    trailerUrl:
      media.trailer?.site === "youtube" && media.trailer.id
        ? `https://www.youtube.com/watch?v=${media.trailer.id}`
        : null,
    studios: media.studios?.nodes ?? [],
    relations: (media.relations?.edges ?? []).map((edge) => ({
      relation: edge.relationType,
      anime: normalizeSummary(edge.node),
    })),
    recommendations: (media.recommendations?.nodes ?? [])
      .map((n) => n.mediaRecommendation)
      .filter((m): m is AniListMedia => m !== null)
      .map(normalizeSummary),
  };
}
