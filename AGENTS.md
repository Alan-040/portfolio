# AGENTS.md — DEVELOPER & AI AGENT GOVERNANCE RULES

> **Project:** Cinematic Portfolio Website Recreation  
> **Primary Authority:** `public/reference/reference.mp4` (and 75 frame captures in `public/reference/frames/`)  
> **User Portrait Asset:** `public/images/profile-original.png` (Immutable authentic user photograph)  

---

## 1. CORE MANDATE & GOVERNING RULES

These 18 rules are binding and MUST be strictly followed for all future modifications to this project:

1. **The uploaded reference video is the primary design authority.** Every layout, motion curve, visual detail, and interaction must align with `public/reference/reference.mp4`.
2. **Maximum visual fidelity is the priority.** Always replicate the original aesthetic with precision rather than building generic alternatives.
3. **Never redesign sections without permission.** Do not introduce speculative layouts, alternative aesthetics, or unsolicited redesigns.
4. **Never replace the original portrait.** The file at `public/images/profile-original.png` is the user's authentic personal photograph and must be used directly.
5. **Never modify facial appearance.** Do not alter the face, hair, sunglasses, skin tone, clothing, or background. No AI face generators, smoothing, or beauty filters.
6. **Preserve the original section sequence:**
   - **Scene 01:** Hero Introduction with 3D Rolodex notebook card & user portrait.
   - **Scene 02:** Magic Behind the Doors (4 colorful vertical arched doors).
   - **Scene 03:** Timeline (`2026` ➔ `2025` ➔ `2022` sticky dual-column reel).
   - **Scene 04:** Contact section & editorial footer.
   - **Scene 05:** Web Development Showcase (sub-view accessed through the door portal).
7. **Keep the original colour palette and typography.** Respect Cream Light Mode (`#F5F1EB`), Obsidian Dark Mode (`#0D0E11`), the 4 door tones (Navy Blue `#1E3A5F`, Aubergine `#483E54`, Sage Green `#5B7A63`, Terracotta `#A65236`), brass metallic accents, and editorial typography.
8. **Use modular React components.** Maintain single-responsibility, cleanly typed components in `src/components/` and `src/sections/`.
9. **Keep animation logic separate.** Pure timelines and scroll triggers reside in `src/animations/`. Presentation components should invoke animation helpers or pass refs rather than inlining complex timelines.
10. **Use GSAP for cinematic transitions.** Rely on GSAP and ScrollTrigger for coordinated scroll progress, directional masks, and spatial depth.
11. **Use Three.js selectively.** Employ 3D for subtle depth, perspective tilt, and portal entrances. Do not convert the entire portfolio into an unreadable 3D environment.
12. **Maintain mobile and desktop responsiveness.** Ensure zero horizontal overflow (`scrollWidth === innerWidth`), readable typography, and stable layouts (CLS = 0) across all screen widths (360px up to 4K).
13. **Never use blurry images.** Use high-resolution, high-DPI assets (minimum 2x Retina, 1600 × 1000 px for 16:10 monitor mockups) in WebP format with crisp typography and zero compression artifacts.
14. **Never introduce unnecessary dependencies.** Keep dependencies lean, performant, and strictly audited. Avoid adding large UI libraries that duplicate existing functionality.
15. **Test every important change in the browser.** Validate the running application on `http://localhost:5173/`, inspecting console logs, layout stability, and runtime performance.
16. **Compare screenshots against the reference.** Always cross-reference rendered screens against extracted frames in `public/reference/frames/`.
17. **Do not delete working functionality unnecessarily.** Preserve verified interactive features (e.g. pull-chain theme toggle, visiting card badge popup, 3D tilt parallax, door portal navigation, sticky year reel).
18. **Ask before making major design changes.** If a design ambiguity arises, present findings and seek user clarification rather than making unilateral assumptions.

---

## 2. PROJECT ARCHITECTURE OVERVIEW

```text
cinematic-portfolio/
├── public/
│   ├── images/              # High-res WebP mockups & authentic portrait (profile-original.png)
│   │   └── placeholders/    # Clearly marked 16:10 drop-in template placeholders
│   └── reference/           # reference.mp4 & 75 extracted verification frames
├── src/
│   ├── animations/          # Pure animation controllers (GSAP, ScrollTrigger)
│   ├── components/          # Reusable UI components (Navbar, ProjectCard, CustomCursor, ThreeDScene)
│   ├── hooks/               # State & observer hooks (useSmoothScroll, useResponsive)
│   ├── sections/            # The 5 primary layout scenes
│   ├── styles/              # Modular CSS (global, variables, animations, responsive)
│   ├── App.tsx              # Root coordinator & view state
│   └── main.tsx             # Application bootstrap
├── scripts/                 # Asset generation & automated CDP QA runners
└── qa_results/              # Automated screenshot captures across all viewports
```

---

## 3. VERIFICATION COMMANDS

- **Dev Server:** `npm run dev` (starts on port 5173).
- **Type Check & Production Build:** `npm run build` (runs `tsc && vite build`).
- **Automated QA & Screenshot Capture:** `node scripts/qa_runner.mjs`.
- **Asset Generation:** `python scripts/generate_assets.py`.
