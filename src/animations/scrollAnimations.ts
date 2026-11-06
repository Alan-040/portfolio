import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes the Premium Sticky Storytelling Scroll Interaction
 * - Desktop (>= 1024px): Pinned two-column storytelling experience with stationary left heading
 *   and scroll-scrubbed right column story translation.
 * - Mobile (< 1024px): Fluid single-column storytelling layout with native touch scrolling.
 */
export function setupStickyStorytellingScroll(
  sectionEl: HTMLElement,
  rightViewportEl: HTMLElement,
  rightTrackEl: HTMLElement,
  dialEl: HTMLElement,
  milestoneEls: HTMLElement[],
  onMilestoneChange: (index: number) => void
) {
  const mm = gsap.matchMedia();

  // 1. DESKTOP (>= 1024px): Pinned Two-Column Experience
  mm.add('(min-width: 1024px)', () => {
    // Calculate total translation needed so the last milestone is fully in view
    const calculateTranslation = () => {
      const trackHeight = rightTrackEl.scrollHeight || rightTrackEl.offsetHeight;
      const viewportHeight = rightViewportEl.clientHeight || rightViewportEl.offsetHeight;
      // Scroll distance to bring the bottom of the last milestone comfortably into view
      return Math.max(0, trackHeight - viewportHeight + 140);
    };

    // Total scroll distance includes translation plus a comfortable reading dwell at the end
    const calculateScrollDistance = () => {
      return calculateTranslation() + 320;
    };

    // Ambient radial dial rotation tied to scroll progress
    const dialTween = gsap.to(dialEl, {
      rotation: 360,
      ease: 'none',
      paused: true,
    });

    let lastActiveIdx = 0;

    const storyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: () => `+=${calculateScrollDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Sync clock dial rotation
          dialTween.progress(self.progress);

          // Calculate active milestone based on scroll progress through the entries (dynamically sized)
          const progress = Math.max(0, Math.min(0.999, self.progress));
          const count = milestoneEls.length || 3;
          const bestIdx = Math.min(count - 1, Math.floor(progress * count));

          if (bestIdx !== lastActiveIdx) {
            lastActiveIdx = bestIdx;
            onMilestoneChange(bestIdx);
          }
        },
      },
    });

    // Translate right column track upward
    storyTimeline.to(rightTrackEl, {
      y: () => -calculateTranslation(),
      ease: 'none',
    });

    return () => {
      storyTimeline.kill();
      dialTween.kill();
    };
  });

  // 2. MOBILE & TABLET (< 1024px): Responsive single-column touch scrolling
  mm.add('(max-width: 1023px)', () => {
    const triggers: ScrollTrigger[] = [];

    milestoneEls.forEach((el, index) => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => onMilestoneChange(index),
        onEnterBack: () => onMilestoneChange(index),
      });
      triggers.push(st);
    });

    const mobileDial = gsap.to(dialEl, {
      rotation: 240,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });

    return () => {
      triggers.forEach((t) => t.kill());
      mobileDial.kill();
    };
  });

  return () => {
    mm.revert();
  };
}

/**
 * Legacy Timeline Trigger helper (kept for backward compatibility)
 */
export function setupTimelineScrollTrigger(
  container: HTMLElement,
  dialElement: HTMLElement,
  onMilestoneChange: (index: number) => void
) {
  const milestones = Array.from(
    container.querySelectorAll('.timeline-milestone-item')
  ) as HTMLElement[];
  const rightViewport = container.querySelector(
    '.timeline-right-viewport'
  ) as HTMLElement || container;
  const rightTrack = container.querySelector(
    '.timeline-right-track'
  ) as HTMLElement || container;

  return setupStickyStorytellingScroll(
    container,
    rightViewport,
    rightTrack,
    dialElement,
    milestones,
    onMilestoneChange
  );
}

let lastAnimatedYear = '';

/**
 * Animate numeric 3D reel change for the giant year display with directional motion blur
 */
export function animateYearReel(
  yearContainer: HTMLElement,
  newYear: string
) {
  const currentEl = yearContainer.querySelector('.active-year') as HTMLElement | null;
  if (!currentEl) return;
  if (lastAnimatedYear === newYear) return;
  const previousYear = lastAnimatedYear || currentEl.textContent || '';
  lastAnimatedYear = newYear;

  if (!previousYear || previousYear === newYear) {
    currentEl.textContent = newYear;
    return;
  }

  const tl = gsap.timeline();

  tl.to(currentEl, {
    y: -44,
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.94,
    duration: 0.2,
    ease: 'power2.in',
  })
    .call(() => {
      currentEl.textContent = newYear;
    })
    .fromTo(
      currentEl,
      { y: 44, opacity: 0, filter: 'blur(8px)', scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.36,
        ease: 'back.out(1.4)',
      }
    );

  return tl;
}

/**
 * Entrance animation for Magic Section ("Magic happens behind the doors")
 */
export function animateMagicSectionEntrance(container: HTMLElement) {
  const heading = container.querySelector('.doors-heading');
  const doors = container.querySelectorAll('.door-card-item');
  const drawer = container.querySelector('.door-drawer');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 75%',
    },
  });

  if (heading) {
    tl.fromTo(
      heading,
      { y: 36, opacity: 0, filter: 'blur(4px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
    );
  }

  if (doors.length > 0) {
    tl.fromTo(
      doors,
      {
        y: 60,
        opacity: 0,
        rotateX: 18,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.45'
    );
  }

  if (drawer) {
    tl.fromTo(
      drawer,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.3'
    );
  }

  return tl;
}

/**
 * Entrance animation for Contact section
 */
export function animateContactEntrance(container: HTMLElement) {
  const badge = container.querySelector('.contact-badge');
  const heading = container.querySelector('.contact-heading');
  const desc = container.querySelector('.contact-desc');
  const cards = container.querySelectorAll('.contact-card-anim');
  const socials = container.querySelectorAll('.contact-social-item');
  const footer = container.querySelector('.contact-minimal-footer');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 75%',
    },
  });

  if (badge) {
    tl.fromTo(
      badge,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }

  if (heading) {
    tl.fromTo(
      heading,
      { opacity: 0, y: 36, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' },
      '-=0.3'
    );
  }

  if (desc) {
    tl.fromTo(
      desc,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.45'
    );
  }

  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)' },
      '-=0.35'
    );
  }

  if (socials.length > 0) {
    tl.fromTo(
      socials,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );
  }

  if (footer) {
    tl.fromTo(
      footer,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );
  }

  return tl;
}

/**
 * Entrance animation for Web Development Showcase view
 */
export function animateWebDevEntrance(container: HTMLElement) {
  const header = container.querySelector('.showcase-header');
  const cards = container.querySelectorAll('.showcase-card');
  const backBtn = container.querySelector('.showcase-back-btn');

  const tl = gsap.timeline({ delay: 0.1 });

  if (backBtn) {
    tl.fromTo(
      backBtn,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
    );
  }

  if (header) {
    tl.fromTo(
      header,
      { opacity: 0, y: 30, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
      '-=0.4'
    );
  }

  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.18, ease: 'power3.out' },
      '-=0.3'
    );
  }

  return tl;
}
