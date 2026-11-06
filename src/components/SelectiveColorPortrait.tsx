import React, { useRef, useCallback, useEffect } from 'react';

interface SelectiveColorPortraitProps {
  className?: string;
  isLightMode?: boolean;
}

export const SelectiveColorPortrait: React.FC<SelectiveColorPortraitProps> = ({
  className = '',
  isLightMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorLayerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isDarkMode = !isLightMode;

  // Apply circular radial gradient mask centered at (x, y) relative to container
  const updateMask = useCallback((x: number, y: number, containerWidth: number) => {
    if (!colorLayerRef.current) return;
    // Responsive lens radius: ~32% of container width (clamped between 95px and 145px)
    const radius = Math.max(95, Math.min(145, Math.round(containerWidth * 0.32)));

    // Soft feathered edge: 100% full-colour in center (0%-35%), feathered to 100% grayscale at edge
    const maskValue = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, black 35%, transparent 100%)`;

    const style = colorLayerRef.current.style;
    style.webkitMaskImage = maskValue;
    style.maskImage = maskValue;
    style.webkitMaskRepeat = 'no-repeat';
    style.maskRepeat = 'no-repeat';
  }, []);

  const handlePointerEnter = useCallback(
    (clientX: number, clientY: number) => {
      // Only active in Dark Mode
      if (!isDarkMode || !containerRef.current || !colorLayerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round(clientX - rect.left);
      const y = Math.round(clientY - rect.top);

      updateMask(x, y, rect.width);
      colorLayerRef.current.style.opacity = '1';
    },
    [isDarkMode, updateMask]
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      // Only active in Dark Mode
      if (!isDarkMode || !containerRef.current || !colorLayerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round(clientX - rect.left);
      const y = Math.round(clientY - rect.top);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateMask(x, y, rect.width);
        if (colorLayerRef.current) {
          colorLayerRef.current.style.opacity = '1';
        }
      });
    },
    [isDarkMode, updateMask]
  );

  const handlePointerLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (colorLayerRef.current) {
      colorLayerRef.current.style.opacity = '0';
    }
  }, []);

  // Desktop Mouse Handlers
  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerEnter(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onMouseLeave = () => {
    handlePointerLeave();
  };

  // Mobile Touch Handlers
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handlePointerEnter(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchEnd = () => {
    handlePointerLeave();
  };

  // Reset top layer opacity and cleanup RAF on theme change or unmount
  useEffect(() => {
    if (colorLayerRef.current) {
      colorLayerRef.current.style.opacity = '0';
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLightMode]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onPointerLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      className={`relative w-full rounded-2xl overflow-hidden select-none ${
        isDarkMode ? 'cursor-crosshair' : 'cursor-default'
      } ${className}`}
      data-cursor={isDarkMode ? 'COLOUR' : undefined}
    >
      {/* Bottom Layer: Authentic profile photograph. In Dark Mode: 100% Grayscale. In Light Mode: Original full colour. */}
      <img
        src="/images/profile-original.png"
        alt="Boobalan - Authentic Portrait"
        width={720}
        height={1280}
        loading="eager"
        {...{ fetchpriority: 'high' }}
        decoding="async"
        draggable={false}
        className="w-full h-auto block select-none pointer-events-none will-change-transform"
        style={{
          filter: isDarkMode ? 'grayscale(100%)' : 'none',
          WebkitFilter: isDarkMode ? 'grayscale(100%)' : 'none',
          transition: 'filter 0.4s ease-out, -webkit-filter 0.4s ease-out',
        }}
      />

      {/* Top Layer: Original Full-Colour Photograph with Circular Radial-Gradient Reveal Mask (Active in Dark Mode) */}
      <div
        ref={colorLayerRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-300 ease-out select-none"
        style={{
          opacity: 0,
        }}
      >
        <img
          src="/images/profile-original.png"
          alt=""
          width={720}
          height={1280}
          aria-hidden="true"
          draggable={false}
          className="w-full h-auto block select-none pointer-events-none"
        />
      </div>
    </div>
  );
};
