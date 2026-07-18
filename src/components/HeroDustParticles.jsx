import { useEffect, useRef } from "react";

// Ambient dust-mote drift — plain 2D canvas, no WebGL needed for this many
// particles. Each mote drifts slowly upward with a gentle sideways sway and
// a soft opacity breathe, looping back in at the bottom once it drifts past
// the top. Mouse proximity gives motes a light push, so there's still a
// "motion on interaction" payoff without the dot-wave's mechanical grid feel.
const COUNT = 46;
const DRIFT_SPEED = 0.012; // px/ms upward
const SWAY_SPEED = 0.0009;
const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 0.35;

function getColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--forest-soft").trim() || "#3d5850";
}

function hexToRgb(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return { r: 61, g: 88, b: 80 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function HeroDustParticles({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rgb = hexToRgb(getColor());

    const particles = Array.from({ length: COUNT }, () => spawn(true));

    function spawn(randomY) {
      return {
        x: Math.random(),
        y: randomY ? Math.random() : 1.05,
        r: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        swayAmp: 0.015 + Math.random() * 0.02,
        baseOpacity: 0.15 + Math.random() * 0.35,
        vx: 0,
        vy: 0,
      };
    }

    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const pointer = { x: -1, y: -1, has: false };
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        pointer.has = false;
        return;
      }
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.has = true;
    };
    window.addEventListener("pointermove", onPointerMove);

    const themeObserver = new MutationObserver(() => {
      rgb = hexToRgb(getColor());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let raf = null;
    let lastTs = null;
    const animate = (ts) => {
      if (lastTs == null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;

      if (w && h) {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          p.y -= DRIFT_SPEED * dt * 0.001 * 16;
          p.phase += SWAY_SPEED * dt;
          let sway = Math.sin(p.phase) * p.swayAmp;

          if (pointer.has) {
            const dx = p.x - pointer.x;
            const dyAspect = (p.y - pointer.y) * (h / w);
            const d2 = dx * dx + dyAspect * dyAspect;
            const rNorm = REPEL_RADIUS / w;
            if (d2 < rNorm * rNorm * 4) {
              const falloff = Math.exp(-d2 / (2 * rNorm * rNorm));
              p.vx += dx * falloff * REPEL_STRENGTH * 0.02;
            }
          }
          p.vx *= 0.9;
          const drawX = (p.x + sway + p.vx) * w;
          const drawY = p.y * h;

          if (p.y < -0.05) Object.assign(p, spawn(false));

          const edgeFade = Math.min(1, Math.min(p.y, 1 - p.y) * 6 + 0.15);
          const opacity = Math.max(0, p.baseOpacity * edgeFade);
          if (opacity <= 0.01) continue;

          ctx.beginPath();
          ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      container.removeChild(canvas);
    };
  }, []);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}
