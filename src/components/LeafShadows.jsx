// Dappled-light leaf shadows — soft blurred leaf silhouettes, dark +
// multiply-blended so they read as shadows falling across the paper
// texture rather than printed graphics. Slow sway (CSS) mimics a light
// breeze; no scroll/mouse coupling, this is pure ambient atmosphere.
// Pointed almond silhouette (stem-point top, tip-point bottom) plus a
// faint center vein — reads as "leaf" even softened, unlike a round blob.
const LEAF_PATH = "M45 2C88 34 88 84 45 112C2 84 2 34 45 2Z";
const VEIN_PATH = "M45 14 L45 100";

function Leaf({ style, animationClass }) {
  return (
    <svg
      viewBox="0 0 90 112"
      className={`leaf-shadow ${animationClass}`}
      style={style}
      aria-hidden="true"
    >
      <path d={LEAF_PATH} />
      <path d={VEIN_PATH} className="leaf-shadow__vein" />
    </svg>
  );
}

export default function LeafShadows({ className }) {
  return (
    <div className={className} aria-hidden="true">
      <Leaf style={{ top: "-6%", left: "4%", width: "220px" }} animationClass="leaf-shadow--a" />
      <Leaf style={{ top: "18%", left: "78%", width: "160px" }} animationClass="leaf-shadow--b" />
      <Leaf style={{ top: "62%", left: "12%", width: "130px" }} animationClass="leaf-shadow--c" />
      <Leaf style={{ top: "70%", left: "88%", width: "190px" }} animationClass="leaf-shadow--a" />
    </div>
  );
}
