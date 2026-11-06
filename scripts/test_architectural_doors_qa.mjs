import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-arch-qa-' + Date.now());
const PORT = 9285;
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
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(QA_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`📸 Saved screenshot: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return outPath;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log('🏛️ Starting Architectural Wall Structure QA Verification...');
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      '--headless=new',
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
  await client.send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(2000);

  // Scroll to #doors section
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  console.log('\n--- 1. ARCHITECTURAL WALL & ALCOVE STRUCTURE AUDIT ---');
  const wallAudit = await client.evaluate(`(() => {
    const wall = document.querySelector('#doors .architectural-wall-surface');
    const alcoves = document.querySelectorAll('#doors .architectural-alcove');
    const doors = document.querySelectorAll('#doors .door-card-item');
    const baseboard = document.querySelector('#doors .architectural-wall-surface ~ div, #doors .architectural-wall-surface > div:last-child');

    return {
      hasWallSurface: !!wall,
      alcoveCount: alcoves.length,
      doorsCount: doors.length,
      hasBaseboard: !!baseboard,
      wallComputedBg: wall ? window.getComputedStyle(wall).backgroundImage.substring(0, 50) + '...' : null,
      alcoveDepthBoxShadow: alcoves[0] ? window.getComputedStyle(alcoves[0]).boxShadow.substring(0, 60) + '...' : null,
    };
  })()`);
  console.log('Wall & Alcoves Audit:', JSON.stringify(wallAudit, null, 2));

  // Capture Screenshot of Architectural Wall in default mode
  await client.captureScreenshot('architectural_wall_dark.png');

  // Test toggling to Cream Light Mode to verify architectural lighting in both themes
  console.log('\n--- 2. LIGHT THEME ARCHITECTURAL WALL AUDIT ---');
  await client.evaluate(`(() => {
    const cord = document.querySelector('.lamp-cord');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(600);
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(500);

  await client.captureScreenshot('architectural_wall_cream.png');

  // Toggle back to Dark Mode
  await client.evaluate(`(() => {
    const cord = document.querySelector('.lamp-cord');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(600);
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(500);

  console.log('\n--- 3. INTERACTIVE DOOR WALKTHROUGH TEST ---');
  // Click Door 0 (Full Stack Developer)
  const clickRes = await client.evaluate(`(() => {
    const d0 = document.querySelectorAll('#doors .door-card-item')[0];
    if (!d0) return { clicked: false };
    d0.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    return { clicked: true, text: d0.textContent.trim().substring(0, 30) };
  })()`);
  console.log('Door 0 Clicked:', clickRes);

  // Wait for natural hinge swing & walkthrough zoom
  await sleep(2200);

  // Verify showcase mounted
  const showcaseAudit = await client.evaluate(`(() => {
    const sc = document.querySelector('#discipline-showcase');
    return {
      showcaseFound: !!sc,
      heading: sc?.querySelector('h1')?.textContent?.trim(),
      hasBackBtn: !!document.querySelector('.showcase-back-btn'),
    };
  })()`);
  console.log('Showcase Audit:', showcaseAudit);

  await client.captureScreenshot('architectural_door0_showcase.png');

  // Click back to doors
  console.log('Returning back to architectural doors...');
  await client.evaluate(`(() => {
    const btn = document.querySelector('.showcase-back-btn');
    if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(1000);

  const restoredCheck = await client.evaluate(`(() => ({
    hasDoors: !!document.querySelector('#doors'),
    doorsCount: document.querySelectorAll('#doors .door-card-item').length,
    alcoveCount: document.querySelectorAll('#doors .architectural-alcove').length,
  }))()`);
  console.log('Restored Architectural Wall Check:', restoredCheck);

  await client.captureScreenshot('architectural_wall_restored.png');

  console.log('\n========================================');
  console.log('✅ ARCHITECTURAL WALL QA AUDIT COMPLETE!');
  console.log('========================================');

  client.close();
  chromeProcess.kill();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch {}
}

main().catch(console.error);

