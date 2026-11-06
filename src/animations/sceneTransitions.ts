import gsap from 'gsap';

export interface DoorTransitionParams {
  doorElement: HTMLElement;
  handleElement: HTMLElement;
  zoomTarget: HTMLElement;
  onTransitionComplete: () => void;
}

/**
 * Executes the cinematic 3D door opening and forward zoom teleportation
 */
export function executeDoorPortalZoom({
  doorElement,
  handleElement,
  zoomTarget,
  onTransitionComplete,
}: DoorTransitionParams) {
  const tl = gsap.timeline({
    onComplete: onTransitionComplete,
  });

  // 1. Depress brass handle
  tl.to(handleElement, {
    rotateZ: 14,
    duration: 0.15,
    ease: 'power2.inOut',
    transformOrigin: '20% 50%',
  })
    // 2. Door swings inward into darkness
    .to(
      doorElement,
      {
        rotateY: -82,
        duration: 0.7,
        ease: 'power3.in',
        transformOrigin: 'left center',
      },
      '+=0.05'
    )
    // 3. Zoom entire scene straight through the doorway
    .to(
      zoomTarget,
      {
        scale: 9,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in',
      },
      '-=0.45'
    );

  return tl;
}

/**
 * Reverse portal transition returning from the showcase view to the doors section
 */
export function executeReturnToDoors(
  overlayElement: HTMLElement,
  onComplete: () => void
) {
  const tl = gsap.timeline({ onComplete });

  tl.fromTo(
    overlayElement,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }
  );

  return tl;
}

