# DESIGN SYSTEM SPECIFICATION: CINEMATIC PORTFOLIO

> **Project:** Rishi Cinematic Portfolio Website  
> **Source Fidelity:** 1:1 Precise Digital Recreation of `public/reference/reference.mp4`  
> **Aesthetic Philosophy:** Swiss precision meets tactile skeuomorphism and modern cinematic dark mode. Tactile physical affordances (pull cord, spiral notebook, brass door hardware, desktop displays) combined with immaculate minimalist typography.

---

## 1. COLOR PALETTE & TOKENS

The website features a dual-theme architecture: an organic, warm cream daytime aesthetic and an obsidian cinematic dark mode, plus a distinct four-color architectural palette for the discipline doors.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             THEME FOUNDATION                             │
├───────────────────────────────┬──────────────────────────────────────────┤
│ Cream Light Theme             │ Obsidian Dark Theme                      │
│ Background: #F5F1EB (Warm Cream) │ Background: #0D0E11 (Obsidian Void)      │
│ Surface:    #ECE7E1           │ Surface:    #16171B (Charcoal Surface)   │
│ Text Prim:  #111215           │ Text Prim:  #F7F7F8 (Crisp Off-White)    │
│ Text Muted: #6B6862           │ Text Muted: #8E9099                      │
└───────────────────────────────┴──────────────────────────────────────────┘
```

### 1.1 Base Theme Tokens

```css
:root {
  /* Cream Light Theme */
  --bg-cream-primary: #F5F1EB;
  --bg-cream-secondary: #EBE5DC;
  --bg-cream-card: #FFFFFF;
  --text-cream-primary: #121316;
  --text-cream-secondary: #5A5752;
  --text-cream-muted: #8A857D;
  --border-cream: rgba(18, 19, 22, 0.08);

  /* Obsidian Dark Theme */
  --bg-dark-primary: #0D0E11;
  --bg-dark-secondary: #131418;
  --bg-dark-card: #18191E;
  --bg-dark-elevated: #202229;
  --text-dark-primary: #F7F7F8;
  --text-dark-secondary: #A0A2AC;
  --text-dark-muted: #646670;
  --border-dark: rgba(255, 255, 255, 0.08);
  --border-dark-subtle: rgba(255, 255, 255, 0.04);
}
```

### 1.2 Discipline Doors Architectural Palette

The 4 arched doors feature deep, refined satin architectural lacquer tones:

| Discipline | Door Token | Exact Hex | Fluted Shadow Hex | Brass Accent | Plaque Text |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Web Development** | `--door-web-blue` | `#1E3A5F` (Navy Slate) | `#142740` | Satin Brass | `WEB DEVELOPER` |
| **App Development** | `--door-app-purple` | `#483E54` (Deep Aubergine) | `#322B3B` | Satin Brass | `APP DEVELOPER` |
| **UI/UX Design** | `--door-ui-green` | `#5B7A63` (Muted Sage) | `#3E5343` | Satin Brass | `UI/UX DESIGNER` |
| **Graphic Design** | `--door-graphic-orange` | `#A65236` (Terracotta Rust) | `#793A26` | Satin Brass | `GRAPHIC DESIGNER` |

### 1.3 Skeuomorphic Metallic & Hardware Tokens

```css
:root {
  /* Brushed Brass Hardware */
  --brass-highlight: #F5E2A8;
  --brass-base: #C8A355;
  --brass-shadow: #8C6A24;
  --brass-bevel: #E0C172;
  --brass-gradient: linear-gradient(135deg, #F5E2A8 0%, #C8A355 50%, #8C6A24 100%);
  --brass-sheen: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%);
  
  /* Door Shadow & Depth */
  --door-depth-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.65), 0 12px 24px -8px rgba(0, 0, 0, 0.45);
  --door-recess-shadow: inset 0 6px 12px rgba(0,0,0,0.45), inset 0 -6px 12px rgba(255,255,255,0.05);

  /* Live Glow & Status */
  --status-green-glow: #22C55E;
  --status-green-aura: rgba(34, 197, 94, 0.35);
  --clock-dial-tick: rgba(255, 255, 255, 0.08);
  --clock-dial-accent: rgba(255, 255, 255, 0.25);
}
```

---

## 2. TYPOGRAPHY SYSTEM

The website typography uses a clean, modern Grotesque / Geometric sans-serif (e.g., *Inter*, *Neue Haas Grotesk*, or *SF Pro Display*) with a complementary monospace font for numerals, timeline dates, and status codes.

```
Font Primary:    "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif
Font Monospace:  "JetBrains Mono", "SF Mono", Menlo, monospace
```

