import React, { useEffect, useRef } from 'react';
import { ProjectCard, ProjectData } from '../components/ProjectCard';
import { ArrowLeft } from 'lucide-react';
import { animateWebDevEntrance } from '../animations/scrollAnimations';

export const WEB_PROJECTS: ProjectData[] = [
  {
    id: 'sundown',
    badge: 'WEBSITE BUILD',
    title: 'Sundown Studio',
    category: 'Studio website',
    description:
      'An editorial website for a multi-disciplinary studio that creates spaces and experiences; oversized type, a soft red glow that follows the story and a project list that reveals imagery on hover.',
    tags: ['Design & build', 'Motion', 'Hover interactions'],
    ctaLabel: 'Screen recording of the build',
    ctaLink: '#',
    isExternal: false,
    monitorPosition: 'right',
    mockupImage: '/images/sundown-mockup.webp',
    mockupPlaceholder: '/images/placeholders/placeholder-sundown.webp',
    screenContent: {
      type: 'sundown',
      headline: 'SPACES THAT INSPIRE',
      accentColor: '#FE3211',
    },
  },
  {
    id: 'portfolio',
    badge: 'WEBSITE BUILD',
    title: 'Personal portfolio',
    category: 'Product designer portfolio',
    description:
      'A dark, type-led portfolio with a large display headline, a project list with hover previews and an about section.',
    tags: ['Design & build', 'Typography', 'Hover previews'],
    ctaLabel: 'Screen recording of the build',
    ctaLink: '#',
    isExternal: false,
    monitorPosition: 'left',
    mockupImage: '/images/portfolio-mockup.webp',
    mockupPlaceholder: '/images/placeholders/placeholder-portfolio.webp',
    screenContent: {
      type: 'portfolio',
      headline: 'PRODUCT DESIGNER',
    },
  },
  {
    id: 'zerodha',
    badge: 'QUICKO • LIVE',
    title: 'P&L Page for Zerodha',
    category: 'Broker landing page • pnl.page',
    description:
      'Landing page that helps Zerodha users connect their demat account, track profit & loss, download tax-ready reports and share verified P&L with their tax advisor.',
    tags: ['Landing page', 'Responsive build', 'SEO'],
    ctaLabel: 'Visit live site',
    ctaLink: 'https://pnl.page',
    isExternal: true,
    monitorPosition: 'right',
    mockupImage: '/images/zerodha-mockup.webp',
    mockupPlaceholder: '/images/placeholders/placeholder-zerodha.webp',
    screenContent: {
      type: 'zerodha',
      headline: 'Track Zerodha P&L',
      accentColor: '#00D09C',
    },
  },
];

interface WebDevelopmentSectionProps {
  onBackToDoors: () => void;
  isLightMode?: boolean;
}

export const WebDevelopmentSection: React.FC<WebDevelopmentSectionProps> = ({
  onBackToDoors,
  isLightMode = false,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateWebDevEntrance(sectionRef.current);
    }
  }, []);

  return (
    <section
      id="web-dev-showcase"
      ref={sectionRef}
      className={`min-h-screen pt-28 pb-32 px-6 md:px-12 max-w-[1360px] mx-auto transition-colors duration-300 ${
        isLightMode ? 'text-[#121316]' : 'text-white'
      }`}
    >
      {/* Floating Bottom-Left Button: Back to the doors */}
      <button
        onClick={onBackToDoors}
        className="showcase-back-btn fixed bottom-8 left-6 md:left-12 z-40 px-5 py-2.5 rounded-full bg-[#18191E]/90 hover:bg-[#25272F] backdrop-blur-md border border-white/15 text-white text-xs font-medium tracking-tight shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
        data-cursor="RETURN"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to the doors</span>
      </button>

      {/* Showcase Header */}
      <div className="showcase-header mb-16 space-y-3">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Web Development
        </h2>
        <p className="text-sm md:text-base opacity-60 max-w-xl font-mono">
          Selected client projects & 26+ responsive front-end, SEO and launch builds.
        </p>
      </div>

      {/* Stacked Project Cards */}
      <div className="space-y-16">
        {WEB_PROJECTS.map((project) => (
          <div key={project.id} className="showcase-card">
            <ProjectCard
              project={project}
              isLightMode={isLightMode}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
