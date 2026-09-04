import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ScoreBadge } from "@/components/anime/ScoreBadge";
import { GenreChips } from "@/components/anime/GenreChips";
import { AnimeRail } from "@/components/anime/AnimeGrid";
import { ShareActions } from "@/components/anime/ShareActions";
import { getAnimeBySlug } from "@/lib/api/metadata-service";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const anime = await getAnimeBySlug(params.slug);
  if (!anime) return { title: "Anime not found" };

  const description =
    anime.synopsis?.replace(/<[^>]*>/g, "").slice(0, 160) ??
    `${anime.title} — ${anime.format}, ${anime.seasonYear ?? "TBA"}.`;

  return {
    title: anime.title,
    description,
    alternates: { canonical: `/anime/${anime.slug}` },
    openGraph: {
      title: anime.title,
      description,
      images: anime.bannerUrl ? [anime.bannerUrl] : anime.posterUrl ? [anime.posterUrl] : [],
    },
  };
}

const STATUS_LABEL: Record<string, string> = {
  FINISHED: "Finished",
  RELEASING: "Airing",
  NOT_YET_RELEASED: "Upcoming",
  CANCELLED: "Cancelled",
  HIATUS: "On Hiatus",
};

export default async function AnimeDetailsPage({ params }: PageProps) {
  const anime = await getAnimeBySlug(params.slug);
  if (!anime) notFound();

  return (
    <div>
      <div className="relative h-[220px] w-full overflow-hidden bg-bg-elevated sm:h-[320px]">
        {anime.bannerUrl && (
          <Image src={anime.bannerUrl} alt="" fill priority className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      </div>

      <Container className="-mt-24 space-y-10 pb-16 sm:-mt-32">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:w-56">
            {anime.posterUrl && (
              <Image src={anime.posterUrl} alt={anime.title} fill className="object-cover" />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 pt-2">
            <div>
              <h1 className="text-2xl font-bold text-fg sm:text-3xl">{anime.title}</h1>
              {anime.romajiTitle && anime.romajiTitle !== anime.title && (
                <p className="text-fg-muted">{anime.romajiTitle}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
              <ScoreBadge score={anime.score} />
              <span>{anime.format}</span>
              <span>{STATUS_LABEL[anime.status]}</span>
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
              {anime.episodes && <span>{anime.episodes} episodes</span>}
              {anime.durationMinutes && <span>{anime.durationMinutes} min</span>}
            </div>

            <GenreChips genres={anime.genres} limit={8} />

            <ShareActions title={anime.title} trailerUrl={anime.trailerUrl} />
          </div>
        </div>

        {anime.synopsis && (
          <section className="max-w-3xl space-y-2">
            <h2 className="text-lg font-semibold text-fg">Synopsis</h2>
            <p
              className="text-sm leading-relaxed text-fg-muted"
              dangerouslySetInnerHTML={{ __html: anime.synopsis }}
            />
          </section>
        )}

        {anime.studios.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-fg">Information</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-fg-subtle">Studio</dt>
                <dd className="text-fg">{anime.studios.map((s) => s.name).join(", ")}</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Format</dt>
                <dd className="text-fg">{anime.format}</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Status</dt>
                <dd className="text-fg">{STATUS_LABEL[anime.status]}</dd>
              </div>
            </dl>
          </section>
        )}

        {anime.relations.length > 0 && (
          <AnimeRail title="Relations" animes={anime.relations.map((r) => r.anime)} />
        )}

        {anime.recommendations.length > 0 && (
          <AnimeRail title="Recommendations" animes={anime.recommendations} />
        )}
      </Container>
    </div>
  );
}
