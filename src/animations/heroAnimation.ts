import gsap from 'gsap';

/**
 * Initiates the 3D Rolodex card flip transition with tactile paper page physics.
 * Updates text and ID at the apex of the rotation (-85deg) when the card is edge-on,
 * preventing any pre-animation text flicker or jump.
 */
export function animateRolodexFlip(
  cardElement: HTMLElement,
  nextRole: string | { title: string; id: string },
  onMidpoint?: () => void,
  onComplete?: () => void
) {
  const textEl = cardElement.querySelector('.rolodex-text');
  const idEl = cardElement.querySelector('.rolodex-id');
  const nextTitle = typeof nextRole === 'string' ? nextRole : nextRole.title;
  const nextId = typeof nextRole === 'string' ? undefined : nextRole.id;

  const tl = gsap.timeline({
    onComplete,
  });

  tl.to(cardElement, {
    rotateX: -85,
    duration: 0.28,
    ease: 'power2.in',
    transformOrigin: 'top center',
    boxShadow: '0 24px 36px rgba(0,0,0,0.45)',
    filter: 'brightness(0.92)',
  })
    .call(() => {
      if (textEl) {
        textEl.textContent = nextTitle;
      }
      if (idEl && nextId) {
        idEl.textContent = nextId;
      }
      if (onMidpoint) {
        onMidpoint();
      }
    })
    .set(cardElement, {
      rotateX: 85,
      filter: 'brightness(0.92)',
    })
    .to(cardElement, {
      rotateX: 0,
      duration: 0.42,
      ease: 'back.out(1.5)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
      filter: 'brightness(1)',
    });

  return tl;
}

/**
 * Animates the hanging light cord pull and spring release with pendulum oscillation
 */
export function animatePullCord(
  cordElement: HTMLElement,
  beadElement: HTMLElement,
  onToggleTheme: () => void
) {
  const tl = gsap.timeline();

  tl.to([cordElement, beadElement], {
    y: 36,
    duration: 0.16,
    ease: 'power2.out',
  })
    .call(onToggleTheme)
    .to([cordElement, beadElement], {
      y: -8,
      duration: 0.35,
      ease: 'elastic.out(1.2, 0.35)',
    })
    .to([cordElement, beadElement], {
      y: 0,
      duration: 0.25,
      ease: 'power2.out',
    });

  return tl;
}

/**
 * Master entrance choreography for the Hero section:
 * Staggered text, clip-path masked portrait reveal, and controlled scale deceleration
 */
export function animateHeroEntrance(container: HTMLElement) {
  const tl = gsap.timeline({ delay: 0.15 });

  // 1. Staggered typography entrance
  const textElements = container.querySelectorAll('.hero-stagger');
  tl.fromTo(
    textElements,
    {
      y: 32,
      opacity: 0,
      filter: 'blur(4px)',
    },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
    }
  );

  // 2. Rolodex card entrance with subtle 3D overshoot
  const rolodexCard = container.querySelector('.hero-rolodex');
  if (rolodexCard) {
    tl.fromTo(
      rolodexCard,
      {
        rotateX: 45,
        y: 20,
        opacity: 0,
      },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'back.out(1.4)',
      },
      '-=0.55'
    );
  }

  // 3. Portrait image container clip-path masked entrance
  const portraitMask = container.querySelector('.hero-portrait-mask');
  const portraitImg = container.querySelector('.hero-portrait-img');

  if (portraitMask && portraitImg) {
    tl.fromTo(
      portraitMask,
      {
        clipPath: 'inset(100% 0% 0% 0% round 16px)',
        opacity: 0,
      },
      {
        clipPath: 'inset(0% 0% 0% 0% round 16px)',
        opacity: 1,
        duration: 1.1,
        ease: 'power3.inOut',
      },
      '-=0.7'
    ).fromTo(
      portraitImg,
      {
        scale: 1.08,
      },
      {
        scale: 1,
        duration: 1.3,
        ease: 'power3.out',
      },
      '<'
    );
  }

  // 4. Lapel Badge subtle float entrance
  const lapelBadge = container.querySelector('.hero-lapel-badge');
  if (lapelBadge) {
    tl.fromTo(
      lapelBadge,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.8)',
      },
      '-=0.4'
    );
  }

  // 5. Hanging Pull-Chain entrance from top viewport
  const pullChain = document.querySelector('.hero-pull-chain');
  if (pullChain) {
    tl.fromTo(
      pullChain,
      { y: -80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.6)',
      },
      '-=0.8'
    );
  }

  // 6. Bottom status bar fade in
  const statusBar = container.querySelector('.hero-status-bar');
  if (statusBar) {
    tl.fromTo(
      statusBar,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  return tl;
}
