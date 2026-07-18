import { useCallback, useRef } from "react";

// Mouse-following gradient glow on hover — sets CSS custom properties on
// the target element itself (--spot-x/--spot-y/--spot-opacity) rather than
// React state, so the glow tracks the cursor at full frame rate with no
// re-render cost. Pair with the .gradient-spotlight CSS class.
export function useGradientSpotlight() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
    el.style.setProperty("--spot-opacity", "1");
  }, []);

  const onMouseLeave = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
