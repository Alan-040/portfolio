# IMPLEMENTATION PLAN: CINEMATIC PORTFOLIO RECREATION

> **Target Goal:** 1:1 Maximum-Visual-Fidelity Recreation of the Portfolio Website in `public/reference/reference.mp4`  
> **Status:** Phase 1 Complete (Analysis & Specifications). Awaiting user sign-off before Phase 2 implementation commences.  
> **Rule:** No redesigns, no placeholder sections, no premature execution without approval.

---

## 1. RECOMMENDED TECHNICAL ARCHITECTURE & STACK

To achieve 120fps motion fidelity, zero layout shifts, and seamless 3D spatial transitions, the optimal modern stack is:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             TECHNICAL STACK                              │
├──────────────────────┬───────────────────────────────────────────────────┤
│ Framework            │ Next.js 15 (App Router) or Vite + React 19 + TS   │
│ Styling              │ Tailwind CSS v3/v4 + CSS Variables + PostCSS      │
│ Motion & Physics     │ Framer Motion 12 + GSAP 3 (ScrollTrigger)         │
│ 3D & Graphics        │ Lucide React, Three.js / Canvas 2D / CSS 3D       │
│ Sound Engine         │ Howler.js or Web Audio API (Subtle tactile SFX)   │
│ Icons & Typography   │ Inter, JetBrains Mono, Custom SVG Hardware        │
└──────────────────────┴───────────────────────────────────────────────────┘
```

### Why this stack:
1. **Framer Motion + GSAP ScrollTrigger:**  
   GSAP `ScrollTrigger` is the industry standard for pinned scrub timelines (required for the dual-column Time Machine and the Doors accordion/scrub), while Framer Motion handles component-level physics springs (the pull-chain cord, rolodex flips, button hovers).
2. **CSS 3D Transforms with Hardware Layer Promotion:**  
   Achieves native 60–120fps GPU acceleration for the notebook binder flip, the door inward swing, and the Apple desktop monitor tilt without heavyweight WebGL dependencies.

---

## 2. PROJECT DIRECTORY STRUCTURE

```
cinematic-portfolio/
├── public/
│   ├── reference/
│   │   ├── reference.mp4              # Source video
│   │   └── frames/                    # 75 extracted reference frames
│   ├── assets/
│   │   ├── images/
│   │   │   ├── rishi-portrait.png     # Cutout portrait with alpha
│   │   │   ├── sundown-preview.png    # Sundown studio display content
│   │   │   ├── portfolio-preview.png  # Personal portfolio display content
│   │   │   └── zerodha-preview.png    # Zerodha P&L display content
│   │   ├── models/                    # 3D assets / textures (optional)
│   │   └── audio/
│   │       ├── cord-pull.mp3          # Pull chain tactile click
│   │       ├── door-latch.mp3         # Brass handle latch release
│   │       └── card-flip.mp3          # Subtle paper flip
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, theme context, meta
│   │   ├── page.tsx                   # Main Landing Page (Hero, Doors, Timeline, Contact)
│   │   ├── showcase/
│   │   │   └── [discipline]/
│   │   │       └── page.tsx           # Showcase view (Web Dev, App Dev, UI/UX, Graphic)
│   │   └── globals.css                # Color tokens, fonts, custom 3D utilities
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx             # Sticky nav with live time & date
│   │   │   ├── PullChain.tsx          # Interactive physics pull-cord theme toggle
│   │   │   ├── ButtonPill.tsx         # Pill CTA button variants
│   │   │   └── VisitingCardModal.tsx  # Lapel badge expandable business card
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx        # Hero container
│   │   │   ├── RolodexCard.tsx        # 3D spiral notebook binder flipper
│   │   │   └── HeroPortrait.tsx       # Rishi portrait cutout + badge
│   │   ├── doors/
│   │   │   ├── DoorsSection.tsx       # Pinned scrub container
│   │   │   ├── ArchedDoor.tsx         # Fluted door with brass plaque & lever
│   │   │   ├── DoorChecklist.tsx      # Discipline deliverables list
│   │   │   └── DoorPortalTransition.tsx # 3D door swing & zoom portal
│   │   ├── timeline/
│   │   │   ├── TimelineSection.tsx    # Dual-column time machine container
│   │   │   ├── YearReel.tsx           # 3D animated year number flip
│   │   │   ├── RadialClockDial.tsx    # Concentric compass tick marks
│   │   │   └── TimelineMilestone.tsx  # Career milestone item with glowing node
│   │   ├── contact/
│   │   │   ├── ContactSection.tsx     # Got a project headline & CTAs
│   │   │   └── Footer.tsx             # 3-column footer matrix
│   │   └── showcase/
│   │       ├── ShowcaseView.tsx       # Discipline showcase page wrapper
│   │       ├── ProjectCard.tsx        # Alternating project card
│   │       ├── StudioDisplayMockup.tsx # Apple desktop monitor 3D frame
│   │       └── BackToDoorsButton.tsx  # Floating pill navigation button
│   ├── hooks/
│   │   ├── useThemeMode.ts            # Cream/Dark mode state & toggle
│   │   ├── useLiveClock.ts            # Local system time & formatted date
│   │   └── useScrollProgress.ts       # GSAP scroll observer integration
│   ├── lib/
│   │   ├── constants.ts               # Content data (milestones, projects, doors)
│   │   └── audio.ts                   # Tactile sound effects triggers
│   └── types/
│       └── index.ts                   # TypeScript interfaces
├── REFERENCE_ANALYSIS.md              # Frame-by-frame visual analysis
├── DESIGN_SYSTEM.md                   # Complete color, type & component tokens
├── ANIMATION_SPECIFICATION.md         # Motion curves, physics & choreography
└── IMPLEMENTATION_PLAN.md             # This phased roadmap
```

---

## 3. ASSET PREPARATION STRATEGY

To ensure 1:1 visual fidelity with the reference video without using placeholder images:

1. **Rishi Portrait Cutout:**
   - Source: Crop Rishi's portrait from the highest-clarity frame (`frame_001.jpg` / `frame_005.jpg`), upscale using bicubic/AI enhancement, remove the background with alpha channel masking to create `rishi-portrait.png`.
2. **Door Hardware & Fluting Assets:**
   - Procedural SVG / CSS gradients for the 24 vertical fluted ribs.
   - Vector SVGs for the brushed brass nameplates (`WEB DEVELOPER`, `APP DEVELOPER`, `UI/UX DESIGNER`, `GRAPHIC DESIGNER`), brass rosettes, and horizontal lever handles.
3. **Apple Studio Display Mockup:**
   - Pure vector SVG monitor frame with authentic Apple chin, matte glass gradient, silver pedestal stand, and responsive screen aperture.
4. **Showcase Screen Content:**
   - *Sundown Studio:* High-resolution editorial layout with animated red gradient aura.
   - *Personal portfolio:* Typography-led dark minimalist layout.
   - *Zerodha P&L:* Financial matrix dashboard with real-time green glowing bars.

---

## 4. PHASED IMPLEMENTATION ROADMAP

```
[Phase 1] ──> [Phase 2] ──> [Phase 3] ──> [Phase 4] ──> [Phase 5] 
Analysis      Setup &       Nav &         Hero &        Doors &
& Specs       Assets        Pull Cord     Rolodex       Accordion
(COMPLETE)

      ──> [Phase 6] ──> [Phase 7] ──> [Phase 8] ──> [Phase 9] ──> [Phase 10]
          Timeline      Contact &     3D Portal     Audio &       QA & Frame
          & Reel        Footer        & Showcase    Mobile        Verification
