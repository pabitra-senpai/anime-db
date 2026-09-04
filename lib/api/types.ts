/**
 * Internal normalized data model.
 *
 * Every provider adapter (AniList, Jikan, Kitsu, SIMKL) must translate its
 * raw response into these shapes. Nothing outside lib/api/providers/* is
 * allowed to read a raw provider response directly.
 */

export type AnimeFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC"
  | "UNKNOWN";

export type AnimeStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export interface AnimeSummary {
  id: string; // internal slug-friendly id, currently `anilist-<id>`
  anilistId: number;
  malId: number | null;
  title: string;
  englishTitle: string | null;
  nativeTitle: string | null;
  romajiTitle: string | null;
  slug: string;
  posterUrl: string | null;
  bannerUrl: string | null;
  format: AnimeFormat;
  status: AnimeStatus;
  seasonYear: number | null;
  episodes: number | null;
  score: number | null; // 0-100
  genres: string[];
}

export interface AnimeDetail extends AnimeSummary {
  synopsis: string | null;
  durationMinutes: number | null;
  trailerUrl: string | null;
  studios: { id: number; name: string }[];
  relations: {
    relation: string;
    anime: AnimeSummary;
  }[];
  recommendations: AnimeSummary[];
}

export interface SearchFilters {
  query?: string;
  type?: AnimeFormat;
  status?: AnimeStatus;
  year?: number;
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  genre?: string;
  sort?: "RELEVANCE" | "POPULARITY" | "SCORE" | "NEWEST";
  page?: number;
  perPage?: number;
}

export interface SearchResult {
  items: AnimeSummary[];
  page: number;
  hasNextPage: boolean;
  total: number;
}
