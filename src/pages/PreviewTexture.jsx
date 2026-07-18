import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./PreviewTexture.css";

const GRID_X = 240;
const GRID_Z = 130;
const SPACING = 0.082;
const BUMP_RADIUS = 0.9;
const BUMP_HEIGHT = 0.32;
const MOUSE_LERP = 0.07;

function useDotWave(mountRef) {
  useEffect(() => {
    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#3d5850"),
      size: 0.017,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Cursor tracking: raycast against the y=0 plane so the visual mouse
    // position maps accurately onto the tilted grid, not a rough 2D guess.
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

    // Cheap value-noise for a natural dune-like undulation without extra deps.
    function hash(x, y) {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    }
    function noise(x, y) {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      const a = hash(xi, yi), b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

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
        let y = (n1 + n2 - 0.75) * 0.55;

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
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [mountRef]);
}

export default function PreviewTexture() {
  const mountRef = useRef(null);
  useDotWave(mountRef);

  return (
    <div className="pt">
      <section className="pt-hero">
        <div className="pt-hero__copy">
          <span className="pt-eyebrow">Reference match</span>
          <h1 className="pt-title">
            Dot-wave hero
            <br />+ film-grain section
          </h1>
          <p className="pt-subhead">
            Fine point-cloud terrain, animated slowly with layered noise —
            move your cursor over it to push the sand up as you go.
          </p>
        </div>
        <div className="pt-hero__art" ref={mountRef} />
      </section>

      <section className="pt-dark">
        <div className="pt-grid-overlay" aria-hidden="true" />
        <span className="pt-tag pt-tag--tl">FIG. 01-A</span>
        <span className="pt-tag pt-tag--br">SCROLL</span>
        <div className="pt-dark__inner">
          <span className="pt-dark__eyebrow">Texture reference</span>
          <h2 className="pt-dark__title">Grain + hairline grid.</h2>
          <p className="pt-dark__body">
            SVG turbulence noise at low opacity, layered over a near-black
            base with a faint grid — no colour, no blobs, just quiet texture.
          </p>
        </div>
      </section>
    </div>
  );
}
