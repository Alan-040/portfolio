import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Only enable custom cursor on non-touch pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power3.out',
      });
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('[data-cursor]');
      if (interactive) {
        const text = interactive.getAttribute('data-cursor') || '';
        setCursorText(text);
        gsap.to(follower, {
          scale: text ? 2.5 : 1.8,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          duration: 0.25,
        });
      } else {
        setCursorText('');
        gsap.to(follower, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          duration: 0.25,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handlePointerOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handlePointerOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />

      {/* Smooth Magnetic Follower Ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity"
      >
        {cursorText && (
          <span className="text-[7px] font-mono tracking-tighter text-white uppercase font-bold">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

