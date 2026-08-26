import { motion } from "framer-motion";
import { quote } from "../data/content";
import quoteDoodle from "../assets/site/quote-doodle-light.png";
import quoteDoodleDark from "../assets/site/quote-doodle-dark.png";
import TypewriterText from "./TypewriterText";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useTheme } from "../context/ThemeContext";

export default function Quote() {
  const { ref, revealed } = useRevealOnScroll(0.4);
  const { theme } = useTheme();

  return (
    <section className="section quote-section">
      <motion.div
        ref={ref}
        className="container quote-inner"
        initial={{ opacity: 0, transform: "translateY(16px)" }}
        animate={revealed ? { opacity: 1, transform: "translateY(0px)" } : { opacity: 0, transform: "translateY(16px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="quote-copy">
          <TypewriterText as="h2" className="quote-sanskrit" text={quote.sanskrit} speed={34} />
          <span className="quote-rule" aria-hidden="true" />
          <TypewriterText
            as="p"
            className="quote-translation"
            text={quote.translation}
            speed={20}
            startDelay={quote.sanskrit.length * 34 + 400}
          />
        </div>
        <img
          className="quote-doodle-gif"
          src={theme === "dark" ? quoteDoodleDark : quoteDoodle}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </motion.div>
    </section>
  );
}
