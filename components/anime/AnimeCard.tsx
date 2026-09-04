import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { AnimeSummary } from "@/lib/api/types";
import { ScoreBadge } from "./ScoreBadge";

const FORMAT_LABEL: Record<string, string> = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  UNKNOWN: "",
};

export function AnimeCard({ anime }: { anime: AnimeSummary }) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="focus-ring group block w-[134px] shrink-0 sm:w-[180px]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-bg-elevated ring-1 ring-border transition-transform duration-150 group-hover:-translate-y-1 group-hover:ring-accent">
        {anime.posterUrl ? (
          <Image
            src={anime.posterUrl}
            alt={anime.title}
            fill
            sizes="(min-width: 640px) 180px, 134px"
            className="object-cover transition-transform duration-150 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-8 w-8 text-fg-subtle" />
          </div>
        )}
        <div className="absolute left-1.5 top-1.5">
          <ScoreBadge score={anime.score} />
        </div>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-fg group-hover:text-accent">
          {anime.title}
        </p>
        <p className="text-xs text-fg-subtle">
          {[FORMAT_LABEL[anime.format], anime.seasonYear].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
