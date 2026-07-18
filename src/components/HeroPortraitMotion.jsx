import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "../data/content";
import { useTheme } from "../context/ThemeContext";
import heroSketch from "../assets/site/hero-sketch.png";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import adaniLogo from "../assets/site/adani-wordmark.svg";
import HeroPortraitDots from "./HeroPortraitDots";
import SplitText from "./SplitText";

// Variant of Hero.jsx testing: drop the full-page dot-wave background,
// scope the dotted motion to the portrait itself instead — dots read as
// part of her presence rather than generic background wallpaper the
// illustration happens to sit on. Everything else (text reveal, pill,
// meta, scroll parallax) matches the live Hero exactly for a fair
// comparison. See PreviewHeroPortraitMotion for the isolated route.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, transform: "translateY(10px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroPortraitMotion() {
  const heroRef = useRef(null);
  const { theme } = useTheme();
  const stageLogoSrc = theme === "dark" ? stageLogoWhite : stageLogo;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section id="top" ref={heroRef} className="section hero">
      <div className="container hero__inner">
        <motion.div className="hero__copy" variants={container} initial="hidden" animate="show">
          <motion.span variants={item} className="hero__pill">
            <span className="hero__pill-live" aria-hidden="true">
              <span className="hero__pill-live-dot" />
            </span>
            {profile.pillGreeting}
          </motion.span>

          <SplitText as="h1" className="hero__title" text={profile.title} delay={0.15} />

          <SplitText as="p" className="hero__subhead" text={profile.subhead} delay={0.35} />

          <motion.p variants={item} className="hero__meta">
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
          </motion.p>
        </motion.div>

        <motion.div className="hero__art" style={{ y: artY }}>
          <HeroPortraitDots className="hero__art-dots" />
          <motion.img
            className="hero__portrait"
            src={heroSketch}
            alt="Illustrated portrait of Radhika"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </section>
  );
}
