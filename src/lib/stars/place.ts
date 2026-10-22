// Where a star was left, from Vercel's request geo headers. Only the city and a short region
// are kept (never the IP or coordinates). The headers don't exist on localhost, so the route
// uses a stand-in place there.

export type Place = { city: string; region: string };

/** The stand-in for local dev, where Vercel adds no geo headers. */
export const DEV_PLACE: Place = { city: "Local", region: "Dev" };

/**
 * City and region from the headers. Region is the state code in the US ("CA") and the country
 * code elsewhere ("PH"), as in the spec's examples. Missing pieces come back as "".
 */
export function placeFromHeaders(headers: Headers): Place {
  const country = headers.get("x-vercel-ip-country") ?? "";
  // Vercel URL-encodes the city ("S%C3%A3o%20Paulo").
  let city = headers.get("x-vercel-ip-city") ?? "";
  try {
    city = decodeURIComponent(city);
  } catch {
    city = "";
  }
  const state = headers.get("x-vercel-ip-country-region") ?? "";
  return { city, region: country === "US" && state ? state : country };
}
