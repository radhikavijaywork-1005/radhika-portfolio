import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function useParticleGeometry(portraitImageUrl, depthImageUrl, densityImageUrl, particleCount) {
  const [geometry, setGeometry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    if (!portraitImageUrl) {
      const geom = generateSimulatedGeometry(particleCount);
      setGeometry(geom);
      setIsLoading(false);
      return;
    }

    loadTexturesAndGenerateGeometry(portraitImageUrl, depthImageUrl, densityImageUrl, particleCount)
      .then(geom => {
        setGeometry(geom);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to generate geometry:', err);
        const geom = generateSimulatedGeometry(particleCount);
        setGeometry(geom);
        setIsLoading(false);
      });
  }, [portraitImageUrl, depthImageUrl, densityImageUrl, particleCount]);

  return { geometry, isLoading };
}

async function loadTexturesAndGenerateGeometry(portraitUrl, depthUrl, densityUrl, particleCount) {
  const textureLoader = new THREE.TextureLoader();

  try {
    const portraitTex = await textureLoader.loadAsync(portraitUrl);
    const depthTex = depthUrl ? await textureLoader.loadAsync(depthUrl) : null;
    const densityTex = densityUrl ? await textureLoader.loadAsync(densityUrl) : null;

    return generateGeometryFromTextures(portraitTex, depthTex, densityTex, particleCount);
  } catch (err) {
    console.error('Texture loading failed:', err);
    return generateSimulatedGeometry(particleCount);
  }
}

function generateGeometryFromTextures(portraitTex, depthTex, densityTex, targetCount) {
  const canvas = document.createElement('canvas');
  canvas.width = portraitTex.image.width;
  canvas.height = portraitTex.image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(portraitTex.image, 0, 0);
  const portraitData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let depthData = null;
  if (depthTex) {
    const depthCanvas = document.createElement('canvas');
    depthCanvas.width = depthTex.image.width;
    depthCanvas.height = depthTex.image.height;
    const depthCtx = depthCanvas.getContext('2d');
    depthCtx.drawImage(depthTex.image, 0, 0);
    depthData = depthCtx.getImageData(0, 0, depthCanvas.width, depthCanvas.height);
  }

  let densityData = null;
  if (densityTex) {
    const densityCanvas = document.createElement('canvas');
    densityCanvas.width = densityTex.image.width;
    densityCanvas.height = densityTex.image.height;
    const densityCtx = densityCanvas.getContext('2d');
    densityCtx.drawImage(densityTex.image, 0, 0);
    densityData = densityCtx.getImageData(0, 0, densityCanvas.width, densityCanvas.height);
  }

  const positions = new Float32Array(targetCount * 3);
  const colors = new Float32Array(targetCount * 3);
  const sizes = new Float32Array(targetCount);

  let particleIndex = 0;
  const portraitPixels = portraitData.data;
  const depthPixels = depthData?.data;
  const densityPixels = densityData?.data;

  // Sample pixels strategically based on portrait data
  for (let i = 0; i < portraitPixels.length && particleIndex < targetCount; i += 4) {
    const r = portraitPixels[i];
    const g = portraitPixels[i + 1];
    const b = portraitPixels[i + 2];
    const a = portraitPixels[i + 3];

    // Skip fully transparent pixels
    if (a < 50) continue;

    // Skip dark background
    const brightness = (r + g + b) / 3;
    if (brightness < 40 && a < 200) continue;

    // Use density map to probabilistically create particles
    if (densityPixels) {
      const densityVal = densityPixels[i] / 255;
      // Higher density = more likely to create particle
      if (Math.random() > densityVal * 1.2) continue;
    } else {
      // Without density map, sample uniformly but skip dark areas
      if (Math.random() > 0.3) continue;
    }

    // Convert pixel position to 3D world space
    const pixelIndex = i / 4;
    const pixelX = pixelIndex % canvas.width;
    const pixelY = Math.floor(pixelIndex / canvas.width);

    // Normalize to [-1, 1] then scale
    const x = ((pixelX / canvas.width) - 0.5) * 10;
    const y = -((pixelY / canvas.height) - 0.5) * 12;

    // Get depth from depth map
    let z = 0;
    if (depthPixels) {
      const depthVal = depthPixels[i] / 255;
      z = (depthVal - 0.5) * 0.6; // Scale depth appropriately
    } else {
      z = (Math.random() - 0.5) * 0.2;
    }

    // Set position
    positions[particleIndex * 3] = x;
    positions[particleIndex * 3 + 1] = y;
    positions[particleIndex * 3 + 2] = z;

    // Set color - enhance to be lighter/whiter
    const colorScale = 1.1; // Boost brightness
    colors[particleIndex * 3] = Math.min(1, (r / 255) * colorScale);
    colors[particleIndex * 3 + 1] = Math.min(1, (g / 255) * colorScale);
    colors[particleIndex * 3 + 2] = Math.min(1, (b / 255) * colorScale);

    // Random size variation for organic look
    sizes[particleIndex] = 0.6 + Math.random() * 0.4;

    particleIndex++;
  }

  // Fill remaining with fallback if needed
  while (particleIndex < targetCount) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random();

    positions[particleIndex * 3] = Math.cos(angle) * dist * 5;
    positions[particleIndex * 3 + 1] = Math.sin(angle) * dist * 6;
    positions[particleIndex * 3 + 2] = (Math.random() - 0.5) * 0.3;

    const gray = 0.6 + Math.random() * 0.4;
    colors[particleIndex * 3] = gray;
    colors[particleIndex * 3 + 1] = gray;
    colors[particleIndex * 3 + 2] = gray;

    sizes[particleIndex] = 0.6 + Math.random() * 0.4;

    particleIndex++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  return geometry;
}

function generateSimulatedGeometry(particleCount) {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  let particleIndex = 0;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random();

    let x = Math.cos(angle) * distance * 5;
    let y = Math.sin(angle) * distance * 6;
    let z = (Math.random() - 0.5) * 0.5;

    const density = getProceduralDensity(x, y);
    if (Math.random() > density) continue;

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

    sizes[particleIndex] = 0.6 + Math.random() * 0.4;

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
