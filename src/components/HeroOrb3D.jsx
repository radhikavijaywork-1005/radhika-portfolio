import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// A genuinely rotatable 3D object — real geometry with real sides, unlike
// the flat illustration this replaces. Continuous auto-rotation means you
// see all of it (front, side, back) without needing to interact at all;
// cursor movement adds a small extra tilt on top of that base rotation
// rather than being the only source of motion.
//
// Low-poly + flat shading (not a heavily-subdivided distorted blob) is
// the deliberate choice here: distinct flat facets each catch the light
// differently as the shape turns, which is what actually reads as "this
// has sides" — a smooth/organic surface just reads as one continuous
// blob no matter how much it rotates.
const FOREST = "#1c3a31";
const SAGE = "#b3c1b4";

function FacetedGem() {
  const meshRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Slow continuous spin — this alone guarantees every facet is visible
    // over time, independent of whether the cursor ever touches it.
    mesh.rotation.y += delta * 0.3;

    // Cursor adds a small extra tilt on top of the base spin, smoothly
    // lerped, relative to the canvas center.
    const { pointer } = state;
    target.current.x = pointer.y * 0.22;
    target.current.y = pointer.x * 0.3;
    current.current.x += (target.current.x - current.current.x) * 0.05;
    current.current.y += (target.current.y - current.current.y) * 0.05;

    mesh.rotation.x = current.current.x;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <mesh ref={meshRef}>
      {/* detail: 1 keeps real flat triangular facets (80 of them) instead
          of subdividing into something that reads as a smooth sphere. */}
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={FOREST}
        roughness={0.45}
        metalness={0.15}
        flatShading
        emissive={SAGE}
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}

export default function HeroOrb3D({ className }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 32 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Three-point-ish setup instead of an Environment HDRI — no
              CDN fetch to fail or delay first paint on, and direct lights
              are exactly what makes flat-shaded facets read distinctly
              (each facet's own angle to the light source is what shows). */}
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fcfaf4" />
          <directionalLight position={[-4, -2, -3]} intensity={0.6} color={SAGE} />
          <pointLight position={[0, -3, 2]} intensity={0.3} color={SAGE} />
          <FacetedGem />
        </Suspense>
      </Canvas>
    </div>
  );
}
