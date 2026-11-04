// Reading texts built from words already learned (src/data/texts.json).
//
// Each line is split into words at build time, so a tap on a word can show
// its reading and meaning. Words come from my own list first, then the HSK
// standard and the textbook; the longest match wins, so 火车站 is one word
// rather than 火车 + 站.

import data from './texts.json';
import { myWords } from './mywords';
import { words as hsk3Words } from './hsk3';
import { lessons as hsk1Lessons } from './hsk1';

export interface TextLine { zh: string; py: string; ru: string }
export interface ReadingText { id: string; zh: string; ru: string; source?: string; lines: TextLine[] }
export interface Gloss { zh: string; py: string; ru: string }
/** A run of text; `g` indexes the glossary when the run is a known word. */
export type Token = { t: string; g?: number };

export const texts: ReadingText[] = data;

const dict = new Map<string, Gloss>();
const put = (zh: string, py: string, ru: string) => { if (!dict.has(zh)) dict.set(zh, { zh, py, ru }); };
for (const w of myWords) put(w.zh, w.py, w.ru);
for (const w of hsk3Words) put(w.zh, w.py, w.ru);
for (const l of hsk1Lessons) for (const w of l.newWords) put(w.zh, w.py, w.ru);
const MAX = Math.max(...[...dict.keys()].map(k => k.length));

export const glossary: Gloss[] = [];
const index = new Map<string, number>();

export function tokenize(line: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < line.length) {
    let hit = '';
    for (let n = Math.min(MAX, line.length - i); n > 0; n--) {
      const s = line.slice(i, i + n);
      if (dict.has(s)) { hit = s; break; }
    }
    if (hit) {
      if (!index.has(hit)) { index.set(hit, glossary.length); glossary.push(dict.get(hit)!); }
      out.push({ t: hit, g: index.get(hit) });
      i += hit.length;
    } else {
      // Unknown character or punctuation: merge with a preceding unknown run.
      const last = out[out.length - 1];
      if (last && last.g === undefined) last.t += line[i];
      else out.push({ t: line[i] });
      i++;
    }
  }
  return out;
}

/** Characters in the texts that no dictionary covers, for a test to watch. */
export function unknownRuns(): string[] {
  const runs = new Set<string>();
  for (const t of texts) for (const l of t.lines)
    for (const tok of tokenize(l.zh))
      if (tok.g === undefined && /\p{Script=Han}/u.test(tok.t)) runs.add(tok.t);
  return [...runs];
}
