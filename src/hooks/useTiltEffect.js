import { useCallback, useRef } from "react";

// Holographic-card style tilt: 3D perspective rotation following the
// cursor, plus a soft light-sweep highlight — both driven by CSS custom
// properties set directly on the element (no React state, tracks at full
// frame rate). Pair with the .portrait-tilt CSS.
//
// Also drives a shadow-drift and background-glow-parallax pair of vars:
// a flat tilt on its own still reads as "a picture tilting" rather than
// "an object floating in 3D space" — the shadow shifting opposite the
// tilt direction (like a card casting a shadow away from the light) and a
// background layer drifting at a different rate than the portrait itself
// (near things move more than far things) are the two cues that actually
// sell depth from a single flat illustration.
const MAX_TILT = 10; // degrees

export function useTiltEffect(maxTilt = MAX_TILT) {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltY = (x - 0.5) * maxTilt * 2;
    const tiltX = (0.5 - y) * maxTilt * 2;

    el.style.setProperty("--tilt-x", `${tiltX}deg`);
    el.style.setProperty("--tilt-y", `${tiltY}deg`);
    el.style.setProperty("--shine-x", `${x * 100}%`);
    el.style.setProperty("--shine-y", `${y * 100}%`);
    el.style.setProperty("--shine-opacity", "1");

    // Shadow drifts opposite the tilt direction, like the card is lifted
    // off the surface and light is falling on it from a fixed source —
    // this is what makes the tilt read as depth instead of a 2D skew.
    el.style.setProperty("--shadow-x", `${-tiltY * 1.4}px`);
    el.style.setProperty("--shadow-y", `${14 + tiltX * 0.7}px`);

    // Background glow drifts a fraction of the portrait's own movement —
    // a farther layer appears to move less than a near one under the same
    // viewpoint shift, which is the actual depth cue (parallax), not the
    // rotation itself.
    el.style.setProperty("--glow-x", `${tiltY * -1.1}px`);
    el.style.setProperty("--glow-y", `${tiltX * -1.1}px`);
  }, [maxTilt]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--shine-opacity", "0");
    el.style.setProperty("--shadow-x", "0px");
    el.style.setProperty("--shadow-y", "14px");
    el.style.setProperty("--glow-x", "0px");
    el.style.setProperty("--glow-y", "0px");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
