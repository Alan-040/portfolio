import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-only-form-' + Date.now());
const PORT = 9228;
const QA_DIR = path.resolve('qa_results');

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
  console.log('🚀 Checking that ONLY the form is visible after clicking "Start a project"...');
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

    await sleep(2000);

    // Initial state: form view should not be in DOM
    const initialCheck = await cdp.send('Runtime.evaluate', {
      expression: `!!document.querySelector('#project-form-view')`,
      returnByValue: true,
    });
    console.log('Form view visible before click:', initialCheck.result?.value);

    // Click "Start a project"
    console.log('🖱️ Clicking "Start a project"...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#home button[data-cursor="CLICK"]');
        if (btn) btn.click();
      })()`,
    });

    await sleep(600);

    // After click: #project-form-view should be visible and cover full screen
    const afterClickCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const view = document.querySelector('#project-form-view');
        if (!view) return null;
        const rect = view.getBoundingClientRect();
        const formCard = view.querySelector('#project-form');
        const inputs = Array.from(formCard.querySelectorAll('input, textarea')).map(i => ({
          name: i.name,
          type: i.type,
          placeholder: i.placeholder,
        }));
        const submitBtn = formCard.querySelector('button[type="submit"]');

        return {
          viewExists: !!view,
          isFullScreen: rect.width === window.innerWidth && rect.height === window.innerHeight,
          rect: { width: rect.width, height: rect.height },
          inputs,
          hasSubmitButton: !!submitBtn,
          submitText: submitBtn?.textContent?.trim(),
        };
      })()`,
      returnByValue: true,
    });
    console.log('After Click Evaluation:', JSON.stringify(afterClickCheck.result?.value, null, 2));

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(QA_DIR, 'only_form_visible.png'), Buffer.from(shot.data, 'base64'));
    console.log('📸 Saved only_form_visible.png');

    // Click "Back to portfolio"
    console.log('🖱️ Clicking "Back to portfolio"...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const backBtn = document.querySelector('#project-form-view button[data-cursor="BACK"]');
        if (backBtn) backBtn.click();
      })()`,
    });

    await sleep(400);

    const closedCheck = await cdp.send('Runtime.evaluate', {
      expression: `!document.querySelector('#project-form-view')`,
      returnByValue: true,
    });
    console.log('Form closed successfully on back click:', closedCheck.result?.value);

    cdp.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(console.error);

