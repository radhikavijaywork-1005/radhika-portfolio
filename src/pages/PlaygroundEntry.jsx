import { Fragment } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { playground } from "../data/playground";
import { useSoundContext } from "../context/SoundContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import CaseStudyNav from "./CaseStudyNav";
import { playgroundCovers } from "../data/playgroundCovers";
import "./CaseStudyPaywall.css";
import "./PlaygroundEntry.css";

// Real photos pulled from the live site's own data (birds.json), not stock
// imagery — same source as the site's own species pages. Used in the
// "What I built" collage (see entry.whatIBuilt.collage in playground.js).
import avesIndianPeafowl from "../assets/playground/aves/indian-peafowl.jpg";
import avesIndianRoller from "../assets/playground/aves/indian-roller.jpg";
import avesEurasianHoopoe from "../assets/playground/aves/eurasian-hoopoe.jpg";
import avesBrahminyKite from "../assets/playground/aves/brahminy-kite.jpg";
import avesAsianKoel from "../assets/playground/aves/asian-koel.jpg";
import avesWhiteThroatedKingfisher from "../assets/playground/aves/white-throated-kingfisher.jpg";

// The real exported Sahay mark, not a description of it — see
// entry.branding.brandMark in playground.js for how these are used.
import sahayIconLight from "../assets/playground/sahay-brand/icon-light.png";
import sahayIconDark from "../assets/playground/sahay-brand/icon-dark.png";
import sahayWordmark from "../assets/playground/sahay-brand/wordmark.png";

const collageImages = {
  "indian-peafowl": avesIndianPeafowl,
  "indian-roller": avesIndianRoller,
  "eurasian-hoopoe": avesEurasianHoopoe,
  "brahminy-kite": avesBrahminyKite,
  "asian-koel": avesAsianKoel,
  "white-throated-kingfisher": avesWhiteThroatedKingfisher,
};

const brandAssetImages = {
  iconLight: sahayIconLight,
  iconDark: sahayIconDark,
  wordmark: sahayWordmark,
};

