import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { ThreeDScene } from './components/ThreeDScene';
import { ProjectFormModal } from './components/ProjectFormModal';
import { HeroSection } from './sections/HeroSection';
import { MagicSection } from './sections/MagicSection';
import { TimelineSection } from './sections/TimelineSection';
import { ContactSection } from './sections/ContactSection';
import { DisciplineShowcaseSection } from './sections/DisciplineShowcaseSection';
import { useSmoothScroll } from './hooks/useSmoothScroll';

type ViewMode =
  | 'main'
  | 'showcase-full-stack'
  | 'showcase-ui-ux'
  | 'showcase-web'
  | 'showcase-blender-3d';

export function App() {
  const [isLightMode, setIsLightMode] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('main');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  // Initialize Lenis smooth scroll
  const lenisRef = useSmoothScroll();

  // Apply light-theme class to <body> when active
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightMode]);

  const handleToggleTheme = () => {
    setIsLightMode((prev) => !prev);
  };

  const handleEnterDoor = (doorId: string) => {
    // Map door IDs to showcase views
    const disciplineMap: Record<string, string> = {
      'web-dev': 'web',
      'app-dev': 'full-stack',
      'full-stack': 'full-stack',
      'ui-ux': 'ui-ux',
      'graphic-design': 'blender-3d',
      'blender-3d': 'blender-3d',
    };
    const validDiscipline = disciplineMap[doorId] || (['full-stack', 'ui-ux', 'web-dev', 'blender-3d'].includes(doorId) ? doorId : 'web');

    setCurrentView(`showcase-${validDiscipline}` as ViewMode);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  };

  const handleBackToDoors = () => {
    setCurrentView('main');
    setTimeout(() => {
      const el = document.getElementById('doors');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
      }
      if (lenisRef.current) {
        lenisRef.current.scrollTo('#doors', { immediate: true });
      }
    }, 50);
  };

  const handleStartProject = () => {
    setIsProjectFormOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    if (['full-stack', 'app-dev', 'ui-ux', 'web-dev', 'graphic-design', 'blender-3d'].includes(sectionId)) {
      handleEnterDoor(sectionId);
    } else {
      if (currentView !== 'main') {
        setCurrentView('main');
      }
      setTimeout(() => {
        const targetId = sectionId === 'my-story' ? 'timeline' : sectionId;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(`#${targetId}`);
        } else {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const activeNavSection = currentView.startsWith('showcase-')
    ? currentView.replace('showcase-', '')
    : 'home';

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-300 ${
        isLightMode ? 'bg-[#F5F1EB] text-[#121316]' : 'bg-[#0D0E11] text-[#F7F7F8]'
      }`}
    >
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Atmospheric 3D Particle Scene */}
      <ThreeDScene isLightMode={isLightMode} />

      {/* Sticky Navigation Bar */}
      <Navbar
        isLightMode={isLightMode}
        activeSection={activeNavSection}
        onNavigate={handleNavigate}
      />

      {/* Main Page or Dedicated Discipline Showcase View */}
      <main className="relative z-10">
        {currentView === 'main' ? (
          <>
            <HeroSection
              isLightMode={isLightMode}
              onToggleTheme={handleToggleTheme}
              onExploreWork={() => {
                const el = document.getElementById('doors');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onStartProject={handleStartProject}
            />
            <MagicSection
              isLightMode={isLightMode}
              onEnterDoor={handleEnterDoor}
            />
            <TimelineSection isLightMode={isLightMode} />
            <ContactSection
              isLightMode={isLightMode}
              onExploreWork={() => {
                const el = document.getElementById('doors');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onStartProject={handleStartProject}
            />
          </>
        ) : (
          <>
            <DisciplineShowcaseSection
              disciplineId={
                currentView.replace('showcase-', '') as
                  | 'full-stack'
                  | 'ui-ux'
                  | 'web-dev'
                  | 'blender-3d'
              }
              onBackToDoors={handleBackToDoors}
              onSwitchDiscipline={(newId) => {
                handleEnterDoor(newId);
              }}
              isLightMode={isLightMode}
            />
            <ContactSection
              isLightMode={isLightMode}
              onExploreWork={handleBackToDoors}
              onStartProject={handleStartProject}
            />
          </>
        )}
      </main>

      {/* Dedicated Project Inquiry Form View — ONLY the form is visible */}
      <ProjectFormModal
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        isLightMode={isLightMode}
      />
    </div>
  );
}

export default App;

