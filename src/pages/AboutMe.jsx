import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Marquee from "../components/Marquee";
import PhotoCarousel from "../components/PhotoCarousel";
import { traits, bio, experience, achievements, galleryCaption, galleryCaptions, aboutQuote } from "../data/aboutContent";
import { useTheme } from "../context/ThemeContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import SplitText from "../components/SplitText";
import TypewriterText from "../components/TypewriterText";
import { useTiltEffect } from "../hooks/useTiltEffect";
import PortraitLiquid from "../components/PortraitLiquid";
import aboutPortraitLight from "../assets/site/about-portrait.png";
import aboutPortraitDark from "../assets/site/about-portrait-dark.png";
import stageLogo from "../assets/site/experience/stage.svg";
import adaniLogo from "../assets/site/experience/adani.svg";
import partLogo from "../assets/site/experience/part.svg";
import tdbLogo from "../assets/site/experience/tdb.svg";
import g1 from "../assets/site/about-gallery/cs-01-gonbo-rangjon-ladakh.jpg";
import g2 from "../assets/site/about-gallery/cs-02-bir-himachal.jpg";
import g3 from "../assets/site/about-gallery/cs-03-ha-long-bay-vietnam.jpg";
import g4 from "../assets/site/about-gallery/cs-04-solan-himachal.jpg";
import g5 from "../assets/site/about-gallery/cs-05-langza-spiti.jpg";
import g6 from "../assets/site/about-gallery/cs-06-somewhere-in-rajasthan.jpg";
import g7 from "../assets/site/about-gallery/cs-07-shinkula-pass.jpg";
import g8 from "../assets/site/about-gallery/cs-08-indian-ocean-tamil-nadu.jpg";
import g9 from "../assets/site/about-gallery/cs-09-french-village-vietnam.jpg";
import g10 from "../assets/site/about-gallery/cs-10-jaipur-rajasthan.jpg";
import g11 from "../assets/site/about-gallery/cs-11-dhanushkodi.jpg";
import g12 from "../assets/site/about-gallery/cs-12-prem-mandir-vrindavan.jpg";
import g13 from "../assets/site/about-gallery/cs-13-chandratal-lake-spiti.jpg";
import g14 from "../assets/site/about-gallery/cs-14-jispa-himachal.jpg";
import g15 from "../assets/site/about-gallery/cs-15-parashar-lake-himachal.jpg";
import g16 from "../assets/site/about-gallery/cs-16-azhimala-shiva-kerala.jpg";
import g17 from "../assets/site/about-gallery/cs-17-shoja-himachal.jpg";
import g18 from "../assets/site/about-gallery/cs-18-mandi-himachal.jpg";
import g19 from "../assets/site/about-gallery/cs-19-kanyakumari.jpg";
import g20 from "../assets/site/about-gallery/cs-20-mussorie-uttrakhand.jpg";
import g21 from "../assets/site/about-gallery/cs-21-tigers-nest-bhutan.jpg";
import g22 from "../assets/site/about-gallery/cs-22-manali-himachal.jpg";
import g23 from "../assets/site/about-gallery/cs-23-rameshwaram-tamil-nadu.jpg";
import stageHoverPhoto from "../assets/site/experience/stage-hover.png";
import adaniHoverPhoto from "../assets/site/experience/adani-hover.png";
import partHoverPhoto from "../assets/site/experience/part-hover.png";
import tdbHoverPhoto from "../assets/site/experience/tdb-hover.png";
import aihack1Photo from "../assets/site/achievements/aihack-1-final.png";
import aihack2Photo from "../assets/site/achievements/aihack-2-final.png";
import ymp1Photo from "../assets/site/achievements/ymp-1-final.png";
import ymp2Photo from "../assets/site/achievements/ymp-2-final.png";
import ymp3Photo from "../assets/site/achievements/ymp-3-final.png";
import aboutQuoteDoodle from "../assets/site/about-quote-doodle-new.svg";
import pinCorners from "../assets/site/achievements/pin-corners.svg";
import "./AboutMe.css";

const gallery = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16, g17, g18, g19, g20, g21, g22, g23];

const achievementImages = {
  "1st runner-up in AI Hackathon": [aihack1Photo, aihack2Photo],
  "Young Manager Program": [ymp1Photo, ymp2Photo, ymp3Photo],
};

const hoverImages = { stage: stageHoverPhoto, adani: adaniHoverPhoto, part: partHoverPhoto, tdb: tdbHoverPhoto };

