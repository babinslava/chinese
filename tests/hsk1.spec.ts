import { test, expect } from '@playwright/test';

test.describe('HSK 1 textbook', () => {

  // ── Index ───────────────────────────────────────────────────────────
  test('index lists all 15 lessons', async ({ page }) => {
    await page.goto('/hsk1');
    await expect(page).toHaveTitle(/Учебник HSK 1/);
    await expect(page.locator('.book-card')).toHaveCount(15);
  });

  test('index vocabulary table lists every new word', async ({ page }) => {
    await page.goto('/hsk1');
    const rows = page.locator('.lesson:last-of-type tbody tr');
    // The book introduces 171 new words across the 15 lessons.
    await expect(rows).toHaveCount(171);
  });

  // ── Lesson pages ────────────────────────────────────────────────────
  test('every lesson page renders its texts and new words', async ({ page }) => {
    for (let n = 1; n <= 15; n++) {
      await page.goto(`/hsk1/${n}`);
      await expect(page.locator('.text-card')).toHaveCount(3);
      await expect(page.locator('#words')).toBeAttached();
      await expect(page.locator('.scene svg')).toHaveCount(3);
    }
  });

  test('lesson 1 shows the dialogue in Chinese, pinyin and Russian', async ({ page }) => {
    await page.goto('/hsk1/1');
    const first = page.locator('.text-card').first();
    await expect(first.locator('.dialog-zh').first()).toContainText('你好');
    await expect(first.locator('.dialog-py').first()).toContainText('Nǐ hǎo');
    await expect(first.locator('.dialog-ru').first()).toContainText('Привет');
    await expect(first.locator('.dialog-en').first()).toContainText('Hello');
  });

  test('grammar notes render from lesson 3 onwards', async ({ page }) => {
    await page.goto('/hsk1/3');
    await expect(page.locator('#notes')).toBeAttached();
    await expect(page.locator('#exercises')).toBeAttached();
    await expect(page.locator('#warmup')).toBeAttached();
  });

  // ── Navigation ──────────────────────────────────────────────────────
  test('sidebar exposes the textbook as its own group', async ({ page }) => {
    await page.goto('/hsk1/1');
    // 15 lessons plus the table of contents.
    await expect(page.locator('.nav-book .nav-link')).toHaveCount(16);
    await expect(page.locator('.nav-book')).toHaveAttribute('open', '');
  });

  test('prev/next links walk the whole book', async ({ page }) => {
    await page.goto('/hsk1/1');
    await page.click('.bn.next');
    await expect(page).toHaveURL(/\/hsk1\/2$/);
    await page.click('.bn.prev');
    await expect(page).toHaveURL(/\/hsk1\/1$/);
  });

  // ── Vocabulary integration ──────────────────────────────────────────
  test('new words link to their vocabulary card', async ({ page }) => {
    await page.goto('/hsk1/1');
    await page.locator('#words ~ .table-wrap .w-link').first().click();
    await expect(page).toHaveURL(/\/vocab\//);
    await expect(page.locator('body')).toContainText('你');
  });

  test('audio buttons are wired up on lesson pages', async ({ page }) => {
    await page.goto('/hsk1/1');
    expect(await page.evaluate(() => typeof (window as any).playZh)).toBe('function');
    expect(await page.locator('.audio-btn').count()).toBeGreaterThan(10);
  });

  // ── Illustrations ───────────────────────────────────────────────────
  test('scene illustrations are inline and self-contained', async ({ page }) => {
    await page.goto('/hsk1/1');
    const scene = page.locator('.scene svg').first();
    await expect(scene).toBeVisible();
    // No external asset requests: the figures are drawn as inline paths.
    expect(await scene.locator('image').count()).toBe(0);
    expect(await scene.locator('.fig').count()).toBeGreaterThan(0);
  });
});
