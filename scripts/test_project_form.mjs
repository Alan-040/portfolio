import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-form-test-' + Date.now());
const PORT = 9227;
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
  console.log('🚀 Checking Start a project flow and Form fields...');
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

    // 1. Check form inputs presence and labels
    const formCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#project-form form');
        const nameInput = document.querySelector('#project-name-input');
        const phoneInput = document.querySelector('#project-phone-input');
        const emailInput = document.querySelector('#project-email-input');
        const descInput = document.querySelector('#project-desc-input');
        const submitBtn = form?.querySelector('button[type="submit"]');

        return {
          hasForm: !!form,
          hasNameInput: !!nameInput,
          hasPhoneInput: !!phoneInput,
          hasEmailInput: !!emailInput,
          hasDescInput: !!descInput,
          hasSubmitBtn: !!submitBtn,
          submitText: submitBtn?.textContent?.trim(),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Form Elements Check:', JSON.stringify(formCheck.result?.value, null, 2));

    // 2. Click "Start a project" button in Hero Section
    console.log('🖱️ Clicking "Start a project" button in Hero Section...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('#home button[data-cursor="CLICK"]');
        if (btn) btn.click();
      })()`,
    });

    await sleep(1800);

    const scrollCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#project-form');
        const rect = form?.getBoundingClientRect();
        const activeElId = document.activeElement?.id;
        return {
          scrollY: window.scrollY,
          formTopInViewport: rect?.top,
          isFormVisible: rect ? (rect.top >= -100 && rect.top <= window.innerHeight) : false,
          activeElementId: activeElId,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Scroll to Form Check:', JSON.stringify(scrollCheck.result?.value, null, 2));

    // 3. Fill form and submit
    console.log('✍️ Filling form with sample inquiry...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const nameInput = document.querySelector('#project-name-input');
        const phoneInput = document.querySelector('#project-phone-input');
        const emailInput = document.querySelector('#project-email-input');
        const descInput = document.querySelector('#project-desc-input');
        const form = document.querySelector('#project-form form');

        // Simulate React input typing by setting value and dispatching input event
        function setValue(el, val) {
          const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }

        setValue(nameInput, 'Alex Rivers');
        setValue(phoneInput, '+1 (555) 234-5678');
        setValue(emailInput, 'alex@studio.com');
        setValue(descInput, 'Looking to develop a flagship 3D animated web platform with React, Three.js and custom Blender assets.');

        const btn = form.querySelector('button[type="submit"]');
        btn.click();
      })()`,
    });

    await sleep(1200);

    const submitCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const formCard = document.querySelector('#project-form');
        return {
          text: formCard?.textContent?.trim(),
          isSuccessBannerVisible: formCard?.textContent?.includes('Project Request Received!'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Form Submission Check:', JSON.stringify(submitCheck.result?.value, null, 2));

    // Capture screenshot of success confirmation
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(QA_DIR, 'project_form_submitted.png'), Buffer.from(shot.data, 'base64'));
    console.log('📸 Saved project_form_submitted.png');

    cdp.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(console.error);

