import React, { useRef, useEffect } from 'react';
import { setupMonitorTiltParallax } from '../animations/cardAnimations';
import { ArrowUpRight } from 'lucide-react';

export interface ProjectData {
  id: string;
  badge: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  ctaLabel?: string;
  ctaLink?: string;
  isExternal?: boolean;
  monitorPosition: 'left' | 'right';
  mockupImage?: string;
  mockupPlaceholder?: string;
  screenContent: {
    type: 'sundown' | 'portfolio' | 'zerodha';
    headline: string;
    subheadline?: string;
    accentColor?: string;
  };
}

interface ProjectCardProps {
  project: ProjectData;
  isLightMode?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isLightMode = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monitorRef.current && cardRef.current) {
      const cleanup = setupMonitorTiltParallax(monitorRef.current, cardRef.current);
      return cleanup;
    }
  }, []);

  const isMonitorRight = project.monitorPosition === 'right';

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl p-8 md:p-14 border transition-colors duration-300 ${
        isLightMode
          ? 'bg-white border-[#121316]/8 shadow-sm text-[#121316]'
          : 'bg-[#16171B] border-white/6 text-[#F7F7F8]'
      }`}
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
          isMonitorRight ? '' : 'lg:flex-row-reverse'
        }`}
      >
        {/* Project Content Column */}
        <div
          className={`lg:col-span-6 flex flex-col justify-center space-y-5 ${
            isMonitorRight ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          {/* Eyebrow / Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10 opacity-70">
              {project.badge}
            </span>
          </div>

          {/* Titles */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
              {project.title}
            </h3>
            <p className="text-sm font-medium opacity-60">
              {project.category}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base leading-relaxed opacity-75 max-w-lg">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 opacity-80"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Link or Live Button */}
          {project.ctaLabel && (
            <div className="pt-3">
              {project.isExternal ? (
                <a
                  href={project.ctaLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-tight hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  <span>{project.ctaLabel}</span>
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </a>
              ) : (
                <a
                  href={project.ctaLink || '#'}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono opacity-70 hover:opacity-100 transition-opacity"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1"></span>
                  <span>{project.ctaLabel}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Desktop Monitor Mockup Column */}
        <div
          className={`lg:col-span-6 flex justify-center ${
            isMonitorRight ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div
            ref={monitorRef}
            className="w-full max-w-[500px] preserve-3d transition-transform duration-200 ease-out flex flex-col items-center"
          >
            {/* Monitor Bezel & Display Screen */}
            <div className="w-full aspect-[16/10] rounded-xl bg-[#090A0C] border border-[#2B2D33] p-2.5 shadow-2xl relative overflow-hidden flex flex-col group/monitor">
              {/* Glass Specular Glare Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-30 group-hover/monitor:opacity-45 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(125deg, rgba(255,255,255,0.15) 0%, transparent 45%, rgba(255,255,255,0.05) 100%)',
                }}
              />

              {/* Web Page Screen Surface */}
              <div
                className={`w-full h-full rounded-lg overflow-hidden relative flex flex-col justify-between transition-all duration-500 ${
                  project.screenContent.type === 'sundown'
                    ? 'bg-[#EAE4DC] text-black'
                    : project.screenContent.type === 'portfolio'
                    ? 'bg-[#090A0D] text-white'
                    : 'bg-[#101413] text-[#00D09C]'
                }`}
              >
                {project.mockupImage ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={project.mockupImage}
                      alt={`${project.title} High-Resolution Mockup`}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top select-none transition-transform duration-700 ease-out group-hover/monitor:scale-[1.025]"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full p-6 flex flex-col justify-between">
                    {/* Header bar within mockup */}
                    <div className="flex items-center justify-between text-[10px] opacity-60 font-mono">
                      <span>{project.title.toLowerCase().replace(/\s+/g, '')}.com</span>
                      <div className="flex space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                      </div>
                    </div>

                    {/* Specific Screen Content Types */}
                    {project.screenContent.type === 'sundown' && (
                      <div className="my-auto relative">
                        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#FE3211] blur-2xl opacity-60 pointer-events-none"></div>
                        <h4 className="text-2xl md:text-3xl font-extrabold tracking-tighter leading-none text-black">
                          SPACES<br />THAT<br />INSPIRE
                        </h4>
                        <p className="text-[10px] text-black/60 mt-3 max-w-[140px]">
                          An editorial space for creators and visionaries.
                        </p>
                      </div>
                    )}

                    {project.screenContent.type === 'portfolio' && (
                      <div className="my-auto text-center py-4">
                        <h4 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
                          PRODUCT<br />DESIGNER
                        </h4>
                        <span className="inline-block mt-2 text-[10px] font-mono text-white/50 tracking-widest">
                          SELECTED WORKS 2026
                        </span>
                      </div>
                    )}

                    {project.screenContent.type === 'zerodha' && (
                      <div className="my-auto py-2">
                        <div className="inline-block px-2 py-0.5 rounded bg-[#00D09C]/15 text-[#00D09C] text-[9px] font-mono mb-2">
                          LIVE ANALYTICS
                        </div>
                        <h4 className="text-lg md:text-xl font-bold tracking-tight text-white mb-1">
                          Track Zerodha P&L
                        </h4>
                        <div className="flex items-end space-x-1.5 h-12 pt-3">
                          <div className="w-3 bg-[#00D09C] h-6 rounded-t"></div>
                          <div className="w-3 bg-[#00D09C] h-10 rounded-t"></div>
                          <div className="w-3 bg-[#00D09C] h-8 rounded-t"></div>
                          <div className="w-3 bg-[#00D09C] h-12 rounded-t"></div>
                          <div className="w-3 bg-[#00D09C] h-7 rounded-t"></div>
                          <div className="w-3 bg-[#00D09C] h-11 rounded-t"></div>
                        </div>
                      </div>
                    )}

                    {/* Screen Footer inside mockup */}
                    <div className="text-[9px] opacity-40 font-mono">
                      Case study preview • 2026
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Monitor Stand */}
            <div className="w-14 h-9 bg-gradient-to-b from-[#8E9099] to-[#60626B] clip-stand -mt-0.5"></div>
            <div className="w-36 h-2 rounded-full bg-gradient-to-r from-[#A5A7B0] via-[#D8D9E0] to-[#A5A7B0] shadow-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

