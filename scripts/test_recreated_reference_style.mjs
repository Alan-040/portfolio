import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-recreate-' + Date.now());
const PORT = 9299;
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
  console.log('--- AUDITING RECREATED USER REFERENCE STYLE ---');

  let appUrl = 'http://localhost:5174/';
  try {
    const testRes = await fetch('http://localhost:5174/');
    if (!testRes.ok) throw new Error('Not 5174');
  } catch {
    appUrl = 'http://localhost:5173/';
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
  await client.send('Log.enable');

  client.ws.addEventListener('message', (msg) => {
    try {
      const parsed = JSON.parse(msg.data);
      if (parsed.method === 'Runtime.exceptionThrown') {
        console.error('Browser Exception:', JSON.stringify(parsed.params, null, 2));
      }
      if (parsed.method === 'Log.entryAdded') {
        console.log('Browser Log:', parsed.params.entry.text);
      }
    } catch {}
  });

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: appUrl });
  await sleep(2000);

  // 1. Light Mode (The exact match to the user's uploaded reference image)
  console.log('\n--- 1. CAPTURING RECREATED LIGHT MODE ARCHITECTURAL DOORS ---');
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(1000);

  const lightAudit = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    const casings = document.querySelectorAll('#doors .architectural-casing');
    const floor = document.querySelector('.floor-plane');
    const baseboard = document.querySelector('#doors .w-full.h-5, #doors .w-full.h-6');

    return {
      isLightMode: document.body.classList.contains('light-theme'),
      doorsCount: doors.length,
      casingsCount: casings.length,
      hasFloor: !!floor,
      hasBaseboard: !!baseboard,
      plaques: Array.from(doors).map(d => d.querySelector('.font-mono.tracking-wider, .font-mono.tracking-widest')?.innerText?.trim()),
    };
  })()`);
  console.log('Recreated Light Mode State:', JSON.stringify(lightAudit, null, 2));
  await client.captureScreenshot('recreated_user_style_light_mode.png');

  // 2. Hover over Door 1 (App Developer)
  console.log('\n--- 2. HOVER OVER DOOR 1 ---');
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
  await client.captureScreenshot('recreated_user_style_door1_hovered.png');

  // 3. Move mouse to Door 2 (UI/UX Designer)
  console.log('\n--- 3. HOVER OVER DOOR 2 ---');
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[2].x, y: doorBoxes[2].y });
  await sleep(500);
  await client.captureScreenshot('recreated_user_style_door2_hovered.png');

  // 4. Toggle to Dark Mode to verify dark corridor styling
  console.log('\n--- 4. TOGGLE TO DARK MODE ---');
  await client.evaluate(`(() => {
    const cord = document.querySelector('.hero-pull-chain') || document.querySelector('[data-cursor="LIGHT"]');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(1000);

  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);
  await client.captureScreenshot('recreated_user_style_dark_mode.png');

  client.close();
  try {
    chromeProc.kill();
  } catch {}

  console.log('\n✅ RECREATED USER REFERENCE STYLE VERIFICATION COMPLETE!');
}

runQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
