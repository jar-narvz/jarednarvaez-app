// Keeping white stars out from behind text. The stars are drawn after the blur as sharp pixels,
// so neither the vignette nor the text shadow softens them, and behind small text a star reads
// as part of a letter. Text that sits on the night sky registers here; each paint the sky turns
// those elements' boxes into sky-pixel boxes and leaves the stars inside them out. Chosen by
// Jared 2026-10-23 over dimming them, which still left faint specks between letters.

/** A box on the low-res sky canvas, in sky pixels; x1 and y1 are exclusive. */
export type PixelBox = { x0: number; y0: number; x1: number; y1: number };

/** Sky pixels of padding around each text box, so a star can't touch a letter's edge. */
const PAD = 1;

/** A screen rectangle (CSS pixels) as the sky-pixel box it covers, with PAD all round. */
export function boxFor(rect: { left: number; top: number; right: number; bottom: number }, pixel: number): PixelBox {
  return {
    x0: Math.floor(rect.left / pixel) - PAD,
    y0: Math.floor(rect.top / pixel) - PAD,
    x1: Math.ceil(rect.right / pixel) + PAD,
    y1: Math.ceil(rect.bottom / pixel) + PAD,
  };
}

/** Whether sky pixel (x, y) is behind text. */
export function isBehindText(x: number, y: number, boxes: readonly PixelBox[]) {
  return boxes.some((b) => x >= b.x0 && x < b.x1 && y >= b.y0 && y < b.y1);
}

const elements = new Set<HTMLElement>();
const listeners = new Set<() => void>();
const changed = () => listeners.forEach((listener) => listener());

/** Keeps stars out from behind `el` until the returned function is called. */
export function keepStarsOut(el: HTMLElement) {
  elements.add(el);
  changed();
  return () => {
    elements.delete(el);
    changed();
  };
}

/** Calls `listener` when an element starts or stops keeping stars out (so a still sky repaints). */
export function onStarlessChange(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The registered elements' boxes on the sky right now (only those on screen). */
export function textBoxes(pixel: number): PixelBox[] {
  const boxes: PixelBox[] = [];
  for (const el of elements) {
    const r = el.getBoundingClientRect();
    if (r.width && r.height && r.bottom > 0 && r.top < window.innerHeight) boxes.push(boxFor(r, pixel));
  }
  return boxes;
}
