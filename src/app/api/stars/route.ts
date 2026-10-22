import { connection } from "next/server";
import { DEV_PLACE, placeFromHeaders } from "@/lib/stars/place";
import { getStore } from "@/lib/stars/store";
import type { VisitorStar } from "@/lib/stars/types";
import { parseNewStar } from "@/lib/stars/validate";

// Leave a star's API (docs/visual-system.md → Connect → Data, API and privacy).
// GET: every star, cached at Vercel's edge for 60s. POST { x, y, localTime }: adds one.

const unavailable = () => Response.json({ error: "stars unavailable" }, { status: 503 });

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

  // The IP is used only for the rate limit and never saved with the star.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const place = process.env.VERCEL ? placeFromHeaders(request.headers) : DEV_PLACE;

  try {
    if (!(await store.claim(ip))) return Response.json({ error: "too soon" }, { status: 429 });
    const saved: VisitorStar = { id: crypto.randomUUID(), ...star, ...place, leftAt: new Date().toISOString() };
    await store.add(saved);
    return Response.json(saved, { status: 201 });
  } catch {
    return unavailable();
  }
}
