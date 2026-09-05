import { spawn } from 'child_process';
import fs from 'fs';

export class CDPBrowser {
  constructor(port = 9222) {
    this.port = port;
    this.chrome = null;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
    this.consoleLogs = [];
    this.errors = [];
  }

  async start() {
    const chromePath = '/home/one-piece/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
    this.chrome = spawn(chromePath, [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank'
    ]);

    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch(`http://localhost:${this.port}/json/version`);
        if (res.ok) break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    const listRes = await fetch(`http://localhost:${this.port}/json`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.type === 'page') || tabs[0];

    this.ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(resolve => this.ws.onopen = resolve);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve, reject } = this.pending.get(data.id);
        this.pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      } else if (data.method === 'Runtime.consoleAPICalled') {
        this.consoleLogs.push(data.params);
      } else if (data.method === 'Runtime.exceptionThrown') {
        this.errors.push(data.params);
      }
    };

    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async navigate(url, waitMs = 1200) {
    await this.send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, waitMs));
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res && res.exceptionDetails) {
      const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text || JSON.stringify(res.exceptionDetails);
      throw new Error(desc);
    }
    return res && res.result ? res.result.value : undefined;
  }

  async click(selector) {
    return this.eval(`(() => {
      function findEl(sel) {
        for (const part of sel.split(',').map(s => s.trim())) {
          if (part.includes(':has-text(')) {
            const [tag, textWithParen] = part.split(':has-text(');
            const targetText = textWithParen.replace(/["')]/g, '').trim();
            const candidates = Array.from(document.querySelectorAll(tag || '*'));
            const found = candidates.find(c => (c.innerText || c.textContent || '').includes(targetText));
            if (found) return found;
          } else {
            const found = document.querySelector(part);
            if (found) return found;
          }
        }
        return null;
      }
      const el = findEl(${JSON.stringify(selector)});
      if (!el) return false;
      el.scrollIntoView({ block: 'center' });
      el.click();
      return true;
    })()`);
  }

  async fill(selector, value) {
    return this.eval(`(() => {
      function findEl(sel) {
        for (const part of sel.split(',').map(s => s.trim())) {
          const found = document.querySelector(part);
          if (found) return found;
        }
        return null;
      }
      const el = findEl(${JSON.stringify(selector)});
      if (!el) return false;
      el.focus();
      const proto = el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) {
        setter.call(el, ${JSON.stringify(value)});
      } else {
        el.value = ${JSON.stringify(value)};
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
  }

  async text(selector) {
    return this.eval(`(() => {
      function findEl(sel) {
        for (const part of sel.split(',').map(s => s.trim())) {
          const found = document.querySelector(part);
          if (found) return found;
        }
        return null;
      }
      const el = findEl(${JSON.stringify(selector)});
      return el ? (el.innerText || el.textContent) : null;
    })()`);
  }

  async exists(selector) {
    return this.eval(`(() => {
      for (const part of ${JSON.stringify(selector)}.split(',').map(s => s.trim())) {
        if (part.includes(':has-text(')) {
          const [tag, textWithParen] = part.split(':has-text(');
          const targetText = textWithParen.replace(/["')]/g, '').trim();
          const candidates = Array.from(document.querySelectorAll(tag || '*'));
          if (candidates.some(c => (c.innerText || c.textContent || '').includes(targetText))) return true;
        } else if (document.querySelector(part)) {
          return true;
        }
      }
      return false;
    })()`);
  }

  async getLocalStorage(key) {
    return this.eval(`localStorage.getItem(${JSON.stringify(key)})`);
  }

  async setLocalStorage(key, value) {
    return this.eval(`localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(value)})`);
  }

  async clearLocalStorage() {
    return this.eval(`(() => {
      try { localStorage.clear(); return true; } catch (e) { return false; }
    })()`);
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
      return outputPath;
    }
    return null;
  }

  async close() {
    try {
      if (this.ws) this.ws.close();
      if (this.chrome) this.chrome.kill();
    } catch (e) {}
  }
}
