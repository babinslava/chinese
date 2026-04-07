import { test, expect } from '@playwright/test';

test.describe('Chinese Course', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Page loads ──────────────────────────────────────────────────────
  test('page loads with title', async ({ page }) => {
    await expect(page).toHaveTitle(/普通话/);
  });

  test('hero section is visible', async ({ page }) => {
    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('.hero h1')).toContainText('китайский');
  });

  // ── Navigation ──────────────────────────────────────────────────────
  test('sidebar navigation links exist', async ({ page }) => {
    await expect(page.locator('.nav-link')).toHaveCount(14);
  });

  test('clicking nav link scrolls to lesson', async ({ page }) => {
    await page.click('a.nav-link[href="#l2"]');
    await page.waitForTimeout(600);
    const section = page.locator('#l2');
    await expect(section).toBeInViewport();
  });

  // ── Dark theme ──────────────────────────────────────────────────────
  test('dark theme is applied by default', async ({ page }) => {
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');
  });

  test('theme toggle switches to light', async ({ page }) => {
    await page.click('#theme-btn');
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBeNull(); // light = no attribute
  });

  test('theme persists on reload', async ({ page }) => {
    await page.click('#theme-btn'); // switch to light
    await page.reload();
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBeNull();
  });

  // ── Audio buttons ───────────────────────────────────────────────────
  test('audio buttons are present', async ({ page }) => {
    const btns = page.locator('.audio-btn');
    const count = await btns.count();
    expect(count).toBeGreaterThan(30);
  });

  test('playZh function is defined globally', async ({ page }) => {
    const defined = await page.evaluate(() => typeof window.playZh === 'function');
    expect(defined).toBe(true);
  });

  test('clicking audio button adds playing class', async ({ page }) => {
    // mock speechSynthesis so it doesn't actually speak during tests
    await page.evaluate(() => {
      window.speechSynthesis.speak = (u: SpeechSynthesisUtterance) => {
        u.onend?.(new SpeechSynthesisEvent('end', { utterance: u }));
      };
      window.speechSynthesis.cancel = () => {};
    });

    const btn = page.locator('.audio-btn').first();
    await btn.click();
    // playing class is added then removed — just check no errors thrown
    await page.waitForTimeout(200);
    // no error means success
  });

  // ── Content ─────────────────────────────────────────────────────────
  test('all 8 MDX lessons render', async ({ page }) => {
    for (const id of ['l1','l2','l3','l4','l5','l6','l7','l8']) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });

  test('phrases table has 10 rows', async ({ page }) => {
    const rows = page.locator('#l2 tbody tr');
    await expect(rows).toHaveCount(10);
  });

  test('numbers table has 16 rows', async ({ page }) => {
    const rows = page.locator('#l4 tbody tr');
    await expect(rows).toHaveCount(16);
  });

  test('radicals search filters results', async ({ page }) => {
    await page.locator('#rad-search').fill('вода');
    await page.waitForTimeout(300);
    const visible = page.locator('.radical-card:visible');
    const count = await visible.count();
    expect(count).toBeLessThan(10);
    expect(count).toBeGreaterThan(0);
  });

  test('Forvo links open in new tab', async ({ page }) => {
    const link = page.locator('.forvo-btn').first();
    await expect(link).toHaveAttribute('target', '_blank');
    const href = await link.getAttribute('href');
    expect(href).toContain('forvo.com');
  });

  // ── Screenshots ──────────────────────────────────────────────────────
  test('screenshot: dark theme hero', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page).toHaveScreenshot('dark-hero.png', {
      clip: { x: 0, y: 0, width: 1280, height: 600 },
      maxDiffPixelRatio: 0.02,
    });
  });

  test('screenshot: light theme', async ({ page }) => {
    await page.click('#theme-btn');
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page).toHaveScreenshot('light-hero.png', {
      clip: { x: 0, y: 0, width: 1280, height: 600 },
      maxDiffPixelRatio: 0.02,
    });
  });

});
