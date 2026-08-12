import { Link } from "react-router-dom";
import { playground } from "../data/playground";
import { playgroundCovers as covers } from "../data/playgroundCovers";
import { useSoundContext } from "../context/SoundContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "./PlaygroundPage.css";

// A real destination for /playground, distinct from the homepage section —
// per explicit instruction, this is not just the homepage component reused
// (no "Playground" section title, no horizontal-scroll cards). Instead a
// plain vertical list, one full-width row per project: image left, then
// title/brief/CTA — closer to an index page than a teaser row. Still reads
// straight from playground.js, so a new entry only ever needs adding in
// one place and shows up here and on the homepage/card automatically.
export default function PlaygroundPage() {
  useDocumentTitle("AI Playground — Radhika Vijay");
  const { playHover, playClick } = useSoundContext();

  return (
    <main className="section pgpage">
      <div className="container pgpage-inner">
        <div className="pgpage-list">
          {playground.map((item) => (
            <Link
              to={`/playground/${item.slug}`}
              className="pgpage-row"
              key={item.slug}
              onMouseEnter={playHover}
              onClick={playClick}
            >
              <div className="pgpage-visual" style={{ "--playground-accent": item.accent }}>
                {covers[item.slug] ? (
                  <img src={covers[item.slug]} alt="" loading="lazy" />
                ) : (
                  <span className="pgpage-visual__icon" aria-hidden="true">{item.icon}</span>
                )}
              </div>
              <div className="pgpage-content">
                <span className="pgpage-tag">{item.tag}</span>
                <h2 className="pgpage-title">{item.title}</h2>
                <p className="pgpage-brief">{item.hoverLine}</p>
                <span className="pgpage-cta">
                  {item.ctaLabel || "Try it out"}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
