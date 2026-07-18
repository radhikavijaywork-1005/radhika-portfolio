import { useCallback, useRef } from "react";

// Holographic-card style tilt: 3D perspective rotation following the
// cursor, plus a soft light-sweep highlight — both driven by CSS custom
// properties set directly on the element (no React state, tracks at full
// frame rate). Pair with the .portrait-tilt CSS.
const MAX_TILT = 10; // degrees

export function useTiltEffect() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltY = (x - 0.5) * MAX_TILT * 2;
    const tiltX = (0.5 - y) * MAX_TILT * 2;
    el.style.setProperty("--tilt-x", `${tiltX}deg`);
    el.style.setProperty("--tilt-y", `${tiltY}deg`);
    el.style.setProperty("--shine-x", `${x * 100}%`);
    el.style.setProperty("--shine-y", `${y * 100}%`);
    el.style.setProperty("--shine-opacity", "1");
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--shine-opacity", "0");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
