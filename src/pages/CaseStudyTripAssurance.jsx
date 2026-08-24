import { useState, useRef, Fragment } from "react";
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
import happyFlowInitial from "../assets/case-study/trip-assurance/happy-flow-initial.gif";
import happyFlowFinal from "../assets/case-study/trip-assurance/happy-flow-final.gif";
import videoTestimonial1 from "../assets/case-study/trip-assurance/video-testimonial-1.gif";
import videoTestimonial2 from "../assets/case-study/trip-assurance/video-testimonial-2.gif";
import videoTestimonial3 from "../assets/case-study/trip-assurance/video-testimonial-3.gif";
import preBookingIterated from "../assets/case-study/trip-assurance/pre-booking-iterated.png";
import problemPortrait from "../assets/case-study/trip-assurance/problem-portrait.jpg";
import problemVideo from "../assets/case-study/trip-assurance/problem-video.jpg";
import problemArticle from "../assets/case-study/trip-assurance/problem-article.jpg";
import problemCrowd from "../assets/case-study/trip-assurance/problem-crowd.jpg";
import heroTripAssuranceOptin from "../assets/case-study/trip-assurance/hero-trip-assurance-optin.png";
import heroPnrDetails from "../assets/case-study/trip-assurance/hero-pnr-details.png";
import heroTrackStatus from "../assets/case-study/trip-assurance/hero-track-status.png";
import surveyFormTilted from "../assets/case-study/trip-assurance/survey-form-tilted.jpg";
import surveyPassengerGrid from "../assets/case-study/trip-assurance/survey-passenger-grid.png";
import surveyClipboard from "../assets/case-study/trip-assurance/survey-clipboard.jpg";
import competitorMmt1 from "../assets/case-study/trip-assurance/competitor-mmt-01-search-banner.png";
import competitorMmt2 from "../assets/case-study/trip-assurance/competitor-mmt-02-search-popup.png";
import competitorMmt3 from "../assets/case-study/trip-assurance/competitor-mmt-03-traveller-optin.png";
import competitorMmt4 from "../assets/case-study/trip-assurance/competitor-mmt-04-search-badge.png";
import competitorMmt5 from "../assets/case-study/trip-assurance/competitor-mmt-05-search-detail-badge.png";
import competitorMmt6 from "../assets/case-study/trip-assurance/competitor-mmt-06-booking-success.png";
import competitorMmt7 from "../assets/case-study/trip-assurance/competitor-mmt-07-upgrade-banner.png";
import competitorRailofy1 from "../assets/case-study/trip-assurance/competitor-railofy-01-book-train-banner.png";
import competitorRailofy2 from "../assets/case-study/trip-assurance/competitor-railofy-02-confirm-guarantee.png";
import competitorRailofy3 from "../assets/case-study/trip-assurance/competitor-railofy-03-home.png";
import competitorRailofy4 from "../assets/case-study/trip-assurance/competitor-railofy-04-srp-info.png";
import competitorRailofy5 from "../assets/case-study/trip-assurance/competitor-railofy-05-class-card-tag.png";
import logoRailyatri from "../assets/case-study/trip-assurance/logos/railyatri.svg";
import logoIxigo from "../assets/case-study/trip-assurance/logos/ixigo.svg";
import logoConfirmtkt from "../assets/case-study/trip-assurance/logos/confirmtkt.svg";
import logoMakeMyTrip from "../assets/case-study/trip-assurance/logos/makemytrip.svg";
import logoMakeMyTripIcon from "../assets/case-study/trip-assurance/logos/makemytrip-icon.svg";
import logoRailofy from "../assets/case-study/trip-assurance/logos/railofy.svg";
import avatarProduct from "../assets/case-study/trip-assurance/avatar-product.svg";
import avatarBusiness from "../assets/case-study/trip-assurance/avatar-business.svg";
import avatarTech from "../assets/case-study/trip-assurance/avatar-tech.svg";
import avatarMarketing from "../assets/case-study/trip-assurance/avatar-marketing.svg";
import feedbackCall1 from "../assets/case-study/trip-assurance/feedback-call-1.jpg";
import solution1Sketches from "../assets/case-study/trip-assurance/solution1-sketches.jpg";
import solution1Whiteboard from "../assets/case-study/trip-assurance/solution1-whiteboard.jpg";
import solution1Team from "../assets/case-study/trip-assurance/solution1-team.jpg";
import usabilityTeamPhoto from "../assets/case-study/trip-assurance/usability-team-photo.png";
import usabilityParticipantPhoto from "../assets/case-study/trip-assurance/usability-participant-photo.png";
import keyResult01 from "../assets/case-study/trip-assurance/key-result-01-srp-tag.png";
import keyResult0203 from "../assets/case-study/trip-assurance/key-result-02-03-optin-sheet.png";
import keyResult04 from "../assets/case-study/trip-assurance/key-result-04-track-status.png";
import futureScopeMockup from "../assets/case-study/trip-assurance/future-scope-mockup.jpg";
import "./CaseStudyPaywall.css";
import "./CaseStudyTripAssurance.css";

