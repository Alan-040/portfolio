import React, { useEffect, useRef } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { ArrowLeft, Check, Award, Cpu, Sparkles } from 'lucide-react';
import { DISCIPLINE_SHOWCASES, DisciplineShowcase } from '../data/disciplineShowcases';
import gsap from 'gsap';

interface DisciplineShowcaseSectionProps {
  disciplineId: 'full-stack' | 'ui-ux' | 'web-dev' | 'blender-3d';
  onBackToDoors: () => void;
  onSwitchDiscipline?: (disciplineId: 'full-stack' | 'ui-ux' | 'web-dev' | 'blender-3d') => void;
  isLightMode?: boolean;
}

export const DisciplineShowcaseSection: React.FC<DisciplineShowcaseSectionProps> = ({
  disciplineId,
  onBackToDoors,
  onSwitchDiscipline,
  isLightMode = false,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const data: DisciplineShowcase = DISCIPLINE_SHOWCASES[disciplineId] || DISCIPLINE_SHOWCASES['web-dev'];

  useEffect(() => {
    if (!sectionRef.current) return;

    // Smooth cinematic reveal entrance timeline
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.showcase-entrance-elem',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [disciplineId]);

  const allDisciplines: { id: 'full-stack' | 'ui-ux' | 'web-dev' | 'blender-3d'; name: string; color: string }[] = [
    { id: 'full-stack', name: 'Full Stack Developer', color: '#1E3A5F' },
    { id: 'ui-ux', name: 'UI/UX Designer', color: '#483E54' },
    { id: 'web-dev', name: 'Web Developer', color: '#5B7A63' },
    { id: 'blender-3d', name: '3D Blender Artist', color: '#A65236' },
  ];

  return (
    <section
      id="discipline-showcase"
      ref={sectionRef}
      className={`min-h-screen pt-28 pb-32 px-6 md:px-12 max-w-[1360px] mx-auto transition-colors duration-300 relative ${
        isLightMode ? 'text-[#121316]' : 'text-white'
      }`}
    >
      {/* Ambient Colored Backing Glow for this specific discipline */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[150px] pointer-events-none -z-10 opacity-25 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${data.colorHex} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Back Button: Back to the doors */}
      <button
        onClick={onBackToDoors}
        className="showcase-back-btn fixed bottom-8 left-6 md:left-12 z-40 px-5 py-2.5 rounded-full bg-[#18191E]/90 hover:bg-[#25272F] backdrop-blur-md border border-white/15 text-white text-xs font-medium tracking-tight shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
        data-cursor="RETURN"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to the doors</span>
      </button>

      {/* Showcase Header */}
      <div className="showcase-entrance-elem mb-14 space-y-4">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: data.accentColor }}
          />
          <span className="text-xs font-mono uppercase tracking-widest opacity-70 font-semibold">
            {data.fieldIntroduction.badge}
          </span>
          <span className="opacity-30">•</span>
          <span className="text-xs font-mono opacity-50 uppercase tracking-wider">
            {data.tagline}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          {data.disciplineName}
        </h1>

        <p className="text-base md:text-lg opacity-75 max-w-3xl leading-relaxed">
          {data.fieldIntroduction.description}
        </p>

        {/* Core Capabilities Checklist */}
        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.fieldIntroduction.summaryBullets.map((bullet, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 p-3 rounded-xl border text-xs leading-snug transition-colors ${
                isLightMode
                  ? 'bg-black/[0.02] border-black/8 text-[#2A2B30]'
                  : 'bg-white/[0.03] border-white/8 text-neutral-300'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${data.accentColor}25`, color: data.accentColor }}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies & Tools Used Grid */}
      <div className="showcase-entrance-elem mb-16 p-6 sm:p-8 rounded-2xl border transition-colors bg-white/[0.02] dark:bg-white/[0.02] border-current/10">
        <div className="flex items-center space-x-2 mb-6">
          <Cpu className="w-4 h-4 opacity-60" style={{ color: data.accentColor }} />
          <h2 className="text-sm font-mono uppercase tracking-widest font-semibold opacity-80">
            Technologies &amp; Professional Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.technologies.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-xs font-semibold opacity-60 uppercase tracking-wider">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((tech) => (
                  <span
                    key={tech}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                      isLightMode
                        ? 'bg-neutral-100 border-black/10 hover:border-black/30 text-[#121316]'
                        : 'bg-[#18191E] border-white/10 hover:border-white/25 text-neutral-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements, Certifications & Accomplishments Strip */}
      <div className="showcase-entrance-elem mb-20">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="w-4 h-4" style={{ color: data.accentColor }} />
          <h2 className="text-sm font-mono uppercase tracking-widest font-semibold opacity-80">
            Accomplishments &amp; Verified Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.achievements.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isLightMode
                  ? 'bg-white border-black/8 hover:border-black/20 shadow-sm'
                  : 'bg-[#141519] border-white/8 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono opacity-50 mb-2">
                  <span>{item.organization}</span>
                  <span>{item.year}</span>
                </div>
                <h3 className="text-base font-bold tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs opacity-70 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relevant Showcase Projects Header */}
      <div className="showcase-entrance-elem mb-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" style={{ color: data.accentColor }} />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Featured Projects &amp; Case Studies
            </h2>
          </div>
          <p className="text-xs md:text-sm font-mono opacity-60">
            High-fidelity execution, responsibilities, and verified deliverables.
          </p>
        </div>
      </div>

      {/* Stacked Project Cards */}
      <div className="space-y-20">
        {data.projects.map((project) => (
          <div key={project.id} className="showcase-entrance-elem space-y-4">
            <ProjectCard
              project={project}
              isLightMode={isLightMode}
            />

            {/* Contributions & Responsibilities Sub-card */}
            {project.contributions && project.contributions.length > 0 && (
              <div
                className={`p-5 md:p-6 rounded-xl border text-xs space-y-2.5 ${
                  isLightMode
                    ? 'bg-black/[0.015] border-black/8 text-[#24252A]'
                    : 'bg-white/[0.02] border-white/8 text-neutral-300'
                }`}
              >
                <span className="font-mono uppercase tracking-wider text-[11px] font-semibold opacity-60 block">
                  Key Contributions &amp; Engineering Responsibilities:
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {project.contributions.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start space-x-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: data.accentColor }}
                      />
                      <span className="leading-relaxed opacity-85">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Explore Other Doors Switcher Bar */}
      {onSwitchDiscipline && (
        <div className="showcase-entrance-elem mt-24 pt-12 border-t border-current/10">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest opacity-50 font-semibold">
              Explore Other Specialized Disciplines
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {allDisciplines.map((d) => {
              const isCurrent = d.id === disciplineId;
              return (
                <button
                  key={d.id}
                  onClick={() => onSwitchDiscipline(d.id)}
                  disabled={isCurrent}
                  className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                    isCurrent
                      ? 'border-white/30 bg-white/20 opacity-100 cursor-default'
                      : isLightMode
                      ? 'border-black/10 hover:border-black/30 bg-white hover:scale-105'
                      : 'border-white/10 hover:border-white/25 bg-[#16171B] hover:scale-105'
                  }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: d.color }}
                  />
                  <span>{d.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