```

### Phase 1: Reference Video Analysis & Documentation (COMPLETE)
* [x] Frame-by-frame extraction at 0.25-second intervals via FFmpeg (75 frames).
* [x] Deep visual and motion analysis across all sections.
* [x] Identification and verification of actual section sequence vs preliminary descriptions.
* [x] Separation of physical recording artifacts from true website UI.
* [x] Author `REFERENCE_ANALYSIS.md`, `DESIGN_SYSTEM.md`, `ANIMATION_SPECIFICATION.md`, and `IMPLEMENTATION_PLAN.md`.

### Phase 2: Project Scaffolding & Asset Preparation (Next Phase - On User Approval)
* [ ] Initialize Next.js / Vite React TypeScript application in workspace.
* [ ] Install required dependencies: `framer-motion`, `gsap`, `lucide-react`, `howler`, `clsx`, `tailwind-merge`.
* [ ] Extract, crop, and prepare pixel-accurate image assets (`rishi-portrait.png`, screen mockups).
* [ ] Configure Tailwind CSS theme tokens (`--bg-cream-primary`, `--bg-dark-primary`, door colorways, typography).

### Phase 3: Global Shell, Navigation & Pull-Chain Theme Switcher
* [ ] Build `Navbar.tsx` with live time updater (`Local time 3:00pm`) and date formatting.
* [ ] Implement `PullChain.tsx` with Framer Motion spring physics and draggable bead.
* [ ] Wire up dual-theme provider (Cream `#F5F1EB` ↔ Obsidian Dark `#0D0E11`).
* [ ] Verify seamless color polarity flips across all elements.

