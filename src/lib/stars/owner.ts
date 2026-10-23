// Proving a star is yours, so "reset" can remove it. Star ids are public (GET sends them to
// everyone), so an id alone can't be proof. Placing a star hands the visitor's browser a secret
// token; the server keeps only its SHA-256 hash, and a DELETE must bring the token back.

/** A new secret token: 32 random bytes as 64 hex characters. */
export function newOwnerToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** The token's SHA-256 hash as hex: what the store keeps instead of the token itself. */
export async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Whether two hashes match, comparing every character (no early exit), so response timing
 * doesn't hint at how much of a guess was right.
 */
export function sameHash(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
