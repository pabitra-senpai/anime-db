import type { KitsuAnimeResource } from "./types";

export interface KitsuEnrichment {
  synopsis: string | null;
  posterUrl: string | null;
  ageRating: string | null;
}

export function normalizeKitsuEnrichment(resource: KitsuAnimeResource): KitsuEnrichment {
  const attrs = resource.data.attributes;
  return {
    synopsis: attrs.synopsis,
    posterUrl: attrs.posterImage?.large ?? attrs.posterImage?.original ?? null,
    ageRating: attrs.ageRating,
  };
}
