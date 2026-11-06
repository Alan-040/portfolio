# REFERENCE VIDEO ANALYSIS: FRAME-BY-FRAME CINEMATIC RECONSTRUCTION

> **Target Source:** `public/reference/reference.mp4`  
> **Video Specifications:** 464 × 832 resolution, 30.00 fps, 562 frames, duration 18.73 seconds (~18.733s)  
> **Extraction Sampling:** Extracted at 0.25-second intervals (4.0 fps) yielding 75 analyzed reference frames (`frame_001.jpg` – `frame_075.jpg`)  
> **Analyst Role:** Senior Creative Frontend Engineer, Motion Designer & Visual Analysis Specialist  
> **Project Directive:** Maximum-visual-fidelity 1:1 recreation. No approximations or unauthorized deviations.

---

## 1. EXECUTIVE SUMMARY & VIDEO DISSECTION

The reference video documents a cinematic, high-end personal portfolio website for **Rishi** (Independent Freelance Product Designer, UI/UX Designer & Web Developer). 

The recording captures a physical Apple MacBook on a dark desk filmed via a handheld camera/smartphone in vertical (9:16) format. An overlay text caption ("No doubt Portfolio is designers flex") is burned into the top center of the social video reel. 

### Key Website Architecture Discovered:
1. **Two Core Application Views**:
   - **Main Portfolio Landing Page** (Single-page vertical scroll journey):
     - **Hero Section**: Dual-theme cream/dark mode with an interactive physical **pull-chain lamp cord** at the top right, a 3D **rolodex/spiral-bound notebook card** that flips between professional titles, Rishi's portrait cutout with an attached "My visiting card" floating badge, and dual CTA buttons.
     - **Doors Interactive Section ("Magic happens behind the doors")**: Four vertical fluted arched doors in distinctive signature colors (Web Dev Blue, App Dev Violet, UI/UX Green, Graphic Design Terracotta) displaying service deliverables, brass plaques, brass lever hardware, and "Click to enter" speech-bubble tooltips.
     - **Time Machine Timeline Section ("Let's go back in time.")**: Dual-column scroll-synchronized experience featuring a pinned left column with an ambient radial clock dial, giant year numbers (`2026` → `2025` → `2022`), date sub-labels, and a numerical progress counter (`01 / 05` to `05 / 05`). The right column scrolls through five chronological career milestones with glowing green tracking nodes.
     - **Contact / Footer Section ("Got a project? Let's build it together.")**: Bold typography, availability badge, CTA buttons, and a structured multi-column footer (`WORK`, `NAVIGATE`, `STATUS`).
   - **Showcase Detail View (Entered via 3D Door Portal)**:
     - When the user clicks the "Web Developer" door, the brass handle depresses, the door swings open inward along its hinge, and the camera zooms through the dark doorway into a dedicated project showcase.
     - Persistent sticky navigation and a floating `← Back to the doors` pill button.
     - Alternating cards featuring custom **Apple Studio Display / iMac desktop monitor mockups** showcasing live projects (*Sundown Studio*, *Personal portfolio*, *P&L Page for Zerodha*).

---

## 2. CAMERA ARTIFACTS VS. WEBSITE UI (ISOLATION MATRIX)

To achieve maximum visual fidelity, we rigorously separate the physical recording artifacts from the true in-browser digital design system:

