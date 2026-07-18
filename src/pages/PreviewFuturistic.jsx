import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Icosahedron, Torus } from "@react-three/drei";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { profile, work } from "../data/content";
import "./PreviewFuturistic.css";

gsap.registerPlugin(ScrollTrigger);

function ParticleField() {
  const ref = useRef(null);
  const count = 1800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#e8d9c4"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingGeometry() {
  const groupRef = useRef(null);
  const icoRef = useRef(null);
  const torusRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.15;
      icoRef.current.rotation.y += delta * 0.2;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x -= delta * 0.08;
      torusRef.current.rotation.z += delta * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouse.current.x * 0.5,
        0.03
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -mouse.current.y * 0.3,
        0.03
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Icosahedron ref={icoRef} args={[1.6, 0]} position={[1.6, 0.4, -1]}>
        <meshBasicMaterial color="#8a2a1c" wireframe transparent opacity={0.55} />
      </Icosahedron>
      <Torus ref={torusRef} args={[1.1, 0.32, 16, 64]} position={[-2, -0.6, -2]}>
        <meshBasicMaterial color="#b3c1b4" wireframe transparent opacity={0.4} />
      </Torus>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ParticleField />
      <FloatingGeometry />
    </>
  );
}

export default function PreviewFuturistic() {
  const rootRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const ease = "power3.out";
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(".pf-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease })
        .fromTo(
          ".pf-title .pf-word",
          { opacity: 0, y: 40, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, ease, stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(
          ".pf-subhead",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease },
          "-=0.6"
        )
        .fromTo(
          ".pf-glass-card",
          { opacity: 0, y: 20, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.7"
        );

      gsap.utils.toArray(".pf-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });
    }, rootRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const titleWords = profile.title.split(" ");

  return (
    <div className="pf" ref={rootRef}>
      <div className="pf-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.8]}>
          <Scene />
        </Canvas>
      </div>

      <section className="pf-hero">
        <span className="pf-eyebrow">{profile.pillGreeting}</span>
        <h1 className="pf-title">
          {titleWords.map((w, i) => (
            <span className="pf-word" key={i}>
              {w}&nbsp;
            </span>
          ))}
        </h1>
        <p className="pf-subhead">{profile.subhead}</p>

        <div className="pf-glass-card">
          <span className="pf-glass-card__label">{profile.currentCompany.note}</span>
          <strong className="pf-glass-card__value">{profile.currentCompany.label}</strong>
          <span className="pf-glass-card__divider" />
          <span className="pf-glass-card__label">{profile.previousCompany.note}</span>
          <strong className="pf-glass-card__value">{profile.previousCompany.label}</strong>
        </div>
      </section>

      <section className="pf-work">
        <h2 className="pf-section-heading">Selected work</h2>
        <div className="pf-grid">
          {work.map((item) => (
            <div className="pf-card" key={item.title}>
              <div className="pf-card__cover" style={{ backgroundImage: item.cover }} />
              <div className="pf-card__body">
                <h3 className="pf-card__title">{item.title}</h3>
                <div className="pf-card__stats">
                  {item.stats.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
