import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/content";
import { useScrolled } from "../hooks/useScrolled";
import { useSoundContext } from "../context/SoundContext";
import { useTheme } from "../context/ThemeContext";
import monogram from "../assets/site/monogram.png";
import monogramDark from "../assets/site/monogram-dark.svg";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";

export default function Nav() {
  // Tracked but left unstyled by --scrolled for now (matches the real site,
  // which has no scroll treatment). A later scroll-based nav animation can
  // key off this class without touching the component again.
  const scrolled = useScrolled(40);
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const { playHover, playClick } = useSoundContext();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Drawer sits over the page (fixed), so the page itself needs its scroll
  // locked while open — otherwise content behind the drawer keeps scrolling.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}${menuOpen ? " nav--menu-open" : ""}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__mark" aria-label="Back to home" onClick={closeMenu}>
          <img
            src={theme === "dark" ? monogramDark : monogram}
            alt="Radhika Vijay"
            className="nav__mark-img"
          />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <span className="nav__item nav__item--underline">
            <a href={onHome ? "#work" : "/#work"} onMouseEnter={playHover} onClick={playClick}>
              Work
            </a>
          </span>
          <span className="nav__dash">~</span>
          <span className="nav__item nav__item--underline">
            <Link to="/about" onMouseEnter={playHover} onClick={playClick}>
              About
            </Link>
          </span>
          <span className="nav__dash">~</span>
          <span className="nav__item nav__item--underline">
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              Resume
              <svg className="nav__resume-arrow" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 9L9 3M9 3H4M9 3V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </span>
          <span className="nav__dash">~</span>
          <ThemeToggle />
          <SoundToggle />
        </nav>

        <div className="nav__mobile-controls">
          <ThemeToggle />
          <SoundToggle />
          <button
            type="button"
            className="nav__menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="nav__menu-toggle-bar" />
            <span className="nav__menu-toggle-bar" />
          </button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="nav__drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={closeMenu}
              />
              <motion.nav
                className="nav__mobile-panel"
                aria-label="Primary (mobile)"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  className={`nav__mobile-link${onHome ? " is-active" : ""}`}
                  href={onHome ? "#work" : "/#work"}
                  onClick={() => { playClick(); closeMenu(); }}
                >
                  Work
                </a>
                <Link
                  to="/about"
                  className={`nav__mobile-link${!onHome ? " is-active" : ""}`}
                  onClick={() => { playClick(); closeMenu(); }}
                >
                  About
                </Link>
                <a
                  className="nav__mobile-link"
                  href={profile.links.resume}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => { playClick(); closeMenu(); }}
                >
                  Resume ↗
                </a>
              </motion.nav>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
