/*
 * Makola Haggle mock content (Figma SL-GP03 Playful 7943:9243 / Focused 8110:496930, GP03b 7943:9436 / 8110:497028,
 * GP04 7943:9631 / 8110:497126). Copy is verbatim; rounds 1, 3 and 4 and the picks -> result mapping are
 * ⚠️ ASSUMPTION (Figma draws round 2 and the completion only). {xp} -> XP / pts.
 */

const MAKOLA_STATS = [
  { icon: 'smile', label: 'Auntie: Warm' },
  { icon: 'wallet', label: 'Budget GH₵ 160' },
  { icon: 'heart', label: 'Patience: still smiling' },
];
const MAKOLA_MOVES_ICONS = ['down', 'bundle', 'walk', 'pay'];

export const MAKOLA = {
  gameId: 'makola-haggle',
  title: 'Personality game · Makola Haggle',
  subtitle: '4 rounds · No wrong moves · About 3 min left',
  doneSubtitle: 'Game 1 of 3 done',
  xp: '+20 {xp}',
  doneXp: '+50 {xp}',
  progressNote: 'Saved after every round',
  doneNote: 'Saved',
  info: 'Pick a move. Walking away is a real choice too.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Agreeableness', 'Decisiveness'],
  icons: MAKOLA_MOVES_ICONS,
  rounds: [
    {
      /* ⚠️ ASSUMPTION: round 1 (not drawn) — opening offer, same voice and layout as the drawn round 2. */
      sticker: 'ROUND 1',
      eyebrow: 'ROUND 1 · SOCIAL',
      title: ['Auntie says GH₵ 180. ', 'Your move?'],
      body: 'Kente-print fabric, 6 yards. She opens at GH₵ 180 and you have GH₵ 160. Say hello and name a price.',
      stats: MAKOLA_STATS,
      auntie: 'AUNTIE AKOS',
      auntieLine: '"Akwaaba! Best kente in Makola. For you, my dear, GH₵ 180."',
      youLine: 'You: "Good morning, Auntie."',
      tag: { title: 'Kente-print fabric · 6 yards', sub: 'Asking GH₵ 180' },
      moves: [
        { title: 'Counter at GH₵ 120', sub: 'Open low and see what she does' },
        { title: 'Bundle it', sub: '"What if I take two pieces?"' },
        { title: 'Walk away politely', sub: '"Thank you Auntie, let me check around"' },
        { title: 'Pay GH₵ 180', sub: 'Keep the peace and save time' },
      ],
    },
    {
      /* DRAWN: GP03 / GP03b */
      sticker: 'ROUND 2',
      eyebrow: 'ROUND 2 · SOCIAL',
      title: ['Auntie says GH₵ 165. ', 'Your move?'],
      body: 'Kente-print fabric, 6 yards. She started at GH₵ 180 and you have GH₵ 160. Keep it friendly or push for a deal.',
      stats: MAKOLA_STATS,
      auntie: 'AUNTIE AKOS',
      auntieLine:
        '"Ah, you want to finish me! 120 is too small. For you, my dear, GH₵ 165. Last price."',
      youLine: 'You: "Auntie, 120 cedis, I beg."',
      tag: { title: 'Kente-print fabric · 6 yards', sub: 'Started at GH₵ 180 · now GH₵ 165' },
      moves: [
        { title: 'Counter at GH₵ 140', sub: 'Smile and meet her closer to the middle' },
        { title: 'Bundle it', sub: '"Two pieces for GH₵ 300 and we are friends"' },
        { title: 'Walk away politely', sub: '"Thank you Auntie, let me check around"' },
        { title: 'Pay GH₵ 165', sub: 'Keep the peace and save time' },
      ],
    },
    {
      /* ⚠️ ASSUMPTION: round 3 (not drawn). */
      sticker: 'ROUND 3',
      eyebrow: 'ROUND 3 · SOCIAL',
      title: ['Auntie says GH₵ 155. ', 'Your move?'],
      body: 'She came down again. You have GH₵ 160, so GH₵ 155 is nearly yours. Her smile is getting thinner.',
      stats: MAKOLA_STATS,
      auntie: 'AUNTIE AKOS',
      auntieLine: '"Eh! You are a hard one. GH₵ 155, and I am not smiling for free."',
      youLine: 'You: "Auntie, 140 and I take it now."',
      tag: { title: 'Kente-print fabric · 6 yards', sub: 'Started at GH₵ 180 · now GH₵ 155' },
      moves: [
        { title: 'Counter at GH₵ 145', sub: 'Stay friendly and nudge it down' },
        { title: 'Bundle it', sub: '"Two pieces for GH₵ 300 and we are friends"' },
        { title: 'Walk away politely', sub: '"Thank you Auntie, let me check around"' },
        { title: 'Pay GH₵ 155', sub: 'Keep the peace and save time' },
      ],
    },
    {
      /* ⚠️ ASSUMPTION: round 4 (not drawn). */
      sticker: 'ROUND 4',
      eyebrow: 'ROUND 4 · SOCIAL',
      title: ['Auntie says GH₵ 150. ', 'Your move?'],
      body: 'Two pieces, one price. She says she will not move again after this.',
      stats: MAKOLA_STATS,
      auntie: 'AUNTIE AKOS',
      auntieLine: '"Two pieces, GH₵ 150, and that is my last word. Take it or leave it."',
      youLine: 'You: "Auntie, 145 for the two."',
      tag: { title: 'Kente-print fabric · 2 pieces', sub: 'Started at GH₵ 180 · now GH₵ 150' },
      moves: [
        { title: 'Counter at GH₵ 145', sub: 'One last small push' },
        { title: 'Ask for a free gift', sub: '"Add a small cloth and it is a deal"' },
        { title: 'Walk away politely', sub: '"Thank you Auntie, let me check around"' },
        { title: 'Pay GH₵ 150', sub: 'Close the deal and keep her smiling' },
      ],
    },
  ],
  complete: {
    sticker: 'DEAL DONE',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Warm Closer.',
    body: 'You pushed for a fair price but kept Auntie smiling the whole way. Final deal: GH₵ 150 for 2 pieces.',
    stats: [
      { value: 'GH₵ 150', label: 'FINAL DEAL', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '1 of 3', label: 'GAMES PLAYED', tone: 'green' },
    ],
    traits: [
      { label: 'Agreeableness', note: 'Kept things friendly', chip: '+8', strong: true },
      { label: 'Decisiveness', note: 'Closed before it got tense', chip: '+5', strong: true },
      {
        label: 'Emotional stability',
        note: 'Stayed calm at "last price"',
        chip: '+3',
        strong: true,
      },
      { label: 'Openness', note: 'Tried the bundle idea', chip: 'Steady', strong: false },
    ],
    next: { title: 'Up next: The Escape Room', sub: '~5 min · Strategy · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
