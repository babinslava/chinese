import type { Lesson } from './types';

// Lesson files are discovered automatically, so adding lesson16.json would be
// enough to make it appear in the nav, the index and the vocabulary.
const modules = import.meta.glob<{ default: Lesson }>('./lesson*.json', { eager: true });

export const lessons: Lesson[] = Object.values(modules)
  .map(m => m.default)
  .sort((a, b) => a.n - b.n);

export function getLesson(n: number): Lesson | undefined {
  return lessons.find(l => l.n === n);
}

export function getHsk1NavContext(n: number) {
  const idx = lessons.findIndex(l => l.n === n);
  return {
    prev: idx > 0 ? lessons[idx - 1] : null,
    next: idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null,
  };
}

/** Every new word in the book, flattened, with the lesson it came from. */
export function allNewWords() {
  return lessons.flatMap(l => l.newWords.map(w => ({ ...w, lesson: l.n })));
}

/**
 * Every character the lesson pages turn into a /vocab/{char} link — stroke
 * examples, single-component characters, radical examples. Collected so the
 * vocabulary can generate a page for each and no link 404s.
 */
export function allLinkedChars(): { zh: string; py: string; pron: string; ru: string; lesson: number }[] {
  const out: { zh: string; py: string; pron: string; ru: string; lesson: number }[] = [];
  for (const l of lessons) {
    for (const sec of l.sections) {
      for (const b of sec.blocks) {
        if (b.kind === 'chars') {
          for (const c of b.items) out.push({ zh: c.zh, py: c.py, pron: c.pron, ru: c.ru, lesson: l.n });
        } else if (b.kind === 'strokes') {
          for (const s of b.items) for (const e of s.ex) out.push({ zh: e.zh, py: e.py, pron: '', ru: e.ru, lesson: l.n });
        } else if (b.kind === 'radicals') {
          for (const r of b.items) for (const e of r.ex) out.push({ zh: e.zh, py: e.py, pron: '', ru: e.ru, lesson: l.n });
        }
      }
    }
  }
  return out;
}

export type { Lesson };
