import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useParticleGeometry } from './useParticleGeometry';

/**
 * Procedurally builds a soft circular sprite (radial gradient, white to
 * transparent) so THREE.Points renders as dots instead of the default
 * hard-edged squares — squares overlapping at high particle counts is what
 * was reading as a solid gray blob instead of a point cloud.
 */
function createCircleSprite() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ParticlePoints({ particleCount = 120000, particleSize = 1.2 }) {
  const { geometry, isLoading } = useParticleGeometry(
    '/assets/particle-portrait-mask.png',
    '/assets/particle-depth-map.png',
    '/assets/particle-density-map.png',
    particleCount
  );

  const spriteMap = useMemo(() => createCircleSprite(), []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: particleSize * 0.06, // world-unit scale, tuned for geometry span of ~8 units
      map: spriteMap,
      alphaMap: spriteMap,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [particleSize, spriteMap]);

  if (!geometry || isLoading) {
    return null;
  }

  return <points geometry={geometry} material={material} />;
}
