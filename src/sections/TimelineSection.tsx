import React, { useState, useRef, useEffect } from 'react';
import { Clock, Code2, Palette, Box, Terminal } from 'lucide-react';
import { setupStickyStorytellingScroll, animateYearReel } from '../animations/scrollAnimations';

export interface MilestoneItem {
  id: string;
  year: string;
  period: string;
  title: string;
  organization: string;
  bullets: string[];
  roles?: string[];
  visualType: 'student' | 'exploration' | 'identity';
}

export const MILESTONES: MilestoneItem[] = [
  {
    id: '01',
    year: '2024',
    period: '2024',
    title: 'The Beginning',
    organization: 'B.Tech Information Technology • SKCET',
    bullets: [
      'Started my B.Tech journey in Information Technology at SKCET.',
      'Began exploring programming and computer science.',
      'Developed an interest in technology and software development.',
      'Started learning the fundamentals of building digital experiences.',
    ],
    visualType: 'student',
  },
  {
    id: '02',
    year: '2025',
    period: '2025',
    title: 'Exploring My Interests',
    organization: 'Full-Stack, UI/UX & 3D Exploration',
    bullets: [
      'Improved my programming and technical knowledge.',
      'Started exploring full-stack development.',
      'Developed an interest in UI/UX design and creative digital experiences.',
      'Began experimenting with Blender and 3D modelling.',
      'Worked on academic and personal projects.',
    ],
    visualType: 'exploration',
  },
  {
    id: '03',
    year: '2026',
    period: '2026',
    title: 'Building My Professional Identity',
    organization: 'Four Core Professional Areas',
    bullets: [
      'Continued developing my Information Technology knowledge.',
      'Explored full-stack development and modern web technologies.',
      'Improved my UI/UX design skills.',
      'Developed my 3D modelling and Blender skills.',
      'Worked on practical projects and portfolio development.',
      'Focused on building my identity across four professional areas:',
    ],
    roles: [
      'Full Stack Developer',
      'UI/UX Designer',
      'Web Developer',
      '3D Blender Artist',
    ],
    visualType: 'identity',
  },
];

interface TimelineSectionProps {
  isLightMode?: boolean;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  isLightMode = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const yearContainerRef = useRef<HTMLDivElement>(null);
  const rightViewportRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const current = MILESTONES[activeIndex];
  const progressPct = ((activeIndex + 1) / MILESTONES.length) * 100;

  useEffect(() => {
    if (
      sectionRef.current &&
      rightViewportRef.current &&
      rightTrackRef.current &&
      dialRef.current
    ) {
      const elements = milestoneRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      const cleanup = setupStickyStorytellingScroll(
        sectionRef.current,
        rightViewportRef.current,
        rightTrackRef.current,
        dialRef.current,
        elements,
        (index) => {
          setActiveIndex(index);
          if (yearContainerRef.current) {
            animateYearReel(yearContainerRef.current, MILESTONES[index].year);
          }
        }
      );

      return cleanup;
    }
  }, []);