### Phase 4: Hero Section & 3D Rolodex Flipper
* [ ] Construct Hero typography (`Hi, I'm Rishi.`, `I am a`, `• Independent Freelancer`).
* [ ] Implement `RolodexCard.tsx` with 11 wire spiral rings and CSS 3D `rotateX` card flip.
* [ ] Integrate roles: `App Developer`, `UI/UX Designer`, `Graphic Designer`, `Photographer`, `Web Developer`.
* [ ] Position Rishi's portrait cutout with `My visiting card` lapel badge.
* [ ] Implement `ButtonPill.tsx` with primary (`Start a project →`) and secondary (`See my work`) states.
* [ ] Build bottom status bar (`AVAILABLE FOR WORK`, `REMOTE-FIRST, WORLDWIDE`, `SCROLL TO EXPLORE ↓`).

### Phase 5: "Magic happens behind the doors" Section
* [ ] Create `DoorsSection.tsx` with GSAP `ScrollTrigger` pinned scroll scrub.
* [ ] Implement `ArchedDoor.tsx` featuring fluted panels, brass hardware, and `Click to enter` speech bubble.
* [ ] Build 4 discipline variants:
  1. Navy Blue (`WEB DEVELOPER`)
  2. Deep Aubergine (`APP DEVELOPER`)
  3. Sage Green (`UI/UX DESIGNER`)
  4. Terracotta Rust (`GRAPHIC DESIGNER`)
* [ ] Implement detailed service deliverable checklists for each discipline.
* [ ] Implement the dynamic morph from focused individual doors into an aligned 4-door line.

### Phase 6: Time Machine Timeline ("Let's go back in time.")
* [ ] Build dual-column split container with pinned left column and scrolling right column.
* [ ] Implement `RadialClockDial.tsx` with rotating tick marks in background.
* [ ] Implement `YearReel.tsx` with 3D numeric flip transition (`2026` → `2025` → `2022`).
* [ ] Implement milestone progress tracker (`(clock icon) 01 / 05` to `05 / 05`) with progress bar.
* [ ] Build vertical timeline with glowing green active nodes for all 5 career milestones:
  1. Oct 2026 - Now: Independent freelancer
  2. Jul 2026 - Sep 2026: Graphic designer (Hillspring LLC)
  3. Jan 2026 - Jun 2026: UI/UX designer (Quicko Pvt Ltd)
  4. Jan 2025 - May 2025: Graphic designer intern (WET, Delhi)
  5. Jul 2022 - May 2026: B.Tech Computer Science (PDEU)

### Phase 7: Contact Section & Multi-Column Footer
* [ ] Build `ContactSection.tsx` with `• AVAILABLE FOR NEW WORK` badge.
* [ ] Implement display typography: `Got a project? / Let's build it together.`
* [ ] Add body copy and CTA buttons (`Start a project →`, `See my work`).
* [ ] Build `Footer.tsx` with `WORK`, `NAVIGATE`, and `STATUS` columns.

