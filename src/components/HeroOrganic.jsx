import { motion } from "framer-motion";
import { profile } from "../data/content";
import { useTheme } from "../context/ThemeContext";
import heroSketch from "../assets/site/hero-sketch.png";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import adaniLogo from "../assets/site/adani-wordmark.svg";
import HeroDustParticles from "./HeroDustParticles";
import LeafShadows from "./LeafShadows";

// "Paper + leaf shadow" direction — dust motes replace the dot-wave grid,
// leaf shadows sit over the paper-grain background, and the portrait does
// a soft iris reveal (clip-path circle growing from center) instead of a
// flat opacity fade. Text stays a single calm group fade, same as
// HeroCalm. Fully isolated from the live Hero — see PreviewHeroOrganic.
const group = {
  hidden: { opacity: 0, transform: "translateY(12px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroOrganic() {
  const { theme } = useTheme();
  const stageLogoSrc = theme === "dark" ? stageLogoWhite : stageLogo;

  return (
    <section id="top" className="section hero hero--organic">
      <LeafShadows className="hero__leaf-shadows" />
      <HeroDustParticles className="hero__dotwave" />

      <div className="container hero__inner">
        <motion.div className="hero__copy" variants={group} initial="hidden" animate="show">
          <span className="hero__pill">
            <span className="hero__pill-live" aria-hidden="true">
              <span className="hero__pill-live-dot" />
            </span>
            {profile.pillGreeting}
          </span>

          <h1 className="hero__title">{profile.title}</h1>

          <p className="hero__subhead">{profile.subhead}</p>

          <p className="hero__meta">
            {profile.currentCompany.note}{" "}
            <img src={stageLogoSrc} alt={profile.currentCompany.label} className="hero__meta-logo" />
            <span className="hero__meta-previous">
              {" | "}
              {profile.previousCompany.note}{" "}
              <img
                src={adaniLogo}
                alt={profile.previousCompany.label}
                className="hero__meta-logo hero__meta-logo--adani"
              />
            </span>
          </p>
        </motion.div>

        <div className="hero__art">
          <motion.img
            className="hero__portrait"
            src={heroSketch}
            alt="Illustrated portrait of Radhika"
            draggable={false}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ willChange: "clip-path" }}
          />
        </div>
      </div>
    </section>
  );
}
