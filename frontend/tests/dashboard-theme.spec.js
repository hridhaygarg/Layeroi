import { test, expect } from '@playwright/test';

const getBodyBg = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const getTheme = (page) => page.evaluate(() => document.documentElement.getAttribute('data-theme'));

// Helper: sign up + get auth token in localStorage
async function signUpAndAuth(page) {
  const ts = Date.now();
  await page.goto('https://layeroi.com/signup');
  await page.waitForTimeout(2000);
  await page.fill('input[name="name"]', 'Dashboard Theme');
  await page.fill('input[name="email"]', `test+dashtheme${ts}@layeroi.com`);
  await page.fill('input[name="company"]', 'DashTheme Co');
  await page.fill('input[name="password"]', 'testpass123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
}

test('dashboard overview — dark mode screenshot + regression', async ({ page }) => {
  await signUpAndAuth(page);
  await page.goto('https://layeroi.com/dashboard');
  await page.waitForTimeout(3000);

  // Ensure dark
  await page.locator('button[title="Dark"]').first().click();
  await page.waitForTimeout(500);

  const bg = await getBodyBg(page);
  const rgb = bg.match(/\d+/g).map(Number);
  console.log('Overview dark bg:', bg);
  expect(rgb[0]).toBeLessThan(30); // dark

  await page.screenshot({ path: 'tests/theme-screenshots/overview-dark.png', fullPage: true });
});

test('dashboard overview — light mode screenshot + contrast', async ({ page }) => {
  await signUpAndAuth(page);
  await page.goto('https://layeroi.com/dashboard');
  await page.waitForTimeout(3000);

  // Switch to light
  await page.locator('button[title="Light"]').first().click();
  await page.waitForTimeout(500);

  const bg = await getBodyBg(page);
  const rgb = bg.match(/\d+/g).map(Number);
  console.log('Overview light bg:', bg);
  expect(rgb[0]).toBeGreaterThan(200); // light

  await page.screenshot({ path: 'tests/theme-screenshots/overview-light.png', fullPage: true });
});

test('dashboard reports — dark mode screenshot', async ({ page }) => {
  await signUpAndAuth(page);
  // Navigate to reports via URL
  await page.goto('https://layeroi.com/reports');
  await page.waitForTimeout(3000);

  await page.locator('button[title="Dark"]').first().click();
  await page.waitForTimeout(500);

  const bg = await getBodyBg(page);
  const rgb = bg.match(/\d+/g).map(Number);
  console.log('Reports dark bg:', bg);
  expect(rgb[0]).toBeLessThan(30);

  await page.screenshot({ path: 'tests/theme-screenshots/reports-dark.png', fullPage: true });
});

test('dashboard reports — light mode screenshot', async ({ page }) => {
  await signUpAndAuth(page);
  await page.goto('https://layeroi.com/reports');
  await page.waitForTimeout(3000);

  await page.locator('button[title="Light"]').first().click();
  await page.waitForTimeout(500);

  const bg = await getBodyBg(page);
  const rgb = bg.match(/\d+/g).map(Number);
  console.log('Reports light bg:', bg);
  expect(rgb[0]).toBeGreaterThan(200);

  await page.screenshot({ path: 'tests/theme-screenshots/reports-light.png', fullPage: true });
});
