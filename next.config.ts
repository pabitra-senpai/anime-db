import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "media.kitsu.io" },
      { protocol: "https", hostname: "artworks.thetvdb.com" },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
