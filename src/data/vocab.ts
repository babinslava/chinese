// Unified vocabulary database
// role: "meaning" = radical gives meaning, "sound" = radical gives pronunciation, "both" = both

export interface VocabEntry {
  zh: string;
  py: string;
  pron: string;
  meaning: string;
  role?: 'meaning' | 'sound' | 'both';
  /** Which radical gives meaning */
  radical_meaning?: string;
  /** Which radical gives sound */
  radical_sound?: string;
  tags: string[];
}

export const vocab: VocabEntry[] = [
  // === TONES (Lesson 1) ===
  { zh: "妈", py: "mā", pron: "Ма̄", meaning: "Мама", radical_meaning: "女", radical_sound: "马", tags: ["tones", "family"] },
  { zh: "麻", py: "má", pron: "Ма́", meaning: "Конопля", tags: ["tones"] },
  { zh: "马", py: "mǎ", pron: "Ма̌", meaning: "Лошадь", tags: ["tones", "animal"] },
  { zh: "骂", py: "mà", pron: "Ма̀", meaning: "Ругать", radical_meaning: "口", radical_sound: "马", tags: ["tones"] },
  { zh: "吗", py: "ma", pron: "ма", meaning: "Частица вопроса", radical_meaning: "口", radical_sound: "马", tags: ["tones", "grammar", "phrases"] },

  // === PHRASES (Lesson 2) ===
  { zh: "你", py: "nǐ", pron: "Ни̌", meaning: "Ты", tags: ["phrases", "grammar", "pronoun"] },
  { zh: "好", py: "hǎo", pron: "Ха̌о", meaning: "Хорошо", radical_meaning: "女+子", tags: ["phrases", "hieroglyphs"] },
  { zh: "你好", py: "nǐ hǎo", pron: "Ни̌ ха̌о", meaning: "Привет", tags: ["phrases"] },
  { zh: "我", py: "wǒ", pron: "Во̌", meaning: "Я", tags: ["phrases", "grammar", "pronoun"] },
  { zh: "很", py: "hěn", pron: "Хэ̌н", meaning: "Очень", tags: ["phrases", "grammar"] },
  { zh: "谢谢", py: "xièxiè", pron: "Сьесье", meaning: "Спасибо", tags: ["phrases"] },
  { zh: "不", py: "bù", pron: "Бу̀", meaning: "Не / нет", tags: ["phrases", "grammar"] },
  { zh: "客气", py: "kèqì", pron: "Кхэ̀чи̌", meaning: "Вежливый", tags: ["phrases"] },
  { zh: "对不起", py: "duìbuqǐ", pron: "Дуэ̀йбуци̌", meaning: "Извини", tags: ["phrases"] },
  { zh: "没关系", py: "méi guānxi", pron: "Мэ́й гуа̄нси", meaning: "Ничего страшного", tags: ["phrases"] },
  { zh: "再见", py: "zàijiàn", pron: "Цза̀йцзя̀н", meaning: "До свидания", tags: ["phrases"] },
  { zh: "懂", py: "dǒng", pron: "До̌н", meaning: "Понимать", tags: ["phrases"] },
  { zh: "请", py: "qǐng", pron: "Чи̌н", meaning: "Пожалуйста / просить", radical_meaning: "讠", tags: ["phrases"] },

  // === GRAMMAR (Lesson 3) ===
  { zh: "您", py: "nín", pron: "Ни́н", meaning: "Вы (вежл.)", radical_meaning: "心", tags: ["grammar", "pronoun"] },
  { zh: "他", py: "tā", pron: "Та̄", meaning: "Он", radical_meaning: "亻", tags: ["grammar", "pronoun"] },
  { zh: "她", py: "tā", pron: "Та̄", meaning: "Она", radical_meaning: "女", tags: ["grammar", "pronoun"] },
  { zh: "们", py: "men", pron: "мэн", meaning: "Суффикс мн.ч.", radical_meaning: "亻", tags: ["grammar"] },
  { zh: "是", py: "shì", pron: "Шъ", meaning: "Быть / являться", tags: ["grammar"] },
  { zh: "学生", py: "xuéshēng", pron: "Сюэ́шэ̄н", meaning: "Студент", tags: ["grammar"] },
  { zh: "吃", py: "chī", pron: "Чӣ", meaning: "Есть (еду)", radical_meaning: "口", tags: ["grammar"] },
  { zh: "肉", py: "ròu", pron: "Жо̀у", meaning: "Мясо", tags: ["grammar"] },
  { zh: "没", py: "méi", pron: "Мэ́й", meaning: "Нет (отриц.)", tags: ["grammar"] },
  { zh: "有", py: "yǒu", pron: "Ю̌", meaning: "Иметь / есть", tags: ["grammar", "questions"] },

  // === NUMBERS (Lesson 4) ===
  { zh: "零", py: "líng", pron: "Ли́н", meaning: "Ноль", tags: ["numbers"] },
  { zh: "一", py: "yī", pron: "Ӣ", meaning: "Один", tags: ["numbers", "radicals"] },
  { zh: "二", py: "èr", pron: "Э̀р", meaning: "Два", tags: ["numbers", "radicals"] },
  { zh: "三", py: "sān", pron: "Са̄н", meaning: "Три", tags: ["numbers"] },
  { zh: "四", py: "sì", pron: "Сы̀", meaning: "Четыре", tags: ["numbers"] },
  { zh: "五", py: "wǔ", pron: "У̌", meaning: "Пять", tags: ["numbers"] },
  { zh: "六", py: "liù", pron: "Лёу", meaning: "Шесть", tags: ["numbers"] },
  { zh: "七", py: "qī", pron: "Чьӣ", meaning: "Семь", tags: ["numbers"] },
  { zh: "八", py: "bā", pron: "Ба̄", meaning: "Восемь", tags: ["numbers", "radicals"] },
  { zh: "九", py: "jiǔ", pron: "Цзё̌у", meaning: "Девять", tags: ["numbers"] },
  { zh: "十", py: "shí", pron: "Ши́", meaning: "Десять", tags: ["numbers"] },
  { zh: "百", py: "bǎi", pron: "Ба̌й", meaning: "Сто", tags: ["numbers"] },
  { zh: "千", py: "qiān", pron: "Чьӣэн", meaning: "Тысяча", tags: ["numbers"] },
  { zh: "万", py: "wàn", pron: "Ва̀н", meaning: "Десять тысяч", tags: ["numbers"] },
  { zh: "两", py: "liǎng", pron: "Ля̌н", meaning: "Два (перед счётным)", tags: ["numbers", "measure"] },

  // === PRONUNCIATION (Lesson 5) ===
  { zh: "中", py: "zhōng", pron: "Джо̄н", meaning: "Центр / середина", tags: ["pronunciation"] },
  { zh: "西", py: "xī", pron: "Сьӣ", meaning: "Запад", tags: ["pronunciation"] },
  { zh: "叫", py: "jiào", pron: "Дзья̀о", meaning: "Звать / называться", tags: ["pronunciation", "phrases"] },
  { zh: "贵", py: "guì", pron: "Гуэ̀й", meaning: "Дорогой", radical_meaning: "贝", tags: ["pronunciation"] },
  { zh: "天", py: "tiān", pron: "Тьиэ̄н", meaning: "Небо / день", radical_meaning: "大", tags: ["pronunciation", "days"] },
  { zh: "写", py: "xiě", pron: "Сьиэ̌", meaning: "Писать", tags: ["pronunciation"] },
  { zh: "鱼", py: "yú", pron: "Юй", meaning: "Рыба", tags: ["pronunciation", "radicals"] },

  // === DAYS & TIME (Lesson 6) ===
  { zh: "星期", py: "xīngqī", pron: "Сӣнчӣ", meaning: "Неделя / день недели", tags: ["days"] },
  { zh: "早上", py: "zǎoshang", pron: "Цза̌ошан", meaning: "Утро", tags: ["days"] },
  { zh: "中午", py: "zhōngwǔ", pron: "Джо̄нъу̌", meaning: "Полдень", tags: ["days"] },
  { zh: "下午", py: "xiàwǔ", pron: "Ся̀у̌", meaning: "После обеда", tags: ["days"] },
  { zh: "晚上", py: "wǎnshang", pron: "Ва̌ншан", meaning: "Вечер", tags: ["days"] },
  { zh: "晚安", py: "wǎn'ān", pron: "Ва̌н'а̄н", meaning: "Спокойной ночи", tags: ["days"] },

  // === QUESTIONS (Lesson 7) ===
  { zh: "谁", py: "shéi", pron: "Шэ́й", meaning: "Кто", tags: ["questions"] },
  { zh: "什么", py: "shénme", pron: "Шэ́нмэ", meaning: "Что", tags: ["questions"] },
  { zh: "哪儿", py: "nǎr", pron: "На̌р", meaning: "Где", tags: ["questions"] },
  { zh: "为什么", py: "wèishénme", pron: "Вэ̀йшэ́нмэ", meaning: "Почему", tags: ["questions"] },
  { zh: "怎么", py: "zěnme", pron: "Цзэ̌нмэ", meaning: "Как", tags: ["questions"] },
  { zh: "多少", py: "duōshao", pron: "Дуо̄шао", meaning: "Сколько", tags: ["questions"] },
  { zh: "几", py: "jǐ", pron: "Цзи̌", meaning: "Сколько (малое)", tags: ["questions", "radicals"] },
  { zh: "呢", py: "ne", pron: "Нэ", meaning: "Частица «а ты?»", radical_meaning: "口", tags: ["questions", "grammar"] },
  { zh: "在", py: "zài", pron: "Цза̀й", meaning: "В / находиться", tags: ["questions"] },
  { zh: "来", py: "lái", pron: "Ла́й", meaning: "Приходить", tags: ["questions"] },
  { zh: "去", py: "qù", pron: "Чю̀", meaning: "Уходить / ехать", tags: ["questions"] },

  // === MEASURE WORDS (Lesson 8) ===
  { zh: "个", py: "gè", pron: "Гэ̀", meaning: "Универсальное счётное", tags: ["measure"] },
  { zh: "本", py: "běn", pron: "Бэ̌н", meaning: "Сч. слово для книг", radical_meaning: "木", tags: ["measure"] },
  { zh: "张", py: "zhāng", pron: "Джа̄н", meaning: "Сч. слово для плоского", tags: ["measure"] },
  { zh: "条", py: "tiáo", pron: "Тья́о", meaning: "Сч. слово для длинного", tags: ["measure"] },
  { zh: "杯", py: "bēi", pron: "Бэ̄й", meaning: "Стакан / чашка", radical_meaning: "木", tags: ["measure"] },
  { zh: "只", py: "zhī", pron: "Джӣ", meaning: "Сч. слово для животных", tags: ["measure"] },
  { zh: "辆", py: "liàng", pron: "Ля̀н", meaning: "Сч. слово для транспорта", radical_meaning: "车", tags: ["measure"] },
  { zh: "双", py: "shuāng", pron: "Шуа̄н", meaning: "Пара", tags: ["measure"] },
  { zh: "瓶", py: "píng", pron: "Пи́н", meaning: "Бутылка", tags: ["measure"] },
  { zh: "书", py: "shū", pron: "Шӯ", meaning: "Книга", tags: ["measure"] },
  { zh: "纸", py: "zhǐ", pron: "Джи̌", meaning: "Бумага", tags: ["measure"] },
  { zh: "茶", py: "chá", pron: "Ча́", meaning: "Чай", radical_meaning: "艹", tags: ["measure", "cafe"] },
  { zh: "猫", py: "māo", pron: "Мао̄", meaning: "Кот", radical_meaning: "犭", tags: ["measure", "animal"] },
  { zh: "车", py: "chē", pron: "Чэ̄", meaning: "Машина / транспорт", tags: ["measure", "radicals"] },
  { zh: "鞋", py: "xié", pron: "Сье́", meaning: "Обувь", radical_meaning: "革", tags: ["measure"] },
  { zh: "水", py: "shuǐ", pron: "Шуэ̌й", meaning: "Вода", tags: ["measure", "hieroglyphs", "radicals"] },

  // === HIEROGLYPHS (Lesson 9) — Pictographs ===
  { zh: "山", py: "shān", pron: "Ша̄н", meaning: "Гора", tags: ["hieroglyphs", "radicals"] },
  { zh: "日", py: "rì", pron: "Жѝ", meaning: "Солнце / день", tags: ["hieroglyphs", "radicals", "days"] },
  { zh: "月", py: "yuè", pron: "Юэ̀", meaning: "Луна / месяц", tags: ["hieroglyphs", "radicals"] },
  { zh: "木", py: "mù", pron: "Му̀", meaning: "Дерево", tags: ["hieroglyphs", "radicals"] },
  { zh: "人", py: "rén", pron: "Жэ́н", meaning: "Человек", tags: ["hieroglyphs", "radicals", "grammar"] },
  { zh: "口", py: "kǒu", pron: "Ко̌у", meaning: "Рот", tags: ["hieroglyphs", "radicals"] },
  { zh: "火", py: "huǒ", pron: "Хуо̌", meaning: "Огонь", tags: ["hieroglyphs", "radicals"] },

  // === HIEROGLYPHS (Lesson 9) — Compound characters ===
  { zh: "明", py: "míng", pron: "Ми́н", meaning: "Яркий / светлый", radical_meaning: "日+月", tags: ["hieroglyphs"] },
  { zh: "森", py: "sēn", pron: "Сэ̄н", meaning: "Лес", radical_meaning: "木+木+木", tags: ["hieroglyphs"] },
  { zh: "休", py: "xiū", pron: "Сью̄", meaning: "Отдыхать", radical_meaning: "亻+木", tags: ["hieroglyphs"] },
  { zh: "男", py: "nán", pron: "На́н", meaning: "Мужчина", radical_meaning: "田+力", tags: ["hieroglyphs"] },
  { zh: "家", py: "jiā", pron: "Дзья̄", meaning: "Дом / семья", radical_meaning: "宀+豕", tags: ["hieroglyphs"] },

  // === DIALOGUE — Cafe ===
  { zh: "这", py: "zhè", pron: "Джэ̀", meaning: "Это / этот", tags: ["cafe", "questions"] },
  { zh: "要", py: "yào", pron: "Яо̀", meaning: "Хотеть / нужно", tags: ["cafe"] },
  { zh: "钱", py: "qián", pron: "Чья́н", meaning: "Деньги", radical_meaning: "钅", tags: ["cafe", "radicals"] },
  { zh: "块", py: "kuài", pron: "Куа̀й", meaning: "Юань (разг.)", tags: ["cafe"] },

  // === KEY COMPOUND EXAMPLES with radical roles ===
  { zh: "妈", py: "mā", pron: "Ма̄", meaning: "Мама", radical_meaning: "女", radical_sound: "马", role: "both", tags: ["compound"] },
  { zh: "吗", py: "ma", pron: "ма", meaning: "Частица вопроса", radical_meaning: "口", radical_sound: "马", role: "both", tags: ["compound"] },
  { zh: "骂", py: "mà", pron: "Ма̀", meaning: "Ругать", radical_meaning: "口", radical_sound: "马", role: "both", tags: ["compound"] },
  { zh: "请", py: "qǐng", pron: "Чи̌н", meaning: "Просить", radical_meaning: "讠", radical_sound: "青", role: "both", tags: ["compound"] },
  { zh: "贵", py: "guì", pron: "Гуэ̀й", meaning: "Дорогой", radical_meaning: "贝", tags: ["compound"] },
  { zh: "谢", py: "xiè", pron: "Сьѐ", meaning: "Благодарить", radical_meaning: "讠", radical_sound: "射", role: "both", tags: ["compound"] },
  { zh: "说", py: "shuō", pron: "Шуо̄", meaning: "Говорить", radical_meaning: "讠", radical_sound: "兑", role: "both", tags: ["compound"] },
  { zh: "喝", py: "hē", pron: "Хэ̄", meaning: "Пить", radical_meaning: "口", radical_sound: "曷", role: "both", tags: ["compound"] },
  { zh: "想", py: "xiǎng", pron: "Сья̌н", meaning: "Думать / хотеть", radical_meaning: "心", radical_sound: "相", role: "both", tags: ["compound"] },
  { zh: "爱", py: "ài", pron: "А̀й", meaning: "Любить", radical_meaning: "心", tags: ["compound"] },
  { zh: "花", py: "huā", pron: "Хуа̄", meaning: "Цветок", radical_meaning: "艹", radical_sound: "化", role: "both", tags: ["compound"] },
  { zh: "海", py: "hǎi", pron: "Ха̌й", meaning: "Море", radical_meaning: "氵", radical_sound: "每", role: "both", tags: ["compound"] },
  { zh: "河", py: "hé", pron: "Хэ́", meaning: "Река", radical_meaning: "氵", radical_sound: "可", role: "both", tags: ["compound"] },
  { zh: "树", py: "shù", pron: "Шу̀", meaning: "Дерево (растение)", radical_meaning: "木", radical_sound: "对", role: "both", tags: ["compound"] },
  { zh: "看", py: "kàn", pron: "Кхан", meaning: "Смотреть", radical_meaning: "目", tags: ["compound"] },
  { zh: "地", py: "dì", pron: "Дѝ", meaning: "Земля / место", radical_meaning: "土", radical_sound: "也", role: "both", tags: ["compound"] },
  { zh: "饭", py: "fàn", pron: "Фа̀н", meaning: "Рис / еда", radical_meaning: "饣", radical_sound: "反", role: "both", tags: ["compound"] },
  { zh: "打", py: "dǎ", pron: "Да̌", meaning: "Бить / делать", radical_meaning: "扌", radical_sound: "丁", role: "both", tags: ["compound"] },
  { zh: "买", py: "mǎi", pron: "Ма̌й", meaning: "Покупать", radical_meaning: "贝", tags: ["compound"] },
  { zh: "卖", py: "mài", pron: "Ма̀й", meaning: "Продавать", radical_meaning: "贝", tags: ["compound"] },
];

