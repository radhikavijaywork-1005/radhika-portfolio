import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { bookingFailuresCaseStudy as cs } from "../data/caseStudyBookingFailures";
import { work } from "../data/content";
import CaseStudyNav from "./CaseStudyNav";
import { useSoundContext } from "../context/SoundContext";
import { useTheme } from "../context/ThemeContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import trainmanLogo from "../assets/case-study/trip-assurance/trainman-logo.svg";
import heroPhone1 from "../assets/case-study/booking-failures/hero-1.png";
import heroPhone2 from "../assets/case-study/booking-failures/hero-2.png";
import heroPhone3 from "../assets/case-study/booking-failures/hero-3.png";
import existingFlowGif from "../assets/case-study/booking-failures/existing-flow.gif";
import irctcLogo from "../assets/case-study/booking-failures/irctc-logo.svg";
import breakdownExistingFlow from "../assets/case-study/booking-failures/breakdown-existing-flow.png";
import breakdownExistingFlowDark from "../assets/case-study/booking-failures/breakdown-existing-flow-dark.png";
import solution1BookingForm from "../assets/case-study/booking-failures/solution1-booking-form.png";
import solution1ResetPassword from "../assets/case-study/booking-failures/solution1-reset-password.png";
import solution1TransitionPage from "../assets/case-study/booking-failures/solution1-transition-page.png";
import usabilityPhoto1 from "../assets/case-study/booking-failures/usability-photo-1.jpg";
import usabilityPhoto2 from "../assets/case-study/booking-failures/usability-photo-2.jpg";
import gapExisting from "../assets/case-study/booking-failures/gap-existing.png";
import gapProposed from "../assets/case-study/booking-failures/gap-proposed.png";
import strategyPhoto1 from "../assets/case-study/booking-failures/strategy-photo-1.jpg";
import strategyPhoto2 from "../assets/case-study/booking-failures/strategy-photo-2.jpg";
import strategyPhoto3 from "../assets/case-study/booking-failures/strategy-photo-3.jpg";
import happyFlowGif from "../assets/case-study/booking-failures/happy-flow.gif";
import happyFlowSol2Gif from "../assets/case-study/booking-failures/happy-flow-sol2.gif";
import happyFlowSol3Gif from "../assets/case-study/booking-failures/happy-flow-sol3.gif";
import pendingConversionPendingPage from "../assets/case-study/booking-failures/pending-conversion-pending-page.png";
import pendingConversionNeedHelp from "../assets/case-study/booking-failures/pending-conversion-need-help.png";
import pendingConversionFaq from "../assets/case-study/booking-failures/pending-conversion-faq.png";
import pendingConversionTimeout from "../assets/case-study/booking-failures/pending-conversion-timeout.png";
import simplifyCrisCpage from "../assets/case-study/booking-failures/simplify-irctc-cris-page.png";
import simplifyPasswordVisible from "../assets/case-study/booking-failures/simplify-irctc-password-visible.png";
import simplifyPasswordToggle from "../assets/case-study/booking-failures/simplify-irctc-password-toggle.png";
import simplifyCtaActive from "../assets/case-study/booking-failures/simplify-irctc-cta-active.png";
import simplifyNeedHelpSheet from "../assets/case-study/booking-failures/simplify-need-help-sheet.png";
import simplifyResetPassword from "../assets/case-study/booking-failures/simplify-reset-password.png";
import simplifyChangeIrctcId from "../assets/case-study/booking-failures/simplify-change-irctc-id.png";
import simplifyCancelBooking from "../assets/case-study/booking-failures/simplify-cancel-booking.png";
import pendingRetryBookingSheet from "../assets/case-study/booking-failures/pending-retry-booking-sheet.png";
import pendingNoAvailability from "../assets/case-study/booking-failures/pending-no-availability.png";
import pendingCancelRefund from "../assets/case-study/booking-failures/pending-cancel-refund.png";
import pendingRefundInitiated from "../assets/case-study/booking-failures/pending-refund-initiated.png";
import pendingRefundProcessed from "../assets/case-study/booking-failures/pending-refund-processed.png";
import pendingNoResponseIrctc from "../assets/case-study/booking-failures/pending-no-response-irctc.png";
import pending30MinsTimeout from "../assets/case-study/booking-failures/pending-30mins-timeout.png";
import pendingHomepage10Min from "../assets/case-study/booking-failures/pending-homepage-10min.png";
import pendingHomepage30Min from "../assets/case-study/booking-failures/pending-homepage-30min.png";
import pendingHomepage30MinTimeout from "../assets/case-study/booking-failures/pending-homepage-30min-timeout.png";
import annotationHighlight from "../assets/case-study/booking-failures/annotation-highlight.svg";
import annotationLine from "../assets/case-study/booking-failures/annotation-line.svg";
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

