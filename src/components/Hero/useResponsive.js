import { useEffect, useRef, useState } from 'react';

/**
 * useResponsive - Adaptive particle counts and sizing for performance
 *
 * Desktop (high-end): 350k-600k particles
 * Mobile (optimized): 50k-120k particles
 */
export function useResponsive() {
  const [particleCount, setParticleCount] = useState(400000);
  const [particleSize, setParticleSize] = useState(1.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateSettings = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      // Detect mobile
      const mobile = width < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Mobile: reduced particle count
        let count = 60000; // Base count for mobile

        // Adjust based on device capability
        if (pixelRatio >= 3) {
          // High-DPI mobile (flagship phones)
          count = 100000;
        } else if (pixelRatio <= 1.5) {
          // Low-DPI or older phones
          count = 40000;
        }

        setParticleCount(count);
        setParticleSize(1.2); // Slightly larger on mobile for visibility
      } else {
        // Desktop: high particle count
        let count = 400000; // Base desktop count

        // Adjust based on performance
        if (pixelRatio >= 2) {
          // High-DPI desktop (4K, retina)
          count = 550000;
        } else {
          // Standard desktop
          count = 350000;
        }

        setParticleCount(count);
        setParticleSize(1.5);
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
