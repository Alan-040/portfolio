import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Instagram,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { ThreeDEnvelope } from '../components/ThreeDEnvelope';
import { ThreeDSmartphone } from '../components/ThreeDSmartphone';
import { animateContactEntrance } from '../animations/scrollAnimations';

interface ContactSectionProps {
  isLightMode?: boolean;
  onExploreWork?: () => void;
  onStartProject?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  isLightMode = false,
  onExploreWork,
  onStartProject,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  useEffect(() => {
    if (sectionRef.current) {
      animateContactEntrance(sectionRef.current);
    }
  }, []);

  const socialLinks = [
    {
      id: 'github',
      label: 'GitHub',
      handle: '@Alan-040',
      url: 'https://github.com/Alan-040',
      icon: Github,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'boobalan-m',
      url: 'https://www.linkedin.com/in/boobalan-m-24595732b',
      icon: Linkedin,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@_.boobalan.____',
      url: 'https://www.instagram.com/_.boobalan.____?srtk=bjhkaDRhdjQ2Yzhz&utm_source=qr',
      icon: Instagram,
    },
  ];

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className={`relative pt-24 pb-12 px-6 md:px-12 max-w-[1360px] mx-auto border-t transition-colors duration-300 overflow-hidden select-none ${
        isLightMode
          ? 'border-[#121316]/10 text-[#121316]'
          : 'border-white/10 text-white'
      }`}
    >
      {/* Ambient Lighting Atmospheric Glow */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-30"
        style={{
          background: isLightMode
            ? 'radial-gradient(circle, rgba(200,163,85,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(200,163,85,0.08) 50%, transparent 80%)',
        }}
      />

      {/* Main Heading & Direct Call-to-Action */}
      <div className="max-w-4xl mb-16 space-y-6">
        <div className="contact-badge inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-current/15 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="opacity-70">AVAILABLE FOR NEW WORK</span>
        </div>

        <h2 className="contact-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.06]">
          Let's create something amazing together.
        </h2>

        <p className="contact-desc text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
          Have a project in mind, an opportunity to collaborate, or just want to say hi?
          Reach out directly through email, phone, or any of my social channels below.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          {onStartProject && (
            <button
              onClick={onStartProject}
              className={`px-6 py-3.5 rounded-full font-semibold text-xs tracking-tight transition-all duration-200 flex items-center space-x-3 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isLightMode
                  ? 'bg-[#121316] text-white hover:bg-black'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
              data-cursor="CLICK"
            >
              <span>Start a project inquiry</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isLightMode ? 'bg-white text-black' : 'bg-black text-white'
                }`}
              >
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          )}

          {onExploreWork && (
            <button
              onClick={onExploreWork}
              className="px-6 py-3.5 rounded-full text-xs font-medium tracking-tight border border-current/20 hover:border-current/50 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
              data-cursor="WORK"
            >
              See my work
            </button>
          )}
        </div>
      </div>

      {/* Simple Horizontal Contact Info (Unboxed, Pure & Clean) with 3D Animated Symbols */}
      <div className="contact-card-anim my-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 select-text">
        {/* Email Item with 3D Moving Envelope Symbol */}
        <a
          href="mailto:boobalanapril10@gmail.com"
          onMouseEnter={() => setIsEmailHovered(true)}
          onMouseLeave={() => setIsEmailHovered(false)}
          className="group flex items-center space-x-3 opacity-90 hover:opacity-100 transition-opacity"
          data-cursor="EMAIL"
          title="Click to send email"
        >
          {/* 3D Animated Floating Envelope */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 relative overflow-visible pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 3.8], fov: 45 }}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <ambientLight intensity={isLightMode ? 0.9 : 0.6} />
              <directionalLight position={[4, 4, 4]} intensity={isLightMode ? 0.8 : 1.2} />
              <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#D4AF37" />
              <ThreeDEnvelope isLightMode={isLightMode} isHovered={isEmailHovered} />
            </Canvas>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity text-amber-500/90 dark:text-amber-400" />
            <span className="text-sm sm:text-base md:text-lg font-mono font-medium tracking-tight group-hover:underline underline-offset-4">
              boobalanapril10@gmail.com
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>

        {/* Subtle dot divider on desktop */}
        <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-current/25" />

        {/* Phone Item with 3D Moving Smartphone Symbol */}
        <a
          href="tel:+919095544095"
          onMouseEnter={() => setIsPhoneHovered(true)}
          onMouseLeave={() => setIsPhoneHovered(false)}
          className="group flex items-center space-x-3 opacity-90 hover:opacity-100 transition-opacity"
          data-cursor="CALL"
          title="Click to dial"
        >
          {/* 3D Animated Rotating Smartphone */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 relative overflow-visible pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 4.2], fov: 45 }}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <ambientLight intensity={isLightMode ? 0.9 : 0.6} />
              <directionalLight position={[4, 5, 4]} intensity={isLightMode ? 0.8 : 1.2} />
              <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#10B981" />
              <ThreeDSmartphone isLightMode={isLightMode} isHovered={isPhoneHovered} />
            </Canvas>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity text-emerald-500/90 dark:text-emerald-400" />
            <span className="text-sm sm:text-base md:text-lg font-mono font-medium tracking-tight group-hover:underline underline-offset-4">
              +91 90955 44095
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      </div>

      {/* Social Media Channels Strip with Refined Hover Interactions */}
      <div className="pt-8 border-t border-current/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-xs font-mono uppercase tracking-widest opacity-50 font-semibold">
            CONNECT ACROSS THE WEB
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`contact-social-item group flex items-center space-x-2 px-4 py-2.5 rounded-full border text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
                    isLightMode
                      ? 'border-[#121316]/12 bg-white/70 hover:border-black hover:bg-white text-[#121316]'
                      : 'border-white/12 bg-[#16171B] hover:border-white hover:bg-neutral-900 text-white'
                  }`}
                  data-cursor={social.label.toUpperCase()}
                >
                  <Icon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  <span>{social.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity ml-0.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimal Copyright Footer */}
      <div className="contact-minimal-footer pt-12 mt-10 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono opacity-40 space-y-2 sm:space-y-0 text-center sm:text-left">
        <div>
          <span>All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Remote-First • Worldwide • 2026</span>
        </div>
      </div>
    </footer>
  );
};
