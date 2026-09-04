import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db/prisma";

const COOKIE_NAME = "animedb_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Temporary stand-in for real authentication (see README roadmap).
 * Issues an anonymous, cookie-based identity so watchlist/favorites/
 * ratings work today. User.authId is provider-agnostic, so swapping this
 * for a real auth provider later won't touch the schema or the
 * favorites/watchlist/rating logic — only how `authId` gets set.
 */

/**
 * Read-only lookup for Server Components, which cannot set cookies.
 * Returns null if this visitor has never taken a library action yet.
 */
export function getGuestId(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}

/**
 * Read-write: only callable from Server Actions or Route Handlers.
 * Creates the cookie and the backing User row on first use.
 */
export async function getOrCreateGuestUser() {
  const store = cookies();
  let guestId = store.get(COOKIE_NAME)?.value;

  if (!guestId) {
    guestId = randomUUID();
    store.set(COOKIE_NAME, guestId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return prisma.user.upsert({
    where: { authId: guestId },
    create: { authId: guestId, username: `guest-${guestId.slice(0, 8)}` },
    update: {},
  });
}