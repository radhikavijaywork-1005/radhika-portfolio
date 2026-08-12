import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tripAssuranceCaseStudy as cs } from "../data/caseStudyTripAssurance";
import { work } from "../data/content";
import CaseStudyNav from "./CaseStudyNav";
import { useSoundContext } from "../context/SoundContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import trainmanLogo from "../assets/case-study/trip-assurance/trainman-logo.svg";
import heroHomepage from "../assets/case-study/trip-assurance/hero-homepage.png";
import heroSrp from "../assets/case-study/trip-assurance/hero-srp.png";
import heroBookingForm from "../assets/case-study/trip-assurance/hero-booking-form.png";
import spotlightPhase2 from "../assets/case-study/trip-assurance/spotlight-phase2.png";
import postTrackStatus from "../assets/case-study/trip-assurance/post-trackstatus.png";
import preBookingIterated from "../assets/case-study/trip-assurance/pre-booking-iterated.png";
import trackStatusFinal from "../assets/case-study/trip-assurance/track-status-final.png";
import problemNews from "../assets/case-study/trip-assurance/problem-news.png";
import researchPassenger from "../assets/case-study/trip-assurance/research-passenger.png";
import "./CaseStudyPaywall.css";
import "./CaseStudyTripAssurance.css";

const variantImages = { homepage: heroHomepage, srp: heroSrp, bookingForm: heroBookingForm };

const navSections = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
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

function Bold({ text }) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

function getNextCaseStudy() {
  const currentIndex = work.findIndex((w) => w.href === "/work/trip-assurance");
  for (let offset = 1; offset <= work.length; offset++) {
    const candidate = work[(currentIndex + offset) % work.length];
    if (candidate.href) return candidate;
  }
  return null;
}