// --- Auto-import radicals from radicals.json ---
import radicalsData from './radicals.json';

for (const group of radicalsData) {
  for (const r of group.items) {
    const zh = r.char.split('/')[0];
    const existing = vocab.find(v => v.zh === zh);
    if (!existing) {
      vocab.push({
        zh,
        py: r.py,
        pron: r.pron,
        meaning: r.meaning,
        tags: ['radicals'],
      });
    }
    // Also add alternate form if exists (e.g. 亻 from 人/亻)
    if (r.char.includes('/')) {
      const alt = r.char.split('/')[1];
      const existingAlt = vocab.find(v => v.zh === alt);
      if (!existingAlt) {
        vocab.push({
          zh: alt,
          py: r.py,
          pron: r.pron,
          meaning: `${r.meaning} (вариант ${zh})`,
          tags: ['radicals'],
        });
      }
    }
  }
}

// --- Auto-import from top40.json ---
import top40Data from './top40.json';

for (const r of top40Data) {
  const zh = r.char.split('/')[0];
  const existing = vocab.find(v => v.zh === zh);
  if (!existing) {
    vocab.push({
      zh,
      py: '',
      pron: r.pron,
      meaning: r.meaning,
      tags: ['radicals', 'top40'],
    });
  }
}

// Build a lookup map by character
const _map = new Map<string, VocabEntry>();
// Deduplicate: keep entries with more info (role, radical_meaning)
for (const entry of vocab) {
  const existing = _map.get(entry.zh);
  if (!existing || (entry.role && !existing.role) || (entry.radical_meaning && !existing.radical_meaning)) {
    _map.set(entry.zh, entry);
  }
}

export const vocabMap = _map;

/** Get vocab entry by character, returns undefined if not found */
export function getVocab(zh: string): VocabEntry | undefined {
  return vocabMap.get(zh);
}

/** Get all unique vocab entries */
export function getAllVocab(): VocabEntry[] {
  return [...vocabMap.values()];
}
