const JIKAN_ENDPOINT = "https://api.jikan.moe/v4";

// Jikan is a free wrapper around MAL with a published rate limit of
// ~3 req/sec and 60 req/min. We only ever call it as an enrichment
// fallback (episode lists, cast) when AniList data is missing, so a
// conservative throttle here is enough — this is not the primary path.
export class JikanError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "JikanError";
  }
}

let lastRequestAt = 0;
const MIN_INTERVAL_MS = 400; // ~2.5 req/sec, comfortably under the published limit

async function throttle() {
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  lastRequestAt = Date.now();
}

/**
 * GET a Jikan REST endpoint, e.g. jikanGet(`/anime/${malId}/episodes`).
 * Enrichment-only: callers must treat failures as non-fatal and fall back
 * to whatever AniList already provided.
 */
export async function jikanGet<T>(path: string): Promise<T> {
  await throttle();

  const res = await fetch(`${JIKAN_ENDPOINT}${path}`, {
    headers: { Accept: "application/json" },
    // Episode/cast lists change rarely once an anime has finished airing;
    // cache generously and let ISR-style revalidation handle updates.
    next: { revalidate: 60 * 60 * 12 }, // 12 hours
  });

  if (!res.ok) {
    throw new JikanError(`Jikan request failed: ${res.status} ${path}`, res.status);
  }

  return (await res.json()) as T;
}
