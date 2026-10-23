import { connection } from "next/server";
import { hashToken, newOwnerToken, sameHash } from "@/lib/stars/owner";
import { DEV_PLACE, placeFromHeaders } from "@/lib/stars/place";
import { getStore } from "@/lib/stars/store";
import type { VisitorStar } from "@/lib/stars/types";
import { parseNewStar, parseOwnerRequest } from "@/lib/stars/validate";

// Leave a star's API (docs/visual-system.md → Connect → Data, API and privacy).
// GET: every star, cached at Vercel's edge for 60s. POST { x, y, localTime }: adds one and
// returns it with a secret owner token. DELETE { id, token }: "reset", removes your own star.

const unavailable = () => Response.json({ error: "stars unavailable" }, { status: 503 });

/** The visitor's IP, used only for the rate limit and never saved with a star. */
const ipOf = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

export async function GET() {
  // Always read at request time, never baked in at build.
  await connection();
  const store = getStore();
  if (!store) return unavailable();
  try {
    const stars = await store.list();
    return Response.json(stars, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return unavailable();
  }
}

export async function POST(request: Request) {
  const store = getStore();
  if (!store) return unavailable();

  const body = await request.json().catch(() => null);
  const star = parseNewStar(body);
  if (!star) return Response.json({ error: "invalid star" }, { status: 400 });

  const place = process.env.VERCEL ? placeFromHeaders(request.headers) : DEV_PLACE;

  try {
    if (!(await store.claim(ipOf(request)))) return Response.json({ error: "too soon" }, { status: 429 });
    const saved: VisitorStar = { id: crypto.randomUUID(), ...star, ...place, leftAt: new Date().toISOString() };
    // Only the token's hash is stored; the token itself goes back to this visitor alone.
    const token = newOwnerToken();
    await store.add(saved);
    await store.setOwner(saved.id, await hashToken(token));
    return Response.json({ ...saved, token }, { status: 201 });
  } catch {
    return unavailable();
  }
}

export async function DELETE(request: Request) {
  const store = getStore();
  if (!store) return unavailable();

  const owner = parseOwnerRequest(await request.json().catch(() => null));
  if (!owner) return Response.json({ error: "invalid request" }, { status: 400 });

  try {
    const hash = await store.ownerOf(owner.id);
    if (!hash || !sameHash(hash, await hashToken(owner.token))) {
      return Response.json({ error: "not your star" }, { status: 403 });
    }
    await store.remove(owner.id);
    // Let the visitor place their star again right away; they still only ever have one.
    await store.release(ipOf(request));
    return new Response(null, { status: 204 });
  } catch {
    return unavailable();
  }
}
