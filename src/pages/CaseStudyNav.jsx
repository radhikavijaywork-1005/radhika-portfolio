import { useEffect, useState } from "react";
import { useSoundContext } from "../context/SoundContext";

const defaultSections = [
  { id: "summary", label: "Summary" },
  { id: "problem", label: "Problem" },
  { id: "design-work", label: "Design work" },
  { id: "research", label: "Research" },
  { id: "strategy", label: "Strategy" },
  { id: "decisions", label: "Decisions" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

// How far from the top of the viewport a section's top edge has to cross
// before it counts as "reached" — matches the sticky nav's own `top: 120px`
// offset (see .cs-page-nav in CaseStudyPaywall.css) plus a little slack.
const ACTIVATION_LINE = 130;

export default function CaseStudyNav({ sections = defaultSections }) {
  const [active, setActive] = useState(sections[0]?.id);
  const { playHover, playClick } = useSoundContext();

  // Previously used an IntersectionObserver comparing intersection ratios,
  // which had two real failure modes: ties between simultaneously-visible
  // short sections resolved arbitrarily, and fast scrolls could leave a
  // section's stored ratio stale instead of correctly zeroed once it exited
  // view — both left the highlight stuck on a section long since scrolled
  // past. This is the standard, more robust scrollspy approach instead:
  // on every scroll, walk the sections in document order and take the last
  // one whose top edge has crossed the activation line — i.e. "the section
  // I've most recently scrolled to." No ratios, no thresholds, no ties.
  useEffect(() => {
    const updateActive = () => {
      // At the very bottom of the page, the last section's top edge may
      // never reach the activation line if there isn't enough remaining
      // page (e.g. a short footer) to scroll it that far — a known gap in
      // this style of scrollspy. Force the last section active once the
      // viewport has hit the bottom of the document, rather than leaving
      // the second-to-last one stuck highlighted.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && sections.length > 0) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVATION_LINE) {
          current = s.id;
        } else {
          break;
        }
      }
      setActive(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const onClick = (e, id) => {
    e.preventDefault();
    playClick();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="cs-page-nav" aria-label="Case study sections">
      <ul>
        {sections.map((s) => (
          <li key={s.id} className={active === s.id ? "is-active" : ""}>
            <a href={`#${s.id}`} onClick={(e) => onClick(e, s.id)} onMouseEnter={playHover}>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
