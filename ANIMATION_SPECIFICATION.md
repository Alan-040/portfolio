# ANIMATION & MOTION DESIGN SPECIFICATION

> **Target Website:** Rishi Cinematic Portfolio  
> **Motion Standard:** Film-grade 60fps/120fps physics-based choreography  
> **Key Tooling:** Framer Motion, GSAP 3 (ScrollTrigger, Flip, MorphSVG), Web Animations API, Three.js / CSS 3D Transforms

---

## 1. MOTION DESIGN PHILOSOPHY & PRINCIPLES

1. **Tactile Skeuomorphism with Digital Fluidity:**  
   Every physical artifact on the site (the pull-chain light cord, spiral notebook loops, brass door hardware, time machine dial, desktop monitors) responds with believable physical inertia, mass, and damping—avoiding unnatural linear motion.
2. **Scroll as the Film Projector:**  
   Sections do not simply slide past; they transform the spatial stage. The doors morph from individual focused architectural entries into an aligned 4-portal array; the time machine syncs vertical travel to temporal rewind.
3. **Seamless Portal Teleportation:**  
   Transitioning into a project discipline is not an abrupt URL jump. The physical door unlocks, opens into darkness, and the camera accelerates through the aperture, preserving spatial continuity.

---

## 2. INTERACTION & CHOREOGRAPHY CATALOG

### 2.1 Interaction 1: The Pull-Chain Theme Switch

```
  [Top Viewport]
        │
        │  (Thin beaded cord, L = 160px)
        │
        ●  (Brass bead weight)
        │
   [Cursor Drag ↓ 30px] ──> [Spring Release] ──> [Instant Blackout / Cream Reveal]
```

* **Trigger:** Click or downward drag gesture on the hanging cord.
* **Physics Model:** Spring dynamics (`stiffness: 400`, `damping: 18`, `mass: 0.8`).
* **Visual Sequence:**
  1. **Displacement:** As cursor drags down, the cord extends vertically by up to 35px; the bead tilts slightly (`rotate(-4deg)`).
  2. **Release / Switch:** When displacement exceeds 20px (or on direct click):
     - An instant color-swap flash triggers across the DOM (duration: 0.15s).
     - The background transitions from `#F5F1EB` to `#0D0E11` via an radial dark sweep originating from the cord's anchor point.
     - Rishi's portrait background alpha harmonizes with the new tone.
     - Text, buttons, and navigation elements flip their contrast polarity.
  3. **Elastic Rebound:** The cord snaps upward past its resting point (`-8px`) and oscillates 3 times before coming to rest (duration: 0.75s).
* **Audio Affordance:** Tactile metallic pull click sound effect (`playClick()`).

### 2.2 Interaction 2: The 3D Rolodex / Spiral Notebook Card Flip

* **Trigger:** Automatic timer (interval: 1.8s) + hover pause.
* **Perspective Context:** Parent container `perspective: 1200px; transform-style: preserve-3d;`.
* **3D Geometry:**
  - Stationary top header with **11 ring clips**.
  - Flipping sheet split into top and bottom flaps (or single sheet rotating around the ring axis `transform-origin: top center;`).
* **Keyframes Sequence:**
  1. **Flip Initiation (0% - 40% | 0.25s):**
     - Front face rotates from `rotateX(0deg)` to `rotateX(-90deg)`.
     - Specular highlight sweeps across the surface.
     - Shadow casts downward onto the card stack (`box-shadow: 0 20px 30px rgba(0,0,0,0.4)`).
  2. **Face Hand-off (40% - 100% | 0.35s):**
     - Text content flips to the next role (`App Developer` → `UI/UX Designer` → `Graphic Designer` → `Photographer` → `Web Developer`).
     - Sheet rotates from `rotateX(-90deg)` to `rotateX(0deg)` with a subtle micro-bounce (`overshoot: 3deg`).
     - Counter label ticks smoothly: `01 / 05` → `02 / 05`.
* **Easing Curve:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (Custom elastic snap).

### 2.3 Interaction 3: "Magic happens behind the doors" Section Scrub

* **Trigger:** Scroll-driven (GSAP `ScrollTrigger` pinned scrub).
* **Stage Sequence (Timeline Progress 0.0 → 1.0):**
  1. **Progress 0.00 – 0.20 (Entrance):**
     - Section title `Magic happens behind the doors` fades in (`opacity: 0 → 1`, `y: 40px → 0px`).
     - The 4 doors slide up into the viewport in a unified horizontal array with subtle stagger (`stagger: 0.08s`).
  2. **Progress 0.20 – 0.70 (Discipline Expansion):**
     - As the user scrolls, each door takes center stage:
       * Door expands to show its detailed service list (Web Dev, App Dev, UI/UX, Graphic Design).
       * Left/right alternating layout creates a dynamic reading cadence.
       * Floating tooltip `Click to enter` floats with an idle vertical bob (`y: [0, -6, 0]`, duration: 2s infinite ease-in-out).
  3. **Progress 0.70 – 1.00 (Re-alignment & Exit):**
     - The detailed checklist fades out (`opacity: 1 → 0`).
     - All 4 doors compress back into a clean horizontal quartet at the top of the viewport.
     - The stage transitions smoothly into Section 3 ("Let's go back in time.").

### 2.4 Interaction 4: 3D Door Open & Portal Teleportation

