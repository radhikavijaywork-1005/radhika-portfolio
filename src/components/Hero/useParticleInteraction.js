import { useRef, useCallback } from 'react';

/**
 * useParticleInteraction - Manages cursor-relative portrait rotation
 *
 * Key behavior:
 * - Rotation is based on cursor position RELATIVE TO PORTRAIT CENTER
 * - Max Y rotation: ±12 degrees (left/right)
 * - Max X rotation: ±8 degrees (up/down)
 * - Smooth lerping for premium feel
 * - Idle breathing motion when cursor not moving
 * - NO scroll-based rotation
 */
export function useParticleInteraction() {
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const canvasCenter = useRef({ x: 0, y: 0 });
  const idlePhase = useRef(0);
  const lastMouseTime = useRef(Date.now());

  // Constants
  const MAX_X_ROTATION = (8 * Math.PI) / 180; // 8 degrees in radians
  const MAX_Y_ROTATION = (12 * Math.PI) / 180; // 12 degrees in radians
  const IDLE_AMPLITUDE = 0.02; // Subtle breathing
  const IDLE_SPEED = 0.5; // Cycles per second

  /**
   * Calculate cursor position relative to portrait center
   * Returns normalized values in range [-1, 1]
   */
  const getCursorRelativePosition = useCallback((clientX, clientY) => {
    // Get canvas bounds (portrait is centered on canvas)
    const canvas = document.querySelector('canvas');
    if (!canvas) return { relX: 0, relY: 0 };

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to [-1, 1] range based on viewport
    const relX = (clientX - centerX) / (rect.width / 2);
    const relY = (clientY - centerY) / (rect.height / 2);

    // Clamp to [-1, 1]
    return {
      relX: Math.max(-1, Math.min(1, relX)),
      relY: Math.max(-1, Math.min(1, relY)),
    };
  }, []);

  /**
   * Handle mouse move - update target rotation based on cursor position
   */
  const handleMouseMove = useCallback((event) => {
    lastMouseTime.current = Date.now();

    const { relX, relY } = getCursorRelativePosition(event.clientX, event.clientY);

    // Map cursor position to rotation
    // Left cursor → positive Y rotation (look left)
    // Right cursor → negative Y rotation (look right)
    targetRotation.current.y = relX * MAX_Y_ROTATION;

    // Up cursor → positive X rotation (look up)
    // Down cursor → negative X rotation (look down)
    targetRotation.current.x = -relY * MAX_X_ROTATION;
  }, [getCursorRelativePosition]);

  /**
   * Handle mouse enter - activate interactive mode
   */
  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    lastMouseTime.current = Date.now();
  }, []);

  /**
   * Handle mouse leave - reset to neutral orientation
   */
  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    targetRotation.current = { x: 0, y: 0 };
  }, []);

  /**
   * Update idle breathing motion when cursor not moving
   */
  const updateIdleMotion = useCallback((elapsedTime) => {
    // Subtle floating/breathing motion
    idlePhase.current = elapsedTime * IDLE_SPEED * Math.PI * 2;

    targetRotation.current.x = Math.sin(idlePhase.current) * IDLE_AMPLITUDE;
    targetRotation.current.y = Math.cos(idlePhase.current * 0.7) * IDLE_AMPLITUDE * 1.5;
  }, []);

  return {
    targetRotation: targetRotation.current,
    currentRotation: currentRotation.current,
    isHovering: isHovering.current,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    updateIdleMotion,
  };
}
