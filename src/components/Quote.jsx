import { motion } from "framer-motion";
import { quote } from "../data/content";
import quoteDoodle from "../assets/site/quote-doodle-new.svg";

export default function Quote() {
  return (
    <section className="section quote-section">
      <motion.div
        className="container quote-inner"
        initial={{ opacity: 0, transform: "translateY(16px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="quote-copy">
          <h2 className="quote-sanskrit">{quote.sanskrit}</h2>
          <span className="quote-rule" aria-hidden="true" />
          <p className="quote-translation">{quote.translation}</p>
        </div>
        <img className="quote-doodle-gif" src={quoteDoodle} alt="" aria-hidden="true" loading="lazy" />
      </motion.div>
    </section>
  );
}
