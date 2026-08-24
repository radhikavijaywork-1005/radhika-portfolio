import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import ParticlePoints from './ParticlePoints';
import { useParticleInteraction } from './useParticleInteraction';
import { useResponsive } from './useResponsive';

/**
 * Canvas scene setup with interaction management
 */
function ParticleScene() {
  const groupRef = useRef(null);
  const { camera, gl } = useThree();

  const {
    targetRotation,
    currentRotation,
    isHovering,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    updateIdleMotion,
  } = useParticleInteraction();

  const { particleCount, particleSize, isMobile } = useResponsive();

  // Handle canvas-level mouse events
  useEffect(() => {
    const canvas = gl.domElement;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Animation loop: lerp rotation + idle motion
  useFrame((state) => {
    if (groupRef.current) {
      const group = groupRef.current;
      const easing = 0.08; // Smooth interpolation factor

      // Lerp to target rotation
      group.rotation.x += (targetRotation.x - group.rotation.x) * easing;
      group.rotation.y += (targetRotation.y - group.rotation.y) * easing;

      // Update idle breathing motion when not hovering
      if (!isHovering) {
        updateIdleMotion(state.clock.getElapsedTime(), group);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} near={0.1} far={1000} />

      {/* Subtle lighting for depth perception */}
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 10]} intensity={0.4} />

      {/* Particle portrait geometry */}
      <ParticlePoints
        particleCount={particleCount}
        particleSize={particleSize}
      />
    </group>
  );
}

export default function ParticlePortraitCanvas() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      performance={{ min: 0.5 }}
    >
      <ParticleScene />
    </Canvas>
  );
}
