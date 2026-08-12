import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { playground } from "../data/playground";
import { useSoundContext } from "../context/SoundContext";
import { useTiltEffect } from "../hooks/useTiltEffect";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { playgroundCovers as covers } from "../data/playgroundCovers";

// Same drag-to-scroll pattern as the case studies' .cs-variant-row--scroll
// (see CaseStudyPaywall.jsx) — duplicated locally rather than shared,
// matching how that pattern is already implemented per-page there.
// Extended with a moved-distance check: unlike the case study's plain
// image cards, these are clickable Links, so a drag that ends on top of
// a card would otherwise also fire its click and navigate away.
function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, startScroll: ref.current.scrollLeft, moved: 0 };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const delta = e.pageX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(delta));
    ref.current.scrollLeft = drag.current.startScroll - delta;
  };
  const stopDrag = () => {
    drag.current.active = false;
  };
  const wasDrag = () => drag.current.moved > 6;

  return {
    ref,
    onMouseDown,
    onMouseMove,
    onMouseUp: stopDrag,
    onMouseLeave: stopDrag,
    wasDrag,
  };
}

const card = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

function PlaygroundTile({ item, i, wasDrag }) {
  const { playHover, playClick } = useSoundContext();
  const tilt = useTiltEffect();
  const { ref: revealRef, revealed } = useRevealOnScroll(0.1);

  return (
    <motion.div
      ref={revealRef}
      className="playground-tile-slot"
      variants={card}
      initial="hidden"
      animate={revealed ? "show" : "hidden"}
      transition={{ delay: i * 0.06 }}
    >
      <Link
        to={`/playground/${item.slug}`}
        className="playground-tile tilt-card"
        onClickCapture={(e) => {
          if (wasDrag()) e.preventDefault();
        }}
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        onMouseEnter={playHover}
        onClick={playClick}
      >
        <div className="playground-tile__visual" style={{ "--playground-accent": item.accent }}>
          {covers[item.slug] ? (
            <img className="playground-tile__cover" src={covers[item.slug]} alt="" loading="lazy" />
          ) : (
            <span className="playground-tile__icon" aria-hidden="true">{item.icon}</span>
          )}
        </div>
        {/* Bottom-anchored overlay panel — pill + title stay put, the
            description and "Try it out" line are collapsed by default and
            expand the panel upward over the image on hover, not downward
            into the page. See .playground-tile__panel in App.css. */}
        <div className="playground-tile__panel">
          <span className="playground-tile__pill">{item.tag}</span>
          <h3 className="playground-tile__title">{item.title}</h3>
          {/* One collapsible wrapper around both lines, not two
              independently-collapsed elements — collapsing a block <p>
              and an inline-flex <span> separately left a ~17px phantom
              gap between them at rest (an inline-formatting-context
              quirk), which is why this card's rest-state panel was
              taller than Research Companion's single-line one. */}
          <div className="playground-tile__reveal">
            <p className="playground-tile__desc">{item.hoverLine}</p>
            <span className="playground-tile__cta">
              {item.ctaLabel || "Try it out"}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Playground() {
  // Horizontally scrollable, not a fixed grid — the row scales to however
  // many experiments actually exist instead of needing a layout change
  // every time a new one ships.
  const drag = useDragScroll();

  return (
    <section id="playground" className="section playground-section">
      <div className="container">
        <div className="playground-heading">
          <h2 className="section-heading">Playground</h2>
          <span className="playground-heading__rule" />
        </div>

        <div className="playground-frame">
          <div
            className="playground-grid"
            ref={drag.ref}
            onMouseDown={drag.onMouseDown}
            onMouseMove={drag.onMouseMove}
            onMouseUp={drag.onMouseUp}
            onMouseLeave={drag.onMouseLeave}
          >
            {playground.map((item, i) => (
              <PlaygroundTile item={item} key={item.slug} i={i} wasDrag={drag.wasDrag} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