// One real SVG arrow, rotated per direction, instead of Unicode glyphs —
// those render at inconsistent weights/styles depending on font coverage.
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

// Collapsible wrapper for the "extra screens" scroll rows below each
// solution's main annotated flow — closed by default so the page doesn't
// front-load every variant/edge-case screen at once.
function DesignVariantsToggle({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cs-bf-variants-toggle">
      <button
        type="button"
        className={`cs-bf-variants-toggle__trigger${open ? " cs-bf-variants-toggle__trigger--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>Check design variants and edge cases</span>
        <svg
          className="cs-bf-variants-toggle__icon"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="cs-bf-variants-toggle__content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Vertical position (% of the "Pending page" screenshot's height) of each
// of the first 7 Pending Conversion iteration points, in the order they
// appear top-to-bottom in the real screen: Booking ID, steps, supporting
// text, primary CTA, secondary CTA, Need Help, FAQ.
const pendingConversionAnnotationTops = [9, 26, 42, 53, 58, 67, 77];

// Vertical position (% of the "IRCTC credential" screenshot's height) of each
// of the 5 Simplify IRCTC Credential iteration points, matching design positions.
const simplifyCrisisAnnotationTops = [16, 56, 73, 80, 91];

// Fixed render height (px) of the annotated phone frame — matches
// .cs-bf-happy-flow__gif's own sizing (210px wide, 230:498 aspect ratio).
const ANNOTATED_PHONE_HEIGHT = 455;
const ANNOTATED_CONNECTOR_WIDTH = 40;

// Annotated-screenshot layout: phone on left with dots, connector arrows, labels on right.
function AnnotatedFlowRow({ annotatedSrc, annotatedAlt, annotations, caption, screens }) {
  return (
    <div className="cs-bf-annotated-row">
      {/* Annotated screen section at top */}
      <div className="cs-bf-annotated-row__top">
        <div className="cs-bf-annotated-row__phone-wrap">
          <span className="cs-bf-annotated-row__corner" aria-hidden="true" />
          <div className="cs-bf-happy-flow__gif cs-bf-annotated-row__phone">
            <img src={annotatedSrc} alt={annotatedAlt} />
            {annotations.map((a, i) => (
              <span key={i} className="cs-bf-annotated-row__dot" style={{ top: `${a.top}%` }} />
            ))}
          </div>
          <p className="cs-bf-annotated-row__caption">{caption}</p>
        </div>

        {/* Connector lines spacing element */}
        <div className="cs-bf-annotated-row__connectors" />

        <div className="cs-bf-annotated-row__labels">
          {annotations.map((a, i) => (
            <div key={i} className="cs-bf-annotated-row__label" style={{ top: `${a.top}%`, marginTop: a.offsetY ? `${a.offsetY}px` : undefined }}>
              <img src={annotationLine} alt="" className="cs-bf-annotated-row__annotation-line" aria-hidden="true" />
              <p><Bold text={a.text} /></p>
            </div>
          ))}
        </div>
      </div>

      {/* Three plain screens: first aligned with top, remaining two to the right */}
      {screens.length > 0 && (
        <div className="cs-bf-annotated-row__bottom">
          <div className="cs-bf-annotated-row__phone-wrap">
            <div className="cs-bf-happy-flow__gif cs-bf-annotated-row__phone">
              <img src={screens[0].src} alt={screens[0].alt} />
            </div>
            <p className="cs-bf-annotated-row__caption">{screens[0].caption}</p>
          </div>

          {/* Spacing element to match top row structure */}
          <div className="cs-bf-annotated-row__connectors" />

          {/* Remaining two screens in a grid */}
          <div className="cs-bf-annotated-row__bottom-screens">
            {screens.slice(1).map((s, i) => (
              <div className="cs-bf-annotated-row__phone-wrap" key={i}>
                <div className="cs-bf-happy-flow__gif cs-bf-annotated-row__phone">
                  <img src={s.src} alt={s.alt} />
                </div>
                <p className="cs-bf-annotated-row__caption">{s.caption}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const feedbackAvatars = ["🙍🏻‍♂️", "🙍🏻‍♀️", "🙎🏻‍♂️", "🙎🏻‍♀️", "🧑🏻", "👩🏻", "👨🏻"];

// Real Play Store reviews (Trainman app), transcribed from the screenshots
// gathered during research — trimmed of the device/app-version metadata line
// so they read as compact quote cards instead of full review-console captures.
const playStoreReviews = [
  { name: "Deepa Mangeshikar", rating: 5, body: "Everytime I have booked my train tickets on this app... it's been a smooth, seamless experience between Trainman & IRCTC. Cancellation has been possible with just one click and the refund also has been prompt!! Loving this App." },
  { name: "Aakib Qureshi", rating: 5, body: "Ease of doing the bookings for trains. Layout is simple and nice. Using for the first time and satisfied. Couldn't make IRCTC id on another application, but this was very very easy. Such applications should be easy so people can use them efficiently. Nice. Thanks." },
  { name: "Joseph Daniel H", rating: 5, body: "Money refunded is good, if booking failed. Train ticket is not booking, I think the error is with IRCTC. This app is good for checking availablity of train and train routes." },
  { name: "Vasuthuglife Life", rating: 5, body: "I have booked a ticket but failed to give correct IRCTC credentials. My fare has been debited from my account. But they hold the ticket for half an hour and give me the option to put correct credentials. I have successfully done it within half an hour. Service was awesome. Thanks trainman for such a great service." },
  { name: "T.S. Murugesan", rating: 5, body: "Excellent, customer friendly, also assisted IRCTC account change & PW reset. Thanks." },
];
const feedbackJumbleAngles = [-2, 1.5, -1, 2, -1.5, 1, -2.5];
const feedbackJitterY = [0, 22, -8, 14, 4, -14, 8];

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
  const [activeFeedbackFilter, setActiveFeedbackFilter] = useState("all");
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  const { playHover, playClick } = useSoundContext();
  const { theme } = useTheme();
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

            <Reveal as="p" className="cs-body" delay={0.05}>
              <Bold text={cs.problemBody} />
            </Reveal>

            <div className="cs-stat-row">
              {cs.problemStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                </Reveal>
              ))}
            </div>

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
            <Reveal as="div" className="cs-bf-flow-section" delay={0.05}>
              <div className="cs-bf-flow-diagram">
                <span className="cs-bf-flow-bracket-label">Pre payment Flow</span>
                {/* Fixed 2-columns-wide serpentine: only 2 boxes per row so
                    each one keeps its label on a single line, alternating
                    direction every row (L-to-R, then R-to-L, ...) with a
                    down arrow at whichever column the row ended on. Both
                    columns are used on every row, so there's no leftover
                    blank column like the wider 3-4-across version had. */}
                <div className="cs-bf-flow-grid cs-bf-flow-grid--2col">
                  <span className="cs-flow-stepper__box" style={{ gridRow: 1, gridColumn: 1 }}>
                    {cs.basicBookingFlow.steps[0]}
                  </span>
                  <span className="cs-bf-flow-grid__arrow" style={{ gridRow: 1, gridColumn: 2 }}>
                    <FlowArrow direction="right" />
                  </span>
                  <span className="cs-flow-stepper__box" style={{ gridRow: 1, gridColumn: 3 }}>
                    {cs.basicBookingFlow.steps[1]}
                  </span>

                  <span className="cs-bf-flow-grid__arrow" style={{ gridRow: 2, gridColumn: 3 }}>
                    <FlowArrow direction="down" />
                  </span>

                  <span className="cs-flow-stepper__box" style={{ gridRow: 3, gridColumn: 3 }}>
                    {cs.basicBookingFlow.steps[2]}
                  </span>
                  <span className="cs-bf-flow-grid__arrow" style={{ gridRow: 3, gridColumn: 2 }}>
                    <FlowArrow direction="left" />
                  </span>
                  <span className="cs-flow-stepper__box" style={{ gridRow: 3, gridColumn: 1 }}>
                    {cs.basicBookingFlow.postPayment[0]}
                  </span>

                  <span className="cs-bf-flow-grid__arrow" style={{ gridRow: 4, gridColumn: 1 }}>
                    <FlowArrow direction="down" />
                  </span>

                  <span className="cs-flow-stepper__box cs-bf-flow-cred-box" style={{ gridRow: 5, gridColumn: 1 }}>
                    {cs.basicBookingFlow.postPayment[1]}
                  </span>
                  <span className="cs-bf-flow-grid__arrow cs-bf-flow-grid__arrow--labeled" style={{ gridRow: 5, gridColumn: 2 }}>
                    <FlowArrow direction="right" />
                    <em>Yes</em>
                  </span>
                  <span className="cs-flow-stepper__box cs-bf-flow-box--yes" style={{ gridRow: 5, gridColumn: 3 }}>
                    {cs.basicBookingFlow.branch.yes}
                  </span>

                  <span
                    className="cs-bf-flow-grid__arrow cs-bf-flow-grid__arrow--labeled cs-bf-flow-grid__arrow--vertical"
                    style={{ gridRow: 6, gridColumn: 1 }}
                  >
                    <FlowArrow direction="down" />
                    <em>No</em>
                  </span>
                  <span className="cs-flow-stepper__box cs-bf-flow-box--no" style={{ gridRow: 7, gridColumn: 1 }}>
                    {cs.basicBookingFlow.branch.no}
                  </span>
                </div>
              </div>
              <div className="cs-bf-flow-media">
                <img className="cs-bf-flow-media__gif" src={existingFlowGif} alt="Screen recording of the existing booking flow through payment" />
                <span className="cs-bf-flow-media__caption">GIF showing existing flow</span>
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
            <p className="cs-body">These feedbacks were collected from App/Play Store reviews & 1:1 user calling. Click a segment below to see how they were categorized:</p>

            <div className="cs-bf-feedback-filters" role="tablist" aria-label="Filter feedback by category">
              <button
                type="button"
                role="tab"
                aria-selected={activeFeedbackFilter === "all"}
                className={`cs-bf-filter-chip${activeFeedbackFilter === "all" ? " is-active" : ""}`}
                onClick={() => setActiveFeedbackFilter("all")}
                onMouseEnter={playHover}
              >
                All Feedback
              </button>
              {cs.feedbackCategories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={activeFeedbackFilter === c.key}
                  className={`cs-bf-filter-chip${activeFeedbackFilter === c.key ? " is-active" : ""}`}
                  onClick={() => setActiveFeedbackFilter(c.key)}
                  onMouseEnter={playHover}
                >
                  <span aria-hidden="true">{c.icon}</span> {c.title}
                </button>
              ))}
            </div>

            <div className="cs-bf-feedback-panel">
              {cs.userFeedback.map((fb, i) => {
                const dimmed = activeFeedbackFilter !== "all" && fb.category !== activeFeedbackFilter;
                const jumble = feedbackJumbleAngles[i % feedbackJumbleAngles.length];
                const jitterY = feedbackJitterY[i % feedbackJitterY.length];
                return (
                  <motion.div
                    className="cs-bf-feedback-bubble-wrap"
                    key={fb.text}
                    layout
                    style={{ marginTop: jitterY }}
                    initial={{ opacity: 0, scale: 0.7, rotate: jumble * 2.5 }}
                    animate={{
                      opacity: dimmed ? 0.25 : 1,
                      scale: dimmed ? 0.92 : 1,
                      rotate: dimmed ? 0 : jumble,
                    }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="cs-bf-feedback-bubble__avatar" aria-hidden="true">{feedbackAvatars[i % feedbackAvatars.length]}</span>
                    <div className={`cs-bf-feedback-bubble cs-bf-feedback-bubble--${fb.category}`}>
                      <p className="cs-bf-feedback-bubble__text">{fb.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <h3 className="cs-h2 cs-h2--sub cs-bf-irctc-heading">
              Technical Challenges with
              <img className="cs-bf-irctc-heading__logo" src={irctcLogo} alt="" aria-hidden="true" />
              IRCTC
            </h3>
            <div className="cs-overview-facts cs-overview-facts--two">
              {cs.technicalChallenges.map((c, i) => (
                <Reveal as="div" className="cs-overview-fact" key={c.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">{c.icon}</span>
                  <h4 className="cs-overview-fact__title">{c.title}</h4>
                  <p className="cs-overview-fact__body"><Bold text={c.body} /></p>
                </Reveal>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub">Breakdown of Existing Flow</h3>
            <Reveal as="div" className="cs-bf-breakdown-image-wrap" delay={0.04}>
              <img src={theme === "dark" ? breakdownExistingFlowDark : breakdownExistingFlow} alt="Annotated breakdown of the existing IRCTC credential and pending page flow, highlighting design and UX issues" className="cs-bf-breakdown-image" />
            </Reveal>

            <h3 className="cs-h2 cs-h2--sub">Overall Insights</h3>
            <div className="cs-insight-grid cs-insight-grid--one-row">
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
                  <span className="cs-overview-fact__icon">
                    {o.icon === "irctc" ? (
                      <img className="cs-overview-fact__icon-img" src={irctcLogo} alt="" aria-hidden="true" />
                    ) : (
                      o.icon
                    )}
                  </span>
                  <h4 className="cs-insight-card__title cs-insight-card__title--lg">{o.n}. {o.title}</h4>
                  <p className="cs-insight-card__body"><strong>How might we</strong> {o.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="h2" className="cs-h2 cs-h2--tight" delay={0.05}>
              Strategy
            </Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>
              {cs.strategy.intro}
            </Reveal>
            <div className="cs-overview-facts">
              {cs.strategy.cards.map((c, i) => (
                <Reveal as="div" className="cs-overview-fact" key={c.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">
                    {c.icon === "irctc" ? (
                      <img className="cs-overview-fact__icon-img" src={irctcLogo} alt="" aria-hidden="true" />
                    ) : (
                      c.icon
                    )}
                  </span>
                  <h4 className="cs-overview-fact__title">{c.title}</h4>
                  <p className="cs-overview-fact__body" style={{ whiteSpace: "pre-line" }}>{c.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="div" className="cs-bf-strategy-photos" delay={0.06}>
              <img src={strategyPhoto1} alt="Stakeholder meeting on booking flow strategy" />
              <img src={strategyPhoto2} alt="Team discussing the booking flow strategy" />
              <img src={strategyPhoto3} alt="Team collaborating on the booking flow strategy" />
            </Reveal>

            <h3 id="design-iteration" className="cs-h2 cs-h2--sub cs-h2--designs-iterations">Designs &amp; Iterations</h3>

            {cs.decisions.map((d, dIdx) => (
              <div className={`cs-phase${dIdx === cs.decisions.length - 1 ? " cs-phase--last" : ""}`} key={d.phase}>
                <Reveal as="div" className="cs-solution-eyebrow" delay={0.02}>
                  <span className="cs-solution-eyebrow__n">{dIdx + 1}. Solution</span>
                  <span className="cs-solution-eyebrow__dot">·</span>
                  <span className="cs-solution-eyebrow__title">{d.title}</span>
                </Reveal>

                {d.pitch && (
                  <Reveal as="p" className="cs-phase__hypothesis" delay={0.04}>
                    {d.pitch}
                  </Reveal>
                )}

                {d.phase === "01" && (
                  <>
                    <Reveal as="p" className="cs-body cs-userflow-body" delay={0.06}>
                      {d.userFlow.body}
                    </Reveal>
                    <div className="cs-bf-solution1-screens">
                      {[
                        { src: solution1BookingForm, alt: "Booking form with Reset IRCTC Password prompt", points: ["Informing users of **mandatory step** post-payment.", "Prompt to reset or get new **passwords** to avoid delays."] },
                        { src: solution1ResetPassword, alt: "Reset IRCTC Password bottom sheet", points: ["User can easily reset password without leaving the booking flow"] },
                        { src: solution1TransitionPage, alt: "Transition page connecting to IRCTC with progress steps", points: ["Shown completed and remaining **steps**", "Information users regarding **actions required** on the next step"] },
                      ].map((item, i) => (
                        <div className="cs-bf-solution1-screens__item" key={i}>
                          <img src={item.src} alt={item.alt} className="cs-bf-solution1-screens__img" />
                          <ul className="cs-bf-solution1-screens__points">
                            {item.points.map((point, j) => (
                              <li key={j}><Bold text={point} /></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {d.phase === "02" && (
                  <>
                    <Reveal as="p" className="cs-body cs-userflow-body cs-bf-sol2-userflow-body" delay={0.06}>
                      {d.userFlow.body}
                    </Reveal>
                    <AnnotatedFlowRow
                      annotatedSrc={simplifyCrisCpage}
                      annotatedAlt="IRCTC credential form with annotated callouts explaining each design decision"
                      caption="IRCTC CRIS page"
                      annotations={d.iterations.slice(1, 6).map((text, i) => ({ text, top: simplifyCrisisAnnotationTops[i], offsetY: i === 0 ? -32 : undefined }))}
                      screens={[
                        { src: simplifyPasswordVisible, alt: "Visible password field above keyboard", caption: "Visible password field above the keyboard" },
                        { src: simplifyPasswordToggle, alt: "Option to hide or show password", caption: "Option to hide or show password" },
                        { src: simplifyCtaActive, alt: "CTA becomes active", caption: "The CTA becomes active once both password and CAPTCHA are entered" },
                      ]}
                    />
                    <DesignVariantsToggle>
                      <div className="cs-phase1-card cs-bf-sol2-scroll-card">
                        <div className="cs-post-booking-scroll">
                          {[
                            { src: simplifyNeedHelpSheet, alt: "Need Help bottom sheet with list of potential issues", caption: "If users click back, cancel, or need help, a bottom sheet will appear with a list of potential issues they might be facing." },
                            { src: simplifyResetPassword, alt: "Reset IRCTC Password bottom sheet", caption: "User can easily reset password without leaving the page" },
                            { src: simplifyChangeIrctcId, alt: "Change IRCTC ID bottom sheet", caption: "User can easily change IRCTC ID without leaving the page" },
                            { src: simplifyCancelBooking, alt: "Cancel Booking confirmation pop-up", caption: "Confirmation pop-up on clicking cancellation to ensure their willingness." },
                          ].map((item, i) => (
                            <div className="cs-post-booking-item" key={i}>
                              <img src={item.src} alt={item.alt} className="cs-post-booking-screen" />
                              <div className="cs-post-booking-caption">
                                <p className="cs-post-booking-caption__desc">{item.caption}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DesignVariantsToggle>
                  </>
                )}

                {d.phase === "03" ? (
                  <>
                    <AnnotatedFlowRow
                      annotatedSrc={pendingConversionPendingPage}
                      annotatedAlt="Pending page with annotated callouts explaining each design decision"
                      caption="Pending page"
                      annotations={d.iterations.slice(0, 7).map((text, i) => ({ text, top: pendingConversionAnnotationTops[i] }))}
                      screens={[
                        { src: pendingConversionNeedHelp, alt: "Need Help section expanded", caption: "Need Help section" },
                        { src: pendingConversionFaq, alt: "Frequently Asked Questions section expanded", caption: "FAQ section" },
                        { src: pendingConversionTimeout, alt: "Session timed out state after the 10-minute window", caption: "10mins time gets over" },
                      ]}
                    />
                    <DesignVariantsToggle>
                      <div className="cs-phase1-card cs-bf-sol2-scroll-card">
                        <div className="cs-post-booking-scroll">
                          {[
                            { src: pendingRetryBookingSheet, alt: "Retry booking bottom sheet with updated availability", caption: cs.happyFlowScreens.postSolution2[0] },
                            { src: pendingNoAvailability, alt: "No availability state", caption: cs.happyFlowScreens.postSolution2[1] },
                            { src: pendingCancelRefund, alt: "Cancel and get full refund clicked", caption: cs.happyFlowScreens.postSolution2[2] },
                            { src: pendingRefundInitiated, alt: "Booking cancelled and refund initiated", caption: cs.happyFlowScreens.postSolution2[3] },
                            { src: pendingRefundProcessed, alt: "Booking cancelled and refund processed with breakup", caption: cs.happyFlowScreens.postSolution2[4] },
                            { src: pendingNoResponseIrctc, alt: "No response from IRCTC", caption: cs.happyFlowScreens.postSolution2[5] },
                            { src: pending30MinsTimeout, alt: "30 minutes time gets over", caption: cs.happyFlowScreens.postSolution2[6] },
                            { src: pendingHomepage10Min, alt: "Homepage prompt at 10 minutes", caption: cs.happyFlowScreens.postSolution2[7] },
                            { src: pendingHomepage30Min, alt: "Homepage prompt at 30 minutes", caption: cs.happyFlowScreens.postSolution2[8] },
                            { src: pendingHomepage30MinTimeout, alt: "Homepage prompt at 30 minutes timeout", caption: cs.happyFlowScreens.postSolution2[9] },
                          ].map((item, i) => (
                            <div className="cs-post-booking-item" key={i}>
                              <img src={item.src} alt={item.alt} className="cs-post-booking-screen" />
                              <div className="cs-post-booking-caption">
                                <p className="cs-post-booking-caption__desc">{item.caption}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DesignVariantsToggle>
                  </>
                ) : null}

                {d.phase === "02" && (
                  <Reveal as="div" className="cs-bf-happy-flow-band" delay={0.04}>
                    <div className="cs-bf-happy-flow__text">
                      <p className="cs-bf-happy-flow__subtitle">Solution {dIdx + 1}</p>
                      <h2 className="cs-bf-happy-flow__title">Happy flow</h2>
                    </div>
                    <div className="cs-bf-happy-flow__gif-wrap">
                      <div className="cs-bf-happy-flow__gif">
                        <img src={happyFlowSol2Gif} alt="Happy flow walkthrough for Simplify IRCTC Credential" />
                      </div>
                      <p className="cs-bf-happy-flow__label">GIF showing happy flow</p>
                    </div>
                  </Reveal>
                )}

                {d.phase === "03" && (
                  <Reveal as="div" className="cs-bf-happy-flow-band" delay={0.04}>
                    <div className="cs-bf-happy-flow__text">
                      <p className="cs-bf-happy-flow__subtitle">Solution {dIdx + 1}</p>
                      <h2 className="cs-bf-happy-flow__title">Happy flow</h2>
                    </div>
                    <div className="cs-bf-happy-flow__gif-wrap">
                      <div className="cs-bf-happy-flow__gif">
                        <img src={happyFlowSol3Gif} alt="Happy flow walkthrough for Pending Conversion" />
                      </div>
                      <p className="cs-bf-happy-flow__label">GIF showing happy flow</p>
                    </div>
                  </Reveal>
                )}
              </div>
            ))}

            <h3 className="cs-key-results-heading">Usability Test</h3>
            <Reveal as="div" className="cs-usability-row__text" delay={0.04}>
              <ul className="cs-pointer-list">
                {cs.usability.findings.map((finding, i) => (
                  <li key={i}>
                    <Bold text={finding} />
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal as="div" className="cs-usability-img-band" delay={0.06}>
              <div className="cs-usability-img-wrap">
                <img src={usabilityPhoto1} alt="Usability testing session with three participants" />
                <div className="cs-usability-img-overlay" aria-hidden="true" />
              </div>
              <div className="cs-usability-img-wrap">
                <img src={usabilityPhoto2} alt="Participant holding a phone showing the pending booking page" />
                <div className="cs-usability-img-overlay" aria-hidden="true" />
              </div>
            </Reveal>

            <h3 className="cs-h2 cs-h2--sub">Gap Identified</h3>
            <Reveal as="p" className="cs-body" delay={0.04}>
              <Bold text={cs.usability.gap} />
            </Reveal>
            <Reveal as="div" className="cs-bf-gap-band" delay={0.06}>
              <div className="cs-bf-gap-card">
                <img className="cs-bf-gap-img" src={gapExisting} alt="Existing forgot-password flow: users manually copying the '_IRCTC' suffix out of the SMS" />
                <span className="cs-bf-gap-label">🔨 Existing Gap</span>
              </div>
              <div className="cs-bf-gap-card">
                <img className="cs-bf-gap-img" src={gapProposed} alt="Proposed forgot-password flow solution" />
                <span className="cs-bf-gap-label">💡 Proposed Solution</span>
              </div>
            </Reveal>
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
                    {s.trend && (
                      <span className={`cs-overall-card__trend cs-overall-card__trend--${s.trend}`}>↙</span>
                    )}
                  </div>
                  <span className="cs-overall-card__label">{s.label}</span>
                  <p className="cs-overall-card__body"><Bold text={s.body} /></p>
                </Reveal>
              ))}
            </div>

            <h3 className="cs-h2 cs-h2--sub">User's Feedback</h3>
            <p className="cs-caption" style={{ marginTop: "0", marginBottom: "16px", textAlign: "left" }}>Real reviews from the Play Store, post-launch</p>
            <Reveal as="div" className="cs-bf-review-strip" delay={0.1}>
              <div className="cs-bf-review-strip__track">
                {[0, 1].map((rep) => (
                  <div className="cs-bf-review-strip__group" key={rep} aria-hidden={rep > 0}>
                    {playStoreReviews.map((r) => (
                      <div className="cs-bf-review-card" key={r.name}>
                        <div className="cs-bf-review-card__head">
                          <span className="cs-bf-review-card__avatar" aria-hidden="true">{r.name.charAt(0)}</span>
                          <div className="cs-bf-review-card__meta">
                            <span className="cs-bf-review-card__name">{r.name}</span>
                            <span className="cs-bf-review-card__stars" aria-label={`${r.rating} out of 5 stars`}>
                              {"★".repeat(r.rating)}
                            </span>
                          </div>
                        </div>
                        <p className="cs-bf-review-card__body">{r.body}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
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
