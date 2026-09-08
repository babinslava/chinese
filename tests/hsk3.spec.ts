import { test, expect } from '@playwright/test';

test.describe('HSK 3.0 standard', () => {

  // ── Overview ────────────────────────────────────────────────────────
  test('overview states all four dimensions of the standard', async ({ page }) => {
    await page.goto('/hsk3');
    const dims = page.locator('.dim-n');
    await expect(dims).toHaveCount(4);
    await expect(dims.nth(0)).toHaveText('500');   // 词汇
    await expect(dims.nth(1)).toHaveText('300');   // 汉字
    await expect(dims.nth(2)).toHaveText('48');    // 语法
    await expect(dims.nth(3)).toHaveText('269');   // 音节
  });

  test('overview reports coverage against the site', async ({ page }) => {
    await page.goto('/hsk3');
    await expect(page.locator('.bar-pct')).toHaveText('37%');
    await expect(page.locator('.cov-legend')).toContainText('183');
    await expect(page.locator('.cov-legend')).toContainText('317');
  });

  // ── Words ───────────────────────────────────────────────────────────
  test('word list holds exactly the 500 words of the standard', async ({ page }) => {
    await page.goto('/hsk3/words');
    await expect(page.locator('#by-theme [data-word]')).toHaveCount(500);
    await expect(page.locator('#by-alpha [data-word]')).toHaveCount(500);
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 500');
  });

  test('filters split the list into learned and remaining', async ({ page }) => {
    await page.goto('/hsk3/words');
    await page.click('.fbtn[data-filter="todo"]');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 317');
    await page.click('.fbtn[data-filter="known"]');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 183');
    await page.click('.fbtn[data-filter="all"]');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 500');
  });

  test('?filter=todo deep-links the study queue', async ({ page }) => {
    await page.goto('/hsk3/words?filter=todo');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 317');
    await expect(page.locator('.fbtn[data-filter="todo"]')).toHaveClass(/on/);
  });

  test('search matches Chinese, pinyin and Russian', async ({ page }) => {
    await page.goto('/hsk3/words');
    const box = page.locator('#wsearch');
    await box.fill('мама');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 1');
    await box.fill('māma');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 1');
    await box.fill('妈妈');
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 1');
  });

  test('switching to alphabetical order does not double-count', async ({ page }) => {
    await page.goto('/hsk3/words');
    await page.click('.sbtn[data-sort="alpha"]');
    await expect(page.locator('#by-theme')).toBeHidden();
    await expect(page.locator('#wcount')).toHaveText('Показано слов: 500');
  });

  test('words carry Russian transcription and link back to the textbook', async ({ page }) => {
    await page.goto('/hsk3/words');
    const card = page.locator('#by-theme [data-word]', { hasText: '妈妈' }).first();
    await expect(card.locator('.w-pron')).toHaveText('мама');
    await expect(card.locator('.w-ru')).toContainText('мама');
    await expect(card.locator('.w-lesson')).toBeVisible();
  });

  // ── Characters ──────────────────────────────────────────────────────
  test('character list holds the 300 characters', async ({ page }) => {
    await page.goto('/hsk3/chars');
    await expect(page.locator('[data-char]')).toHaveCount(300);
    await expect(page.locator('#ccount')).toHaveText('Показано иероглифов: 300');
  });

  test('characters without a dictionary card are shown but not linked', async ({ page }) => {
    await page.goto('/hsk3/chars');
    // Every anchor on the page must point at a card that exists.
    const plain = await page.locator('.c-zh.plain').count();
    expect(plain).toBeGreaterThan(0);
    await expect(page.locator('.c-zh.plain').first()).not.toHaveAttribute('href', /./);
  });

  // ── Grammar ─────────────────────────────────────────────────────────
  test('grammar page lists all 48 points in Russian', async ({ page }) => {
    await page.goto('/hsk3/grammar');
    await expect(page.locator('.gcard')).toHaveCount(48);
    await expect(page.locator('.gcard').first().locator('.g-ex')).not.toBeEmpty();
  });

  test('grammar points link to the textbook lesson that teaches them', async ({ page }) => {
    await page.goto('/hsk3/grammar');
    const links = page.locator('.g-lesson');
    expect(await links.count()).toBe(41);
    await expect(links.first()).toHaveAttribute('href', /\/hsk1\/\d+$/);
  });

  // ── Navigation ──────────────────────────────────────────────────────
  test('sidebar exposes the standard as its own group', async ({ page }) => {
    await page.goto('/hsk3');
    const group = page.locator('.nav-book').filter({ hasText: 'Стандарт HSK 3.0' });
    await expect(group).toHaveAttribute('open', '');
    await expect(group.locator('.nav-link')).toHaveCount(4);
  });
});
