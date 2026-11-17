import React, { useState, useEffect, useRef } from 'react';
import { animateMagicSectionEntrance } from '../animations/scrollAnimations';

export interface DisciplineDoor {
  id: string;
  discipline: string;
  colorHex: string;
  shadowHex: string;
  plaqueLine1: string;
  plaqueLine2: string;
  plaqueTitle: string;
  headline: string;
  tagline: string;
  checklist: string[];
}

export const DOORS_DATA: DisciplineDoor[] = [
  {
    id: 'web-dev',
    discipline: 'Web Developer',
    colorHex: '#1B3358', // Deep navy blue
    shadowHex: '#12243C',
    plaqueLine1: 'WEB',
    plaqueLine2: 'DEVELOPER',
    plaqueTitle: 'WEB DEVELOPER',
    headline: 'Web Developer',
    tagline: 'CRAFTING SPEED, MOTION & ACCESSIBILITY',
    checklist: [
      'Modern responsive layouts from concept to production',
      'Fluid GSAP motion, scroll storytelling & canvas graphics',
      'Technical SEO, semantic HTML & cross-browser fidelity',
      'Zero layout shift (CLS = 0) & mobile touch performance',
      'Analytics integration, tracking & ongoing launch support',
    ],
  },
  {
    id: 'app-dev',
    discipline: 'App Developer',
    colorHex: '#483E54', // Dark plum / mauve purple
    shadowHex: '#2E2736',
    plaqueLine1: 'APP',
    plaqueLine2: 'DEVELOPER',
    plaqueTitle: 'APP DEVELOPER',
    headline: 'App Developer',
    tagline: 'CROSS-PLATFORM & HIGH-PERFORMANCE MOBILE APPS',
    checklist: [
      'React Native, Flutter & progressive web mobile architectures',
      'Fluid gesture mechanics, 60fps animations & tactile haptics',
      'Offline-first synchronization, caching & state persistence',
      'Secure biometric authentication, notifications & deep linking',
      'App Store & Google Play deployment, CI/CD and release pipelines',
    ],
  },
  {
    id: 'ui-ux',
    discipline: 'UI/UX Designer',
    colorHex: '#597463', // Sage green
    shadowHex: '#3B4F42',
    plaqueLine1: 'UI/UX',
    plaqueLine2: 'DESIGNER',
    plaqueTitle: 'UI/UX DESIGNER',
    headline: 'UI/UX Design',
    tagline: 'RESEARCH FIRST, PIXELS SECOND',
    checklist: [
      'Brand & business needs analysis and stakeholder alignment',
      'User & competitor research with behavioral mapping',
      'Information architecture, wireframes & clickable prototypes',
      'Design systems in Figma with scalable component tokens',
      'Usability testing, accessibility (a11y) & design QA audits',
    ],
  },
  {
    id: 'graphic-design',
    discipline: 'Graphic Designer',
    colorHex: '#AF562D', // Warm rust-orange / terracotta
    shadowHex: '#75371B',
    plaqueLine1: 'GRAPHIC',
    plaqueLine2: 'DESIGNER',
    plaqueTitle: 'GRAPHIC DESIGNER',
    headline: 'Graphic Designer',
    tagline: 'BRAND IDENTITY, EDITORIAL & VISUAL STORYTELLING',
    checklist: [
      'Visual brand identities, logos & comprehensive guidelines',
      'Editorial layouts, digital publishing & typography systems',
      'Vector illustration, icon design & asset production pipelines',
      'Packaging design, mockups & high-resolution print prepress',
      'Motion graphics, 3D spatial branding & social campaign kits',
    ],
  },
];

interface MagicSectionProps {
  onEnterDoor: (doorId: string) => void;
  isLightMode?: boolean;
}

