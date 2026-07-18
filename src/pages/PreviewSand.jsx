import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./PreviewSand.css";

const POINT_COUNT = 20;
const POINT_LIFETIME = 1500;
const MIN_POINT_DIST = 0.012;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uPoints[${POINT_COUNT}];
  uniform float uAges[${POINT_COUNT}];
  uniform int uActiveCount;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.52;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    vec2 auv = vec2(uv.x * aspect, uv.y);

    vec2 displacement = vec2(0.0);
    float disturb = 0.0;

    for (int i = 0; i < ${POINT_COUNT}; i++) {
      if (i >= uActiveCount) break;
      vec2 p = uPoints[i];
      vec2 ap = vec2(p.x * aspect, p.y);
      float age = uAges[i];
      float fade = 1.0 - age;
      float dist = length(auv - ap);
      float radius = 0.1 + age * 0.06;
      float falloff = smoothstep(radius, 0.0, dist) * fade;
      vec2 dir = (auv - ap) / (dist + 0.0001);
      displacement += dir * falloff * 0.05;
      disturb += falloff;
    }

    vec2 sandUv = uv * 9.0 + displacement * 5.0 + vec2(uTime * 0.004, 0.0);
    float grain = fbm(sandUv);
    float fine = (noise(uv * 260.0 + displacement * 50.0) - 0.5) * 0.07;

    vec3 sandDark = vec3(0.80, 0.73, 0.58);
    vec3 sandLight = vec3(0.976, 0.965, 0.918);
    vec3 color = mix(sandDark, sandLight, grain);
    color += fine;

    color += disturb * 0.08;
    color -= disturb * fbm(sandUv * 1.4) * 0.05;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function PreviewSand() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const zeroPoints = Array.from({ length: POINT_COUNT }, () => new THREE.Vector2(-10, -10));
    const zeroAges = Array.from({ length: POINT_COUNT }, () => 1);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uPoints: { value: zeroPoints },
      uAges: { value: zeroAges },
      uActiveCount: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let points = [];
    let lastPoint = null;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const u = (e.clientX - rect.left) / rect.width;
      const v = 1 - (e.clientY - rect.top) / rect.height;
      if (lastPoint) {
        const dx = u - lastPoint.x;
        const dy = v - lastPoint.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_POINT_DIST) return;
      }
      const point = { x: u, y: v, birth: performance.now() };
      lastPoint = point;
      points.push(point);
      if (points.length > POINT_COUNT) points.shift();
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = null;
    const animate = () => {
      const now = performance.now();
      points = points.filter((p) => now - p.birth < POINT_LIFETIME);

      for (let i = 0; i < POINT_COUNT; i++) {
        if (i < points.length) {
          const p = points[i];
          uniforms.uPoints.value[i].set(p.x, p.y);
          uniforms.uAges.value[i] = (now - p.birth) / POINT_LIFETIME;
        } else {
          uniforms.uAges.value[i] = 1;
        }
      }
      uniforms.uActiveCount.value = points.length;
      uniforms.uTime.value = now;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="ps">
      <div className="ps-canvas" ref={mountRef} />
      <div className="ps-overlay">
        <span className="ps-overlay__label">Interactive sand — move your cursor</span>
      </div>
    </div>
  );
}
