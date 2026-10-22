import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';

mkdirSync('artifacts', { recursive: true });

const edge =
  process.env.BROWSER_PATH ||
  [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].find((candidate) => existsSync(candidate));
if (!edge) throw new Error('未找到 Edge/Chrome。请设置 BROWSER_PATH 后重试。');
const base = process.env.APP_URL || 'http://127.0.0.1:3001';
const errors = [];
const browser = await chromium.launch({ executablePath: edge, headless: true });

async function makePage(viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return { context, page };
}

const desktop = await makePage({ width: 1440, height: 1000 });
await desktop.page.goto(base, { waitUntil: 'networkidle' });
await desktop.page.screenshot({ path: 'artifacts/verify-home.png' });
console.log('home title:', await desktop.page.title());
console.log('track cards:', await desktop.page.locator('.track-card').count());
console.log('home scroll:', await desktop.page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
})));

await desktop.page.goto(`${base}/tracks/cpp`, { waitUntil: 'networkidle' });
console.log('track modules:', await desktop.page.locator('.module-card').count());
await desktop.page.screenshot({ path: 'artifacts/verify-track.png' });

await desktop.page.goto(`${base}/problems`, { waitUntil: 'networkidle' });
console.log('problem rows:', await desktop.page.locator('.problem-table-row').count());
await desktop.page.screenshot({ path: 'artifacts/verify-problems.png' });

await desktop.page.goto(`${base}/problems/cpp-start-01`, { waitUntil: 'networkidle' });
await desktop.page.waitForSelector('.cm-content');
console.log('editor ready:', await desktop.page.locator('.cm-content').count());
await desktop.page.screenshot({ path: 'artifacts/verify-workspace.png' });

await desktop.page.locator('.cm-content').click();
await desktop.page.keyboard.press('Control+A');
await desktop.page.waitForTimeout(900);
console.log('selection card:', await desktop.page.locator('.selection-card').count());
await desktop.page.screenshot({ path: 'artifacts/verify-selection.png' });
await desktop.page.keyboard.press('Escape');

await desktop.page.getByRole('button', { name: '运行', exact: true }).click();
await desktop.page.waitForTimeout(6000);
console.log('run verdict text:', await desktop.page.locator('.result-summary').first().innerText().catch(() => 'none'));
await desktop.page.screenshot({ path: 'artifacts/verify-run.png' });

await desktop.page.getByRole('button', { name: '调试', exact: true }).click();
await desktop.page.waitForSelector('.debug-controls', { timeout: 60000 });
console.log('debug steps:', await desktop.page.locator('.debug-controls .tag').innerText());
await desktop.page.screenshot({ path: 'artifacts/verify-debug.png' });

await desktop.page.getByRole('button', { name: '提交', exact: true }).click();
await desktop.page.waitForSelector('.submit-summary', { timeout: 60000 });
console.log('submit verdict:', await desktop.page.locator('.big-verdict').innerText());
await desktop.page.screenshot({ path: 'artifacts/verify-submit.png' });

await desktop.page.goto(`${base}/notes`, { waitUntil: 'networkidle' });
console.log('notes page heading:', await desktop.page.locator('h1').first().innerText());
await desktop.page.goto(`${base}/contact`, { waitUntil: 'networkidle' });
console.log('contact email:', await desktop.page.locator('.contact-email-card strong').innerText());
await desktop.page.goto(`${base}/sponsor`, { waitUntil: 'networkidle' });
console.log('sponsor qr:', await desktop.page.locator('.sponsor-qr').isVisible());
await desktop.page.screenshot({ path: 'artifacts/verify-contact.png' });

const mobile = await makePage({ width: 390, height: 844 });
await mobile.page.goto(base, { waitUntil: 'networkidle' });
console.log('mobile home scroll:', await mobile.page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  menuDisplay: getComputedStyle(document.querySelector('.mobile-menu-btn')).display,
})));
await mobile.page.screenshot({ path: 'artifacts/verify-home-mobile.png' });

await mobile.page.goto(`${base}/problems/cpp-start-01`, { waitUntil: 'networkidle' });
console.log('mobile workspace scroll:', await mobile.page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  tabs: [...document.querySelectorAll('.mobile-workspace-tabs button')].map((button) => ({
    text: button.textContent,
    rect: button.getBoundingClientRect().toJSON(),
  })),
})));
await mobile.page.getByRole('button', { name: '代码', exact: true }).click();
await mobile.page.waitForSelector('.cm-content');
await mobile.page.screenshot({ path: 'artifacts/verify-workspace-mobile.png' });
console.log('mobile code visible:', await mobile.page.locator('.cm-content').isVisible());
await mobile.page.getByRole('button', { name: '运行', exact: true }).first().click();
await mobile.page.waitForTimeout(5000);
console.log('mobile console visible:', await mobile.page.locator('.console-pane').isVisible());
await mobile.page.screenshot({ path: 'artifacts/verify-console-mobile.png' });

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
