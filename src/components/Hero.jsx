import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState, lazy, Suspense } from "react";
import { profile } from "../data/content";
import { useTheme } from "../context/ThemeContext";
import { useSoundContext } from "../context/SoundContext";
import { useSmoothNavigate } from "../hooks/useSmoothNavigate";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import adaniLogo from "../assets/site/adani-wordmark.svg";
import HeroDotWave from "./HeroDotWave";
import SplitText from "./SplitText";

// Lazy, not a static import — @react-three/fiber + drei + three pull in
// ~1.3MB (378KB gzip) uncompressed, and Hero renders on every homepage
// load, unlike the case-study/preview routes that already lazy-load their
// own three.js usage. Bundling that into the main chunk would make every
// visitor pay for it before first paint, for a hero decoration below the
// actual content. Splitting it into its own chunk, fetched only once the
// rest of the hero has already painted, avoids that.
const HeroOrb3D = lazy(() => import("./HeroOrb3D"));

// The illustration slot now holds a genuinely rotatable 3D object
// (HeroOrb3D — real geometry, auto-rotating continuously so every side is
// visible over time) instead of the flat line-art portrait. A flat
// drawing only has one viewing angle's worth of information baked in, so
// no shader/displacement trick on it can produce real other sides — that
// was tried (vertex-displacing the illustration's alpha channel) and it
// tore the linework into jagged fringes instead of reading as depth.
function HeroPortraitTilt() {
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playClick } = useSoundContext();
  const smoothNavigate = useSmoothNavigate();

  return (
    <motion.div
      className="hero-portrait-tilt-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-portrait-tilt">
        <Suspense fallback={null}>
          <HeroOrb3D className="hero-portrait-tilt__canvas" />
        </Suspense>
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
          <HeroPortraitTilt />
        </motion.div>
      </div>
    </section>
  );
}
