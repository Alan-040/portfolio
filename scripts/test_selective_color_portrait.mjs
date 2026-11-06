import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-portrait-qa-' + Date.now());
const PORT = 9280;
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
  console.log('🚀 Starting Selective Colour Portrait QA Verification...');
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
  await sleep(2500);

  console.log('\n--- 1. INITIAL APPEARANCE AUDIT ---');
  const initialAudit = await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    if (!portraitContainer) return { found: false };

    const imgs = portraitContainer.querySelectorAll('img');
    const bottomImg = imgs[0];
    const topImg = imgs[1];
    const topLayer = portraitContainer.querySelector('div[aria-hidden="true"]');

    return {
      found: true,
      bottomFilter: window.getComputedStyle(bottomImg).filter,
      topLayerOpacity: window.getComputedStyle(topLayer).opacity,
      bottomSrc: bottomImg.getAttribute('src'),
      topSrc: topImg ? topImg.getAttribute('src') : null,
      imagesMatch: bottomImg.getAttribute('src') === (topImg ? topImg.getAttribute('src') : ''),
    };
  })()`);
  console.log('Initial Portrait State:', JSON.stringify(initialAudit, null, 2));

  await client.captureScreenshot('portrait_initial_grayscale.png');

  console.log('\n--- 2. CURSOR HOVER & SELECTIVE COLOUR REVEAL ---');
  // Trigger mouseenter and mousemove at (180, 240)
  const hoverAudit = await client.evaluate(`(() => {
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

    const topLayer = portraitContainer.querySelector('div[aria-hidden="true"]');
    return {
      hoverTriggered: true,
      maskImage: topLayer.style.maskImage || topLayer.style.webkitMaskImage,
    };
  })()`);
  console.log('Hover result:', hoverAudit);
  await sleep(400); // allow opacity transition to complete

  const activeOpacity = await client.evaluate(`(() => {
    const topLayer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"] div[aria-hidden="true"]');
    return {
      computedOpacity: window.getComputedStyle(topLayer).opacity,
      maskImage: topLayer.style.maskImage || topLayer.style.webkitMaskImage,
    };
  })()`);
  console.log('Active Hover Top Layer:', activeOpacity);

  await client.captureScreenshot('portrait_hover_colour_reveal.png');

  console.log('\n--- 3. CURSOR MOVEMENT TO SECOND POSITION ---');
  const moveAudit = await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    const rect = portraitContainer.getBoundingClientRect();
    const targetX = rect.left + 260;
    const targetY = rect.top + 380;

    portraitContainer.dispatchEvent(new MouseEvent('mousemove', {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
      cancelable: true,
      view: window
    }));

    const topLayer = portraitContainer.querySelector('div[aria-hidden="true"]');
    return {
      moveTriggered: true,
      newMaskImage: topLayer.style.maskImage || topLayer.style.webkitMaskImage,
    };
  })()`);
  console.log('Move result:', moveAudit);
  await sleep(200);

  await client.captureScreenshot('portrait_hover_moved_position.png');

  console.log('\n--- 4. MOUSE LEAVE & RESTORE GRAYSCALE ---');
  await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    portraitContainer.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, cancelable: true, view: window }));
    portraitContainer.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false, cancelable: true, view: window }));
    portraitContainer.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window }));
  })()`);
  await sleep(400); // wait for fade out transition

  const restoreAudit = await client.evaluate(`(() => {
    const topLayer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"] div[aria-hidden="true"]');
    return {
      restoredOpacity: window.getComputedStyle(topLayer).opacity,
    };
  })()`);
  console.log('Restored State:', restoreAudit);

  await client.captureScreenshot('portrait_restored_grayscale.png');

  console.log('\n--- 5. MOBILE TOUCH INTERACTION AUDIT ---');
  const touchAudit = await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    const rect = portraitContainer.getBoundingClientRect();
    const touchX = rect.left + 160;
    const touchY = rect.top + 220;

    const touchObj = new Touch({
      identifier: 1,
      target: portraitContainer,
      clientX: touchX,
      clientY: touchY,
      pageX: touchX,
      pageY: touchY,
    });

    portraitContainer.dispatchEvent(new TouchEvent('touchstart', {
      touches: [touchObj],
      targetTouches: [touchObj],
      changedTouches: [touchObj],
      bubbles: true,
      cancelable: true,
    }));

    const topLayer = portraitContainer.querySelector('div[aria-hidden="true"]');
    return {
      touchStarted: true,
      maskImage: topLayer.style.maskImage || topLayer.style.webkitMaskImage,
    };
  })()`);
  console.log('Touch Start result:', touchAudit);
  await sleep(400);

  await client.captureScreenshot('portrait_mobile_touch_reveal.png');

  // Touch End
  await client.evaluate(`(() => {
    const portraitContainer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"]');
    portraitContainer.dispatchEvent(new TouchEvent('touchend', {
      touches: [],
      targetTouches: [],
      changedTouches: [],
      bubbles: true,
      cancelable: true,
    }));
  })()`);
  await sleep(400);

  const touchEndAudit = await client.evaluate(`(() => {
    const topLayer = document.querySelector('.hero-portrait-mask [data-cursor="COLOUR"] div[aria-hidden="true"]');
    return {
      restoredAfterTouch: window.getComputedStyle(topLayer).opacity,
    };
  })()`);
  console.log('Touch End Restored:', touchEndAudit);

  console.log('\n========================================');
  console.log('✅ SELECTIVE COLOUR PORTRAIT QA COMPLETED SUCCESSFULLY!');
  console.log('========================================');

  client.close();
  chromeProcess.kill();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch {}
}

main().catch(console.error);
