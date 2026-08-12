import { useEffect, useRef, useState } from "react";

// Framer Motion's whileInView (backed by IntersectionObserver) can get
// stuck reporting no intersection right after mount or right after a fast
// scroll — confirmed live on production, where the Work section's cards
// and the Hero heading (via SplitText) would render at their hidden variant
// (opacity: 0) and never recover, since `viewport={{ once: true }}` means
// the observer never gets a second chance to fire once it's missed.
//
// This does the same "reveal once scrolled near it" job with a plain
// scroll listener + getBoundingClientRect check instead, which has no
// equivalent stuck-forever failure mode: every scroll (and an immediate
// check on mount, for content already in view) re-evaluates real layout
// position rather than depending on an observer callback firing.
export function useRevealOnScroll(amount = 0.1) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      // `amount` means the same thing Framer's `viewport={{ amount }}` did:
      // the fraction of the element's own height that must be visible, not
      // a fixed line in the viewport. Getting this wrong is what caused a
      // real bug — a row (amount 0.25) and a short heading nested inside it
      // (amount 0.8) have very different heights, so a fixed-viewport-line
      // version of this check made the row reveal almost immediately while
      // the heading inside it stayed hidden until scrolled much further,
      // reading as the row's content "loading in late" one piece at a time.
      const rect = el.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const ratio = rect.height > 0 ? Math.max(0, visibleHeight) / rect.height : 0;
      if (ratio >= amount) {
        setRevealed(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [amount]);

  return { ref, revealed };
}