* **Trigger:** User clicks on any door (or its `Click to enter` tooltip).
* **Execution Choreography (Total Duration: 1.4s):**
  1. **Handle Actuation (0.00s – 0.20s):**
     - Brass lever rotates downward around its rosette: `rotateZ(12deg)`.
     - Keyhole emits a faint golden light glint.
  2. **Hinge Swing (0.20s – 0.70s):**
     - Door leaf rotates inward along its left edge: `transform-origin: left center; transform: perspective(1000px) rotateY(-82deg);`.
     - Pitch-black void inside the doorway becomes visible.
     - Light shadow casts onto the door frame.
  3. **Camera Z-Zoom (0.60s – 1.20s):**
     - Entire scene scales up exponentially: `transform: scale(8.5) translate3d(25%, 0, 0);`.
     - The dark doorway aperture expands to completely cover the viewport.
     - Motion blur simulates high-speed forward acceleration.
  4. **Showcase Reveal (1.20s – 1.40s):**
     - Black overlay fades out (`opacity: 1 → 0`).
     - The destination showcase page (`Web Development`) is revealed in full glory.
     - Floating `← Back to the doors` pill button slides up from bottom-left (`y: 60px → 0px`, `opacity: 0 → 1`).

### 2.5 Interaction 5: Time Machine Year Flip Reel & Progress Dial

* **Trigger:** Scroll progress through career milestones.
* **Choreography:**
  1. **Sticky Stage Pinning:**
     - Left column remains fixed in viewport while right column milestones scroll naturally.
  2. **Radial Clock Dial:**
     - The circular compass/clock tick ring behind the year rotates continuously based on scroll delta (`rotation: scrollY * 0.15deg`).
  3. **3D Year Number Reel Flip:**
     - When crossing milestone boundaries (e.g., from Milestone 3 in 2026 to Milestone 4 in 2025):
       * Outgoing digit (`2026`) blurs and slides upward (`y: 0 → -100%`, `filter: blur(8px)`, `opacity: 1 → 0`).
       * Incoming digit (`2025`) slides up from below (`y: 100% → 0`, `filter: blur(0px)`, `opacity: 0 → 1`).
       * Split-digit 3D card reel effect mimicking airport departure boards.
  4. **Progress Bar & Milestone Node:**
     - Active progress indicator updates: `01/05` → `02/05` → `03/05` → `04/05` → `05/05`.
     - Horizontal progress track smoothly tweens width: `width: calc((current / total) * 100%)`.
     - Right column timeline dot activates: scale up `1.4x`, turns vibrant green (`#22C55E`), and radiates a glowing aura pulse.

### 2.6 Interaction 6: Web Development Showcase & Desktop Monitor 3D Parallax

* **Trigger:** Viewport entry & mouse move over project cards.
* **Components:**
  1. **Card Stacking / Parallax:**
     - Each project card gently stacks or scrolls with layered parallax depth.
  2. **Apple Desktop Monitor 3D Tilt:**
     - As mouse hovers over the monitor, it tilts in 3D space toward the cursor:
       ```javascript
       rotateX = (mouseY / cardHeight - 0.5) * -12; // max ±6deg
       rotateY = (mouseX / cardWidth - 0.5) * 12;   // max ±6deg
       ```
     - Subtle specular gloss glare shifts across the glass screen.
  3. **Interactive Screen Visuals:**
     - *Sundown Studio:* Ambient red radial fluid aura animates smoothly in the background.
     - *Personal portfolio:* Minimalist clean typography with interactive hover preview lists.
     - *P&L Page for Zerodha:* Financial matrix graphs with real-time green data bar hover highlights.

---

## 3. TIMING CURVES & EASING FUNCTIONS

| Animation Sequence | Duration | Easing Function | CSS / JS Expression |
| :--- | :--- | :--- | :--- |
| **Pull Cord Drag Release** | 0.8s | Custom Spring | `type: "spring", stiffness: 400, damping: 20` |
| **Theme Color Invert** | 0.18s | Linear Flash | `ease: "linear"` |
| **Rolodex Card Flip** | 0.55s | Snap Over-shoot | `cubic-bezier(0.34, 1.4, 0.64, 1)` |
| **Door Lever Depress** | 0.15s | Ease In-Out | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Door Swing Open** | 0.65s | Ease In Heavy | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` |
| **Portal Zoom Inward** | 0.75s | Power3 In | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **Year Number Reel** | 0.45s | Back Out | `cubic-bezier(0.175, 0.885, 0.32, 1.15)` |
| **Monitor Tilt Parallax** | 0.3s | Smooth Damp | `ease: "power2.out"` |
| **Tooltip Float Bob** | 2.2s | Sine In-Out Loop | `cubic-bezier(0.445, 0.05, 0.55, 0.95)` |

---

## 4. PERFORMANCE & ACCESSIBILITY SPECIFICATIONS

1. **Hardware Acceleration:**
   - All 3D transforms (`rotateX`, `rotateY`, `scale`, `translate3d`) are promoted to dedicated GPU compositor layers via `will-change: transform`.
   - Backdrop filters (`backdrop-filter: blur()`) are capped at 16px to maintain 120fps on high-refresh displays.
2. **Reduced Motion (`prefers-reduced-motion: reduce`):**
   - 3D door swing and high-speed portal zoom are replaced with an elegant fade through black (`opacity: 0 → 1`, duration: 0.3s).
   - Rolodex card flip is replaced with a smooth vertical cross-fade.
   - Time machine year flip replaces 3D blur reel with an instant numeral cross-fade.
3. **Mobile & Touch Adaptations:**
   - On touch devices without hover, the pull-cord operates on simple tap.
   - The desktop monitor 3D tilt is driven by device orientation / gyroscope (via `DeviceOrientationEvent`) or subtle ambient drift.

