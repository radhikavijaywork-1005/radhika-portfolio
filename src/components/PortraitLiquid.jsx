import { useEffect, useRef } from "react";
import * as THREE from "three";

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

export default function PortraitLiquid({ src, alt, className, ariaHidden }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
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

    let raf = null;
    const animate = () => {
      currentHover += (targetHover - currentHover) * 0.08;
      uniforms.uHover.value = currentHover;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [src]);

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
