import React, { useState, useEffect } from 'react';

interface NavbarProps {
  isLightMode: boolean;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLightMode,
  activeSection = 'home',
  onNavigate,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
      );
      setDateString(
        now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'web-dev', label: 'Web Developer' },
    { id: 'app-dev', label: 'App Developer' },
    { id: 'ui-ux', label: 'UI/UX Designer' },
    { id: 'graphic-design', label: 'Graphic Designer' },
    { id: 'my-story', label: 'My story' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 backdrop-blur-md px-6 md:px-12 py-3.5 border-b ${
        isLightMode
          ? 'bg-[#F5F1EB]/85 border-[#121316]/8 text-[#121316]'
          : 'bg-[#0D0E11]/80 border-white/8 text-[#F7F7F8]'
      }`}
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-between text-xs tracking-tight">
        {/* Nav Links */}
        <div className="flex items-center space-x-5 md:space-x-7 overflow-x-auto no-scrollbar py-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`whitespace-nowrap transition-colors duration-200 hover:opacity-100 ${
                activeSection === link.id
                  ? 'font-semibold opacity-100 underline underline-offset-4'
                  : 'font-normal opacity-60'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Live Local Time & Date */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px] opacity-50 font-mono tracking-normal">
          <span>Local time {timeString || '3:00pm'}</span>
          <span>{dateString || '31 October, 2026'}</span>
        </div>
      </div>
    </nav>
  );
};

