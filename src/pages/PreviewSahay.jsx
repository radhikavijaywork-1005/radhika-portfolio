import { Fragment } from "react";
import { motion } from "framer-motion";
import { sahayDraft as entry } from "../data/sahayDraft";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import CaseStudyNav from "./CaseStudyNav";
import { playgroundCovers } from "../data/playgroundCovers";
import "./CaseStudyPaywall.css";
import "./PlaygroundEntry.css";
import "./PreviewSahay.css";

// Same real exported mark used on the live page — see entry.branding in
// sahayDraft.js.
import sahayIconLight from "../assets/playground/sahay-brand/icon-light.png";
import sahayIconDark from "../assets/playground/sahay-brand/icon-dark.png";
import sahayWordmark from "../assets/playground/sahay-brand/wordmark.png";

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
// (What I built's Save/Understand/Remember, How it works' 5-step journey,
// and the Projects/Collections/Research Item hierarchy) with the exact
// same visual language each time, matching the live page's own steps flow.
function FlowDiagram({ steps, accent }) {
  return (
    <div className="pg-entry__flow-diagram" style={{ "--diagram-accent": accent }}>
      {steps.map((s, i) => (
        <Fragment key={s.title}>
          <div className="pg-entry__flow-step">
            <span className="pg-entry__flow-step-n" aria-hidden="true">{s.icon || i + 1}</span>
            <h3 className="pg-entry__flow-step-title">{s.title}</h3>
            <p className="pg-entry__flow-step-body">{s.body}</p>
          </div>
          {i < steps.length - 1 && <span className="pg-entry__flow-arrow" aria-hidden="true">→</span>}
        </Fragment>
      ))}
    </div>
  );
}

export default function PreviewSahay() {
  useDocumentTitle("Sahay (draft) — AI Playground — Radhika Vijay");

  const navSections = [
    { id: "why", label: "Why I built it" },
    { id: "what-built", label: "What I built" },
    { id: "how-it-works", label: "How it works" },
    { id: "underneath", label: "The product underneath" },
    { id: "hierarchy", label: "Structure" },
    { id: "search", label: "Search" },
    { id: "ask", label: entry.ask.eyebrow },
    { id: "branding", label: entry.branding.eyebrow },
    { id: "what-iterated", label: "What I iterated" },
    { id: "what-learned", label: entry.whatILearned.eyebrow },
    { id: "whats-next", label: entry.whatsNext.eyebrow },
  ];

  return (
    <main className="pg-entry cs">
      <div className="pg-entry__grid">
        {/* No "← Back home" link and no href/CTA — this route isn't linked
            from anywhere in the live site, it's a private review draft. */}
        <section className="pg-entry__header">
          <Reveal as="span" className="pg-entry__tag">{entry.tag} · draft</Reveal>
          <Reveal as="h1" className="pg-entry__title" delay={0.04}>{entry.title}</Reveal>
          <Reveal as="p" className="pg-entry__brief" delay={0.06}>{entry.context}</Reveal>

          {playgroundCovers[entry.slug] && (
            <Reveal as="div" className="pg-entry__hero" delay={0.12}>
              <img className="pg-entry__hero-img" src={playgroundCovers[entry.slug]} alt={`${entry.title} interface, shown on a laptop mockup`} />
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
            {entry.problem.flow && <p className="pg-entry__flow">{entry.problem.flow}</p>}
          </Reveal>

          {/* ---------- What I built ---------- */}
          <Reveal as="section" id="what-built" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.whatIBuilt.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.whatIBuilt.hook}</p>
            {entry.whatIBuilt.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            <FlowDiagram steps={entry.whatIBuilt.steps} accent={entry.accent} />
            {entry.whatIBuilt.extractedFields?.length > 0 && (
              <div className="pg-entry__node-diagrams-row" style={{ "--diagram-accent": entry.accent }}>
                <div className="pg-entry__node-diagrams-col">
                  <div className="pg-entry__node-diagram">
                    <div className="pg-entry__node-hub"><span>1 call</span></div>
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
          </Reveal>

          {/* ---------- How it works ---------- */}
          <Reveal as="section" id="how-it-works" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.journey.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.journey.hook}</p>
            <FlowDiagram steps={entry.journey.steps} accent={entry.accent} />
          </Reveal>

          {/* ---------- The product underneath ---------- */}
          <Reveal as="section" id="underneath" className="pg-entry__section" delay={0.04}>
            <h2 className="pg-entry__label">{entry.productUnderneath.eyebrow}</h2>
            <p className="pg-entry__hook">{entry.productUnderneath.hook}</p>
            {entry.productUnderneath.body.map((p, i) => (
              <p className="pg-entry__body" key={i}>{p}</p>
            ))}
            <div className="pg-entry__node-diagrams-row" style={{ "--diagram-accent": entry.accent }}>
              <div className="pg-entry__node-diagrams-col">
                <div className="pg-entry__node-diagram">
                  <div className="pg-entry__node-hub"><span>A saved item</span></div>
                  {entry.productUnderneath.nodes.map((n, i, arr) => {
                    const angle = `${(360 / arr.length) * i + 20}deg`;
                    const radius = i % 2 === 0 ? "96px" : "134px";
                    return (
                      <Fragment key={n}>
                        <span className="pg-entry__node-line" style={{ "--angle": angle, "--radius": radius }} />
                        <span className="pg-entry__node" style={{ "--angle": angle, "--radius": radius }}>
                          <span className="pg-entry__node-label">{n}</span>
                        </span>
                      </Fragment>
                    );
                  })}
                </div>
                <div className="pg-entry__tag-row pg-entry__tag-row--tools pg-entry__tag-row--mobile-fallback">
                  {entry.productUnderneath.nodes.map((n) => (
                    <span className="pg-entry__stack-tag" key={n}>{n}</span>
                  ))}
                </div>
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
                  <span className="pg-entry__iteration-n" aria-hidden="true">{s.icon}</span>
                  <div>
                    <h3 className="pg-entry__iteration-title">{s.title}</h3>
                    <p className="pg-entry__iteration-body">{s.body}</p>
                    {s.quote && <p className="pg-entry__stage-quote">&ldquo;{s.quote}&rdquo;</p>}
                  </div>
                </div>
              ))}
            </div>
            {entry.whatsNext.closing && <p className="pg-entry__body pg-entry__body--closing">{entry.whatsNext.closing}</p>}
          </Reveal>

          {/* ---------- Closing statement ---------- */}
          {entry.closingStatement?.length > 0 && (
            <Reveal as="section" className="pg-entry__section" delay={0.04}>
              <p className="pg-entry__pullquote pg-entry__pullquote--closing">
                {entry.closingStatement.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </p>
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