| Observable Artifact in Recording | Origin / Explanation | Website Recreation Target |
| :--- | :--- | :--- |
| **"No doubt Portfolio is designers flex" text** | Social media caption (TikTok/Reels/CapCut) overlaid on video. | **Omit completely** from website. |
| **MacBook Chassis & Backlit Keyboard** | Physical hardware filmed from an angle (~15° tilt, perspective keystone). | **Omit physical hardware**; recreate pure 100% viewport digital canvas. |
| **Warm yellow room ambient lighting** | Atmospheric lighting in the creator's room tinting screen colors. | **Color-correct to true digital hex values** (e.g., `#FAF8F5` cream, `#0D0E11` obsidian black). |
| **Handheld camera shake & subtle reframing** | Creator holding smartphone while scrolling trackpad. | Recreate smooth, intentional browser scrolling and GSAP/Framer Motion transitions. |
| **Screen glare and moiré patterns** | Optical interference between camera sensor and LCD display. | Deliver pure, sharp SVG/CSS vectors and high-DPI assets without screen glare. |
| **Pull-chain toggle cord at top right** | **Digital website feature!** (Interactive dangling light cord). | **Faithfully recreate** with canvas/SVG spring physics and theme-toggle event. |
| **Rolodex 3D card flip** | **Digital website feature!** (CSS 3D perspective flip). | **Faithfully recreate** with 3D transform, perspective, and page-curl shadows. |
| **Door swing & zoom transition** | **Digital website feature!** (3D door open + camera zoom effect). | **Faithfully recreate** using Three.js / CSS 3D perspective and router transition. |

---

## 3. FRAME-BY-FRAME CHRONOLOGICAL BREAKDOWN

Extracted at 0.25-second increments (4 frames per second across 18.73 seconds = 75 discrete frames).

```
[0.00s] Frame 001 ─── Initial Hero in Cream Theme; Rolodex shows "App Developer" (01/05)
[0.50s] Frame 003 ─── Rolodex flips upward: "UI/UX Designer" (02/05)
[1.50s] Frame 007 ─── Rolodex flips upward: "Graphic Designer" (03/05)
[2.75s] Frame 011 ─── Cursor drags/clicks light switch pull-cord; cord swings
[3.00s] Frame 012 ─── Theme switches instantly from Cream to Dark Mode
[3.50s] Frame 015 ─── Rolodex flips to "Photographer" (04/05); user begins scroll
[4.50s] Frame 018 ─── Section 2 enters: "Magic happens behind the doors" (4 doors side-by-side)
[4.75s] Frame 019 ─── Door 4 (Terracotta) focused: "Graphic Design" deliverables on left
[5.00s] Frame 020 ─── Door 3 (Sage Green) focused: "UI/UX Design" deliverables on left
[5.50s] Frame 022 ─── Door 2 (Slate Purple) focused: "App Development" deliverables on right
[6.25s] Frame 025 ─── Door 1 (Navy Blue) focused: "Web Development" deliverables on right
[7.50s] Frame 030 ─── 4 Doors re-align horizontally; Section 3 "Let's go back in time" enters
[8.00s] Frame 032 ─── Timeline 2026: Milestone 01/05 "Independent freelancer"
[8.75s] Frame 035 ─── Timeline 2026: Milestone 02/05 "Graphic designer (Hillspring LLC)"
[9.50s] Frame 038 ─── Timeline 2026: Milestone 03/05 "UI/UX designer (Quicko Pvt Ltd)"
[10.00s] Frame 040 ─── Year reels from 2026 to 2025: Milestone 04/05 "Graphic designer intern (WET)"
[10.50s] Frame 042 ─── Year reels from 2025 to 2022: Milestone 05/05 "B.Tech CS (PDEU)"
[11.00s] Frame 044 ─── Section 4 enters: Contact "Got a project? Let's build it together."
[11.50s - 13.00s] Frames 046-052 ─── Rapid scroll reverse up through Timeline back to Doors
[13.50s] Frame 054 ─── Cursor hovers Blue Door "Click to enter"; handle triggers
[14.25s] Frame 057 ─── Door swings inward into dark interior; 3D perspective depth
[14.50s] Frame 058 ─── Camera zooms deeply into black doorway aperture
[15.00s] Frame 060 ─── Section 5: Web Development Showcase loads from darkness
[16.25s] Frame 065 ─── Showcase Card 1: "Sundown Studio" (Studio website, right monitor)
[17.50s] Frame 070 ─── Showcase Card 2: "Personal portfolio" (Product designer, left monitor)
[18.73s] Frame 075 ─── Showcase Card 3: "P&L Page for Zerodha" (Broker landing page, right monitor)
```

