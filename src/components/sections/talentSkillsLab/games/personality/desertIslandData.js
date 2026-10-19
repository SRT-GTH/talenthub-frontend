/*
 * Desert Island mock content (Figma SL-GP06 Pack your bag, Playful 7943:10013 / Focused 8110:497421). Copy verbatim from
 * the frame. ⚠️ ASSUMPTION: parts 2 and 3 (the game catalogue only says "Pick 5 of 12 items to keep. Then pick who to
 * save."), the countdown behaviour and the completion dialog.
 */
export const ISLAND = {
  gameId: 'desert-island',
  title: 'Personality game · Desert Island',
  subtitle: '3 parts · No wrong answers · About 4 min left',
  xp: '+15 {xp}',
  doneXp: '+50 {xp}',
  doneSubtitle: '3 parts · Game done',
  progressNote: 'Saved as you go',
  doneNote: 'Saved',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  startSeconds: 72,
  reads: ['Decisiveness', 'Practical vs bold'],
  items: [
    { id: 'water', label: 'Drinking water', icon: 'health' },
    { id: 'radio', label: 'Wind-up radio', icon: 'voice' },
    { id: 'firstaid', label: 'First aid kit', icon: 'heart' },
    { id: 'rope', label: 'Rope', icon: 'link' },
    { id: 'powerbank', label: 'Power bank', icon: 'battery' },
    { id: 'map', label: 'Map of the coast', icon: 'map' },
    { id: 'multitool', label: 'Multi-tool', icon: 'settings' },
    { id: 'lighter', label: 'Lighter', icon: 'bolt' },
    { id: 'tarp', label: 'Tarp', icon: 'layers' },
    { id: 'fishingline', label: 'Fishing line', icon: 'anchor' },
    { id: 'gari', label: 'Gari and sardines', icon: 'cart' },
    { id: 'torch', label: 'Torch', icon: 'bulb' },
  ],
  parts: [
    {
      /* DRAWN: GP06 */
      eyebrow: 'PART 1 · DECISIONS',
      title: ['Pick 5 things ', 'to keep.'],
      body: 'Your boat hit a reef off Ada. You washed up with 12 things from the wreck. Order matters: your first pick counts most.',
      need: 5,
      sticker: (n) => `${n} OF 5 PICKED`,
      stat: (n) => `${n} of 5 picked`,
      info: 'Tap to add or remove. Order matters: your first pick counts most.',
      action: 'Lock my 5',
      pool: 'items',
    },
    {
      /* ⚠️ ASSUMPTION: part 2 — who to save. */
      eyebrow: 'PART 2 · DECISIONS',
      title: ['Pick who to ', 'save.'],
      body: 'A flare shows four people on the reef, and your raft has room for one more. Choose who you pull in first.',
      need: 1,
      sticker: (n) => `${n} OF 1 PICKED`,
      stat: (n) => `${n} of 1 picked`,
      info: 'Tap to choose, tap again to change your mind.',
      action: 'Lock my pick',
      pool: 'people',
    },
    {
      /* ⚠️ ASSUMPTION: part 3 — give one item up. */
      eyebrow: 'PART 3 · DECISIONS',
      title: ['Give one thing ', 'back to the sea.'],
      body: 'The raft is sinking by an inch. Choose one of your five things to let go.',
      need: 1,
      sticker: (n) => `${n} OF 1 PICKED`,
      stat: (n) => `${n} of 1 picked`,
      info: 'Tap to choose. This is the last part.',
      action: 'Let it go',
      pool: 'kept',
    },
  ],
  people: [
    { id: 'ama', label: 'Ama', icon: 'users' },
    { id: 'yaw', label: 'Yaw', icon: 'users' },
    { id: 'esi', label: 'Esi', icon: 'users' },
    { id: 'kojo', label: 'Kojo', icon: 'users' },
  ],
  complete: {
    sticker: 'ISLAND DONE',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Practical Packer.',
    body: 'You packed for staying alive first and kept your picks in a clear order.',
    stats: [
      { value: '5 of 12', label: 'ITEMS KEPT', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      { label: 'Decisiveness', note: 'Locked your picks quickly', chip: '+6', strong: true },
      {
        label: 'Practical vs bold',
        note: 'Safety items came first',
        chip: 'Practical',
        strong: true,
      },
    ],
    next: { title: 'Up next: Trotro Rush', sub: '~4 min · Planning · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
