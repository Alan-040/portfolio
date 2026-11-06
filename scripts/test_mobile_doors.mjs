import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-door-mob-' + Date.now());
const PORT = 9289;
const QA_DIR = path.resolve('qa_results');

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
    const filePath = path.join(QA_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`[CDP] Saved screenshot: ${filePath}`);
    return filePath;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runMobileQA() {
  console.log('--- STARTING MOBILE DOOR QA ---');

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
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(2000);

  // Scroll to #doors section
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  const mobileAudit = await client.evaluate(`(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const overflow = Math.max(docEl.scrollWidth, body.scrollWidth) - window.innerWidth;
    const doors = document.querySelectorAll('#doors .door-card-item');
    const pills = document.querySelectorAll('#doors .click-to-enter-pill');

    return {
      overflow,
      doorsCount: doors.length,
      pillsCount: pills.length,
    };
  })()`);
  console.log('Mobile Layout Audit:', JSON.stringify(mobileAudit, null, 2));

  await client.captureScreenshot('door_mobile_view.png');

  client.close();
  try {
    chromeProc.kill();
  } catch {}
}

runMobileQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});

