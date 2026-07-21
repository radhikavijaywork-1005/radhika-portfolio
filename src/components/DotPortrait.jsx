import { useEffect, useRef } from "react";

// Samples the dark linework of a source illustration into a field of
// points, then animates them assembling from a scattered cloud into her
// portrait — dots literally becoming her, rather than a generic dot-wave
// sitting behind/around the artwork. Built on the same canvas particle
// approach as HeroPortraitDots, but point positions come from real image
// data instead of a random radial distribution. Once settled, dots idle
// with a faint sway and nudge gently away from the cursor. Respects
// prefers-reduced-motion by rendering the assembled portrait immediately.
const STEP = 1;
const DARK_THRESHOLD = 130;
const MAX_POINTS = 5000;
const SAMPLE_WIDTH = 800;

// --forest-soft (not --sage-deep) — it's the token that's deliberately
// kept visible against the page background in both themes (same one
// HeroPortraitDots/HeroDotWave use). --sage-deep is dark in both light
// AND dark mode, so the assembled portrait would nearly disappear
// against the dark background once the theme toggles.
function getColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--forest-soft").trim() || "#3d5850";
}

function hexToRgb(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return { r: 146, g: 166, b: 147 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function samplePoints(img) {
  const sampleW = SAMPLE_WIDTH;
  const sampleH = Math.round((img.height / img.width) * sampleW);
  const off = document.createElement("canvas");
  off.width = sampleW;
  off.height = sampleH;
  const octx = off.getContext("2d");
  octx.drawImage(img, 0, 0, sampleW, sampleH);
  const data = octx.getImageData(0, 0, sampleW, sampleH).data;

  const candidates = [];
  for (let y = 0; y < sampleH; y += STEP) {
    for (let x = 0; x < sampleW; x += STEP) {
      let darkest = 255;
      let dx = x;
      let dy = y;
      for (let cy = 0; cy < STEP && y + cy < sampleH; cy++) {
        for (let cx = 0; cx < STEP && x + cx < sampleW; cx++) {
          const idx = ((y + cy) * sampleW + (x + cx)) * 4;
          const a = data[idx + 3];
          if (a < 100) continue;
          const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          if (lum < darkest) {
            darkest = lum;
            dx = x + cx;
            dy = y + cy;
          }
        }
      }
      if (darkest < DARK_THRESHOLD) {
        candidates.push({ x: dx / sampleW, y: dy / sampleH, weight: 1 - darkest / DARK_THRESHOLD });
      }
    }
  }

  let sampled = candidates;
  if (sampled.length > MAX_POINTS) {
    const stride = sampled.length / MAX_POINTS;
    sampled = Array.from({ length: MAX_POINTS }, (_, i) => candidates[Math.floor(i * stride)]);
  }

  return sampled.map((p) => {
    const angle = Math.random() * Math.PI * 2;
    const scatterR = 0.55 + Math.random() * 0.5;
    return {
      tx: p.x,
      ty: p.y,
      sx: 0.5 + Math.cos(angle) * scatterR,
      sy: 0.5 + Math.sin(angle) * scatterR,
      // Small dots at high density read as fine linework once assembled;
      // large dots at lower density read as a coarse blob no matter how
      // sharp the sampling is — the size has to come down for the shape
      // to resolve as a specific portrait rather than a dot pattern.
      // Weight is still raised to a power (not linear) so real strokes —
      // eyes, jaw, hairline — come through denser/heavier than fill areas.
      r: 0.22 + Math.pow(p.weight, 1.3) * 0.55,
      baseOpacity: 0.35 + Math.pow(p.weight, 1.2) * 0.55,
      delay: Math.random() * 500,
      duration: 700 + Math.random() * 500,
      phase: Math.random() * Math.PI * 2,
      swayAmp: 0.0035 + Math.random() * 0.004,
    };
  });
}

export default function DotPortrait({ src, alt, className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rgb = hexToRgb(getColor());
    let points = [];
    let ready = false;
    let started = false;
    let startTime = null;

    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      rgb = hexToRgb(getColor());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const img = new Image();
    img.onload = () => {
      points = samplePoints(img);
      ready = true;
      if (reducedMotion) {
        started = true;
        startTime = -1e6;
      }
    };
    img.src = src;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          startTime = performance.now();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(container);

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

    let raf = null;
    const animate = (ts) => {
      if (w && h && ready) {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const elapsed = started ? ts - startTime - p.delay : -1;
          const t = Math.max(0, Math.min(1, elapsed / p.duration));
          const eased = easeOutCubic(t);

          let px = p.sx + (p.tx - p.sx) * eased;
          let py = p.sy + (p.ty - p.sy) * eased;
          const opacity = p.baseOpacity * eased;

          if (t >= 1 && !reducedMotion) {
            p.phase += 0.0016 * 16;
            px += Math.sin(p.phase) * p.swayAmp;
            py += Math.cos(p.phase * 0.8) * p.swayAmp;

            // Whole-portrait breathing: every settled point drifts in and
            // out from center together on a slow shared cycle, so the
            // piece keeps reading as one continuously-alive illustration
            // rather than relying on each dot's own tiny independent sway.
            const breathe = 1 + Math.sin(ts * 0.00055) * 0.012;
            px = 0.5 + (px - 0.5) * breathe;
            py = 0.5 + (py - 0.5) * breathe;

            if (pointer.has) {
              const dx = px - pointer.x;
              const dy = py - pointer.y;
              const d2 = dx * dx + dy * dy;
              const rNorm = 0.045;
              if (d2 < rNorm * rNorm * 4) {
                const falloff = Math.exp(-d2 / (2 * rNorm * rNorm));
                px += dx * falloff * 0.25;
                py += dy * falloff * 0.25;
              }
            }
          }

          if (opacity <= 0.01) continue;
          ctx.beginPath();
          ctx.arc(px * w, py * h, p.r, 0, Math.PI * 2);
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
      io.disconnect();
      container.removeChild(canvas);
    };
  }, [src]);

  return <div className={className} ref={mountRef} role="img" aria-label={alt} style={{ width: "100%", height: "100%" }} />;
}
