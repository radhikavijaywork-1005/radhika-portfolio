import React, { Suspense } from 'react';
import ParticlePortraitCanvas from './ParticlePortraitCanvas';

/**
 * ParticlePortrait - Premium 3D point-cloud portrait hero
 * Responds to cursor position relative to the portrait center
 * Smooth lerping, idle breathing, mobile support
 */
export default function ParticlePortrait() {
  return (
    <div className="particle-portrait-wrapper" style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#000' }} />}>
        <ParticlePortraitCanvas />
      </Suspense>
    </div>
  );
}
