import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { stageChatbotCaseStudy as cs } from "../data/caseStudyStageChatbot";
import CaseStudyNav from "./CaseStudyNav";
import { useSoundContext } from "../context/SoundContext";
import { useTheme } from "../context/ThemeContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import stageLogo from "../assets/site/stage-icon.png";
import stageLogoWhite from "../assets/site/stage-icon-white.svg";
import homeStoriesImg from "../assets/case-study/character-chatbot/home-stories.png";
import consumptionBubbleImg from "../assets/case-study/character-chatbot/consumption-bubble.png";
import "./CaseStudyPaywall.css";
import "./CaseStudyTripAssurance.css";
import "./CaseStudyStageChatbot.css";

// Senior-portfolio rebuild: visual-first, diagram-driven, minimal prose —
// see caseStudyStageChatbot.js header comment for the full editorial brief
// and accuracy rules this follows. Every diagram here (flows, funnel,
// layer stack, chat mockup) renders real, sourced content — nothing here
// is decorative.
const images = { homeStories: homeStoriesImg, consumptionBubble: consumptionBubbleImg };

const navSections = [
  { id: "problem", label: "Problem" },
  { id: "experiment", label: "First Experiment" },
  { id: "scale", label: "Scalability" },
  { id: "system", label: "The Framework" },
  { id: "discover", label: "Discoverability" },
  { id: "chat", label: "Chat Experience" },
  { id: "intelligence", label: "Intelligence" },
  { id: "safety", label: "Safety" },
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

function Bold({ text }) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

function Eyebrow({ n, label }) {
  return (
    <div className="cc-eyebrow">
      <span className="cc-eyebrow__n">{n}</span>
      <span className="cc-eyebrow__label">{label}</span>
    </div>
  );
}

function Flow({ steps, loop }) {
  return (
    <div className="cc-flow">
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`cc-flow__step${i === steps.length - 1 ? " cc-flow__step--accent" : ""}`}>{step}</span>
          {i < steps.length - 1 && <span className="cc-flow__arrow">→</span>}
        </div>
      ))}
      {loop && <span className="cc-flow__loop">↻ {loop}</span>}
    </div>
  );
}

