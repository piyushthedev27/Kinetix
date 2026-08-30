/**
 * Kinetix Landing Page Screenshot Script
 * 
 * Scrolls through every section, waits for animations to finish,
 * then captures a clean screenshot of each.
 * 
 * Usage:  node scripts/screenshot-landing.mjs
 * Requires: puppeteer (npm install --save-dev puppeteer)
 */

import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'screenshots');

const SECTIONS = [
  { name: '01-hero-top',          selector: '.kinetic-hero',             wait: 1500 },
  { name: '02-hero-mid-scroll',   scroll: 800,                           wait: 2000 },
  { name: '03-hero-bottom',       scroll: 1600,                          wait: 2000 },
  { name: '04-story-section',     selector: '#story',                    wait: 2000 },
  { name: '05-bridge-section',    selector: '.bridge-section',           wait: 2000 },
  { name: '06-insight-section',   selector: '.insight-section',          wait: 2000 },
  { name: '07-roadmap-experiments', selector: '#experiments',           wait: 2000 },
  { name: '08-prediction',        selector: '.prediction-section',       wait: 2000 },
  { name: '09-score-rings',       selector: '.physics-score-section',    wait: 2500 },
  { name: '10-theory-reality',    selector: '.theory-reality-section',   wait: 2500 },
  { name: '11-replay',            selector: '.replay-section',           wait: 2000 },
  { name: '12-lab-report',        selector: '.lab-report-section',       wait: 2000 },
  { name: '13-final-cta',         selector: '.final-field',              wait: 1500 },
];

const URL = process.argv[2] || 'http://localhost:3000';
const VIEWPORT = { width: 1440, height: 900 };

async function waitForAnimationsIdle(page, timeout = 2000) {
  await page.evaluate((ms) => {
    return new Promise((resolve) => {
      const pending = document.getAnimations?.() || [];
      const cssDone = pending.length > 0
        ? Promise.allSettled(pending.map(a => a.finished))
        : Promise.resolve();

      cssDone.then(() => {
        let frames = 0;
        const TARGET = 6;
        function tick() {
          frames++;
          if (frames >= TARGET) {
            resolve();
          } else {
            requestAnimationFrame(tick);
          }
        }
        requestAnimationFrame(tick);
      });

      setTimeout(resolve, ms);
    });
  }, timeout);
}

import { existsSync } from 'fs';

function findSystemBrowser() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ];
  for (const path of candidates) {
    if (path && existsSync(path)) {
      return path;
    }
  }
  return undefined;
}

(async () => {
  await mkdir(OUT_DIR, { recursive: true });

  const executablePath = findSystemBrowser();
  console.log('Launching browser...', executablePath ? `(using ${executablePath})` : '');
  
  const launchOptions = {
    headless: 'new',
    defaultViewport: VIEWPORT,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();
  
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'no-preference' },
    { name: 'prefers-color-scheme',   value: 'light' },
  ]);

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });

  console.log('Waiting for initial animations...');
  await new Promise(r => setTimeout(r, 2000));
  await waitForAnimationsIdle(page, 3000);

  console.log(`Capturing ${SECTIONS.length} sections...\n`);

  for (const section of SECTIONS) {
    if (section.selector) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, section.selector);
    } else {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), section.scroll);
    }
    await new Promise(r => setTimeout(r, 400));
    await new Promise(r => setTimeout(r, section.wait));
    await waitForAnimationsIdle(page, 2000);

    const path = resolve(OUT_DIR, `${section.name}.png`);
    await page.screenshot({ path, fullPage: false });
    console.log(`  Done: ${section.name}.png`);
  }

  console.log('\nCapturing full-page screenshot...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await waitForAnimationsIdle(page, 2000);
  
  const fullPath = resolve(OUT_DIR, 'full-page.png');
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`  Done: full-page.png`);

  await browser.close();
  console.log(`\nAll done! Screenshots saved to: ${OUT_DIR}`);
})();
