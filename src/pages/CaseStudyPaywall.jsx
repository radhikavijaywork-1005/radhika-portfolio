import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { paywallCaseStudy as cs } from "../data/caseStudyPaywall";
import { work } from "../data/content";
import CaseStudyNav from "./CaseStudyNav";
import { useSoundContext } from "../context/SoundContext";
import { useTheme } from "../context/ThemeContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useScrollDepthTracking } from "../hooks/useScrollDepthTracking";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import dashboardImg from "../assets/case-study/paywall/Dashboard.png";
import existingImg from "../assets/case-study/paywall/existing.svg";
import flowImg from "../assets/case-study/paywall/flow.png";
import indianmanImg from "../assets/case-study/paywall/indianman.png";
import flowGif from "../assets/case-study/paywall/flow.gif";
import sheetImg from "../assets/case-study/paywall/calling-sheet-composite.jpg";
import variantsSheetImg from "../assets/case-study/paywall/variants-sheet.png";
import pastExperimentsImg from "../assets/case-study/paywall/past-experiments-collage.png";
import futureImg from "../assets/case-study/paywall/future.png";
import quoteImg from "../assets/case-study/paywall/Quote.png";
import var1Img from "../assets/case-study/paywall/paywall_var_1.png";
import var1FlatImg from "../assets/case-study/paywall/paywall_var_1_flat.png";
import var2Img from "../assets/case-study/paywall/paywall_var_2.png";
import var3Img from "../assets/case-study/paywall/paywall_var_3.png";
import var4Img from "../assets/case-study/paywall/paywall_var_4.png";
import var5Img from "../assets/case-study/paywall/paywall_var_5.png";
import ph2Img from "../assets/case-study/paywall/ph2-intentpaywall.png";
import ph3Img from "../assets/case-study/paywall/ph3-ux.png";
import highlight05 from "../assets/case-study/paywall/highlight-05.svg";
import highlight05Dark from "../assets/case-study/paywall/highlight-05-dm.svg";
import intentPaywallVideo from "../assets/case-study/paywall/intentpaywall.mp4";
import specialAccessVideo from "../assets/case-study/paywall/special-access.mp4";
import "./CaseStudyPaywall.css";

const variantImages = [var1FlatImg, var2Img, var3Img, var4Img, var5Img];
const spotlightVideos = { "02": intentPaywallVideo, "03": specialAccessVideo };

