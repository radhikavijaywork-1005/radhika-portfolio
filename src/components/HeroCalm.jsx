import { motion } from "framer-motion";
import { profile } from "../data/content";
import { useTheme } from "../context/ThemeContext";
import heroSketch from "../assets/site/hero-sketch.png";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import adaniLogo from "../assets/site/adani-wordmark.svg";
import HeroDotWave from "./HeroDotWave";

// Preview variant of Hero.jsx — "motion on interaction" direction. The
// resting state is deliberately quiet (one group fade, muted ambient
// dot-wave, static portrait); the dot-wave's mouse-reactive bump is left
// at full strength, so motion sense shows up when someone engages rather
// than firing all at once on load. Does not touch the live Hero.jsx.
const group = {
  hidden: { opacity: 0, transform: "translateY(12px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroCalm() {
  const { theme } = useTheme();
  const stageLogoSrc = theme === "dark" ? stageLogoWhite : stageLogo;

  return (
    <section id="top" className="section hero">
      <HeroDotWave className="hero__dotwave" dotOpacity={0.22} ambientAmplitude={0.35} />

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

        <motion.div
          className="hero__art"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="hero__portrait"
            src={heroSketch}
            alt="Illustrated portrait of Radhika"
            draggable={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