function Flag({ type, children }) {
  return <span className={`cc-flag cc-flag--${type}`}>{children}</span>;
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

export default function CaseStudyStageChatbot() {
  useDocumentTitle("STAGE Character Chatbot — Radhika Vijay");
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

          <div className="cs-summary-list" style={{ marginTop: 32 }}>
            {cs.atAGlance.map((s, i) => (
              <Reveal as="div" className="cs-summary-item" key={s.label} delay={i * 0.06}>
                <span className="cs-summary-item__icon">{s.icon}</span>
                <div>
                  <h3 className="cs-summary-item__label">{s.label}</h3>
                  <p className="cs-summary-item__text"><Bold text={s.text} /></p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <CaseStudyNav sections={navSections} />

        <div className="cs-content">
          {/* ---------- 01 · Problem ---------- */}
          <section id="problem" className="cs-section">
            <Eyebrow n="01" label="The Problem" />
            <Reveal as="h2" className="cs-h2">{cs.problemHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}><Bold text={cs.problemBody} /></Reveal>
            <span className="cs-caption" style={{ textAlign: "left" }}>{cs.problemFlowLabel}</span>
            <Flow steps={cs.problemFlow} />
          </section>

          {/* ---------- 02 · First Experiment ---------- */}
          <section id="experiment" className="cs-section">
            <Eyebrow n="02" label="The First Experiment" />
            <Reveal as="h2" className="cs-h2">{cs.experimentHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>{cs.experimentBody}</Reveal>
            <span className="cs-caption" style={{ textAlign: "left" }}>{cs.experimentFlowLabel}</span>
            <Flow steps={cs.experimentFlow} />
            <div className="cs-overview-facts">
              {cs.experimentScope.map((f, i) => (
                <Reveal as="div" className="cs-overview-fact" key={f.title} delay={i * 0.05}>
                  <span className="cs-overview-fact__icon">{f.icon}</span>
                  <h4 className="cs-overview-fact__title">{f.title}</h4>
                  <p className="cs-overview-fact__body">{f.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="cc-pull" delay={0.06}>{cs.learnedHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.06}>{cs.learnedBody}</Reveal>
          </section>

          {/* ---------- 04 · Scalability Problem ---------- */}
          <section id="scale" className="cs-section">
            <Eyebrow n="03" label="The Scalability Problem" />
            <Reveal as="h2" className="cs-h2">{cs.scaleHook}</Reveal>
            <div className="cs-stat-row">
              {cs.scaleStats.map((s, i) => (
                <Reveal as="div" className="cs-stat" key={s.label} delay={i * 0.06}>
                  <span className="cs-stat__value">{s.value}</span>
                  <span className="cs-stat__label">{s.label}</span>
                  <span className="cs-stat__sublabel">{s.sublabel}</span>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="cc-pull" delay={0.06}>{cs.scaleQuote}</Reveal>
            <p className="cs-caption" style={{ textAlign: "left", fontStyle: "normal" }}>{cs.scaleQuoteNote}</p>
            <div className="cs-breakdown-list" style={{ marginTop: 24 }}>
              {cs.scaleBreakdown.map((b, i) => (
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

          {/* ---------- 05 · From Experience to System ---------- */}
          <section id="system" className="cs-section">
            <Eyebrow n="04" label="From Experience to System" />
            <Reveal as="h2" className="cs-h2">{cs.systemHook}</Reveal>

            <div className="cc-compare">
              <div className="cc-compare__side">
                <span className="cc-compare__tag">{cs.systemCompare.from.tag}</span>
                <h4 className="cc-compare__title">{cs.systemCompare.from.title}</h4>
                <ul className="cc-compare__list">{cs.systemCompare.from.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
              <div className="cc-compare__arrow">→</div>
              <div className="cc-compare__side cc-compare__side--to">
                <span className="cc-compare__tag">{cs.systemCompare.to.tag}</span>
                <h4 className="cc-compare__title">{cs.systemCompare.to.title}</h4>
                <ul className="cc-compare__list">{cs.systemCompare.to.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            </div>

            <Reveal as="p" className="cs-body" delay={0.06}>{cs.systemFirstPrinciple}</Reveal>

            <span className="cs-caption" style={{ textAlign: "left" }}>{cs.frameworkLayersLabel}</span>
            <Flow steps={cs.frameworkLayers} />
            <p className="cs-caption" style={{ textAlign: "left" }}>{cs.frameworkLayersNote}</p>

            <div className="cc-chatmock">
              <div className="cc-chatmock__head">
                <span className="cc-chatmock__head-avatar" />
                <span className="cc-chatmock__head-name">{cs.segmentExample.character} · {cs.segmentExample.segment}</span>
              </div>
              <div className="cc-chatmock__body">
                <span className="cc-chatmock__label">Trigger</span>
                <div className="cc-chatmock__bubble">
                  “{cs.segmentExample.trigger}”
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6, fontStyle: "italic" }}>{cs.segmentExample.triggerNote}</div>
                </div>
                <span className="cc-chatmock__label">Starters</span>
                {cs.segmentExample.starters.map((s) => (
                  <div className="cc-chatmock__bubble cc-chatmock__bubble--starter" key={s}>{s}</div>
                ))}
                <span className="cc-chatmock__label">Behavior</span>
                <p style={{ fontSize: 12.5, color: "var(--cs-soft)", lineHeight: 1.55 }}>{cs.segmentExample.behavior}</p>
              </div>
            </div>

            <div className="cs-overview-facts cs-overview-facts--two">
              {cs.universalRules.map((r) => (
                <div className="cs-overview-fact" key={r.label}>
                  <h4 className="cs-overview-fact__title">{r.label}</h4>
                  <ul className="cs-branch-list">{r.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- 06 · Discoverability ---------- */}
          <section id="discover" className="cs-section">
            <Eyebrow n="05" label="Making Characters Discoverable" />
            <Reveal as="h2" className="cs-h2">{cs.discoverHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}><Bold text={cs.discoverBody} /></Reveal>
            <Flow steps={cs.discoverFlow} />
            <Reveal as="div" className="cs-existing-img-wrap" delay={0.06}>
              <img className="cs-existing-img" src={images[cs.discoverImage]} alt={cs.discoverImageCaption} />
              <span className="cs-existing-img-caption">{cs.discoverImageCaption}</span>
            </Reveal>
            <Reveal as="div" className="cs-impact-card" delay={0.08}>
              <span className="cs-impact-card__label">
                {cs.discoverImpact.label}
                {cs.discoverImpact.flag && <Flag type={cs.discoverImpact.flag}>{cs.discoverImpact.flag}</Flag>}
              </span>
              <span className="cs-impact-card__stat">{cs.discoverImpact.stat}</span>
              <p className="cs-impact-card__body">{cs.discoverImpact.body}</p>
            </Reveal>
          </section>

          {/* ---------- 07 · Chat Experience ---------- */}
          <section id="chat" className="cs-section">
            <Eyebrow n="06" label="Designing the Chat Experience" />
            <Reveal as="h2" className="cs-h2">{cs.chatHook}</Reveal>
            <div className="cs-overview-facts">
              {cs.chatPrinciples.map((p, i) => (
                <Reveal as="div" className="cs-overview-fact" key={p.title} delay={i * 0.05}>
                  <h4 className="cs-overview-fact__title">{p.title}</h4>
                  <p className="cs-overview-fact__body">{p.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal as="div" className="cs-existing-img-wrap" delay={0.06}>
              <img className="cs-existing-img" src={images.consumptionBubble} alt="Real consumption-screen chat bubble" />
              <span className="cs-existing-img-caption">Real consumption-screen chat bubble: “Namaste ji 🙏 Ek baat batani thi aapko…”</span>
            </Reveal>

            <span className="cs-phase__how-label" style={{ display: "block", marginBottom: 8 }}>Entry states</span>
            <div className="cc-states">
              {cs.chatStates.entry.map((s) => (
                <div className="cc-states__card" key={s.title}>
                  <span className="cc-states__card-label">{s.label}</span>
                  <span className="cc-states__card-title">{s.title}</span>
                </div>
              ))}
            </div>
            <span className="cs-phase__how-label" style={{ display: "block", marginBottom: 8, marginTop: 16 }}>Conversation states</span>
            <div className="cc-states">
              {cs.chatStates.conversation.map((s) => (
                <div className="cc-states__card" key={s.title}>
                  <span className="cc-states__card-label">{s.label}</span>
                  <span className="cc-states__card-title">{s.title}</span>
                </div>
              ))}
            </div>
            <span className="cs-phase__how-label" style={{ display: "block", marginBottom: 8, marginTop: 16 }}>System states</span>
            <div className="cc-states">
              {cs.chatStates.system.map((s) => (
                <div className="cc-states__card" key={s.title}>
                  <span className="cc-states__card-label">{s.label}</span>
                  <span className="cc-states__card-title">{s.title}</span>
                </div>
              ))}
            </div>
          </section>

          <PartDivider part={cs.partLLM} />

          {/* ---------- 08 · Intelligence ---------- */}
          <section id="intelligence" className="cs-section">
            <Eyebrow n="07" label="The LLM Pipeline" />
            <Reveal as="h2" className="cs-h2">{cs.intelHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>{cs.intelBridge}</Reveal>
            <div className="cc-layers">
              {cs.intelLayers.map((l) => (
                <div className="cc-layer" key={l.n}>
                  <span className="cc-layer__n">{l.n}</span>
                  <div>
                    <div className="cc-layer__title">{l.title}</div>
                    <p className="cc-layer__body">{l.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Flow steps={["Persona", "Context", "LLM", "Response", "User", "Learning"]} loop="feeds back into Persona" />
            <p className="cs-caption" style={{ textAlign: "left" }}>{cs.intelLoopNote}</p>
          </section>

          {/* ---------- 09 · Safety ---------- */}
          <section id="safety" className="cs-section">
            <Eyebrow n="08" label="Designing for the Unexpected" />
            <Reveal as="h2" className="cs-h2">{cs.safetyHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>{cs.safetyBody}</Reveal>
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
              {cs.qaCases.map((q, i) => (
                <Reveal as="div" className="cs-overview-fact" key={q.title} delay={i * 0.05}>
                  <h4 className="cs-overview-fact__title">{q.title}</h4>
                  <p className="cs-overview-fact__body">{q.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---------- 10 · Content Discovery ---------- */}
          <section className="cs-section">
            <Eyebrow n="09" label="From Chat to Content Discovery" />
            <Reveal as="h2" className="cs-h2">{cs.crossHook}</Reveal>
            <Reveal as="p" className="cs-body" delay={0.05}>{cs.crossBody}</Reveal>
            <Flow steps={cs.crossFlow} />
          </section>

          {/* ---------- 11 · The System ---------- */}
          <section className="cs-section">
            <Eyebrow n="10" label="The System" />
            <p className="cs-caption" style={{ textAlign: "left" }}>{cs.systemDiagramLabel}</p>
            <Flow steps={cs.systemDiagram} loop="Re-engagement feeds back into Discovery" />
          </section>

          {/* ---------- 12 · Impact ---------- */}
          <section id="impact" className="cs-section">
            <Eyebrow n="11" label="Impact" />
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

          {/* ---------- 13 · Reflection ---------- */}
          <section id="reflection" className="cs-section">
            <Eyebrow n="12" label="Reflection" />
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
            <div className="cs-sparkle-divider" aria-hidden="true">
              <span className="cs-sparkle-divider__line" />
              <span className="cs-sparkle-divider__mark">✧</span>
              <span className="cs-sparkle-divider__line" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
