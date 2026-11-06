# DEPLOYMENT GUIDE — CINEMATIC PORTFOLIO

> **Project:** Cinematic Portfolio Website  
> **Target Platform:** Vercel (Edge Network / Static Site Hosting)  
> **Build Command:** `npm run build` (`tsc && vite build`)  
> **Output Directory:** `dist`  
> **Node Engine:** >= 18.0.0  

---

## 1. PRODUCTION BUILD RESULTS

The production build was verified with zero errors, zero warnings, and clean vendor chunk optimization.

### Bundle Breakdown:
- **`dist/index.html`** (1.37 KB • gzip: 0.62 KB)
- **`dist/assets/index-Bu5sKQSE.css`** (36.34 KB • gzip: 7.31 kB)
- **`dist/assets/index-DlrCzis1.js`** (45.79 KB • gzip: 12.92 kB) — *Core application logic & scenes*
- **`dist/assets/vendor-core-DVXp9jmK.js`** (245.05 KB • gzip: 77.31 kB) — *React 18 & DOM runtime*
- **`dist/assets/vendor-gsap-Jiz4vAvE.js`** (115.42 KB • gzip: 45.63 kB) — *GSAP & ScrollTrigger engine*
- **`dist/assets/vendor-lenis-D6D0yiRi.js`** (19.58 KB • gzip: 5.63 kB) — *Lenis smooth scroll controller*
- **`dist/assets/vendor-three-CfALbKDW.js`** (717.41 KB • gzip: 188.35 kB) — *Three.js & WebGL renderer*
- **`dist/assets/vendor-icons-Tp-wsLkd.js`** (3.26 KB • gzip: 0.98 kB) — *Lucide icon components*

### Static Assets Verified:
- User Authentic Portrait: `public/images/profile-original.png` (726.8 KB, untouched).
- Recreated High-DPI Project Mockups: `public/images/*.webp` (1600 × 1000 px, 16:10).
- Drop-in Placeholders: `public/images/placeholders/*.webp`.

---

## 2. VERCEL CONFIGURATION (`vercel.json`)

A production-ready `vercel.json` has been placed in the project root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=604800"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 3. DEPLOYMENT METHODS

### Option A: Deploy via GitHub (Recommended for Continuous Deployment)

1. **Initialize Git & Commit:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete cinematic portfolio ready for deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cinematic-portfolio.git
   git push -u origin main
   ```

3. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `cinematic-portfolio` repository.
   - Framework Preset will auto-detect as **Vite**.
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**.

---

### Option B: Deploy via Vercel CLI (Direct Terminal Deployment)

1. **Install Vercel CLI globally (if not already installed):**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Preview / Production:**
   - For a preview deployment:
     ```bash
     vercel
     ```
   - For direct production deployment:
     ```bash
     vercel --prod
     ```

---

### Option C: Manual Drag-and-Drop (Zero Terminal Deployment)

1. Run `npm run build` locally to generate the latest `dist/` folder.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Under "Deploying a third-party Git repository?", select or drag-and-drop the `dist` folder into Vercel.

---

## 4. PRE-DEPLOYMENT VERIFICATION CHECKLIST

- [x] Strict TypeScript check passes with zero errors (`tsc`).
- [x] Vite production bundle builds successfully with Rollup chunking (`vite build`).
- [x] All 5 scenes fully intact without simplified animations.
- [x] Authentic user photograph (`profile-original.png`) preserved and included in `dist/images/`.
- [x] High-DPI 16:10 project mockups included in `dist/images/`.
- [x] Security headers and SPA rewrites defined in `vercel.json`.
- [x] `.gitignore` configured to exclude `.vercel`, node_modules, and cache files.

