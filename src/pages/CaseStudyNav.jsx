import { useEffect, useRef, useState } from "react";
import { useSoundContext } from "../context/SoundContext";

const sections = [
  { id: "summary", label: "Summary" },
  { id: "problem", label: "Problem" },
  { id: "design-work", label: "Design work" },
  { id: "research", label: "Research" },
  { id: "decisions", label: "Decisions" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

export default function CaseStudyNav() {
  const [active, setActive] = useState("summary");
  const ratios = useRef({});
  const { playHover, playClick } = useSoundContext();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.current[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });
        const top = Object.entries(ratios.current).sort((a, b) => b[1] - a[1])[0];
        if (top && top[1] > 0) setActive(top[0]);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: "-120px 0px -50% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
