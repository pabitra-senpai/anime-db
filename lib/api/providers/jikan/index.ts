import type { CastMember, Episode } from "@/lib/api/types";
import { jikanGet } from "./client";
import { normalizeJikanCharacters, normalizeJikanEpisodes } from "./normalize";
import type { JikanCharactersResponse, JikanEpisodesResponse } from "./types";

const MAX_EPISODE_PAGES = 5; // 5 pages * 100/page covers all but the longest-running shows

/**
 * Enrichment fallback: AniList's streamingEpisodes list is often empty for
 * older or less-licensed titles. Jikan (MAL) usually has a full numbered
 * episode list with air dates, so we use it when AniList comes up short.
 * Never throws — callers get [] on any failure so a slow/rate-limited
 * enrichment source never breaks the page.
 */
export async function getEpisodesByMalId(malId: number): Promise<Episode[]> {
  const episodes: Episode[] = [];
  try {
    let page = 1;
    while (page <= MAX_EPISODE_PAGES) {
      const res = await jikanGet<JikanEpisodesResponse>(`/anime/${malId}/episodes?page=${page}`);
      episodes.push(...normalizeJikanEpisodes(res.data));
      if (!res.pagination.has_next_page) break;
      page += 1;
    }
  } catch (err) {
    console.error(`Jikan episode enrichment failed for malId ${malId}`, err);
    return [];
  }
  return episodes;
}

/**
 * Enrichment fallback for cast when AniList returns no character data.
 */
export async function getCastByMalId(malId: number): Promise<CastMember[]> {
  try {
    const res = await jikanGet<JikanCharactersResponse>(`/anime/${malId}/characters`);
    return normalizeJikanCharacters(res.data);
  } catch (err) {
    console.error(`Jikan cast enrichment failed for malId ${malId}`, err);
    return [];
  }
}