const variantImages = { homepage: heroHomepage, srp: heroSrp, bookingForm: heroBookingForm };

const stakeholderAvatars = [avatarProduct, avatarBusiness, avatarTech, avatarMarketing];

const videoTestimonials = [videoTestimonial1, videoTestimonial2, videoTestimonial3];

// Figma groups the 4 Key Results items against 3 screenshots: 01 gets its
// own screen, 02+03 share one (both stem from the same opt-in bottom
// sheet), 04 gets its own — a bracket spans the shared group.
const keyResultGroups = [
  { items: ["01"], img: keyResult01 },
  { items: ["02", "03"], img: keyResult0203 },
  { items: ["04"], img: keyResult04 },
];

const competitorMmtShots = [
  { src: competitorMmt2, caption: "Feature visibility on homepage" },
  { src: competitorMmt1, caption: "Feature information on SRP" },
  { src: competitorMmt7, caption: "Repeated upgrade prompt on search results" },
  { src: competitorMmt4, caption: "Feature tag on class card" },
  { src: competitorMmt5, caption: "Feature tag on class card with prediction percentage" },
  { src: competitorMmt3, caption: "Feature opt in card on detail page" },
  { src: competitorMmt6, caption: "No mention of Trip Guarantee on booking confirmation" },
];

const competitorRailofyShots = [
  { src: competitorRailofy3, caption: "Feature visibility on app homepage" },
  { src: competitorRailofy1, caption: "Feature visibility on train homepage" },
  { src: competitorRailofy4, caption: "Feature information on SRP" },
  { src: competitorRailofy5, caption: "Feature tag on class card" },
  { src: competitorRailofy2, caption: "Feature opt in card on detail page" },
];

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

