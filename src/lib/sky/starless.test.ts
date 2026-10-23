import { describe, expect, it } from "vitest";
import { boxFor, isBehindText } from "./starless";

describe("boxFor", () => {
  it("covers every sky pixel the text touches, plus one pixel of padding", () => {
    // 98–302 × 230–431 CSS px at 4px squares: pixels 24–75 × 57–107, padded to 23–77 × 56–109.
    expect(boxFor({ left: 98, top: 230, right: 302, bottom: 431 }, 4)).toEqual({ x0: 23, y0: 56, x1: 77, y1: 109 });
  });
});

describe("isBehindText", () => {
  const box = { x0: 10, y0: 10, x1: 20, y1: 15 };

  it("is true inside a text box", () => {
    expect(isBehindText(10, 10, [box])).toBe(true);
    expect(isBehindText(19, 14, [box])).toBe(true);
  });

  it("is false outside every box, and with no boxes", () => {
    expect(isBehindText(20, 12, [box])).toBe(false);
    expect(isBehindText(12, 9, [box])).toBe(false);
    expect(isBehindText(12, 12, [])).toBe(false);
  });
});
