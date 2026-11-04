// Splits a pinyin reading into [toneless syllable, tone] pairs for the tone
// drill. The site's own words have this precomputed in pinyinSyllables.json;
// this covers words added later (src/data/mywords.json) so they get the drill
// without a separate build step.

const INITIALS = ['', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x',
  'zh', 'ch', 'sh', 'r', 'z', 'c', 's'];
const FINALS = ['a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng',
  'ong', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'ua', 'uo', 'uai', 'ui',
  'uan', 'un', 'uang', 'ue', 'üe', 'ueng'];
// Without an initial, i/u/ü finals are spelled with y- and w-.
const ZERO = ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er',
  'yi', 'ya', 'ye', 'yao', 'you', 'yan', 'yin', 'yang', 'ying', 'yong', 'yo',
  'yu', 'yue', 'yuan', 'yun', 'wu', 'wa', 'wo', 'wai', 'wei', 'wan', 'wen', 'wang', 'weng'];

// A superset of real syllables: a few impossible pairs (bü, fong) slip in,
// which is harmless for splitting text that is already valid pinyin.
const VALID = new Set<string>(ZERO);
for (const i of INITIALS) if (i) for (const f of FINALS) VALID.add(i + f);
const MAX = 6;

const MARKS: Record<string, [string, number]> = {};
for (const [base, row] of Object.entries({
  a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ',
})) [...row].forEach((ch, k) => (MARKS[ch] = [base, k + 1]));

export function splitPinyin(py: string): [string, number][] | undefined {
  const plain: string[] = [];
  const tone: number[] = [];
  for (const raw of py.toLowerCase().normalize('NFC')) {
    const m = MARKS[raw];
    if (m) { plain.push(m[0]); tone.push(m[1]); }
    else if (/[a-zü]/.test(raw)) { plain.push(raw === 'v' ? 'ü' : raw); tone.push(0); }
    else { plain.push(' '); tone.push(0); }      // spaces, apostrophes, punctuation
  }
  const text = plain.join('');

  // Longest match first, but backtrack so the remainder must split too —
  // greedy alone reads 生日 shēngrì as shengr + i. Pinyin orthography also
  // requires an apostrophe before a syllable starting with a/o/e inside a
  // word, so without one such a split is rejected: 病人 bìngrén is
  // bing + ren, not the erhua bingr + en, while 一点儿 yìdiǎnr stays dianr.
  const out: [number, number][] = [];
  function walk(pos: number): boolean {
    let joined = pos > 0;
    while (text[pos] === ' ') { pos++; joined = false; }
    if (pos >= text.length) return true;
    if (joined && 'aoe'.includes(text[pos])) return false;
    for (let len = Math.min(MAX + 1, text.length - pos); len > 0; len--) {
      const s = text.slice(pos, pos + len);
      const ok = VALID.has(s) || (s.length > 1 && s.endsWith('r') && VALID.has(s.slice(0, -1)));
      if (!ok) continue;
      out.push([pos, pos + len]);
      if (walk(pos + len)) return true;
      out.pop();
    }
    return false;
  }
  if (!text.trim() || !walk(0)) return undefined;
  return out.map(([a, b]) => [text.slice(a, b), tone.slice(a, b).find(t => t > 0) ?? 5]);
}
