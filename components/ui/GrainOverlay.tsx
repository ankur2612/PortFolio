/**
 * GrainOverlay
 *
 * Two fixed, non-interactive plates covering the whole application:
 *   1. film grain  — kills the flatness of pure vector/CSS art
 *   2. vignette    — frames every scene cinematically for free
 *
 * Performance notes:
 * - The noise is a single 128×128 SVG turbulence tile encoded as a data URI
 *   and *tiled* by the compositor. The filter is rasterised once when the tile
 *   is decoded, so there is no per-frame filter cost. Never apply an
 *   feTurbulence filter to a live element — that is the primary source of
 *   mobile jank in this visual style.
 * - Both layers are `position: fixed` with `pointer-events: none`, so they
 *   never repaint on scroll and never intercept input.
 * - This is a server component: zero client JS.
 */

const GRAIN_TILE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="128" height="128" filter="url(#n)"/>
    </svg>`,
  );

export function GrainOverlay() {
  return (
    <div aria-hidden="true">
      {/* Vignette — sits beneath the grain. */}
      <div
        className="pointer-events-none fixed inset-0 z-[59]"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 35%, rgb(0 0 0 / 0.55) 100%)",
        }}
      />

      {/* Film grain. */}
      <div
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          backgroundImage: `url("${GRAIN_TILE}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

export default GrainOverlay;
