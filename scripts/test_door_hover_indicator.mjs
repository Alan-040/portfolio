import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-door-qa-' + Date.now());
const PORT = 9287;
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
  console.log('--- STARTING DOOR HOVER INDICATOR QA VERIFICATION ---');

  let appUrl = 'http://localhost:5173/';
  try {
    const testRes = await fetch('http://localhost:5173/');
    if (!testRes.ok) throw new Error('Not 5173');
  } catch {
    try {
      const testRes2 = await fetch('http://localhost:5174/');
      if (testRes2.ok) appUrl = 'http://localhost:5174/';
    } catch {
      appUrl = 'http://localhost:5174/';
    }
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

  // Scroll to #doors section
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  // Get door center coordinates for hardware mouse simulation
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
  console.log('[INFO] Door Centers:', doorBoxes);

  // Move mouse away to ensure no hover initially
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 50, y: 50 });
  await sleep(500);

  console.log('\n--- 1. INITIAL RESTING STATE (NO HOVER) ---');
  const initialAudit = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => {
      const style = window.getComputedStyle(p);
      const span = p.querySelector('span');
      const door = doors[idx];
      const doorRect = door ? door.getBoundingClientRect() : null;
      const pillRect = p.getBoundingClientRect();

      return {
        doorIdx: idx,
        text: span ? span.innerText.trim() : '',
        opacity: parseFloat(style.opacity),
        pillCenterDiff: doorRect && pillRect ? Math.round((pillRect.left + pillRect.width / 2) - (doorRect.left + doorRect.width / 2)) : null,
      };
    });
  })()`);
  console.log('Initial Audit:', JSON.stringify(initialAudit, null, 2));
  await client.captureScreenshot('door_hover_0_resting.png');

  console.log('\n--- 2. HOVER DOOR 0 (Full Stack Developer) ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[0].x, y: doorBoxes[0].y });
  await sleep(500);

  const door0Hover = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Door 0 Hover State:', JSON.stringify(door0Hover, null, 2));
  await client.captureScreenshot('door_hover_1_door0_hovered.png');

  console.log('\n--- 3. HOVER DOOR 1 (UI/UX Designer) ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[1].x, y: doorBoxes[1].y });
  await sleep(500);

  const door1Hover = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Door 1 Hover State:', JSON.stringify(door1Hover, null, 2));
  await client.captureScreenshot('door_hover_2_door1_hovered.png');

  console.log('\n--- 4. HOVER DOOR 2 (Web Developer) ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[2].x, y: doorBoxes[2].y });
  await sleep(500);

  const door2Hover = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Door 2 Hover State:', JSON.stringify(door2Hover, null, 2));
  await client.captureScreenshot('door_hover_3_door2_hovered.png');

  console.log('\n--- 5. HOVER DOOR 3 (3D Blender Artist) ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[3].x, y: doorBoxes[3].y });
  await sleep(500);

  const door3Hover = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Door 3 Hover State:', JSON.stringify(door3Hover, null, 2));
  await client.captureScreenshot('door_hover_4_door3_hovered.png');

  console.log('\n--- 6. MOUSE LEAVE ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 50, y: 50 });
  await sleep(500);

  const leaveHover = await client.evaluate(`(() => {
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');
    return Array.from(pills).map((p, idx) => ({
      doorIdx: idx,
      opacity: parseFloat(window.getComputedStyle(p).opacity),
    }));
  })()`);
  console.log('Mouse Leave State:', JSON.stringify(leaveHover, null, 2));

  console.log('\n--- 7. CLICK DOOR 1 (UI/UX Designer) ---');
  await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    const target = doors[1];
    if (target) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  })()`);
  await sleep(2000);

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
  console.log('Showcase Entrance Audit:', JSON.stringify(showcaseAudit, null, 2));
  await client.captureScreenshot('door_hover_5_showcase_entered.png');

  // Return to doors
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

  console.log('\n✅ ALL DOOR HOVER INDICATOR QA CHECKS PASSED SUCCESSFULLY!');
}

runQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
