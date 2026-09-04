import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { AnimeRail } from "@/components/anime/AnimeGrid";
import { AnimeCardSkeleton } from "@/components/ui/Skeleton";
import { getPopular, getSeasonal, getTopRated, getTrending } from "@/lib/api/metadata-service";

function currentSeason(): { season: "WINTER" | "SPRING" | "SUMMER" | "FALL"; year: number } {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month <= 3) return { season: "WINTER", year };
  if (month <= 6) return { season: "SPRING", year };
  if (month <= 9) return { season: "SUMMER", year };
  return { season: "FALL", year };
}

function RailSkeleton({ title }: { title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-fg sm:text-xl">{title}</h2>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

async function TrendingRail() {
  const animes = await getTrending(20);
  return <AnimeRail title="Trending Now" animes={animes} viewAllHref="/trending" />;
}

async function PopularRail() {
  const animes = await getPopular(20);
  return <AnimeRail title="Popular Anime" animes={animes} viewAllHref="/popular" />;
}

async function TopRatedRail() {
  const animes = await getTopRated(20);
  return <AnimeRail title="Top Rated" animes={animes} viewAllHref="/top-rated" />;
}

async function SeasonalRail() {
  const { season, year } = currentSeason();
  const animes = await getSeasonal(season, year, 20);
  return (
    <AnimeRail
      title={`${season[0]}${season.slice(1).toLowerCase()} ${year} Anime`}
      description="This season's currently airing titles"
      animes={animes}
      viewAllHref="/seasonal"
    />
  );
}

export default function HomePage() {
  return (
    <Container className="space-y-10 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-fg sm:text-3xl">Discover your next anime</h1>
        <p className="text-fg-muted">Trending, popular and top-rated anime, all in one place.</p>
      </div>

      <Suspense fallback={<RailSkeleton title="Trending Now" />}>
        <TrendingRail />
      </Suspense>
      <Suspense fallback={<RailSkeleton title="Currently Airing" />}>
        <SeasonalRail />
      </Suspense>
      <Suspense fallback={<RailSkeleton title="Popular Anime" />}>
        <PopularRail />
      </Suspense>
      <Suspense fallback={<RailSkeleton title="Top Rated" />}>
        <TopRatedRail />
      </Suspense>
    </Container>
  );
}