### 2.1 Type Scale & Hierarchy

| Hierarchy Role | Font Family | Size | Weight | Line Height | Letter Spacing | Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Giant Timeline Year** | Primary | 96px – 120px | 700 (Bold) | 0.9 | -0.04em | Normal |
| **Hero Headline** | Primary | 48px – 56px | 700 (Bold) | 1.05 | -0.03em | Normal |
| **Section Titles** | Primary | 36px – 44px | 600 (SemiBold) | 1.15 | -0.025em | Normal |
| **Showcase Project Title** | Primary | 32px – 38px | 600 (SemiBold) | 1.15 | -0.02em | Normal |
| **Rolodex Card Title** | Primary | 28px – 32px | 700 (Bold) | 1.1 | -0.02em | Normal |
| **Door Subtitle Header** | Primary | 11px – 12px | 600 (SemiBold) | 1.3 | +0.08em | UPPERCASE |
| **Checklist / Body Text** | Primary | 15px – 16px | 400 (Regular) | 1.55 | -0.01em | Normal |
| **Timeline Date Subhead** | Monospace | 12px – 13px | 500 (Medium) | 1.2 | +0.06em | UPPERCASE |
| **Pill Badges & Buttons** | Primary | 13px – 14px | 500 (Medium) | 1.0 | +0.01em | Normal |
| **Eyebrow / Micro-status** | Primary | 11px – 12px | 500 (Medium) | 1.0 | +0.04em | Normal |

---

## 3. LAYOUT, GRID & SPACING MATRIX

### 3.1 Global Viewport & Container Constants

```css
:root {
  --max-content-width: 1360px;
  --site-padding-x: clamp(24px, 5vw, 64px);
  --nav-height: 64px;
  --section-spacing-y: clamp(80px, 12vh, 160px);
}
```

### 3.2 Proportions & Dimensional Radii

- **Pill Buttons & Tags:** `border-radius: 9999px` (Full circle/capsule).
- **Rolodex / Notebook Card:** `border-radius: 12px`, aspect ratio ~3.2:1 (width: 320px, height: 100px).
- **Arched Doors:**
  - Aspect Ratio: ~1:2.4 (width: 220px – 280px, height: 530px – 670px).
  - Upper Border Radius: `border-top-left-radius: 140px; border-top-right-radius: 140px;` (Perfect semi-circular arch).
  - Lower Border Radius: `border-bottom-left-radius: 6px; border-bottom-right-radius: 6px;`.
- **Showcase Cards:** `border-radius: 20px`, internal padding `clamp(32px, 4vw, 56px)`.
- **Apple Desktop Monitor Mockup:**
  - Display Aspect Ratio: 16:10 or 16:9.
  - Chin / Bezel: 12px dark border, 24px bottom chin with centered Apple logo tint.
  - Stand: Anodized aluminum curved pedestal stand, width 32% of monitor, height 64px, tilted foot base.

---

## 4. COMPONENT SPECIFICATIONS

