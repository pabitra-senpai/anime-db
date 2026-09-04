const ANILIST_ENDPOINT = "https://graphql.anilist.co";

// AniList is public/unauthenticated for read queries, but we still route
// every call through this single client so rate limiting, retries and
// error handling live in one place.
export class AniListError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AniListError";
  }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

let lastRequestAt = 0;
const MIN_INTERVAL_MS = 700; // stay well under AniList's rate limit

async function throttle() {
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  lastRequestAt = Date.now();
}

export async function anilistRequest<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  await throttle();

  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    // Cache at the fetch layer for anonymous/public queries; anime metadata
    // does not need to be refetched on every request within this window.
    next: { revalidate: 60 * 60 }, // 1 hour, adjust per freshness policy
  });

  if (!res.ok) {
    throw new AniListError(`AniList request failed: ${res.status}`, res.status);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new AniListError(json.errors.map((e) => e.message).join("; "));
  }

  if (!json.data) {
    throw new AniListError("AniList returned no data");
  }

  return json.data;
}
