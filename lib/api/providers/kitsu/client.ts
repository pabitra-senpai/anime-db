const KITSU_ENDPOINT = "https://kitsu.io/api/edge";

// Kitsu has no hard published rate limit for the public JSON:API, but we
// throttle anyway since, like Jikan, this is an enrichment-only fallback
// path and should never compete with the primary AniList request.
export class KitsuError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "KitsuError";
  }
}

let lastRequestAt = 0;
const MIN_INTERVAL_MS = 300;

async function throttle() {
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  lastRequestAt = Date.now();
}

export async function kitsuGet<T>(path: string): Promise<T> {
  await throttle();

  const res = await fetch(`${KITSU_ENDPOINT}${path}`, {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    next: { revalidate: 60 * 60 * 12 }, // 12 hours
  });

  if (!res.ok) {
    throw new KitsuError(`Kitsu request failed: ${res.status} ${path}`, res.status);
  }

  return (await res.json()) as T;
}
