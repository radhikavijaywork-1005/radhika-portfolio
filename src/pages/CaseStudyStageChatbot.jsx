import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { stageChatbotCaseStudy as cs } from "../data/caseStudyStageChatbot";
import { work } from "../data/content";
import CaseStudyNav from "./CaseStudyNav";
import { useSoundContext } from "../context/SoundContext";
import { useTheme } from "../context/ThemeContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useScrollDepthTracking } from "../hooks/useScrollDepthTracking";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import homeStoriesImg from "../assets/case-study/character-chatbot/home-stories.png";
import consumptionBubbleImg from "../assets/case-study/character-chatbot/consumption-bubble.png";
import "./CaseStudyPaywall.css";
import "./CaseStudyTripAssurance.css";
import "./CaseStudyStageChatbot.css";

// Matches the site's other case studies exactly: Summary → Overview →
// Problem → Design Work → Decisions (phased) → Impact → Reflection.
// See caseStudyStageChatbot.js header for sourcing and accuracy rules.
const images = { homeStories: homeStoriesImg, consumptionBubble: consumptionBubbleImg };

const navSections = [
  { id: "summary", label: "Summary" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "validation", label: "Validation" },
  { id: "design-work", label: "Design Work" },
  { id: "llm-systems", label: "LLM & Systems" },
  { id: "decisions", label: "Decisions" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

const fadeUp = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ as = "div", className, children, delay = 0 }) {
  const Tag = motion[as];
  const { ref, revealed } = useRevealOnScroll(0.2);
  return (
    <Tag ref={ref} className={className} variants={fadeUp} initial="hidden" animate={revealed ? "show" : "hidden"} transition={{ delay }}>
      {children}
    </Tag>
  );
}

function Flow({ steps }) {
  return (
    <div className="cc-flow">
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`cc-flow__step${i === steps.length - 1 ? " cc-flow__step--accent" : ""}`}>{step}</span>
          {i < steps.length - 1 && <span className="cc-flow__arrow">→</span>}
        </div>
      ))}
    </div>
  );
}

function Bold({ text }) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

function Flag({ type, children }) {
  return <span className={`cc-flag cc-flag--${type === "in progress" ? "upcoming" : type}`}>{children}</span>;
}

function PartDivider({ part }) {
  return (
    <Reveal as="div" className="cc-part">
      <span className="cc-part__label">{part.label}</span>
      <span className="cc-part__title">{part.title}</span>
      <span className="cc-part__note">{part.note}</span>
    </Reveal>
  );
}

function getNextCaseStudy() {
  const currentIndex = work.findIndex((w) => w.href === "/work/character-chatbot");
  for (let offset = 1; offset <= work.length; offset++) {
    const candidate = work[(Math.max(currentIndex, 0) + offset) % work.length];
    if (candidate.href && candidate.href !== "/work/character-chatbot") return candidate;
  }
  return null;
}

