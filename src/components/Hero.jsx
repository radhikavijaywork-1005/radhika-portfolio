import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { profile } from "../data/content";
import { useTheme } from "../context/ThemeContext";
import { useSoundContext } from "../context/SoundContext";
import { useSmoothNavigate } from "../hooks/useSmoothNavigate";
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
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playClick } = useSoundContext();
  const smoothNavigate = useSmoothNavigate();

  const onLeave = () => {
    tilt.onMouseLeave();
    setIsHovered(false);
  };

  return (
    <motion.div
      className="hero-portrait-tilt-wrap"
      ref={tilt.ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      // Hover/move tracking lives on the wrap, not the inner tilt element —
      // the CTA pill below is a sibling positioned at the wrap's bottom
      // edge, so tracking only on .hero-portrait-tilt's bounds was exiting
      // early and hiding the pill before it could be clicked. Tracking here
      // also lets the depth-glow layer (a sibling of the portrait, not a
      // descendant) read the same --tilt-x/--glow-x custom properties,
      // since they're set on this shared ancestor.
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={onLeave}
    >
      {/* Sits behind the portrait at a different parallax rate — the actual
          depth cue. A single flat plane tilting still reads as "a picture
          tilting"; a background layer drifting less than the foreground
          under the same cursor movement is what makes it read as layers in
          space instead. */}
      <div className="hero-portrait-depth-glow" aria-hidden="true" />

      <div className="hero-portrait-tilt">
        <PortraitLiquid src={src} alt={alt} className="hero-portrait-tilt__canvas" />
      </div>

      {/* Sibling of the tilting element, not a child of it — stays flat and
          readable instead of rotating in the same 3D space as the portrait.
          The centering (left:50%/translateX(-50%)) lives on this static
          wrapper, not the motion.button itself — Framer Motion writes its
          own animated properties (y, scale) as a single inline `transform`
          that fully replaces any CSS transform on the same element, so a
          plain CSS translateX for centering and Framer's own transform
          can't coexist on one node without one silently winning. */}
      <AnimatePresence>
        {isHovered && (
          <div className="hero-portrait-cta-anchor">
            <motion.button
              type="button"
              className="hero-portrait-cta"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                smoothNavigate("/about");
              }}
            >
              Know Me Better
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 9L9 3M9 3H4M9 3V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
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

          {/* Explicit delay, not the parent stagger's index-based one — the
              subhead above is a SplitText with its own independent
              per-word stagger (9 words, finishing well after 1s), which
              the container's staggerChildren knows nothing about. Left on
              the shared stagger, this line (2nd item child) was
              finishing around 0.6s — well before the subhead did — so
              the company/logo line visibly appeared before the sentence
              above it. */}
          <motion.p variants={item} transition={{ delay: 0.85 }} className="hero__meta">
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
