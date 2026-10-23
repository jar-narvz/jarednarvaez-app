import { describe, expect, it } from "vitest";
import { MAX_Y, parseNewStar, parseOwnerRequest } from "./validate";

describe("parseNewStar", () => {
  it("accepts a star on open sky", () => {
    expect(parseNewStar({ x: 0.62, y: 0.3, localTime: "8:15 pm" })).toEqual({ x: 0.62, y: 0.3, localTime: "8:15 pm" });
  });

  it("drops extra fields, so a visitor can't set their own city or id", () => {
    expect(parseNewStar({ x: 0.5, y: 0.5, localTime: "12:05 am", city: "Paris", id: "x" })).toEqual({
      x: 0.5,
      y: 0.5,
      localTime: "12:05 am",
    });
  });

  it("rejects positions off the sky", () => {
    expect(parseNewStar({ x: -0.1, y: 0.5, localTime: "8:15 pm" })).toBeNull();
    expect(parseNewStar({ x: 1.2, y: 0.5, localTime: "8:15 pm" })).toBeNull();
    expect(parseNewStar({ x: Number.NaN, y: 0.5, localTime: "8:15 pm" })).toBeNull();
    expect(parseNewStar({ x: "0.5", y: 0.5, localTime: "8:15 pm" })).toBeNull();
  });

  it("rejects stars below the ~90% line, so none land on the water", () => {
    expect(parseNewStar({ x: 0.5, y: MAX_Y, localTime: "8:15 pm" })).not.toBeNull();
    expect(parseNewStar({ x: 0.5, y: MAX_Y + 0.01, localTime: "8:15 pm" })).toBeNull();
  });

  it("only takes a short local time like the hover label shows", () => {
    expect(parseNewStar({ x: 0.5, y: 0.5, localTime: "20:15" })).toBeNull();
    expect(parseNewStar({ x: 0.5, y: 0.5, localTime: "13:00 pm" })).toBeNull();
    expect(parseNewStar({ x: 0.5, y: 0.5, localTime: "<script>" })).toBeNull();
    expect(parseNewStar({ x: 0.5, y: 0.5 })).toBeNull();
  });

  it("rejects bodies that aren't objects", () => {
    expect(parseNewStar(null)).toBeNull();
    expect(parseNewStar("star")).toBeNull();
  });
});

describe("parseOwnerRequest", () => {
  const token = "a".repeat(64);

  it("accepts a star id and a 64-hex-character token", () => {
    expect(parseOwnerRequest({ id: "6a72bf09-380f-499b-80c0-175472761339", token })).toEqual({
      id: "6a72bf09-380f-499b-80c0-175472761339",
      token,
    });
  });

  it("rejects a missing or malformed id or token", () => {
    expect(parseOwnerRequest({ token })).toBeNull();
    expect(parseOwnerRequest({ id: "a b", token })).toBeNull();
    expect(parseOwnerRequest({ id: "x".repeat(65), token })).toBeNull();
    expect(parseOwnerRequest({ id: "abc", token: "short" })).toBeNull();
    expect(parseOwnerRequest({ id: "abc", token: "A".repeat(64) })).toBeNull();
    expect(parseOwnerRequest(null)).toBeNull();
  });
});
