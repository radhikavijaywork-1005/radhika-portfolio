import { Link } from "react-router-dom";
import DotPortrait from "../components/DotPortrait";
import heroLinePortrait from "../assets/site/hero-line-portrait.png";

// Isolated preview of the "dots assemble into her portrait" effect,
// sampled from the new single-line illustration. Does not touch the live
// Home/Hero route.
export default function PreviewDotPortrait() {
  return (
    <main style={{ padding: "48px 24px 96px", maxWidth: 900, marginInline: "auto" }}>
      <style>{`
        @keyframes dotPortraitBlobFlow {
          0%, 100% { border-radius: 48% 52% 55% 45% / 52% 45% 55% 48%; transform: rotate(0deg) scale(1); }
          33% { border-radius: 55% 45% 48% 52% / 45% 58% 46% 54%; transform: rotate(6deg) scale(1.04); }
          66% { border-radius: 45% 55% 52% 48% / 55% 46% 58% 44%; transform: rotate(-5deg) scale(0.97); }
        }
        .dot-portrait-blob {
          animation: dotPortraitBlobFlow 16s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dot-portrait-blob { animation: none; }
        }
      `}</style>
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

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 400, marginBottom: 4 }}>
        Dots forming the portrait
      </h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 11, fontWeight: 300, marginBottom: 48, maxWidth: 60 + "ch" }}>
        Scroll the portrait into view to trigger the assembly. Move your cursor over it once
        settled for a gentle ripple.
      </p>

      <div
        style={{
          position: "relative",
          width: "min(100%, 420px)",
          aspectRatio: "1149 / 1369",
          marginInline: "auto",
        }}
      >
        <div
          aria-hidden="true"
          className="dot-portrait-blob"
          style={{
            position: "absolute",
            inset: "-14%",
            zIndex: 0,
            background:
              "radial-gradient(circle at 42% 38%, rgba(var(--sage-deep-rgb), 0.4), rgba(var(--sage-rgb), 0.22) 55%, transparent 75%)",
            filter: "blur(18px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          <DotPortrait
            src={heroLinePortrait}
            alt="Dot-matrix portrait of Radhika, side profile looking upward"
          />
        </div>
      </div>
    </main>
  );
}
