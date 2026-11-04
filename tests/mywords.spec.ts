import { test, expect } from '@playwright/test';
import myWords from '../src/data/mywords.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    ['zh-srs-v1', 'zh-srs-settings', 'zh-srs-newlog'].forEach(k => localStorage.removeItem(k));
  });
});

test.describe('My words', () => {
  test('the page lists every word, reachable from the sidebar', async ({ page }) => {
    await page.goto('/');
    await page.click('#sidebar a.nav-link:has-text("Мои слова")');
    await expect(page).toHaveURL(/\/words\/?$/);
    await expect(page.locator('.mword')).toHaveCount(myWords.length);
    await expect(page.locator('.mword', { hasText: '售票员' })).toContainText('shòupiàoyuán');
  });

  test('search matches pinyin without tone marks', async ({ page }) => {
    await page.goto('/words');
    await page.fill('#msearch', 'gaoxing');
    await expect(page.locator('.mword:visible')).toHaveCount(1);
    await expect(page.locator('.mword:visible')).toContainText('很高兴见到你');
    await page.fill('#msearch', 'нет такого слова');
    await expect(page.locator('#mempty')).toBeVisible();
  });

  test('the words form their own flashcard deck', async ({ page }) => {
    await page.goto('/words');
    await page.click('text=Учить карточками');
    await expect(page.locator('#deck-name')).toHaveText('Мои слова');
    await expect(page.locator('#card-progress')).toHaveText(`Осталось: ${Math.min(myWords.length, 20)}`);
    await expect(page.locator('.f-zh')).toHaveText(myWords[0].zh);
  });

  test('家 keeps its measure-word meaning, apart from the HSK card', async ({ page }) => {
    await page.goto('/cards/study?deck=mywords');
    const cards = await page.evaluate(() =>
      JSON.parse(document.getElementById('card-data')!.textContent!).cards);
    const jia = cards.filter((c: any) => c.zh === '家');
    expect(jia).toHaveLength(2);
    expect(jia.find((c: any) => c.d.includes('mywords')).ru).toContain('счётное слово');
  });

  test('phrases get a tone drill, one row per syllable', async ({ page }) => {
    await page.goto('/cards/study?deck=mywords');
    await page.click('.mbtn[data-mode="tone"]');
    await expect(page.locator('.f-toneless')).toHaveText('qing ni zai du yi xia');
    await expect(page.locator('.tq-row')).toHaveCount(6);
  });

  test('erhua and -ren words split correctly in the tone drill', async ({ page }) => {
    await page.goto('/cards/study?deck=theme:food');
    const cards = await page.evaluate(() =>
      JSON.parse(document.getElementById('card-data')!.textContent!).cards);
    const syl = (zh: string) => cards.find((c: any) => c.zh === zh)?.syl;
    expect(syl('病人')).toEqual([['bing', 4], ['ren', 2]]);
    expect(syl('一点儿')).toEqual([['yi', 1], ['dianr', 3]]);
  });
});
