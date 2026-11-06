import gsap from 'gsap';

/**
 * Applies subtle 3D tilt parallax to the desktop monitor mockup based on cursor position
 */
export function setupMonitorTiltParallax(
  monitorElement: HTMLElement,
  containerElement: HTMLElement
) {
  const onMouseMove = (e: MouseEvent) => {
    const rect = containerElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    const rotX = yPct * -10; // max ±5deg
    const rotY = xPct * 10;  // max ±5deg

    gsap.to(monitorElement, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const onMouseLeave = () => {
    gsap.to(monitorElement, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  containerElement.addEventListener('mousemove', onMouseMove);
  containerElement.addEventListener('mouseleave', onMouseLeave);

  return () => {
    containerElement.removeEventListener('mousemove', onMouseMove);
    containerElement.removeEventListener('mouseleave', onMouseLeave);
  };
}

/**
 * Animates floating hover bob for speech bubbles and back-to-doors pill
 */
export function animateFloatingBadge(badgeElement: HTMLElement) {
  return gsap.to(badgeElement, {
    y: -6,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