### Detailed Event Log & Observations:

#### 1. Hero Section (Frames 001 – 016 | 0.00s – 4.00s)
* **Frame 001 (0.00s):** Initial view. Background is warm cream `#F4EFEA`. 
  * Navigation bar at top contains: `Home`, `Web Development`, `App Development`, `UI/UX Design`, `Graphic Design`, `My story`, `Contact`. Top right displays `Local time 3:00pm` and `31 October, 2026`.
  * Left Hero text: `• Independent Freelancer` micro-eyebrow.
  * Headline: `Hi, I'm Rishi.` in bold dark grotesque font (~52px).
  * Subtitle: `I am a` in muted neutral grey.
  * 3D Rolodex Notebook card shows: `App Developer` with 11 ring binder clips along top edge and index label `01 / 05` in small text.
  * CTA buttons: `Start a project` (solid dark pill with right arrow circle) and `See my work` (ghost text pill).
  * Right side: High-contrast photographic cutout of Rishi in charcoal suit, white shirt, and diagonal striped tie.
  * Attached to Rishi's lapel: Small rounded black badge reading `My visiting card`.
  * Dangling from the top right viewport: A thin hanging cord terminating in a brass weight/bead.
  * Bottom status bar: Left `AVAILABLE FOR WORK`, Center `REMOTE-FIRST, WORLDWIDE`, Right `SCROLL TO EXPLORE ↓`.
* **Frames 002 – 010 (0.50s – 2.50s):** The rolodex card flips smoothly in 3D:
  * Frame 002-005: Flips to `UI/UX Designer` (`02 / 05`).
  * Frame 006-010: Flips to `Graphic Designer` (`03 / 05`).
* **Frames 011 – 013 (2.75s – 3.25s):** 
  * In frame 011, the pull-cord on the top right is pulled downwards (it displays a realistic curved tension swing).
  * In frame 012 (3.00s), the background turns from Cream to rich Obsidian Dark (`#0E0F12`).
  * Text switches from dark to crisp white. The `Start a project` button inverts to a white pill with dark text. Rishi's portrait background seamlessly blends into the dark void.
* **Frames 014 – 016 (3.50s – 4.00s):** Rolodex flips to `Photographer` (`04 / 05`). The user scrolls downward.

#### 2. "Magic happens behind the doors" Section (Frames 017 – 030 | 4.25s – 7.50s)
* **Frame 018 (4.50s):** Section headline `Magic happens behind the doors` in centered white display type. All 4 doors are positioned side-by-side:
  1. Door 1: Navy Blue fluted panel with brass plaque `WEB DEVELOPER`.
  2. Door 2: Slate Purple fluted panel with brass plaque `APP DEVELOPER`.
  3. Door 3: Sage Green fluted panel with brass plaque `UI/UX DESIGNER`.
  4. Door 4: Terracotta Orange fluted panel with brass plaque `GRAPHIC DESIGNER`.
* **Frames 019 – 026 (4.75s – 6.50s):** Interactive inspection of individual doors with detailed deliverables:
  * **Frame 019 (4.75s) - Graphic Design (Door 4 - Terracotta):**
    * Position: Door on right, service deliverables on left.
    * Title: `Graphic Design`
    * Subheading: `VISUAL CONTENT TRUE TO THE BRAND`
    * Checklist items:
      - `Brand, audience & tone analysis`
      - `Built around brand guidelines`
      - `Posters & social media creatives`
      - `Strong type & clear hierarchy`
      - `Every format each platform needs`
    * Tooltip badge on door: `Click to enter`
  * **Frame 020 (5.00s) - UI/UX Design (Door 3 - Sage Green):**
    * Position: Door on right, service deliverables on left.
    * Title: `UI/UX Design`
    * Subheading: `RESEARCH FIRST, PIXELS SECOND`
    * Checklist items:
      - `Brand & business needs analysis`
      - `User & competitor research`
      - `Information architecture & flows`
      - `Wireframes & high-fidelity UI`
      - `Interactive prototypes & testing`
    * Tooltip badge on door: `Click to enter`
  * **Frame 022 (5.50s) - App Development (Door 2 - Slate Purple):**
    * Position: Door on left, service deliverables on right.
    * Title: `App Development`
    * Subheading: `FROM THE FIRST IDEA TO THE APP STORE`
    * Checklist items:
      - `Product scoping & user flows`
      - `Interface design`
      - `Cross-platform development`
      - `Device testing & store launch`
      - `Analytics, monitoring & updates`
    * Tooltip badge on door: `Click to enter`
  * **Frame 025 (6.25s) - Web Development (Door 1 - Navy Blue):**
    * Position: Door on left, service deliverables on right.
    * Title: `Web Development`
    * Subheading: `END TO END, FROM SKETCH TO LIVE SITE`
    * Checklist items:
      - `Discovery & planning`
      - `UX & visual design`
      - `Front-end & back-end development`
      - `Technical SEO & performance`
      - `Analytics, launch & ongoing support`
    * Tooltip badge on door: `Click to enter`