// One real SVG arrow, rotated per direction, instead of Unicode glyphs
// (→ ↓ ←) — those render at inconsistent weights/styles depending on the
// font's per-glyph coverage, so the WL flow diagram's arrows didn't
// actually match each other despite sharing a font-size.
function FlowArrow({ direction = "right", className = "" }) {
  const rotation = { right: 0, down: 90, left: 180 }[direction];
  return (
    <svg
      className={`cs-flow-stepper__arrow-svg ${className}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path d="M2 8H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 4L13.5 8L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ percent }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;
  return (
    <svg className="cs-donut" width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={radius} fill="none" stroke="#f5c518" strokeWidth="10" />
      <circle
        cx="55"
        cy="55"
        r={radius}
        fill="none"
        stroke="var(--maroon)"
        strokeWidth="10"
        strokeDasharray={`${filled} ${circumference}`}
        transform="rotate(-90 55 55)"
      />
    </svg>
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
  const mmtDrag = useDragScroll();
  const railofyDrag = useDragScroll();
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
                  <span className="cs-meta__detail">{m.detail}</span>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal as="div" className="cs-hero-img-wrap" delay={0.18}>
            <div className="cs-hero-phone">
              <img src={heroTripAssuranceOptin} alt="Trip Assurance opt-in screen on the booking form" />
            </div>
            <div className="cs-hero-phone">
              <img src={heroPnrDetails} alt="PNR details screen showing a confirmed, Trip Assurance-backed booking" />
            </div>
            <div className="cs-hero-phone">
              <img src={heroTrackStatus} alt="Track Status screen showing the Trip Assurance flight ticket booked" />
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

            <Reveal as="div" className="cs-problem-strip" delay={0.1}>
              <div className="cs-problem-strip__track">
                {[0, 1].map((rep) => (
                  <div className="cs-problem-strip__group" key={rep} aria-hidden={rep > 0}>
                    <img className="cs-problem-strip__img cs-problem-strip__img--narrow" src={problemPortrait} alt="A waitlisted passenger holding their train ticket on the platform" />
                    <img className="cs-problem-strip__img cs-problem-strip__img--wide" src={problemVideo} alt="News video coverage of overcrowded trains during a festive rush" />
                    <img className="cs-problem-strip__img" src={problemArticle} alt="News article: 2.70 crore passengers denied train travel in FY 2022-23, per RTI" />
                    <img className="cs-problem-strip__img" src={problemCrowd} alt="Passengers crowding onto a departing train" />
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal as="h2" className="cs-h2" delay={0.05}>
              Problems Statement
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.1}>
              <Bold text={cs.problemBody} />
            </Reveal>

            <Reveal as="div" className="cs-overview-facts cs-overview-facts--two cs-overview-facts--problem" delay={0.08}>
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
              {/* Serpentine layout: row 1 reads left-to-right through the
                  pre-payment steps, a down arrow drops from the last box
                  into row 2 directly below it, then row 2 reads right-to-
                  left back through "Make payment" and the post-payment
                  steps — so the two rows connect as one continuous path
                  instead of two independent left-to-right lines. Both rows
                  share one grid (not one grid each) so their columns are
                  guaranteed to line up — the down arrow and both brackets
                  all key off those same shared column tracks. */}
              {(() => {
                const preSteps = cs.wlFlow.steps.slice(0, cs.wlFlow.prePaymentEnd);
                const postSteps = [...cs.wlFlow.steps.slice(cs.wlFlow.prePaymentEnd)].reverse();
                return (
                  <div className="cs-flow-stepper__row">
                    <span
                      className="cs-flow-stepper__bracket cs-flow-stepper__bracket--above"
                      style={{ gridRow: 1, gridColumn: `1 / ${2 * preSteps.length}` }}
                    >
                      <span className="cs-flow-stepper__bracket-line" aria-hidden="true" />
                      <span className="cs-flow-stepper__bracket-label">Pre payment Flow</span>
                    </span>

                    {preSteps.map((step, i) => (
                      <Fragment key={step}>
                        <span className="cs-flow-stepper__box" style={{ gridRow: 2, gridColumn: 2 * i + 1 }}>
                          {step}
                        </span>
                        {i < preSteps.length - 1 && (
                          <span className="cs-flow-stepper__arrow" style={{ gridRow: 2, gridColumn: 2 * i + 2 }}>
                            <FlowArrow direction="right" />
                          </span>
                        )}
                      </Fragment>
                    ))}

                    <span
                      className="cs-flow-stepper__connector"
                      style={{ gridRow: 3, gridColumn: 2 * (preSteps.length - 1) + 1 }}
                    >
                      <FlowArrow direction="down" />
                    </span>

                    {postSteps.map((step, i) => (
                      <Fragment key={step}>
                        <span className="cs-flow-stepper__box" style={{ gridRow: 4, gridColumn: 2 * i + 1 }}>
                          {step}
                        </span>
                        {i < postSteps.length - 1 && (
                          <span className="cs-flow-stepper__arrow" style={{ gridRow: 4, gridColumn: 2 * i + 2 }}>
                            <FlowArrow direction="left" />
                          </span>
                        )}
                      </Fragment>
                    ))}

                    <span
                      className="cs-flow-stepper__bracket cs-flow-stepper__bracket--below"
                      style={{ gridRow: 5, gridColumn: `1 / ${2 * (postSteps.length - 1)}` }}
                    >
                      <span className="cs-flow-stepper__bracket-line" aria-hidden="true" />
                      <span className="cs-flow-stepper__bracket-label">Post payment Flow</span>
                    </span>
                  </div>
                );
              })()}
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
              {(() => {
                const [before, after] = cs.survey.body.split("train journey");
                return (
                  <>
                    {before}
                    <a
                      className="cs-inline-link"
                      href="https://medium.com/@radhikavijaywork/ux-research-insights-documenting-a-train-journey-experience-9494a0da4136"
                      target="_blank"
                      rel="noreferrer"
                    >
                      train journey
                    </a>
                    {after}
                  </>
                );
              })()}
            </Reveal>

            <div className="cs-stat-row cs-stat-row--survey">
              {cs.survey.stats.map((s) => (
                <div className="cs-stat" key={s.label}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                </div>
              ))}
            </div>

            <Reveal as="div" className="cs-survey-strip" delay={0.1}>
              <img
                className="cs-survey-strip__img cs-survey-strip__img--form"
                src={surveyFormTilted}
                alt="Screenshots of the train ticket booking survey form"
              />
              <img
                className="cs-survey-strip__img cs-survey-strip__img--grid"
                src={surveyPassengerGrid}
                alt="Four train passengers interviewed for the survey"
              />
              <div className="cs-survey-strip__quote">
                <blockquote className="cs-survey-strip__quote-text">“{cs.survey.quote}”</blockquote>
                <p className="cs-survey-strip__quote-attr">
                  {cs.survey.quoteName}
                  <span>{cs.survey.quoteRole}</span>
                </p>
              </div>
              <img
                className="cs-survey-strip__img cs-survey-strip__img--clipboard"
                src={surveyClipboard}
                alt="Printed survey form on a clipboard, held up at a train station"
              />
            </Reveal>

            <Reveal as="h3" className="cs-h2 cs-h2--sub" delay={0.05}>
              Insights
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
              c. {cs.competitors.label}
            </Reveal>

            <Reveal as="div" className="cs-competitor-logos" delay={0.06}>
              <div className="cs-competitor-logos__group">
                <div className="cs-competitor-logos__row">
                  <img className="cs-competitor-logos__icon" src={logoRailyatri} alt="Railyatri" />
                  <img className="cs-competitor-logos__icon" src={logoIxigo} alt="ixigo" />
                  <img className="cs-competitor-logos__icon cs-competitor-logos__icon--stroke" src={logoConfirmtkt} alt="Confirmtkt" />
                </div>
                <div className="cs-flow-stepper__bracket cs-flow-stepper__bracket--below">
                  <span className="cs-flow-stepper__bracket-line" aria-hidden="true" />
                  <span className="cs-flow-stepper__bracket-label">
                    Prediction Model but No Trip Guarantee Feature
                  </span>
                </div>
              </div>
              <div className="cs-competitor-logos__group">
                <div className="cs-competitor-logos__row">
                  <img className="cs-competitor-logos__icon cs-competitor-logos__icon--stroke" src={logoMakeMyTrip} alt="Make My Trip" />
                  <img className="cs-competitor-logos__icon" src={logoRailofy} alt="Railofy" />
                </div>
                <div className="cs-flow-stepper__bracket cs-flow-stepper__bracket--below">
                  <span className="cs-flow-stepper__bracket-line" aria-hidden="true" />
                  <span className="cs-flow-stepper__bracket-label">Trip Guarantee Feature</span>
                </div>
              </div>
            </Reveal>

            <div className="cs-competitor-intro">
              <img className="cs-competitor-intro__logo" src={logoMakeMyTripIcon} alt="" aria-hidden="true" />
              <h4 className="cs-competitor-intro__name">{cs.competitors.intro[0].name}</h4>
            </div>
            <p className="cs-body">{cs.competitors.intro[0].body}</p>
            <Reveal as="div" className="cs-phase1-card" delay={0.08}>
              <div
                className="cs-variant-row cs-variant-row--scroll"
                ref={mmtDrag.ref}
                onMouseDown={mmtDrag.onMouseDown}
                onMouseMove={mmtDrag.onMouseMove}
                onMouseUp={mmtDrag.onMouseUp}
                onMouseLeave={mmtDrag.onMouseLeave}
              >
                {competitorMmtShots.map((shot) => (
                  <div className="cs-variant" key={shot.caption}>
                    <img src={shot.src} alt={shot.caption} />
                    <span className="cs-variant__title">{shot.caption}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="cs-competitor-intro">
              <img className="cs-competitor-intro__logo" src={logoRailofy} alt="" aria-hidden="true" />
              <h4 className="cs-competitor-intro__name">{cs.competitors.intro[1].name}</h4>
            </div>
            <p className="cs-body">{cs.competitors.intro[1].body}</p>
            <Reveal as="div" className="cs-phase1-card" delay={0.08}>
              <div
                className="cs-variant-row cs-variant-row--scroll"
                ref={railofyDrag.ref}
                onMouseDown={railofyDrag.onMouseDown}
                onMouseMove={railofyDrag.onMouseMove}
                onMouseUp={railofyDrag.onMouseUp}
                onMouseLeave={railofyDrag.onMouseLeave}
              >
                {competitorRailofyShots.map((shot) => (
                  <div className="cs-variant" key={shot.caption}>
                    <img src={shot.src} alt={shot.caption} />
                    <span className="cs-variant__title">{shot.caption}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <h3 className="cs-h2 cs-h2--sub">Insights</h3>
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
                <Reveal
                  as="div"
                  className={`cs-insight-card${o.n === "3" ? " cs-insight-card--out-of-scope" : ""}`}
                  key={o.n}
                  delay={i * 0.06}
                >
                  <span className="cs-overview-fact__icon">{o.icon}</span>
                  <h4 className="cs-insight-card__title cs-insight-card__title--lg">{o.n}. {o.title}</h4>
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
            <div className="cs-stakeholder-grid">
              {cs.stakeholders.map((t, i) => (
                <Reveal as="div" className="cs-stakeholder-card" key={t.title} delay={i * 0.05}>
                  <img className="cs-stakeholder-card__avatar" src={stakeholderAvatars[i]} alt="" aria-hidden="true" />
                  <h4 className="cs-stakeholder-card__title">{t.title}</h4>
                  <span className="cs-stakeholder-card__rule" aria-hidden="true" />
                  <h5 className="cs-stakeholder-card__subtitle">{t.subtitle}</h5>
                  <p className="cs-stakeholder-card__body"><Bold text={t.body} /></p>
                </Reveal>
              ))}
            </div>

            {cs.decisions.map((d) => (
              <div className="cs-phase" key={d.phase}>
                <Reveal as="div" className="cs-solution-eyebrow" delay={0.02}>
                  <span className="cs-solution-eyebrow__n">{d.phase === "01" ? "1" : "2"}. Solution</span>
                  <span className="cs-solution-eyebrow__dot">·</span>
                  <span className="cs-solution-eyebrow__title">{d.title}</span>
                </Reveal>

                <Reveal as="h3" className="cs-solution-name" delay={0.03}>
                  {d.solutionName}
                </Reveal>
                <Reveal as="p" className="cs-phase__hypothesis" delay={0.04}>
                  {d.pitch}
                </Reveal>

                <div className="cs-goal-row">
                  <div className="cs-goal">
                    <span className="cs-goal__icon">🙋🏻‍♂️</span>
                    <div>
                      <span className="cs-goal__label">User Goal:</span>
                      <p className="cs-goal__body"><Bold text={d.userGoal} /></p>
                    </div>
                  </div>
                  <div className="cs-goal">
                    <span className="cs-goal__icon">📈</span>
                    <div>
                      <span className="cs-goal__label">Business Goal:</span>
                      <p className="cs-goal__body"><Bold text={d.businessGoal} /></p>
                    </div>
                  </div>
                </div>

                {d.phase === "01" && (
                  <Reveal as="div" className="cs-solution1-photos" delay={0.06}>
                    <img src={solution1Sketches} alt="Marker pens and paper wireframe sketches of the Trip Assurance flow" />
                    <img src={solution1Whiteboard} alt="Sketching the Trip Assurance user flow on a whiteboard" />
                    <img src={solution1Team} alt="Team reviewing the Trip Assurance flow together" />
                  </Reveal>
                )}

                {d.platformMetrics && (
                  <div className="cs-metrics-block cs-metrics-block--platform">
                    <span className="cs-phase__how-label cs-phase__how-label--metric">Key Platform Metrics 📊</span>
                    <div className="cs-stat-row cs-stat-row--platform">
                      {d.platformMetrics.map((m) => (
                        <div className="cs-stat" key={m.label}>
                          <span className="cs-stat__value">{m.value}</span>
                          <span className="cs-stat__label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {d.otherMetrics && (
                  <div className="cs-metrics-block cs-metrics-block--other">
                    <span className="cs-phase__how-label cs-phase__how-label--metric">Other Metrics</span>
                    <div className="cs-metrics-band">
                      <div className="cs-stat-row cs-stat-row--tight cs-stat-row--other">
                        {d.otherMetrics.map((m, i) => (
                          <div className={`cs-stat${i === 0 ? "" : " cs-stat--divided"}`} key={m.label}>
                            <span className="cs-stat__value cs-stat__value--sm">{m.value}</span>
                            <span className="cs-stat__label">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {d.waitlistedTrends && (
                  <div className="cs-metrics-block cs-metrics-block--waitlisted">
                    <span className="cs-phase__how-label cs-phase__how-label--metric">Waitlisted Ticket Trends</span>
                    <div className="cs-donut-grid">
                      {d.waitlistedTrends.map((m) => (
                        <Reveal as="div" className="cs-donut-card" key={m.label} delay={0.04}>
                          <div className="cs-donut-card__chart">
                            <DonutChart percent={parseFloat(m.value)} />
                            <span className="cs-donut-card__connector" aria-hidden="true">
                              <span className="cs-donut-card__connector-line" />
                              <span className="cs-donut-card__connector-dot" />
                            </span>
                            <div className="cs-donut-card__figures">
                              <span className="cs-donut-card__value">{m.value}</span>
                              <span className="cs-donut-card__label">{m.label}</span>
                            </div>
                          </div>
                          <p className="cs-donut-card__desc">{m.desc}</p>
                        </Reveal>
                      ))}
                    </div>
                    <div className="cs-dashed-divider" aria-hidden="true" />
                  </div>
                )}

                {d.userFlow && (
                  <>
                    <h3 className="cs-h2 cs-h2--sub cs-h2--designs-iterations">Designs &amp; Iterations</h3>
                    <span className="cs-phase__how-label cs-phase__how-label--metric cs-userflow-label">User Flow</span>
                    <Reveal as="p" className="cs-body cs-userflow-body" delay={0.06}>
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
                    <Reveal as="div" className="cs-dashboard-img-wrap cs-dashboard-img-wrap--phone" delay={0.06}>
                      <img className="cs-dashboard-img cs-dashboard-img--phone" src={happyFlowInitial} alt="Animated walkthrough of the Trip Assurance happy flow, from booking to confirmed track status" />
                      <span className="cs-caption">Initial concept — happy flow</span>
                    </Reveal>
                  </>
                )}

                {d.usability && (
                  <>
                    <h3 className="cs-h2 cs-h2--sub">Usability Test</h3>
                    <div className="cs-usability-row">
                      <Reveal as="p" className="cs-body cs-usability-row__text" delay={0.04}>
                        To ensure the Trip Assurance feature met user needs, we conducted usability testing to observe real user interactions and identify any pain points, and captured stakeholder feedback on the initial concept.
                      </Reveal>
                      <Reveal as="div" className="cs-usability-row__media" delay={0.06}>
                        <img src={usabilityTeamPhoto} alt="Team reviewing usability testing feedback together" />
                        <img src={usabilityParticipantPhoto} alt="Usability testing session with a participant" />
                      </Reveal>
                    </div>

                    <h3 className="cs-h2 cs-h2--sub">Key Results</h3>
                    <div className="cs-key-results">
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
                      <div className="cs-key-results__media">
                        {keyResultGroups.map((g) => (
                          <Reveal as="div" className="cs-key-results__group" key={g.items.join("")} delay={0.04}>
                            <span className="cs-key-results__bracket" aria-hidden="true">
                              {g.items.join(" · ")}
                            </span>
                            <img src={g.img} alt={`Screenshot for key result ${g.items.join(" & ")}`} />
                          </Reveal>
                        ))}
                      </div>
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
                    <Reveal as="div" className="cs-dashboard-img-wrap cs-dashboard-img-wrap--phone" delay={0.06}>
                      <img className="cs-dashboard-img cs-dashboard-img--phone" src={happyFlowFinal} alt="Animated walkthrough of the final Track Status happy flow" />
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

                {d.phase === "02" && (
                  <div className="cs-media-placeholder">
                    <span>📷 Photo: CX team on the manual pre-booking calls (asset pending)</span>
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
            <div className="cs-overall-grid cs-overall-grid--light">
              {cs.overallImpact.map((s, i) => (
                <Reveal as="div" className="cs-overall-card cs-overall-card--light" key={s.label} delay={i * 0.08}>
                  <div className="cs-overall-card__value-row">
                    <span className="cs-overall-card__value">{s.value}</span>
                    <span className={`cs-overall-card__trend cs-overall-card__trend--${s.trend}`}>↗</span>
                  </div>
                  <span className="cs-overall-card__label">{s.label}</span>
                  <p className="cs-overall-card__body">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- User's impact ---------- */}
          <section className="cs-section">
            <Reveal as="h2" className="cs-h2">
              User&rsquo;s Impact
            </Reveal>

            <div className="cs-video-testimonials">
              {cs.videoTestimonials.map((t, i) => (
                <Reveal as="div" className="cs-video-testimonial" key={t.name} delay={i * 0.06}>
                  <img src={videoTestimonials[i]} alt={`Video testimonial from ${t.name}`} />
                  <span className="cs-video-testimonial__name">{t.name}</span>
                  <span className="cs-video-testimonial__route">{t.route}</span>
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
            <div className="cs-feedback-calls">
              <div className="cs-feedback-calls__text">
                <h3 className="cs-h2 cs-h2--sub">Key Insights</h3>
                <ul className="cs-pointer-list">
                  {cs.feedbackInsights.map((item, i) => (
                    <Reveal as="li" key={i} delay={i * 0.04}>
                      <span className="cs-pointer-list__mark" aria-hidden="true">👉🏻</span>
                      {item}
                    </Reveal>
                  ))}
                </ul>
              </div>
              <Reveal as="div" className="cs-feedback-calls__media" delay={0.06}>
                <img src={feedbackCall1} alt="CX team members on calls with travellers, laptops open" />
              </Reveal>
            </div>

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
            <div className="cs-future-live-wrap">
              <ul className="cs-future-list">
                {cs.futureScope.map((item, i) => (
                  <Reveal as="li" className="cs-future-list__item" key={item.text} delay={i * 0.04}>
                    <span className="cs-future-list__icon">{item.icon}</span>
                    <span>
                      <Bold text={item.text} />
                    </span>
                  </Reveal>
                ))}
              </ul>
              <div className="cs-future-img-wrap">
                <img className="cs-future-img" src={futureScopeMockup} alt="A hand holding an iPhone showing the Trip Assurance Track Status screen during a flight" />
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
