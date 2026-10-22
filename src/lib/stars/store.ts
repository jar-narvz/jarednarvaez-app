import { Redis } from "@upstash/redis";
import type { VisitorStar } from "./types";

// Where visitor stars live. Upstash Redis (connected through the Vercel Marketplace) holds one
// list of stars per environment, so preview tests never reach the live sky. Without the Upstash
// keys (local dev; `.env.local` leaves them out on purpose) an in-memory store with sample stars
// stands in, so the sky has something to draw and test clicks stay on this machine.

/** The sky keeps the newest this many stars. */
export const MAX_STARS = 500;
/** One star per IP per this many seconds. Short on purpose: a campus network shares one IP. */
export const RATE_LIMIT_S = 600;

export type StarStore = {
  /** Newest first, at most MAX_STARS. */
  list(): Promise<VisitorStar[]>;
  add(star: VisitorStar): Promise<void>;
  /** True if this IP may place a star now (and starts its wait); false while it's waiting. */
  claim(ip: string): Promise<boolean>;
};

function upstashStore(url: string, token: string, env: string): StarStore {
  const redis = new Redis({ url, token });
  const key = `stars:${env}`;
  return {
    list: () => redis.lrange<VisitorStar>(key, 0, MAX_STARS - 1),
    async add(star) {
      await redis.lpush(key, star);
      await redis.ltrim(key, 0, MAX_STARS - 1);
    },
    async claim(ip) {
      // Set only if missing, gone after RATE_LIMIT_S. The IP is only ever this key's name.
      return (await redis.set(`stars-limit:${env}:${ip}`, 1, { nx: true, ex: RATE_LIMIT_S })) === "OK";
    },
  };
}

// PLACEHOLDER sample stars for local dev only; they never reach Upstash.
const SAMPLE_STARS: VisitorStar[] = [
  { id: "sample-1", x: 0.58, y: 0.22, city: "Sample City", region: "CA", leftAt: "2026-10-20T03:15:00.000Z", localTime: "8:15 pm" },
  { id: "sample-2", x: 0.74, y: 0.41, city: "Sample Town", region: "PH", leftAt: "2026-10-18T13:02:00.000Z", localTime: "9:02 pm" },
  { id: "sample-3", x: 0.86, y: 0.15, city: "Sample Village", region: "GB", leftAt: "2026-10-12T22:40:00.000Z", localTime: "11:40 pm" },
];

function devStore(): StarStore {
  const stars = [...SAMPLE_STARS];
  const waitUntil = new Map<string, number>();
  return {
    list: async () => stars.slice(0, MAX_STARS),
    async add(star) {
      stars.unshift(star);
      stars.length = Math.min(stars.length, MAX_STARS);
    },
    async claim(ip) {
      if ((waitUntil.get(ip) ?? 0) > Date.now()) return false;
      waitUntil.set(ip, Date.now() + RATE_LIMIT_S * 1000);
      return true;
    },
  };
}

let store: StarStore | null | undefined;

/** The store for this environment, or null when production is missing its Upstash keys. */
export function getStore(): StarStore | null {
  if (store !== undefined) return store;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url && token) store = upstashStore(url, token, process.env.VERCEL_ENV ?? "development");
  else store = process.env.NODE_ENV === "production" ? null : devStore();
  return store;
}
