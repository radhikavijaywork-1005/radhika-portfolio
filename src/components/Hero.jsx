import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "../data/content";
import { useTheme } from "../context/ThemeContext";
import heroLineColorLight from "../assets/site/hero-line-color.png";
import heroLineColorDark from "../assets/site/hero-line-color-dark.png";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import adaniLogo from "../assets/site/adani-wordmark.svg";
import HeroDotWave from "./HeroDotWave";
import SplitText from "./SplitText";
import PortraitLiquid from "./PortraitLiquid";
import { useTiltEffect } from "../hooks/useTiltEffect";

// Same mouse-tracked tilt + liquid ripple as the About portrait — a plain
// sibling of the entrance-fade motion.div (not the animated element
// itself), so its own CSS transform isn't fought by Framer's inline style.
//
// One PortraitLiquid instance, not two crossfading layers. It used to be
// light/dark stacked as separate WebGL contexts, permanently rendering,
// crossfaded via CSS opacity for a smooth theme-toggle dissolve. But that
// meant landing on the homepage created THREE WebGL contexts at once
// (this component's two, plus HeroDotWave's) in a single tick — expensive
// enough to jank the main thread and show as a whole-screen white flash
// during navigation. Trading the smooth dissolve for a harder cut on
// theme toggle (now just an image-source swap) in exchange for the page
// itself not flashing white on arrival.
function HeroPortraitTilt({ lightSrc, darkSrc, alt }) {
  const tilt = useTiltEffect(20);
  const { theme } = useTheme();
  const src = theme === "dark" ? darkSrc : lightSrc;
  return (
    <motion.div
      className="hero-portrait-tilt-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="hero-portrait-tilt"
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
      >
        <PortraitLiquid src={src} alt={alt} className="hero-portrait-tilt__canvas" />
      </div>
    </motion.div>
  );
}

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

export default function Hero() {
  const heroRef = useRef(null);
  const { theme } = useTheme();
  const stageLogoSrc = theme === "dark" ? stageLogoWhite : stageLogo;

  // Scroll-linked parallax: the whole illustration drifts down slower than
  // the page scrolls, so it reads as sitting further back than the copy.
  // No mouse-tracked drift on the portrait itself — it stays put, grounded,
  // rather than chasing the cursor.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section id="top" ref={heroRef} className="section hero">
      <HeroDotWave className="hero__dotwave" dotOpacity={0.32} ambientAmplitude={0.5} />

      <div className="container hero__inner">
        <motion.div
          className="hero__copy"
          variants={container}
          initial="hidden"
          animate="show"
        >
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
          <HeroPortraitTilt
            lightSrc={heroLineColorLight}
            darkSrc={heroLineColorDark}
            alt="Illustrated portrait of Radhika"
          />
        </motion.div>
      </div>
    </section>
  );
}
