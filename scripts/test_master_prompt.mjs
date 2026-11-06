import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-master-' + Date.now());
const PORT = 9298;
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
  console.log('--- AUDITING MASTER PROMPT SPECIFICATIONS ---');

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

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: appUrl });
  await sleep(2000);

  // 1. Audit Hero Section & Roles
  console.log('\n--- 1. AUDITING HERO SECTION & ROLES ---');
  const heroAudit = await client.evaluate(`(() => {
    const portraitImg = document.querySelector('.hero-portrait-img img, .hero-portrait-mask img');
    const rolodex = document.querySelector('.hero-rolodex');
    const rolodexText = document.querySelector('.rolodex-text')?.innerText?.trim();
    const rolodexId = document.querySelector('.rolodex-id')?.innerText?.trim();
    const navLinks = Array.from(document.querySelectorAll('nav a')).map(a => a.innerText.trim());

    return {
      hasPortrait: !!portraitImg,
      portraitSrc: portraitImg?.getAttribute('src'),
      rolodexText,
      rolodexId,
      navLinks,
      hasContentCreatorInNav: navLinks.some(l => l.toLowerCase().includes('content creator')),
    };
  })()`);
  console.log('Hero Audit:', JSON.stringify(heroAudit, null, 2));
  await client.captureScreenshot('master_01_hero.png');

  // 2. Audit Magic Doors Section
  console.log('\n--- 2. AUDITING MAGIC DOORS SECTION ---');
  await client.evaluate(`document.querySelector('#doors')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(1000);

  const doorsAudit = await client.evaluate(`(() => {
    const doors = document.querySelectorAll('#doors .door-card-item');
    const casings = document.querySelectorAll('#doors .architectural-casing');
    const baseboard = document.querySelector('#doors .w-full.h-5, #doors .w-full.h-6');
    const floor = document.querySelector('.floor-plane');
    const scrollIndicator = document.querySelector('#doors [data-cursor="SCROLL"]');

    const doorDetails = Array.from(doors).map(d => {
      const plaque = d.querySelector('.font-mono')?.innerText?.trim();
      return {
        plaque,
      };
    });

    return {
      doorsCount: doors.length,
      casingsCount: casings.length,
      hasBaseboard: !!baseboard,
      hasFloor: !!floor,
      hasScrollIndicator: !!scrollIndicator,
      doorDetails,
    };
  })()`);
  console.log('Doors Audit:', JSON.stringify(doorsAudit, null, 2));
  await client.captureScreenshot('master_02_doors.png');

  // 3. Hover on Door 1 (Full Stack Developer)
  console.log('\n--- 3. HOVER ON DOOR 01 ---');
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

  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: doorBoxes[0].x, y: doorBoxes[0].y });
  await sleep(600);
  await client.captureScreenshot('master_03_door1_hover.png');

  // 4. Audit My Story Section (2024 -> 2025 -> 2026)
  console.log('\n--- 4. AUDITING MY STORY SECTION ---');
  await client.evaluate(`document.querySelector('#my-story')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(1200);

  const storyAudit = await client.evaluate(`(() => {
    const section = document.querySelector('#my-story');
    const activeYear = document.querySelector('#my-story .active-year')?.innerText?.trim();
    const milestones = Array.from(document.querySelectorAll('#my-story .timeline-milestone-item')).map(m => {
      return {
        period: m.querySelector('.font-mono.tracking-widest')?.innerText?.trim(),
        title: m.querySelector('h3')?.innerText?.trim(),
        org: m.querySelector('p')?.innerText?.trim(),
      };
    });

    return {
      exists: !!section,
      activeYear,
      milestonesCount: milestones.length,
      milestones,
    };
  })()`);
  console.log('Story Audit:', JSON.stringify(storyAudit, null, 2));
  await client.captureScreenshot('master_04_story_2024.png');

  // 5. Scroll My Story to trigger 2025 and 2026
  console.log('\n--- 5. SCROLLING MY STORY TIMELINE ---');
  await client.evaluate(`window.scrollBy({ top: 700, behavior: 'instant' });`);
  await sleep(800);
  await client.captureScreenshot('master_05_story_progress.png');

  // 6. Audit Contact Section
  console.log('\n--- 6. AUDITING CONTACT SECTION ---');
  await client.evaluate(`document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' });`);
  await sleep(800);

  const contactAudit = await client.evaluate(`(() => {
    const contact = document.querySelector('#contact');
    const heading = contact?.querySelector('h2')?.innerText?.trim();
    const links = Array.from(contact?.querySelectorAll('a') || []).map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.trim(),
    }));

    return {
      heading,
      hasLinkedIn: links.some(l => l.href?.includes('linkedin.com')),
      hasInstagram: links.some(l => l.href?.includes('instagram.com')),
      hasGitHub: links.some(l => l.href?.includes('github.com')),
      links,
    };
  })()`);
  console.log('Contact Audit:', JSON.stringify(contactAudit, null, 2));
  await client.captureScreenshot('master_06_contact.png');

  client.close();
  try {
    chromeProc.kill();
  } catch {}

  console.log('\n✅ MASTER PROMPT VERIFICATION COMPLETE!');
}

runQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
