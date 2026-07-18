import { Link } from "react-router-dom";
import HeroPortraitMotion from "../components/HeroPortraitMotion";

// Isolated preview: dotted motion scoped to the portrait instead of the
// full-page dot-wave background. Does not touch the live Home route.
export default function PreviewHeroPortraitMotion() {
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
      <HeroPortraitMotion />
    </main>
  );
}
