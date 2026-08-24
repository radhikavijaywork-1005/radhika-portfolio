import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useParticleGeometry(portraitImageUrl, depthImageUrl, densityImageUrl, particleCount) {
  const [geometry, setGeometry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (!portraitImageUrl) {
      const geom = generateSimulatedGeometry(particleCount);
      if (!cancelled) {
        setGeometry(geom);
        setIsLoading(false);
      }
      return () => { cancelled = true; };
    }

    loadTexturesAndGenerateGeometry(portraitImageUrl, depthImageUrl, densityImageUrl, particleCount)
      .then(geom => {
        if (!cancelled) {
          setGeometry(geom);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to generate geometry:', err);
        if (!cancelled) {
          setGeometry(generateSimulatedGeometry(particleCount));
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [portraitImageUrl, depthImageUrl, densityImageUrl, particleCount]);

  return { geometry, isLoading };
}

async function loadTexturesAndGenerateGeometry(portraitUrl, depthUrl, densityUrl, particleCount) {
  const loader = new THREE.TextureLoader();
  const portraitTex = await loader.loadAsync(portraitUrl);
  const depthTex = depthUrl ? await loader.loadAsync(depthUrl) : null;
  const densityTex = densityUrl ? await loader.loadAsync(densityUrl) : null;
  return generateGeometryFromTextures(portraitTex, depthTex, densityTex, particleCount);
}

function toImageData(tex) {
  const canvas = document.createElement('canvas');
  canvas.width = tex.image.width;
  canvas.height = tex.image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(tex.image, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Generates particles strictly from real image data — no random padding.
 * Particles are white/light-gray (per spec), modulated by source luminance,
 * NOT literal photo color, so it reads as a clean point-cloud, not a photo.
 */
function generateGeometryFromTextures(portraitTex, depthTex, densityTex, maxCount) {
  const portrait = toImageData(portraitTex);
  const depthData = depthTex ? toImageData(depthTex) : null;
  const densityData = densityTex ? toImageData(densityTex) : null;

  const w = portrait.width;
  const h = portrait.height;
  const px = portrait.data;

  // Pass 1: collect candidate pixels above a background-luminance floor.
  const candidates = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = px[i], g = px[i + 1], b = px[i + 2], a = px[i + 3];
      if (a < 50) continue;

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (luminance < 0.12) continue; // skip near-black background

      let densityProb = luminance; // fallback: brighter = more likely
      if (densityData) {
        densityProb = densityData.data[i] / 255;
      }

      candidates.push({ x, y, i, luminance, densityProb });
    }
  }

  // Pass 2: probabilistic thinning down toward maxCount, weighted by density.
  // Sort by density descending so highest-priority (face) pixels are kept first
  // when we need to cap the count.
  candidates.sort((a, b) => b.densityProb - a.densityProb);

  const kept = [];
  for (const c of candidates) {
    if (kept.length >= maxCount) break;
    if (Math.random() < Math.max(0.15, c.densityProb)) {
      kept.push(c);
    }
  }

  const count = kept.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const aspect = w / h;
  const worldWidth = 8 * aspect;
  const worldHeight = 8;

  for (let idx = 0; idx < count; idx++) {
    const { x, y, i, luminance } = kept[idx];

    const nx = (x / w - 0.5) * worldWidth;
    const ny = -(y / h - 0.5) * worldHeight;

    let z = (luminance - 0.5) * 0.3; // fallback depth from brightness
    if (depthData) {
      z = (depthData.data[i] / 255 - 0.5) * 0.8;
    }

    positions[idx * 3] = nx;
    positions[idx * 3 + 1] = ny;
    positions[idx * 3 + 2] = z;

    // White/light-gray particles, brightness driven by source luminance —
    // not literal photo RGB — per the "elegant point-cloud" spec.
    const gray = 0.55 + luminance * 0.45;
    colors[idx * 3] = gray;
    colors[idx * 3 + 1] = gray;
    colors[idx * 3 + 2] = gray;

    sizes[idx] = 0.7 + Math.random() * 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.computeBoundingSphere();

  return geometry;
}

function generateSimulatedGeometry(particleCount) {
  const positions = [];
  const colors = [];
  const sizes = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random();
    const x = Math.cos(angle) * distance * 5;
    const y = Math.sin(angle) * distance * 6;

    const density = getProceduralDensity(x, y);
    if (Math.random() > density) continue;

    const z = (Math.random() - 0.5) * 0.5;

    positions.push(x, y, z);
    const gray = 0.6 + Math.random() * 0.35;
    colors.push(gray, gray, gray);
    sizes.push(0.7 + Math.random() * 0.5);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array(sizes), 1));
  return geometry;
}

function getProceduralDensity(x, y) {
  const leftEyeDist = Math.hypot(x + 1.5, y - 1.5);
  const rightEyeDist = Math.hypot(x - 1.5, y - 1.5);
  if (leftEyeDist < 0.8 || rightEyeDist < 0.8) return 0.9;
  if (Math.abs(x) < 0.6 && Math.abs(y - 0.5) < 1.2) return 0.8;
  if (Math.abs(y + 1.5) < 0.6 && Math.abs(x) < 1.2) return 0.7;
  const faceDist = Math.hypot(x / 3, y / 3.5);
  if (faceDist < 1) return 0.6;
  return 0.1;
}