// Auto-advances every 0.9s while hovered (paused during a manual drag) —
// the strip is also a real scroll container, draggable with the mouse,
// swipeable on touch, and scrollable with arrow keys once focused.
// `hovered` is controlled by the parent card (not this component) so
// hovering anywhere on the card — not just the photo strip itself — starts
// the cycle.
function AchievementPhotoCycle({ images, hovered }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);
  // Touch devices can't hover, so the cycle used to just sit still until
  // the user thought to drag it — auto-cycling by default on touch means
  // they see all the photos without needing to discover the drag gesture.
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );
  // A ref mirrors `dragging` so onMouseMove reads it synchronously — the
  // state version can still be one render behind on the very next event
  // right after mousedown, which would silently drop the first move(s).
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, startScroll: ref.current.scrollLeft };
    setDragging(true);
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    ref.current.scrollLeft = drag.current.startScroll - (e.pageX - drag.current.startX);
  };
  const stopDrag = () => {
    drag.current.active = false;
    setDragging(false);
  };

  const active = hovered || isTouch;

  useEffect(() => {
    if (!active) {
      ref.current?.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (images.length < 2 || dragging) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const width = el.clientWidth;
      const next = (Math.round(el.scrollLeft / width) + 1) % images.length;
      el.scrollTo({ left: next * width, behavior: "smooth" });
    }, 900);
    return () => clearInterval(id);
  }, [active, dragging, images.length]);

  return (
    <div
      ref={ref}
      className="about-achievements__photo-cycle"
      tabIndex={0}
      role="group"
      aria-label="Photo gallery, scroll or drag to browse"
      onMouseLeave={stopDrag}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onTouchStart={() => setDragging(true)}
      onTouchEnd={() => setDragging(false)}
    >
      {images.map((src, i) => (
        <img key={i} src={src} alt="" className="about-achievements__photo-frame" draggable={false} />
      ))}
    </div>
  );
}

// Same mouse-tracked tilt as the Work/Highlights cards — a plain sibling
// of Reveal's motion element (not Reveal itself), so its own CSS
// transform isn't fought by Reveal's inline entrance-animation transform.
// Light/dark are two stacked layers cross-fading on theme toggle (same
// approach as HeroPortraitTilt in Hero.jsx) rather than swapping the src
// outright, so the switch dissolves smoothly instead of popping instantly.
function AboutPortraitTilt({ lightSrc, darkSrc, alt }) {
  const tilt = useTiltEffect();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className="about-portrait-tilt"
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div className={`about-portrait-tilt__layer ${isDark ? "" : "is-active"}`}>
        <PortraitLiquid src={lightSrc} alt={alt} ariaHidden={isDark} className="about-portrait-tilt__canvas" />
      </div>
      <div className={`about-portrait-tilt__layer ${isDark ? "is-active" : ""}`}>
        <PortraitLiquid src={darkSrc} alt={alt} ariaHidden={!isDark} className="about-portrait-tilt__canvas" />
      </div>
    </div>
  );
}

function AchievementCard({ item, i }) {
  const [hovered, setHovered] = useState(false);
  const tilt = useTiltEffect();
  return (
    <Reveal as="div" className="about-achievements__card-slot" delay={i * 0.06}>
      <div
        className="about-achievements__card tilt-card"
        ref={tilt.ref}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={() => {
          setHovered(false);
          tilt.onMouseLeave();
        }}
      >
        <img className="about-achievements__pin" src={pinCorners} alt="" aria-hidden="true" />
        <div className="about-achievements__photo">
          <AchievementPhotoCycle images={achievementImages[item.title]} hovered={hovered} />
        </div>
        <div className="about-achievements__body">
          <SplitText as="h3" className="about-achievements__title" text={item.title} amount={0.6} />
          <p className="about-achievements__desc">{item.description}</p>
          <span className="about-achievements__pill">{item.year}</span>
        </div>
      </div>
    </Reveal>
  );
}

const fadeUp = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({ as = "div", className, children, delay = 0, innerRef, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      ref={innerRef}
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="section-heading-group">
      {typeof children === "string" ? (
        <SplitText as="h2" className="section-heading" text={children} />
      ) : (
        <Reveal as="h2" className="section-heading">
          {children}
        </Reveal>
      )}
      <span className="section-heading-group__rule" aria-hidden="true" />
    </div>
  );
}

