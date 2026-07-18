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

// paddingBottom + a canceling negative marginBottom gives the clip box
// breathing room below the baseline — without it, overflow:hidden clips
// descenders (g/y/p/j) and italic serif swashes (about-chapter__lead is
// italic display type), which read as a straight cut through the letters
// and, in bad cases, made the whole word look static/unanimated instead
// of sliding in smoothly.
function Word({ children }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        paddingBottom: "0.28em",
        marginBottom: "-0.28em",
      }}
    >
      <motion.span style={{ display: "inline-block" }} variants={word}>
        {children}
      </motion.span>
    </span>
  );
}

// Splits into word/whitespace segments (keeping whitespace as its own,
// unmasked tokens) so spacing is reproduced exactly as written — no
// inserted or doubled spaces — while each word still gets its own reveal
// mask. Works for a single plain string or a RichText-style `parts` array
// (string | {b: string} | {em: string}) so bold/em formatting survives
// the split.
function renderSegments(parts) {
  const nodes = [];
  let key = 0;
  parts.forEach((part) => {
    const isPlain = typeof part === "string";
    const raw = isPlain ? part : part.b ?? part.em ?? "";
    const segments = raw.split(/(\s+)/).filter((s) => s !== "");
    segments.forEach((seg) => {
      if (/^\s+$/.test(seg)) {
        nodes.push(<span key={key++}>{seg}</span>);
      } else {
        const content = isPlain ? seg : part.b !== undefined ? <strong>{seg}</strong> : <em>{seg}</em>;
        nodes.push(<Word key={key++}>{content}</Word>);
      }
    });
  });
  return nodes;
}

export default function SplitText({
  text,
  parts,
  as = "span",
  className,
  delay = 0,
  once = true,
  amount = 0.4,
}) {
  const Tag = motion[as];
  const source = parts ?? [text];
  const ariaLabel = source.map((p) => (typeof p === "string" ? p : p.b ?? p.em ?? "")).join("");

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ delayChildren: delay }}
      aria-label={ariaLabel}
    >
      {renderSegments(source)}
    </Tag>
  );
}
