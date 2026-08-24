import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

// A genuinely rotatable 3D object — real geometry with real sides, unlike
// the flat illustration this replaces. Continuous auto-rotation means you
// see all of it (front, side, back) without needing to interact at all;
// cursor movement adds a small extra tilt on top of that base rotation
// rather than being the only source of motion.
const FOREST = "#1c3a31";
const SAGE = "#b3c1b4";

function Blob() {
  const meshRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Slow continuous spin — this alone guarantees every side is visible
    // over time, independent of whether the cursor ever touches it.
    mesh.rotation.y += delta * 0.25;

    // Cursor adds a small extra tilt on top of the base spin, smoothly
    // lerped, relative to the canvas center (same interaction shape used
    // elsewhere on the site).
    const { pointer } = state;
    target.current.x = pointer.y * 0.25;
    target.current.y = pointer.x * 0.35;
    current.current.x += (target.current.x - current.current.x) * 0.05;
    current.current.y += (target.current.y - current.current.y) * 0.05;

    mesh.rotation.x = current.current.x;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 6]} />
      <MeshDistortMaterial
        color={FOREST}
        roughness={0.35}
        metalness={0.1}
        distort={0.35}
        speed={1.4}
        emissive={SAGE}
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}

export default function HeroOrb3D({ className }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Three-point-ish setup instead of an Environment HDRI — no
              CDN fetch to fail or delay first paint on. Physical material
              still shades correctly from direct lights alone; it just
              won't have environment reflections, which isn't needed for
              a matte, faceted look. */}
          <ambientLight intensity={0.65} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fcfaf4" />
          <directionalLight position={[-4, -2, -3]} intensity={0.5} color={SAGE} />
          <pointLight position={[0, -3, 2]} intensity={0.3} color={SAGE} />
          <Blob />
        </Suspense>
      </Canvas>
    </div>
  );
}
