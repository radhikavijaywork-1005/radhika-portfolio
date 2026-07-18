import { useEffect, useRef, useState } from "react";

// Layered, time-based leaf-fall physics — gravity + wind drift + rotation +
// scale breathing + gentle opacity fade, combined so no axis moves alone
// (a single straight-line fall reads as "programmed"; several small
// independent oscillations read as "carried by wind").
//
// Scroll only TRIGGERS the fall once past `threshold` — after that the
// animation runs on its own clock via requestAnimationFrame and finishes
// even if the user stops scrolling; it does NOT re-check scroll position
// while falling, so a mid-fall scroll wobble near the threshold can't
// snap it back (that was the earlier bug — resetting on every scroll
// event that dipped back under `threshold`, which reads as the leaf
// "disappearing" mid-air). Reset only happens once the fall has fully
// finished and the user has scrolled essentially back to the top.
//
// The fall path is a genuine diagonal (net horizontal travel via
// `diagonalDrift`, not just a symmetric side-to-side wobble that
// averages back to a straight vertical line) with wind-like oscillation
// layered on top.
//
// Swap `leafSrc`/`branchSrc` for real assets later — this component only
// deals in motion, not asset content.
export default function DetachingLeaf({
  leafSrc,
  branchSrc,
  threshold = 130,
  resetThreshold = 20,
  fallDuration = 7.5,
  fallDistance = 560,
  diagonalDrift = -260,
  className = "",
}) {
  const [falling, setFalling] = useState(false);
  const leafRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const triggeredRef = useRef(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (y > threshold && !triggeredRef.current) {
        triggeredRef.current = true;
        doneRef.current = false;
        setFalling(true);
        startRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Only re-arm once the fall has finished AND the user is back near
      // the very top — a brief dip below `threshold` mid-fall no longer
      // cancels anything.
      if (doneRef.current && y <= resetThreshold && triggeredRef.current) {
        triggeredRef.current = false;
        setFalling(false);
        if (leafRef.current) {
          leafRef.current.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)";
          leafRef.current.style.opacity = "1";
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, resetThreshold]);

  function tick(ts) {
    if (!startRef.current) startRef.current = ts;
    const t = (ts - startRef.current) / 1000;
    const progress = Math.min(t / fallDuration, 1);
    const eased = easeInOutQuad(progress);

    const gravityY = eased * fallDistance;
    const diagonalX = eased * diagonalDrift;
    const windX = Math.sin(t * 1.3) * 16 + Math.sin(t * 0.55 + 1.2) * 11;
    const driftX = diagonalX + windX;
    const rotate = Math.sin(t * 0.85) * 22 + progress * 70;
    const scale = 1 + Math.sin(t * 1.7) * 0.035;
    const opacity = progress < 0.85 ? 1 : 1 - (progress - 0.85) / 0.15;

    if (leafRef.current) {
      leafRef.current.style.transform = `translate(${driftX}px, ${gravityY}px) rotate(${rotate}deg) scale(${scale})`;
      leafRef.current.style.opacity = String(Math.max(0, opacity));
    }

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      doneRef.current = true;
    }
  }

  return (
    <div className={`dleaf ${className}`} aria-hidden="true">
      {branchSrc ? (
        <img className="dleaf__branch" src={branchSrc} alt="" />
      ) : (
        <PlaceholderBranch />
      )}
      <div className={`dleaf__leaf-wrap${falling ? " is-falling" : ""}`} ref={leafRef}>
        {leafSrc ? <img className="dleaf__leaf" src={leafSrc} alt="" /> : <PlaceholderLeaf />}
      </div>
    </div>
  );
}

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Simple hand-drawn placeholder shapes — clearly not final art, just enough
// to validate the motion system before real illustration is dropped in.
// Slender, tapering eucalyptus/olive-style leaves (not round blobs), sparse
// spacing, single graceful branch line entering from the top-right corner.
function EucalyptusLeaf({ x, y, rotation, scale = 1, opacity = 1 }) {
  return (
    <path
      d="M0,0 C2,-4 3,-11 1.5,-24 C1,-29 -1,-29 -1.5,-24 C-3,-11 -2,-4 0,0 Z"
      fill="#7f9a71"
      opacity={opacity}
      transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`}
    />
  );
}

function PlaceholderBranch() {
  const leaves = [
    [206, 10, 25, 1.1],
    [188, 22, -30, 0.9],
    [162, 16, 40, 1],
    [138, 30, -20, 0.85],
    [108, 26, 32, 0.95],
    [80, 40, -35, 0.8],
    [52, 38, 22, 0.75],
    [26, 50, -28, 0.65],
  ];
  return (
    <svg className="dleaf__branch" viewBox="0 0 220 140" fill="none">
      <path
        d="M216,4 C190,6 170,16 158,14 C140,12 132,24 116,26 C96,29 92,20 76,30 C58,41 54,34 40,42 C24,51 20,46 6,54"
        stroke="#5e7250"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r, s], i) => (
        <EucalyptusLeaf key={i} x={x} y={y} rotation={r} scale={s} />
      ))}
    </svg>
  );
}

function PlaceholderLeaf() {
  return (
    <svg viewBox="0 0 20 34" fill="none">
      <path
        d="M10,0 C13,6 15,16 12,32 C11,34 9,34 8,32 C5,16 7,6 10,0 Z"
        fill="#7f9a71"
      />
      <path d="M10,3 L10,30" stroke="#5e7250" strokeWidth="0.6" />
    </svg>
  );
}
