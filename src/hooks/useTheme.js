import { useLayoutEffect, useState } from "react";

const STORAGE_KEY = "rv-theme";

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

// Class-based theme (`.dark` on <html>), persisted to localStorage. Defaults
// to light regardless of system preference — the brand is built light-first,
// dark is an opt-in mode rather than a system-matched default.
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Layout effect (not a passive effect) so the class change lands
  // synchronously within the same commit — startViewTransition needs the
  // DOM already updated before it snapshots the "new" state, otherwise the
  // circle-reveal animation captures the wrong frame.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
