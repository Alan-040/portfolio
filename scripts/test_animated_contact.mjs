import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-animated-contact-' + Date.now());
const PORT = 9229;
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
  console.log('🚀 Checking Animated Contact Section at bottom...');
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

    await sleep(1500);

    // Scroll to the bottom contact section
    console.log('📜 Scrolling to bottom contact section...');
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const contact = document.querySelector('#contact');
        if (contact) {
          contact.scrollIntoView({ behavior: 'instant' });
        }
      })()`,
    });

    await sleep(1500);

    const contactCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('#contact');
        if (!section) return null;

        const heading = section.querySelector('.contact-heading')?.textContent?.trim();
        const emailLink = section.querySelector('a[href^="mailto:"]')?.getAttribute('href');
        const phoneLink = section.querySelector('a[href^="tel:"]')?.getAttribute('href');
        const canvases = Array.from(section.querySelectorAll('canvas'));
        const socials = Array.from(section.querySelectorAll('.contact-social-item')).map(a => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href'),
        }));
        const footer = section.querySelector('.contact-minimal-footer')?.textContent?.trim();

        return {
          heading,
          emailLink,
          phoneLink,
          threeCanvasesCount: canvases.length,
          socials,
          footer,
          bodyScrollWidth: document.body.scrollWidth,
          innerWidth: window.innerWidth,
          hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Contact Section Elements:', JSON.stringify(contactCheck.result?.value, null, 2));

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(QA_DIR, 'animated_contact_desktop.png'), Buffer.from(shot.data, 'base64'));
    console.log('📸 Saved animated_contact_desktop.png');

    // Test Mobile Viewport (390x844)
    console.log('\n📱 Testing Mobile Viewport (390x844)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1000);

    const mobileCheck = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('#contact');
        if (section) section.scrollIntoView({ behavior: 'instant' });
        return {
          bodyScrollWidth: document.body.scrollWidth,
          innerWidth: window.innerWidth,
          hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Mobile Check:', JSON.stringify(mobileCheck.result?.value, null, 2));

    const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(QA_DIR, 'animated_contact_mobile.png'), Buffer.from(mobileShot.data, 'base64'));
    console.log('📸 Saved animated_contact_mobile.png');

    cdp.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(console.error);

