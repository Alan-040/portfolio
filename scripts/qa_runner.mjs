import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-cdp-qa-' + Date.now());
const PORT = 9222;
const QA_DIR = path.resolve('qa_results');

if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startChrome() {
  console.log('Launching headless Chrome with remote debugging on port', PORT);
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

  // Poll until debugging port is available
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json/version`);
      if (res.ok) {
        console.log('Chrome debugging interface ready.');
        return chromeProcess;
      }
    } catch {
      await sleep(300);
    }
  }
  throw new Error('Could not connect to Chrome on port ' + PORT);
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.events = [];
    this.consoleLogs = [];
    this.pageErrors = [];
    this.networkErrors = [];
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
        } else if (data.method) {
          this.handleEvent(data.method, data.params);
        }
      };
    });
  }

  handleEvent(method, params) {
    if (method === 'Runtime.consoleAPICalled') {
      const text = params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      this.consoleLogs.push({ type: params.type, text });
      if (params.type === 'error') {
        console.error('BROWSER CONSOLE ERROR:', text);
      }
    } else if (method === 'Runtime.exceptionThrown') {
      const desc = params.exceptionDetails.exception?.description || params.exceptionDetails.text;
      this.pageErrors.push(desc);
      console.error('UNCAUGHT PAGE EXCEPTION:', desc);
    } else if (method === 'Network.loadingFailed') {
      this.networkErrors.push({ url: params.url, reason: params.errorText });
      console.error('NETWORK FAILED:', params.url, params.errorText);
    }
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
    console.log(`Saved screenshot: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return outPath;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile,
    });
    await this.send('Emulation.setVisibleSize', { width, height });
  }
}

async function runQA() {
  let chromeProcess;
  try {
    chromeProcess = await startChrome();
    const targetsRes = await fetch(`http://localhost:${PORT}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    console.log('Connected to Chrome DevTools Protocol WebSocket.');

    // Enable domains
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Network.enable');

    console.log('\n--- 1. DESKTOP 1440 × 900 AUDIT ---');
    await client.setViewport(1440, 900, false);
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(2500);

    // Hero Cream Light Mode
    await client.captureScreenshot('desktop_1440_hero_cream.png');

    // Test Pull-Chain Lamp Cord (Toggle Dark Theme)
    console.log('Testing lamp cord theme toggle...');
    await client.evaluate(`
      const cord = document.querySelector('.lamp-pull-cord') || document.querySelector('[data-cursor="PULL"]');
      if (cord) cord.click();
    `);
    await sleep(600);
    await client.captureScreenshot('desktop_1440_hero_dark.png');

    // Toggle back to Cream mode
    await client.evaluate(`
      const cord = document.querySelector('.lamp-pull-cord') || document.querySelector('[data-cursor="PULL"]');
      if (cord) cord.click();
    `);
    await sleep(400);

    // Test Visiting Card Popup click
    console.log('Testing visiting card popup badge...');
    await client.evaluate(`
      const badge = document.querySelector('.hero-lapel-badge');
      if (badge) badge.click();
    `);
    await sleep(400);
    await client.captureScreenshot('desktop_1440_visiting_card.png');

    // Scroll to Magic Section
    console.log('Scrolling to Magic Doors Section...');
    await client.evaluate(`
      const el = document.getElementById('doors');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(1000);
    await client.captureScreenshot('desktop_1440_magic_doors.png');

    // Test Door Portal zoom: Click Web Dev Door to enter Showcase
    console.log('Clicking Web Development Door to enter showcase view...');
    await client.evaluate(`
      const webDoor = document.querySelector('[data-cursor="ENTER"]') || document.querySelectorAll('.magic-door-card')[0];
      if (webDoor) webDoor.click();
    `);
    await sleep(1500);
    await client.captureScreenshot('desktop_1440_showcase_web_sundown.png');

    // Scroll down inside showcase to Project 2 (Personal portfolio)
    await client.evaluate(`window.scrollBy({ top: 900, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('desktop_1440_showcase_web_portfolio.png');

    // Scroll down inside showcase to Project 3 (Zerodha)
    await client.evaluate(`window.scrollBy({ top: 900, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('desktop_1440_showcase_web_zerodha.png');

    // Click "Back to the doors"
    console.log('Clicking "Back to the doors" button...');
    await client.evaluate(`
      const backBtn = document.querySelector('.showcase-back-btn');
      if (backBtn) backBtn.click();
    `);
    await sleep(1200);

    // Scroll to Timeline Section
    console.log('Scrolling to Timeline Section...');
    await client.evaluate(`
      const el = document.getElementById('timeline');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(1000);
    await client.captureScreenshot('desktop_1440_timeline.png');

    // Scroll to Contact Section
    console.log('Scrolling to Contact Section...');
    await client.evaluate(`
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(1000);
    await client.captureScreenshot('desktop_1440_contact.png');

    console.log('\n--- 2. DESKTOP 1280 × 800 AUDIT ---');
    await client.setViewport(1280, 800, false);
    await client.evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('desktop_1280_hero.png');

    console.log('\n--- 3. TABLET 768 × 1024 AUDIT ---');
    await client.setViewport(768, 1024, true);
    await client.evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('tablet_768_hero.png');
    await client.evaluate(`
      const el = document.getElementById('doors');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(800);
    await client.captureScreenshot('tablet_768_doors.png');

    console.log('\n--- 4. MOBILE 390 × 844 AUDIT ---');
    await client.setViewport(390, 844, true);
    await client.evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('mobile_390_hero.png');
    await client.evaluate(`
      const el = document.getElementById('doors');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(800);
    await client.captureScreenshot('mobile_390_doors.png');

    console.log('\n--- 5. MOBILE 360 × 800 AUDIT ---');
    await client.setViewport(360, 800, true);
    await client.evaluate(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('mobile_360_hero.png');

    // Check performance metrics
    const perfMetrics = await client.evaluate(`
      ({
        timing: performance.timing ? {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        } : null,
        resourcesCount: performance.getEntriesByType('resource').length,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      })
    `);

    console.log('\n--- QA SUMMARY REPORT ---');
    console.log('Performance Metrics:', JSON.stringify(perfMetrics, null, 2));
    console.log('Console Logs Captured:', client.consoleLogs.length);
    console.log('Page Errors:', client.pageErrors.length);
    console.log('Network Errors:', client.networkErrors.length);

    fs.writeFileSync(
      path.join(QA_DIR, 'qa_metrics.json'),
      JSON.stringify(
        {
          perfMetrics,
          consoleLogs: client.consoleLogs,
          pageErrors: client.pageErrors,
          networkErrors: client.networkErrors,
        },
        null,
        2
      )
    );
  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
      try {
        fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
      } catch {}
    }
  }
}

runQA().catch((err) => {
  console.error('QA Runner Failed:', err);
  process.exit(1);
});

