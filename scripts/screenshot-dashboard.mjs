/**
 * Kinetix Dashboard & Experiment Pages Screenshot Script
 * 
 * Sets up a mock authentication context (via request interception & localStorage),
 * navigates through authenticated pages, and captures screenshots.
 * 
 * Usage:  node scripts/screenshot-dashboard.mjs
 * Requires: puppeteer (npm install --save-dev puppeteer)
 */

import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'screenshots', 'dashboard');

const PAGES = [
  { name: '01-dashboard-home',       path: '/app',                             wait: 2500 },
  { name: '02-experiments-library',  path: '/app/experiments',                 wait: 2000 },
  { name: '03-history-list',         path: '/app/history',                     wait: 2000 },
  { name: '04-history-detail',       path: '/app/history/kx-2408-017',         wait: 2500 },
  { name: '05-profile',              path: '/app/profile',                     wait: 2000 },
  { name: '06-settings',             path: '/app/settings',                    wait: 2000 },
  { name: '07-live-lab',             path: '/app/lab',                         wait: 2500 },
  { name: '08-experiment-setup',      path: '/experiment/projectile-motion/setup',      wait: 2000 },
  { name: '09-experiment-calibrate',  path: '/experiment/projectile-motion/calibrate',  wait: 2000 },
  { name: '10-experiment-capture',    path: '/experiment/projectile-motion/capture',    wait: 2500 },
  { name: '11-experiment-processing', path: '/experiment/projectile-motion/processing', wait: 2500 },
  { name: '12-experiment-replay',     path: '/experiment/projectile-motion/replay',     wait: 2500 },
  { name: '13-experiment-explain',    path: '/experiment/projectile-motion/explain',    wait: 2500 },
  { name: '14-experiment-compare',    path: '/experiment/projectile-motion/compare',    wait: 2500 },
];

const BASE_URL = process.argv[2] || 'http://localhost:3000';
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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  
  // Forward page console logs to system output
  page.on('console', msg => {
    console.log(`  [PAGE LOG] [${msg.type()}] ${msg.text()}`);
  });

  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'no-preference' },
    { name: 'prefers-color-scheme',   value: 'light' },
  ]);

  // Enable request interception to mock '/api/auth/me'
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/api/auth/me')) {
      console.log('  [Mock API] Intercepted /api/auth/me -> returning authenticated user');
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: "User fetched successfully",
          data: {
            id: 'student-001',
            name: 'Piyush',
            email: 'piyush270205@gmail.com'
          }
        })
      });
    } else {
      request.continue();
    }
  });

  // Navigate to login page first to establish localstorage context
  const initialUrl = `${BASE_URL}/auth/sign-in`;
  console.log(`Setting up localstorage at ${initialUrl}...`);
  await page.goto(initialUrl, { waitUntil: 'networkidle0', timeout: 60000 });
  
  await page.evaluate(() => {
    localStorage.setItem('kinetix_auth_token', 'mock-token-123-screenshot-run');
  });

  console.log(`\nCapturing ${PAGES.length} dashboard pages...\n`);

  for (const p of PAGES) {
    const targetUrl = `${BASE_URL}${p.path}`;
    console.log(`Navigating to ${targetUrl}...`);
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });
      
      // Wait for animations and layout
      await new Promise(r => setTimeout(r, p.wait));
      await waitForAnimationsIdle(page, 2000);

      const currentUrl = page.url();
      const pageTitle = await page.title();
      const bodyTextLength = await page.evaluate(() => document.body.innerText.length);
      console.log(`  Current page URL: ${currentUrl}`);
      console.log(`  Page Title: ${pageTitle}`);
      console.log(`  Body text length: ${bodyTextLength}`);

      const screenshotPath = resolve(OUT_DIR, `${p.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`  Saved: ${p.name}.png`);
    } catch (e) {
      console.error(`  Error capturing ${p.path}:`, e.message);
    }
  }

  await browser.close();
  console.log(`\nAll done! Screenshots saved to: ${OUT_DIR}`);
})();
