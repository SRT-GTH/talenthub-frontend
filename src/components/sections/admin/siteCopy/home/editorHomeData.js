/*
 * editorHomeData — mock data of the Content Editor home (Platform Admin 7.8.0a). Shaped like a future API payload; nothing is sent anywhere
 * (⚠️ ASSUMPTION: no backend yet). The numbers are verbatim from the frame and equal the ones on the persona card (3 drafts · 12 published · 1 name draft).
 */
export const EDITOR_KPIS = [
  {
    id: 'drafts',
    eyebrow: 'Drafts waiting',
    value: '3',
    sub: 'Not live yet. Only staff can see them.',
  },
  {
    id: 'published',
    eyebrow: 'Published this week',
    value: '12',
    sub: 'Users see changes within a minute.',
  },
  {
    id: 'edited',
    eyebrow: 'Sections edited',
    value: '18 of 214',
    sub: 'The rest still show the original text.',
  },
  {
    id: 'names',
    eyebrow: 'Name change waiting',
    value: '1',
    sub: 'Career Buddy → Tali · needs a super admin',
  },
];

/** The line next to "Continue where you left off". */
export const CONTINUE_SAVED = 'Saved as draft 10 min ago';

/** Search suggestions drawn next to the field: Try “Join now” or “footer”. */
export const SEARCH_TRIES = ['Join now', 'footer'];

/**
 * "Good morning / afternoon / evening, <first name>". The frame draws the afternoon; the greeting follows the clock, and `?greeting=morning|afternoon|evening`
 * pins it (the frame URL uses `afternoon`).
 */
export const greetingFor = (override, date = new Date()) => {
  const h = date.getHours();
  const part = ['morning', 'afternoon', 'evening'].includes(override)
    ? override
    : h < 12
      ? 'morning'
      : h < 18
        ? 'afternoon'
        : 'evening';
  return `Good ${part}`;
};
