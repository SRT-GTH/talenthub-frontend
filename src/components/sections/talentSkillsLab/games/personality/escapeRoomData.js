/*
 * The Escape Room mock content (Figma SL-GP05 Room 1, Playful 7943:9837 / Focused 8110:497323). Copy verbatim from the
 * frame. ⚠️ ASSUMPTION: rooms 2–4 (they reuse the drawn room, its four spots and answers — only the question changes),
 * the countdown behaviour and the completion dialog (Figma draws neither).
 */
export const ESCAPE = {
  gameId: 'escape-room',
  title: 'Personality game · The Escape Room',
  subtitle: '4 rooms · No wrong answers · About 4 min left',
  xp: '+10 {xp}',
  doneXp: '+50 {xp}',
  doneSubtitle: '4 rooms · Game done',
  progressNote: 'Saved after every room',
  doneNote: 'Saved',
  info: 'Tap a spot in the room, or pick from the list. Fast or careful, both are fine.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  startSeconds: 227,
  reads: ['Plan vs improvise', 'Calm under pressure'],
  /* Spot positions are the Figma offsets inside the 1040x528 room (left, top). */
  spots: [
    { key: 'A', name: 'Cabinet', choice: 'Search the cabinet', icon: 'folder', x: 791, y: 283 },
    { key: 'B', name: 'Desk', choice: 'Read the desk notes', icon: 'file', x: 490, y: 358 },
    { key: 'C', name: 'Door', choice: 'Try the door', icon: 'lock', x: 104, y: 264 },
    {
      key: 'D',
      name: 'Stay still and look',
      choice: 'Stand still, take it in',
      icon: 'eye',
      x: 283,
      y: 471,
    },
  ],
  rooms: [
    {
      sticker: 'ROOM 1',
      eyebrow: 'ROOM 1 · STRATEGY',
      title: ['The door locked behind you. What do you ', 'check first?'],
      body: 'Tap a spot in the room or pick from the list. Fast or careful, both are fine.',
      clues: 'Clues 1 of 4',
    },
    {
      sticker: 'ROOM 2',
      eyebrow: 'ROOM 2 · STRATEGY',
      title: ['You found a small key. What do you ', 'try next?'],
      body: 'Tap a spot in the room or pick from the list. Fast or careful, both are fine.',
      clues: 'Clues 2 of 4',
    },
    {
      sticker: 'ROOM 3',
      eyebrow: 'ROOM 3 · STRATEGY',
      title: ['The lights flicker. What do you ', 'do now?'],
      body: 'Tap a spot in the room or pick from the list. Fast or careful, both are fine.',
      clues: 'Clues 3 of 4',
    },
    {
      sticker: 'ROOM 4',
      eyebrow: 'ROOM 4 · STRATEGY',
      title: ['One clue left, and the clock is short. ', 'Where now?'],
      body: 'Tap a spot in the room or pick from the list. Fast or careful, both are fine.',
      clues: 'Clues 4 of 4',
    },
  ],
  complete: {
    sticker: 'ROOM CLEARED',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Calm Solver.',
    body: 'You checked the room one spot at a time and kept your head while the clock ran.',
    stats: [
      { value: '4 of 4', label: 'ROOMS', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      {
        label: 'Plan vs improvise',
        note: 'Checked the obvious spots first',
        chip: '+6',
        strong: true,
      },
      {
        label: 'Calm under pressure',
        note: 'Kept going as time ran down',
        chip: '+5',
        strong: true,
      },
    ],
    next: { title: 'Up next: Desert Island', sub: '~4 min · Decisions · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
