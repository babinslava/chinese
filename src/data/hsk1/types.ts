// Schema for the HSK Standard Course 1 textbook section (标准教程 HSK 1).
// Each lesson in the book follows the same spine:
//   课文 Text → 拼音 Pinyin → 课堂用语 Classroom → 汉字 Characters → 注释 Notes
// The Text and New Words parts are rigid enough to type directly; everything
// else varies page to page, so those sections are modelled as a list of blocks.

/** One spoken line of a dialogue. */
export interface Line {
  /** Speaker label as printed in the book: "A", "B", or a narrator. */
  who?: string;
  zh: string;
  py: string;
  /** Russian practical transcription, e.g. "Ни хао". */
  pron: string;
  ru: string;
  /** The book's own English version, kept as a secondary reference. */
  en: string;
}

/** A numbered dialogue in the 课文 Text section. */
export interface TextBlock {
  n: number;
  /** Audio track id printed in the book, e.g. "01-1". */
  track?: string;
  /** Key into the Scene component's illustration library. */
  scene: string;
  lines: Line[];
}

/** An entry in the 生词 New Words list. */
export interface NewWord {
  /** Number as printed; proper nouns are unnumbered in the book. */
  n?: number;
  zh: string;
  py: string;
  pron: string;
  /** Part of speech as printed: "pron.", "adj.", "v." … */
  pos?: string;
  ru: string;
  en: string;
  /** Marked with * in the book — beyond the HSK 1 required list. */
  star?: boolean;
  /** Proper noun (专名), listed separately at the end. */
  proper?: boolean;
}

export type Block =
  /** Explanatory paragraph. */
  | { kind: 'prose'; ru: string; en?: string }
  /** Generic table with a header row. */
  | { kind: 'table'; title_ru?: string; head: string[]; rows: string[][]; note_ru?: string }
  /** Grid of bare pinyin syllables for reading drills. */
  | { kind: 'syllables'; title_ru?: string; track?: string; rows: string[][] }
  /** Vocabulary drill: pinyin, optionally with characters and a gloss. */
  | { kind: 'words'; title_ru?: string; track?: string; items: { zh?: string; py: string; ru?: string }[] }
  /** Example sentences or phrases. */
  | { kind: 'examples'; title_ru?: string; items: { zh: string; py: string; pron?: string; ru: string; en?: string }[] }
  /** Stroke table: the stroke, its name, and characters that use it. */
  | { kind: 'strokes'; items: { s: string; zh: string; py: string; ru: string; ex: { zh: string; py: string; ru: string }[] }[] }
  /** Single-component characters introduced with a short note. */
  | { kind: 'chars'; items: { zh: string; py: string; pron: string; ru: string; note_ru?: string }[] }
  /** Radicals (偏旁) with example characters. */
  | { kind: 'radicals'; items: { r: string; py?: string; ru: string; ex: { zh: string; py: string; ru: string }[] }[] }
  /** Character structure types (left-right, top-bottom, enclosure…). */
  | { kind: 'structure'; items: { name_ru: string; name_zh: string; layout: string; ex: string[] }[] }
  /** Callout box. */
  | { kind: 'note'; ru: string; en?: string }
  /**
   * A numbered task. Covers 热身 Warm-up, 练习 Exercises and 运用 Application,
   * which all print the same way: a heading, an instruction, and a list of
   * prompts. Blanks in the book are written as "____" in `zh`.
   */
  | {
      kind: 'exercise';
      n?: number;
      title_zh?: string;
      title_ru: string;
      instruction_ru?: string;
      instruction_en?: string;
      items?: { zh?: string; py?: string; ru?: string }[];
    };

/** A titled section within a lesson. */
export interface Section {
  /** Anchor id, e.g. "pinyin". */
  id: string;
  label_zh: string;
  label_ru: string;
  blocks: Block[];
}

export interface Lesson {
  n: number;
  /** Lesson title in Chinese, e.g. "你好". */
  zh: string;
  py: string;
  pron: string;
  ru: string;
  en: string;
  /** Book page this lesson starts on (for reference back to the PDF). */
  page: number;
  /** 热身 Warm-up — printed before the texts, from lesson 3 onwards. */
  warmup?: Section;
  texts: TextBlock[];
  newWords: NewWord[];
  /** 课堂用语 Classroom Expressions — present in the first lessons only. */
  classroom?: { track?: string; items: { zh: string; py: string; pron: string; ru: string; en: string }[] };
  sections: Section[];
}
