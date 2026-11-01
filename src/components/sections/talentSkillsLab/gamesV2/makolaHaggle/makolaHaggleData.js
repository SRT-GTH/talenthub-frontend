import { callServer } from '../serverGame/mockServer.js';

/*
 * Makola Haggle (Games v2) mock content + mock server. Shaped like `GET /skills-lab/games/makola-haggle` (rounds) and
 * `POST /skills-lab/games/makola-haggle/rounds/:n/move` ("server" game: every move is validated server-side, the client only
 * sends { round, move }). A play-style game: no right answers, no score.
 *
 * DRAWN (Figma MH-01 / MH-02 = round 2): eyebrow, title "Auntie says GH₵ 165. Your move.", body, the stat pills, Auntie's line,
 * "You: …", the item tag, the four moves (A–D, titles, subs, icons), "YOUR PICK", "Walk away" / "Next round", 4 rounds.
 * ⚠️ ASSUMPTION: rounds 1, 3, 4 (copy adapted from the legacy Arcade Makola Haggle), round 4's "See my play style" button, the mock
 * endpoint + delay, "Checking…", footer "Walk away" = move C, the move → trait weights, the play-style names and the result
 * copy in `summarise`. "Auntie: Warm" stays the same every round. Levels change nothing here.
 */
export const MAKOLA_HAGGLE = {
  gameId: 'makola-haggle',
  name: 'Makola Haggle',
  subtitle: 'Play style · 4 rounds · an early read, never shown to recruiters',
  sticker: 'EARLY READ',
  total: 4,
  note: 'No right answers',
  reads: ['How you bargain', 'How you handle pressure'],
  stats: ['Auntie: Warm', 'Budget GH₵ 160'],
};

export const MOVE_KINDS = ['counter', 'bundle', 'walk', 'pay'];
export const WALK_MOVE = 2;

const BODY = 'Kente-print fabric, 6 yards. Your budget is GH₵ 160.';
const WALK = { title: 'Walk away politely', sub: '"Thank you Auntie, let me check around"' };
const BUNDLE = { title: 'Bundle it', sub: '"Two pieces for GH₵ 300 and we are friends"' };

export const ROUNDS = [
  {
    // ⚠️ ASSUMPTION (round 1)
    eyebrow: 'ROUND 1 · MAKOLA MARKET',
    title: 'Auntie says GH₵ 180. Your move.',
    body: BODY,
    auntie: '"Akwaaba! Best kente in Makola. For you, my dear, GH₵ 180."',
    you: 'You: "Good morning, Auntie."',
    tag: { title: 'Kente-print fabric · 6 yards', sub: 'Asking GH₵ 180' },
    moves: [
      { title: 'Counter at GH₵ 120', sub: 'Open low and see what she does' },
      BUNDLE,
      WALK,
      { title: 'Pay GH₵ 180', sub: 'Keep the peace and save time' },
    ],
  },
  {
    // DRAWN (round 2)
    eyebrow: 'ROUND 2 · MAKOLA MARKET',
    title: 'Auntie says GH₵ 165. Your move.',
    body: BODY,
    auntie: '"Ah, you want to finish me! 120 is too small. For you, my dear, GH₵ 165. Last price."',
    you: 'You: "Auntie, 120 cedis, I beg."',
    tag: { title: 'Kente-print fabric · 6 yards', sub: 'Started at GH₵ 180 · now GH₵ 165' },
    moves: [
      { title: 'Counter at GH₵ 140', sub: 'Smile and meet her closer to the middle' },
      BUNDLE,
      WALK,
      { title: 'Pay GH₵ 165', sub: 'Keep the peace and save time' },
    ],
  },
  {
    // ⚠️ ASSUMPTION (round 3)
    eyebrow: 'ROUND 3 · MAKOLA MARKET',
    title: 'Auntie says GH₵ 155. Your move.',
    body: BODY,
    auntie: '"Eh! You are a hard one. GH₵ 155, and I am not smiling for free."',
    you: 'You: "Auntie, 140 and I take it now."',
    tag: { title: 'Kente-print fabric · 6 yards', sub: 'Started at GH₵ 180 · now GH₵ 155' },
    moves: [
      { title: 'Counter at GH₵ 145', sub: 'Stay friendly and nudge it down' },
      BUNDLE,
      WALK,
      { title: 'Pay GH₵ 155', sub: 'Keep the peace and save time' },
    ],
  },
  {
    // ⚠️ ASSUMPTION (round 4)
    eyebrow: 'ROUND 4 · MAKOLA MARKET',
    title: 'Auntie says GH₵ 150. Your move.',
    body: 'Kente-print fabric, 2 pieces. Your budget is GH₵ 160.',
    auntie: '"Two pieces, GH₵ 150, and that is my last word. Take it or leave it."',
    you: 'You: "Auntie, 145 for the two."',
    tag: { title: 'Kente-print fabric · 2 pieces', sub: 'Started at GH₵ 180 · now GH₵ 150' },
    moves: [
      { title: 'Counter at GH₵ 145', sub: 'One last small push' },
      { title: 'Ask for a free gift', sub: '"Add a small cloth and it is a deal"' },
      WALK,
      { title: 'Pay GH₵ 150', sub: 'Close the deal and keep her smiling' },
    ],
  },
];

/* "POST …/rounds/:n/move" — the server validates the move and answers with what it read from it. */
export const submitMove = ({ round, move }) =>
  callServer(`makola-haggle round ${round + 1}`, () => ({
    round,
    move,
    kind: MOVE_KINDS[move],
    accepted: true,
  }));

// ⚠️ ASSUMPTION: how a run turns into a play style. picks = move index per round.
const STYLES = [
  { kind: 'walk', min: 2, name: 'The Patient Walker' },
  { kind: 'pay', min: 2, name: 'The Peacekeeper' },
  { kind: 'bundle', min: 2, name: 'The Deal Builder' },
];
const FALLBACK_STYLE = 'The Warm Closer';

export const summarise = (picks) => {
  const count = (kind) => picks.filter((m) => MOVE_KINDS[m] === kind).length;
  const style = STYLES.find((s) => count(s.kind) >= s.min)?.name ?? FALLBACK_STYLE;
  const pushed = count('counter') + count('bundle');
  const parts = [
    ['counter', 'counter'],
    ['bundle', 'bundle'],
    ['walk', 'walk-away'],
    ['pay', 'pay'],
  ]
    .map(([kind, word]) => [count(kind), word])
    .filter(([n]) => n > 0)
    .map(([n, word]) => `${n} ${word}${n > 1 ? 's' : ''}`);
  return {
    score: 0,
    playStyle: style,
    skills: [
      { label: 'How you bargain', value: Math.min(100, 30 + pushed * 20) },
      {
        label: 'How you handle pressure',
        value: Math.min(100, 40 + count('walk') * 20 + count('counter') * 10),
      },
    ],
    summary: `You played ${picks.length} rounds with Auntie Akos: ${parts.join(', ')}.`,
  };
};
