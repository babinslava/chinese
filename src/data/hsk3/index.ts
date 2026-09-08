// HSK 3.0 Level 1, as defined by 《国际中文教育中文水平等级标准》 (GF0025-2021).
//
// The standard describes each level along four dimensions. Level 1 is
// 269 syllables / 300 characters / 500 words / 48 grammar points. Three of
// those are covered here; the syllable inventory is not published in a form
// worth reproducing, and pinyin is already taught in the main course.
//
// Note this is the 2021 proficiency *standard*, not the 2025 exam outline
// (新版HSK考试大纲), which counts differently — 246 characters, 70 grammar items.

import wordsData from './words.json';
import charsData from './chars.json';
import grammarData from './grammar.json';

export interface Hsk3Word {
  n: number;
  zh: string;
  /** Variant form the standard lists alongside the headword (哥哥 / 哥). */
  alt?: string;
  py: string;
  alt_py?: string;
  /** Russian practical transcription (Palladius). */
  pron: string;
  /** Traditional form, when it differs. */
  trad?: string;
  /** Part of speech as given by the standard: V, N, Adj, Pron … */
  pos: string;
  theme: string;
  ru: string;
  en: string;
  /** Illustrative usage, for entries the standard gives one for. */
  example?: string;
  /** Which HSK Standard Course 1 lesson introduces it, if any. */
  lesson: number | null;
  /** Already taught somewhere on this site — the textbook or the main course. */
  known: boolean;
}

export interface Hsk3Char {
  zh: string;
  trad?: string;
  /** Level 1 also requires being able to hand-write most of these. */
  write: boolean;
  freq: number | null;
  ex: string[];
}

export interface Hsk3Grammar {
  n: number;
  group_zh: string;
  group_ru: string;
  category_zh: string;
  details_zh: string;
  content_zh: string;
  title_ru: string;
  explain_ru: string;
  lesson: number | null;
}

export const words = wordsData as Hsk3Word[];
export const chars = charsData as Hsk3Char[];
export const grammar = grammarData as Hsk3Grammar[];

/** Theme keys in the order they should be presented, easiest first. */
export const THEMES: { key: string; ru: string; zh: string }[] = [
  { key: 'greet', ru: 'Приветствия и вежливость', zh: '问候' },
  { key: 'pronoun', ru: 'Местоимения', zh: '代词' },
  { key: 'people', ru: 'Люди и семья', zh: '人和家庭' },
  { key: 'number', ru: 'Числа и счёт', zh: '数字' },
  { key: 'time', ru: 'Время и календарь', zh: '时间' },
  { key: 'place', ru: 'Места и направления', zh: '地点方位' },
  { key: 'home', ru: 'Дом и вещи', zh: '家和物品' },
  { key: 'food', ru: 'Еда и напитки', zh: '饮食' },
  { key: 'study', ru: 'Учёба и язык', zh: '学习' },
  { key: 'work', ru: 'Работа и дела', zh: '工作' },
  { key: 'transport', ru: 'Транспорт и дорога', zh: '交通' },
  { key: 'shop', ru: 'Покупки и деньги', zh: '购物' },
  { key: 'body', ru: 'Тело и здоровье', zh: '身体健康' },
  { key: 'weather', ru: 'Погода и природа', zh: '天气自然' },
  { key: 'daily', ru: 'Быт и досуг', zh: '日常生活' },
  { key: 'verb', ru: 'Глаголы действия', zh: '动词' },
  { key: 'adj', ru: 'Признаки и качества', zh: '形容词' },
  { key: 'func', ru: 'Служебные слова', zh: '虚词' },
];

export function wordsByTheme() {
  return THEMES.map(t => ({
    ...t,
    words: words.filter(w => w.theme === t.key),
  })).filter(t => t.words.length > 0);
}

/** How much of the 500 the site already teaches, via the textbook or the course. */
export function coverage() {
  const known = words.filter(w => w.known).length;
  return { total: words.length, known, missing: words.length - known };
}

export function grammarByGroup() {
  const seen: { group_zh: string; group_ru: string; items: Hsk3Grammar[] }[] = [];
  for (const g of grammar) {
    let bucket = seen.find(s => s.group_zh === g.group_zh);
    if (!bucket) {
      bucket = { group_zh: g.group_zh, group_ru: g.group_ru, items: [] };
      seen.push(bucket);
    }
    bucket.items.push(g);
  }
  return seen;
}
