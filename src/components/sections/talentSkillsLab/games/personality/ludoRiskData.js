/*
 * Ludo Risk mock content (Figma SL-GP12 Your roll, Playful 7943:11350 / Focused 8110:498010). Turn 5 — the roll, the
 * three moves with their risk meters (25% low / 60% medium / 85% high), the status chips (You 1 home · Ama 0 home ·
 * Kwesi 2 home), the strip and footer copy — is verbatim from the frame.
 *
 * ⚠️ ASSUMPTION: turns 1–4 and 6–8 (a die roll plus the same three move types, texts templated from the roll), the
 * unchanging status chips, and the completion dialog.
 */
export const MOVES = [
  {
    key: 'A',
    title: 'Bring a new token out',
    icon: 'plus',
    body: 'More tokens on the board, more options later.',
    risk: { label: 'Low', pct: 25, color: '#387440' },
  },
  {
    key: 'B',
    title: 'Run your lead token home',
    icon: 'arrow',
    body: (roll) => `${roll} steps puts it ${Math.max(0, 8 - roll)} from home. Ama could catch it.`,
    risk: { label: 'Medium', pct: 60, color: '#c8951a' },
  },
  {
    key: 'C',
    title: "Capture Kwesi's token",
    icon: 'target',
    body: 'Send him back to start. He will want revenge.',
    risk: { label: 'High', pct: 85, color: '#c0392b' },
  },
];

/* Turn 5 is drawn (roll 6). ⚠️ ASSUMPTION: the other rolls and "Ama is N squares behind". */
export const TURNS = [
  { roll: 3, behind: 6 },
  { roll: 5, behind: 5 },
  { roll: 2, behind: 5 },
  { roll: 4, behind: 4 },
  { roll: 6, behind: 4, drawn: true },
  { roll: 1, behind: 3 },
  { roll: 4, behind: 3 },
  { roll: 6, behind: 2 },
];

export const LUDO = {
  gameId: 'ludo-risk',
  title: 'Personality game · Ludo Risk',
  subtitle: '8 turns · No wrong moves · About 3 min left',
  doneSubtitle: '8 turns · Game done',
  xp: '+20 {xp}',
  doneXp: '+50 {xp}',
  progressNote: 'Saved every turn',
  doneNote: 'Saved',
  info: 'Safe or bold, there is no wrong move. We look at the pattern across 8 turns.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Risk appetite', 'Emotional stability'],
  stats: [
    { icon: 'home', label: 'You: 1 home' },
    { icon: 'users', label: 'Ama: 0 home' },
    { icon: 'users', label: 'Kwesi: 2 home' },
  ],
  dice: { sub: 'Pick what to do with it.' },
  complete: {
    sticker: 'GAME OVER',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Calculated Risk-taker.',
    body: 'You mixed safe moves with a few bold ones and stayed level when a roll went against you.',
    stats: [
      { value: '8 of 8', label: 'TURNS', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      {
        label: 'Risk appetite',
        note: 'Bold when the odds were fair',
        chip: 'Balanced',
        strong: true,
      },
      { label: 'Emotional stability', note: 'No panic after a bad roll', chip: '+5', strong: true },
    ],
    next: null,
    actions: { secondary: 'Back to games', primary: 'Replay game' },
  },
};
