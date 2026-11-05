import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('sort-test-init')) return;
    sessionStorage.setItem('sort-test-init', '1');
    ['zh-srs-v1', 'zh-srs-settings', 'zh-srs-newlog', 'zh-mydeck-v1', 'zh-mydeck-v2', 'zh-sort-hide']
      .forEach(k => localStorage.removeItem(k));
  });
});

const decks = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('zh-mydeck-v2') || 'null'));

test.describe('Sorting words into a deck', () => {

  test('the setup screen picks a target and a source', async ({ page }) => {
    await page.goto('/cards/sort');
    await expect(page.locator('#setup')).toBeVisible();
    await expect(page.locator('#to-pick option').first()).toContainText('Моя колода');
    await page.selectOption('#from-pick', 'theme:food');
    await page.click('#start');
    await expect(page.locator('#deal')).toBeVisible();
    await expect(page).toHaveURL(/from=theme%3Afood/);
    await expect(page.locator('#sort-progress')).toHaveText(/^1 \/ \d+$/);
  });

  test('"учить" adds to the deck, "не сейчас" is remembered', async ({ page }) => {
    await page.goto('/cards/sort?to=d1&from=theme:food');
    const first = await page.locator('#s-zh').textContent();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#sort-progress')).toHaveText(/^2 \//);
    const second = await page.locator('#s-zh').textContent();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#sort-progress')).toHaveText(/^3 \//);

    const st = await decks(page);
    expect(st.decks[0].ids).toHaveLength(1);
    expect(st.decks[0].skip).toHaveLength(1);

    // Coming back, neither word is offered again.
    await page.goto('/cards/sort?to=d1&from=theme:food');
    const now = await page.locator('#s-zh').textContent();
    expect([first, second]).not.toContain(now);
  });

  test('undo takes the last decision back', async ({ page }) => {
    await page.goto('/cards/sort?to=d1&from=theme:food');
    const first = await page.locator('#s-zh').textContent();
    await page.click('#btn-yes');
    await expect(page.locator('#sort-progress')).toHaveText(/^2 \//);
    await page.click('#undo');
    await expect(page.locator('#s-zh')).toHaveText(first!);
    expect((await decks(page)).decks[0].ids).toHaveLength(0);
  });

  test('a swipe right adds the card', async ({ page }) => {
    await page.goto('/cards/sort?to=d1&from=theme:food');
    const box = (await page.locator('#scard').boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width / 2, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 100, y, { steps: 5 });
    await page.mouse.move(box.x + box.width - 5 + 100, y, { steps: 5 });
    await page.mouse.up();
    await expect(page.locator('#sort-progress')).toHaveText(/^2 \//);
    expect((await decks(page)).decks[0].ids).toHaveLength(1);
  });

  test('a new deck can be created from the setup screen', async ({ page }) => {
    await page.goto('/cards/sort');
    await page.selectOption('#to-pick', '__new');
    await page.fill('#new-name', 'Еда');
    await page.selectOption('#from-pick', 'theme:food');
    await page.click('#start');
    await page.keyboard.press('2');
    await expect(page.locator('#route')).toContainText('Еда');
    const st = await decks(page);
    const food = st.decks.find((d: any) => d.name === 'Еда');
    expect(food.ids).toHaveLength(1);
  });

  test('the summary counts what was sorted', async ({ page }) => {
    await page.goto('/cards/sort?to=d1&from=theme:food');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.click('#finish');
    await expect(page.locator('#summary')).toBeVisible();
    await expect(page.locator('#sum-text')).toContainText('Добавлено в «Моя колода»: 1');
    await expect(page.locator('#sum-text')).toContainText('Отложено: 1');
    await expect(page.locator('#sum-study')).toHaveAttribute('href', /study\?deck=my%3Ad1/);
  });

  test('reviewing a deck against itself prunes it', async ({ page }) => {
    await page.goto('/cards/sort?to=d1&from=theme:food');
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#sort-progress')).toHaveText(new RegExp(`^${i + 2} /`));
    }
    await page.goto('/cards/sort?to=d1&from=my:d1');
    await expect(page.locator('#no-label')).toHaveText('Убрать');
    await expect(page.locator('#sort-progress')).toHaveText('1 / 3');
    await page.keyboard.press('ArrowLeft');   // remove the first
    await expect(page.locator('#sort-progress')).toHaveText('2 / 3');
    expect((await decks(page)).decks[0].ids).toHaveLength(2);
    await page.keyboard.press('z');           // and put it back where it was
    await expect(page.locator('#sort-progress')).toHaveText('1 / 3');
    expect((await decks(page)).decks[0].ids).toHaveLength(3);
  });

  test('the translation can be hidden until tapped', async ({ page }) => {
    await page.goto('/cards/sort?to=d1&from=theme:food');
    await page.check('#hide-meaning');
    await expect(page.locator('#s-meaning')).toBeHidden();
    await page.click('#s-zh');
    await expect(page.locator('#s-meaning')).toBeVisible();
  });

  test('the deck pages link to sorting', async ({ page }) => {
    await page.goto('/cards');
    await expect(page.locator('#my-decks .sort-tile')).toBeVisible();
    await page.goto('/cards/my');
    await expect(page.locator('#sort')).toHaveAttribute('href', /sort\?to=d1/);
  });
});
