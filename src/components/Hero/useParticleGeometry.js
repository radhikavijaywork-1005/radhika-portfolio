import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * useParticleGeometry - Generate BufferGeometry from portrait maps
 *
 * Accepts textures for:
 * - portraitMask: defines which pixels become particles
 * - depthMap: Z-displacement for volumetric shape
 * - densityMap: particle concentration (features get more density)
 *
 * Returns THREE.BufferGeometry with positions, colors, sizes
 */
export function useParticleGeometry(portraitImageUrl, depthImageUrl, densityImageUrl, particleCount) {
  const geometryRef = useRef(null);
  const textureLoaderRef = useRef(new THREE.TextureLoader());

  useEffect(() => {
    if (!portraitImageUrl) {
      // Generate simulated geometry for demo
      geometryRef.current = generateSimulatedGeometry(particleCount);
      return;
    }

    // Load real textures
    Promise.all([
      textureLoaderRef.current.loadAsync(portraitImageUrl),
      depthImageUrl ? textureLoaderRef.current.loadAsync(depthImageUrl) : Promise.resolve(null),
      densityImageUrl ? textureLoaderRef.current.loadAsync(densityImageUrl) : Promise.resolve(null),
    ]).then(([portraitTex, depthTex, densityTex]) => {
      geometryRef.current = generateGeometryFromTextures(
        portraitTex,
        depthTex,
        densityTex,
        particleCount
      );
    });
  }, [portraitImageUrl, depthImageUrl, densityImageUrl, particleCount]);

  return geometryRef.current;
}

/**
 * Generate simulated portrait geometry for demo/testing
 * Creates a procedural face-like point cloud
 */
function generateSimulatedGeometry(particleCount) {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Create rough face shape using procedural distribution
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random();

    // Bias toward face-like shape
    let x = Math.cos(angle) * distance * 5;
    let y = Math.sin(angle) * distance * 6;
    let z = (Math.random() - 0.5) * 0.5; // Subtle depth

    // Face features density
    const featureDensity = getProceduralDensity(x, y);
    if (Math.random() > featureDensity) continue;

    // Slightly more particles in face center
    if (Math.abs(y) < 2 && Math.abs(x) < 3) {
      z += (Math.random() - 0.5) * 0.3;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Light gray/white particles
    const lightness = 0.7 + Math.random() * 0.3;
    colors[i * 3] = lightness;
    colors[i * 3 + 1] = lightness;
    colors[i * 3 + 2] = lightness;

    // Slight size variation
    sizes[i] = 0.8 + Math.random() * 0.4;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  return geometry;
}

/**
 * Procedural density map - higher in face features
 */
function getProceduralDensity(x, y) {
  // Eyes
  const leftEyeDist = Math.hypot(x + 1.5, y - 1.5);
  const rightEyeDist = Math.hypot(x - 1.5, y - 1.5);

  if (leftEyeDist < 0.8 || rightEyeDist < 0.8) return 0.9;

  // Nose
  if (Math.abs(x) < 0.6 && Math.abs(y - 0.5) < 1.2) return 0.8;

  // Mouth
  if (Math.abs(y + 1.5) < 0.6 && Math.abs(x) < 1.2) return 0.7;

  // Face outline
  const faceDist = Math.hypot(x / 3, y / 3.5);
  if (faceDist < 1) return 0.6;

  return 0.1;
}

/**
 * Generate geometry from actual textures
 * Uses density-based particle generation
 */
function generateGeometryFromTextures(portraitTex, depthTex, densityTex, particleCount) {
  const canvas = document.createElement('canvas');
  canvas.width = portraitTex.image.width;
  canvas.height = portraitTex.image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(portraitTex.image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const depthCanvas = depthTex ? getCanvasFromTexture(depthTex) : null;
  const densityCanvas = densityTex ? getCanvasFromTexture(densityTex) : null;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  let particleIndex = 0;

  // Sample pixels and create particles
  for (let i = 0; i < data.length && particleIndex < particleCount; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip fully transparent pixels
    if (a < 128) continue;

    // Use density map to probabilistically add particles
    if (densityCanvas) {
      const densityVal = densityCanvas.data[i] / 255;
      if (Math.random() > densityVal) continue;
    } else if (r < 50 && g < 50 && b < 50) {
      // Skip dark background
      continue;
    }

    const pixelIndex = i / 4;
    const pixelX = pixelIndex % canvas.width;
    const pixelY = Math.floor(pixelIndex / canvas.width);

    // Normalize to world coordinates (-5 to 5, -6 to 6)
    const x = (pixelX / canvas.width - 0.5) * 10;
    const y = -(pixelY / canvas.height - 0.5) * 12;

    // Get depth from depth map
    let z = 0;
    if (depthCanvas) {
      z = (depthCanvas.data[i] / 255 - 0.5) * 0.4; // Scale depth appropriately
    }

    positions[particleIndex * 3] = x;
    positions[particleIndex * 3 + 1] = y;
    positions[particleIndex * 3 + 2] = z;

    // Color from portrait
    colors[particleIndex * 3] = r / 255 * 0.8 + 0.2;
    colors[particleIndex * 3 + 1] = g / 255 * 0.8 + 0.2;
    colors[particleIndex * 3 + 2] = b / 255 * 0.8 + 0.2;

    sizes[particleIndex] = 0.8 + Math.random() * 0.4;

    particleIndex++;
  }

  // Fill remaining with white particles if needed
  while (particleIndex < particleCount) {
    positions[particleIndex * 3] = (Math.random() - 0.5) * 10;
    positions[particleIndex * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[particleIndex * 3 + 2] = 0;

    const lightness = 0.7 + Math.random() * 0.3;
    colors[particleIndex * 3] = lightness;
    colors[particleIndex * 3 + 1] = lightness;
    colors[particleIndex * 3 + 2] = lightness;

    sizes[particleIndex] = 0.8 + Math.random() * 0.4;

    particleIndex++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  return geometry;
}

/**
 * Helper: convert texture to canvas for pixel access
 */
function getCanvasFromTexture(texture) {
  const canvas = document.createElement('canvas');
  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(texture.image, 0, 0);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
