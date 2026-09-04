import type {
  AnimeDetail,
  AnimeFormat,
  AnimeStatus,
  AnimeSummary,
  CastMember,
  Episode,
  StaffMember,
} from "@/lib/api/types";
import { slugify } from "@/lib/utils/slugify";
import type {
  AniListCharacterEdge,
  AniListMedia,
  AniListStaffEdge,
  AniListStreamingEpisode,
} from "./queries";

/**
 * AniList streaming episode titles are typically formatted as
 * "Episode 3 - The Title Here". There's no dedicated episode number field,
 * so we parse it out of the title, falling back to array position.
 */
function parseEpisodeNumber(title: string | null, fallbackIndex: number): number {
  const match = title?.match(/Episode\s+(\d+)/i);
  return match ? Number(match[1]) : fallbackIndex + 1;
}

function cleanEpisodeTitle(title: string | null): string | null {
  if (!title) return null;
  const withoutPrefix = title.replace(/^Episode\s+\d+\s*[-:]?\s*/i, "").trim();
  return withoutPrefix.length > 0 ? withoutPrefix : null;
}

export function normalizeStreamingEpisodes(episodes: AniListStreamingEpisode[]): Episode[] {
  return episodes.map((ep, index) => ({
    number: parseEpisodeNumber(ep.title, index),
    title: cleanEpisodeTitle(ep.title),
    thumbnailUrl: ep.thumbnail,
    airDate: null, // AniList's streamingEpisodes field doesn't carry per-episode air dates
    synopsis: null,
    source: "anilist" as const,
  }));
}

export function normalizeCharacters(edges: AniListCharacterEdge[]): CastMember[] {
  return edges.map((edge) => {
    const va = edge.voiceActors[0] ?? null;
    return {
      characterId: edge.node.id,
      characterName: edge.node.name.full ?? "Unknown",
      characterImageUrl: edge.node.image?.large ?? null,
      role: edge.role,
      voiceActorId: va?.id ?? null,
      voiceActorName: va?.name.full ?? null,
      voiceActorImageUrl: va?.image?.large ?? null,
    };
  });
}

export function normalizeStaff(edges: AniListStaffEdge[]): StaffMember[] {
  return edges.map((edge) => ({
    staffId: edge.node.id,
    name: edge.node.name.full ?? "Unknown",
    imageUrl: edge.node.image?.large ?? null,
    role: edge.role,
  }));
}

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
    characters?: { edges: AniListCharacterEdge[] };
    staff?: { edges: AniListStaffEdge[] };
    streamingEpisodes?: AniListStreamingEpisode[];
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
    episodesList: normalizeStreamingEpisodes(media.streamingEpisodes ?? []),
    cast: normalizeCharacters(media.characters?.edges ?? []),
    staffList: normalizeStaff(media.staff?.edges ?? []),
    ageRating: null, // AniList doesn't expose an age-rating string; Kitsu enrichment fills this in
  };
}
