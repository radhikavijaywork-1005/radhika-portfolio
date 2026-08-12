import { Fragment, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { sahayCaseStudy as entry } from "../data/sahayCaseStudy";
import { useSoundContext } from "../context/SoundContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import CaseStudyNav from "./CaseStudyNav";
import { playgroundCovers } from "../data/playgroundCovers";
import "./CaseStudyPaywall.css";
import "./PlaygroundEntry.css";
import "./PlaygroundSahay.css";

// Same real exported mark used elsewhere — see entry.branding in
// sahayCaseStudy.js.
import sahayIconLight from "../assets/playground/sahay-brand/icon-light.png";
import sahayIconDark from "../assets/playground/sahay-brand/icon-dark.png";
import sahayWordmark from "../assets/playground/sahay-brand/wordmark.png";

// The real screen recording of the full save → understand → remember →
// search/ask flow, not a staged demo — see the "See it in action" section.
import sahayFlowVideo from "../assets/playground/sahay-flow/flow-demo.mp4";

const brandAssetImages = {
  iconLight: sahayIconLight,
  iconDark: sahayIconDark,
  wordmark: sahayWordmark,
};

const fadeUp = {
  hidden: { opacity: 0, transform: "translateY(16px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Mount-triggered, matching PlaygroundEntry.jsx's own Reveal — this page
// is one short screen, not a long scroll, so whileInView's
// IntersectionObserver has the same stuck-at-opacity-0 failure mode there.
function Reveal({ as = "div", className, children, id, delay = 0 }) {
  const Tag = motion[as];
  return (
    <Tag id={id} className={className} variants={fadeUp} initial="hidden" animate="show" transition={{ delay }}>
      {children}
    </Tag>
  );
}

// A small reusable flow-diagram renderer — used three times on this page
// (What I built's Save/Understand/Remember, How it works' 6-step journey,
// and the Projects/Collections/Research Item hierarchy) with the exact
// same visual language each time, matching the live page's own steps flow.
// `wrap` splits a longer sequence into two rows of the same single-row
// layout, stacked with a down-turned connector between them, instead of
// squeezing every step into one row that only gets narrower as more
// steps get added.
function FlowDiagramRow({ steps, numberOffset = 0, style }) {
  return (
    <div className="pg-entry__flow-diagram" style={style}>
      {steps.map((s, i) => (
        <Fragment key={s.title}>
          <div className="pg-entry__flow-step">
            <span className="pg-entry__flow-step-n" aria-hidden="true">{s.icon || numberOffset + i + 1}</span>
            <h3 className="pg-entry__flow-step-title">{s.title}</h3>
            {s.points ? (
              <ul className="pg-entry__flow-step-points">
                {s.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            ) : (
              <p className="pg-entry__flow-step-body">{s.body}</p>
            )}
          </div>
          {i < steps.length - 1 && <span className="pg-entry__flow-arrow" aria-hidden="true">→</span>}
        </Fragment>
      ))}
    </div>
  );
}

function FlowDiagram({ steps, accent, wrap = false }) {
  if (!wrap) {
    return <FlowDiagramRow steps={steps} style={{ "--diagram-accent": accent }} />;
  }

  const mid = Math.ceil(steps.length / 2);
  const row1 = steps.slice(0, mid);
  const row2 = steps.slice(mid);

  return (
    <div className="pg-entry__flow-diagram-rows" style={{ "--diagram-accent": accent }}>
      <FlowDiagramRow steps={row1} />
      <span className="pg-entry__flow-arrow pg-entry__flow-arrow--down" aria-hidden="true">↓</span>
      <FlowDiagramRow steps={row2} numberOffset={mid} />
    </div>
  );
}

export default function PlaygroundSahay() {
  const { playHover, playClick } = useSoundContext();
  const navigate = useNavigate();
  // Same "was this reached by clicking in-app, or landed on directly"
  // check as PlaygroundEntry.jsx's own goBack — see the comment there.
  const { key: locationKey } = useLocation();
  const canGoBack = locationKey !== "default";

  useDocumentTitle(`${entry.title} — AI Playground — Radhika Vijay`);

  const goBack = (e) => {
    e.preventDefault();
    playClick();
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  // Same three real gradient stops as the Branding section below
  // (Curiosity → Understanding → Insight), not a new set of colors
  // invented just for this hover effect — the first stop repeats at the
  // end so the shimmer loops seamlessly instead of snapping back at 100%.
  // Computed once and reused everywhere "Sahay" gets the glow treatment
  // (the h1 title, the "What I built" hook), not per-instance.
  const sahayGradientStyle = {
    "--sahay-gradient": `linear-gradient(90deg, ${entry.branding.gradient.map((g) => g.hex).join(", ")}, ${entry.branding.gradient[0].hex})`,
  };

  // The flow demo is a real ~100s screen recording, not a few-second loop
  // like the case studies' spotlight videos — 26MB, so it doesn't autoplay
  // on page load. Two separate play states instead of one: hovering gives
  // a muted, controls-free preview that resets when the cursor leaves
  // (like the homepage cards' own hover-plays-sound pattern, just muted
  // here since silent autoplay-on-hover is the only kind that isn't
  // jarring); clicking is the real, unmuted, controls-on watch that
  // persists after the cursor leaves.
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoPreviewing, setDemoPreviewing] = useState(false);
  const demoVideoRef = useRef(null);

  const playDemo = () => {
    setDemoPlaying(true);
    setDemoPreviewing(false);
    if (demoVideoRef.current) {
      demoVideoRef.current.muted = false;
      demoVideoRef.current.play();
    }
  };

  const previewDemo = () => {
    if (demoPlaying) return;
    setDemoPreviewing(true);
    if (demoVideoRef.current) {
      demoVideoRef.current.muted = true;
      demoVideoRef.current.play();
    }
  };

  const stopPreviewDemo = () => {
    if (demoPlaying) return;
    setDemoPreviewing(false);
    if (demoVideoRef.current) {
      demoVideoRef.current.pause();
      demoVideoRef.current.currentTime = 0;
    }
  };

  const navSections = [
    { id: "why", label: "Why I built it" },
    { id: "what-built", label: "What I built" },
    { id: "how-it-works", label: "How it works" },
    { id: "demo", label: "See it in action" },
    { id: "underneath", label: "The product underneath" },
    // Structure, Search, and Ask stay three separate sections with their
    // own headings on the page — just one nav entry pointing at the first
    // of the three, so the rail doesn't list every sub-beat of "how you
    // find things again" as its own top-level item.
    { id: "hierarchy", label: "Structure, Search & Ask" },
    { id: "branding", label: entry.branding.eyebrow },
    { id: "what-iterated", label: "What I iterated" },
    { id: "what-learned", label: entry.whatILearned.eyebrow },
    { id: "whats-next", label: entry.whatsNext.eyebrow },
  ];

  return (
    <main className="pg-entry cs">
      <div className="pg-entry__grid">
        {/* ---------- Header ---------- */}
        <section className="pg-entry__header">
          <Link to="/" className="pg-entry__back" onMouseEnter={playHover} onClick={goBack}>
            ← Back home
          </Link>

          <Reveal as="span" className="pg-entry__tag">{entry.tag}</Reveal>
          <Reveal as="h1" className="pg-entry__title" delay={0.04}>
            <span className="pg-entry__brand-glow" style={sahayGradientStyle}>{entry.title}</span>
          </Reveal>
          <Reveal as="p" className="pg-entry__brief" delay={0.06}>{entry.context}</Reveal>

          {entry.href && (
            <Reveal as="div" className="pg-entry__try-wrap" delay={0.08}>
              <a className="pg-entry__try" href={entry.href} target="_blank" rel="noreferrer" onMouseEnter={playHover} onClick={playClick}>
                Try it out
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Reveal>
          )}

          {playgroundCovers[entry.slug] && (
            <Reveal as="div" className="pg-entry__hero" delay={0.12}>
              {entry.href ? (
                <a
                  className="pg-entry__hero-link"
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  <img className="pg-entry__hero-img" src={playgroundCovers[entry.slug]} alt={`${entry.title} interface, shown on a laptop mockup`} />
                  <span className="pg-entry__hero-overlay">
                    <span className="pg-entry__hero-cta">
                      Try it out
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </a>
              ) : (
                <img className="pg-entry__hero-img" src={playgroundCovers[entry.slug]} alt={`${entry.title} interface, shown on a laptop mockup`} />
              )}
            </Reveal>
          )}
        </section>

        <CaseStudyNav sections={navSections} />

        <div className="pg-entry__content">
          {/* ---------- Why I built it ---------- */}
          <Reveal as="section" id="why" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.problem.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.problem.hook}</p>
            {entry.problem.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            {entry.problem.sources?.length > 0 && (
              <div className="pg-entry__tag-row pg-entry__tag-row--tools">
                {entry.problem.sources.map((s) => (
                  <span className="pg-entry__stack-tag" key={s}>{s}</span>
                ))}
              </div>
            )}
            {entry.problem.pullquote?.length > 0 && (
              <p className="pg-entry__pullquote">
                {entry.problem.pullquote.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </p>
            )}
          </Reveal>

          {/* ---------- What I built ---------- */}
          <Reveal as="section" id="what-built" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.whatIBuilt.eyebrow}</h2>
            <p className="pg-entry__hook">
              <span className="pg-entry__brand-glow pg-entry__brand-glow--light" style={sahayGradientStyle}>
                Sahay
              </span>{" "}
              {entry.whatIBuilt.hook}
            </p>
            {entry.whatIBuilt.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            <FlowDiagram steps={entry.whatIBuilt.steps} accent={entry.accent} />
            {entry.whatIBuilt.extractedFields?.length > 0 && (
              <div className="pg-entry__node-diagrams-row" style={{ "--diagram-accent": entry.accent }}>
                <div className="pg-entry__node-diagrams-col">
                  <div className="pg-entry__node-diagram">
                    <div className="pg-entry__node-hub"><span>1 save</span></div>
                    {entry.whatIBuilt.extractedFields.map((f, i, arr) => {
                      const angle = `${(360 / arr.length) * i + 20}deg`;
                      const radius = i % 2 === 0 ? "92px" : "128px";
                      return (
                        <Fragment key={f}>
                          <span className="pg-entry__node-line" style={{ "--angle": angle, "--radius": radius }} />
                          <span className="pg-entry__node" style={{ "--angle": angle, "--radius": radius }}>
                            <span className="pg-entry__node-label">{f}</span>
                          </span>
                        </Fragment>
                      );
                    })}
                  </div>
                  <div className="pg-entry__tag-row pg-entry__tag-row--tools pg-entry__tag-row--mobile-fallback">
                    {entry.whatIBuilt.extractedFields.map((f) => (
                      <span className="pg-entry__stack-tag" key={f}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Reveal>

          {/* ---------- How it works ---------- */}
          <Reveal as="section" id="how-it-works" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.journey.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.journey.hook}</p>
            <FlowDiagram steps={entry.journey.steps} accent={entry.accent} wrap />
          </Reveal>

          {/* ---------- See it in action ---------- */}
          {/* The outer laptop bezel is back — that part read fine. What was
              actually wrong: the native poster attribute was pointed at the
              existing hero screenshot, itself a laptop-mockup image, so it
              showed a laptop inside the laptop. Fixed with a custom cover
              (dark bg, real logo, centered) instead of a native poster —
              branding before play, not a nested device graphic. The glow
              behind the frame reuses the real brand gradient (see Branding
              below) rather than a generic "AI" background. */}
          <Reveal as="section" id="demo" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">See it in action</h2>
            <p className="pg-entry__hook">The whole flow, start to finish.</p>
            <div className="pg-entry__demo">
              <div className="pg-entry__demo-glow" style={sahayGradientStyle} aria-hidden="true" />
              <div className="pg-entry__demo-frame">
                <div
                  className="pg-entry__demo-screen"
                  onMouseEnter={previewDemo}
                  onMouseLeave={stopPreviewDemo}
                  // Sits on the whole screen, not just the play button —
                  // once hovering hides the cover (and the button along
                  // with it), this is the only way left to turn the muted
                  // preview into the real, unmuted watch. Guarded on
                  // !demoPlaying so it stops firing once native controls
                  // take over — otherwise a click on the native pause
                  // button would bubble here and immediately call .play()
                  // again, and pause would never actually work.
                  onClick={() => { if (!demoPlaying) playDemo(); }}
                >

                  <video
                    ref={demoVideoRef}
                    className="pg-entry__demo-video"
                    src={sahayFlowVideo}
                    controls={demoPlaying}
                    muted={!demoPlaying}
                    playsInline
                    onEnded={() => setDemoPlaying(false)}
                  />
                  {!demoPlaying && !demoPreviewing && (
                    <div className="pg-entry__demo-cover">
                      {/* Logomark + "SAHAY" side by side, same horizontal
                          lockup as the real wordmark — not the wordmark
                          image itself, though: its "SAHAY" lettering is
                          near-black, meant for the light page background,
                          and would nearly disappear on this dark cover. */}
                      <div className="pg-entry__demo-cover-mark">
                        <img className="pg-entry__demo-cover-icon" src={sahayIconDark} alt="" />
                        <span className="pg-entry__demo-cover-word">SAHAY</span>
                      </div>
                      <button className="pg-entry__demo-play" onClick={playDemo} aria-label="Play the Sahay demo">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M6 4L16 10L6 16V4Z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="pg-entry__demo-base" aria-hidden="true">
                  <span className="pg-entry__demo-base-notch" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------- The product underneath ---------- */}
          <Reveal as="section" id="underneath" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.productUnderneath.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.productUnderneath.hook}</p>
            {entry.productUnderneath.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            {/* A flat card grid, not a second radial diagram — this list
                doesn't have a hub-and-spoke relationship distinct from the
                extracted-fields diagram above, it's the same underlying
                signals in question form. A second big spoke diagram here
                also undercut the section's own point ("I kept it simple");
                a quiet grid fits "the complexity lives underneath" better
                than another busy shape would. */}
            <div className="pg-entry__underneath-grid" style={{ "--diagram-accent": entry.accent }}>
              <span className="pg-entry__underneath-grid-caption">A saved item, broken down</span>
              <div className="pg-entry__underneath-grid-items">
                {entry.productUnderneath.nodes.map((n) => (
                  <div className="pg-entry__underneath-grid-item" key={n}>
                    <span className="pg-entry__underneath-grid-dot" aria-hidden="true" />
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ---------- Structure (Projects/Collections/Research Items) ---------- */}
          <Reveal as="section" id="hierarchy" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.hierarchy.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.hierarchy.hook}</p>
            <FlowDiagram steps={entry.hierarchy.steps} accent={entry.accent} />
            {entry.hierarchy.closing && <p className="pg-entry__body pg-entry__body--closing">{entry.hierarchy.closing}</p>}
          </Reveal>

          {/* ---------- Search ---------- */}
          <Reveal as="section" id="search" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.search.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.search.hook}</p>
            {entry.search.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
          </Reveal>

          {/* ---------- Ask ---------- */}
          <Reveal as="section" id="ask" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.ask.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.ask.hook}</p>
            {entry.ask.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            {entry.ask.example && (
              <div className="pg-entry__chat-mock">
                <div className="pg-entry__chat-mock-q">{entry.ask.example.question}</div>
                <div className="pg-entry__chat-mock-a">
                  {entry.ask.example.bullets.map((b) => (
                    <p className="pg-entry__chat-mock-bullet" key={b.lead}>
                      <span className="pg-entry__chat-mock-lead">{b.lead}</span> — {b.body}
                    </p>
                  ))}
                  {entry.ask.example.generalKnowledge && (
                    <>
                      <span className="pg-entry__chat-mock-divider">From general knowledge</span>
                      <p className="pg-entry__chat-mock-bullet">
                        <span className="pg-entry__chat-mock-lead">{entry.ask.example.generalKnowledge.lead}</span> — {entry.ask.example.generalKnowledge.body}
                      </p>
                    </>
                  )}
                </div>
                <span className="pg-entry__chat-mock-caption">Illustrative — the shape of an answer, not a screenshot.</span>
              </div>
            )}
          </Reveal>

          {/* ---------- Branding ---------- */}
          <Reveal as="section" id="branding" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.branding.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.branding.hook}</p>
            {entry.branding.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            {(entry.branding.brandMark?.wordmark || entry.branding.gradient?.length > 0) && (
              <div className="pg-entry__brand-visuals">
                {entry.branding.brandMark?.wordmark && (
                  <div className="pg-entry__wordmark-wrap">
                    <img
                      className="pg-entry__wordmark-img"
                      src={brandAssetImages[entry.branding.brandMark.wordmark]}
                      alt={`${entry.title} logomark and wordmark`}
                    />
                  </div>
                )}
                {entry.branding.gradient?.length > 0 && (
                  <div className="pg-entry__gradient">
                    <div
                      className="pg-entry__gradient-bar"
                      style={{ background: `linear-gradient(90deg, ${entry.branding.gradient.map((g) => g.hex).join(", ")})` }}
                    />
                    <div className="pg-entry__gradient-stops">
                      {entry.branding.gradient.map((g) => (
                        <span className="pg-entry__gradient-stop" key={g.label}>
                          <span className="pg-entry__gradient-swatch" style={{ background: g.hex }} />
                          {g.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {entry.branding.brandMark?.before && entry.branding.brandMark?.after && (
              <div className="pg-entry__before-after">
                {[entry.branding.brandMark.before, entry.branding.brandMark.after].map((v) => (
                  <div className="pg-entry__before-after-item" key={v.label}>
                    <div className="pg-entry__before-after-swatch">
                      <img src={brandAssetImages[v.key]} alt={`${entry.title} icon: ${v.label}`} />
                    </div>
                    <span className="pg-entry__before-after-label">{v.label}</span>
                    <p className="pg-entry__before-after-caption">{v.caption}</p>
                  </div>
                ))}
              </div>
            )}
          </Reveal>

          {/* ---------- What I iterated ---------- */}
          <Reveal as="section" id="what-iterated" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">What I iterated</h2>
            <div className="pg-entry__iteration-list pg-entry__iteration-list--timeline">
              {entry.iterations.map((it, i) => (
                <div className="pg-entry__iteration-item" key={it.title}>
                  <span className="pg-entry__iteration-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="pg-entry__iteration-title">{it.title}</h3>
                    <p className="pg-entry__iteration-body">{it.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ---------- What I learned ---------- */}
          <Reveal as="section" id="what-learned" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.whatILearned.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.whatILearned.hook}</p>
            <div className="pg-entry__insight-list">
              {entry.whatILearned.insights.map((n) => (
                <div className="pg-entry__insight-item" key={n.label}>
                  <span className="pg-entry__insight-label">{n.label}</span>
                  <p className="pg-entry__insight-body">{n.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ---------- What's next ---------- */}
          <Reveal as="section" id="whats-next" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.whatsNext.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.whatsNext.hook}</p>
            <div className="pg-entry__iteration-list pg-entry__iteration-list--timeline">
              {entry.whatsNext.stages.map((s) => (
                <div className="pg-entry__iteration-item" key={s.title}>
                  <span className="pg-entry__iteration-n pg-entry__iteration-n--icon" aria-hidden="true">{s.icon}</span>
                  <div>
                    <h3 className="pg-entry__iteration-title">{s.title}</h3>
                    <p className="pg-entry__iteration-body">{s.body}</p>
                    {s.quote && <p className="pg-entry__stage-quote">&ldquo;{s.quote}&rdquo;</p>}
                  </div>
                </div>
              ))}
            </div>
            {entry.whatsNext.closing && <p className="pg-entry__body pg-entry__body--closing">{entry.whatsNext.closing}</p>}
            {entry.whatsNext.status && <p className="pg-entry__body">{entry.whatsNext.status}</p>}
          </Reveal>

          {entry.builtWith?.length > 0 && (
            <Reveal as="div" className="pg-entry__built-with" delay={0.04}>
              <span className="pg-entry__built-with-label">Built with</span>
              <div className="pg-entry__tag-row">
                {entry.builtWith.map((t) => (
                  <span className="pg-entry__stack-tag" key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </main>
  );
}
