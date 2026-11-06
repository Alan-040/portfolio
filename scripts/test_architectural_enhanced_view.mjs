import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-arch-view-' + Date.now());
const PORT = 9298;
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

async function runAudit() {
  console.log('=== STARTING COMPLETE ARCHITECTURAL ENHANCEMENT AUDIT ===');

  let appUrl = 'http://localhost:5173/';
  try {
    const testRes = await fetch('http://localhost:5173/');
    if (!testRes.ok) throw new Error('Not 5173');
  } catch {
    appUrl = 'http://localhost:5174/';
  }

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

  // 1. Audit Light Mode initial doors section
  console.log('\n--- 1. LIGHT MODE INITIAL DOORS ---');
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  const lightAudit = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    const wallBackdrop = document.querySelector('.architectural-wall-backdrop');
    const floorPlane = document.querySelector('.floor-plane');

    return {
      isLightMode: document.body.classList.contains('light-theme'),
      doorsCount: doors.length,
      hasFloorPlane: !!floorPlane,
      backdropOpacity: wallBackdrop ? window.getComputedStyle(wallBackdrop).opacity : null,
    };
  })()`);
  console.log('Light Mode State:', JSON.stringify(lightAudit, null, 2));
  await client.captureScreenshot('enhanced_1_light_mode_doors.png');

  // 2. Toggle to Dark Mode
  console.log('\n--- 2. TOGGLING TO DARK MODE CORRIDOR ---');
  await client.evaluate(`(() => {
    const cord = document.querySelector('.hero-pull-chain') || document.querySelector('[data-cursor="LIGHT"]');
    if (cord) {
      cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  })()`);
  await sleep(1000);

  // Scroll back to #doors
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  const darkAudit = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    const alcoves = document.querySelectorAll('#doors .architectural-alcove');
    const wallBackdrop = document.querySelector('.architectural-wall-backdrop');
    const floorPlane = document.querySelector('.floor-plane');
    const baseboard = document.querySelector('#doors .w-full.h-4, #doors .w-full.h-5, #doors .w-full.mt-2');

    const details = Array.from(doors).map((d, i) => {
      const plaque = d.querySelector('.font-mono.tracking-wider, .font-mono.tracking-widest');
      const pill = d.querySelector('.click-to-enter-pill');
      const keyhole = d.querySelector('.rounded-\\\\[2px\\\\], .rounded-sm');
      const ribs = d.querySelectorAll('.w-\\\\[1\\\\.5px\\\\]');
      const roleLabel = document.querySelectorAll('#doors .grid.grid-cols-2.lg\\\\:grid-cols-4.gap-4:last-of-type span')[i];

      return {
        doorIdx: i,
        plaqueText: plaque ? plaque.innerText.trim() : null,
        roleLabel: roleLabel ? roleLabel.innerText.trim() : null,
        ribsCount: ribs.length,
        hasKeyholePlate: !!keyhole,
        hasPill: !!pill,
        pillText: pill ? pill.innerText.trim() : null,
      };
    });

    return {
      isDarkMode: !document.body.classList.contains('light-theme'),
      alcoveCount: alcoves.length,
      doorsCount: doors.length,
      hasWallBackdrop: !!wallBackdrop,
      backdropOpacity: wallBackdrop ? window.getComputedStyle(wallBackdrop).opacity : null,
      hasBaseboard: !!baseboard,
      hasFloorPlane: !!floorPlane,
      details,
    };
  })()`);
  console.log('Dark Mode Architectural Corridor State:', JSON.stringify(darkAudit, null, 2));
  await client.captureScreenshot('enhanced_2_dark_mode_corridor.png');

  // 3. Hover over Door 1 (App Developer)
  console.log('\n--- 3. HOVER OVER DOOR 1 (App Developer) ---');
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

  const hoverCheck = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Door 1 Hover check:', JSON.stringify(hoverCheck, null, 2));
  await client.captureScreenshot('enhanced_3_dark_door1_hovered.png');

  // 4. Hover over Door 2 (UI/UX Designer)
  console.log('\n--- 4. HOVER OVER DOOR 2 (UI/UX Designer) ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[2].x, y: doorBoxes[2].y });
  await sleep(500);
  await client.captureScreenshot('enhanced_4_dark_door2_hovered.png');

  // 5. Hover over Door 0 (Web Developer)
  console.log('\n--- 5. HOVER OVER DOOR 0 (Web Developer) ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[0].x, y: doorBoxes[0].y });
  await sleep(500);
  await client.captureScreenshot('enhanced_5_dark_door0_hovered.png');

  client.close();
  try {
    chromeProc.kill();
  } catch {}

  console.log('\n✅ ALL ARCHITECTURAL ENHANCEMENT AUDIT CHECKS COMPLETED!');
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});

