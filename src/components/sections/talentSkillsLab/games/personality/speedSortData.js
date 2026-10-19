/*
 * Speed Sort mock content (Figma SL-GP09 In play, Playful 7943:10684 / Focused 8110:497715). Verbatim from the frame:
 * title, wave strip, chips, the falling card "Plan Friday's team lunch" (+ its line), the "up next" cards (Fix the printer,
 * New logo ideas, Check on Kofi), the three baskets and their counts (6 / 8 / 4 = 18 sorted, x4 combo, 0:23 left).
 *
 * ⚠️ ASSUMPTION: which basket each card belongs to (the frame highlights Tasks for the falling card; the other three are
 * judged by their wording), the lines of the cards that are not drawn, the card pool beyond the drawn four, a 45-second
 * wave, a combo that resets on a miss (the frame says "No negative marks"), 3 waves, and the completion dialog.
 */
export const BASKETS = [
  { id: 'people', label: 'People', icon: 'users', key: 'Left key', arrow: 'left' },
  { id: 'tasks', label: 'Tasks', icon: 'check', key: 'Down key', arrow: 'down' },
  { id: 'ideas', label: 'Ideas', icon: 'bulb', key: 'Right key', arrow: 'right' },
];

export const CARDS = [
  {
    id: 'lunch',
    title: "Plan Friday's team lunch",
    line: 'Six people, GH₵ 400, someone is vegetarian.',
    basket: 'tasks',
  },
  {
    id: 'printer',
    title: 'Fix the printer',
    line: 'It jams on every second page.',
    basket: 'tasks',
  },
  {
    id: 'logo',
    title: 'New logo ideas',
    line: 'Three rough sketches for the club poster.',
    basket: 'ideas',
  },
  {
    id: 'kofi',
    title: 'Check on Kofi',
    line: 'He has missed the last two meetings.',
    basket: 'people',
  },
  {
    id: 'hall',
    title: 'Book the meeting hall',
    line: 'Thursday, 2pm, room for twelve.',
    basket: 'tasks',
  },
  {
    id: 'mentor',
    title: 'Thank the new mentor',
    line: 'She stayed late to review your CV.',
    basket: 'people',
  },
  {
    id: 'app',
    title: 'An app for lost bags',
    line: 'Scan a tag, ping the owner.',
    basket: 'ideas',
  },
  {
    id: 'invoice',
    title: 'Send the invoice',
    line: 'Due before the end of the month.',
    basket: 'tasks',
  },
  {
    id: 'intern',
    title: 'Welcome the intern',
    line: 'First day, she knows nobody yet.',
    basket: 'people',
  },
  {
    id: 'game',
    title: 'A quiz night for the team',
    line: 'Teams of three, small prizes.',
    basket: 'ideas',
  },
];

export const SPEED = {
  gameId: 'speed-sort',
  title: 'Personality game · Speed Sort',
  subtitle: '3 waves · No negative marks · About 2 min left',
  xp: '+25 {xp}',
  doneXp: '+50 {xp}',
  doneSubtitle: '3 waves · Game done',
  progressNote: 'Use arrow keys or tap a basket',
  doneNote: 'Saved',
  info: 'Keyboard: left, down, right. No negative marks, only speed and patterns.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Focus', 'People vs tasks'],
  waveSeconds: 45,
  waves: [
    { eyebrow: 'WAVE 1 · SPEED' },
    { eyebrow: 'WAVE 2 · SPEED' },
    { eyebrow: 'WAVE 3 · SPEED' },
  ],
  title2: ['Sort it fast: People, Tasks ', 'or Ideas?'],
  body: 'Cards fly in. Use the arrow keys or tap a basket. No negative marks, only speed and patterns.',
  upNext: 'UP NEXT',
  complete: {
    sticker: 'ALL SORTED',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Fast Sorter.',
    body: 'You kept the cards moving and found a steady rhythm across all three waves.',
    stats: [
      { value: '3 of 3', label: 'WAVES', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      { label: 'Focus', note: 'Stayed on the cards', chip: '+6', strong: true },
      { label: 'People vs tasks', note: 'Balanced across baskets', chip: 'Steady', strong: true },
    ],
    next: { title: 'Up next: Tower Builder', sub: '~4 min · Logic · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
