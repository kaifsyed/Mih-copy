/**
 * StarField — a subtle, homepage-only decorative layer of tiny points of
 * light, evoking reflected jewellery sparkle rather than a night sky.
 *
 * Purely decorative: aria-hidden, pointer-events-none, and sits behind page
 * content. Rendered once on the homepage only (never global). The point set is
 * a fixed, deterministic list so server and client markup match (no hydration
 * mismatch) and the DOM stays small. Animation is CSS-only and honours
 * prefers-reduced-motion (see globals.css). Colours reuse existing tokens
 * (ivory / champagne) — no new palette.
 */

type Star = {
  top: number; // %
  left: number; // %
  size: number; // px
  champagne?: boolean; // else ivory/white
  twinkle?: boolean; // else static
  delay?: number; // s
  duration?: number; // s
};

// Sparse clusters with large empty gaps — most of the page stays clean.
// Kept deliberately modest (~34 points) for performance on mobile.
const STARS: Star[] = [
  { top: 6, left: 8, size: 2, twinkle: true, delay: 0, duration: 6 },
  { top: 10, left: 15, size: 1, champagne: true },
  { top: 4, left: 22, size: 1.5, twinkle: true, delay: 2.5, duration: 7 },
  { top: 14, left: 4, size: 1, twinkle: true, delay: 1.2, duration: 5.5 },
  { top: 18, left: 88, size: 2, champagne: true, twinkle: true, delay: 0.8, duration: 6.5 },
  { top: 8, left: 80, size: 1, twinkle: true, delay: 3, duration: 8 },
  { top: 12, left: 94, size: 1.5 },
  { top: 24, left: 72, size: 1, champagne: true, twinkle: true, delay: 1.8, duration: 6 },
  { top: 30, left: 3, size: 1.5, twinkle: true, delay: 2.2, duration: 7.5 },
  { top: 34, left: 12, size: 1, champagne: true },
  { top: 40, left: 92, size: 2, twinkle: true, delay: 0.4, duration: 6 },
  { top: 44, left: 84, size: 1, twinkle: true, delay: 3.4, duration: 7 },
  { top: 38, left: 78, size: 1, champagne: true },
  { top: 52, left: 6, size: 1.5, twinkle: true, delay: 1.5, duration: 8 },
  { top: 56, left: 16, size: 1, champagne: true, twinkle: true, delay: 2.8, duration: 6.5 },
  { top: 50, left: 24, size: 1 },
  { top: 62, left: 90, size: 1.5, champagne: true, twinkle: true, delay: 0.6, duration: 7 },
  { top: 66, left: 82, size: 1, twinkle: true, delay: 2, duration: 6 },
  { top: 60, left: 96, size: 1 },
  { top: 72, left: 10, size: 2, twinkle: true, delay: 1, duration: 6.5 },
  { top: 76, left: 20, size: 1, champagne: true },
  { top: 70, left: 5, size: 1, twinkle: true, delay: 3.2, duration: 7.5 },
  { top: 82, left: 88, size: 1.5, twinkle: true, delay: 1.6, duration: 6 },
  { top: 86, left: 78, size: 1, champagne: true, twinkle: true, delay: 2.6, duration: 7 },
  { top: 80, left: 94, size: 1 },
  { top: 90, left: 14, size: 1.5, champagne: true, twinkle: true, delay: 0.9, duration: 6.5 },
  { top: 94, left: 6, size: 1, twinkle: true, delay: 2.4, duration: 8 },
  { top: 88, left: 26, size: 1 },
  { top: 46, left: 48, size: 1, twinkle: true, delay: 3.6, duration: 8.5 },
  { top: 28, left: 40, size: 1, champagne: true },
  { top: 68, left: 56, size: 1, twinkle: true, delay: 2.1, duration: 7.5 },
  { top: 20, left: 60, size: 1 },
  { top: 78, left: 44, size: 1, champagne: true, twinkle: true, delay: 1.4, duration: 8 },
  { top: 36, left: 66, size: 1 },
];

export function StarField() {
  return (
    <div aria-hidden="true" className="mih-starfield pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`mih-star${s.twinkle ? " mih-star--twinkle" : ""}`}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.champagne
              ? "var(--color-champagne)"
              : "var(--color-ivory)",
            animationDelay: s.delay ? `${s.delay}s` : undefined,
            animationDuration: s.duration ? `${s.duration}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
