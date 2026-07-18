import { useEffect, useRef, useState } from "react";
import { useSoundContext } from "../context/SoundContext";

// 3D carousel matching kishore.design/about's "Photo journal" — built as a
// direct lookup table from the exact pixel data in the Figma reproduction
// (distance -3..+3 from active: real left-offset/width/height/opacity for
// each). No derived formula — those kept producing visible artifacts
// (heavy rotateY skew + box-shadow ghosting under opacity). Explicit
// width/height per distance is interpolated straight from that table so
// the shape stays a clean rectangle; only a light rotateY is layered on
// for depth. Every card shares the same vertical center — confirmed from
// the data, there is no up/down dip.
const AUTO_SPEED = 0.00028; // index units per ms
const ANGLE_STEP = 4; // mild depth hint only, not the source of sizing
const TABLE = [
  { x: 0, w: 200, h: 260, op: 1 },
  { x: 204, w: 173, h: 244, op: 0.85 },
  { x: 365, w: 123, h: 213, op: 0.35 },
  { x: 471, w: 72, h: 178, op: 0.12 },
];
const EASE = (t) => 1 - Math.pow(1 - t, 3);

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Caption opacity: active ~1, immediate neighbor ~0.33, gone by 1.5 away —
// matches kishore's measured caption opacities, interpolated smoothly
// (not stepped) so it fades in/out instead of popping mid-drift.
const CAPTION_TABLE = [
  { abs: 0, op: 1 },
  { abs: 1, op: 0.33 },
  { abs: 1.5, op: 0 },
];

function captionOpacityFor(abs) {
  if (abs >= CAPTION_TABLE[2].abs) return 0;
  for (let i = 0; i < CAPTION_TABLE.length - 1; i++) {
    const a = CAPTION_TABLE[i];
    const b = CAPTION_TABLE[i + 1];
    if (abs >= a.abs && abs <= b.abs) {
      const t = (abs - a.abs) / (b.abs - a.abs);
      return lerp(a.op, b.op, t);
    }
  }
  return 0;
}

function sampleTable(abs) {
  const lastIdx = TABLE.length - 1;
  if (abs <= lastIdx) {
    const lo = Math.floor(abs);
    const hi = Math.min(lo + 1, lastIdx);
    const t = abs - lo;
    const a = TABLE[lo];
    const b = TABLE[hi];
    return { x: lerp(a.x, b.x, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), op: lerp(a.op, b.op, t) };
  }
  // extrapolate beyond the measured range using the last segment's delta
  const a = TABLE[lastIdx - 1];
  const b = TABLE[lastIdx];
  const extra = abs - lastIdx;
  return {
    x: b.x + (b.x - a.x) * extra,
    w: Math.max(b.w + (b.w - a.w) * extra, 16),
    h: Math.max(b.h + (b.h - a.h) * extra, 16),
    op: Math.max(b.op + (b.op - a.op) * extra, 0),
  };
}

function wrapDistance(raw, length) {
  let d = raw;
  const half = length / 2;
  while (d > half) d -= length;
  while (d < -half) d += length;
  return d;
}

export default function PhotoCarousel({ items, captions }) {
  const [playing, setPlaying] = useState(true);
  const [activeDisplay, setActiveDisplay] = useState(0);
  const { playClick } = useSoundContext();
  const progressRef = useRef(0);
  const playingRef = useRef(true);
  const draggingRef = useRef(false);
  const itemRefs = useRef([]);
  const captionRefs = useRef([]);
  const tweenRef = useRef(null);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const lastActiveRef = useRef(0);
  const playClickRef = useRef(playClick);
  playClickRef.current = playClick;

  const applyTransforms = () => {
    const n = items.length;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const distance = wrapDistance(i - progressRef.current, n);
      const abs = Math.abs(distance);
      const sign = distance < 0 ? -1 : 1;
      const s = sampleTable(abs);
      const x = sign * s.x;
      const rot = -distance * ANGLE_STEP;
      el.style.width = `${s.w}px`;
      el.style.height = `${s.h}px`;
      el.style.transform = `translate(-50%, -50%) translateX(${x}px) rotateY(${rot}deg)`;
      el.style.zIndex = String(100 - Math.round(abs));
      el.style.opacity = String(s.op);
      const isActive = abs < 0.5;
      el.classList.toggle("is-active", isActive);

      const cap = captionRefs.current[i];
      if (cap) {
        const capOpacity = captionOpacityFor(abs);
        cap.style.transform = `translateX(-50%) translateX(${x}px)`;
        cap.style.opacity = String(capOpacity);
        cap.style.zIndex = String(100 - Math.round(abs));
        cap.classList.toggle("is-active", isActive);
      }
    });
    const rounded = ((Math.round(progressRef.current) % n) + n) % n;
    if (rounded !== lastActiveRef.current) {
      lastActiveRef.current = rounded;
      playClickRef.current();
    }
    setActiveDisplay((prev) => (prev === rounded ? prev : rounded));
  };

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const tick = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (tweenRef.current) {
        const tw = tweenRef.current;
        const t = Math.min((ts - tw.start) / tw.duration, 1);
        progressRef.current = tw.from + (tw.to - tw.from) * EASE(t);
        if (t >= 1) tweenRef.current = null;
      } else if (playingRef.current && !draggingRef.current) {
        progressRef.current += dt * AUTO_SPEED;
      }

      applyTransforms();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const tweenTo = (target) => {
    const n = items.length;
    const from = progressRef.current;
    const d = wrapDistance(target - from, n);
    tweenRef.current = { from, to: from + d, start: performance.now(), duration: 550 };
  };

  const goTo = (i) => tweenTo(i);

  const dragState = useRef(null);
  const onPointerDown = (e) => {
    dragState.current = { lastX: e.clientX };
    draggingRef.current = true;
    tweenRef.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragState.current) return;
    const delta = e.clientX - dragState.current.lastX;
    dragState.current.lastX = e.clientX;
    progressRef.current -= delta / 204;
  };
  const endDrag = () => {
    dragState.current = null;
    draggingRef.current = false;
  };

  return (
    <div className="photo-carousel">
      <div className="photo-carousel__bar">
        <div className="photo-carousel__controls">
          <button
            type="button"
            className="photo-carousel__toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="photo-carousel__arrow" onClick={() => goTo(activeDisplay - 1)} aria-label="Previous photo">
            ←
          </button>
          <button type="button" className="photo-carousel__arrow" onClick={() => goTo(activeDisplay + 1)} aria-label="Next photo">
            →
          </button>
        </div>
      </div>

      <div
        className="photo-carousel__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div className="photo-carousel__track">
          {items.map((src, i) => (
            <button
              type="button"
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className="photo-carousel__item"
              onClick={() => goTo(i)}
              aria-current={i === activeDisplay}
              aria-label={`Photo ${i + 1} of ${items.length}`}
            >
              <img src={src} alt="" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      </div>

      {captions && (
        <div className="photo-carousel__captions" aria-hidden="true">
          {captions.map((label, i) => (
            <span key={i} ref={(el) => (captionRefs.current[i] = el)} className="photo-carousel__caption">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
