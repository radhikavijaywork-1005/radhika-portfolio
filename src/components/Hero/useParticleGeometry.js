import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * useParticleGeometry - Generate BufferGeometry from portrait maps
 * Returns both geometry and loading state
 */
export function useParticleGeometry(portraitImageUrl, depthImageUrl, densityImageUrl, particleCount) {
  const [geometry, setGeometry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const textureLoaderRef = useRef(new THREE.TextureLoader());

  useEffect(() => {
    setIsLoading(true);

    if (!portraitImageUrl) {
      // Generate simulated geometry for demo
      const geom = generateSimulatedGeometry(particleCount);
      setGeometry(geom);
      setIsLoading(false);
      return;
    }

    // Load real textures with error handling
    Promise.all([
      textureLoaderRef.current.loadAsync(portraitImageUrl).catch(err => {
        console.warn('Failed to load portrait texture:', err);
        return null;
      }),
      depthImageUrl ? textureLoaderRef.current.loadAsync(depthImageUrl).catch(() => null) : Promise.resolve(null),
      densityImageUrl ? textureLoaderRef.current.loadAsync(densityImageUrl).catch(() => null) : Promise.resolve(null),
    ]).then(([portraitTex, depthTex, densityTex]) => {
      if (portraitTex) {
        const geom = generateGeometryFromTextures(portraitTex, depthTex, densityTex, particleCount);
        setGeometry(geom);
      } else {
        // Fallback to simulated if loading failed
        const geom = generateSimulatedGeometry(particleCount);
        setGeometry(geom);
      }
      setIsLoading(false);
    }).catch(err => {
      console.error('Texture loading error:', err);
      const geom = generateSimulatedGeometry(particleCount);
      setGeometry(geom);
      setIsLoading(false);
    });
  }, [portraitImageUrl, depthImageUrl, densityImageUrl, particleCount]);

  return { geometry, isLoading };
}

/**
 * Generate simulated portrait geometry for demo/testing
 */
function generateSimulatedGeometry(particleCount) {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  let particleIndex = 0;

  for (let i = 0; i < particleCount && particleIndex < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random();

    let x = Math.cos(angle) * distance * 5;
    let y = Math.sin(angle) * distance * 6;
    let z = (Math.random() - 0.5) * 0.5;

    const featureDensity = getProceduralDensity(x, y);
    if (Math.random() > featureDensity) continue;

    if (Math.abs(y) < 2 && Math.abs(x) < 3) {
      z += (Math.random() - 0.5) * 0.3;
    }

    positions[particleIndex * 3] = x;
    positions[particleIndex * 3 + 1] = y;
    positions[particleIndex * 3 + 2] = z;

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

/**
 * Generate geometry from actual textures
 */
function generateGeometryFromTextures(portraitTex, depthTex, densityTex, particleCount) {
  try {
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

      if (a < 128) continue;

      if (densityCanvas) {
        const densityVal = densityCanvas.data[i] / 255;
        if (Math.random() > densityVal) continue;
      } else if (r < 50 && g < 50 && b < 50) {
        continue;
      }

      const pixelIndex = i / 4;
      const pixelX = pixelIndex % canvas.width;
      const pixelY = Math.floor(pixelIndex / canvas.width);

      const x = (pixelX / canvas.width - 0.5) * 10;
      const y = -(pixelY / canvas.height - 0.5) * 12;

      let z = 0;
      if (depthCanvas) {
        z = (depthCanvas.data[i] / 255 - 0.5) * 0.4;
      }

      positions[particleIndex * 3] = x;
      positions[particleIndex * 3 + 1] = y;
      positions[particleIndex * 3 + 2] = z;

      colors[particleIndex * 3] = r / 255 * 0.8 + 0.2;
      colors[particleIndex * 3 + 1] = g / 255 * 0.8 + 0.2;
      colors[particleIndex * 3 + 2] = b / 255 * 0.8 + 0.2;

      sizes[particleIndex] = 0.8 + Math.random() * 0.4;

      particleIndex++;
    }

    // Fill remaining
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
  } catch (err) {
    console.error('Geometry generation error:', err);
    return generateSimulatedGeometry(particleCount);
  }
}

function getCanvasFromTexture(texture) {
  const canvas = document.createElement('canvas');
  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(texture.image, 0, 0);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