export default function CaseStudyTripAssurance() {
  useDocumentTitle("Trip Assurance — Radhika Vijay");
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
    <main className="cs cs-trip">
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

          <Reveal as="div" className="cs-meta-row" delay={0.14}>
            {cs.meta.map((m) => (
              <div className="cs-meta" key={m.label}>
                <span className="cs-meta__label">{m.label}</span>
                <div className="cs-meta__value">
                  <span className="cs-meta__primary">{m.primary}</span>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal as="div" className="cs-hero-img-wrap cs-hero-img-wrap--single" delay={0.18}>
            <div className="cs-hero-phone">
              <img src={heroHomepage} alt="Trainman homepage introducing the Trip Assurance banner" />
            </div>
          </Reveal>
        </section>

        <CaseStudyNav sections={navSections} />

        <div className="cs-content">
          {/* ---------- Overview ---------- */}
          <section id="overview" className="cs-section">
            <Reveal as="h2" className="cs-h2">
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

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Overview of Trainman
            </Reveal>
            <Reveal as="div" className="cs-overview-brand" delay={0.04}>
              <img className="cs-overview-brand__logo" src={trainmanLogo} alt="" aria-hidden="true" />
              <span className="cs-overview-brand__tag">(wholly owned subsidiary of Adani Digital Labs)</span>
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
              Problem Identified
            </Reveal>

            <div className="cs-stat-row">
              {cs.problemStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                </Reveal>
              ))}
            </div>

            <Reveal as="div" className="cs-moodboard" delay={0.1}>
              <img className="cs-moodboard__img cs-moodboard__img--wide" src={problemNews} alt="News coverage on train ticket waitlisting in India" />
              <img className="cs-moodboard__img" src={researchPassenger} alt="A waitlisted passenger holding their train ticket on the platform" />
            </Reveal>

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Problems Statement
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.1}>
              <Bold text={cs.problemBody} />
            </Reveal>

            <Reveal as="div" className="cs-overview-facts cs-overview-facts--two" delay={0.08}>
              {cs.problemCards.map((c) => (
                <div className="cs-overview-fact" key={c.title}>
                  <span className="cs-overview-fact__icon">{c.icon}</span>
                  <h4 className="cs-overview-fact__title">{c.title}</h4>
                  <p className="cs-overview-fact__body">{c.body}</p>
                </div>
              ))}
            </Reveal>
          </section>

          {/* ---------- Research ---------- */}
          <section id="research" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Research &amp; Insights
            </Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.03}>
              a. Understanding WL Booking Flow
            </Reveal>
            <Reveal as="div" className="cs-flow-stepper" delay={0.05}>
              <div className="cs-flow-stepper__row">
                {cs.wlFlow.steps.map((step, i) => (
                  <div className="cs-flow-stepper__item" key={step}>
                    <span className="cs-flow-stepper__box">{step}</span>
                    {i < cs.wlFlow.steps.length - 1 && <span className="cs-flow-stepper__arrow" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
              <div className="cs-flow-stepper__groups">
                <span className="cs-flow-stepper__group">Pre payment Flow</span>
                <span className="cs-flow-stepper__group">Post payment Flow</span>
              </div>
            </Reveal>

            <h3 className="cs-h2 cs-h2--sub">WL Ticket Challenges</h3>
            <div className="cs-overview-facts">
              {cs.wlChallenges.map((c, i) => (
                <Reveal as="div" className="cs-overview-fact" key={c.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">{c.icon}</span>
                  <h4 className="cs-overview-fact__title">{c.title}</h4>
                  <p className="cs-overview-fact__body">{c.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              b. {cs.survey.label}
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>
              {cs.survey.body}
            </Reveal>

            <div className="cs-problem-quote-row">
              <div className="cs-flow-gif-wrap cs-survey-stats">
                {cs.survey.stats.map((s) => (
                  <div className="cs-stat" key={s.label}>
                    <span className="cs-stat__value">{s.value}</span>
                    <span className="cs-stat__label">{s.label}</span>
                  </div>
                ))}
              </div>
              <Reveal as="div" className="cs-quote-person-wrap" delay={0.1}>
                <blockquote className="cs-user-quote">
                  “{cs.survey.quote}”
                  <span className="cs-user-quote__tail" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </blockquote>
                <img className="cs-problem-quote-img" src={researchPassenger} alt="" aria-hidden="true" />
              </Reveal>
            </div>
            <p className="cs-caption" style={{ textAlign: "left" }}>
              {cs.survey.quoteName}, {cs.survey.quoteRole}
            </p>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              Insights
            </Reveal>
            <div className="cs-insight-grid">
              {cs.insights.map((ins, i) => (
                <Reveal as="div" className="cs-insight-card" key={ins.n} delay={i * 0.06}>
                  <span className="cs-insight-card__n">{ins.n}</span>
                  <h4 className="cs-insight-card__title">{ins.title}</h4>
                  <p className="cs-insight-card__body">{ins.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              c. {cs.competitors.label}
            </Reveal>
            {cs.competitors.intro.map((c) => (
              <p className="cs-body" key={c.name}>
                <strong>{c.name}: </strong>
                {c.body}
              </p>
            ))}

            <div className="cs-compare-table">
              <div className="cs-compare-table__row cs-compare-table__row--head">
                <span>Features</span>
                <span>Make My Trip</span>
                <span>Railofy</span>
                <span>Insights</span>
              </div>
              {cs.competitors.rows.map((r) => (
                <div className="cs-compare-table__row" key={r.feature}>
                  <span className="cs-compare-table__feature">{r.feature}</span>
                  <span>{r.mmt}</span>
                  <span>{r.railofy}</span>
                  <span className="cs-compare-table__insights">
                    <ul>
                      {r.insights.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </span>
                </div>
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
                  <h4 className="cs-insight-card__title">{o.n}. {o.title}</h4>
                  <p className="cs-insight-card__body"><strong>How might we</strong> {o.body}</p>
                  <span className="cs-hmw-tag">{o.tag}</span>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Stakeholder Collaboration &amp; Strategic Decisions
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>
              We held a stakeholder meeting with the Product, Business, Tech, and Marketing teams to discuss and align on the solution and the strategies required to move the project forward.
            </Reveal>
            <div className="cs-overview-facts cs-overview-facts--four">
              {cs.stakeholders.map((t, i) => (
                <Reveal as="div" className="cs-overview-fact" key={t.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">{t.icon}</span>
                  <h4 className="cs-overview-fact__title">{t.title}</h4>
                  <span className="cs-hmw-tag" style={{ marginBottom: 10 }}>{t.subtitle}</span>
                  <p className="cs-overview-fact__body"><Bold text={t.body} /></p>
                </Reveal>
              ))}
            </div>

            {cs.decisions.map((d) => (
              <div className="cs-phase" key={d.phase}>
                <Reveal as="div" className="cs-phase__tag" delay={0.02}>
                  <span className="cs-phase__tag-n">{d.phase}</span>
                  <span className="cs-phase__tag-label">
                    {d.phaseLabel} : {d.title}
                  </span>
                </Reveal>

                <Reveal as="p" className="cs-phase__hypothesis" delay={0.04}>
                  <span className="cs-phase__hyp-body">{d.pitch}</span>
                </Reveal>

                <div className="cs-goal-row">
                  <div className="cs-goal">
                    <span className="cs-goal__icon">🙋🏻‍♂️</span>
                    <div>
                      <span className="cs-goal__label">User Goal</span>
                      <p className="cs-goal__body">{d.userGoal}</p>
                    </div>
                  </div>
                  <div className="cs-goal">
                    <span className="cs-goal__icon">📈</span>
                    <div>
                      <span className="cs-goal__label">Business Goal</span>
                      <p className="cs-goal__body">{d.businessGoal}</p>
                    </div>
                  </div>
                </div>

                {d.platformMetrics && (
                  <>
                    <span className="cs-phase__how-label">Key Platform Metrics</span>
                    <div className="cs-stat-row">
                      {d.platformMetrics.map((m) => (
                        <div className="cs-stat" key={m.label}>
                          <span className="cs-stat__value">{m.value}</span>
                          <span className="cs-stat__label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {d.otherMetrics && (
                  <>
                    <span className="cs-phase__how-label">Other Metrics</span>
                    <div className="cs-stat-row cs-stat-row--tight">
                      {d.otherMetrics.map((m) => (
                        <div className="cs-stat" key={m.label}>
                          <span className="cs-stat__value cs-stat__value--sm">{m.value}</span>
                          <span className="cs-stat__label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {d.waitlistedTrends && (
                  <>
                    <span className="cs-phase__how-label">Waitlisted Ticket Trends</span>
                    <div className="cs-stat-row cs-stat-row--tight">
                      {d.waitlistedTrends.map((m) => (
                        <div className="cs-stat" key={m.label}>
                          <span className="cs-stat__value cs-stat__value--sm">{m.value}</span>
                          <span className="cs-stat__label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {d.userFlow && (
                  <>
                    <h3 className="cs-h2 cs-h2--sub">Designs &amp; Iterations</h3>
                    <span className="cs-phase__how-label">User Flow</span>
                    <Reveal as="p" className="cs-body" delay={0.06}>
                      <Bold text={d.userFlow.body} />
                    </Reveal>
                    <div className="cs-habit-loop">
                      <div className="cs-habit-loop__row">
                        {d.userFlow.steps.map((step, i) => (
                          <div className="cs-habit-loop__item" key={step.title}>
                            <div className="cs-habit-loop__box-wrap">
                              {step.loop && <span className="cs-habit-loop__label">{step.loop}</span>}
                              <span className="cs-habit-loop__box">{step.title}</span>
                              {step.tag && <span className="cs-habit-loop__tag">{step.tag}</span>}
                            </div>
                            {i < d.userFlow.steps.length - 1 && <span className="cs-habit-loop__arrow" aria-hidden="true">→</span>}
                          </div>
                        ))}
                      </div>
                      <div className="cs-habit-loop__branch">
                        <span className="cs-habit-loop__box cs-habit-loop__box--diamond">{d.userFlow.branch.decision}</span>
                        <span className="cs-habit-loop__box cs-habit-loop__box--diamond">{d.userFlow.branch.outcomes[0].title}</span>
                        <div className="cs-habit-loop__outcome">
                          {d.userFlow.branch.confirmed.map((s) => (
                            <span className="cs-habit-loop__box" key={s}>{s}</span>
                          ))}
                        </div>
                        <div className="cs-habit-loop__outcome">
                          {d.userFlow.branch.waitlisted.map((s) => (
                            <span className="cs-habit-loop__box" key={s}>{s}</span>
                          ))}
                        </div>
                        <span className="cs-habit-loop__label cs-habit-loop__label--reward">{d.userFlow.branch.reward}</span>
                      </div>
                    </div>
                  </>
                )}

                {d.variants && (
                  <>
                    <span className="cs-phase__how-label">Trip Assurance: Pre-booking flow · Initial concept</span>
                    <Reveal as="div" className="cs-phase1-card" delay={0.1}>
                      <div className="cs-variant-row cs-variant-row--scroll">
                        {d.variants.map((v) => (
                          <div className="cs-variant cs-variant--tall" key={v.label}>
                            <img src={variantImages[v.img]} alt={v.title} />
                            <span className="cs-variant__label">{v.label}</span>
                            <span className="cs-variant__title">{v.title}</span>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  </>
                )}

                {d.phase === "01" && (
                  <>
                    <span className="cs-phase__how-label">Trip Assurance: Post-booking flow · Initial concept</span>
                    <Reveal as="div" className="cs-spotlight" delay={0.08}>
                      <div className="cs-spotlight__text">
                        <span className="cs-spotlight__eyebrow">Post-booking flow</span>
                        <h3 className="cs-spotlight__title">Track Status</h3>
                        <p className="cs-spotlight__body">
                          A <strong>Track Status</strong> link on the PNR page lets users check next steps before chart preparation. If the ticket remains waitlisted, our CX team reaches out and shares the flight ticket directly.
                        </p>
                      </div>
                      <div className="cs-spotlight__img-wrap">
                        <img src={spotlightPhase2} alt="Trainman app screen showing a waitlisted ticket with a Contact Us prompt" />
                      </div>
                    </Reveal>
                    <Reveal as="div" className="cs-dashboard-img-wrap" delay={0.06}>
                      <img className="cs-dashboard-img" src={postTrackStatus} alt="Five states of the Trainman track-status screen: not prepared, confirmed, waitlisted, flight booked, and cancelled" />
                      <span className="cs-caption">Initial concept — happy flow</span>
                    </Reveal>
                  </>
                )}

                {d.usability && (
                  <>
                    <h3 className="cs-h2 cs-h2--sub">Usability Test — Key Results</h3>
                    <Reveal as="p" className="cs-body" delay={0.04}>
                      To ensure the Trip Assurance feature met user needs, we conducted usability testing to observe real user interactions and identify any pain points, and captured stakeholder feedback on the initial concept.
                    </Reveal>
                    <div className="cs-breakdown-list cs-breakdown-list--flat">
                      {d.usability.map((u) => (
                        <div className="cs-breakdown-item" key={u.n}>
                          <span className="cs-breakdown-item__n">{u.n}</span>
                          <div>
                            <h3 className="cs-breakdown-item__title">{u.title}</h3>
                            <p className="cs-breakdown-item__body">{u.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {d.iterations && (
                  <>
                    <h3 className="cs-h2 cs-h2--sub">After Multiple Iterations</h3>
                    <ol className="cs-tag-list cs-tag-list--wrap">
                      {d.iterations.map((item, i) => (
                        <li key={i}><Bold text={item} /></li>
                      ))}
                    </ol>
                    <Reveal as="div" className="cs-dashboard-img-wrap" delay={0.04}>
                      <img className="cs-dashboard-img" src={preBookingIterated} alt="Revised pre-booking screens: icon on train card, realistic flight costs, anchor pricing, and a new Track Status link" />
                      <span className="cs-caption">Trip Assurance: Pre-booking flow, after iteration</span>
                    </Reveal>
                    <Reveal as="div" className="cs-dashboard-img-wrap" delay={0.06}>
                      <img className="cs-dashboard-img" src={trackStatusFinal} alt="Final Track Status screens branching by whether the ticket confirms or stays waitlisted" />
                      <span className="cs-caption">Trip Assurance: Track Status, final version</span>
                    </Reveal>
                  </>
                )}

                {d.branches && (
                  <div className="cs-overview-facts cs-overview-facts--two">
                    {d.branches.map((b) => (
                      <div className="cs-overview-fact" key={b.title}>
                        <h4 className="cs-overview-fact__title">{b.title}</h4>
                        {b.role && <span className="cs-hmw-tag" style={{ marginBottom: 10 }}>{b.role}</span>}
                        <ul className="cs-branch-list">
                          {b.steps.map((s, i) => (
                            <li key={i}><Bold text={s} /></li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
                  <p className="cs-overall-card__body">{s.body}</p>
                </Reveal>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub">What Travellers Shared ❤️</h3>
            <div className="cs-quote-grid cs-quote-grid--row">
              {cs.testimonials.map((t) => (
                <div className="cs-quote-card" key={t.name}>
                  <p className="cs-quote-card__text">“{t.quote}”</p>
                  <span className="cs-quote-card__attr">
                    {t.name}, {t.route}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Reflection ---------- */}
          <section id="reflection" className="cs-section">
            <Reveal as="h2" className="cs-h2">
              Feedback Calls
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.04}>
              I collaborated with the CX team to gain first-hand insights post-launch, address user queries, and gather feedback.
            </Reveal>
            <ul className="cs-branch-list cs-branch-list--loose">
              {cs.feedbackInsights.map((item, i) => (
                <Reveal as="li" key={i} delay={i * 0.04}>
                  {item}
                </Reveal>
              ))}
            </ul>

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
              Future Scope &amp; Updates <span className="cs-h2__note">| 2024</span>
            </Reveal>
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
