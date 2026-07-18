import { motion, AnimatePresence } from "framer-motion";
import { useSoundContext } from "../context/SoundContext";

export default function SoundToggle() {
  const { enabled, toggleSound, playHover, playClick } = useSoundContext();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        // Flip first so the click itself is audible when turning sound on.
        toggleSound();
        if (!enabled) setTimeout(playClick, 0);
      }}
      onMouseEnter={playHover}
      aria-label={enabled ? "Mute sound" : "Unmute sound"}
      aria-pressed={enabled}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={enabled ? "on" : "off"}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M2 6.2v3.6h2.4L8 12.6V3.4L4.4 6.2H2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {enabled ? (
            <path
              d="M10.6 5.8a3.2 3.2 0 0 1 0 4.4M12.3 4.1a5.7 5.7 0 0 1 0 7.8"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M10.6 6.2l3.2 3.6M13.8 6.2l-3.2 3.6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
