import type { CastMember, Episode } from "@/lib/api/types";
import type { JikanCharacterEntry, JikanEpisode } from "./types";

export function normalizeJikanEpisodes(episodes: JikanEpisode[]): Episode[] {
  return episodes.map((ep) => ({
    number: ep.mal_id,
    title: ep.title,
    thumbnailUrl: null, // Jikan's episode endpoint doesn't return thumbnails
    airDate: ep.aired,
    synopsis: ep.synopsis ?? null,
    source: "jikan" as const,
  }));
}

export function normalizeJikanCharacters(entries: JikanCharacterEntry[]): CastMember[] {
  return entries.map((entry) => {
    const va = entry.voice_actors.find((v) => v.language === "Japanese") ?? entry.voice_actors[0];
    return {
      characterId: entry.character.mal_id,
      characterName: entry.character.name,
      characterImageUrl: entry.character.images.jpg?.image_url ?? null,
      role: entry.role,
      voiceActorId: va?.person.mal_id ?? null,
      voiceActorName: va?.person.name ?? null,
      voiceActorImageUrl: va?.person.images.jpg?.image_url ?? null,
    };
  });
}