### 4.1 Sticky Navigation Bar

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Home  Web Development  App Development  UI/UX Design  ... | Time  Date  │
└──────────────────────────────────────────────────────────────────────────┘
```
- **Position:** Pinned top (`position: fixed; top: 0; left: 0; right: 0; z-index: 50;`).
- **Surface:** Glassmorphism backdrop filter (`backdrop-filter: blur(16px); background: rgba(13, 14, 17, 0.75);` in dark mode; `background: rgba(245, 241, 235, 0.85);` in cream mode).
- **Left/Center Items:**
  - `Home`
  - `Web Development`
  - `App Development`
  - `UI/UX Design`
  - `Graphic Design`
  - `My story`
  - `Contact`
- **Right Items:**
  - `Local time 3:00pm` (Live system time indicator).
  - `31 October, 2026` (Current date format).

### 4.2 Pull-Chain Light Switch Toggle

- **Visual Appearance:**
  - Vertical cord suspended from `top: 0`, located at `right: clamp(24px, 5vw, 64px)`.
  - Length: ~160px relaxed.
  - Wire: 1.5px metallic bead-chain or cord.
  - Terminal: Solid brass turned pendant/bead (diameter: 12px, height: 20px).
- **Behavior:**
  - On hover: Gentle pendulum sway (`rotate(3deg)`).
  - On drag / click: Elastic stretch down 30px with physics spring release.
  - On release: Dispatches global theme toggle event. A satisfying mechanical "click" sound effect accompanies the switch between Cream and Dark mode.

### 4.3 3D Rolodex / Spiral-Bound Notebook Role Card

- **Structure:**
  - Notebook top edge features **11 silver/chrome wire spiral rings** looping through punched holes.
  - Face card is off-white paper texture with crisp black typography.
  - Bottom-right corner displays index counter: `01 / 05`, `02 / 05`, `03 / 05`, `04 / 05`, `05 / 05`.
- **3D Transform:**
  - Container: `perspective: 1000px;`.
  - Flip: Rotating on X-axis from `-90deg` to `0deg` to `90deg` with realistic cast shadow and specular paper sheen.

### 4.4 Rishi Portrait & "My visiting card" Lapel Badge

- **Portrait:**
  - Studio portrait cutout of Rishi in dark tailored blazer, white shirt, and diagonal striped tie.
  - Alpha transparency blending seamlessly with both Cream and Dark backgrounds.
- **Lapel Badge:**
  - Small rounded badge (`border-radius: 9999px; background: rgba(20,20,20,0.85); border: 1px solid rgba(255,255,255,0.15);`).
  - Text: `My visiting card` in white 11px font.
  - Interactive: Hover reveals an expandable digital business card popup with email, phone, location, and social links.

### 4.5 Interactive Arched Discipline Doors

- **Architecture:**
  - 4 Arch Doors: Blue (Web Dev), Purple (App Dev), Green (UI/UX), Terracotta (Graphic Design).
  - Surface: 24 vertical fluted wooden ribs running from arch to base.
  - Hardware:
    - **Brass Nameplate:** Horizontal brushed brass plaque etched in uppercase: `WEB DEVELOPER`, `APP DEVELOPER`, `UI/UX DESIGNER`, `GRAPHIC DESIGNER`.
    - **Brass Lever Handle:** Sleek modern horizontal door handle with rosette base and drop keyhole below.
  - **Speech Bubble Tooltip:**
    - Floating pill badge positioned right next to the door handle: `Click to enter`.
    - Small triangular directional tail pointing directly at the brass lever.
- **Transitions:**
  - Hover: Brass lever depresses 8 degrees; door glows with subtle edge illumination.
  - Click: Door rotates open on Y-axis into blackness; portal zoom engages.

### 4.6 Time Machine Dual-Column Timeline

- **Left Pinned Column:**
  - Radial Dial: 12 concentric clock tick marks rotating slowly in the background.
  - Giant Year Display: 110px bold numerals with 3D reel-flip transition (`2026` → `2025` → `2022`).
  - Sub-label: Active milestone date range (`JUL 2026 - SEP 2026`).
  - Progress: Monospace counter `(clock icon) 02 / 05` with a horizontal segmented progress bar.
- **Right Scrolling Column:**
  - Continuous vertical line (`width: 1px; background: rgba(255,255,255,0.1);`).
  - Active Node: Glowing green dot (`#22C55E`) with pulsing aura box-shadow.
  - Milestone Cards: Five structured career milestones with dates, company names, and bulleted deliverable points.

### 4.7 Contact Section & Multi-Column Footer

- **Contact Card:**
  - Eyebrow: `• AVAILABLE FOR NEW WORK` with pulsing green dot.
  - Headline: `Got a project? / Let's build it together.`
  - Body: 16px neutral copy.
  - Action Buttons: `Start a project →` (Solid pill) & `See my work` (Ghost pill).
- **Footer Matrix:**
  - `WORK` Column: Web Development, App Development, UI/UX Design, Graphic Design.
  - `NAVIGATE` Column: Home, Services, Story, Contact.
  - `STATUS` Column: "Available for Q4 2026 projects • Worldwide Remote".

### 4.8 Web Development Project Showcase Cards

- **Container:** Dark card panel (`#16171B`) with 1px border (`rgba(255,255,255,0.06)`).
- **Alternating Layout:**
  - Card 1: Text Left / Desktop Monitor Right (*Sundown Studio*)
  - Card 2: Desktop Monitor Left / Text Right (*Personal portfolio*)
  - Card 3: Text Left / Desktop Monitor Right (*P&L Page for Zerodha*)
- **Desktop Monitor Mockup Component:**
  - Pixel-perfect Apple Studio Display frame.
  - Silver stand base with realistic drop shadow.
  - Internal iframe / high-resolution interactive screen capture.
  - Screen content includes custom visual effects (e.g., Sundown Studio's interactive red ambient orb glow, Zerodha's financial graphs).
- **Floating Navigation:**
  - Bottom-Left fixed pill button: `← Back to the doors` (`backdrop-filter: blur(12px); background: rgba(30,32,38,0.85); border: 1px solid rgba(255,255,255,0.12);`).

