import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-story-test-' + Date.now());
const PORT = 9223;
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
          if (data.error) reject(data.error);
          else resolve(data.result);
        } else if (data.method === 'Runtime.consoleAPICalled') {
          const text = data.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
          console.log('[BROWSER CONSOLE]', text);
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

async function runTest() {
  let chromeProcess;
  try {
    chromeProcess = await startChrome();
    const targetsRes = await fetch(`http://localhost:${PORT}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('Testing Desktop 1440 × 900 sticky storytelling scroll...');
    await client.setViewport(1440, 900, false);
    await client.send('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(2000);

    // Scroll to #my-story
    console.log('1. Scrolling into #my-story start...');
    await client.evaluate(`
      const el = document.getElementById('my-story');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(1000);
    await client.captureScreenshot('story_01_enter_milestone_1.png');

    // Verify left column is stationary and Milestone 1 is active
    let state = await client.evaluate(`
      ({
        activeYear: document.querySelector('.active-year')?.textContent?.trim(),
        rightY: window.getComputedStyle(document.querySelector('.timeline-right-track')).transform,
        leftHeading: document.querySelector('#my-story h2')?.textContent?.trim(),
      })
    `);
    console.log('State at start of My Story:', state);

    // Scroll through the pin: scroll by 400px
    console.log('2. Scrolling 400px through story sequence...');
    await client.evaluate(`window.scrollBy({ top: 400, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('story_02_mid_scroll.png');

    state = await client.evaluate(`
      ({
        activeYear: document.querySelector('.active-year')?.textContent?.trim(),
        rightY: window.getComputedStyle(document.querySelector('.timeline-right-track')).transform,
        leftHeadingVisible: !!document.querySelector('#my-story h2'),
      })
    `);
    console.log('State during mid scroll:', state);

    // Scroll to reveal Milestone 4 (2025)
    console.log('3. Scrolling to 2025 milestone...');
    await client.evaluate(`window.scrollBy({ top: 500, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('story_03_year_2025.png');

    state = await client.evaluate(`
      ({
        activeYear: document.querySelector('.active-year')?.textContent?.trim(),
        rightY: window.getComputedStyle(document.querySelector('.timeline-right-track')).transform,
      })
    `);
    console.log('State at 2025:', state);

    // Scroll to reveal final Milestone 5 (2022)
    console.log('4. Scrolling to 2022 milestone (final entry)...');
    await client.evaluate(`window.scrollBy({ top: 500, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('story_04_final_entry_2022.png');

    state = await client.evaluate(`
      ({
        activeYear: document.querySelector('.active-year')?.textContent?.trim(),
        rightY: window.getComputedStyle(document.querySelector('.timeline-right-track')).transform,
      })
    `);
    console.log('State at final entry 2022:', state);

    // Scroll past end of pinned section into Contact section
    console.log('5. Scrolling past pin end into Contact section...');
    await client.evaluate(`window.scrollBy({ top: 600, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('story_05_unpinned_into_contact.png');

    // Scroll backwards up
    console.log('6. Scrolling backwards up back into story...');
    await client.evaluate(`window.scrollBy({ top: -600, behavior: 'instant' });`);
    await sleep(800);
    await client.captureScreenshot('story_06_scroll_backward.png');

    // Test Mobile viewport 390 × 844
    console.log('7. Testing Mobile 390 × 844 single-column storytelling layout...');
    await client.setViewport(390, 844, true);
    await client.evaluate(`
      const el = document.getElementById('my-story');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `);
    await sleep(800);
    await client.captureScreenshot('story_07_mobile_view.png');

    console.log('All sticky storytelling scroll tests completed successfully!');
  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
      try {
        fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
      } catch {}
    }
  }
}

runTest().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