  return (
    <section
      id="my-story"
      ref={sectionRef}
      className={`relative w-full lg:h-screen lg:max-h-screen pt-20 lg:pt-24 pb-8 lg:pb-12 px-6 md:px-12 max-w-[1360px] mx-auto transition-colors duration-300 flex flex-col justify-center overflow-hidden ${
        isLightMode ? 'text-[#121316]' : 'text-white'
      }`}
    >
      {/* Anchor alias for #timeline */}
      <div id="timeline" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Atmospheric Ambient Radial Glow */}
      <div
        className="absolute top-1/4 left-10 md:left-24 w-96 h-96 rounded-full blur-[120px] pointer-events-none -z-10 opacity-30"
        style={{
          background: isLightMode
            ? 'radial-gradient(circle, rgba(91,122,99,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(50,75,55,0.45) 0%, rgba(20,30,22,0.2) 50%, transparent 80%)',
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start h-full">
        {/* LEFT COLUMN: Stationary Sticky Heading, Year Reel, Dial & Progress (Desktop Fixed) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-auto lg:h-[80vh] py-4 lg:py-6 z-10 select-none">
          <div className="space-y-4 relative">
            {/* Ambient Radial Clock Dial with Compass Ticks */}
            <div
              ref={dialRef}
              className="absolute -top-14 -left-14 w-84 h-84 md:w-96 md:h-96 rounded-full border border-emerald-500/10 pointer-events-none -z-10 flex items-center justify-center opacity-40 animate-dial-slow"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1.5px] h-3.5 bg-emerald-400/30 origin-center"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-160px)`,
                  }}
                />
              ))}
            </div>

            {/* Header Eyebrow */}
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>MY STORY</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Let's go back in time.
            </h2>

            {/* Giant Year Display with 3D Reel Animation */}
            <div ref={yearContainerRef} className="py-2 overflow-hidden h-32 flex items-center">
              <span className="active-year text-8xl md:text-9xl font-extrabold tracking-tighter leading-none inline-block">
                {current.year}
              </span>
            </div>

            {/* Active Milestone Date Range Sub-label */}
            <p className="text-xs font-mono uppercase tracking-widest opacity-60">
              {current.period}
            </p>
          </div>

          {/* Progress Tracker Bar */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono opacity-60">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {current.id} / 0{MILESTONES.length}
              </span>
            </div>
            {/* Horizontal Segmented Track */}
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Viewport Window containing Translating Story Track */}
        <div
          ref={rightViewportRef}
          className="timeline-right-viewport lg:col-span-7 h-auto lg:h-[80vh] relative overflow-hidden py-4 lg:py-6 pl-4 lg:pl-8"
        >
          {/* Translating Track containing timeline items and vertical line */}
          <div
            ref={rightTrackRef}
            className="timeline-right-track relative space-y-20 lg:space-y-28 pb-32 will-change-transform"
          >
            {/* Continuous Vertical Timeline Track Line */}
            <div className="absolute left-[7px] top-3 bottom-8 w-[2px] bg-white/10 pointer-events-none" />

            {MILESTONES.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  ref={(el) => (milestoneRefs.current[idx] = el)}
                  onClick={() => {
                    setActiveIndex(idx);
                    if (yearContainerRef.current) {
                      animateYearReel(yearContainerRef.current, item.year);
                    }
                  }}
                  className={`timeline-milestone-item transition-all duration-300 relative pl-10 cursor-pointer ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-35 hover:opacity-75 scale-98'
                  }`}
                  data-cursor="YEAR"
                >
                  {/* Glowing Green Node on the timeline track */}
                  <div
                    className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? 'bg-emerald-500 border-white shadow-[0_0_18px_rgba(34,197,94,0.95)] scale-125'
                        : 'bg-[#18191E] border-white/30'
                    }`}
                  />

                  <span className="text-xs font-mono tracking-widest uppercase opacity-60 block mb-1">
                    {item.period}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                    {item.title}
                  </h3>

                  <p className="text-sm font-medium opacity-70 mb-4">
                    {item.organization}
                  </p>

                  <ul className="space-y-2 text-sm opacity-80 max-w-lg leading-relaxed mb-6">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start space-x-2">
                        <span className="opacity-40 mr-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* FRAME 01 VISUAL: Technology Student's Journey */}
                  {item.visualType === 'student' && (
                    <div
                      className={`p-4 rounded-xl border max-w-lg transition-colors duration-300 ${
                        isLightMode
                          ? 'bg-white/80 border-black/10 shadow-md'
                          : 'bg-[#14151B]/80 border-white/10 shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-current/10 text-xs font-mono opacity-60">
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>skcet_it_journey.ts</span>
                        </div>
                        <div className="flex space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-400/60" />
                          <span className="w-2 h-2 rounded-full bg-amber-400/60" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
                        </div>
                      </div>
                      <div className="pt-3 font-mono text-[11px] space-y-1.5 opacity-75">
                        <p className="text-emerald-400">// Department of Information Technology</p>
                        <p><span className="text-blue-400">const</span> <span className="text-amber-300">journey</span> = &#123;</p>
                        <p className="pl-4">institution: <span className="text-emerald-300">"SKCET"</span>,</p>
                        <p className="pl-4">discipline: <span className="text-emerald-300">"Information Technology"</span>,</p>
                        <p className="pl-4">coreFoundations: [<span className="text-purple-300">"Algorithms"</span>, <span className="text-purple-300">"Data Structures"</span>, <span className="text-purple-300">"Web Tech"</span>]</p>
                        <p>&#125;;</p>
                      </div>
                    </div>
                  )}

                  {/* FRAME 02 VISUAL: Coding, Creative Design & 3D Exploration */}
                  {item.visualType === 'exploration' && (
                    <div className="grid grid-cols-3 gap-3 max-w-lg">
                      <div
                        className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-colors ${
                          isLightMode ? 'bg-white/80 border-black/10' : 'bg-[#14151B]/80 border-white/10'
                        }`}
                      >
                        <Code2 className="w-5 h-5 text-sky-400" />
                        <span className="text-xs font-semibold">Full Stack</span>
                        <span className="text-[10px] font-mono opacity-60">Code &amp; APIs</span>
                      </div>
                      <div
                        className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-colors ${
                          isLightMode ? 'bg-white/80 border-black/10' : 'bg-[#14151B]/80 border-white/10'
                        }`}
                      >
                        <Palette className="w-5 h-5 text-purple-400" />
                        <span className="text-xs font-semibold">UI/UX</span>
                        <span className="text-[10px] font-mono opacity-60">Design Systems</span>
                      </div>
                      <div
                        className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-colors ${
                          isLightMode ? 'bg-white/80 border-black/10' : 'bg-[#14151B]/80 border-white/10'
                        }`}
                      >
                        <Box className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-semibold">Blender 3D</span>
                        <span className="text-[10px] font-mono opacity-60">Spatial Meshes</span>
                      </div>
                    </div>
                  )}

                  {/* FRAME 03 VISUAL: Four Professional Roles Matrix */}
                  {item.visualType === 'identity' && item.roles && (
                    <div className="space-y-3 max-w-lg">
                      <div className="grid grid-cols-2 gap-2.5">
                        {item.roles.map((role, rIdx) => {
                          const colors = [
                            { border: 'border-blue-500/30', bg: 'bg-[#1B3358]/20', dot: 'bg-[#1B3358]' },
                            { border: 'border-purple-500/30', bg: 'bg-[#483E54]/20', dot: 'bg-[#483E54]' },
                            { border: 'border-emerald-500/30', bg: 'bg-[#5B7A63]/20', dot: 'bg-[#5B7A63]' },
                            { border: 'border-orange-500/30', bg: 'bg-[#AF562D]/20', dot: 'bg-[#AF562D]' },
                          ];
                          const c = colors[rIdx % colors.length];
                          return (
                            <div
                              key={rIdx}
                              className={`p-3 rounded-xl border ${c.border} ${c.bg} flex items-center space-x-2.5 transition-transform hover:scale-[1.02]`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shadow-sm shrink-0`} />
                              <span className="text-xs font-semibold tracking-tight">{role}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
