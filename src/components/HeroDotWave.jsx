import { useEffect, useRef } from "react";

// Adapted from src/pages/PreviewTexture.jsx's useDotWave: a tilted
// point-cloud terrain, undulating with layered value-noise and bumping up
// near the cursor. Reused as-is (same dot color, already --forest-soft)
// but mounted as the full hero section background instead of a half-width
// demo panel.
const GRID_X = 240;
const GRID_Z = 130;
const SPACING = 0.082;
const BUMP_RADIUS = 1.1;
const BUMP_HEIGHT = 0.55;
const MOUSE_LERP = 0.18;

// Waits for an idle moment (or 500ms, whichever comes first) so this can't
// compete with the browser's own work right after navigation — e.g. it was
// found to delay dispatching the Work section's image requests by ~14s when
// this ran synchronously on mount, racing two WebGL contexts and Framer
// Motion's entrance animations for the main thread at the worst possible
// moment. Safari has no requestIdleCallback, hence the setTimeout fallback.
function onIdle() {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(resolve, { timeout: 500 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

export default function HeroDotWave({
  className,
  dotOpacity = 0.55,
  ambientAmplitude = 1,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    let cancelled = false;
    let cleanup = () => {};

    async function init() {
      // Dynamically imported instead of a static top-level import — three.js
      // is a few hundred KB and was previously part of the main bundle that
      // every page pays for on first load, whether or not the Hero (with
      // its WebGL background) is even the page being visited.
      const THREE = await import("three");
      await onIdle();
      if (cancelled) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        // WebGLRenderer throws synchronously, uncaught, when the browser
        // can't get a context (hardware acceleration off, old GPU, some
        // VMs) — with no error boundary in the app that crashes the whole
        // page to blank. This is purely decorative background, so on
        // failure we just skip it rather than risk taking the site down.
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 3.4, 5.4);
      camera.lookAt(0, -0.4, 0);

      const count = GRID_X * GRID_Z;
      const positions = new Float32Array(count * 3);
      const basePositions = new Float32Array(count * 2);
      let idx = 0;
      for (let ix = 0; ix < GRID_X; ix++) {
        for (let iz = 0; iz < GRID_Z; iz++) {
          const x = (ix - GRID_X / 2) * SPACING;
          const z = (iz - GRID_Z / 2) * SPACING;
          positions[idx * 3] = x;
          positions[idx * 3 + 1] = 0;
          positions[idx * 3 + 2] = z;
          basePositions[idx * 2] = x;
          basePositions[idx * 2 + 1] = z;
          idx++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      const getColor = () =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--forest-soft")
          .trim() || "#3d5850";

      const material = new THREE.PointsMaterial({
        color: new THREE.Color(getColor()),
        size: 0.017,
        sizeAttenuation: true,
        transparent: true,
        opacity: dotOpacity,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const raycaster = new THREE.Raycaster();
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const pointerNdc = new THREE.Vector2(-10, -10);
      const targetHit = new THREE.Vector3();
      const mouseWorld = new THREE.Vector3(0, 0, 0);
      let hasPointer = false;

      const onPointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          hasPointer = false;
          return;
        }
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        hasPointer = true;
      };
      window.addEventListener("pointermove", onPointerMove);

      function hash(x, y) {
        const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
        return s - Math.floor(s);
      }
      function noise(x, y) {
        const xi = Math.floor(x),
          yi = Math.floor(y);
        const xf = x - xi,
          yf = y - yi;
        const u = xf * xf * (3 - 2 * xf);
        const v = yf * yf * (3 - 2 * yf);
        const a = hash(xi, yi),
          b = hash(xi + 1, yi);
        const c = hash(xi, yi + 1),
          d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
      }

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);
      // The hero's own height can change after mount (staggered text reveal,
      // async image load) without a window resize event ever firing — a
      // ResizeObserver on the container itself keeps the canvas in sync with
      // it directly, instead of the render surface freezing at its initial
      // size and leaving a gap once the section grows taller.
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const themeObserver = new MutationObserver(() => {
        material.color.set(getColor());
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // The noise loop below touches all 31,200 points twice each (~250k
      // Math.sin calls) every single frame, unconditionally — that's real
      // main-thread work competing with the browser's own scroll/paint work,
      // and it kept running flat-out even after the hero was scrolled
      // completely out of view. An IntersectionObserver stops scheduling new
      // frames the moment it's offscreen (and resumes the instant it's back),
      // instead of paying that cost the entire time the page is open.
      let isVisible = true;
      let raf = null;
      const animate = (t) => {
        if (hasPointer) {
          raycaster.setFromCamera(pointerNdc, camera);
          if (raycaster.ray.intersectPlane(groundPlane, targetHit)) {
            mouseWorld.x += (targetHit.x - mouseWorld.x) * MOUSE_LERP;
            mouseWorld.z += (targetHit.z - mouseWorld.z) * MOUSE_LERP;
          }
        }

        const time = t * 0.00012;
        const pos = geometry.attributes.position;
        const r2 = BUMP_RADIUS * BUMP_RADIUS;
        for (let i = 0; i < count; i++) {
          const x = basePositions[i * 2];
          const z = basePositions[i * 2 + 1];
          const n1 = noise(x * 0.6 + time * 6, z * 0.6 - time * 3);
          const n2 = noise(x * 1.4 - time * 4, z * 1.4 + time * 5) * 0.5;
          let y = (n1 + n2 - 0.75) * 0.55 * ambientAmplitude;

          const dx = x - mouseWorld.x;
          const dz = z - mouseWorld.z;
          const d2 = dx * dx + dz * dz;
          if (d2 < r2 * 4) {
            y += Math.exp(-d2 / (2 * r2)) * BUMP_HEIGHT;
          }

          pos.array[i * 3 + 1] = y;
        }
        pos.needsUpdate = true;
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
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        resizeObserver.disconnect();
        themeObserver.disconnect();
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
  }, []);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}
