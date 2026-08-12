import { useEffect, useRef, useState } from "react";

// Liquid-ripple image distortion: the portrait is drawn as a WebGL texture
// on a plane; a fragment shader pushes UV samples away from the cursor
// within a soft radius, so the image bulges/ripples under the pointer like
// a water surface. Fades in on hover (uHover), fades out on leave, rather
// than snapping — a resting portrait should look completely normal.
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    // Bigger radius + roughly double the old strength (0.05 -> 0.11) —
    // the shine highlight is gone, so the ripple is the only cursor
    // feedback left and needs to carry more of the effect on its own.
    float radius = 0.38;
    float strength = smoothstep(radius, 0.0, dist) * uHover * 0.11;
    vec2 dir = uv - uMouse;
    uv += dir * strength;

    gl_FragColor = texture2D(uTexture, uv);
  }
`;

// Waits for an idle moment (or 500ms, whichever comes first) so this can't
// compete with the browser's own work right after navigation — running two
// WebGL contexts' setup synchronously on mount (this one plus HeroDotWave's)
// was found to delay dispatching the Work section's image requests by ~14s.
// Safari has no requestIdleCallback, hence the setTimeout fallback.
function onIdle() {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(resolve, { timeout: 500 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

export default function PortraitLiquid({ src, alt, className, ariaHidden }) {
  const mountRef = useRef(null);
  // WebGLRenderer's constructor throws synchronously (not a promise
  // rejection) when the browser can't get a WebGL context — hardware
  // acceleration disabled, an old GPU, some VMs. Uncaught, that crashes the
  // whole React tree to a blank page since nothing here has an error
  // boundary. Falling back to a plain <img> keeps the portrait visible
  // (just without the ripple) instead of taking the entire site down.
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (webglFailed) return;
    const container = mountRef.current;
    let cancelled = false;
    let cleanup = () => {};

    async function init() {
      // Dynamically imported instead of a static top-level import — three.js
      // is a few hundred KB and was previously part of the main bundle every
      // page paid for on first load, whether or not the Hero was even the
      // page being visited.
      const THREE = await import("three");
      await onIdle();
      if (cancelled) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setWebglFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        -0.5,
        0.5,
        0.5,
        -0.5,
        0.1,
        10,
      );
      camera.position.z = 1;

      const uniforms = {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
      };

      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const loader = new THREE.TextureLoader();
      loader.load(src, (tex) => {
        // No colorSpace tag either — with outputColorSpace also set to
        // NoColorSpace above, this is a fully raw passthrough: the texture's
        // encoded bytes go in and come out unchanged, same as a plain <img>.
        uniforms.uTexture.value = tex;
      });

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h);
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      let targetHover = 0;
      let currentHover = 0;

      const onMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        uniforms.uMouse.value.set(x, y);
        targetHover = 1;
      };
      const onLeave = () => {
        targetHover = 0;
      };
      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);

      // Same reasoning as HeroDotWave: this rAF loop ran continuously even
      // scrolled fully out of view, competing with scroll/paint for the main
      // thread for no visible benefit. Pause it offscreen, resume on return.
      let isVisible = true;
      let raf = null;
      const animate = () => {
        currentHover += (targetHover - currentHover) * 0.08;
        uniforms.uHover.value = currentHover;
        renderer.render(scene, camera);
        raf = isVisible ? requestAnimationFrame(animate) : null;
      };

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible && raf === null) {
            raf = requestAnimationFrame(animate);
          }
        },
        { threshold: 0 },
      );
      visibilityObserver.observe(container);

      raf = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(raf);
        container.removeEventListener("mousemove", onMove);
        container.removeEventListener("mouseleave", onLeave);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [src, webglFailed]);

  if (webglFailed) {
    return (
      <img
        className={className}
        src={src}
        alt={ariaHidden ? "" : alt}
        aria-hidden={ariaHidden || undefined}
      />
    );
  }

  return (
    <div
      className={className}
      ref={mountRef}
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : alt}
      aria-hidden={ariaHidden || undefined}
    />
  );
}
