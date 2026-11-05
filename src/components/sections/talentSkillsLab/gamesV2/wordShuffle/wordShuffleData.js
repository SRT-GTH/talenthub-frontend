/*
 * wordShuffleData — mock payload shaped like the future `GET /skills-lab/games/word-shuffle/words?level=…` response: six job
 * titles per level, each `{ word, field, scramble }` (`scramble` = the letters in the order the tray first shows them).
 *
 * DRAWN IN FIGMA (exact): Intermediate · word 3 = MIDWIFE, field "Health", 7 letters, tray F I W D E M I.        (WS-01 … WS-04)
 * ⚠️ ASSUMPTION: every other word, its field clue and its scramble is mine (letters checked by `validateWordBank`: same letters
 * as the word, never already solved, never starts with the right letter); the word length per level (Beginner 5–6, Intermediate
 * 7–8, Advanced 9–10, Expert 11–12), the 6 words per run (drawn: "Word 3 of 6") and the run clock per level are mine too.
 * ⚠️ ASSUMPTION: scoring — a word is worth 1; the hint costs ¼ ("Hint · costs ¼ of this word", "this word is now worth ¾");
 * a correct second try also costs ¼ (not drawn); a skipped / failed word is worth 0. Score = points / 6 × 100.
 * ⚠️ ASSUMPTION: run clock (drawn "0:52 left" at word 3 of an Intermediate run): Beginner 3:30, Intermediate 3:00, Advanced
 * 3:00, Expert 2:30, shared by the six words, paused while a word is shown as solved.
 */
export const WORD_SHUFFLE_WORDS_PER_RUN = 6;
export const WORD_SHUFFLE_RUN_SECONDS = {
  beginner: 210,
  intermediate: 180,
  advanced: 180,
  expert: 150,
};
export const WORD_SHUFFLE_BEST_SO_FAR = 74; // drawn (mock)
export const WORD_SHUFFLE_HINT_COST = 0.25;
export const WORD_SHUFFLE_RETRY_COST = 0.25; // ⚠️ ASSUMPTION

export const WORD_SHUFFLE_BANK = {
  beginner: [
    { word: 'NURSE', field: 'Health', scramble: 'ENSUR' },
    { word: 'BAKER', field: 'Food', scramble: 'KEARB' },
    { word: 'TAILOR', field: 'Fashion', scramble: 'IRLTAO' },
    { word: 'DRIVER', field: 'Transport', scramble: 'IRERDV' },
    { word: 'FARMER', field: 'Agriculture', scramble: 'ARMREF' },
    { word: 'PILOT', field: 'Aviation', scramble: 'ILPOT' },
  ],
  intermediate: [
    { word: 'TEACHER', field: 'Education', scramble: 'CREAEHT' },
    { word: 'ENGINEER', field: 'Technology', scramble: 'IEEREGNN' },
    { word: 'MIDWIFE', field: 'Health', scramble: 'FIWDEMI' },
    { word: 'MECHANIC', field: 'Transport', scramble: 'EHCCIAMN' },
    { word: 'DESIGNER', field: 'Creative', scramble: 'EIDGRESN' },
    { word: 'DENTIST', field: 'Health', scramble: 'TDESNTI' },
  ],
  advanced: [
    { word: 'ARCHITECT', field: 'Construction', scramble: 'TAIHCCTER' },
    { word: 'PHARMACIST', field: 'Health', scramble: 'CSAIPARMTH' },
    { word: 'ACCOUNTANT', field: 'Finance', scramble: 'TNCACONUAT' },
    { word: 'PROGRAMMER', field: 'Software', scramble: 'GMRAREPMRO' },
    { word: 'JOURNALIST', field: 'Media', scramble: 'SAUNROJITL' },
    { word: 'AGRONOMIST', field: 'Agriculture', scramble: 'GIASTOONMR' },
  ],
  expert: [
    { word: 'ELECTRICIAN', field: 'Trades', scramble: 'ITICENRCAEL' },
    { word: 'RADIOGRAPHER', field: 'Health', scramble: 'AIHGAPERDRRO' },
    { word: 'PHOTOGRAPHER', field: 'Creative', scramble: 'OHOGPRTHRPEA' },
    { word: 'ANAESTHETIST', field: 'Health', scramble: 'HSTTATIESNEA' },
    { word: 'STATISTICIAN', field: 'Data', scramble: 'TTANISISTCAI' },
    { word: 'CARTOGRAPHER', field: 'Mapping', scramble: 'HRARACTPGOER' },
  ],
};

const letters = (text) => [...text].sort().join('');

/* programmatic check of the bank (run by the verification script and cheap enough for dev) */
export const validateWordBank = (bank = WORD_SHUFFLE_BANK) => {
  const problems = [];
  Object.entries(bank).forEach(([level, list]) => {
    if (list.length !== WORD_SHUFFLE_WORDS_PER_RUN)
      problems.push(`${level}: needs ${WORD_SHUFFLE_WORDS_PER_RUN} words`);
    list.forEach(({ word, field, scramble }) => {
      if (!/^[A-Z]+$/.test(word)) problems.push(`${level}/${word}: not A-Z`);
      if (letters(word) !== letters(scramble))
        problems.push(`${level}/${word}: scramble ${scramble} has other letters`);
      if (scramble === word) problems.push(`${level}/${word}: scramble equals the word`);
      if (scramble[0] === word[0])
        problems.push(`${level}/${word}: scramble starts with the right letter`);
      if (!field) problems.push(`${level}/${word}: no field clue`);
    });
  });
  return problems;
};

/* "MIDWIFE" → "Midwife" */
export const titleCase = (word) => word.charAt(0) + word.slice(1).toLowerCase();

/*
 * Figma frames → seeded state (`?f=WS-0x`; clock frozen). Tile ids are positions in `scramble` (F0 I1 W2 D3 E4 M5 I6).
 *   answer   tile ids in the answer row            locked   the hint-locked first tile id (or null)
 *   wrongs   wrong checks so far (1 → "Last try")  status   idle | wrong | correct
 *   solved / hints   words solved and hints used in the earlier words (the strip counts them)
 *   hintOnWord       the hint was used on this word        seconds   the drawn clock
 */
export const WORD_SHUFFLE_FRAMES = {
  'WS-01': {
    level: 'intermediate',
    wordIndex: 2,
    answer: [5, 1, 3],
    locked: null,
    wrongs: 0,
    status: 'idle',
    solved: 2,
    hints: 1,
    hintOnWord: false,
    seconds: 52,
  },
  'WS-02': {
    level: 'intermediate',
    wordIndex: 2,
    answer: [5, 1, 3, 0, 6, 2, 4],
    locked: null,
    wrongs: 1,
    status: 'wrong',
    solved: 2,
    hints: 1,
    hintOnWord: false,
    seconds: 52,
  },
  'WS-03': {
    level: 'intermediate',
    wordIndex: 2,
    answer: [5],
    locked: 5,
    wrongs: 0,
    status: 'idle',
    solved: 2,
    hints: 1,
    hintOnWord: true,
    seconds: 52,
  },
  'WS-04': {
    level: 'intermediate',
    wordIndex: 2,
    answer: [5, 1, 3, 2, 6, 0, 4],
    locked: null,
    wrongs: 0,
    status: 'correct',
    solved: 2,
    hints: 1,
    hintOnWord: false,
    seconds: 31,
  },
};
