import { ProjectData } from '../components/ProjectCard';

export interface ShowcaseProject extends ProjectData {
  contributions: string[];
}

export interface DisciplineShowcase {
  id: 'full-stack' | 'ui-ux' | 'web-dev' | 'blender-3d';
  disciplineName: string;
  colorHex: string;
  shadowHex: string;
  accentColor: string;
  tagline: string;
  fieldIntroduction: {
    badge: string;
    headline: string;
    description: string;
    summaryBullets: string[];
  };
  technologies: {
    category: string;
    items: string[];
  }[];
  achievements: {
    title: string;
    organization: string;
    year: string;
    detail: string;
  }[];
  projects: ShowcaseProject[];
}

export const DISCIPLINE_SHOWCASES: Record<string, DisciplineShowcase> = {
  'full-stack': {
    id: 'full-stack',
    disciplineName: 'Full Stack Developer',
    colorHex: '#1E3A5F',
    shadowHex: '#142740',
    accentColor: '#38BDF8',
    tagline: 'END TO END • FROM ARCHITECTURE TO DEPLOYMENT',
    fieldIntroduction: {
      badge: 'SCALABLE SYSTEM ARCHITECTURE',
      headline: 'Full Stack Engineering & High-Concurrency Systems',
      description:
        'Architecting resilient distributed digital systems from database optimization to fluid web client execution. Specialized in high-throughput Node.js/TypeScript microservices, event-driven architectures, and zero-downtime cloud deployments.',
      summaryBullets: [
        'Full stack architecture & scalable system design',
        'RESTful APIs, GraphQL & secure backend microservices',
        'High-performance React & TypeScript web applications',
        'Database optimization, cloud deployment & CI/CD automation',
        'Lighthouse 100/100, Core Web Vitals & SLA maintenance',
      ],
    },
    technologies: [
      {
        category: 'Backend & APIs',
        items: ['Node.js', 'TypeScript', 'Express', 'GraphQL', 'RESTful APIs', 'Python'],
      },
      {
        category: 'Databases & Caching',
        items: ['PostgreSQL', 'Redis Cluster', 'MongoDB', 'Connection Pooling', 'Prisma'],
      },
      {
        category: 'Frontend & State',
        items: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Zustand'],
      },
      {
        category: 'Cloud & Infrastructure',
        items: ['Docker', 'AWS EC2 / S3', 'CI/CD Pipelines', 'Linux', 'Vercel'],
      },
    ],
    achievements: [
      {
        title: 'B.Tech in Information Technology',
        organization: 'Sri Krishna College of Engineering and Technology (SKCET)',
        year: '2024 – 2026',
        detail:
          'Information Technology coursework, programming fundamentals, full-stack systems and software development.',
      },
      {
        title: 'Production High-Concurrency Deployments',
        organization: 'Independent Engineering',
        year: '2026',
        detail:
          'Architected backend services handling sub-100ms response times under heavy concurrent loads.',
      },
      {
        title: 'End-to-End Freelance Delivery Lead',
        organization: 'Independent Freelancer',
        year: '2026 – Present',
        detail:
          'Carrying full-stack web and mobile products from initial architecture to live production launch.',
      },
    ],
    projects: [
      {
        id: 'cloud-scaler',
        badge: 'SYSTEM ARCHITECTURE • PRODUCTION',
        title: 'Distributed Microservices & Cloud Architecture',
        category: 'Scalable System Engineering',
        description:
          'Event-driven backend infrastructure managing millions of real-time transactions, with Redis caching, PostgreSQL read replicas, and Docker container orchestration.',
        tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'GraphQL'],
        mockupImage: '/images/fullstack-architecture-mockup.webp',
        ctaLabel: 'View GitHub Architecture',
        ctaLink: 'https://github.com/Alan-040',
        isExternal: true,
        monitorPosition: 'right',
        screenContent: {
          type: 'portfolio',
          headline: 'DISTRIBUTED ARCHITECTURE',
          accentColor: '#38BDF8',
        },
        contributions: [
          'Architected database schema and optimized indexing to reduce query latency by 42%.',
          'Implemented token-based JWT and rate-limiting security middleware across all endpoints.',
          'Configured multi-container Docker compose environment with automated health checks.',
        ],
      },
      {
        id: 'pnl-quicko-fullstack',
        badge: 'QUICKO • LIVE SYSTEM',
        title: 'P&L Analytics Platform for Zerodha',
        category: 'Fintech Full Stack Solution • pnl.page',
        description:
          'Engineered responsive landing and calculation flow allowing Zerodha users to connect demat accounts, analyze multi-year tax reports, and generate verified P&L statements.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'API Integration', 'SEO'],
        mockupImage: '/images/zerodha-mockup.webp',
        ctaLabel: 'Visit Live Site',
        ctaLink: 'https://pnl.page',
        isExternal: true,
        monitorPosition: 'left',
        screenContent: {
          type: 'zerodha',
          headline: 'Track Zerodha P&L',
          accentColor: '#00D09C',
        },
        contributions: [
          'Integrated brokerage OAuth and verified API payload serialization.',
          'Engineered client-side caching to eliminate redundant roundtrips.',
          'Maintained strict 100/100 Core Web Vitals and Lighthouse scores on production release.',
        ],
      },
    ],
  },

  'ui-ux': {
    id: 'ui-ux',
    disciplineName: 'UI/UX Designer',
    colorHex: '#483E54',
    shadowHex: '#322B3B',
    accentColor: '#C084FC',
    tagline: 'RESEARCH FIRST, PIXELS SECOND • HUMAN-CENTERED EXPERIENCES',
    fieldIntroduction: {
      badge: 'PRODUCT & INTERFACE DESIGN',
      headline: 'Human-Centric Interface Design & Scalable Design Systems',
      description:
        'Transforming complex product logic into effortless, accessible, and elegant user journeys. Deeply focused on semantic design tokens, typographic hierarchy, component architecture, and micro-interactions that elevate brand trust.',
      summaryBullets: [
        'User research, persona mapping & friction-free journey flows',
        'Information architecture, wireframing & interactive prototypes',
        'Scalable Figma design systems with semantic token architecture',
        'Micro-interactions, animation choreography & design QA',
        'WCAG AAA accessibility compliance & usability verification',
      ],
    },
    technologies: [
      {
        category: 'Design & Prototyping',
        items: ['Figma', 'FigJam', 'Framer', 'Adobe Illustrator', 'Adobe Photoshop'],
      },
      {
        category: 'Methodologies',
        items: ['User Research', 'Wireframing', 'Rapid Prototyping', 'Design Systems', 'Usability Testing'],
      },
      {
        category: 'Design Standards',
        items: ['Semantic Design Tokens', 'WCAG AAA Accessibility', 'Responsive Autolayout', '8pt Grid System'],
      },
      {
        category: 'Handoff & Collaboration',
        items: ['Figma Dev Mode', 'Component Spec Sheets', 'Design Tokens in JSON', 'Design QA'],
      },
    ],
    achievements: [
      {
        title: 'UI/UX Designer at Quicko Pvt Ltd',
        organization: 'Quicko Pvt Ltd, Ahmedabad',
        year: 'JAN 2026 – JUN 2026',
        detail:
          'Designed website interfaces and user experiences in Figma, focused on usability, visual clarity and flow. Built no-code web pages and interactive financial tools in Framer.',
      },
      {
        title: 'Figma Design System Architecture (180+ Components)',
        organization: 'Quicko & Freelance Projects',
        year: '2026',
        detail:
          'Created and maintained 180+ reusable Figma components with semantic dark/light tokens adopted across multi-disciplinary teams.',
      },
      {
        title: 'Graphic Designer at Hillspring LLC',
        organization: 'Hillspring LLC',
        year: 'JUL 2026 – SEP 2026',
        detail:
          'Managed visual content and brand identity for luxury real estate and lifestyle brands.',
      },
    ],
    projects: [
      {
        id: 'quicko-design-system',
        badge: 'FIGMA SYSTEM • QUICKO',
        title: 'Quicko Fintech Interface & Design System',
        category: 'Design System & User Experience',
        description:
          'Comprehensive design system of 180+ Figma components with semantic dark/light tokens, intuitive tax filing journeys, and zero drop-off onboarding flows.',
        tags: ['Figma', 'Design Tokens', 'Fintech UX', 'Prototyping', 'a11y'],
        mockupImage: '/images/uiux-designsystem-mockup.webp',
        ctaLabel: 'View Figma Case Study',
        ctaLink: 'https://github.com/Alan-040',
        isExternal: true,
        monitorPosition: 'right',
        screenContent: {
          type: 'portfolio',
          headline: 'FINTECH DESIGN SYSTEM',
          accentColor: '#C084FC',
        },
        contributions: [
          'Conducted user interviews to identify tax-filing friction points, reducing drop-off by 34%.',
          'Defined typographic hierarchy and spacing system based on a strict 8pt grid.',
          'Built clickable high-fidelity Figma prototypes for usability testing with real users.',
        ],
      },
      {
        id: 'personal-portfolio-design',
        badge: 'EDITORIAL UI • LIVE',
        title: 'Type-Led Product Designer Portfolio',
        category: 'Editorial Art Direction & UI',
        description:
          'A dark, type-led portfolio featuring oversized display typography, project hover previews, and brass metallic accent aesthetics.',
        tags: ['Typography', 'Dark Mode UI', 'Hover Previews', 'Editorial Layout'],
        mockupImage: '/images/portfolio-mockup.webp',
        ctaLabel: 'Explore Design System',
        ctaLink: 'https://github.com/Alan-040',
        isExternal: true,
        monitorPosition: 'left',
        screenContent: {
          type: 'portfolio',
          headline: 'PRODUCT DESIGNER',
          accentColor: '#F5E2A8',
        },
        contributions: [
          'Created bespoke responsive typography scales optimized across mobile and 4K displays.',
          'Engineered custom cursor states and hover thumbnail reveal physics.',
          'Balanced negative space and optical balance for maximum readability.',
        ],
      },
    ],
  },

  'web-dev': {
    id: 'web-dev',
    disciplineName: 'Web Developer',
    colorHex: '#5B7A63',
    shadowHex: '#3E5343',
    accentColor: '#00D09C',
    tagline: 'CRAFTING SPEED, FLUID MOTION & ZERO-LAYOUT-SHIFT ENGINEERING',
    fieldIntroduction: {
      badge: 'FRONT-END & MOTION ENGINEERING',
      headline: 'High-Performance Web Development & Scroll Storytelling',
      description:
        'Translating design visions into silky-smooth 60fps web experiences. Combining React, modern CSS Grid/Flexbox, GSAP ScrollTrigger, and Canvas graphics with strict zero layout shift (CLS = 0) and top-tier technical SEO.',
      summaryBullets: [
        'Modern responsive layouts from concept to production',
        'Fluid GSAP motion, scroll storytelling & canvas graphics',
        'Technical SEO, semantic HTML & cross-browser fidelity',
        'Zero layout shift (CLS = 0) & mobile touch performance',
        'Analytics integration, performance audits & ongoing launch support',
      ],
    },
    technologies: [
      {
        category: 'Core Web Tech',
        items: ['React 19', 'TypeScript', 'Next.js', 'HTML5 Semantic', 'CSS3 / Tailwind'],
      },
      {
        category: 'Motion & Canvas',
        items: ['GSAP 3.x', 'ScrollTrigger', 'Lenis Smooth Scroll', 'Three.js', 'Canvas API'],
      },
      {
        category: 'Performance & Audit',
        items: ['Vite', 'Turbopack', 'Lighthouse 100/100', 'Core Web Vitals', 'Vitest'],
      },
      {
        category: 'Deployment & CI',
        items: ['Vercel', 'Git / GitHub', 'Netlify', 'Edge Functions'],
      },
    ],
    achievements: [
      {
        title: '26+ Client Web Builds Delivered',
        organization: 'Freelance & Studio Projects',
        year: '2024 – Present',
        detail:
          'Engineered and launched responsive client websites across editorial, agency, and SaaS verticals.',
      },
      {
        title: 'Lead Developer on Zerodha P&L Landing Page (pnl.page)',
        organization: 'Quicko Pvt Ltd',
        year: '2026',
        detail:
          'Crafted high-converting, mobile-optimized landing experience for Quicko & Zerodha users.',
      },
      {
        title: '100/100 Lighthouse Performance & SEO Benchmarks',
        organization: 'Independent Audits',
        year: '2026',
        detail:
          'Maintained perfect audit scores across production websites with zero cumulative layout shifts.',
      },
    ],
    projects: [
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
        contributions: [
          'Implemented oversized editorial typography and responsive fluid sizing curves.',
          'Built custom GSAP timeline controlling the dynamic ambient lighting blur.',
          'Optimized hover preview thumbnail caching to prevent image decode stutters.',
        ],
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
          accentColor: '#F5E2A8',
        },
        contributions: [
          'Engineered custom smooth scroll with Lenis and coordinated GSAP ScrollTrigger pins.',
          'Implemented dark/light theme switching with smooth CSS custom property transitions.',
          'Achieved zero horizontal overflow and CLS = 0 across all screen breakpoints.',
        ],
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
        contributions: [
          'Built high-conversion responsive landing page with semantic HTML5 tags.',
          'Optimized font loading and assets for top-speed mobile rendering.',
          'Integrated analytics tracking and secure broker redirect flows.',
        ],
      },
    ],
  },

  'blender-3d': {
    id: 'blender-3d',
    disciplineName: '3D Blender Artist',
    colorHex: '#A65236',
    shadowHex: '#793A26',
    accentColor: '#FB923C',
    tagline: 'BRINGING IMAGINATION TO THREE DIMENSIONS • PHOTOREALISM & WEBGL',
    fieldIntroduction: {
      badge: '3D MODELING & SPATIAL ARTS',
      headline: 'Photorealistic 3D Modeling, PBR Shaders & Interactive WebGL',
      description:
        'Transforming conceptual geometry into photorealistic three-dimensional art, cinematic lighting compositions, hard-surface mechanical models, and real-time WebGL/Three.js web assets.',
      summaryBullets: [
        '3D modeling, low-poly & high-fidelity hard surface modeling',
        'Realistic PBR texturing, shaders & materials in Blender',
        'Cinematic lighting, camera composition & high-res rendering',
        'WebGL & glTF/GLB optimization for interactive web 3D',
        'Motion design, keyframe physics & dynamic simulations',
      ],
    },
    technologies: [
      {
        category: '3D Software & Renderers',
        items: ['Blender 4.x', 'Cycles X', 'EEVEE Next', 'Substance 3D Painter'],
      },
      {
        category: 'Materials & Shaders',
        items: ['PBR Shader Nodes', 'Procedural Textures', 'UV Unwrapping', 'Normal Baking'],
      },
      {
        category: 'Interactive Web 3D',
        items: ['Three.js', 'WebGL', 'glTF / GLB Pipeline', 'Draco Mesh Compression'],
      },
      {
        category: 'Motion & Simulation',
        items: ['Keyframe Animation', 'Rigid Body Physics', 'Camera Choreography', 'Particle FX'],
      },
    ],
    achievements: [
      {
        title: 'Interactive 3D Web Integration Lead',
        organization: 'Portfolio & Client Experiences',
        year: '2026',
        detail:
          'Engineered interactive Three.js components and procedural 3D elements integrated directly into web portfolios.',
      },
      {
        title: 'Hard-Surface Mesh Optimization Pipeline',
        organization: 'Independent 3D Works',
        year: '2025 – 2026',
        detail:
          'Decimated heavy 1.2M quad meshes down to 18K low-draw-call web assets with baked normal maps.',
      },
      {
        title: 'Studio Lighting & Photorealistic Render Portfolio',
        organization: 'Blender Art Showcase',
        year: '2026',
        detail:
          'Mastery of studio 3-point illumination, micro-roughness mapping, and cinematic camera physics.',
      },
    ],
    projects: [
      {
        id: 'blender-hardsurface',
        badge: 'BLENDER 4.x • CYCLES RAYTRACED',
        title: 'Cinematic Hard-Surface Model & PBR Materials',
        category: '3D Modeling & Studio Lighting',
        description:
          'High-precision procedural 3D model with realistic metallic reflections, micro-anisotropy, macro depth of field, and studio 3-point lighting setup.',
        tags: ['Blender 4.x', 'Cycles X', 'Hard Surface', 'PBR Shaders', '4K Render'],
        mockupImage: '/images/blender-render-mockup.webp',
        ctaLabel: 'View 3D Project Details',
        ctaLink: 'https://github.com/Alan-040',
        isExternal: true,
        monitorPosition: 'right',
        screenContent: {
          type: 'portfolio',
          headline: '3D PBR RENDER',
          accentColor: '#FB923C',
        },
        contributions: [
          'Modeled clean sub-d topology and bevel modifier workflows with zero non-manifold geometry.',
          'Designed procedural node graphs for brushed brass, anodized aluminum, and weathered glass.',
          'Calibrated camera sensor size, 85mm portrait focal length, and physically accurate f/2.8 bokeh.',
        ],
      },
      {
        id: 'interactive-webgl-models',
        badge: 'THREE.JS • INTERACTIVE',
        title: 'Interactive WebGL 3D Models & Floating Canvas',
        category: 'Real-Time WebGL • Three.js',
        description:
          'Procedural interactive 3D elements (including the wax-sealed metallic envelope and rotating smartphone) rendered dynamically at 60fps in the browser.',
        tags: ['Three.js', 'WebGL', 'Real-time Shaders', 'Mouse Physics', 'Draco'],
        mockupImage: '/images/portfolio-mockup.webp',
        ctaLabel: 'Test Live 3D Canvas',
        ctaLink: 'https://github.com/Alan-040',
        isExternal: true,
        monitorPosition: 'left',
        screenContent: {
          type: 'portfolio',
          headline: 'INTERACTIVE THREE.JS',
          accentColor: '#10B981',
        },
        contributions: [
          'Wrote procedural vertex geometry and custom mesh groups with zero external asset payload.',
          'Programmed interactive hover torque physics and sinusoidal floating damping.',
          'Optimized canvas render loops with DPR clamping for high battery efficiency on mobile devices.',
        ],
      },
    ],
  },
};

// Aliases for seamless reference role mapping
DISCIPLINE_SHOWCASES['app-dev'] = {
  ...DISCIPLINE_SHOWCASES['full-stack'],
  id: 'app-dev' as any,
  disciplineName: 'App Developer',
  tagline: 'FROM THE FIRST IDEA TO THE APP STORE',
};

DISCIPLINE_SHOWCASES['graphic-design'] = {
  ...DISCIPLINE_SHOWCASES['blender-3d'],
  id: 'graphic-design' as any,
  disciplineName: 'Graphic Designer',
  tagline: 'VISUAL IDENTITY, BRANDING & 3D ART',
};


