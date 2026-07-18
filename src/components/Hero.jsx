import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "../data/content";
import { useTheme } from "../hooks/useTheme";
import heroSketch from "../assets/site/hero-sketch.png";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import adaniLogo from "../assets/site/adani-wordmark.svg";
import HeroDotWave from "./HeroDotWave";

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
      <HeroDotWave className="hero__dotwave" />

      <div className="container hero__inner">
        <motion.div
          className="hero__copy"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={item} className="hero__pill">
            {profile.pillGreeting}
          </motion.span>

          <motion.h1 variants={item} className="hero__title">
            {profile.title}
          </motion.h1>

          <motion.p variants={item} className="hero__subhead">
            {profile.subhead}
          </motion.p>

          <motion.p variants={item} className="hero__meta">
            {profile.currentCompany.note}{" "}
            <img src={stageLogoSrc} alt={profile.currentCompany.label} className="hero__meta-logo" />
            {" | "}
            {profile.previousCompany.note}{" "}
            <img
              src={adaniLogo}
              alt={profile.previousCompany.label}
              className="hero__meta-logo hero__meta-logo--adani"
            />
          </motion.p>
        </motion.div>

        <motion.div className="hero__art" style={{ y: artY }}>
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
