import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-dm-reveal-' + Date.now());
const PORT = 9295;
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
  console.log('🌓 Starting Dark Mode Interactive Colour Reveal QA Verification...');
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
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(2500);

  console.log('\n--- 1. LIGHT MODE INITIAL BEHAVIOUR ---');
  const lightAudit = await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor], .hero-portrait-mask > div');
    const imgs = portraitContainer?.querySelectorAll('img') || [];
    const bottomImg = imgs[0];
    const topLayer = portraitContainer?.querySelector('div[aria-hidden="true"]');

    return {
      isLightModeBody: document.body.classList.contains('light-theme'),
      bottomFilter: bottomImg ? window.getComputedStyle(bottomImg).filter : null,
      topLayerOpacity: topLayer ? window.getComputedStyle(topLayer).opacity : null,
      cursorAttr: portraitContainer?.getAttribute('data-cursor'),
    };
  })()`);
  console.log('Light Mode State:', JSON.stringify(lightAudit, null, 2));
  await client.captureScreenshot('profile_light_mode_normal.png');

  console.log('\n--- 2. TOGGLE TO DARK MODE VIA PULL-CHAIN ---');
  await client.evaluate(`(() => {
    const cord = document.querySelector('.hero-pull-chain');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(700);

  const darkModeInit = await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    const imgs = portraitContainer?.querySelectorAll('img') || [];
    const bottomImg = imgs[0];
    const topLayer = portraitContainer?.querySelector('div[aria-hidden="true"]');

    return {
      isLightModeBody: document.body.classList.contains('light-theme'),
      hasColourCursor: !!portraitContainer,
      bottomFilter: bottomImg ? window.getComputedStyle(bottomImg).filter : null,
      topLayerOpacity: topLayer ? window.getComputedStyle(topLayer).opacity : null,
    };
  })()`);
  console.log('Dark Mode Initial State:', JSON.stringify(darkModeInit, null, 2));
  await client.captureScreenshot('profile_dark_mode_grayscale.png');

  console.log('\n--- 3. HOVER OVER PORTRAIT IN DARK MODE ---');
  await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    const rect = portraitContainer.getBoundingClientRect();
    const targetX = rect.left + 180;
    const targetY = rect.top + 240;

    portraitContainer.dispatchEvent(new MouseEvent('mouseenter', {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
      cancelable: true,
      view: window
    }));

    portraitContainer.dispatchEvent(new MouseEvent('mousemove', {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
      cancelable: true,
      view: window
    }));
  })()`);
  await sleep(400);

  const hoverActive = await client.evaluate(`(() => {
    const topLayer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"] div[aria-hidden="true"]');
    return {
      computedOpacity: window.getComputedStyle(topLayer).opacity,
      maskImage: topLayer.style.maskImage || topLayer.style.webkitMaskImage,
    };
  })()`);
  console.log('Dark Mode Hover Active:', hoverActive);
  await client.captureScreenshot('profile_dark_mode_colour_reveal.png');

  console.log('\n--- 4. MOVE CURSOR TO SECOND LOCATION ---');
  await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    const rect = portraitContainer.getBoundingClientRect();
    const targetX = rect.left + 260;
    const targetY = rect.top + 360;

    portraitContainer.dispatchEvent(new MouseEvent('mousemove', {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
      cancelable: true,
      view: window
    }));
  })()`);
  await sleep(250);

  const movedActive = await client.evaluate(`(() => {
    const topLayer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"] div[aria-hidden="true"]');
    return {
      newMaskImage: topLayer.style.maskImage || topLayer.style.webkitMaskImage,
    };
  })()`);
  console.log('Dark Mode Moved Mask:', movedActive);
  await client.captureScreenshot('profile_dark_mode_moved_reveal.png');

  console.log('\n--- 5. MOUSE LEAVE & RESTORE GRAYSCALE ---');
  await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    portraitContainer.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, cancelable: true, view: window }));
    portraitContainer.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false, cancelable: true, view: window }));
    portraitContainer.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(400);

  const leaveAudit = await client.evaluate(`(() => {
    const topLayer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"] div[aria-hidden="true"]');
    return {
      restoredOpacity: window.getComputedStyle(topLayer).opacity,
    };
  })()`);
  console.log('Dark Mode Restored to Grayscale:', leaveAudit);
  await client.captureScreenshot('profile_dark_mode_restored_grayscale.png');

  console.log('\n--- 6. SWITCH BACK TO LIGHT MODE ---');
  await client.evaluate(`(() => {
    const cord = document.querySelector('.hero-pull-chain');
    if (cord) cord.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(700);

  const lightModeRestored = await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask > div');
    const imgs = portraitContainer?.querySelectorAll('img') || [];
    const bottomImg = imgs[0];

    return {
      isLightModeBody: document.body.classList.contains('light-theme'),
      bottomFilter: bottomImg ? window.getComputedStyle(bottomImg).filter : null,
    };
  })()`);
  console.log('Light Mode Restored State:', JSON.stringify(lightModeRestored, null, 2));
  await client.captureScreenshot('profile_light_mode_restored.png');

  console.log('\n--- 7. ARCHITECTURAL WALL COEXISTENCE VERIFICATION ---');
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(600);

  const doorsCheck = await client.evaluate(`(() => ({
    hasDoorsSection: !!document.querySelector('#doors'),
    hasWallSurface: !!document.querySelector('#doors .architectural-wall-surface'),
    alcoveCount: document.querySelectorAll('#doors .architectural-alcove').length,
    doorsCount: document.querySelectorAll('#doors .door-card-item').length,
  }))()`);
  console.log('Architectural Wall Coexistence:', JSON.stringify(doorsCheck, null, 2));

  console.log('\n========================================');
  console.log('✅ DARK MODE COLOUR REVEAL QA AUDIT COMPLETED!');
  console.log('========================================');

  client.close();
  chromeProcess.kill();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch {}
}

main().catch(console.error);

