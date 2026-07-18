import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { work } from "../data/content";
import { useSoundContext } from "../context/SoundContext";

const card = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function WorkCard({ item, i }) {
  const { playHover, playClick } = useSoundContext();
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
      className="work-card"
      variants={card}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: i * 0.07 }}
    >
      <Wrapper className="work-card__link" {...wrapperProps}>
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

          <h3 className="work-card__title">{item.title}</h3>
        </div>

        <div className="tag-list work-card__stats">
          {item.stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
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
