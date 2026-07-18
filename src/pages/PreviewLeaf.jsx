import { profile, work, quote } from "../data/content";
import portrait from "../assets/portrait.png";
import DetachingLeaf from "../components/DetachingLeaf";
import "./PreviewLeaf.css";

export default function PreviewLeaf() {
  return (
    <div className="pl">
      {/* ---------- Hero ---------- */}
      <section className="pl-hero">
        <div className="pl-clouds" aria-hidden="true">
          <span className="pl-cloud pl-cloud--a" />
          <span className="pl-cloud pl-cloud--b" />
        </div>

        <div className="pl-hero__inner">
          <div className="pl-hero__copy">
            <span className="pl-pill">{profile.pillGreeting}</span>
            <h1 className="pl-title">{profile.title}</h1>
            <p className="pl-sub">{profile.subhead}</p>
            <p className="pl-meta">
              {profile.currentCompany.note} <strong>{profile.currentCompany.label}</strong> |{" "}
              {profile.previousCompany.note} <strong>{profile.previousCompany.label}</strong>
            </p>
          </div>

          <div className="pl-hero__art">
            <img className="pl-portrait" src={portrait} alt="" />
            <DetachingLeaf className="pl-branch-slot" threshold={130} fallDuration={7.5} fallDistance={620} />
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section className="pl-work">
        <h2 className="pl-h2">Selected work</h2>
        <div className="pl-grid">
          {work.map((item) => (
            <div className="pl-card" key={item.title}>
              <div className="pl-card__cover" style={{ backgroundImage: item.cover }} />
              <h3 className="pl-card__title">{item.title}</h3>
              <div className="pl-card__stats">
                {item.stats.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Quote ---------- */}
      <section className="pl-quote">
        <h2 className="pl-quote__sanskrit">{quote.sanskrit}</h2>
        <p className="pl-quote__translation">{quote.translation}</p>
      </section>

      {/* ---------- Footer: sparse watercolor garden, leaf lands here ---------- */}
      <footer className="pl-footer">
        <svg className="pl-garden" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          {/* Placeholder sparse botanical sketch — swap for the real watercolor
              garden asset; negative space is intentional, not lush. */}
          <path d="M120,220 C118,180 128,150 118,110" stroke="#9db28e" strokeWidth="2" fill="none" />
          <path d="M118,140 C130,130 140,132 148,120" stroke="#9db28e" strokeWidth="1.6" fill="none" />
          <path d="M118,170 C106,162 96,164 88,154" stroke="#9db28e" strokeWidth="1.6" fill="none" />

          <path d="M300,220 C296,160 306,120 296,70" stroke="#9db28e" strokeWidth="2" fill="none" />
          <ellipse cx="296" cy="70" rx="10" ry="16" fill="#c3d3b4" opacity="0.8" />

          <path d="M1180,220 C1176,170 1188,140 1178,100" stroke="#9db28e" strokeWidth="2" fill="none" />
          <path d="M1178,130 C1190,120 1198,122 1206,112" stroke="#9db28e" strokeWidth="1.6" fill="none" />

          <path d="M1340,220 C1336,175 1344,145 1336,100" stroke="#9db28e" strokeWidth="2" fill="none" />
          <ellipse cx="1336" cy="100" rx="9" ry="14" fill="#c3d3b4" opacity="0.8" />
        </svg>

        <h2 className="pl-footer__heading">Let's Connect!</h2>
        <p className="pl-footer__sub">Get in touch with me on LinkedIn or at {profile.links.email}</p>
      </footer>
    </div>
  );
}
