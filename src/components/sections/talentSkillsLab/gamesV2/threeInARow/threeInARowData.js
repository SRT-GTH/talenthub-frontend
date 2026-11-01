/*
 * Three in a Row — copy, seeds and result scoring (Figma "Games v2 · Three in a Row": TR-01 9619:62695 / 9619:65642,
 * TR-02 9619:63430 / 9619:66243, TR-03 9619:64174 / 9619:66853, TR-04 9619:64912 / 9619:67457). Mock payload shaped like a future
 * `GET /skills-lab/games/three-in-a-row/match` response. Only the INTERMEDIATE, game-2-of-3 frames are drawn: everything tagged
 * ⚠️ ASSUMPTION is invented, in Kwaku's voice, and never contradicts a drawn frame.
 */
export const TR_GAMES = 3;
export const TR_KWAKU_DELAY_MS = 800; // ⚠️ ASSUMPTION: "Kwaku is thinking" lasts about 0.8 s
export const TR_NOTICE_MS = 2600; // ⚠️ ASSUMPTION: how long the "square taken" notice stays

export const TR_COPY = {
  yourMove: 'Your move. Get three in a row.',
  thinking: 'Kwaku is thinking…',
  won: 'Three in a row!',
  sub: 'Kwaku blocks the obvious lines, so think one move ahead.',
  statusYou: 'Your turn · you are X',
  statusKwaku: 'Kwaku’s turn',
  statusTaken: 'Still your turn · no penalty',
  taken: 'That square is taken. Pick an empty one.',
  thinkingChip: 'Kwaku is thinking',
  resign: 'Resign this game',
  next: 'Next game',
  // ⚠️ ASSUMPTION: the end-of-match button (the frames only draw "Next game")
  seeResult: 'See my result',
  // ⚠️ ASSUMPTION for the other levels; "Kwaku plays well" is the drawn Intermediate label
  playsLevel: {
    beginner: 'Kwaku plays gently',
    intermediate: 'Kwaku plays well',
    advanced: 'Kwaku plays sharp',
    expert: 'Kwaku rarely slips',
  },
};

/* Kwaku's lines. Drawn: start, fork, win, taken. ⚠️ ASSUMPTION: the rest. */
export const TR_QUOTES = {
  start: 'Your move. I’m watching that corner.',
  fork: 'Hmm. Two ways to win. Clever.',
  playerWins: 'Ei! You set that up two moves ago.',
  taken: 'That one’s mine, my friend.',
  thinking: 'Hmm. Let me see.',
  kwakuWins: 'Ha! Three in a row for me.',
  draw: 'Ei, a draw. Well played.',
  resigned: 'Fair enough. That game is mine.',
};

export const emptyBoard = () => Array(9).fill(null);

/*
 * Seeds for `?f=TR-0x` — the exact Figma state (game 2 of 3, Intermediate, you 1 · Kwaku 0), frozen (no Kwaku timer, no input).
 * board: X = you, O = Kwaku. `hover` forces the hover look on a cell (TR-01 draws the ghost X on the last cell).
 */
export const TR_SEEDS = {
  'TR-01': {
    board: ['X', null, 'O', null, 'X', null, 'O', null, null],
    hover: 8,
    turn: 'you',
    quote: TR_QUOTES.start,
  },
  'TR-02': {
    board: ['X', null, 'O', null, 'X', 'X', 'O', null, null],
    turn: 'kwaku',
    quote: TR_QUOTES.fork,
  },
  'TR-03': {
    board: ['X', 'O', 'O', null, 'X', 'X', 'O', null, 'X'],
    turn: 'you',
    over: true,
    outcome: 'you',
    win: [0, 4, 8],
    results: ['you', 'you', null],
    quote: TR_QUOTES.playerWins,
  },
  'TR-04': {
    board: ['X', null, 'O', null, 'X', null, 'O', null, null],
    turn: 'you',
    notice: 2,
    quote: TR_QUOTES.taken,
  },
};

export const RESULT_TEXT = { you: 'You won', kwaku: 'Kwaku won', draw: 'Drawn' };

/* Result payload for GameV2Result (contract: score 0–100, skills, summary, verifies). ⚠️ ASSUMPTION: scoring = share of match points (win 1, draw ½). */
export const scoreMatch = (results) => {
  const wins = results.filter((r) => r === 'you').length;
  const draws = results.filter((r) => r === 'draw').length;
  const losses = results.filter((r) => r === 'kwaku').length;
  const score = Math.round(((wins + draws * 0.5) / TR_GAMES) * 100);
  return {
    score,
    skills: [{ label: 'Strategic thinking', value: score }],
    summary: `You won ${wins}, drew ${draws} and lost ${losses} of ${TR_GAMES} games against Kwaku.`,
    verifies: 'Strategic thinking',
  };
};
