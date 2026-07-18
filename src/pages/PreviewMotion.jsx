import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, work } from "../data/content";
import portrait from "../assets/portrait.png";
import "./PreviewMotion.css";

gsap.registerPlugin(ScrollTrigger);

export default function PreviewMotion() {
  const rootRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const ease = "power3.out";

      const tl = gsap.timeline({ delay: 0.15 });
      tl.set(".pm-hero__pill, .pm-hero__title .pm-word, .pm-hero__subhead, .pm-hero__meta, .pm-hero__art", {
        opacity: 0,
        y: 28,
      });
      tl.to(".pm-hero__pill", { opacity: 1, y: 0, duration: 0.7, ease })
        .to(
          ".pm-hero__title .pm-word",
          { opacity: 1, y: 0, duration: 0.9, ease, stagger: 0.06 },
          "-=0.45"
        )
        .to(".pm-hero__subhead", { opacity: 1, y: 0, duration: 0.8, ease }, "-=0.55")
        .to(".pm-hero__meta", { opacity: 1, y: 0, duration: 0.7, ease }, "-=0.55")
        .to(
          ".pm-hero__art",
          { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
          "-=0.8"
        );

      gsap.to(".pm-hero__art", {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: ".pm-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray(".pm-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.fromTo(
        ".pm-section-heading",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pm-section-heading", start: "top 88%" },
        }
      );
    }, rootRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const titleWords = profile.title.split(" ");

  return (
    <div className="pm" ref={rootRef}>
      <section className="pm-hero">
        <div className="pm-container pm-hero__inner">
          <div className="pm-hero__copy">
            <span className="pm-hero__pill">{profile.pillGreeting}</span>
            <h1 className="pm-hero__title">
              {titleWords.map((w, i) => (
                <span className="pm-word" key={i}>
                  {w}&nbsp;
                </span>
              ))}
            </h1>
            <p className="pm-hero__subhead">{profile.subhead}</p>
            <p className="pm-hero__meta">
              {profile.currentCompany.note} <strong>{profile.currentCompany.label}</strong>
              {" | "}
              {profile.previousCompany.note} <strong>{profile.previousCompany.label}</strong>
            </p>
          </div>
          <div className="pm-hero__art">
            <div className="pm-blob" aria-hidden="true" />
            <img className="pm-portrait" src={portrait} alt="Illustrated portrait of Radhika" />
          </div>
        </div>
      </section>

      <section className="pm-work">
        <div className="pm-container">
          <h2 className="pm-section-heading">Selected work</h2>
          <div className="pm-grid">
            {work.map((item) => (
              <div className="pm-card" key={item.title}>
                <div className="pm-card__cover" style={{ backgroundImage: item.cover }} />
                <h3 className="pm-card__title">{item.title}</h3>
                <div className="pm-card__stats">
                  {item.stats.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
