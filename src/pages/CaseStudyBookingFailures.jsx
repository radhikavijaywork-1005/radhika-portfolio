import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { bookingFailuresCaseStudy as cs } from "../data/caseStudyBookingFailures";
import { work } from "../data/content";
import CaseStudyNav from "./CaseStudyNav";
import { useSoundContext } from "../context/SoundContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import trainmanLogo from "../assets/case-study/trip-assurance/trainman-logo.svg";
import heroPhone1 from "../assets/case-study/booking-failures/hero-1.png";
import heroPhone2 from "../assets/case-study/booking-failures/hero-2.png";
import heroPhone3 from "../assets/case-study/booking-failures/hero-3.png";
import "./CaseStudyPaywall.css";
import "./CaseStudyBookingFailures.css";

const navSections = [
  { id: "summary", label: "Summary" },
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "decisions", label: "Decisions" },
  { id: "design-iteration", label: "Design & Iteration" },
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

function Reveal({ as = "div", className, children, delay = 0, ...rest }) {
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
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Bold({ text }) {
  return (
    <span>
      {text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </span>
  );
}

function Placeholder({ label, className = "" }) {
  return <div className={`cs-media-placeholder ${className}`}>{label}</div>;
}

function getNextCaseStudy() {
  const currentIndex = work.findIndex((w) => w.href === "/work/booking-failures");
  for (let offset = 1; offset <= work.length; offset++) {
    const candidate = work[(currentIndex + offset) % work.length];
    if (candidate.href) return candidate;
  }
  return null;
}

export default function CaseStudyBookingFailures() {
  useDocumentTitle("Reducing Booking Failures — Radhika Vijay");
  const nextCaseStudy = getNextCaseStudy();
  const [nextHovered, setNextHovered] = useState(false);
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const { playHover, playClick } = useSoundContext();
  const navigate = useNavigate();
  const { key: locationKey } = useLocation();
  const canGoBack = locationKey !== "default";
  const goBack = (e) => {
    e.preventDefault();
    playClick();
    if (canGoBack) navigate(-1);
    else navigate("/#work");
  };

  return (
    <main className="cs cs-bf">
      <div className="cs-grid">
        {/* ---------- Header ---------- */}
        <section className="cs-header">
          <Link to="/#work" className="cs-back" onMouseEnter={playHover} onClick={goBack}>
            ← Back to work
          </Link>

          <Reveal as="div" className="cs-company">
            <div className="cs-company__lockup">
              <img className="cs-company__logo cs-company__logo--icon" src={trainmanLogo} alt="" aria-hidden="true" />
              <span className="cs-company__name">
                {cs.company}
                <span className="cs-company__tag"> {cs.companyTag}</span>
              </span>
            </div>
          </Reveal>

          <Reveal as="h1" className="cs-title" delay={0.05}>
            {cs.title}
          </Reveal>

          <Reveal as="p" className="cs-subhead" delay={0.1}>
            {cs.subheadPre}
            <strong>{cs.subheadStrong}</strong>
            {cs.subheadPost}
          </Reveal>

          <Reveal as="div" className="cs-cta-group" delay={0.12}>
            <a
              href="https://www.figma.com/proto/9jxcUHpEVLdB8Av1qfpEXc/Radhika_Portfolio?page-id=161%3A2531&node-id=846-30517&viewport=151%2C383%2C0.02&t=O2AgLqr3f1L0vrnm-1&scaling=scale-down&content-scaling=scale-down"
              target="_blank"
              rel="noopener noreferrer"
              className="cs-cta-btn cs-cta-btn--secondary"
            >
              <span>▶</span>
              View Presentation
            </a>
          </Reveal>

          <Reveal as="div" className="cs-meta-row" delay={0.16}>
            {cs.meta.map((m) => (
              <div className="cs-meta" key={m.label}>
                <span className="cs-meta__label">{m.label}</span>
                <div className="cs-meta__value">
                  <span className="cs-meta__primary">{m.primary}</span>
                  {m.detail && <span className="cs-meta__detail">{m.detail}</span>}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal as="div" className="cs-hero-img-wrap" delay={0.18}>
            <div className="cs-hero-phone">
              <img src={heroPhone1} alt="Booking pending screen before the redesign" />
            </div>
            <div className="cs-hero-phone">
              <img src={heroPhone2} alt="Redesigned IRCTC credential screen" />
            </div>
            <div className="cs-hero-phone">
              <img src={heroPhone3} alt="Redesigned pending page with clear next steps" />
            </div>
          </Reveal>
        </section>

        <CaseStudyNav sections={navSections} />

        <div className="cs-content">
          {/* ---------- Summary / Overview ---------- */}
          <section className="cs-section">
            <Reveal as="h2" id="summary" className="cs-h2">
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

            <Reveal as="h2" className="cs-h2" delay={0.06}>
              Project Approach
            </Reveal>
            <div className="cs-approach-stepper">
              {cs.approach.map((step, i) => (
                <Reveal as="div" className="cs-approach-step" key={step.n} delay={i * 0.04}>
                  <span className="cs-approach-step__n">{step.n}</span>
                  <h4 className="cs-approach-step__title">{step.title}</h4>
                  <p className="cs-approach-step__body">{step.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" id="overview" className="cs-h2" delay={0.05}>
              Overview of Trainman
            </Reveal>
            <Reveal as="div" className="cs-overview-brand" delay={0.04}>
              <img className="cs-overview-brand__logo" src={trainmanLogo} alt="" aria-hidden="true" />
              <span className="cs-overview-brand__name">Trainman</span>
              <span className="cs-overview-brand__tag">(Wholly owned subsidiary of Adani Digital Labs)</span>
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>
              <Bold text={cs.overview} />
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
              Problems Identified
            </Reveal>

            <div className="cs-stat-row">
              {cs.problemStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                </Reveal>
              ))}
            </div>

            <Reveal as="p" className="cs-body" delay={0.08}>
              <Bold text={cs.problemBody} />
            </Reveal>

            <Reveal as="div" className="cs-bf-problem-card" delay={0.1}>
              <h4 className="cs-bf-problem-card__title">{cs.problemCard.title}</h4>
              <p className="cs-bf-problem-card__body">
                <Bold text={cs.problemCard.body} />
              </p>
            </Reveal>
          </section>

          {/* ---------- Research ---------- */}
          <section id="research" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Research &amp; Insights
            </Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.03}>
              Understanding Basic Booking Flow
            </Reveal>
            <Reveal as="div" className="cs-flow-stepper" delay={0.05}>
              <div className="cs-bf-flow-row">
                {cs.basicBookingFlow.steps.map((step, i) => (
                  <span className="cs-flow-stepper__box" key={step}>
                    {step}
                    {i < cs.basicBookingFlow.steps.length - 1 && <span className="cs-bf-flow-row__arrow">→</span>}
                  </span>
                ))}
              </div>
              <div className="cs-bf-flow-branch">
                <span className="cs-flow-stepper__box">{cs.basicBookingFlow.postPayment[0]}</span>
                <span className="cs-bf-flow-branch__outcomes">
                  <span className="cs-flow-stepper__box cs-bf-flow-box--yes">
                    Yes → {cs.basicBookingFlow.branch.yes}
                  </span>
                  <span className="cs-flow-stepper__box cs-bf-flow-box--no">
                    No → {cs.basicBookingFlow.branch.no}
                  </span>
                </span>
              </div>
            </Reveal>

            <h3 className="cs-h2 cs-h2--sub">Failure Key Metrics</h3>
            <div className="cs-stat-row cs-stat-row--platform">
              {cs.failureMetrics.map((m) => (
                <div className="cs-stat" key={m.label}>
                  <span className="cs-stat__value">{m.value}</span>
                  <span className="cs-stat__label">{m.label}</span>
                </div>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub cs-bf-metrics-heading">Metrics for Pending Issues</h3>
            <div className="cs-metrics-band">
              <div className="cs-stat-row cs-stat-row--tight cs-stat-row--other">
                {cs.pendingIssueMetrics.map((m, i) => (
                  <div className={`cs-stat${i === 0 ? "" : " cs-stat--divided"}`} key={m.label}>
                    <span className="cs-stat__value cs-stat__value--sm">{m.value}</span>
                    <span className="cs-stat__label">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="cs-h2 cs-h2--sub">User Feedback</h3>
            <p className="cs-body">These feedbacks were collected from App/Play Store reviews & 1:1 user calling</p>
            <Placeholder label="User feedback speech-bubble collage (6 quotes) — pending screenshots" />

            <h3 className="cs-h2 cs-h2--sub">Pain Points to work upon</h3>
            <p className="cs-body">We have categorized these issues into two key segments:</p>
            <div className="cs-bf-paingroup-row">
              {cs.painPointGroups.map((g) => (
                <div className="cs-bf-paingroup" key={g.title}>
                  <span className="cs-bf-paingroup__icon">{g.icon}</span>
                  <h4 className="cs-bf-paingroup__title">{g.title}</h4>
                  <ul className="cs-branch-list">
                    {g.items.map((item) => (
                      <li key={item}>👉 {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub">Technical Challenges with IRCTC</h3>
            <div className="cs-overview-facts cs-overview-facts--two">
              {cs.technicalChallenges.map((c, i) => (
                <Reveal as="div" className="cs-overview-fact" key={c.title} delay={i * 0.05}>
                  <h4 className="cs-overview-fact__title">👉🏻 {c.title}</h4>
                  <p className="cs-overview-fact__body">{c.body}</p>
                </Reveal>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub">Breakdown of Existing Flow</h3>
            <div className="cs-bf-breakdown-row">
              <div className="cs-bf-breakdown-col">
                <Placeholder label="Existing IRCTC CRIS page — screenshot pending" />
                <p className="cs-pre-booking__label">IRCTC CRIS page</p>
                <ul className="cs-branch-list">
                  {cs.existingFlowAnnotations.ircteCrisPage.map((a, i) => (
                    <li key={i}><Bold text={a.text} /></li>
                  ))}
                </ul>
              </div>
              <div className="cs-bf-breakdown-col">
                <Placeholder label="Existing pending page — screenshot pending" />
                <p className="cs-pre-booking__label">Pending page</p>
                <ul className="cs-branch-list">
                  {cs.existingFlowAnnotations.pendingPage.map((a, i) => (
                    <li key={i}><Bold text={a.text} /></li>
                  ))}
                </ul>
              </div>
              <div className="cs-bf-breakdown-col">
                <Placeholder label="Existing pending states (10 / 30min) — screenshots pending" />
                <ul className="cs-branch-list">
                  {cs.existingFlowAnnotations.pendingPageStates.map((a, i) => (
                    <li key={i}><Bold text={a.text} /></li>
                  ))}
                </ul>
              </div>
            </div>

            <h3 className="cs-h2 cs-h2--sub">Overall Insights</h3>
            <div className="cs-insight-grid">
              {cs.overallInsights.map((ins, i) => (
                <Reveal as="div" className="cs-insight-card" key={ins.title} delay={i * 0.06}>
                  <span className="cs-overview-fact__icon">{ins.icon}</span>
                  <h4 className="cs-insight-card__title">{ins.title}</h4>
                  <p className="cs-insight-card__body">{ins.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- Decisions ---------- */}
          <section id="decisions" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Opportunities
            </Reveal>
            <div className="cs-insight-grid">
              {cs.opportunities.map((o, i) => (
                <Reveal as="div" className="cs-insight-card" key={o.n} delay={i * 0.06}>
                  <span className="cs-overview-fact__icon">{o.icon}</span>
                  <h4 className="cs-insight-card__title cs-insight-card__title--lg">{o.n}. {o.title}</h4>
                  <p className="cs-insight-card__body"><strong>How might we</strong> {o.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Strategy
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>
              {cs.strategy.intro}
            </Reveal>
            <div className="cs-overview-facts">
              {cs.strategy.cards.map((c, i) => (
                <Reveal as="div" className="cs-overview-fact" key={c.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">{c.icon}</span>
                  <h4 className="cs-overview-fact__title">{c.title}</h4>
                  <p className="cs-overview-fact__body" style={{ whiteSpace: "pre-line" }}>{c.body}</p>
                </Reveal>
              ))}
            </div>

            {cs.decisions.map((d, dIdx) => (
              <div className="cs-phase" key={d.phase}>
                <Reveal as="div" className="cs-solution-eyebrow" delay={0.02}>
                  <span className="cs-solution-eyebrow__n">{dIdx + 1}. Solution</span>
                  <span className="cs-solution-eyebrow__dot">·</span>
                  <span className="cs-solution-eyebrow__title">{d.title}</span>
                </Reveal>

                <Reveal as="h3" className="cs-solution-name" delay={0.03}>
                  {d.solutionName}
                </Reveal>
                {d.pitch && (
                  <Reveal as="p" className="cs-phase__hypothesis" delay={0.04}>
                    {d.pitch}
                  </Reveal>
                )}

                {d.phase === "01" && (
                  <>
                    <h3 id="design-iteration" className="cs-h2 cs-h2--sub cs-h2--designs-iterations">Designs &amp; Iterations</h3>
                    <span className="cs-phase__how-label cs-phase__how-label--metric cs-userflow-label">User Flow</span>
                    <Reveal as="p" className="cs-body cs-userflow-body" delay={0.06}>
                      {d.userFlow.body}
                    </Reveal>
                    <Placeholder label="Post-payment transition-page walkthrough — screenshot pending" />
                    <div className="cs-bf-flow-row cs-bf-flow-row--wrap">
                      {d.userFlow.steps.map((step, i) => (
                        <span className="cs-flow-stepper__box" key={step}>
                          {step}
                          {i < d.userFlow.steps.length - 1 && <span className="cs-bf-flow-row__arrow">→</span>}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {d.phase === "02" && (
                  <>
                    <span className="cs-phase__how-label cs-phase__how-label--metric">User Flow</span>
                    <Reveal as="p" className="cs-body" delay={0.06}>
                      {d.userFlow.body}
                    </Reveal>
                    <Placeholder label="IRCTC credential submit → response decision-tree diagram — pending" />
                  </>
                )}

                {d.phase === "03" && (
                  <Reveal as="p" className="cs-body" delay={0.04}>
                    {d.pitch}
                  </Reveal>
                )}

                <h4 className="cs-key-results-heading" style={{ fontSize: 24, marginTop: 32 }}>Before / after screens</h4>
                <Placeholder label={`${d.solutionName} — before/after screens pending`} />

                <h4 className="cs-key-results-heading" style={{ fontSize: 24 }}>Iterations</h4>
                <ul className="cs-branch-list cs-branch-list--loose">
                  {d.iterations.map((it, i) => (
                    <li key={i}><Bold text={it} /></li>
                  ))}
                </ul>
              </div>
            ))}

            <h3 className="cs-h2 cs-h2--sub">Happy Flow</h3>
            <Placeholder label="Happy-flow GIFs across all three solutions — pending" />

            <h3 className="cs-key-results-heading">Usability Test</h3>
            <Reveal as="p" className="cs-body" delay={0.04} style={{ whiteSpace: "pre-line" }}>
              <Bold text={cs.usability.intro} />
            </Reveal>

            <h3 className="cs-key-results-heading">Gap Identified</h3>
            <Reveal as="p" className="cs-body" delay={0.04}>
              <Bold text={cs.usability.gap} />
            </Reveal>
            <div className="cs-bf-gap-row">
              <Placeholder label="🔨 Existing gap — screenshot pending" />
              <Placeholder label="💡 Proposed solution — screenshot pending" />
            </div>
          </section>

          {/* ---------- Overall impact ---------- */}
          <section id="impact" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Overall Impact
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.04}>
              {cs.overallImpactNote}
            </Reveal>
            <div className="cs-overall-grid">
              {cs.overallImpact.map((s, i) => (
                <Reveal as="div" className="cs-overall-card" key={s.label} delay={i * 0.08}>
                  <div className="cs-overall-card__value-row">
                    <span className="cs-overall-card__value">{s.value}</span>
                    <span className={`cs-overall-card__trend cs-overall-card__trend--${s.trend}`}>↗</span>
                  </div>
                  <span className="cs-overall-card__label">{s.label}</span>
                  <p className="cs-overall-card__body"><Bold text={s.body} /></p>
                </Reveal>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub">User's Feedback</h3>
            <Placeholder label="5 real user-feedback screenshots — pending" />
          </section>

          {/* ---------- Reflection ---------- */}
          <section id="reflection" className="cs-section">
            <Reveal as="h2" className="cs-h2">
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
