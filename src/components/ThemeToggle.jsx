import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { useSoundContext } from "../context/SoundContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { playHover, playClick } = useSoundContext();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        toggleTheme();
        playClick();
      }}
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
