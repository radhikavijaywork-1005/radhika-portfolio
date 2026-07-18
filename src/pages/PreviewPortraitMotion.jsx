import { Link } from "react-router-dom";
import PortraitTilt from "../components/PortraitTilt";
import PortraitLiquid from "../components/PortraitLiquid";
import aboutPortrait from "../assets/site/about-portrait.png";
import "../App.css";
import "../pages/AboutMe.css";

// Isolated preview of two portrait hover-motion directions — does not
// touch the live About page. Compare against "/about" directly.
export default function PreviewPortraitMotion() {
  return (
    <main style={{ padding: "48px 24px 96px", maxWidth: 1100, marginInline: "auto" }}>
      <Link
        to="/about"
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

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 8 }}>
        Portrait motion — two directions
      </h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 48, maxWidth: 60 + "ch" }}>
        Move your cursor over each portrait to compare. Neither touches the live About page.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 48,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, marginBottom: 4 }}>1. Holographic tilt</h2>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 16 }}>
            CSS-only 3D perspective tilt + a soft light sweep following the cursor.
          </p>
          <PortraitTilt src={aboutPortrait} alt="Radhika in the mountains" className="preview-portrait" />
        </div>

        <div>
          <h2 style={{ fontSize: 16, marginBottom: 4 }}>2. Liquid ripple</h2>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 16 }}>
            WebGL shader — the image ripples/bulges away from the cursor within a soft radius.
          </p>
          <PortraitLiquid
            src={aboutPortrait}
            alt="Radhika in the mountains"
            className="preview-portrait"
          />
        </div>
      </div>
    </main>
  );
}
