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
 * - No shadow rendering (too expensive for 30k-600k particles)
 */
export default function ParticlePoints({ particleCount = 400000, particleSize = 1.5 }) {
  // Generate or update geometry based on particle count
  const geometry = useParticleGeometry(
    '/assets/particle-portrait-mask.png',  // Your portrait mask
    '/assets/particle-depth-map.png',      // Volumetric depth
    '/assets/particle-density-map.png',    // Feature concentration
    particleCount
  );

  // Create material with size attenuation for depth effect
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: particleSize * 0.8, // Slightly smaller for finer detail
      sizeAttenuation: true, // Critical for 3D depth effect
      vertexColors: true, // Use color attribute from geometry
      transparent: true,
      opacity: 0.85, // Slightly transparent for elegance
      depthWrite: false, // Prevent z-fighting with many particles
      toneMapped: false, // Prevent tonemapping interference
    });
  }, [particleSize]);

  if (!geometry) {
    return null;
  }

  return (
    <points geometry={geometry} material={material} />
  );
}
