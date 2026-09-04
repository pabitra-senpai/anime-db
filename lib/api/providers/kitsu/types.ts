export interface KitsuMappingResponse {
  data: {
    id: string;
    attributes: { externalSite: string; externalId: string };
    relationships: { item: { data: { id: string; type: string } | null } };
  }[];
}

export interface KitsuAnimeResource {
  data: {
    id: string;
    attributes: {
      synopsis: string | null;
      averageRating: string | null; // "0"-"100" as a string, or null
      ageRating: string | null; // "G" | "PG" | "R" | "R18" | null
      posterImage: { original: string | null; large: string | null } | null;
      episodeCount: number | null;
    };
  };
}
