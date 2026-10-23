import { describe, expect, it } from "vitest";
import { hashToken, newOwnerToken, sameHash } from "./owner";

describe("newOwnerToken", () => {
  it("is 64 hex characters and different every time", () => {
    const a = newOwnerToken();
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(newOwnerToken()).not.toBe(a);
  });
});

describe("hashToken", () => {
  it("gives the same hash for the same token, and not the token itself", async () => {
    const token = newOwnerToken();
    const hash = await hashToken(token);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toBe(token);
    expect(await hashToken(token)).toBe(hash);
    expect(await hashToken(newOwnerToken())).not.toBe(hash);
  });
});

describe("sameHash", () => {
  it("matches only identical hashes", async () => {
    const hash = await hashToken("a");
    expect(sameHash(hash, await hashToken("a"))).toBe(true);
    expect(sameHash(hash, await hashToken("b"))).toBe(false);
    expect(sameHash(hash, hash.slice(1))).toBe(false);
  });
});
