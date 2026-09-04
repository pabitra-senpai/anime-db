import { kitsuGet } from "./client";
import { normalizeKitsuEnrichment, type KitsuEnrichment } from "./normalize";
import type { KitsuAnimeResource, KitsuMappingResponse } from "./types";

/**
 * Enrichment fallback: fills gaps AniList leaves (missing synopsis on very
 * new entries, no age-rating concept at all) by cross-referencing Kitsu's
 * MAL mapping table. Never throws — returns null on any failure so a
 * flaky third-party source never breaks the anime page.
 */
export async function getEnrichmentByMalId(malId: number): Promise<KitsuEnrichment | null> {
  try {
    const mapping = await kitsuGet<KitsuMappingResponse>(
      `/mappings?filter[externalSite]=myanimelist/anime&filter[externalId]=${malId}&include=item`
    );
    const kitsuId = mapping.data[0]?.relationships.item.data?.id;
    if (!kitsuId) return null;

    const resource = await kitsuGet<KitsuAnimeResource>(`/anime/${kitsuId}`);
    return normalizeKitsuEnrichment(resource);
  } catch (err) {
    console.error(`Kitsu enrichment failed for malId ${malId}`, err);
    return null;
  }
}
