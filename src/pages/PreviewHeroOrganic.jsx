import { Link } from "react-router-dom";
import HeroOrganic from "../components/HeroOrganic";
import "../App.css";

// Isolated preview of the "paper + leaf shadow + dust" aesthetic direction —
// does not touch the live Home route. Compare against "/" and
// "/preview/hero-calm" directly.
export default function PreviewHeroOrganic() {
  return (
    <main>
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 50,
          padding: "8px 16px",
          borderRadius: 8,
          background: "var(--card)",
          border: "1px solid var(--line)",
          color: "var(--ink)",
          fontSize: 13,
          textDecoration: "none",
        }}
      >
        ← Back to live site
      </Link>
      <HeroOrganic />
    </main>
  );
}
