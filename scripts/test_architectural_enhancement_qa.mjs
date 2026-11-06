import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-arch-enh-' + Date.now());
const PORT = 9295;
const QA_DIR = path.resolve('qa_results');

if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { resolve, reject } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(QA_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`[CDP] Saved screenshot: ${filePath}`);
    return filePath;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runQA() {
  console.log('--- STARTING ARCHITECTURAL ENHANCEMENT QA AUDIT ---');

  let appUrl = 'http://localhost:5173/';
  try {
    const testRes = await fetch('http://localhost:5173/');
    if (!testRes.ok) throw new Error('Not 5173');
  } catch {
    appUrl = 'http://localhost:5174/';
  }
  console.log(`[INFO] Targeting URL: ${appUrl}`);

  const chromeProc = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${TEMP_USER_DATA}`,
      '--disable-gpu',
      '--no-first-run',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json/version`);
      if (res.ok) break;
    } catch {
      await sleep(250);
    }
  }

  const targetsRes = await fetch(`http://localhost:${PORT}/json`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: appUrl });
  await sleep(2000);

  // Switch to Dark Mode first to audit full architectural environment
  console.log('\n--- 1. TOGGLE TO DARK MODE ---');
  await client.evaluate(`(() => {
    if (document.body.classList.contains('light-theme')) {
      const cord = document.querySelector('.hero-pull-chain') || document.querySelector('[data-cursor="LIGHT"]');
      if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  })()`);
  await sleep(1000);

  // Scroll to #doors section
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  console.log('\n--- 2. DARK MODE ARCHITECTURAL WALL & ALCOVE AUDIT ---');
  const darkWallAudit = await client.evaluate(`(() => {
    const wallBackdrop = document.querySelector('.architectural-wall-backdrop');
    const wallSurface = document.querySelector('.architectural-wall-surface');
    const alcoves = document.querySelectorAll('#doors .architectural-alcove');
    const doors = document.querySelectorAll('#doors .door-card-item');
    const baseboard = document.querySelector('#doors .architectural-wall-container > div:last-child, #doors .architectural-wall-surface > div:nth-child(2)');
    const floorPlane = document.querySelector('.floor-plane');

    const doorDetails = Array.from(doors).map((d, i) => {
      const plaque = d.querySelector('.font-mono.tracking-wider, .font-mono.tracking-widest');
      const handle = d.querySelector('.rotate-12, .group-hover\\\\:rotate-12');
      const keyholePlate = d.querySelector('.rounded-\\\\[2px\\\\], .rounded-sm');
      const pill = d.querySelector('.click-to-enter-pill');
      const roleUnder = document.querySelectorAll('#doors .grid:last-of-type span')[i];

      return {
        doorIdx: i,
        plaqueText: plaque ? plaque.innerText.trim() : null,
        roleLabel: roleUnder ? roleUnder.innerText.trim() : null,
        hasKeyholePlate: !!keyholePlate,
        hasPill: !!pill,
        pillText: pill ? pill.innerText.trim() : null,
      };
    });

    return {
      isDarkTheme: !document.body.classList.contains('light-theme'),
      hasWallBackdrop: !!wallBackdrop,
      backdropOpacity: wallBackdrop ? window.getComputedStyle(wallBackdrop).opacity : null,
      alcoveCount: alcoves.length,
      doorsCount: doors.length,
      hasBaseboard: !!baseboard,
      hasFloorPlane: !!floorPlane,
      doorDetails,
    };
  })()`);
  console.log('Dark Mode Architectural Audit:', JSON.stringify(darkWallAudit, null, 2));

  await client.captureScreenshot('enhanced_doors_dark_mode_corridor.png');

  console.log('\n--- 3. HOVER OVER DOOR 1 (App Developer) ---');
  // Hardware mouse move over Door 1
  const doorBoxes = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    return Array.from(doors).map((d) => {
      const r = d.getBoundingClientRect();
      return {
        x: Math.round(r.left + r.width / 2),
        y: Math.round(r.top + r.height / 2),
      };
    });
  })()`);

  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[1].x, y: doorBoxes[1].y });
  await sleep(500);

  const hoverAudit = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Door 1 Hover State:', JSON.stringify(hoverAudit, null, 2));
  await client.captureScreenshot('enhanced_doors_dark_door1_hovered.png');

  console.log('\n--- 4. LIGHT MODE THEME VERIFICATION ---');
  // Toggle back to Light Mode
  await client.evaluate(`(() => {
    const cord = document.querySelector('.hero-pull-chain') || document.querySelector('[data-cursor="LIGHT"]');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(1000);

  const lightModeAudit = await client.evaluate(`(() => {
    const wallBackdrop = document.querySelector('.architectural-wall-backdrop');
    const floorPlane = document.querySelector('.floor-plane');
    const alcoves = document.querySelectorAll('#doors .architectural-alcove');

    return {
      isLightMode: document.body.classList.contains('light-theme'),
      backdropOpacity: wallBackdrop ? window.getComputedStyle(wallBackdrop).opacity : null,
      hasFloorPlaneInLightMode: !!floorPlane,
      alcoveBg: alcoves[0] ? window.getComputedStyle(alcoves[0]).backgroundColor : null,
    };
  })()`);
  console.log('Light Mode Theme Audit:', JSON.stringify(lightModeAudit, null, 2));
  await client.captureScreenshot('enhanced_doors_light_mode_clean.png');

  console.log('\n--- 5. DOOR CLICK WALKTHROUGH & SHOWCASE AUDIT ---');
  // Toggle back to Dark Mode for final walkthrough
  await client.evaluate(`(() => {
    const cord = document.querySelector('.lamp-cord') || document.querySelector('[data-cursor="TOGGLE THEME"]');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(600);

  // Click on Door 0 (Web Developer)
  await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    if (doors[0]) {
      doors[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  })()`);
  await sleep(2200);

  const showcaseAudit = await client.evaluate(`(() => {
    const showcase = document.querySelector('#discipline-showcase');
    const title = showcase ? showcase.querySelector('h1')?.innerText : null;
    const backBtn = document.querySelector('.showcase-back-btn');
    return {
      hasShowcase: !!showcase,
      title,
      hasBackButton: !!backBtn,
    };
  })()`);
  console.log('Showcase Verification:', JSON.stringify(showcaseAudit, null, 2));
  await client.captureScreenshot('enhanced_doors_showcase_entered.png');

  // Click Back to the doors
  await client.evaluate(`(() => {
    const backBtn = document.querySelector('.showcase-back-btn');
    if (backBtn) {
      backBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  })()`);
  await sleep(1200);

  const returnAudit = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    return {
      returnedToDoors: doors.length === 4,
    };
  })()`);
  console.log('Return to Doors Audit:', JSON.stringify(returnAudit, null, 2));

  client.close();
  try {
    chromeProc.kill();
  } catch {}

  console.log('\n✅ ARCHITECTURAL ENHANCEMENT AUDIT COMPLETED SUCCESSFULLY!');
}

runQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
