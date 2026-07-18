import { useTiltEffect } from "../hooks/useTiltEffect";

export default function PortraitTilt({ src, alt, className }) {
  const tilt = useTiltEffect();

  return (
    <div
      className={`portrait-tilt ${className || ""}`}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div className="portrait-tilt__inner">
        <img src={src} alt={alt} draggable={false} />
        <span className="portrait-tilt__shine" aria-hidden="true" />
      </div>
    </div>
  );
}
