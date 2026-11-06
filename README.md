# Cinematic Portfolio — 1:1 Reference Recreation

A cinematic, high-performance personal portfolio website for Boobalan, recreated with maximum visual fidelity from `public/reference/reference.mp4`.

## Features

- **Dual-Theme Architecture:** Dynamic switching between Cream Light Mode (`#F5F1EB`) and Obsidian Dark Mode (`#0D0E11`) via an interactive pull-chain lamp cord with spring physics.
- **3D Rolodex Notebook Flipper:** 11 spiral binder rings with 3D `rotateX` card flipping through roles (`App Developer`, `UI/UX Designer`, `Graphic Designer`, `Photographer`, `Web Developer`).
- **Interactive Arched Doors ("Magic happens behind the doors"):** 4 discipline portals with fluted ribs, brushed brass hardware, service deliverable checklists, and "Click to enter" speech-bubble tooltips.
- **Time Machine Dual-Column Timeline ("Let's go back in time."):** Sticky left column with rotating radial clock dial, 3D animated year reel (`2026` → `2025` → `2022`), and progress tracking across 5 career milestones.
- **Cinematic 3D Door Portal Transition:** Clicking a door unlatches the brass lever, swings the door inward on its hinge, and zooms straight through the aperture into darkness.
- **Web Development Project Showcase:** Alternating showcase cards with Apple Studio Display 3D monitor mockups, interactive screen contents (*Sundown Studio*, *Personal portfolio*, *P&L Page for Zerodha*), and a floating `← Back to the doors` button.
- **Smooth Inertia Scrolling:** Driven by Lenis and synchronized with GSAP ScrollTrigger.
- **Atmospheric 3D Background:** Subtle particle constellation rendered via Three.js and React Three Fiber.

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom CSS Variables & 3D Utilities
- **Animation:** GSAP 3 + ScrollTrigger + CSS 3D Transforms
- **Smooth Scroll:** Lenis
- **3D Graphics:** Three.js + @react-three/fiber + @react-three/drei
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

## Documentation Reference

- [REFERENCE_ANALYSIS.md](file:///d:/cinematic-portfolio/REFERENCE_ANALYSIS.md) — Complete frame-by-frame visual and motion analysis.
- [DESIGN_SYSTEM.md](file:///d:/cinematic-portfolio/DESIGN_SYSTEM.md) — Color tokens, typography, and component specifications.
- [ANIMATION_SPECIFICATION.md](file:///d:/cinematic-portfolio/ANIMATION_SPECIFICATION.md) — Motion curves, physics, and choreography.
- [IMPLEMENTATION_PLAN.md](file:///d:/cinematic-portfolio/IMPLEMENTATION_PLAN.md) — 10-phase roadmap and verification matrix.
- [AGENTS.md](file:///d:/cinematic-portfolio/AGENTS.md) — Developer and agent governance rules.
- [ASSET_INVENTORY.md](file:///d:/cinematic-portfolio/ASSET_INVENTORY.md) — High-DPI asset audit and image inventory.
- [FINAL_QA_REPORT.md](file:///d:/cinematic-portfolio/FINAL_QA_REPORT.md) — Automated cross-device quality audit and CDP test report.
- [DEPLOYMENT.md](file:///d:/cinematic-portfolio/DEPLOYMENT.md) — Production build analysis and Vercel deployment guide.


