export interface AniListMedia {
  id: number;
  idMal: number | null;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  description: string | null;
  coverImage: { extraLarge: string | null; color: string | null };
  bannerImage: string | null;
  format: string | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  averageScore: number | null;
  genres: string[];
  studios: { nodes: { id: number; name: string }[] };
  trailer: { id: string; site: string } | null;
}

export interface AniListCharacterEdge {
  role: string | null;
  node: {
    id: number;
    name: { full: string | null };
    image: { large: string | null } | null;
  };
  voiceActors: {
    id: number;
    name: { full: string | null };
    image: { large: string | null } | null;
  }[];
}

export interface AniListStaffEdge {
  role: string | null;
  node: {
    id: number;
    name: { full: string | null };
    image: { large: string | null } | null;
  };
}

export interface AniListStreamingEpisode {
  title: string | null;
  thumbnail: string | null;
  url: string | null;
}

export const MEDIA_FIELDS = /* GraphQL */ `
  fragment MediaFields on Media {
    id
    idMal
    title {
      romaji
      english
      native
    }
    description(asHtml: false)
    coverImage {
      extraLarge
      color
    }
    bannerImage
    format
    status
    season
    seasonYear
    episodes
    duration
    averageScore
    genres
    studios(isMain: true) {
      nodes {
        id
        name
      }
    }
    trailer {
      id
      site
    }
  }
`;

export const TRENDING_QUERY = /* GraphQL */ `
  ${MEDIA_FIELDS}
  query Trending($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
        ...MediaFields
      }
    }
  }
`;

export const POPULAR_QUERY = /* GraphQL */ `
  ${MEDIA_FIELDS}
  query Popular($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        ...MediaFields
      }
    }
  }
`;

export const TOP_RATED_QUERY = /* GraphQL */ `
  ${MEDIA_FIELDS}
  query TopRated($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME) {
        ...MediaFields
      }
    }
  }
`;

export const SEASONAL_QUERY = /* GraphQL */ `
  ${MEDIA_FIELDS}
  query Seasonal($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
        ...MediaFields
      }
    }
  }
`;

export const SEARCH_QUERY = /* GraphQL */ `
  ${MEDIA_FIELDS}
  query Search(
    $search: String
    $format: MediaFormat
    $status: MediaStatus
    $year: Int
    $season: MediaSeason
    $genre: String
    $sort: [MediaSort]
    $page: Int
    $perPage: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        total
      }
      media(
        search: $search
        format: $format
        status: $status
        seasonYear: $year
        season: $season
        genre: $genre
        sort: $sort
        type: ANIME
      ) {
        ...MediaFields
      }
    }
  }
`;

export const MEDIA_BY_ID_QUERY = /* GraphQL */ `
  ${MEDIA_FIELDS}
  query MediaById($id: Int) {
    Media(id: $id, type: ANIME) {
      ...MediaFields
      relations {
        edges {
          relationType
          node {
            ...MediaFields
          }
        }
      }
      recommendations(sort: RATING_DESC, perPage: 12) {
        nodes {
          mediaRecommendation {
            ...MediaFields
          }
        }
      }
      characters(sort: [ROLE, RELEVANCE], perPage: 16) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      staff(sort: RELEVANCE, perPage: 10) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      streamingEpisodes {
        title
        thumbnail
        url
      }
    }
  }
`;
