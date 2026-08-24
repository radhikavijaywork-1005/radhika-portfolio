import { useEffect, useRef, useState } from 'react';

/**
 * useResponsive - Adaptive particle counts and sizing for performance
 *
 * Desktop (high-end): 350k-600k particles
 * Mobile (optimized): 50k-120k particles
 */
export function useResponsive() {
  const [particleCount, setParticleCount] = useState(140000);
  const [particleSize, setParticleSize] = useState(1.2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateSettings = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Mobile: reduced particle count, sized for our ~1024px source maps
        let count = 35000;
        if (pixelRatio >= 3) count = 55000;
        else if (pixelRatio <= 1.5) count = 25000;

        setParticleCount(count);
        setParticleSize(1.4);
      } else {
        // Desktop: tuned to what our source portrait maps can meaningfully
        // resolve (~1024x1024) — higher counts here just resample the same
        // pixels more densely without adding real detail.
        let count = 110000;
        if (pixelRatio >= 2) count = 160000;

        setParticleCount(count);
        setParticleSize(1.2);
      }
    };

    calculateSettings();

    // Recalculate on resize
    const handleResize = () => {
      calculateSettings();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { particleCount, particleSize, isMobile };
}
