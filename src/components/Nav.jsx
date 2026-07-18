import { useLocation, Link } from "react-router-dom";
import { profile } from "../data/content";
import { useScrolled } from "../hooks/useScrolled";
import { useSoundContext } from "../context/SoundContext";
import { useTheme } from "../hooks/useTheme";
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

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__mark" aria-label="Back to home">
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
              About Me
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
      </div>
    </header>
  );
}