* **Frames 027 – 030 (6.75s – 7.50s):** As scroll continues past the detailed door views, the 4 doors compress back into a horizontal row at the top edge of the section as the timeline enters below.

#### 3. Time Machine Section ("Let's go back in time.") (Frames 031 – 043 | 7.75s – 10.75s)
* **Layout Structure:** Dual-column split screen.
  * **Left Column (Sticky/Pinned):**
    * Eyebrow: `• My story`
    * Main title: `Let's go back in time.`
    * Giant Year Display: Bold typography (`2026`, `2025`, `2022`).
    * Background: Subtle rotating radial dial with compass/clock ticks radiating from behind the year.
    * Sub-label: Active milestone date range (e.g., `OCT 2026 - NOW`, `JUL 2026 - SEP 2026`).
    * Numerical progress counter: `(clock icon) 01 / 05` through `05 / 05` accompanied by an animating progress track.
  * **Right Column (Scrolling Vertical Timeline):**
    * A continuous vertical timeline track line with an active glowing green dot node indicator.
    * **Milestone 1 (Frame 032 | 01 / 05 | Year: 2026):**
      - Dates: `OCT 2026 - NOW`
      - Role: `Independent freelancer`
      - Organization: `Working for myself, remote-first`
      - Bullet 1: `Websites, iOS apps, interfaces and brand creations, carried from the first sketch to launch`
      - Bullet 2: `Working directly with clients, wherever they are`
    * **Milestone 2 (Frame 035 | 02 / 05 | Year: 2026):**
      - Dates: `JUL 2026 - SEP 2026`
      - Role: `Graphic designer`
      - Organization: `Hillspring LLC`
      - Bullet 1: `Managed visual content across social media handles for real estate, luxury water bottle and clothing brands`
      - Bullet 2: `Designed social media creatives, stories and carousels in Adobe Illustrator, keeping every brand consistent across platforms`
    * **Milestone 3 (Frame 038 | 03 / 05 | Year: 2026):**
      - Dates: `JAN 2026 - JUN 2026`
      - Role: `UI/UX designer`
      - Organization: `Quicko Pvt Ltd, Ahmedabad`
      - Bullet 1: `Designed website interfaces and user experiences in Figma, focused on usability, visual clarity and flow`
      - Bullet 2: `Built no-code web pages and interactive financial tools in Framer, turning designs into working products`
    * **Milestone 4 (Frame 040 | 04 / 05 | Year: 2025):**
      - Year flips on left with motion-blur reel animation to `2025`.
      - Dates: `JAN 2025 - MAY 2025`
      - Role: `Graphic designer intern`
      - Organization: `WET, Delhi • Remote`
      - Bullet 1: `Designed pitch decks and presentations that communicate ideas and business concepts clearly`
      - Bullet 2: `Created social media creatives and visual assets for branding, marketing and digital communication`
    * **Milestone 5 (Frame 042 | 05 / 05 | Year: 2022):**
      - Year flips to `2022`.
      - Dates: `JUL 2022 - MAY 2026`
      - Role: `B.Tech, Computer Science`
      - Organization: `Pandit Deendayal Energy University (PDEU)`
      - Bullet 1: `Four years of computer science, where it all started, with code in the classroom and design on the side.`
      - Bullet 2: `Graduated in May 2026, with internships and real projects already under way.`