const fadeUp = {
  hidden: { opacity: 0, transform: "translateY(16px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Mount-triggered, not whileInView — this page's content is all one short
// screen (not a long scroll like the case studies), and whileInView's
// IntersectionObserver got stuck reporting no intersection on load here,
// leaving every section permanently at opacity:0. Firing on mount instead
// removes the dependency on that observer entirely.
function Reveal({ as = "div", className, children, id, delay = 0 }) {
  const Tag = motion[as];
  return (
    <Tag id={id} className={className} variants={fadeUp} initial="hidden" animate="show" transition={{ delay }}>
      {children}
    </Tag>
  );
}

// entry.branding and entry.whatsNext are optional (only Sahay has them so
// far) and slot into the nav/content in content order — branding right
// after "What I built" (it's about the product's identity, not its
// mechanics), whatsNext after "What I learned" (a forward-looking close).
// No "Context" entry here — that copy now lives in the header as the
// brief, same slot the real case studies use for their subhead.
function navSectionsFor(entry) {
  return [
    { id: "why", label: "Why I built it" },
    { id: "what-built", label: "What I built" },
    ...(entry.branding ? [{ id: "branding", label: entry.branding.eyebrow }] : []),
    { id: "what-iterated", label: "What I iterated" },
    { id: "what-learned", label: "What I learned" },
    ...(entry.whatsNext ? [{ id: "whats-next", label: entry.whatsNext.eyebrow }] : []),
  ];
}

export default function PlaygroundEntry() {
  const { slug } = useParams();
  const entry = playground.find((p) => p.slug === slug);
  const { playHover, playClick } = useSoundContext();
  const navigate = useNavigate();
  // location.key is the string "default" only for a page landed on
  // directly (fresh load / shared link) — anything reached by clicking
  // within the app gets a real key, so this tells us whether there's
  // in-app history to actually go back into.
  const { key: locationKey } = useLocation();
  const canGoBack = locationKey !== "default";

  useDocumentTitle(entry ? `${entry.title} — AI Playground — Radhika Vijay` : "AI Playground — Radhika Vijay");

  // A real back-navigation (history POP), not a fresh push to "/" — so
  // ScrollToTop in App.jsx restores the exact scroll position on Home
  // instead of resetting to the top, matching the reference site's
  // detail-page "Back" behavior.
  const goBack = (e) => {
    e.preventDefault();
    playClick();
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  if (!entry) {
    return (
      <main className="pg-entry cs">
        <div className="pg-entry__grid pg-entry__grid--notfound">
          <Link to="/" className="pg-entry__back" onMouseEnter={playHover} onClick={goBack}>
            ← Back home
          </Link>
          <p className="pg-entry__body">That experiment doesn't exist yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pg-entry cs">
      <div className="pg-entry__grid">
        {/* ---------- Header ---------- */}
        <section className="pg-entry__header">
          <Link to="/" className="pg-entry__back" onMouseEnter={playHover} onClick={goBack}>
            ← Back home
          </Link>

          <Reveal as="span" className="pg-entry__tag">{entry.tag}</Reveal>
          <Reveal as="h1" className="pg-entry__title" delay={0.04}>{entry.title}</Reveal>
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

          {/* Same laptop-mockup cover the card itself uses — one image
              introduces the project both times, matching how the real
              case studies reuse their hero as the "Selected work" cover. */}
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

          {entry.gestures?.length > 0 && (
            <div className="pg-entry__legend-grid">
              {entry.gestures.map((g) => (
                <div className="pg-entry__legend-item" key={g.label}>
                  <span className="pg-entry__legend-icon" aria-hidden="true">{g.icon}</span>
                  <span className="pg-entry__legend-does">{g.does}</span>
                  <span className="pg-entry__legend-label">{g.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <CaseStudyNav sections={navSectionsFor(entry)} />

        <div className="pg-entry__content">
          <Reveal as="section" id="why" className="pg-entry__section" delay={0.04}>
            {entry.problem ? (
              <>
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
                {entry.problem.flow && <p className="pg-entry__flow">{entry.problem.flow}</p>}
              </>
            ) : (
              <>
                <h2 className="pg-entry__label">Why I built it</h2>
                <p className="pg-entry__body">{entry.why}</p>
              </>
            )}
          </Reveal>

          <Reveal as="section" id="what-built" className="pg-entry__section" delay={0.04}>
            {typeof entry.whatIBuilt === "object" ? (
              <>
                <h2 className="pg-entry__label">{entry.whatIBuilt.eyebrow}</h2>
                <p className="pg-entry__hook">{entry.whatIBuilt.hook}</p>
                {entry.whatIBuilt.body.map((p, i) => (
                  <p className="pg-entry__body" key={i}>{p}</p>
                ))}
                {entry.whatIBuilt.collage?.length > 0 && (
                  <div className="pg-entry__collage">
                    {entry.whatIBuilt.collage.map((c) => (
                      collageImages[c.key] && (
                        <figure className={`pg-entry__collage-item pg-entry__collage-item--${c.size || "sm"}`} key={c.key}>
                          <img
                            src={collageImages[c.key]}
                            alt={c.name}
                            loading="lazy"
                            style={{ objectPosition: `center ${c.focalY ?? 30}%` }}
                          />
                          <figcaption>
                            <span className="pg-entry__collage-name">{c.name}</span>
                            <span className="pg-entry__collage-sci">{c.sciName}</span>
                          </figcaption>
                        </figure>
                      )
                    ))}
                  </div>
                )}
                {entry.whatIBuilt.steps?.length > 0 && (
                  <div className="pg-entry__flow-diagram" style={{ "--diagram-accent": entry.accent }}>
                    {entry.whatIBuilt.steps.map((s, i) => (
                      <Fragment key={s.title}>
                        <div className="pg-entry__flow-step">
                          <span className="pg-entry__flow-step-n" aria-hidden="true">{s.icon || i + 1}</span>
                          <h3 className="pg-entry__flow-step-title">{s.title}</h3>
                          <p className="pg-entry__flow-step-body">{s.body}</p>
                        </div>
                        {i < entry.whatIBuilt.steps.length - 1 && (
                          <span className="pg-entry__flow-arrow" aria-hidden="true">→</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
                {(entry.whatIBuilt.extractedFields?.length > 0 || entry.whatIBuilt.evidenceTypes?.length > 0) && (
                  <div className="pg-entry__node-diagrams-row" style={{ "--diagram-accent": entry.accent }}>
                    {entry.whatIBuilt.extractedFields?.length > 0 && (
                      <div className="pg-entry__node-diagrams-col">
                        {/* Desktop: a hub-and-spoke diagram — "one call pulls
                            every signal at once" reads faster as a shape than
                            as a flat list. Mobile: falls back to plain chips,
                            the radial layout doesn't have room to breathe
                            below 640px (see media query in the CSS). */}
                        <div className="pg-entry__node-diagram">
                          <div className="pg-entry__node-hub"><span>1 call</span></div>
                          {entry.whatIBuilt.extractedFields.map((f, i, arr) => {
                            // +20deg offset keeps every spoke off the 0/90/
                            // 180/270 axes, so the diagram's widest point is
                            // never purely horizontal or vertical — it needs
                            // less width and less height to fit without
                            // clipping, which matters now that it sits in a
                            // column half the page's width, not the full one.
                            const angle = `${(360 / arr.length) * i + 20}deg`;
                            // Alternating near/far radius: arc distance
                            // between neighbors is equal all the way around a
                            // circle, but wide pill labels only collide where
                            // the tangent runs near-horizontal (top/bottom).
                            // Staggering the radius adds separation exactly
                            // where equal angles alone can't.
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
                    )}
                    {entry.whatIBuilt.evidenceTypes?.length > 0 && (
                      <div className="pg-entry__node-diagrams-col">
                        {/* Same hub-and-spoke technique as the extracted-fields
                            diagram, sized down to 4 items — shows the line
                            styles actually doing the thing the copy above
                            describes (a new save linking back as typed
                            evidence), instead of floating as a disconnected
                            style legend. */}
                        <div className="pg-entry__node-diagram pg-entry__node-diagram--evidence">
                          <div className="pg-entry__node-hub"><span>New save</span></div>
                          {entry.whatIBuilt.evidenceTypes.map((e, i, arr) => {
                            const angle = `${(360 / arr.length) * i + 45}deg`;
                            return (
                              <Fragment key={e.label}>
                                <span
                                  className={`pg-entry__node-line pg-entry__node-line--${e.style}`}
                                  style={{ "--angle": angle }}
                                />
                                <span className="pg-entry__node" style={{ "--angle": angle }}>
                                  <span className="pg-entry__node-label">{e.label}</span>
                                </span>
                              </Fragment>
                            );
                          })}
                        </div>
                        <div className="pg-entry__tag-row pg-entry__tag-row--tools pg-entry__tag-row--mobile-fallback">
                          {entry.whatIBuilt.evidenceTypes.map((e) => (
                            <span className="pg-entry__stack-tag" key={e.label}>{e.label}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {entry.whatIBuilt.principles?.length > 0 && (
                  <div className="pg-entry__principle-grid">
                    {entry.whatIBuilt.principles.map((p) => (
                      <div className="pg-entry__principle-item" key={p.label}>
                        <span className="pg-entry__principle-label">{p.label}</span>
                        <span className="pg-entry__principle-body">{p.body}</span>
                      </div>
                    ))}
                  </div>
                )}
                {entry.whatIBuilt.closing && <p className="pg-entry__body pg-entry__body--closing">{entry.whatIBuilt.closing}</p>}
                {entry.toolset?.length > 0 && (
                  <div className="pg-entry__tag-row pg-entry__tag-row--tools">
                    {entry.toolset.map((t) => (
                      <span className="pg-entry__stack-tag" key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="pg-entry__label">What I built</h2>
                <p className="pg-entry__body">{entry.whatIBuilt}</p>
              </>
            )}
          </Reveal>

          {entry.branding && (
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
              {entry.branding.closing && <p className="pg-entry__body pg-entry__body--closing">{entry.branding.closing}</p>}
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
          )}

          <Reveal as="section" id="what-iterated" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">What I iterated</h2>
            {entry.iterations?.length > 0 ? (
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
            ) : (
              <p className="pg-entry__body">{entry.whatIIterated}</p>
            )}
          </Reveal>

          <Reveal as="section" id="what-learned" className="pg-entry__section" delay={0.04}>
            {typeof entry.whatILearned === "object" ? (
              <>
                <h2 className="pg-entry__label">{entry.whatILearned.eyebrow}</h2>
                <p className="pg-entry__hook">{entry.whatILearned.hook}</p>
                {entry.whatILearned.body.map((p, i) => (
                  <p className="pg-entry__body" key={i}>{p}</p>
                ))}
              </>
            ) : (
              <>
                <h2 className="pg-entry__label">What I learned</h2>
                <p className="pg-entry__body">{entry.whatILearned}</p>
              </>
            )}
          </Reveal>

          {entry.whatsNext && (
            <Reveal as="section" id="whats-next" className="pg-entry__section" delay={0.04}>
              <h2 className="pg-entry__label">{entry.whatsNext.eyebrow}</h2>
              <p className="pg-entry__hook">{entry.whatsNext.hook}</p>
              {entry.whatsNext.roadmap?.length > 0 && (
                <div className="pg-entry__roadmap-grid">
                  {entry.whatsNext.roadmap.map((r) => (
                    <div className="pg-entry__roadmap-item" key={r.label}>
                      <div className="pg-entry__roadmap-head">
                        <span className="pg-entry__roadmap-icon" aria-hidden="true">{r.icon}</span>
                        <span className="pg-entry__roadmap-label">{r.label}</span>
                        {r.status && <span className="pg-entry__roadmap-status">{r.status}</span>}
                      </div>
                      <div className="pg-entry__roadmap-split">
                        <div>
                          <span className="pg-entry__roadmap-col-label">Today</span>
                          <p className="pg-entry__roadmap-col-body">{r.today}</p>
                        </div>
                        <div>
                          <span className="pg-entry__roadmap-col-label">Next</span>
                          <p className="pg-entry__roadmap-col-body">{r.next}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {entry.whatsNext.body.map((p, i) => (
                <p className="pg-entry__body" key={i}>{p}</p>
              ))}
            </Reveal>
          )}

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