### Phase 8: 3D Door Portal Zoom & Web Development Showcase
* [ ] Implement door click event: handle depress, door swings inward `rotateY(-82deg)`.
* [ ] Implement camera zoom into black doorway aperture (`scale: 8.5`).
* [ ] Build `ShowcaseView.tsx` with `← Back to the doors` floating pill button.
* [ ] Build `StudioDisplayMockup.tsx` Apple desktop monitor frame with silver stand.
* [ ] Build the 3 project showcase cards:
  1. *Sundown Studio* (Studio website, right monitor, red ambient glow)
  2. *Personal portfolio* (Product designer, left monitor, minimalist dark typography)
  3. *P&L Page for Zerodha* (Broker landing page, right monitor, live financial graphs, `Visit live site →`)
* [ ] Wire up return portal transition back to main landing page.

### Phase 9: Audio Polish, Responsive & Touch Adaptations
* [ ] Add subtle, non-intrusive sound effects for pull chain, door unlatch, and button clicks (with mute toggle).
* [ ] Ensure flawless tablet and mobile layouts with touch gestures.
* [ ] Verify accessibility standards (`prefers-reduced-motion`, screen reader tags, keyboard navigation).

### Phase 10: Visual Fidelity QA & Frame Comparison
* [ ] Side-by-side comparison between implementation and reference video frames:
  - Frame 001 (Cream Hero)
  - Frame 012 (Dark Mode Switch)
  - Frame 018 (4 Doors Line)
  - Frame 025 (Web Development Door Detail)
  - Frame 035 (Timeline 2026 Milestone 2)
  - Frame 040 (Timeline 2025 Milestone 4)
  - Frame 044 (Contact Section)
  - Frame 057 (Door Swing Open)
  - Frame 065 (Sundown Studio Showcase)
  - Frame 075 (Zerodha P&L Showcase)
* [ ] Final sign-off.

---

## 5. VERIFICATION MATRIX (FRAME-BY-FRAME TRUTH TABLE)

| Video Timestamp | Reference Frame | Target Feature to Verify | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **0.00s** | Frame 001 | Cream Hero, Nav Bar, Time/Date | Cream `#F5F1EB` bg, live clock, Rishi portrait with badge |
| **0.50s - 2.50s**| Frames 003, 007 | 3D Rolodex Notebook Flip | Flips from App Dev → UI/UX → Graphic Designer with 11 rings |
| **2.75s - 3.00s**| Frames 011, 012 | Pull-Chain Dark Mode Toggle | Cord pulls down, springs back, instant dark mode switch |
| **4.50s** | Frame 018 | Section 2: "Magic happens behind the doors" | Centered headline, 4 arched doors side-by-side |
| **4.75s - 6.25s**| Frames 019 - 025| Individual Door Detail Scrub | Focused doors with brass plaques & 5 checklist deliverables |
| **8.00s - 10.50s**| Frames 032 - 042| Time Machine Timeline | Left pinned year reel (`2026` → `2025` → `2022`), 5 milestones |
| **11.00s** | Frame 044 | Contact & Footer | "Got a project? Let's build it together.", 3-column footer |
| **13.50s - 14.50s**| Frames 054 - 058| 3D Door Open & Portal Zoom | Blue door handle clicks, swings open, zoom through doorway |
| **15.00s - 18.73s**| Frames 060 - 075| Web Development Showcase | 3 stacked cards with Apple Studio Display mockups & back pill |

---

## 6. AWAITING USER APPROVAL

Per your instructions:
- **No implementation has been started yet.**
- **No redesigns or placeholder sections have been introduced.**
- **All 4 documentation files are complete, cross-referenced, and persisted to disk.**

Please review the analysis and implementation plan. Once you grant approval, we will proceed immediately to **Phase 2 (Project Setup, Core Scaffolding & Asset Preparation)**.