export const MagicSection: React.FC<MagicSectionProps> = ({
  onEnterDoor,
  isLightMode = false,
}) => {
  const [activeDoorId, setActiveDoorId] = useState<string>('web-dev');
  const [hoveredDoorId, setHoveredDoorId] = useState<string | null>(null);
  const [enteringDoorId, setEnteringDoorId] = useState<string | null>(null);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateMagicSectionEntrance(sectionRef.current);
    }
  }, []);

  const handleTriggerEntry = (doorId: string) => {
    console.log('[MAGIC] handleTriggerEntry called for:', doorId);
    if (enteringDoorId) {
      console.log('[MAGIC] already enteringDoorId:', enteringDoorId);
      return;
    }
    setActiveDoorId(doorId);
    setEnteringDoorId(doorId);
    setIsZooming(true);

    // Natural hinge opening + camera forward walkthrough (600ms)
    setTimeout(() => {
      console.log('[MAGIC] Calling onEnterDoor with:', doorId);
      onEnterDoor(doorId);
      // Reset state once inside the new view
      setTimeout(() => {
        setEnteringDoorId(null);
        setIsZooming(false);
      }, 350);
    }, 600);
  };

  const handleDoorClick = (doorId: string) => {
    handleTriggerEntry(doorId);
  };

  return (
    <section
      id="doors"
      ref={sectionRef}
      className={`min-h-screen pt-24 pb-0 flex flex-col justify-between transition-colors duration-500 relative overflow-hidden ${
        isLightMode ? 'text-[#121316]' : 'text-white'
      }`}
    >
      {/* Full-Bleed Continuous Architectural Wall Backdrop */}
      <div
        className="architectural-wall-backdrop absolute inset-0 pointer-events-none -z-20 transition-all duration-500"
        style={{
          background: isLightMode
            ? 'radial-gradient(ellipse 1800px 950px at 50% 30%, #F7F3ED 0%, #EFE9DF 45%, #F5F1EB 80%, #F5F1EB 100%)'
            : 'radial-gradient(ellipse 1800px 950px at 50% 30%, #1A1D25 0%, #111319 50%, #0D0E11 80%, #0D0E11 100%)',
        }}
      />

      {/* Section Title — Clean Editorial Match to Reference Image */}
      <div className="w-full max-w-[1360px] mx-auto px-6 md:px-12 text-center relative z-10 mb-8 sm:mb-12">
        <div
          className={`doors-heading transition-opacity duration-300 ${
            isZooming ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-colors duration-500 ${
              isLightMode ? 'text-[#141518]' : 'text-white'
            }`}
          >
            Magic happens behind the doors
          </h2>
        </div>
      </div>

      {/* Architectural Scene Area: Continuous Wall, 4 Arched Doors, Full-Bleed Baseboard & Full-Bleed Floor */}
      <div className="relative w-full">
        {/* Full-Bleed Continuous Baseboard Molding Along Bottom of Wall (Behind Doors) */}
        <div
          className="absolute bottom-24 sm:bottom-32 left-0 right-0 w-full h-5 sm:h-6 pointer-events-none z-0 transition-colors duration-500"
          style={{
            background: isLightMode
              ? 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 45%, #F0EAE2 100%)'
              : 'linear-gradient(180deg, #2D313C 0%, #1E2028 45%, #101217 100%)',
            borderTop: isLightMode
              ? '1.5px solid rgba(255,255,255,1)'
              : '1.5px solid rgba(255,255,255,0.22)',
            boxShadow: isLightMode
              ? '0 3px 8px rgba(0,0,0,0.06), inset 0 1px 0 #FFFFFF'
              : '0 6px 18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {/* Baseboard Beveled Chamfer Line */}
          <div
            className="w-full h-[1px]"
            style={{
              background: isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.65)',
            }}
          />
        </div>

        {/* 4 Arched Doors Horizontal Array (Centered) */}
        <div
          className={`w-full max-w-5xl mx-auto px-4 sm:px-6 relative z-10 transition-all duration-500 ${
            isZooming ? 'opacity-0 duration-300' : 'opacity-100'
          }`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full items-end">
              {DOORS_DATA.map((door) => {
                const isSelected = door.id === activeDoorId;
                const isHovered = door.id === hoveredDoorId;
                const isEntering = door.id === enteringDoorId;

                return (
                  <div
                    key={door.id}
                    onClick={() => handleDoorClick(door.id)}
                    onMouseEnter={() => {
                      if (!enteringDoorId) {
                        setActiveDoorId(door.id);
                        setHoveredDoorId(door.id);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredDoorId(null);
                    }}
                    onPointerEnter={() => {
                      if (!enteringDoorId) {
                        setActiveDoorId(door.id);
                        setHoveredDoorId(door.id);
                      }
                    }}
                    onPointerLeave={() => {
                      setHoveredDoorId(null);
                    }}
                    className={`door-card-item group relative cursor-pointer flex flex-col items-center transition-all duration-700 ${
                      isEntering
                        ? 'scale-[3.2] sm:scale-[4.2] z-50 origin-center'
                        : isZooming
                        ? 'opacity-0 scale-90 pointer-events-none duration-300'
                        : isHovered
                        ? 'scale-[1.03] z-20 -translate-y-1'
                        : isSelected
                        ? 'scale-[1.01] z-15'
                        : 'opacity-95 hover:opacity-100 hover:scale-[1.025] hover:-translate-y-1 z-10'
                    }`}
                    data-cursor={isEntering ? 'WALKING IN' : isHovered ? 'ENTER' : isSelected ? 'ENTER' : 'DOOR'}
                  >
                    {/* Overhead Wall Spotlight Wash Radiating Downwards Over Each Arch */}
                    {isLightMode && (
                      <div
                        className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-44 pointer-events-none rounded-full blur-2xl opacity-90 transition-opacity duration-500"
                        style={{
                          background:
                            'radial-gradient(ellipse at center top, rgba(255,255,255,0.98) 0%, rgba(255,252,246,0.65) 40%, rgba(255,248,238,0.2) 70%, transparent 90%)',
                        }}
                      />
                    )}

                    {/* Extruded Architectural Arched Casing / Architrave Molding */}
                    <div
                      className={`architectural-casing relative w-full aspect-[1/2.25] max-w-[240px] rounded-t-[136px] rounded-b-none p-2.5 sm:p-3.5 flex flex-col justify-end transition-all duration-500 ${
                        isLightMode
                          ? isSelected
                            ? 'shadow-[0_16px_36px_-4px_rgba(0,0,0,0.18),0_4px_12px_-2px_rgba(0,0,0,0.1)]'
                            : 'shadow-[0_12px_28px_-4px_rgba(0,0,0,0.14),0_3px_8px_-2px_rgba(0,0,0,0.08)]'
                          : isSelected
                          ? 'shadow-[0_24px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(255,255,255,0.07)]'
                          : 'shadow-[0_14px_32px_rgba(0,0,0,0.75)]'
                      }`}
                      style={{
                        // In Light Mode: Pristine architectural white casing. In Dark Mode: Deep sculpted charcoal molding.
                        background: isLightMode
                          ? 'linear-gradient(180deg, #FFFFFF 0%, #FCFAF7 50%, #F3EDE5 100%)'
                          : '#13151B',
                        boxShadow: isLightMode
                          ? `0 14px 32px -4px rgba(0,0,0,0.13),
                             0 4px 10px -2px rgba(0,0,0,0.07),
                             inset 0 1.5px 2px #FFFFFF,
                             inset 0 -2px 5px rgba(0,0,0,0.06)`
                          : `inset 0 24px 38px -4px rgba(0,0,0,0.98),
                             inset 0 2px 8px rgba(0,0,0,0.85),
                             inset 6px 0 14px rgba(0,0,0,0.85),
                             inset -6px 0 14px rgba(0,0,0,0.85),
                             inset 0 -8px 18px rgba(0,0,0,0.9),
                             inset 0 0 25px ${door.colorHex}22,
                             0 0 0 1px rgba(255,255,255,0.08),
                             0 1px 0 0 rgba(255,255,255,0.18),
                             0 16px 36px -6px rgba(0,0,0,0.8)`,
                        border: isLightMode
                          ? '1px solid rgba(0,0,0,0.06)'
                          : 'none',
                      }}
                    >
                      {/* Outer Arch Molding Highlight Rim */}
                      <div
                        className="absolute inset-0 rounded-t-[136px] rounded-b-none pointer-events-none"
                        style={{
                          borderTop: isLightMode
                            ? '1.5px solid rgba(255,255,255,1)'
                            : '1.5px solid rgba(255,255,255,0.18)',
                          borderLeft: isLightMode
                            ? '1px solid rgba(255,255,255,0.8)'
                            : '1px solid rgba(255,255,255,0.09)',
                          borderRight: isLightMode
                            ? '1px solid rgba(0,0,0,0.08)'
                            : '1px solid rgba(0,0,0,0.6)',
                        }}
                      />

                      {/* Recessed Inner Reveal / Jamb Shadow where the door sits */}
                      <div
                        className="absolute inset-1.5 sm:inset-2 rounded-t-[124px] rounded-b-none pointer-events-none"
                        style={{
                          boxShadow: isLightMode
                            ? 'inset 0 3px 6px rgba(0,0,0,0.22), inset 2px 0 4px rgba(0,0,0,0.12), inset -2px 0 4px rgba(0,0,0,0.12)'
                            : 'none',
                        }}
                      />

                      {/* Doorway Aperture Frame with 3D Perspective */}
                      <div className="w-full h-full rounded-t-[124px] rounded-b-sm relative overflow-visible [perspective:1400px]">
                        {/* Interior Door Threshold & Jamb Reveal (visible when ajar or entering) */}
                        <div
                          className="absolute inset-0 rounded-t-[124px] rounded-b-sm overflow-hidden pointer-events-none"
                          style={{
                            background: isLightMode
                              ? 'linear-gradient(135deg, #FAF8F5 0%, #EDE6DC 70%, #E0D7C9 100%)'
                              : '#07080B',
                            boxShadow: isLightMode
                              ? 'inset 0 2px 6px rgba(0,0,0,0.25), inset -3px 0 8px rgba(0,0,0,0.18)'
                              : 'inset 0 2px 8px rgba(0,0,0,0.8)',
                          }}
                        >
                          {/* Inner glowing portal gradient for entering walkthrough */}
                          <div
                            className={`w-full h-full transition-opacity duration-300 ${
                              isEntering ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                              background: `radial-gradient(ellipse at center 60%, ${door.colorHex} 0%, #030406 80%)`,
                            }}
                          />
                        </div>

                        {/* Physical Arched Door Leaf — Swings open on Left Hinge */}
                        <div
                          className={`w-full h-full rounded-t-[124px] rounded-b-sm shadow-xl relative p-2 sm:p-2.5 flex flex-col items-center justify-between border border-white/10 preserve-3d overflow-hidden transition-all duration-700 ease-out origin-left select-none ${
                            isEntering ? 'shadow-[0_30px_70px_rgba(0,0,0,0.85)]' : ''
                          }`}
                          style={{
                            backgroundColor: door.colorHex,
                            boxShadow: isLightMode
                              ? `0 12px 28px -6px ${door.shadowHex}55, 0 4px 12px -4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 8px rgba(0,0,0,0.35)`
                              : `0 24px 48px -12px ${door.shadowHex}, 0 12px 24px -8px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.12), inset 0 -4px 10px rgba(0,0,0,0.4)`,
                            transform: isEntering
                              ? 'perspective(1400px) rotateY(-84deg) scaleX(0.96) translateZ(8px)'
                              : isHovered
                              ? 'perspective(1400px) rotateY(-12deg) translateZ(5px)'
                              : door.id === 'ui-ux'
                              ? 'perspective(1400px) rotateY(-7deg) translateZ(4px)'
                              : 'perspective(1400px) rotateY(0deg)',
                          }}
                        >
                          {/* Outer Door Stile & Rail Perimeter Border with Inset Fluted Panel */}
                          <div
                            className="absolute inset-1 sm:inset-1.5 rounded-t-[118px] rounded-b-none pointer-events-none"
                            style={{
                              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.35), 0 1px 1px rgba(255,255,255,0.15)',
                            }}
                          />

                          {/* 26 Vertical Fluted Beadboard Grooves with 3D Light & Shade */}
                          <div className="absolute inset-1.5 sm:inset-2 rounded-t-[116px] rounded-b-none pointer-events-none flex justify-between px-2 overflow-hidden">
                            {Array.from({ length: 26 }).map((_, i) => (
                              <div key={i} className="flex h-full">
                                {/* Dark recessed shadow groove */}
                                <div className="w-[1.5px] h-full bg-black/40 shadow-inner" />
                                {/* Specular highlight catch line */}
                                <div className="w-[1px] h-full bg-white/14" />
                              </div>
                            ))}
                          </div>

                          {/* Polished Gold Rectangular Nameplate with Engraved Stacked Typography & 4 Corner Rivets */}
                          <div
                            className="mt-14 sm:mt-16 z-10 w-[58%] sm:w-[62%] py-1.5 sm:py-2 px-1 rounded-[3px] border border-[#F0D17E] shadow-[0_3px_10px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.75),inset_0_-1px_1px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center relative select-none"
                            style={{
                              background: 'linear-gradient(135deg, #FDEAB8 0%, #DCB24E 32%, #A87D21 68%, #F7E09F 100%)',
                            }}
                          >
                            {/* 4 Corner Screw Rivets */}
                            <span className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-[#68470B] shadow-[inset_0_0.5px_0.5px_rgba(0,0,0,0.6),0_0.5px_0.5px_rgba(255,255,255,0.5)]" />
                            <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-[#68470B] shadow-[inset_0_0.5px_0.5px_rgba(0,0,0,0.6),0_0.5px_0.5px_rgba(255,255,255,0.5)]" />
                            <span className="absolute bottom-1 left-1.5 w-1 h-1 rounded-full bg-[#68470B] shadow-[inset_0_0.5px_0.5px_rgba(0,0,0,0.6),0_0.5px_0.5px_rgba(255,255,255,0.5)]" />
                            <span className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-[#68470B] shadow-[inset_0_0.5px_0.5px_rgba(0,0,0,0.6),0_0.5px_0.5px_rgba(255,255,255,0.5)]" />

                            <div className="flex flex-col items-center justify-center text-center leading-[1.12]">
                              <span
                                className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold font-mono tracking-[0.18em] text-[#241A06] uppercase"
                                style={{ textShadow: '0 1px 0 rgba(255,255,255,0.45)' }}
                              >
                                {door.plaqueLine1}
                              </span>
                              <span
                                className="text-[7.5px] sm:text-[8.5px] md:text-[9px] font-bold font-mono tracking-[0.2em] text-[#241A06] uppercase mt-0.5"
                                style={{ textShadow: '0 1px 0 rgba(255,255,255,0.45)' }}
                              >
                                {door.plaqueLine2}
                              </span>
                            </div>
                          </div>

                          {/* Polished Gold Hardware: Lever Handle & Vertical Keyhole Plate */}
                          <div className="my-auto z-10 w-full flex justify-end pr-2.5 sm:pr-3 relative">
                            <div className="flex flex-col items-center">
                              {/* Lever Handle Rosette and Horizontal Lever */}
                              <div className="flex items-center">
                                <div
                                  className="w-3.5 h-3.5 rounded-full shadow-md border border-[#E0C172] -mr-1 z-10"
                                  style={{
                                    background: 'radial-gradient(circle at 40% 40%, #FFF2CC 0%, #D8AE48 60%, #8C6A24 100%)',
                                  }}
                                />
                                <div
                                  className={`w-9 sm:w-10 h-2.5 rounded-full shadow-lg transition-transform duration-300 origin-left border-t border-white/40 ${
                                    isEntering
                                      ? 'rotate-18'
                                      : isHovered
                                      ? 'rotate-12'
                                      : 'group-hover:rotate-12'
                                  }`}
                                  style={{
                                    background: 'linear-gradient(135deg, #FFF0C8 0%, #E2B857 45%, #9E741D 80%, #6E4D0C 100%)',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.6)',
                                  }}
                                />
                              </div>

                              {/* Vertical Gold Keyhole Plate Positioned Directly Beneath Handle */}
                              <div
                                className="w-3 sm:w-3.5 h-5.5 sm:h-6 rounded-[2px] shadow-md border border-[#F0D17E]/90 mt-1.5 flex flex-col items-center justify-center relative p-0.5"
                                style={{
                                  background: 'linear-gradient(135deg, #FDE8B3 0%, #D8AE48 45%, #9E741D 80%, #6E4D0C 100%)',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.5)',
                                }}
                              >
                                {/* Top and Bottom Pin Fasteners */}
                                <span className="w-0.5 h-0.5 rounded-full bg-[#5A3F0B] mb-auto opacity-70" />
                                {/* Keyhole Aperture */}
                                <div className="flex flex-col items-center my-auto">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1204] shadow-inner" />
                                  <div className="w-0.8 h-1.5 bg-[#1A1204] -mt-0.5 rounded-b-[1px] shadow-inner" />
                                </div>
                                <span className="w-0.5 h-0.5 rounded-full bg-[#5A3F0B] mt-auto opacity-70" />
                              </div>
                            </div>

                            {/* "Click to enter" Hover Indicator Pill — Positioned directly beneath handle & keyhole, centered relative to door */}
                            <div
                              className={`click-to-enter-pill absolute top-full mt-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ease-out select-none ${
                                isEntering || isZooming
                                  ? 'opacity-0 scale-95 pointer-events-none'
                                  : isHovered
                                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                                  : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto'
                              }`}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerEntry(door.id);
                                }}
                                className="px-3.5 py-1 sm:px-4 sm:py-1 rounded-full bg-white text-black text-[10px] sm:text-[10.5px] font-semibold tracking-tight shadow-[0_6px_20px_rgba(0,0,0,0.35)] whitespace-nowrap cursor-pointer hover:bg-neutral-100 active:scale-95 transition-all inline-block border border-black/5"
                              >
                                Click to enter
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* Full-Bleed Architectural Grounded Floor Plane Across Entire Viewport */}
        <div
          className="floor-plane relative w-full h-36 sm:h-48 md:h-56 overflow-hidden pointer-events-none z-0 border-t"
          style={{
            borderColor: isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
          }}
        >
          {/* Floor Surface Depth Gradient: Seamlessly blends from light floor shade down into the base section color */}
          <div
            className="w-full h-full transition-colors duration-500"
            style={{
              background: isLightMode
                ? 'linear-gradient(180deg, #FAF7F2 0%, #F6F2EC 25%, #F5F1EB 70%, #F5F1EB 100%)'
                : 'linear-gradient(180deg, #101217 0%, #0E1014 25%, #0D0E11 70%, #0D0E11 100%)',
            }}
          />

          {/* Distinctive Warm Peach / Coral Radiant Ambient Wash on the Left Edge with Smooth Feathered Falloff */}
          {isLightMode && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 800px 240px at 0% 15%, rgba(245, 142, 102, 0.38) 0%, rgba(250, 180, 150, 0.18) 35%, transparent 75%)',
                maskImage: 'linear-gradient(to bottom, black 0%, black 25%, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 25%, transparent 85%)',
              }}
            />
          )}

          {/* Contact Shadows & Light Falloff Directly Beneath Each Door */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-full relative z-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 h-full">
              {DOORS_DATA.map((door) => {
                return (
                  <div key={door.id} className="relative w-full h-full flex flex-col items-center">
                    {/* Contact Shadow directly under door base */}
                    <div
                      className={`h-2.5 rounded-full blur-[2px] transition-all duration-300 ${
                        isLightMode ? 'w-4/5 opacity-40' : 'w-3/4 opacity-80'
                      }`}
                      style={{
                        background: isLightMode
                          ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%)'
                          : 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 75%)',
                      }}
                    />
                    {/* Subtle Ambient Color Reflection / Light Falloff */}
                    <div
                      className="w-4/5 h-8 rounded-full blur-[14px] -mt-1 opacity-25"
                      style={{
                        background: `radial-gradient(ellipse at center, ${door.colorHex} 0%, transparent 75%)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seamless Bottom Gradient Blend into Next Section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 pointer-events-none z-10 transition-colors duration-500"
            style={{
              background: isLightMode
                ? 'linear-gradient(to bottom, rgba(245, 241, 235, 0) 0%, rgba(245, 241, 235, 0.5) 40%, #F5F1EB 100%)'
                : 'linear-gradient(to bottom, rgba(13, 14, 17, 0) 0%, rgba(13, 14, 17, 0.5) 40%, #0D0E11 100%)',
            }}
          />
        </div>
      </div>
    </section>
  );
};
