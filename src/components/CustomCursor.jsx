import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// A soft, trailing cursor dot with spring physics — organic/flowy rather than
// snapping instantly to the pointer. Hidden on touch devices, and faded out
// while scrolling so it doesn't read as a stray dot detached from the mouse
// (fixed-position cursors don't move with scroll, which looks like a bug
// when scrolling fast without moving the mouse).
//
// Position tracking (the spring) lives on the outer anchor; the dot/label
// visuals are absolutely-positioned children centered on that anchor via
// their own CSS transform. Keeping those two transforms on separate
// elements means framer-motion's inline transform (position) never fights
// with the CSS transform (centering).
//
// The click-ripple effect is a separate concern from the dot/label: it
// runs on every device, including touch, so tapping on mobile still gets
// the visual "click landed" feedback even though there's no hover cursor
// to show there.
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [ripples, setRipples] = useState([]);
  const scrollTimeout = useRef(null);
  const rippleId = useRef(0);
  const location = useLocation();

  // A click that starts a route change (or opens a new tab) doesn't always
  // fire a natural mouseout on the old target — the label/dot state can get
  // stuck showing after navigation. Clear it whenever the route changes,
  // and pre-emptively on any click, so it never outlives the interaction.
  useEffect(() => {
    setLabel(null);
    setActive(false);
  }, [location.pathname]);

  // Click "bubble pop": fires on every click anywhere on the page, on every
  // device (desktop, tablet, phone) — not scoped to links/buttons, since
  // it's a general "click landed here" acknowledgment rather than an
  // affordance hint. A small bubble appears and immediately bursts into a
  // handful of droplets flying outward.
  useEffect(() => {
    const onClickRipple = (e) => {
      const id = rippleId.current++;
      const point = e.touches?.[0] ?? e;
      const droplets = Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 18 + Math.random() * 14;
        return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
      });
      setRipples((r) => [...r, { id, x: point.clientX, y: point.clientY, droplets }]);
      setTimeout(() => {
        setRipples((r) => r.filter((ripple) => ripple.id !== id));
      }, 500);
    };
    document.addEventListener("click", onClickRipple, true);
    return () => document.removeEventListener("click", onClickRipple, true);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    setEnabled(true);

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e) => {
      const labelEl = e.target.closest("[data-cursor-label]");
      if (labelEl) {
        setLabel(labelEl.dataset.cursorLabel);
        return;
      }
      if (e.target.closest("a, button")) setActive(true);
    };
    const onOut = (e) => {
      if (e.target.closest("[data-cursor-label]")) setLabel(null);
      if (e.target.closest("a, button")) setActive(false);
    };
    const onClickCapture = (e) => {
      if (e.target.closest("[data-cursor-label], a, button")) {
        setLabel(null);
        setActive(false);
        // Belt-and-suspenders: a route change or new-tab open right after
        // this click can, in some cases, leave a stray mouseover re-fire
        // in flight before the DOM settles. A short delayed re-clear
        // guarantees the label doesn't outlive the click either way.
        setTimeout(() => {
          setLabel(null);
          setActive(false);
        }, 60);
      }
    };
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setScrolling(false), 150);
    };
    const onWindowBlur = () => {
      setLabel(null);
      setActive(false);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onWindowBlur);
      clearTimeout(scrollTimeout.current);
    };
  }, [x, y]);

  return (
    <>
      <AnimatePresence>
        {ripples.map((r) => (
          <span key={`pop-${r.id}`} className="click-pop" style={{ left: r.x, top: r.y }} aria-hidden="true">
            <motion.span
              className="click-pop__bubble"
              initial={{ opacity: 0.9, scale: 0 }}
              animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            />
            {r.droplets.map((d, i) => (
              <motion.span
                key={i}
                className="click-pop__droplet"
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: d.dx, y: d.dy, scale: 0.2 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: 0.03 }}
              />
            ))}
          </span>
        ))}
      </AnimatePresence>

      {enabled && (
        <motion.div
          className="cursor-anchor"
          style={{ translateX: springX, translateY: springY }}
          animate={{ opacity: scrolling ? 0 : 1 }}
          aria-hidden="true"
        >
          <AnimatePresence>
            {label ? (
              <motion.span
                key="label"
                className="cursor-label"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ transformOrigin: "bottom right" }}
              >
                {label}
              </motion.span>
            ) : (
              <motion.span
                key="dot"
                className="cursor"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: active ? 2.4 : 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