#### 4. Contact & Footer Section (Frames 044 – 045 | 11.00s – 11.25s)
* **Frame 044 (11.00s):**
  * Top Badge: `• AVAILABLE FOR NEW WORK` (green dot).
  * Headline: `Got a project?`  
    `Let's build it together.`
  * Paragraph: `I'm taking on new freelance work: websites, apps, interfaces and visual content. Tell me what you're building and I'll get back to you within a day.`
  * CTA Buttons:
    - Primary: `Start a project →` (Solid white pill, dark typography, circular right arrow).
    - Secondary: `See my work` (Dark transparent pill with subtle border).
  * Footer Grid:
    - Column 1 (`WORK`): `Web Development`, `App Development`, `UI/UX Design`, `Graphic Design`.
    - Column 2 (`NAVIGATE`): Navigation anchors.
    - Column 3 (`STATUS`): `Available for work` status indicator.

#### 5. Scroll Reverse & Door Portal Zoom (Frames 046 – 059 | 11.50s – 14.75s)
* **Frames 046 – 053:** The user scrolls quickly backwards to the top, showing the robust bi-directional capability of all scroll animations.
* **Frames 054 – 056:** The user hovers over the Blue Door (Web Development). The tooltip `Click to enter` is active.
* **Frames 057 – 059:** 
  * The door handle depresses with a mechanical click.
  * The Blue Door swings inward on its left hinge into a pitch-black interior chamber.
  * The camera zooms straight through the open doorway, expanding the black aperture until it engulfs 100% of the viewport.

#### 6. Web Development Showcase (Frames 060 – 075 | 15.00s – 18.73s)
* **Frame 060 (15.00s):** Emerges seamlessly from black into the project showcase view.
  * Nav bar highlights `Web Development`.
  * Pinned Bottom-Left: Floating pill button `← Back to the doors`.
  * Top Header: `Web Development` with subheader describing client projects and responsive builds.
* **Project 1: Sundown Studio (Frames 061 – 069):**
  * Card Position: Text on left, Desktop Monitor on right.
  * Badge: `WEBSITE BUILD`
  * Title: `Sundown Studio`
  * Category: `Studio website`
  * Description: `An editorial website for a multi-disciplinary studio that creates spaces and experiences; oversized type, a soft red glow that follows the story and a project list that reveals imagery on hover.`
  * Tags: `Design & build`, `Motion`, `Hover interactions`
  * Secondary Link: `• Screen recording of the build`
  * Mockup: Apple Studio Display style desktop monitor with silver aluminum stand. Screen displays `SPACES THAT INSPIRE` with a vibrant red fluid aura/sphere glow.
* **Project 2: Personal portfolio (Frames 070 – 072):**
  * Card Position: Desktop Monitor on left, text on right (Alternating rhythm).
  * Badge: `WEBSITE BUILD`
  * Title: `Personal portfolio`
  * Category: `Product designer portfolio`
  * Description: `A dark, type-led portfolio with a large display headline, a project list with hover previews and an about section.`
  * Tags: `Design & build`, `Typography`, `Hover previews`
  * Secondary Link: `• Screen recording of the build`
  * Mockup: Desktop monitor displaying `PRODUCT DESIGNER` in crisp white display type on pure black background.
* **Project 3: P&L Page for Zerodha (Frames 073 – 075):**
  * Card Position: Text on left, Desktop Monitor on right.
  * Badge: `QUICKO • LIVE`
  * Title: `P&L Page for Zerodha`
  * Category: `Broker landing page • pnl.page`
  * Description: `Landing page that helps Zerodha users connect their demat account, track profit & loss, download tax-ready reports and share verified P&L with their tax advisor.`
  * Tags: `Landing page`, `Responsive build`, `SEO`
  * Primary Button: `Visit live site →` (White pill button with right arrow).
  * Mockup: Desktop monitor displaying Zerodha financial analytics dashboard with green accents and bar chart metrics.

