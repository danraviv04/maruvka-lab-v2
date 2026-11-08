/** Height of the sticky header, so a section never lands underneath it. */
export const HEADER_OFFSET = 84;

/**
 * Scroll a section into view below the sticky header.
 *
 * The site cannot rely on the browser's own anchor handling. `scroll-behavior:
 * smooth` turns a jump to `#research` into an animation, and anything that
 * changes the page height while it runs — a font swapping in, an image
 * arriving, a reveal animation settling — cancels it and leaves the visitor at
 * the top of the page with the right URL and the wrong scroll position. That
 * is the "clicking the menu does nothing" bug. Doing it ourselves also lets us
 * subtract the header, which the browser does not know about.
 */
export function scrollToSection(id: string, smooth = true): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' });
  return true;
}

/**
 * Jump to whatever the URL's hash points at, once the page has settled.
 *
 * Used when arriving from another page (`/#team`) and when the visitor presses
 * Back. The retry exists because the target can still be moving when this
 * runs; re-measuring after layout lands puts it in the right place.
 */
export function scrollToHash(hash: string): void {
  const id = hash.replace(/^#/, '');

  if (!id) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  if (!scrollToSection(id, false)) return;

  // Re-measure after the images and fonts that shift the page have arrived.
  const settle = () => scrollToSection(id, false);
  requestAnimationFrame(settle);
  window.setTimeout(settle, 120);
  window.setTimeout(settle, 400);
}