const navSections = [
  { id: "summary", label: "Summary" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "strategy", label: "Strategy" },
  { id: "decisions", label: "Decisions" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

const fadeUp = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({ as = "div", className, children, delay = 0 }) {
  const Tag = motion[as];
  const { ref, revealed } = useRevealOnScroll(0.2);
  return (
    <Tag
      ref={ref}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={revealed ? "show" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

// Renders "**bold**" markers as <strong> — matches Figma's inline SemiBold
// emphasis spans within otherwise-light body copy.
function Bold({ text }) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

// Counts up from 0 to the numeric part of a stat string (e.g. "~57%") once
// scrolled into view, keeping any non-numeric prefix/suffix (~, %, etc.)
// static — only the digits animate. Replays every time the card scrolls
// back into view (its own IntersectionObserver, not the shared
// useRevealOnScroll hook, which fires once and never again by design).
function CountUpValue({ value, trend }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  const ref = useRef(null);
  const [display, setDisplay] = useState(match ? parseFloat(match[2]) : null);

  useEffect(() => {
    if (!match) return;
    const el = ref.current;
    if (!el) return;
    const target = parseFloat(match[2]);
    const decimals = match[2].includes(".") ? 1 : 0;
    let raf;

    const animate = () => {
      // Random plausible starting point, re-rolled on every replay —
      // direction follows the trend arrow: "down" starts above target and
      // counts down, "up"/none starts below target and counts up.
      const startValue = trend === "down"
        ? target * (1.3 + Math.random() * 0.5)
        : Math.max(target * (0.35 + Math.random() * 0.35), 0);
      const duration = 1800;
      let start;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        setDisplay(startValue + (target - startValue) * eased);
        if (progress < 1) raf = requestAnimationFrame(step);
        else setDisplay(target);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) animate();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [match?.[2], trend]);

  if (!match) return <span ref={ref}>{value}</span>;
  const decimals = match[2].includes(".") ? 1 : 0;
  return (
    <span ref={ref}>
      {match[1]}
      {display.toFixed(decimals)}
      {match[3]}
    </span>
  );
}

function useDragScroll() {
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, startScroll: ref.current.scrollLeft };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    ref.current.scrollLeft = drag.current.startScroll - (e.pageX - drag.current.startX);
  };
  const stopDrag = () => {
    drag.current.active = false;
  };

  return {
    ref,
    onMouseDown,
    onMouseMove,
    onMouseUp: stopDrag,
    onMouseLeave: stopDrag,
  };
}

function getNextCaseStudy() {
  const currentIndex = work.findIndex((w) => w.href === "/work/paywall-experiments");
  for (let offset = 1; offset <= work.length; offset++) {
    const candidate = work[(currentIndex + offset) % work.length];
    if (candidate.href) return candidate;
  }
  return null;
}

export default function CaseStudyPaywall() {
  useDocumentTitle("STAGE Paywall Experiments — Radhika Vijay");
  useScrollDepthTracking("paywall");
  const nextCaseStudy = getNextCaseStudy();
  const [nextHovered, setNextHovered] = useState(false);
  // Touch devices never fire hover, so the preview card (previously gated
  // entirely behind onMouseEnter) just never appeared — showing it by
  // default here matches how the rest of the site treats hover-only
  // enhancements as optional polish, not the only way to see the content.
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const { playHover, playClick } = useSoundContext();
  const variantDrag = useDragScroll();
  const { theme } = useTheme();
  const [activeStrategyTab, setActiveStrategyTab] = useState(cs.strategy.tabs[0].key);
  const stageLogoSrc = theme === "dark" ? stageLogoWhite : stageLogo;
  const highlight05Src = theme === "dark" ? highlight05Dark : highlight05;
  const navigate = useNavigate();
  // location.key is "default" only for a page landed on directly — a real
  // key means there's in-app history to actually go back into, so a real
  // history POP (not a fresh push to "/#work") fires and ScrollToTop in
  // App.jsx restores the exact scroll position on Home.
  const { key: locationKey } = useLocation();
  const canGoBack = locationKey !== "default";
  const goBack = (e) => {
    e.preventDefault();
    playClick();
    if (canGoBack) navigate(-1);
    else navigate("/#work");
  };

  return (
    <main className="cs cs-paywall">
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

          <Reveal as="div" className="cs-hero-img-wrap" delay={0.18}>
            <div className="cs-hero-phone">
              <img src={var1Img} alt="Phase 1 of the STAGE paywall" />
            </div>
            <div className="cs-hero-phone">
              <img src={ph2Img} alt="Phase 2 of the STAGE paywall — intent-based paywall" />
            </div>
            <div className="cs-hero-phone">
              <img src={ph3Img} alt="Phase 3 of the STAGE paywall — refined UX" />
            </div>
          </Reveal>
        </section>

        <CaseStudyNav sections={navSections} />

        <div className="cs-content">
          {/* ---------- Summary ---------- */}
          <section id="summary" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Summary
            </Reveal>

            <div className="cs-summary-list">
              {cs.summary.map((s, i) => (
                <Reveal as="div" className="cs-summary-item" key={s.label} delay={i * 0.06}>
                  <span className="cs-summary-item__icon">{s.icon}</span>
                  <div>
                    <h3 className="cs-summary-item__label">{s.label}</h3>
                    <p className="cs-summary-item__text">
                      <Bold text={s.text} />
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" className="cs-h2">
              Overview
            </Reveal>
            <Reveal as="div" className="cs-overview-brand" delay={0.04}>
              <img className="cs-overview-brand__logo" src={stageLogoSrc} alt="" aria-hidden="true" />
              <span className="cs-overview-brand__tag">(India's leading regional OTT platform)</span>
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>
              {cs.overview}
            </Reveal>

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
            <Reveal as="h2" className="cs-h2">
              What was the problem?
            </Reveal>

            <div className="cs-stat-row">
              {cs.problemStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                  <span className="cs-stat__sublabel">{s.sublabel}</span>
                </Reveal>
              ))}
            </div>

            <Reveal as="p" className="cs-body" delay={0.12}>
              <Bold text={cs.problemBody} />
            </Reveal>

            <Reveal as="div" className="cs-dashboard-img-wrap" delay={0.1}>
              <img className="cs-dashboard-img" src={dashboardImg} alt="Amplitude dashboard showing average trial conversion" />
              <span className="cs-caption">Amplitude dashboard showing avg conversion of trial</span>
            </Reveal>
          </section>

          {/* ---------- Research ---------- */}
          <section id="research" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Research &amp; Insights
            </Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.03}>
              a. Understanding the existing flow
            </Reveal>
            <Reveal as="div" className="cs-flow-img-wrap" delay={0.06}>
              <img className="cs-flow-img" src={flowImg} alt="Existing app flow: Meta Ads to Download App to Sign-up to Genre Selection to Paywall to Checkout. ~98% of acquisition happens from Meta ads." />
            </Reveal>

            <div className="cs-problem-quote-row">
              <Reveal as="div" className="cs-flow-gif-wrap" delay={0.05}>
                <span className="cs-flow-gif__note">GIF showing existing flow</span>
                <div className="cs-flow-gif__frame">
                  <img className="cs-flow-gif__highlight" src={highlight05Src} alt="" aria-hidden="true" />
                  <img className="cs-flow-gif" src={flowGif} alt="Screen recording of the existing paywall flow" />
                </div>
              </Reveal>

              <Reveal as="div" className="cs-quote-person-wrap" delay={0.1}>
                <blockquote className="cs-user-quote">
                  “{cs.userQuote}”
                  <span className="cs-user-quote__tail" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </blockquote>
                <img className="cs-problem-quote-img" src={indianmanImg} alt="" aria-hidden="true" />
              </Reveal>
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              b. Breakdown of the existing screen
            </Reveal>

            <Reveal as="div" className="cs-breakdown-block" delay={0.02}>
              <div className="cs-existing-img-col">
                <div className="cs-existing-img-wrap">
                  <img className="cs-existing-img" src={existingImg} alt="The existing STAGE paywall screen before the redesign" />
                </div>
                <span className="cs-existing-img-caption">CMS operated paywall</span>
              </div>

              <div className="cs-breakdown-list">
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
            </Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              c. User research
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>
              {cs.research.body}
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.07}>
              {cs.research.body2}
            </Reveal>

            <Reveal as="ol" className="cs-tag-list" delay={0.1}>
              {cs.research.params.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </Reveal>

            <Reveal as="div" className="cs-research-card" delay={0.08}>
              <div className="cs-sheet-img-wrap">
                <img className="cs-sheet-img" src={sheetImg} alt="Calling sheet coding user-call responses against research parameters, alongside a recorded user call" />
                <span className="cs-caption">Calling sheet</span>
              </div>
              <div className="cs-quote-grid">
                {cs.research.quotes.map((q) => (
                  <div className="cs-quote-card" key={q.name}>
                    <p className="cs-quote-card__text">“{q.text}”</p>
                    <span className="cs-quote-card__attr">
                      {q.name}, {q.loc}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              d. Insights
            </Reveal>
            <div className="cs-insight-grid">
              {cs.insights.map((ins, i) => (
                <Reveal as="div" className="cs-insight-card" key={ins.title} delay={i * 0.06}>
                  <span className="cs-overview-fact__icon">{ins.icon}</span>
                  <h4 className="cs-insight-card__title">{ins.title}</h4>
                  <p className="cs-insight-card__body">{ins.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              e. What past experiments already told us
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.04}>
              <Bold text={cs.pastExperiments.intro} />
            </Reveal>
            <Reveal as="div" className="cs-past-experiments-img-wrap" delay={0.06}>
              <img className="cs-past-experiments-img" src={pastExperimentsImg} alt="Collage of past paywall experiment variants tested over 18 months" />
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>
              {cs.pastExperiments.learningsIntro}
            </Reveal>
            <div className="cs-oi-list">
              {cs.pastExperiments.learnings.map((l, i) => (
                <Reveal as="div" className="cs-oi-row" key={l.title} delay={(i % 5) * 0.04}>
                  <span className="cs-overview-fact__icon">{l.icon}</span>
                  <h3 className="cs-oi-row__title">{l.title}</h3>
                  <p className="cs-oi-row__text">
                    <span className="cs-oi-item__label">Observed</span> {l.observed}
                  </p>
                  <p className="cs-oi-row__text">
                    <span className="cs-oi-item__label cs-oi-item__label--inferred">Inferred</span> {l.inferred}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- Strategy ---------- */}
          <section id="strategy" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Strategy
            </Reveal>

            <Reveal as="div" className="cs-principle" delay={0.04}>
              <span className="cs-principle__eyebrow">{cs.strategy.principleEyebrow}</span>
              <p className="cs-principle__statement">{cs.strategy.principleStatement}</p>
              <p className="cs-principle__note">{cs.strategy.principleNote}</p>
            </Reveal>

            <div className="cs-strategy-tabs" role="tablist" aria-label="Strategy stages">
              {cs.strategy.tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={activeStrategyTab === t.key}
                  className={`cs-strategy-tab${activeStrategyTab === t.key ? " is-active" : ""}`}
                  onClick={() => setActiveStrategyTab(t.key)}
                  onMouseEnter={playHover}
                >
                  <span aria-hidden="true">{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {activeStrategyTab === "universe" && (
              <div className="cs-strategy-panel">
                <Reveal as="p" className="cs-body" delay={0.04}>
                  <Bold text={cs.strategy.universeIntro} />
                </Reveal>

                <Reveal as="p" className="cs-body" delay={0.06}>
                  <Bold text={cs.strategy.universeCriterion} />
                </Reveal>

                <div className="cs-priority-legend cs-priority-legend--shared">
                  <span><i className="cs-priority-legend__dot cs-priority-legend__dot--p1" />Priority 1</span>
                  <span><i className="cs-priority-legend__dot cs-priority-legend__dot--p2" />Priority 2</span>
                  <span><i className="cs-priority-legend__dot cs-priority-legend__dot--neutral" />On the table, unranked</span>
                </div>

                <div className="cs-priority-grid">
                  <div className="cs-priority-grid__col">
                    {[cs.strategy.commsUniverse[0], cs.strategy.commsUniverse[2], cs.strategy.commsUniverse[3]].map((group, i) => (
                      <Reveal as="div" className="cs-priority-block" key={group.title} delay={i * 0.06}>
                        <h4 className="cs-priority-block__title">{group.title}</h4>
                        <div className={`cs-priority-tags${group.title === "Plan communication" ? " cs-priority-tags--grid" : ""}`}>
                          {group.items.map((item) => (
                            <span
                              className={`cs-tag cs-tag--${item.tier || "neutral"}`}
                              key={item.text}
                            >
                              {item.text}
                            </span>
                          ))}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <Reveal as="div" className="cs-priority-block cs-priority-grid__col--fill" delay={0.06}>
                    <h4 className="cs-priority-block__title">{cs.strategy.commsUniverse[1].title}</h4>
                    <div className="cs-priority-tags cs-priority-tags--grid">
                      {cs.strategy.commsUniverse[1].items.map((item) => (
                        <span
                          className={`cs-tag cs-tag--${item.tier || "neutral"}`}
                          key={item.text}
                        >
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                </div>
              </div>
            )}

            {activeStrategyTab === "variants" && (
              <div className="cs-strategy-panel">
                <Reveal as="p" className="cs-body" delay={0.04}>
                  {cs.strategy.variantCompositionIntro}
                </Reveal>

                <Reveal as="div" className="cs-sheet-img-wrap cs-sheet-img-wrap--variants" delay={0.1}>
                  <img className="cs-sheet-img cs-sheet-img--variants" src={variantsSheetImg} alt="Original variant-composition sheet mapping fixed and optional elements to the final tested variants" />
                  <span className="cs-caption">Variant composition sheet</span>
                </Reveal>
              </div>
            )}

            {activeStrategyTab === "structure" && (
              <div className="cs-strategy-panel">
                <Reveal as="p" className="cs-body" delay={0.04}>
                  {cs.strategy.structureIntro}
                </Reveal>
                <Reveal as="div" className="cs-paywall-phone-row" delay={0.06}>
                  <div className="cs-paywall-phone">
                    {cs.strategy.structure.blocks.map((b) => (
                      <div className="cs-wf-block" key={b.title}>
                        <span className="cs-wf-block__label">{b.code}. {b.title}</span>
                        {b.type === "image" && (
                          <div className="cs-wf-image">
                            <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                              <line x1="0" y1="0" x2="100" y2="60" />
                              <line x1="100" y1="0" x2="0" y2="60" />
                            </svg>
                            <div className="cs-wf-lines cs-wf-lines--inline">
                              <span className="cs-wf-line" style={{ width: "70%" }} />
                              <span className="cs-wf-line" style={{ width: "45%" }} />
                            </div>
                          </div>
                        )}
                        {b.type === "text" && (
                          <div className="cs-wf-lines cs-wf-lines--plan">
                            <span className="cs-wf-line cs-wf-line--lg" style={{ width: "55%" }} />
                            <span className="cs-wf-line" style={{ width: "85%" }} />
                            <span className="cs-wf-line" style={{ width: "60%" }} />
                            <span className="cs-wf-line" style={{ width: "70%" }} />
                            <span className="cs-wf-line" style={{ width: "40%" }} />
                          </div>
                        )}
                        {b.type === "video" && (
                          <div className="cs-wf-video">
                            <span className="cs-wf-video__play" />
                          </div>
                        )}
                        {b.type === "button" && <div className="cs-wf-button" />}
                      </div>
                    ))}
                  </div>
                  <div className="cs-paywall-phone__legend">
                    {cs.strategy.structure.blocks.map((b) => (
                      <div className="cs-breakdown-item" key={b.title}>
                        <span className="cs-breakdown-item__n">{b.code}</span>
                        <div>
                          <h3 className="cs-breakdown-item__title">{b.title}</h3>
                          <p className="cs-breakdown-item__body">{b.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            )}
          </section>

          {/* ---------- Decisions / Phases ---------- */}
          <section id="decisions" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Decisions
            </Reveal>

            {cs.decisions.map((d) => (
              <div className="cs-phase" key={d.phase}>
                <Reveal as="div" className="cs-phase__tag" delay={0.02}>
                  <span className="cs-phase__tag-n">{d.phase}</span>
                  <span className="cs-phase__tag-label">
                    {d.phaseLabel} : {d.title}
                  </span>
                </Reveal>

                <Reveal as="span" className="cs-phase__eyebrow" delay={0.04}>
                  Hypothesis
                </Reveal>
                <Reveal as="p" className="cs-phase__hypothesis" delay={0.06}>
                  <span className="cs-phase__hyp-body">{d.hypothesis}</span>
                </Reveal>

                <Reveal as="span" className="cs-phase__how-label" delay={0.08}>
                  How we tested it
                </Reveal>
                <Reveal as="p" className="cs-phase__how-body" delay={0.1}>
                  <Bold text={d.howTested} />
                </Reveal>

                {d.intentLogic && (
                  <Reveal as="div" className="cs-intent-logic" delay={0.12}>
                    <span className="cs-intent-logic__label">{d.intentLogic.title}</span>
                    <p className="cs-intent-logic__intro">
                      <Bold text={d.intentLogic.intro} />
                    </p>
                    <div className="cs-intent-logic__decisions">
                      {d.intentLogic.decisions.map((dec) => (
                        <div className="cs-intent-logic__item" key={dec.n}>
                          <span className="cs-intent-logic__n">{dec.n}</span>
                          <div>
                            <h4 className="cs-intent-logic__item-title">{dec.title}</h4>
                            <p className="cs-intent-logic__item-body">{dec.body}</p>
                            {dec.subItems && (
                              <ul className="cs-intent-logic__sublist">
                                {dec.subItems.map((sub) => (
                                  <li key={sub}><Bold text={sub} /></li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                )}

                {d.variants && (
                  <Reveal as="div" className="cs-phase1-card" delay={0.1}>
                    <div
                      className="cs-variant-row cs-variant-row--scroll"
                      ref={variantDrag.ref}
                      onMouseDown={variantDrag.onMouseDown}
                      onMouseMove={variantDrag.onMouseMove}
                      onMouseUp={variantDrag.onMouseUp}
                      onMouseLeave={variantDrag.onMouseLeave}
                    >
                      {d.variants.map((v, vi) => (
                        <div className="cs-variant" key={v.label}>
                          <img src={variantImages[vi]} alt={`${v.label}: ${v.title}`} />
                          <span className="cs-variant__label">{v.label}</span>
                          <span className="cs-variant__title">{v.title}</span>
                        </div>
                      ))}
                    </div>

                    {d.highlights && (
                      <div className="cs-clarity-block">
                        <span className="cs-clarity-block__eyebrow">Phase 1</span>
                        <h3 className="cs-clarity-block__title">{d.eyebrow}</h3>
                        <div className="cs-clarity-list">
                          {d.highlights.map((h) => (
                            <div className="cs-clarity-item" key={h.title}>
                              <h4 className="cs-clarity-item__title">{h.title}</h4>
                              <p className="cs-clarity-item__body">{h.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Reveal>
                )}

                {d.spotlightTitle && (
                  <Reveal as="div" className="cs-spotlight" delay={0.08}>
                    <div className="cs-spotlight__text">
                      <span className="cs-spotlight__eyebrow">{d.eyebrow}</span>
                      <h3 className="cs-spotlight__title">{d.spotlightTitle}</h3>
                      <p className="cs-spotlight__body">
                        <Bold text={d.spotlightBody} />
                      </p>
                    </div>
                    <div className="cs-spotlight__img-wrap">
                      <video src={spotlightVideos[d.phase]} autoPlay loop muted playsInline />
                      <img className="cs-spotlight__highlight" src={highlight05Src} alt="" aria-hidden="true" />
                    </div>
                  </Reveal>
                )}

                <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
                  {d.phaseLabel}: Impacts
                </Reveal>
                <Reveal as="div" className="cs-impact-card" delay={0.08}>
                  <span className="cs-impact-card__label">{d.impact.label}</span>
                  <span className="cs-impact-card__stat">{d.impact.stat}</span>
                  <p className="cs-impact-card__body">
                    <Bold text={d.impact.body} />
                  </p>
                </Reveal>
              </div>
            ))}
          </section>

          {/* ---------- Overall impact ---------- */}
          <section id="impact" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Overall Impact
            </Reveal>
            <div className="cs-overall-grid">
              {cs.overallImpact.map((s, i) => (
                <Reveal as="div" className="cs-overall-card" key={s.label} delay={i * 0.08}>
                  <div className="cs-overall-card__value-row">
                    <span className="cs-overall-card__value"><CountUpValue value={s.value} trend={s.trend} /></span>
                    <span className={`cs-overall-card__trend cs-overall-card__trend--${s.trend}`}>
                      {s.trend === "up" ? "↗" : "↘"}
                    </span>
                  </div>
                  <span className="cs-overall-card__label">{s.label}</span>
                  <p className="cs-overall-card__body">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- Reflection ---------- */}
          <section id="reflection" className="cs-section">
            <Reveal as="div" className="cs-quote-img-wrap">
              <img className="cs-quote-img" src={quoteImg} alt={`${cs.reflectionPre}${cs.reflectionEm1}${cs.reflectionMid}${cs.reflectionEm2}${cs.reflectionPost}`} />
            </Reveal>

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Challenges &amp; Learnings
            </Reveal>
            <div className="cs-challenge-grid">
              {cs.challenges.map((c, i) => (
                <Reveal as="div" className="cs-challenge-card" key={c.n} delay={i * 0.08}>
                  <span className="cs-challenge-card__n">{c.n}</span>
                  <h3 className="cs-challenge-card__title">{c.title}</h3>
                  <p className="cs-challenge-card__body">
                    <Bold text={c.body} />
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Future Scope &amp; Updates <span className="cs-h2__note">| 2026</span>
            </Reveal>
            <div className="cs-future-live-wrap">
              <ul className="cs-future-list">
                {cs.futureScope.map((item, i) => (
                  <Reveal as="li" className="cs-future-list__item" key={item} delay={i * 0.04}>
                    <span className="cs-future-list__n">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <Bold text={item} />
                    </span>
                  </Reveal>
                ))}
              </ul>
              <div className="cs-future-img-wrap">
                <img className="cs-future-img" src={futureImg} alt="Live plan picker showing monthly, quarterly, and yearly plans" />
                <img className="cs-future-img__highlight" src={highlight05Src} alt="" aria-hidden="true" />
              </div>
            </div>

            <div className="cs-sparkle-divider" aria-hidden="true">
              <span className="cs-sparkle-divider__line" />
              <span className="cs-sparkle-divider__mark">✧</span>
              <span className="cs-sparkle-divider__line" />
            </div>
          </section>

          {/* ---------- Next case study ---------- */}
          {nextCaseStudy && (
            <section
              className="cs-next"
              style={{ "--cs-next-color": nextCaseStudy.color }}
            >
              <span className="cs-caption" style={{ textAlign: "left" }}>Next case study</span>
              <a
                className="cs-next__link"
                href={nextCaseStudy.href}
                target={nextCaseStudy.href.startsWith("/") ? undefined : "_blank"}
                rel={nextCaseStudy.href.startsWith("/") ? undefined : "noreferrer"}
                onMouseEnter={() => {
                  setNextHovered(true);
                  playHover();
                }}
                onMouseLeave={() => setNextHovered(false)}
                onClick={playClick}
              >
                {nextCaseStudy.title}
                <svg className="cs-next__arrow" width="16" height="16" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 9L9 3M9 3H4M9 3V8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