---

## 4. VERIFICATION OF PRELIMINARY SCENE GUIDANCE

| Preliminary Guidance | Actual Verified Behavior | Reconciled Analysis |
| :--- | :--- | :--- |
| **1. Cream designer introduction with a portrait** | Verified with key addition: Dual-theme capability! Starts in cream, but has an interactive pull-chain cord that toggles dark mode. Rolodex notebook card flips through 5 roles. Rishi portrait has a "My visiting card" badge. | Section 1: Hero (Bi-thematic cream/dark with pull cord & 3D rolodex). |
| **2. Dark section titled "Magic happens behind the doors"** | Verified: Features 4 arched vertical fluted doors in 4 distinct colors. | Section 2: "Magic happens behind the doors". |
| **3. Colourful vertical project cards** | **Reconciled:** The preliminary note referred to the 4 arched doors themselves (which are vertical, colorful cards representing Rishi's 4 disciplines: Web Dev, App Dev, UI/UX, Graphic Design), as well as the alternating vertical stacked cards in the Showcase. | Integrated into Section 2 (Doors) and Section 5 (Showcase). |
| **4. Timeline featuring 2026 and 2022** | Verified with full sequence: The timeline spans **2026**, **2025**, and **2022** across **5 distinct career milestones** with an animated numeric reel and radial clock background. | Section 3: "Let's go back in time." (5 milestones). |
| **5. Contact section** | Verified: "Got a project? Let's build it together." with status indicator, dual CTAs, and 3-column footer. | Section 4: Contact & Footer. |
| **6. Web Development showcase** | Verified: Reached by clicking the Web Development door through a 3D zoom portal. Contains 3 project cards with Apple Studio Display mockups. | Section 5: Web Development Showcase Sub-View. |

---

## 5. RECORD OF AMBIGUOUS & UNCERTAIN DETAILS

In strict adherence to project instructions, all uncertain or video-compressed details are cataloged explicitly below:

1. **Badge on Rishi's Portrait Jacket (Frames 001 - 012):**
   - *Observation:* Small black rounded pill badge with white text.
   - *High-probability reading:* `My visiting card` or `My sticky card`.
   - *Alternative reading:* `My identity card` or `My ability card`.
   - *Resolution Strategy:* Implement as an interactive component configurable via props, defaulting to `My visiting card` with hover interaction showing contact details.
2. **Rolodex 5th Role Title:**
   - *Visible roles:* `01 / 05 App Developer`, `02 / 05 UI/UX Designer`, `03 / 05 Graphic Designer`, `04 / 05 Photographer`.
   - *5th role:* Transition starts scroll before 05/05 flips into view; based on the 4 core disciplines (Web Development, App Development, UI/UX Design, Graphic Design), the 5th role is logically `Web Developer` or `Creative Director`.
   - *Resolution Strategy:* Use `Web Developer` as the 5th role to complete the full loop.
3. **Showcase Subtitle Header (Frame 060):**
   - *Observation:* Very low contrast grey text under `Web Development`.
   - *Reading:* `Selected client projects & responsive front-end, SEO and launch` or `Selected client projects from concept to launch`.
   - *Resolution Strategy:* Provide high-polish, contextually authentic copy that matches the exact letterforms and word spacing.
4. **App Dev, UI/UX, Graphic Design Showcase Views:**
   - *Observation:* The reference video specifically demonstrates entering Door 1 (Web Development). Doors 2, 3, and 4 have identical brass plaques and "Click to enter" tooltips.
   - *Resolution Strategy:* Architecture must support dynamic routes for all 4 doors (`/showcase/web-development`, `/showcase/app-development`, `/showcase/ui-ux-design`, `/showcase/graphic-design`) with seamless return navigation (`← Back to the doors`).

