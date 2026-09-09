import { test, expect } from '@playwright/test';

// Every test starts from a clean slate: both the schedule and the personal
// deck live in localStorage.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    ['zh-srs-v1', 'zh-srs-settings', 'zh-srs-newlog',
     'zh-mydeck-v1', 'zh-mydeck-v2'].forEach(k => localStorage.removeItem(k));
  });
});

test.describe('Flashcards', () => {

  // ── Deck list ───────────────────────────────────────────────────────
  test('deck list shows every deck and an empty personal deck', async ({ page }) => {
    await page.goto('/cards');
    await expect(page.locator('#my-decks .deck.mine')).toHaveCount(1);
    await expect(page.locator('#my-decks .deck.mine')).toContainText('пусто');
    // 18 themes + todo + 15 lessons + radicals
    await expect(page.locator('[data-deck]')).toHaveCount(35);
  });

  test('everything starts as new, nothing due', async ({ page }) => {
    await page.goto('/cards');
    const totals = page.locator('#totals');
    await expect(totals).toContainText('560');
    await expect(totals.locator('.t').first()).toContainText('0'); // к повторению
  });

  // ── Studying ────────────────────────────────────────────────────────
  test('a card flips and can be graded', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await expect(page.locator('#grades')).toBeHidden();
    await expect(page.locator('#back')).toBeHidden();
    await page.click('#card');
    await expect(page.locator('#grades')).toBeVisible();
    await expect(page.locator('#back')).toBeVisible();
    await page.click('.g.good');
    await expect(page.locator('#grades')).toBeHidden(); // next card, face down
  });

  test('grading schedules the card for a future day', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await page.click('#card');
    await page.click('.g.good');
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('zh-srs-v1') || '{}'));
    const entries = Object.values(state) as any[];
    expect(entries).toHaveLength(1);
    expect(entries[0].n).toBe(1);
    expect(entries[0].iv).toBe(1);
    expect(entries[0].due).toBeGreaterThan(Date.now());
  });

  test('"Снова" puts the card back into the same session', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    const before = await page.locator('#card-progress').textContent();
    await page.click('#card');
    await page.click('.g.again');
    // Card returns to the queue, so the remaining count does not drop.
    await expect(page.locator('#card-progress')).toHaveText(before!);
  });

  test('keyboard drives the session', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await page.keyboard.press('Space');
    await expect(page.locator('#grades')).toBeVisible();
    await page.keyboard.press('3'); // Хорошо
    await expect(page.locator('#grades')).toBeHidden();
  });

  test('the counter does not write into the layout scroll bar', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await expect(page.locator('#card-progress')).toContainText('Осталось');
    await expect(page.locator('#progress')).toBeEmpty();
  });

  test('modes switch what the front of the card shows', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await expect(page.locator('#front .f-zh')).toBeVisible();
    await page.click('.mbtn[data-mode="ru-zh"]');
    await expect(page.locator('#front .f-ru')).toBeVisible();
    await page.click('.mbtn[data-mode="audio"]');
    await expect(page.locator('#front .f-audio')).toBeVisible();
  });

  // ── Personal deck ───────────────────────────────────────────────────
  test('starring a word adds it to the personal deck', async ({ page }) => {
    await page.goto('/hsk3/words');
    const star = page.locator('[data-star]').first();
    const id = await star.getAttribute('data-star');
    await star.click();
    await expect(star).toHaveClass(/on/);
    expect(await page.evaluate(() => MyDeck.ids())).toEqual([id]);
    // and clicking again removes it
    await star.click();
    expect(await page.evaluate(() => MyDeck.ids())).toEqual([]);
  });

  test('starred words show up in the personal deck and can be studied', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-mydeck-v2', JSON.stringify({
        active: 'a', decks: [{ id: 'a', name: 'Моя колода', ids: ['w:茶:chá', 'w:包子:bāozi'] }],
      }));
    });
    await page.goto('/cards/my');
    await expect(page.locator('#count')).toHaveText('2');
    await expect(page.locator('.mcard')).toHaveCount(2);

    await page.goto('/cards/study?deck=my');
    await expect(page.locator('.deck-name')).toHaveText('Моя колода');
    await expect(page.locator('#card-progress')).toHaveText('Осталось: 2');
  });

  test('a word can be removed from the personal deck', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-mydeck-v2', JSON.stringify({
        active: 'a', decks: [{ id: 'a', name: 'Моя колода', ids: ['w:茶:chá', 'w:包子:bāozi'] }],
      }));
    });
    await page.goto('/cards/my');
    await page.locator('.mcard .rm').first().click();
    await expect(page.locator('.mcard')).toHaveCount(1);
    await expect(page.locator('#count')).toHaveText('1');
  });

  test('an empty personal deck explains how to fill it', async ({ page }) => {
    await page.goto('/cards/study?deck=my');
    await expect(page.locator('#empty-title')).toHaveText('Моя колода пуста');
    await expect(page.locator('#card-area')).toBeHidden();
  });

  test('the personal deck exports as CSV', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-mydeck-v2', JSON.stringify({
        active: 'a', decks: [{ id: 'a', name: 'Еда', ids: ['w:茶:chá'] }],
      }));
    });
    await page.goto('/cards/my');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#export'),
    ]);
    // The file is named after the deck.
    expect(download.suggestedFilename()).toBe('Еда.csv');
  });

  // ── Tone drill ──────────────────────────────────────────────────────
  test('tone mode asks for a tone per syllable and grades itself', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await page.click('.mbtn[data-mode="tone"]');
    await expect(page.locator('#tone-quiz')).toBeVisible();
    await expect(page.locator('#grades')).toBeHidden();     // graded automatically
    await expect(page.locator('.f-toneless')).toHaveText('bao zi');
    await expect(page.locator('.tq-row')).toHaveCount(2);

    // 包子 is bāozi: first tone, then neutral
    await page.locator('.tq-row').nth(0).locator('.tq-t[data-t="1"]').click();
    await page.locator('.tq-row').nth(1).locator('.tq-t[data-t="5"]').click();
    await expect(page.locator('#tq-hint .ok')).toHaveText('верно');
  });

  test('a wrong tone shows the right answer', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    await page.click('.mbtn[data-mode="tone"]');
    await page.locator('.tq-row').nth(0).locator('.tq-t[data-t="4"]').click();
    await page.locator('.tq-row').nth(1).locator('.tq-t[data-t="4"]').click();
    await expect(page.locator('#tq-hint .no')).toContainText('bāozi');
  });

  // ── Daily new-card cap ──────────────────────────────────────────────
  test('the daily cap limits how many new cards a session starts', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-srs-settings', JSON.stringify({ newPerDay: 5 }));
    });
    await page.goto('/cards/study?deck=theme:food'); // 21 cards, all new
    await expect(page.locator('#card-progress')).toHaveText('Осталось: 5');
  });

  test('the cap can be turned off', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-srs-settings', JSON.stringify({ newPerDay: 0 }));
    });
    await page.goto('/cards/study?deck=theme:food');
    await expect(page.locator('#card-progress')).toHaveText('Осталось: 21');
  });

  test('the deck list exposes the cap and today\'s usage', async ({ page }) => {
    await page.goto('/cards');
    await expect(page.locator('#new-per-day')).toHaveValue('20');
    await expect(page.locator('#new-note')).toContainText('сегодня начато 0 из 20');
  });

  // ── Named personal decks ────────────────────────────────────────────
  test('the old flat list migrates into a named deck', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('zh-mydeck-v2');
      localStorage.setItem('zh-mydeck-v1', JSON.stringify(['w:茶:chá', 'w:包子:bāozi']));
    });
    await page.goto('/cards/my');
    const state = await page.evaluate(() => MyDeck.load());
    expect(state.decks).toHaveLength(1);
    expect(state.decks[0].name).toBe('Моя колода');
    expect(state.decks[0].ids).toHaveLength(2);
  });

  test('decks are independent and ★ targets the active one', async ({ page }) => {
    await page.goto('/cards/my');
    await page.evaluate(() => {
      MyDeck.addMany(['w:茶:chá']);
      MyDeck.create('Глаголы');
      MyDeck.addMany(['w:吃:chī', 'w:喝:hē']);
    });
    const state = await page.evaluate(() => MyDeck.load());
    expect(state.decks.map((d: any) => d.ids.length)).toEqual([1, 2]);
    expect(await page.evaluate(() => MyDeck.activeDeck().name)).toBe('Глаголы');
  });

  test('the deck list shows every personal deck', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-mydeck-v2', JSON.stringify({
        active: 'a',
        decks: [{ id: 'a', name: 'Первая', ids: ['w:茶:chá'] },
                { id: 'b', name: 'Вторая', ids: [] }],
      }));
    });
    await page.goto('/cards');
    await expect(page.locator('#my-decks .deck.mine')).toHaveCount(2);
    await expect(page.locator('#my-decks .badge')).toHaveText('активная');
  });

  test('a named deck can be studied by id', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('zh-mydeck-v2', JSON.stringify({
        active: 'a',
        decks: [{ id: 'a', name: 'Первая', ids: ['w:茶:chá', 'w:包子:bāozi'] }],
      }));
    });
    await page.goto('/cards/study?deck=my:a');
    await expect(page.locator('.deck-name')).toHaveText('Первая');
    await expect(page.locator('#card-progress')).toHaveText('Осталось: 2');
  });

  // ── Card data ───────────────────────────────────────────────────────
  test('homographs are separate cards, cross-source spellings are not', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:verb');
    const cards = await page.evaluate(() =>
      JSON.parse(document.getElementById('card-data')!.textContent!).cards);
    const gan = cards.filter((c: any) => c.zh === '干');
    expect(gan.map((c: any) => c.py).sort()).toEqual(['gān', 'gàn']);
    // 上 is spelt shàng by the standard and shang by the textbook — one card.
    expect(cards.filter((c: any) => c.zh === '上' && c.py)).toHaveLength(1);
  });
});