export default function AboutMe() {
  useDocumentTitle("About — Radhika Vijay");
  const [hoveredRole, setHoveredRole] = useState(null);
  const { theme } = useTheme();
  // Always the icon mark (experience/stage.svg), never the wordmark
  // (stage-icon-white.svg) — that file was only ever meant for the dark
  // hero, not this badge; swapping to it here showed "STAGE" text
  // crammed into the circle instead of just the mark.
  const logos = { stage: stageLogo, adani: adaniLogo, part: partLogo, tdb: tdbLogo };

  return (
    <main className="about">
      <section className="section about-story">
        <div className="container about-story__inner">
          <div className="about-story__main">
            <SplitText
              as="h1"
              className="about-hero__title"
              parts={["From ", { em: "Spaces" }, " to Screens! ~"]}
            />

            {bio.map((block, i) => (
              <div className={`about-chapter${i === bio.length - 1 ? " about-chapter--last" : ""}`} key={i}>
                {block.lead && (
                  <SplitText as="p" className="about-chapter__lead" text={block.lead} amount={0.4} delay={0.2} />
                )}
                {block.body.map((parts, j) => (
                  <SplitText as="p" className="about-chapter__body" key={j} delay={0.05} parts={parts} />
                ))}
              </div>
            ))}
          </div>

          <Reveal as="div" className="about-story__art" delay={0.1}>
            <AboutPortraitTilt
              lightSrc={aboutPortraitLight}
              darkSrc={aboutPortraitDark}
              alt="Radhika in the mountains"
            />
          </Reveal>
        </div>
      </section>

      <Marquee items={traits} speed={40} />

      <section className="section about-experience-section">
        <div className="container">
          <SectionHeading>Experience ~</SectionHeading>

          <div className="about-experience">
            {experience.map((role, i) => (
              <Reveal
                as="div"
                className={`about-experience__row${hoveredRole === role.company ? " is-hovered" : ""}`}
                key={role.company}
                delay={i * 0.08}
                onMouseEnter={() => role.hoverImageKey && setHoveredRole(role.company)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <div className="about-experience__marker">
                  <div className="about-experience__badge">
                    {role.logoKey ? (
                      <img
                        className={`about-experience__logo${role.logoKey === "part" ? " about-experience__logo--part" : ""}`}
                        src={logos[role.logoKey]}
                        alt=""
                      />
                    ) : (
                      <span className="about-experience__initial">{role.company[0]}</span>
                    )}
                  </div>
                </div>
                <div className="about-experience__main">
                  <div className="about-experience__head">
                    <SplitText as="h3" className="about-experience__company" text={role.company} amount={0.8} />
                    <span className="about-experience__role">{role.role}</span>
                  </div>
                  <div className="about-experience__meta">
                    <span className="about-experience__dates">{role.dates}</span>
                    {role.category && <span className="about-experience__tag">{role.category}</span>}
                  </div>
                </div>

                {role.hoverImageKey && (
                  <AnimatePresence>
                    {hoveredRole === role.company && (
                      <motion.img
                        className="about-experience__preview"
                        src={hoverImages[role.hoverImageKey]}
                        alt=""
                        aria-hidden="true"
                        initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                        animate={{ opacity: 1, scale: 1, rotate: -3 }}
                        exit={{ opacity: 0, scale: 0.92, rotate: -3 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </AnimatePresence>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-achievements-section">
        <div className="container">
          <SectionHeading>Highlights ~</SectionHeading>

          <div className="about-achievements__frame">
            <div className="about-achievements">
              {achievements.map((item, i) => (
                <AchievementCard key={item.title} item={item} i={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section about-gallery-section">
        <div className="container">
          <SectionHeading>Curious Soul! ~</SectionHeading>
          <SplitText as="p" className="about-gallery__caption" delay={0.05} parts={galleryCaption} />

          <Reveal as="div" delay={0.1}>
            <PhotoCarousel items={gallery} captions={galleryCaptions} />
          </Reveal>
        </div>
      </section>

      <section className="section quote-section">
        <Reveal as="div" className="container quote-inner about-quote">
          <div className="about-quote__copy">
            <TypewriterText
              as="h2"
              className="quote-sanskrit"
              text={`${aboutQuote.sanskrit} ~`}
              speed={34}
            />
            <span className="quote-rule" aria-hidden="true" />
            <TypewriterText
              as="p"
              className="quote-translation"
              text={aboutQuote.translation}
              speed={20}
              startDelay={aboutQuote.sanskrit.length * 34 + 400}
            />
          </div>
          <img className="about-quote__doodle" src={aboutQuoteDoodle} alt="" aria-hidden="true" />
        </Reveal>
      </section>
    </main>
  );
}
