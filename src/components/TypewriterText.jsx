import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Characters appear one at a time, like the line is being typed live — no
// blinking cursor glyph, just the reveal itself. Triggered once the
// element scrolls into view, not on mount.
export default function TypewriterText({
  text,
  as: Tag = "span",
  className,
  speed = 28,
  startDelay = 0,
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let tickTimeout;
    const startTimeout = setTimeout(() => {
      let i = 0;
      const tick = () => {
        i += 1;
        setCount(i);
        if (i < text.length) {
          tickTimeout = setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(tickTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
    </Tag>
  );
}
