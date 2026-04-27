import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page accessibility — dark mode', async ({ page }) => {
  await page.goto('https://layeroi.com');
  await page.waitForTimeout(3000);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  console.log(`Accessibility (dark): ${results.passes.length} passes, ${results.violations.length} violations`);
  if (results.violations.length > 0) {
    results.violations.forEach(v => {
      console.log(`  ⚠ ${v.impact}: ${v.description} (${v.nodes.length} instances)`);
    });
  }

  // Allow minor/moderate but block serious/critical
  const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.length).toBe(0);
});

test('landing page accessibility — light mode', async ({ page }) => {
  await page.goto('https://layeroi.com');
  await page.waitForTimeout(2000);
  await page.locator('button[title="Light"]').first().click();
  await page.waitForTimeout(500);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  console.log(`Accessibility (light): ${results.passes.length} passes, ${results.violations.length} violations`);
  if (results.violations.length > 0) {
    results.violations.forEach(v => {
      console.log(`  ⚠ ${v.impact}: ${v.description} (${v.nodes.length} instances)`);
    });
  }

  const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.length).toBe(0);
});