export default function CaseStudyStageChatbot() {
  useDocumentTitle("STAGE Character Chatbot — Radhika Vijay");
  useScrollDepthTracking("character-chatbot");
  const { playHover, playClick } = useSoundContext();
  const { theme } = useTheme();
  const stageLogoSrc = theme === "dark" ? stageLogoWhite : stageLogo;
  const navigate = useNavigate();
  const { key: locationKey } = useLocation();
  const canGoBack = locationKey !== "default";
  const goBack = (e) => {
    e.preventDefault();
    playClick();
    if (canGoBack) navigate(-1);
    else navigate("/#work");
  };
  const nextCaseStudy = getNextCaseStudy();
  const [nextHovered, setNextHovered] = useState(false);
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );

  return (
    <main className="cs cs-chatbot">
      <div className="cs-grid">
        {/* ---------- Header ---------- */}
        <section className="cs-header">
          <Link to="/#work" className="cs-back" onMouseEnter={playHover} onClick={goBack}>
            ← Back to work
          </Link>

          <Reveal as="div" className="cs-company">
            <img className="cs-company__logo" src={stageLogoSrc} alt="STAGE" />
          </Reveal>

          <Reveal as="h1" className="cs-title" delay={0.05}>
            {cs.title}
          </Reveal>

          <Reveal as="p" className="cs-subhead" delay={0.1}>
            {cs.subheadPre}
            <strong>{cs.subheadStrong}</strong>
            {cs.subheadPost}
          </Reveal>

          <Reveal as="div" className="cs-meta-row" delay={0.14}>
            {cs.meta.map((m) => (
              <div className="cs-meta" key={m.label}>
                <span className="cs-meta__label">{m.label}</span>
                <div className="cs-meta__value">
                  <span className="cs-meta__primary">{m.primary}</span>
                  <span className="cs-meta__detail">{m.detail}</span>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal as="div" className="cs-hero-img-wrap cs-hero-img-wrap--single" delay={0.18}>
            <div className="cs-hero-phone">
              <img src={homeStoriesImg} alt="STAGE home screen with the Home Stories character rail" />
            </div>
          </Reveal>
        </section>

        <CaseStudyNav sections={navSections} />

        <div className="cs-content">
          {/* ---------- Summary ---------- */}
          <section id="summary" className="cs-section">
            <Reveal as="h2" className="cs-h2">Summary</Reveal>
            <div className="cs-summary-list">
              {cs.summary.map((s, i) => (
                <Reveal as="div" className="cs-summary-item" key={s.label} delay={i * 0.06}>
                  <span className="cs-summary-item__icon">{s.icon}</span>
                  <div>
                    <h3 className="cs-summary-item__label">{s.label}</h3>
                    <p className="cs-summary-item__text"><Bold text={s.text} /></p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" className="cs-h2">Overview</Reveal>
            <Reveal as="div" className="cs-overview-brand" delay={0.04}>
              <img className="cs-overview-brand__logo" src={stageLogoSrc} alt="" aria-hidden="true" />
              <span className="cs-overview-brand__tag">(India's regional-language OTT platform)</span>
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>{cs.overview}</Reveal>
            <div className="cs-overview-facts">
              {cs.overviewFacts.map((f, i) => (
                <Reveal as="div" className="cs-overview-fact" key={f.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">{f.icon}</span>
                  <h4 className="cs-overview-fact__title">{f.title}</h4>
                  <p className="cs-overview-fact__body">{f.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- Problem ---------- */}
          <section id="problem" className="cs-section">
            <Reveal as="h2" className="cs-h2">What was the problem?</Reveal>
            <div className="cs-stat-row">
              {cs.problemStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                  <span className="cs-stat__sublabel">{s.sublabel}</span>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="cs-body" delay={0.1}>{cs.problemBody}</Reveal>
            <Reveal as="p" className="cc-pull" delay={0.12}>{cs.problemQuote}</Reveal>
            <p className="cs-caption" style={{ textAlign: "left", fontStyle: "normal" }}>{cs.problemQuoteNote}</p>
          </section>

          {/* ---------- Research ---------- */}
          <section id="research" className="cs-section">
            <Reveal as="h2" className="cs-h2">{cs.researchHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.1}>{cs.researchBody}</Reveal>
            <span className="cs-phase__how-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>{cs.targetMetricsLabel}</span>
            <div className="cs-overview-facts cs-overview-facts--four">
              {cs.targetMetrics.map((t) => (
                <div className="cs-overview-fact" key={t.segment}>
                  <h4 className="cs-overview-fact__title">{t.segment}</h4>
                  <p className="cs-overview-fact__body">{t.target}</p>
                </div>
              ))}
            </div>

            <span className="cs-phase__how-label" style={{ display: "block", marginTop: 24, marginBottom: 8 }}>{cs.userFlowLabel}</span>
            <Flow steps={cs.userFlow} />

            <span className="cs-phase__how-label" style={{ display: "block", marginTop: 24, marginBottom: 8 }}>{cs.modelChoiceLabel}</span>
            <div className="cs-overview-facts">
              {cs.modelChoice.map((m, i) => (
                <Reveal as="div" className="cs-overview-fact" key={m.title} delay={i * 0.05}>
                  <h4 className="cs-overview-fact__title">{m.title}</h4>
                  <p className="cs-overview-fact__body">{m.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- Validation ---------- */}
          <section id="validation" className="cs-section">
            <Reveal as="span" className="cc-eyebrow__label" delay={0}>{cs.validationTag}</Reveal>
            <Reveal as="h2" className="cs-h2" delay={0.02}>{cs.validationHook}</Reveal>
            <div className="cs-stat-row">
              {cs.designStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                  <span className="cs-stat__sublabel">{s.sublabel}</span>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="cs-body" delay={0.1}>{cs.designWorkBody}</Reveal>
            <div className="cs-breakdown-list" style={{ marginTop: 16 }}>
              {cs.breakdown.map((b, i) => (
                <Reveal as="div" className="cs-breakdown-item" key={b.n} delay={(i % 3) * 0.06}>
                  <span className="cs-breakdown-item__n">{b.n}</span>
                  <div>
                    <h3 className="cs-breakdown-item__title">{b.title}</h3>
                    <p className="cs-breakdown-item__body">{b.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <PartDivider part={cs.partDesign} />

          {/* ---------- Design Work ----------*/}
          <section id="design-work" className="cs-section">
            <Reveal as="span" className="cc-eyebrow__label" delay={0}>{cs.designWorkTag}</Reveal>
            <span className="cs-phase__how-label" style={{ display: "block", marginTop: 6, marginBottom: 8 }}>How this became a decision, not a design choice</span>
            <div className="cc-ladder">
              {cs.reasoningLadder.map((r, i) => (
                <Reveal as="div" className="cc-ladder__step" key={r.n} delay={i * 0.08}>
                  <div className="cc-ladder__marker">
                    <span className="cc-ladder__n">{r.n}</span>
                    {i < cs.reasoningLadder.length - 1 && <span className="cc-ladder__line" aria-hidden="true" />}
                  </div>
                  <div className="cc-ladder__content">
                    <span className="cc-ladder__label">{r.label}</span>
                    <p className="cc-ladder__body">{r.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>{cs.frameworkLayersLabel}</Reveal>
            <Flow steps={cs.frameworkLayers} />
            <p className="cs-caption" style={{ textAlign: "left" }}>{cs.frameworkLayersNote}</p>

            <span className="cs-phase__how-label" style={{ display: "block", marginTop: 24, marginBottom: 8 }}>{cs.researchCopy.label}</span>
            <div className="cc-chatmock">
              <div className="cc-chatmock__head">
                <span className="cc-chatmock__head-avatar" />
                <span className="cc-chatmock__head-name">{cs.researchCopy.character} · {cs.researchCopy.segment}</span>
              </div>
              <div className="cc-chatmock__body">
                <span className="cc-chatmock__label">Trigger</span>
                <div className="cc-chatmock__bubble">
                  “{cs.researchCopy.trigger}”
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6, fontStyle: "italic" }}>{cs.researchCopy.triggerNote}</div>
                </div>
                <span className="cc-chatmock__label">Starters</span>
                {cs.researchCopy.starters.map((s) => (
                  <div className="cc-chatmock__bubble cc-chatmock__bubble--starter" key={s}>{s}</div>
                ))}
                <span className="cc-chatmock__label">Behavior</span>
                <p style={{ fontSize: 12.5, color: "var(--cs-soft)", lineHeight: 1.55 }}>{cs.researchCopy.behavior}</p>
              </div>
            </div>

            <Reveal as="div" className="cc-plugin-teaser" delay={0.08}>
              <div className="cc-plugin-teaser__head">
                <h4 className="cc-plugin-teaser__title">{cs.pluginTeaser.title}</h4>
                <Flag type={cs.pluginTeaser.flag}>{cs.pluginTeaser.flag}</Flag>
              </div>
              <p className="cc-plugin-teaser__body">{cs.pluginTeaser.body}</p>
              <p className="cc-plugin-teaser__note">{cs.pluginTeaser.note}</p>
            </Reveal>
          </section>

          <PartDivider part={cs.partLLM} />

          {/* ---------- LLM & Systems Work ----------*/}
          <section id="llm-systems" className="cs-section">
            <Reveal as="h2" className="cs-h2">{cs.llmSystemsHook}</Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>{cs.universalRulesLabel}</Reveal>
            <div className="cs-overview-facts cs-overview-facts--two">
              {cs.universalRules.map((r) => (
                <div className="cs-overview-fact" key={r.label}>
                  <h4 className="cs-overview-fact__title">{r.label}</h4>
                  <ul className="cs-branch-list">{r.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="cs-caption" style={{ textAlign: "left", fontStyle: "normal", marginTop: 16 }}>{cs.universalRulesNote}</p>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>{cs.safetyLabel}</Reveal>
            <div className="cs-overview-facts">
              {cs.safetyLayers.map((s, i) => (
                <Reveal as="div" className="cs-overview-fact" key={s.title} delay={i * 0.05}>
                  <h4 className="cs-overview-fact__title">{s.title}</h4>
                  <p className="cs-overview-fact__body">{s.body}</p>
                </Reveal>
              ))}
            </div>
            <span className="cs-phase__how-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Verified against</span>
            <div className="cs-overview-facts">
              {cs.qaCases.map((q) => (
                <div className="cs-overview-fact" key={q}><p className="cs-overview-fact__body">{q}</p></div>
              ))}
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>{cs.learningLoopLabel}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>{cs.learningLoopNote}</Reveal>
          </section>

          {/* ---------- Decisions ---------- */}
          <section id="decisions" className="cs-section">
            <Reveal as="h2" className="cs-h2">Decisions</Reveal>

            {cs.decisions.map((d) => (
              <div className="cs-phase" key={d.phase}>
                <Reveal as="div" className="cs-phase__tag" delay={0.02}>
                  <span className="cs-phase__tag-n">{d.phase}</span>
                  <span className="cs-phase__tag-label">{d.phaseLabel} : {d.title}</span>
                </Reveal>

                <Reveal as="span" className="cs-phase__eyebrow" delay={0.04}>Hypothesis</Reveal>
                <Reveal as="p" className="cs-phase__hypothesis" delay={0.06}>
                  <span className="cs-phase__hyp-body">{d.hypothesis}</span>
                </Reveal>

                <Reveal as="span" className="cs-phase__how-label" delay={0.08}>What I did</Reveal>
                <Reveal as="p" className="cs-phase__how-body" delay={0.1}><Bold text={d.howTested} /></Reveal>

                {d.image && (
                  <Reveal as="div" className="cs-existing-img-wrap" delay={0.06}>
                    <img className="cs-existing-img" src={images[d.image]} alt={d.imageCaption} />
                    <span className="cs-existing-img-caption">{d.imageCaption}</span>
                  </Reveal>
                )}

                {d.states && (
                  <>
                    <span className="cs-phase__how-label" style={{ display: "block", marginBottom: 8, marginTop: 16 }}>Entry states</span>
                    <div className="cc-states">
                      {d.states.entry.map((s) => (
                        <div className="cc-states__card" key={s}><span className="cc-states__card-title">{s}</span></div>
                      ))}
                    </div>
                    <span className="cs-phase__how-label" style={{ display: "block", marginBottom: 8, marginTop: 16 }}>Conversation states</span>
                    <div className="cc-states">
                      {d.states.conversation.map((s) => (
                        <div className="cc-states__card" key={s}><span className="cc-states__card-title">{s}</span></div>
                      ))}
                    </div>
                  </>
                )}

                {d.qaCases && (
                  <div className="cs-overview-facts" style={{ marginTop: 16 }}>
                    {d.qaCases.map((q) => (
                      <div className="cs-overview-fact" key={q}><p className="cs-overview-fact__body">{q}</p></div>
                    ))}
                  </div>
                )}

                {d.impact && (
                  <Reveal as="div" className="cs-impact-card" delay={0.08}>
                    <span className="cs-impact-card__label">
                      {d.impact.label}
                      {d.impact.flag && <Flag type={d.impact.flag}>{d.impact.flag}</Flag>}
                    </span>
                    <span className="cs-impact-card__stat">{d.impact.stat}</span>
                    <p className="cs-impact-card__body">{d.impact.body}</p>
                  </Reveal>
                )}
              </div>
            ))}
          </section>

          {/* ---------- Impact ---------- */}
          <section id="impact" className="cs-section">
            <Reveal as="h2" className="cs-h2">The experiment became a live product.</Reveal>
            <Reveal as="p" className="cs-body" delay={0.04}>{cs.overallImpactNote}</Reveal>
            <div className="cs-overall-grid">
              {cs.overallImpact.map((s, i) => (
                <Reveal as="div" className="cs-overall-card" key={s.label} delay={i * 0.08}>
                  <div className="cs-overall-card__value-row">
                    <span className="cs-overall-card__value">{s.value}</span>
                    <span className={`cs-overall-card__trend cs-overall-card__trend--${s.trend}`}>↗</span>
                  </div>
                  <span className="cs-overall-card__label">{s.label}</span>
                  <p className="cs-overall-card__body">{s.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>{cs.incidentTitle}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>{cs.incidentBody}</Reveal>
            <div className="cc-funnel">
              {cs.incidentFunnel.map((f) => (
                <div className={`cc-funnel__step${f.broken ? " cc-funnel__step--break" : ""}`} key={f.label}>
                  <span className="cc-funnel__step-label">{f.label}</span>
                  <span className="cc-funnel__step-value">{f.value}</span>
                </div>
              ))}
            </div>
            <p className="cc-funnel__note">{cs.incidentNote}</p>
          </section>

          {/* ---------- Reflection ---------- */}
          <section id="reflection" className="cs-section">
            <Reveal as="h2" className="cs-h2">What this taught me about designing AI products.</Reveal>
            <div className="cs-challenge-grid">
              {cs.challenges.map((c, i) => (
                <Reveal as="div" className="cs-challenge-card" key={c.n} delay={i * 0.08}>
                  <span className="cs-challenge-card__n">{c.n}</span>
                  <h3 className="cs-challenge-card__title">{c.title}</h3>
                  <p className="cs-challenge-card__body">{c.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="cc-pull" delay={0.08}>{cs.closing}</Reveal>

            {cs.futureScope.length > 0 && (
              <>
                <span className="cs-caption" style={{ textAlign: "left", marginTop: 24 }}>Shipped after this, by other teams — not in scope here</span>
                <div className="cs-overview-facts">
                  {cs.futureScope.map((f, i) => (
                    <Reveal as="div" className="cs-overview-fact" key={f.title} delay={i * 0.05}>
                      <h4 className="cs-overview-fact__title">{f.title}</h4>
                      <p className="cs-overview-fact__body">{f.body}</p>
                    </Reveal>
                  ))}
                </div>
              </>
            )}

            <div className="cs-sparkle-divider" aria-hidden="true">
              <span className="cs-sparkle-divider__line" />
              <span className="cs-sparkle-divider__mark">✧</span>
              <span className="cs-sparkle-divider__line" />
            </div>
          </section>

          {/* ---------- Next case study ---------- */}
          {nextCaseStudy && (
            <section className="cs-next" style={{ "--cs-next-color": nextCaseStudy.color }}>
              <span className="cs-caption" style={{ textAlign: "left" }}>Next case study</span>
              <a
                className="cs-next__link"
                href={nextCaseStudy.href}
                onMouseEnter={() => {
                  setNextHovered(true);
                  playHover();
                }}
                onMouseLeave={() => setNextHovered(false)}
                onClick={playClick}
              >
                {nextCaseStudy.title}
                <svg className="cs-next__arrow" width="16" height="16" viewBox="0 0 12 12" fill="none">
                  <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <AnimatePresence>
                {(nextHovered || isTouch) && (
                  <motion.div
                    className="cs-next__preview"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3 }}
                    exit={{ opacity: 0, scale: 0.92, rotate: -3 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img className="cs-next__preview-bg" src={nextCaseStudy.bg} alt="" />
                    <img
                      className="cs-next__preview-phones"
                      src={nextCaseStudy.phones}
                      alt=""
                      style={{ width: `${nextCaseStudy.phonesWidthPct}%` }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
