/*
 * Languages · Figma "GTH · Language switcher" 7477:85605 (menu, frame L-01 7497:6381) and the component set
 * "GTH · Language coming soon modal" 7499:7150 (Language = Twi / Ga / Ewe / Dagbani / Hausa, frames L-02 … L-02e).
 * ✅ VERIFIED: every string is verbatim from the node `characters` (texts.py on L-01, L-02 and the component set).
 * API-shaped mock: GET /languages -> [{ id, name, native, status, progress, steps }]; the page only ever has English
 * selectable, the others are "Soon".
 *
 * progress = the drawn bar fill (Twi 60 · Ga 40 · Ewe 35 · Dagbani 15 · Hausa 25, bar widths read from the Rectangle
 * nodes 278/185/162/69/116 of 463). steps = state of the three chips Menus / Messages & jobs / Career Buddy:
 * 'done' (green dot, #ebf1ec), 'wip' (amber dot, #faf4e8) or 'todo' (grey dot, white).
 */
export const LANGUAGE_MENU_COPY = {
  title: 'Language',
  sticker: 'Akwaaba',
  subtitle: 'English for now. Your languages are coming.',
  current: { name: 'English (Ghana)', note: 'Default' },
  soon: 'Soon',
  footnote: 'More Ghanaian languages are on the way. Tap one to get pinged when it lands.',
  suggest: 'Suggest a language →',
};

export const LANGUAGES = [
  {
    id: 'twi',
    name: 'Twi',
    native: 'Akan kasa',
    progress: 60,
    steps: ['done', 'wip', 'todo'],
    heroSize: 54,
  },
  {
    id: 'ga',
    name: 'Ga',
    native: 'Gã wiemɔ',
    progress: 40,
    steps: ['done', 'wip', 'todo'],
    heroSize: 54,
  },
  {
    id: 'ewe',
    name: 'Ewe',
    native: 'Eʋegbe',
    progress: 35,
    steps: ['done', 'wip', 'todo'],
    heroSize: 54,
  },
  {
    id: 'dagbani',
    name: 'Dagbani',
    native: 'Dagbanli',
    progress: 15,
    steps: ['wip', 'todo', 'todo'],
    heroSize: 40,
  },
  {
    id: 'hausa',
    name: 'Hausa',
    native: 'Harshen Hausa',
    progress: 25,
    steps: ['wip', 'todo', 'todo'],
    heroSize: 40,
  },
];

export const LANGUAGE_BY_ID = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));

export const STEP_LABELS = ['Menus', 'Messages & jobs', 'Career Buddy'];

/* Modal copy, `{name}` is the language name. */
export const LANGUAGE_MODAL_COPY = {
  badge: 'Coming soon',
  title: (name) => `${name} is on its way`,
  body: 'We’re translating GTH with native speakers so it sounds like home, not like a robot. Until then, keep using English. Nothing you’ve done changes.',
  progress: (name) => `How far along ${name} is`,
  ping: (name) => `Ping me when ${name} is ready`,
  keep: 'Keep using English',
  footerLead: (name) => `Speak ${name} fluently?`,
  footerLink: 'Help us translate →',
  close: 'Close',
};

/*
 * Art band bubbles. The hero bubble is the chosen language; the four slots around it keep their place and hold the
 * other languages in this order, the chosen language's own slot being taken by Twi (read from the five frames:
 * Twi hero -> Ewe/Ga/Hausa/Dagbani, Ga hero -> Ewe/Twi/Hausa/Dagbani, Ewe -> Twi/Ga/Hausa/Dagbani,
 * Dagbani -> Ewe/Ga/Hausa/Twi, Hausa -> Ewe/Ga/Twi/Dagbani).
 */
export const BUBBLE_SLOTS = ['ewe', 'ga', 'hausa', 'dagbani'];

export const bubbleSlotsFor = (id) => BUBBLE_SLOTS.map((slot) => (slot === id ? 'twi' : slot));

/* Hero bubble boxes (x, y, w, h in the 557x210 art band), per language, from the frames. */
export const HERO_BOX = {
  twi: { x: 197, y: 40, w: 155, h: 107 },
  ga: { x: 208, y: 40, w: 138, h: 106 },
  ewe: { x: 194, y: 40, w: 174, h: 109 },
  dagbani: { x: 171, y: 54, w: 222, h: 98 },
  hausa: { x: 189, y: 54, w: 186, h: 95 },
};
