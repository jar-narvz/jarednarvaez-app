// Film grain, ported from the prototype's grain frames (docs/reference/sky-prototype.html).
// The hybrid dither backup was compared and not chosen (2026-10-11); it stays in the prototype.

/** How long each grain frame shows, in ms (the prototype's 0.07s). */
export const GRAIN_FRAME_MS = 70;
const GRAIN_FRAMES = 5;

/** A few frames of random grey noise. Cycling through them makes the grain move. */
export function grainFrames(width: number, height: number): HTMLCanvasElement[] {
  return Array.from({ length: GRAIN_FRAMES }, () => {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d")!;
    const image = ctx.createImageData(width, height);
    const d = image.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    return c;
  });
}
