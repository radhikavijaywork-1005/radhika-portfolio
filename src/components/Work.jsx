import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { work } from "../data/content";
import { useSoundContext } from "../context/SoundContext";
import { useTiltEffect } from "../hooks/useTiltEffect";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

// Was 0.55s duration + 0.07s/card stagger, triggered at 25% visible — on
// a grid with several cards that's a wide enough window (worst case
// ~0.9s+ for the last card) that scrolling into the section shows some
// cards settled and others still mid-slide, reading as "half loaded"
// rather than a deliberate reveal. Faster + starts sooner (10% visible)
// so the grid resolves before it's actually being looked at.
const card = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Splits "+250% increase" into { value: "+250%", label: "increase" } so the
// number can get its own stat-callout treatment instead of sitting inside a
// tag pill — metrics are the actual evidence of impact, not metadata, so
// they get sized/weighted like a real statistic (large serif number, small
// caps label) rather than reading as just another pill on the card.
function splitMetric(str) {
  const match = str.match(/^([+~]?\d[\d.]*[%A-Za-z/]*)\s+(.*)$/);
  return match ? { value: match[1], label: match[2] } : { value: str, label: "" };
}

function WorkCard({ item, i }) {
  const { playHover, playClick } = useSoundContext();
  const tilt = useTiltEffect();
  const { ref: revealRef, revealed } = useRevealOnScroll(0.1);
  const disabled = !item.href;
  const isInternal = !disabled && item.href.startsWith("/");
  const Wrapper = disabled ? "div" : isInternal ? Link : "a";
  const wrapperProps = {
    ...(disabled
      ? {}
      : {
          ...(isInternal
            ? { to: item.href }
            : { href: item.href, target: "_blank", rel: "noreferrer" }),
          onMouseEnter: playHover,
          onClick: playClick,
        }),
  };

  return (
    <motion.div
      ref={revealRef}
      className="work-card"
      variants={card}
      initial="hidden"
      animate={revealed ? "show" : "hidden"}
      transition={{ delay: i * 0.04 }}
    >
      <Wrapper
        className="work-card__link tilt-card"
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        {...wrapperProps}
      >
        {/* Cursor-label trigger is scoped to just the gradient tile + title,
            not the full card padding or the stats row, so it doesn't read
            as "active" outside the actual visual/text content. */}
        <div className="work-card__hover-zone" data-cursor-label={item.cta}>
          <div className="work-card__visual">
            <img className="work-card__bg" src={item.bg} alt={item.company} />
            <img
              className="work-card__phones"
              src={item.phones}
              alt={item.company}
              style={{ width: `${item.phonesWidthPct}%` }}
            />
          </div>

          <div className="work-card__heading">
            <span className="work-card__category">{item.category}</span>
            <h3 className="work-card__title">{item.title}</h3>
          </div>
        </div>

        <div className="work-card__stats work-card__stats--callout">
          {item.metrics.map((metric, idx) => {
            const { value, label } = splitMetric(metric);
            return (
              <div className="work-card__stat" key={metric}>
                {idx > 0 && <span className="work-card__stat-divider" aria-hidden="true" />}
                <span className="work-card__stat-value">{value}</span>
                <span className="work-card__stat-label">{label}</span>
              </div>
            );
          })}
        </div>
      </Wrapper>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section id="work" className="section work-section">
      <div className="container">
        <div className="work-heading">
          <h2 className="section-heading">Selected work</h2>
          <span className="work-heading__rule" />
        </div>

        <div className="work-grid">
          {work.map((item, i) => (
            <WorkCard key={item.title} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
