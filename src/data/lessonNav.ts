// Ordered list of all lessons for prev/next navigation
export const lessonNav = [
  { id: 'l1', num: '01', label: 'Четыре тона' },
  { id: 'l2', num: '02', label: 'Базовые фразы' },
  { id: 'l3', num: '03', label: 'Грамматика' },
  { id: 'l4', num: '04', label: 'Числа' },
  { id: 'l5', num: '05', label: 'Произношение' },
  { id: 'l6', num: '06', label: 'Дни и время' },
  { id: 'l7', num: '07', label: 'Вопросы' },
  { id: 'l8', num: '08', label: 'Счётные слова' },
  { id: 'l9', num: '09', label: 'Иероглифы' },
  { id: 'la', num: 'А', label: 'Черты' },
  { id: 'lb', num: 'Б', label: 'Правила' },
  { id: 'lv', num: 'В', label: 'Все 214 ключей' },
  { id: 'top40', num: '★', label: 'Топ-40 ключей' },
  { id: 'dialog', num: '💬', label: 'Диалог' },
];

export function getNavContext(id: string) {
  const idx = lessonNav.findIndex(l => l.id === id);
  return {
    current: lessonNav[idx],
    prev: idx > 0 ? lessonNav[idx - 1] : null,
    next: idx < lessonNav.length - 1 ? lessonNav[idx + 1] : null,
  };
}
