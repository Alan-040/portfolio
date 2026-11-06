import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  delay = 0,
  triggerOnScroll = false,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (triggerOnScroll) {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );
    } else {
      gsap.fromTo(
        el,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay,
          ease: 'power2.out',
        }
      );
    }
  }, [delay, triggerOnScroll]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};

