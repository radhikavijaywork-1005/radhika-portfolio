import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile, work, quote } from "../data/content";
import portrait from "../assets/portrait.png";
import "./PreviewVine.css";

const DESIGN_W = 1440;

// Builds an organic, non-repeating wandering path by summing a few sine
// waves of different period/amplitude/phase, then smoothing the sampled
// points into a bezier path (Catmull-Rom -> cubic bezier). Swings across
// nearly the full canvas width — it's meant to travel through the page,
// not sit in a reserved side lane. It stays legible over text because
// it's a thin, light, low-opacity line behind the content (z-index),
// not because its x-range is boxed in.
function buildVinePath(height, { band = [140, 1320], sampleEvery = 40 } = {}) {
  const [minX, maxX] = band;
  const mid = (minX + maxX) / 2;
  const amp = (maxX - minX) / 2;

  const points = [];
  for (let y = 0; y <= height; y += sampleEvery) {
    const x =
      mid +
      amp * 0.55 * Math.sin(y * 0.0021 + 0.4) +
      amp * 0.3 * Math.sin(y * 0.0052 + 2.1) +
      amp * 0.18 * Math.sin(y * 0.011 + 4.7);
    points.push([x, y]);
  }

  if (points.length < 3) return { d: "", points };

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return { d, points };
}

function pointAt(points, t) {
  const idx = Math.min(points.length - 1, Math.max(0, Math.round(t * (points.length - 1))));
  return points[idx];
}

function Leaf({ x, y, rotation, side, scale, progress, t }) {
  const opacity = useTransform(progress, [t - 0.015, t + 0.008], [0, 1]);
  const s = useTransform(progress, [t - 0.015, t + 0.015], [0.3, scale]);
  return (
    <motion.path
      d={`M0,0 C ${7 * side},-12 ${20 * side},-12 ${25 * side},0 C ${20 * side},12 ${7 * side},12 0,0 Z`}
      className="pv-leaf"
      style={{ opacity, scale: s, x, y, rotate: rotation, transformOrigin: "0px 0px" }}
    />
  );
}

function Tendril({ x, y, rotate, progress, t }) {
  const opacity = useTransform(progress, [t - 0.015, t + 0.01], [0, 1]);
  const pathLength = useTransform(progress, [t - 0.015, t + 0.02], [0, 1]);
  return (
    <motion.path
      d="M0,0 C 4,-6 10,-6 10,-14 C 10,-20 4,-22 2,-18"
      className="pv-tendril"
      style={{ opacity, pathLength, x, y, rotate }}
    />
  );
}

export default function PreviewVine() {
  const wrapRef = useRef(null);
  const HEIGHT = 5400;

  const { d: stemD, points } = useMemo(() => buildVinePath(HEIGHT), []);

  const leaves = useMemo(() => {
    const ts = [0.05, 0.12, 0.19, 0.27, 0.34, 0.41, 0.48, 0.55, 0.62, 0.69, 0.76, 0.83, 0.9, 0.96];
    return ts.map((t, i) => {
      const [x, y] = pointAt(points, t);
      const side = i % 2 === 0 ? 1 : -1;
      return { t, x: x + side * 6, y, rotation: side * (28 + (i % 3) * 6), side, scale: 0.85 + (i % 3) * 0.1 };
    });
  }, [points]);

  const tendrils = useMemo(() => {
    const ts = [0.09, 0.23, 0.38, 0.52, 0.66, 0.8, 0.93];
    return ts.map((t) => {
      const [x, y] = pointAt(points, t);
      return { t, x: x - 10, y, rotate: (t * 700) % 40 - 20 };
    });
  }, [points]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const stemPathLength = useTransform(scrollYProgress, [0, 0.96], [0, 1]);

  return (
    <div className="pv" ref={wrapRef}>
      <svg
        className="pv-svg-full"
        viewBox={`0 0 ${DESIGN_W} ${HEIGHT}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path d={stemD} className="pv-stem" style={{ pathLength: stemPathLength }} />
        {leaves.map((l, i) => (
          <Leaf key={i} {...l} progress={scrollYProgress} />
        ))}
        {tendrils.map((td, i) => (
          <Tendril key={i} {...td} progress={scrollYProgress} />
        ))}
      </svg>

      {/* ---------- Hero ---------- */}
      <section className="pv-hero">
        <span className="pv-pill">{profile.pillGreeting}</span>
        <h1 className="pv-title">{profile.title}</h1>
        <p className="pv-sub">{profile.subhead}</p>
        <p className="pv-meta">
          {profile.currentCompany.note} <strong>{profile.currentCompany.label}</strong> |{" "}
          {profile.previousCompany.note} <strong>{profile.previousCompany.label}</strong>
        </p>
        <img className="pv-portrait" src={portrait} alt="" />
      </section>

      {/* ---------- Work ---------- */}
      <section className="pv-work">
        <h2 className="pv-h2">Selected work</h2>
        <div className="pv-grid">
          {work.map((item) => (
            <div className="pv-card" key={item.title}>
              <div className="pv-card__cover" style={{ backgroundImage: item.cover }} />
              <h3 className="pv-card__title">{item.title}</h3>
              <div className="pv-card__stats">
                {item.stats.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Quote ---------- */}
      <section className="pv-quote">
        <h2 className="pv-quote__sanskrit">{quote.sanskrit}</h2>
        <p className="pv-quote__translation">{quote.translation}</p>
      </section>

      {/* ---------- Footer: vine blooms into a garden ---------- */}
      <footer className="pv-footer">
        <div className="pv-garden" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span className="pv-blade" key={i} style={{ left: `${6 + i * 11}%`, animationDelay: `${i * 0.15}s` }} />
          ))}
          {["🌸", "🌼", "🌷"].map((f, i) => (
            <span className="pv-flower" key={i} style={{ left: `${18 + i * 30}%` }}>
              {f}
            </span>
          ))}
        </div>
        <h2 className="pv-footer__heading">Let's Connect!</h2>
        <p className="pv-footer__sub">Get in touch with me on LinkedIn or at {profile.links.email}</p>
      </footer>
    </div>
  );
}
