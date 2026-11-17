  import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MoveDown } from 'lucide-react';
import { SelectiveColorPortrait } from '../components/SelectiveColorPortrait';
import {
  animateRolodexFlip,
  animatePullCord,
  animateHeroEntrance,
} from '../animations/heroAnimation';

interface HeroSectionProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
  onExploreWork: () => void;
  onStartProject: () => void;
}

export const ROLES = [
  { id: '01 / 04', title: 'Web Developer' },
  { id: '02 / 04', title: 'App Developer' },
  { id: '03 / 04', title: 'UI/UX Designer' },
  { id: '04 / 04', title: 'Graphic Designer' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  isLightMode,
  onToggleTheme,
  onExploreWork,
  onStartProject,
}) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const roleIndexRef = useRef(0);
  const [showVisitingCard, setShowVisitingCard] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLDivElement>(null);

  // Initial cinematic entrance choreography
  useEffect(() => {
    if (sectionRef.current) {
      animateHeroEntrance(sectionRef.current);
    }
  }, []);

  // Auto-flip Rolodex card every 2.6s across all 5 roles in continuous loop
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (roleIndexRef.current + 1) % ROLES.length;
      roleIndexRef.current = next;

      if (cardRef.current) {
        animateRolodexFlip(cardRef.current, ROLES[next], () => {
          setRoleIndex(next);
        });
      } else {
        setRoleIndex(next);
      }
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  const handlePullCord = () => {
    if (cordRef.current && beadRef.current) {
      animatePullCord(cordRef.current, beadRef.current, onToggleTheme);
    } else {
      onToggleTheme();
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-20 md:pt-28 pb-8 px-6 md:px-12 max-w-[1360px] mx-auto select-none overflow-visible"
    >
      {/* Hanging Pull-Chain Light Switch (Top Right Viewport) */}
      <div
        onClick={handlePullCord}
        className="hero-pull-chain fixed top-0 right-6 md:right-16 z-40 cursor-pointer group flex flex-col items-center"
        title="Pull lamp cord to toggle theme"
        data-cursor="LIGHT"
      >
        {/* Cord wire */}
        <div
          ref={cordRef}
          className={`w-[1.5px] h-36 md:h-48 transition-colors origin-top animate-cord-sway ${
            isLightMode ? 'bg-[#121316]/40' : 'bg-white/40'
          }`}
        />
        {/* Brass Bead / Turned Pendant */}
        <div
          ref={beadRef}
          className="w-3.5 h-6 rounded-full shadow-lg -mt-1 transform transition-transform group-hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #F5E2A8 0%, #C8A355 50%, #8C6A24 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          }}
        />
      </div>

      {/* Main Hero Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto pt-4 md:pt-8">
        {/* Left Column: Typography & 3D Rolodex */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 z-10">
          {/* Eyebrow */}
          <div className="hero-stagger flex items-center space-x-2 text-xs md:text-sm font-mono uppercase tracking-wider opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>Independent Freelancer</span>
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <h1 className="hero-stagger text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Hi, I'm Boobalan.
            </h1>
            <p
              className={`hero-stagger text-3xl md:text-5xl font-normal tracking-tight transition-colors duration-300 ${
                isLightMode ? 'text-[#76736E]' : 'text-[#646670]'
              }`}
            >
              I am a
            </p>
          </div>

          {/* 3D Rolodex / Spiral Notebook Binder Card */}
          <div className="hero-rolodex perspective-1200 pt-3">
            <div
              ref={cardRef}
              className={`w-full max-w-[320px] sm:max-w-[360px] md:max-w-[430px] h-[88px] sm:h-[94px] md:h-[104px] rounded-xl border px-5 sm:px-6 py-4 sm:py-5 shadow-2xl preserve-3d relative flex flex-col justify-center transition-colors duration-300 ${
                isLightMode
                  ? 'bg-white border-black/10 text-black shadow-neutral-300/60'
                  : 'bg-[#F2EDE4] border-black/20 text-[#121316] shadow-black/80'
              }`}
            >
              {/* 11 Spiral Ring Binder Clips */}
              <div className="absolute -top-3.5 left-0 right-0 flex justify-between px-4 pointer-events-none">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-1.5 h-3.5 rounded-full bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 shadow-sm border border-neutral-600/40" />
                    <div className="w-1 h-1 rounded-full bg-neutral-900/60 -mt-0.5" />
                  </div>
                ))}
              </div>

              {/* Card Label Content */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="rolodex-text text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-black whitespace-nowrap overflow-hidden text-ellipsis">
                  {ROLES[roleIndex].title}
                </span>
                <span className="rolodex-id text-[11px] sm:text-xs font-mono tracking-widest text-black/50 font-medium shrink-0 ml-2">
                  {ROLES[roleIndex].id}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-stagger flex items-center space-x-4 pt-4">
            {/* Primary Pill Button */}
            <button
              onClick={onStartProject}
              className={`px-6 py-3.5 rounded-full font-semibold text-xs tracking-tight transition-all duration-200 flex items-center space-x-3 shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                isLightMode
                  ? 'bg-[#121316] text-white hover:bg-black'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
              data-cursor="CLICK"
            >
              <span>Start a project</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isLightMode ? 'bg-white text-black' : 'bg-black text-white'
                }`}
              >
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            {/* Secondary Link / Ghost Button */}
            <button
              onClick={onExploreWork}
              className={`px-6 py-3.5 rounded-full text-xs font-medium tracking-tight border transition-colors opacity-70 hover:opacity-100 ${
                isLightMode
                  ? 'border-[#121316]/15 hover:border-[#121316]/40 text-[#121316]'
                  : 'border-white/15 hover:border-white/40 text-white'
              }`}
              data-cursor="SCROLL"
            >
              See my work
            </button>
          </div>
        </div>

        {/* Right Column: Original Personal Photograph & Lapel Badge */}
        <div className="lg:col-span-5 flex justify-center relative mt-6 lg:mt-0">
          <div className="relative w-full max-w-[360px] md:max-w-[420px] flex justify-center group">
            {/* Masked Portrait Container with Interactive Selective Colour Reveal */}
            <div className="hero-portrait-mask relative w-full rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 transition-transform duration-500 ease-out group-hover:scale-[1.01]">
              <SelectiveColorPortrait
                className="hero-portrait-img will-change-transform"
                isLightMode={isLightMode}
              />
            </div>

            {/* "My sticky card" Badge */}
            <div
              onClick={() => setShowVisitingCard((prev) => !prev)}
              className="hero-lapel-badge absolute bottom-6 left-6 z-20 cursor-pointer group/badge"
              data-cursor="CARD"
            >
              <div className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-tight shadow-xl transition-transform group-hover/badge:scale-105 active:scale-95 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>My sticky card</span>
              </div>

              {/* Expandable Digital Visiting Card Popup */}
              {showVisitingCard && (
                <div
                  className="absolute bottom-10 left-0 w-64 p-4 rounded-xl bg-[#16171B] text-white border border-white/15 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xs font-bold">Boobalan</h4>
                      <p className="text-[10px] text-white/50">Designer & Developer</p>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      AVAILABLE
                    </span>
                  </div>
                  <div className="space-y-1 text-[10px] text-white/70 font-mono pt-2 border-t border-white/10">
                    <p>boobalanapril10@gmail.com</p>
                    <p>+91 90955 44095</p>
                    <p>Worldwide • Remote-First</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status & Navigation Strip */}
      <div className="hero-status-bar w-full pt-8 border-t border-current/10 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono opacity-50 tracking-wider space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AVAILABLE FOR WORK</span>
        </div>
        <div className="hidden md:block">
          <span>REMOTE-FIRST, WORLDWIDE</span>
        </div>
        <div
          onClick={onExploreWork}
          className="cursor-pointer hover:opacity-100 transition-opacity flex items-center space-x-1"
        >
          <span>SCROLL TO EXPLORE</span>
          <MoveDown className="w-3 h-3 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
