import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/search",
    "/trending",
    "/popular",
    "/top-rated",
    "/seasonal",
    "/airing",
    "/upcoming",
    "/genres",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const animes = await prisma.anime.findMany({
    select: { slug: true, updatedAt: true },
    take: 5000,
    orderBy: { updatedAt: "desc" },
  });

  const animeRoutes = animes.map((anime) => ({
    url: `${baseUrl}/anime/${anime.slug}`,
    lastModified: anime.updatedAt,
  }));

  return [...staticRoutes, ...animeRoutes];
}
