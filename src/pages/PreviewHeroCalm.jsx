import { Link } from "react-router-dom";
import HeroCalm from "../components/HeroCalm";
import "../App.css";

// Isolated preview of the "calm" hero direction — does not touch the live
// Home route. Compare against "/" directly.
export default function PreviewHeroCalm() {
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
      <HeroCalm />
    </main>
  );
}
