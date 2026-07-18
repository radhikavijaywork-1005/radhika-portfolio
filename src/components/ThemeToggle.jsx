import { motion, AnimatePresence } from "framer-motion";
import { flushSync } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import { useSoundContext } from "../context/SoundContext";

// Adapted from Skiper UI's skiper26 theme-toggle pattern (view-transition
// circle reveal), simplified to a single click-origin variant and wired to
// this project's own useTheme hook instead of next-themes.
const STYLE_ID = "theme-view-transition-styles";

function injectCircleRevealStyles(x, y) {
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  let styleEl = document.getElementById(STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    /* Without this override, the browser's own default 0.25s group
       crossfade/resize animation runs underneath our custom reveal at the
       same time, fighting it — the wipe looked "not smooth" because two
       different-duration, different-eased animations were layered. */
    ::view-transition-group(root) {
      animation-duration: 0.7s;
      animation-timing-function: var(--ease-flow, cubic-bezier(0.22, 1, 0.36, 1));
    }
    ::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }
    ::view-transition-new(root) {
      animation: theme-toggle-reveal 0.7s var(--ease-flow, cubic-bezier(0.22, 1, 0.36, 1));
    }
    @keyframes theme-toggle-reveal {
      from { clip-path: circle(0px at ${x}px ${y}px); }
      to { clip-path: circle(${endRadius}px at ${x}px ${y}px); }
    }
  `;
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { playHover, playClick } = useSoundContext();
  const isDark = theme === "dark";

  const handleClick = (e) => {
    playClick();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      toggleTheme();
      return;
    }

    injectCircleRevealStyles(e.clientX, e.clientY);
    document.startViewTransition(() => flushSync(() => toggleTheme()));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      onMouseEnter={playHover}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={isDark ? "moon" : "sun"}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {isDark ? (
            <path
              d="M13.5 9.7A5.6 5.6 0 0 1 6.3 2.5 5.8 5.8 0 1 0 13.5 9.7Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 1.4V3M8 13v1.6M14.6 8H13M3 8H1.4M12.5 3.5l-1.1 1.1M4.6 11.4l-1.1 1.1M12.5 12.5l-1.1-1.1M4.6 4.6 3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
