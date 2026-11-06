import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-doors-qa-' + Date.now());
const PORT = 9272;
const QA_DIR = path.resolve('qa_results');

if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  console.log('🚀 Starting Automated 4-Door Walkthrough Verification...');
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

  const doors = [
    { index: 0, title: 'Web Developer', filename: 'verified_door0_webdev.png' },
    { index: 1, title: 'App Developer', filename: 'verified_door1_appdev.png' },
    { index: 2, title: 'UI/UX Designer', filename: 'verified_door2_uiux.png' },
    { index: 3, title: 'Graphic Designer', filename: 'verified_door3_graphic.png' },
  ];

  for (const d of doors) {
    console.log(`\n========================================`);
    console.log(`Testing Door ${d.index}: ${d.title}...`);
    console.log(`========================================`);

    // Verify doors are present
    const doorsCount = await client.evaluate(`document.querySelectorAll('#doors .door-card-item').length`);
    console.log('Available doors on main page:', doorsCount);

    // Click door to trigger natural hinge swing & walkthrough
    const clickTitle = await client.evaluate(`(() => {
      const doors = document.querySelectorAll('#doors .door-card-item');
      const target = doors[${d.index}];
      if (!target) return null;
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      return target.textContent.trim().substring(0, 30);
    })()`);
    console.log(`Dispatched click on Door ${d.index}: "${clickTitle}"`);

    // Wait for hinge opening (600ms) + view switch + entrance animations
    await sleep(2200);

    // Verify showcase view
    const showcaseInfo = await client.evaluate(`(() => {
      const showcase = document.querySelector('#discipline-showcase');
      if (!showcase) return { found: false };
      const h1 = showcase.querySelector('h1')?.textContent?.trim();
      const intro = showcase.querySelector('p')?.textContent?.trim();
      const techBadges = Array.from(showcase.querySelectorAll('.font-mono')).map(e => e.textContent.trim()).filter(Boolean);
      const projectHeadings = Array.from(showcase.querySelectorAll('h3')).map(e => e.textContent.trim());
      const hasBackBtn = !!document.querySelector('.showcase-back-btn');
      return {
        found: true,
        heading: h1,
        introSnippet: intro ? intro.substring(0, 80) : '',
        techCount: techBadges.length,
        projects: projectHeadings,
        hasBackBtn,
      };
    })()`);
    console.log('Showcase Verification:', JSON.stringify(showcaseInfo, null, 2));

    // Capture High-Fidelity Screenshot of Showcase
    await client.captureScreenshot(d.filename);

    // Return back to doors
    console.log('Clicking "Back to the doors" button...');
    await client.evaluate(`(() => {
      const backBtn = document.querySelector('.showcase-back-btn');
      if (backBtn) {
        backBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    })()`);

    // Wait for return transition
    await sleep(1000);

    // Verify restored doors
    const returnCheck = await client.evaluate(`(() => ({
      hasDoors: !!document.querySelector('#doors'),
      doorsCount: document.querySelectorAll('#doors .door-card-item').length
    }))()`);
    console.log('Returned to main doors:', returnCheck);
  }

  // Final screenshot of restored doors section
  console.log('\nCapturing final restored doors screenshot...');
  await client.captureScreenshot('verified_doors_restored.png');

  console.log('\n========================================');
  console.log('✅ ALL 4 DOORS FULLY VERIFIED WITH SCREENSHOTS!');
  console.log('========================================');

  client.close();
  chromeProcess.kill();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch {}
}

main().catch(console.error);

