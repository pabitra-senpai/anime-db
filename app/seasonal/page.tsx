import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { getSeasonal } from "@/lib/api/metadata-service";

export const metadata: Metadata = { title: "Seasonal Anime" };

function currentSeason() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month <= 3) return { season: "WINTER" as const, year };
  if (month <= 6) return { season: "SPRING" as const, year };
  if (month <= 9) return { season: "SUMMER" as const, year };
  return { season: "FALL" as const, year };
}

export default async function SeasonalPage() {
  const { season, year } = currentSeason();
  const animes = await getSeasonal(season, year, 48);
  return (
    <Container className="space-y-6 py-8">
      <h1 className="text-2xl font-bold text-fg">
        {season[0]}{season.slice(1).toLowerCase()} {year}
      </h1>
      <AnimeGrid animes={animes} />
    </Container>
  );
}
