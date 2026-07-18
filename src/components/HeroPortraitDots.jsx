import { useEffect, useRef } from "react";

// Dots scoped to the portrait itself, not the whole hero — spawned in a
// radial cloud centered on the illustration (denser near her, fading out
// toward the edges) so the motion reads as "part of her presence" rather
// than generic background wallpaper the portrait happens to sit on top
// of. Same drift/sway/mouse-repel feel as HeroDustParticles, different
// spawn distribution.
const COUNT = 60;
const DRIFT_SPEED = 0.01;
const SWAY_SPEED = 0.0008;
const REPEL_RADIUS = 70;
const REPEL_STRENGTH = 0.3;

function getColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--forest-soft").trim() || "#3d5850";
}

function hexToRgb(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return { r: 61, g: 88, b: 80 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// Radius biased toward the center via sqrt(random)^power — power > 1
// concentrates more dots near the middle than a uniform disk would.
function radialPoint() {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.pow(Math.random(), 1.6) * 0.5;
  return {
    x: 0.5 + Math.cos(angle) * radius,
    y: 0.5 + Math.sin(angle) * radius * 1.1,
  };
}

export default function HeroPortraitDots({ className }) {
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

    function spawn() {
      const p = radialPoint();
      return {
        x: p.x,
        y: p.y,
        r: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        swayAmp: 0.01 + Math.random() * 0.015,
        baseOpacity: 0.12 + Math.random() * 0.3,
        vx: 0,
      };
    }

    const particles = Array.from({ length: COUNT }, spawn);

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
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y -= DRIFT_SPEED * dt * 0.001 * 16;
          p.phase += SWAY_SPEED * dt;
          const sway = Math.sin(p.phase) * p.swayAmp;

          if (pointer.has) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            const rNorm = REPEL_RADIUS / w;
            if (d2 < rNorm * rNorm * 4) {
              const falloff = Math.exp(-d2 / (2 * rNorm * rNorm));
              p.vx += dx * falloff * REPEL_STRENGTH * 0.02;
            }
          }
          p.vx *= 0.9;

          const drawX = (p.x + sway + p.vx) * w;
          const drawY = p.y * h;

          // Radial fade: dots dim as they drift away from center, on top
          // of a gentle overall breathe — respawn near the portrait once
          // they've drifted too far or too high, instead of raining
          // upward across the whole container like the full-page version.
          const dCenter = Math.hypot(p.x - 0.5, (p.y - 0.5) * 1.1);
          if (dCenter > 0.55 || p.y < 0.05) {
            particles[i] = spawn();
            continue;
          }

          const edgeFade = Math.max(0, 1 - dCenter / 0.55);
          const opacity = p.baseOpacity * edgeFade;
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
