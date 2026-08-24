import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";
import heroLineColorLight from "../assets/site/hero-line-color.png";
import heroLineColorDark from "../assets/site/hero-line-color-dark.png";

// Your actual illustration, given real 3D thickness — not an abstract
// shape, and not a displacement hack on the flat image (tried that; a
// line-art image's hard edges tore into jagged fringes under vertex
// displacement, since there's no real depth data underneath it).
//
// This instead builds a solid card/plaque: your portrait on the front
// face, a solid brand color on the back, and solid edge faces for the
// visible thickness in between. Front/back/edges are real, distinct
// BoxGeometry faces — as it rotates you genuinely see the portrait, then
// the edge (with real depth), then the back, which is what "rotating,
// has all sides" means for an object that only has one drawn view to
// start from.
//
// BoxGeometry over a multi-material ExtrudeGeometry deliberately: an
// extruded shape's front/back-cap vs side-wall face groups aren't
// reliably ordered across three.js versions, which risks silently
// putting the portrait texture on the wrong faces again. BoxGeometry's
// six faces are fixed, documented order: [+x, -x, +y, -y, +z, -z].
const PAPER_LIGHT = "#fcfaf4";
const PAPER_DARK = "#14201a";
const SAGE = "#b3c1b4";
const FOREST = "#1c3a31";

// Composites the (transparent-background) illustration over a solid
// paper-color fill on an offscreen canvas — a solid 3D object's front
// face needs an opaque texture; the PNG's real transparency would
// otherwise read as literal holes in the object rather than background.
function buildFrontTexture(image, bgColor) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function Plaque({ frontTexture }) {
  const meshRef = useRef(null);
  const current = useRef({ x: 0 });

  const width = 1.3;
  const height = width * (1200 / 1008); // matches the illustration's own aspect ratio
  const depth = 0.16;

  const geometry = useMemo(
    () => new THREE.BoxGeometry(width, height, depth),
    [width, height, depth],
  );

  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: SAGE, roughness: 0.55, metalness: 0.12 });
    const back = new THREE.MeshStandardMaterial({ color: FOREST, roughness: 0.5, metalness: 0.08 });
    const front = new THREE.MeshStandardMaterial({
      map: frontTexture || null,
      color: frontTexture ? "#ffffff" : PAPER_LIGHT,
      roughness: 0.55,
      metalness: 0.02,
    });
    // Fixed BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back).
    return [edge, edge, edge, edge, front, back];
  }, [frontTexture]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y += delta * 0.28;

    const { pointer } = state;
    const targetX = pointer.y * 0.16;
    current.current.x += (targetX - current.current.x) * 0.05;
    mesh.rotation.x = current.current.x;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
  });

  return <mesh ref={meshRef} geometry={geometry} material={materials} />;
}

function Scene({ src }) {
  const [frontTexture, setFrontTexture] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const bg = theme === "dark" ? PAPER_DARK : PAPER_LIGHT;
      setFrontTexture(buildFrontTexture(img, bg));
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, theme]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#fcfaf4" />
      <directionalLight position={[-4, -2, -3]} intensity={0.55} color={SAGE} />
      <pointLight position={[0, -3, 2]} intensity={0.3} color={SAGE} />
      <Plaque frontTexture={frontTexture} />
    </>
  );
}

export default function HeroOrb3D({ className }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? heroLineColorDark : heroLineColorLight;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 30 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene src={src} />
        </Suspense>
      </Canvas>
    </div>
  );
}
