import { motion } from "framer-motion";

// Word-by-word reveal on scroll-in — each word sits inside its own
// overflow:hidden mask so it wipes up into view rather than just fading,
// with a tight per-word stagger. aria-label carries the real text for
// screen readers; the word spans themselves are aria-hidden since they're
// fragments, not real content nodes.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.028 },
  },
};

const word = {
  hidden: { opacity: 0, transform: "translateY(100%)" },
  show: {
    opacity: 1,
    transform: "translateY(0%)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SplitText({
  text,
  as = "span",
  className,
  delay = 0,
  once = true,
  amount = 0.4,
}) {
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span style={{ display: "inline-block" }} variants={word}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
