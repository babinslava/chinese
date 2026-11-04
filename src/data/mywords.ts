// Words learned outside the course — from class, the street, a show. Kept
// in mywords.json so the list lives in the repo and is the same in every
// browser; to add a word, append an entry there.

import data from './mywords.json';

export interface MyWord {
  zh: string;
  py: string;
  /** Russian practical transcription (Palladius), as elsewhere on the site. */
  pron: string;
  ru: string;
  /** Traditional form, when it differs. */
  trad?: string;
  /** Usage, tone changes, how the word is built. */
  note?: string;
  /** ISO date the word was added; the page groups by it. */
  added: string;
}

export const myWords: MyWord[] = data;

/**
 * Card id for a word of your own. Kept apart from the w: ids of the course
 * cards on purpose: 家 here is the measure word, while the HSK card for 家 is
 * "family, home", and each should keep its own meaning and progress.
 */
export function myCardId(w: MyWord) {
  return `m:${w.zh}:${w.py.replace(/\s+/g, '').toLowerCase()}`;
}
