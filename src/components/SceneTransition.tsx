import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface SceneTransitionProps {
  isActive: boolean;
  onTransitionEnd?: () => void;
  direction?: 'in' | 'out';
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  isActive,
  onTransitionEnd,
  direction = 'in',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isActive) {
      if (direction === 'in') {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: onTransitionEnd,
          }
        );
      } else {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              if (onTransitionEnd) onTransitionEnd();
            },
          }
        );
      }
    }
  }, [isActive, direction, onTransitionEnd]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-[#0D0E11] pointer-events-none opacity-0"
      aria-hidden="true"
    />
  );
};

