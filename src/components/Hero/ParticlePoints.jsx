import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useParticleGeometry } from './useParticleGeometry';

/**
 * ParticlePoints - Renders the 3D point cloud using THREE.Points
 *
 * Key optimizations:
 * - BufferGeometry with typed arrays (no individual React components)
 * - PointsMaterial for efficient rendering
 * - sizeAttenuation for depth perception
 */
export default function ParticlePoints({ particleCount = 400000, particleSize = 1.5 }) {
  // Generate or update geometry based on particle count
  const { geometry, isLoading } = useParticleGeometry(
    '/assets/particle-portrait-mask.png',  // Your portrait mask
    '/assets/particle-depth-map.png',      // Volumetric depth
    '/assets/particle-density-map.png',    // Feature concentration
    particleCount
  );

  // Create material with size attenuation for depth effect
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: particleSize * 0.8,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      toneMapped: false,
    });
  }, [particleSize]);

  if (!geometry || isLoading) {
    return null; // Don't render until geometry is ready
  }

  return (
    <points geometry={geometry} material={material} />
  );
}
