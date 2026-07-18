import { profile } from "../data/content";
import { Link001 } from "./ui/skiper-ui/skiper40";
import { useSoundContext } from "../context/SoundContext";

const social = [
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Medium", href: profile.links.medium },
  { label: "Behance", href: profile.links.behance },
  { label: "Dribbble", href: profile.links.dribbble },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { playHover, playClick } = useSoundContext();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__bottom">
          <span className="footer__copyright">
            © {year} {profile.name}. Designed with intent &amp; vibe coded with Claude
          </span>
          <div className="footer__social">
            {social.map((row, i) => (
              <span key={row.label} className="footer__social-item">
                <Link001
                  href={row.href}
                  className="footer__link"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  {row.label}
                </Link001>
                {i < social.length - 1 && <span className="footer__dash">~</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
