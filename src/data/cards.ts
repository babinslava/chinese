// Flashcard decks, assembled from data the site already has.
//
// Nothing new is authored here: a card is a view over an HSK 3.0 word, a
// textbook word or a radical. Review scheduling lives in the browser
// (localStorage), so the site stays a static build with no account needed.

import { words as hsk3Words, THEMES } from './hsk3';
import { lessons as hsk1Lessons } from './hsk1';
import top40 from './top40.json';
import syllableTable from './pinyinSyllables.json';

/** Per-syllable [toneless syllable, tone 1-5] — drives the tone drill. */
const SYLLABLES = syllableTable as Record<string, [string, number][]>;

/**
 * Stable card id. Keyed on the word *and* its reading, because the standard
 * lists homographs separately (干 gān "dry" vs 干 gàn "to do"), while spacing
 * differences between sources (吃饭 / chī fàn vs chīfàn) must still collapse
 * to one card.
 */
export function cardId(zh: string, py: string) {
  return `w:${zh}:${py.replace(/\s+/g, '').toLowerCase()}`;
}

export interface Card {
  /** Stable id, used as the localStorage key for this card's schedule. */
  id: string;
  zh: string;
  py: string;
  /** Russian practical transcription. */
  pron: string;
  ru: string;
  en?: string;
  /** Extra line shown on the back — examples, part of speech. */
  hint?: string;
  /** Syllables with their tones, for the tone drill. */
  syl?: [string, number][];
  decks: string[];
}

export interface Deck {
  id: string;
  ru: string;
  zh?: string;
  group: string;
  count: number;
}

const cards = new Map<string, Card>();

function add(c: Omit<Card, 'decks' | 'syl'>, deck: string) {
  const existing = cards.get(c.id);
  if (existing) {
    if (!existing.decks.includes(deck)) existing.decks.push(deck);
    return;
  }
  cards.set(c.id, { ...c, syl: SYLLABLES[c.py], decks: [deck] });
}

// — HSK 3.0 Level 1: one deck per theme, plus everything still to learn —
for (const w of hsk3Words) {
  add(
    {
      id: cardId(w.zh, w.py),
      zh: w.zh,
      py: w.py,
      pron: w.pron,
      ru: w.ru,
      en: w.en,
      hint: w.example,
    },
    `theme:${w.theme}`
  );
  if (!w.known) add({ id: cardId(w.zh, w.py), zh: w.zh, py: w.py, pron: w.pron, ru: w.ru, en: w.en }, 'hsk3:todo');
}

// The textbook and the standard sometimes spell the same word differently
// (上 shàng / shang, 学生 xuéshēng / xuésheng, 一起 yīqǐ / yìqǐ). Where a
// character has exactly one entry in the standard, its spelling wins, so the
// two sources land on one card. Genuine homographs (干 gān / gàn) have more
// than one entry and are left alone.
const canonicalPy = new Map<string, string>();
{
  const seen = new Map<string, string[]>();
  for (const w of hsk3Words) {
    const list = seen.get(w.zh) ?? [];
    list.push(w.py);
    seen.set(w.zh, list);
  }
  for (const [zh, list] of seen) if (list.length === 1) canonicalPy.set(zh, list[0]);
}

// — HSK Standard Course 1: one deck per lesson —
for (const lesson of hsk1Lessons) {
  for (const w of lesson.newWords) {
    add(
      {
        id: cardId(w.zh, canonicalPy.get(w.zh) ?? w.py),
        zh: w.zh,
        py: canonicalPy.get(w.zh) ?? w.py,
        pron: w.pron,
        ru: w.ru,
        en: w.en,
        hint: w.pos,
      },
      `lesson:${lesson.n}`
    );
  }
}

// — The 40 most useful radicals —
for (const r of top40 as { char: string; meaning: string; pron: string; examples: string }[]) {
  const zh = r.char.split('/')[0];
  add(
    { id: `r:${zh}`, zh, py: '', pron: r.pron, ru: r.meaning, hint: r.examples },
    'radicals:top40'
  );
}

export const allCards: Card[] = [...cards.values()];

const themeLabel = new Map(THEMES.map(t => [t.key, t] as const));

export const decks: Deck[] = [
  {
    id: 'hsk3:todo',
    ru: 'HSK 3.0 — осталось выучить',
    group: 'Стандарт HSK 3.0',
    count: allCards.filter(c => c.decks.includes('hsk3:todo')).length,
  },
  ...THEMES.map(t => ({
    id: `theme:${t.key}`,
    ru: themeLabel.get(t.key)!.ru,
    zh: t.zh,
    group: 'Стандарт HSK 3.0 · по темам',
    count: allCards.filter(c => c.decks.includes(`theme:${t.key}`)).length,
  })),
  ...hsk1Lessons.map(l => ({
    id: `lesson:${l.n}`,
    ru: `Урок ${l.n} · ${l.ru}`,
    zh: l.zh,
    group: 'Учебник HSK 1',
    count: allCards.filter(c => c.decks.includes(`lesson:${l.n}`)).length,
  })),
  {
    id: 'radicals:top40',
    ru: 'Топ-40 ключей',
    group: 'Справочник',
    count: allCards.filter(c => c.decks.includes('radicals:top40')).length,
  },
].filter(d => d.count > 0);

export function deckGroups() {
  const out: { group: string; decks: Deck[] }[] = [];
  for (const d of decks) {
    let g = out.find(x => x.group === d.group);
    if (!g) out.push((g = { group: d.group, decks: [] }));
    g.decks.push(d);
  }
  return out;
}
