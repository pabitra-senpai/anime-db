export interface JikanEpisode {
  mal_id: number;
  title: string | null;
  aired: string | null; // ISO datetime or null
  synopsis?: string | null;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
}

export interface JikanEpisodesResponse {
  data: JikanEpisode[];
  pagination: JikanPagination;
}

export interface JikanCharacterEntry {
  character: {
    mal_id: number;
    name: string;
    images: { jpg?: { image_url: string | null } };
  };
  role: string; // "Main" | "Supporting"
  voice_actors: {
    person: { mal_id: number; name: string; images: { jpg?: { image_url: string | null } } };
    language: string;
  }[];
}

export interface JikanCharactersResponse {
  data: JikanCharacterEntry[];
}
