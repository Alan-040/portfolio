import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-roles-test-' + Date.now());
const PORT = 9224;
const QA_DIR = path.resolve('qa_results');

if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startChrome() {
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
      if (res.ok) return chromeProcess;
    } catch {
      await sleep(300);
    }
  }
  throw new Error('Chrome failed to start on port ' + PORT);
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
          if (data.error) {
            reject(new Error(data.error.message || JSON.stringify(data.error)));
          } else {
            resolve(data.result);
          }
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log('🚀 Starting Chrome for Role Switching & Layout Test...');
  const chrome = await startChrome();

  try {
    const res = await fetch(`http://localhost:${PORT}/json/new?http://localhost:5173/`, { method: 'PUT' });
    const target = await res.json();
    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('⏳ Waiting for page initialization & entrance animation...');
    await sleep(2000);

    // Track roles over 16 seconds (flips every 2.6s, should see all 5 and loop back)
    const observedRoles = [];
    console.log('⏱️ Monitoring Rolodex card transitions over 16 seconds...');
    
    for (let i = 0; i < 20; i++) {
      const evalRes = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const titleEl = document.querySelector('.rolodex-text');
          const idEl = document.querySelector('.rolodex-id');
          const cardEl = document.querySelector('.hero-rolodex > div');
          if (!titleEl || !cardEl) return null;
          const rect = cardEl.getBoundingClientRect();
          const titleRect = titleEl.getBoundingClientRect();
          return {
            title: titleEl.textContent.trim(),
            id: idEl ? idEl.textContent.trim() : '',
            cardWidth: rect.width,
            cardHeight: rect.height,
            isOverflowing: titleEl.scrollWidth > titleEl.clientWidth,
            scrollWidth: titleEl.scrollWidth,
            clientWidth: titleEl.clientWidth,
          };
        })()`,
        returnByValue: true,
      });

      const data = evalRes.result?.value;
      if (data && (!observedRoles.length || observedRoles[observedRoles.length - 1].title !== data.title)) {
        observedRoles.push(data);
        console.log(`  [Observed Step ${observedRoles.length}] Title: "${data.title}" | ID: "${data.id}" | Card: ${Math.round(data.cardWidth)}x${Math.round(data.cardHeight)}px | Overflow: ${data.isOverflowing}`);
      }

      await sleep(800);
    }

    console.log('\n--- Checking Magic Section Doors & Supporting Identity ---');
    const doorsEval = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const doors = Array.from(document.querySelectorAll('.door-card-item')).map(d => {
          const plaque = d.querySelector('.font-mono')?.textContent?.trim() || '';
          const name = d.querySelector('span.mt-3')?.textContent?.trim() || '';
          return { plaque, name };
        });
        const heading = document.querySelector('.doors-heading')?.textContent?.trim() || '';
        return {
          doorCount: doors.length,
          doors,
          hasSupportingContentCreator: heading.includes('Content Creator'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Doors info:', JSON.stringify(doorsEval.result?.value, null, 2));

    // Capture desktop screenshot
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(QA_DIR, 'hero_5roles_desktop.png'), Buffer.from(shot.data, 'base64'));
    console.log('📸 Saved hero_5roles_desktop.png');

    // Test Mobile Viewport (390x844)
    console.log('\n📱 Testing Mobile Viewport (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1000);

    const mobileEval = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const titleEl = document.querySelector('.rolodex-text');
        const idEl = document.querySelector('.rolodex-id');
        const cardEl = document.querySelector('.hero-rolodex > div');
        const rect = cardEl ? cardEl.getBoundingClientRect() : null;
        return {
          title: titleEl?.textContent?.trim(),
          id: idEl?.textContent?.trim(),
          cardWidth: rect?.width,
          cardHeight: rect?.height,
          bodyScrollWidth: document.body.scrollWidth,
          innerWidth: window.innerWidth,
          hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
          isOverflowing: titleEl ? titleEl.scrollWidth > titleEl.clientWidth : false,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Mobile evaluation:', JSON.stringify(mobileEval.result?.value, null, 2));

    const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(QA_DIR, 'hero_5roles_mobile.png'), Buffer.from(mobileShot.data, 'base64'));
    console.log('📸 Saved hero_5roles_mobile.png');

    cdp.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(console.error);
