/*
 * Skills Lab — lab FLOW mock data (the question-by-question play screens, Figma "Talent - Skills Lab" SL-L05 … SL-L18h).
 * One entry per lab in LAB_FLOWS, shaped like the API it will be swapped for:
 *   GET  /skills-lab/labs/:id/session         -> flow.session   (where the talent is: answered results, xp, streak)
 *   GET  /skills-lab/labs/:id/questions       -> flow.questions (8 for Python)
 *   POST /skills-lab/labs/:id/attempts/:attemptId/answers  { questionId, optionId, hintUsed }  (-> correct + explanation)
 *   GET  /skills-lab/labs/:id/attempts/:attemptId/result   -> a RESULT_SCENARIOS entry filled with the real numbers
 * HOW ANOTHER LAB PLUGS IN: add a "python-style" block below that builds a flow object like PYTHON_FLOW and register it
 * in LAB_FLOWS. Each question has a `kind` ('code-output' | 'chart' | 'scenario' | 'chess' | …) that picks its renderer
 * from labQuestionKinds.jsx. Full recipe: the LAB_FLOW_GUIDE comment at the top of LabPlayPage.jsx.
 *
 * Copy tokens: {xp} → "XP" in Playful, "pts" in Focused (Figma swaps the word); {n} {total} {passMark} {title} {earned}.
 */

/* ---- shared ---- */
// Result scenarios as drawn for Python (SL-L10 verified, SL-L10b perfect, SL-L11 fail, SL-L11b tough). Other labs reuse
// them as-is (Figma repeats the same modal for every lab) and only swap the numbers / topics / refresher.
export const RESULT_SCENARIOS = {
  verified: {
    id: 'verified',
    tone: 'pass',
    medallion: 'check',
    sticker: 'VERIFIED',
    confetti: 'verified',
    eyebrow: 'SKILL VERIFIED',
    heading: [
      ['{title} ', false],
      ['verified.', true],
    ],
    body: 'You got {n} of {total}. The Verified badge is now on {title} on your card, and it moves to the top of your skills.',
    stats: [
      { value: '{n}/{total}', label: 'CORRECT', tone: 'green' },
      { value: '+{earned} {xp}', label: 'EARNED', tone: 'gold' },
      { value: 'Verified', label: 'BADGE ADDED', tone: 'green' },
    ],
    actions: { secondary: 'Back to Skills Lab', primary: 'See it on my skills' },
  },
  perfect: {
    id: 'perfect',
    tone: 'pass',
    medallion: 'star',
    sticker: 'PERFECT',
    confetti: 'perfect',
    eyebrow: 'SKILL VERIFIED · PERFECT SCORE',
    heading: [
      ['{total} out of {total}. ', false],
      ['Flawless.', true],
    ],
    body: 'Every answer right. {title} gets the Verified badge plus a Perfect score mark that recruiters can see.',
    stats: [
      { value: '{n}/{total}', label: 'CORRECT', tone: 'green' },
      { value: '+{earned} {xp}', label: 'INCL. +20 BONUS', tone: 'gold' },
      { value: 'Verified', label: 'BADGE ADDED', tone: 'green' },
    ],
    actions: { secondary: 'Back to Skills Lab', primary: 'See it on my skills' },
  },
  fail: {
    id: 'fail',
    tone: 'retry',
    medallion: 'refresh',
    sticker: 'RETAKES ARE FREE',
    eyebrow: 'NOT VERIFIED YET',
    heading: [
      ['So ', false],
      ['close.', true],
    ],
    body: 'You got {n} of {total} and need {passMark} to pass. Nothing changes on your card until you pass. Retake with fresh questions whenever you’re ready.',
    stats: [
      { value: '{n}/{total}', label: 'CORRECT', tone: 'plain' },
      { value: '+{earned} {xp}', label: 'FOR PRACTICE', tone: 'gold' },
      { value: '{passMark}', label: 'NEEDED TO PASS', tone: 'plain' },
    ],
    actions: { secondary: 'Back to Skills Lab', primary: 'Retake with new questions' },
  },
  tough: {
    id: 'tough',
    tone: 'retry',
    medallion: 'mortar',
    sticker: 'RETAKES ARE FREE',
    eyebrow: 'NOT VERIFIED YET',
    heading: [
      ['Let’s ', false],
      ['build up first.', true],
    ],
    body: '{n} of {total} tells us {title} is still new to you, and that’s fine. A 15-minute refresher covers what came up. Retakes are unlimited and only your pass shows.',
    stats: [
      { value: '{n}/{total}', label: 'CORRECT', tone: 'plain' },
      { value: '+{earned} {xp}', label: 'FOR PRACTICE', tone: 'gold' },
      { value: '{passMark}', label: 'NEEDED TO PASS', tone: 'plain' },
    ],
    actions: { secondary: 'Retake now', primary: 'Start the refresher' },
  },
};

// Confetti drawn on the pass modals (art coordinates 560x176): [x, y, rotationDeg, playfulFill, playfulOpacity, focusedFill, focusedOpacity].
// Every piece is a 5x11 rounded-2 rectangle. Exported from the Figma Art frames (SL-L10 / SL-L10b, Playful + Focused).
export const CONFETTI = {
  verified: [
    [483, 52, 71, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [412, 40, 31, '#c8951a', 0.9, '#c8951a', 0.9],
    [80, 94, -62, '#ffd86b', 0.9, '#387440', 1.0],
    [409, 54, 8, '#3062d4', 0.9, '#3062d4', 0.9],
    [447, 43, -56, '#c0392b', 0.9, '#c0392b', 0.9],
    [422, 18, 33, '#387440', 1.0, '#387440', 1.0],
    [424, 93, -28, '#c0392b', 0.9, '#c0392b', 0.9],
    [85, 127, 83, '#ffd86b', 0.9, '#387440', 1.0],
    [105, 132, 75, '#387440', 1.0, '#387440', 1.0],
    [469, 132, 23, '#ffd86b', 0.9, '#387440', 1.0],
    [432, 94, -31, '#ffd86b', 0.9, '#387440', 1.0],
    [484, 115, -57, '#c8951a', 0.9, '#c8951a', 0.9],
    [142, 116, 40, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [399, 44, 22, '#c8951a', 0.9, '#c8951a', 0.9],
    [474, 69, 58, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [386, 140, 84, '#ffd86b', 0.9, '#387440', 1.0],
    [116, 57, -59, '#ffd86b', 0.9, '#387440', 1.0],
    [58, 72, -60, '#c0392b', 0.9, '#c0392b', 0.9],
    [35, 23, 34, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [154, 105, -33, '#3062d4', 0.9, '#3062d4', 0.9],
  ],
  perfect: [
    [496, 22, 19, '#3062d4', 0.9, '#3062d4', 0.9],
    [92, 64, 0, '#3062d4', 0.9, '#3062d4', 0.9],
    [143, 22, -78, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [111, 82, 40, '#c0392b', 0.9, '#c0392b', 0.9],
    [392, 55, 36, '#387440', 1.0, '#387440', 1.0],
    [479, 34, -60, '#387440', 1.0, '#387440', 1.0],
    [114, 90, 27, '#c0392b', 0.9, '#c0392b', 0.9],
    [448, 24, 59, '#ffd86b', 0.9, '#387440', 1.0],
    [38, 152, 25, '#c0392b', 0.9, '#c0392b', 0.9],
    [446, 139, 40, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [135, 62, -52, '#c0392b', 0.9, '#c0392b', 0.9],
    [97, 42, 56, '#c0392b', 0.9, '#c0392b', 0.9],
    [66, 40, -39, '#ffd86b', 0.9, '#387440', 1.0],
    [501, 130, -56, '#ffd86b', 0.9, '#387440', 1.0],
    [450, 75, -85, '#ffd86b', 0.9, '#387440', 1.0],
    [177, 36, 28, '#c8951a', 0.9, '#c8951a', 0.9],
    [501, 36, -73, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [59, 88, 20, '#3062d4', 0.9, '#3062d4', 0.9],
    [513, 64, -58, '#387440', 1.0, '#387440', 1.0],
    [120, 21, -44, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [125, 147, 71, '#3062d4', 0.9, '#3062d4', 0.9],
    [480, 93, -58, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [429, 21, -88, '#c8951a', 0.9, '#c8951a', 0.9],
    [528, 76, -50, '#387440', 1.0, '#387440', 1.0],
    [62, 71, 90, '#ffd86b', 0.9, '#387440', 1.0],
    [124, 14, 35, '#c8951a', 0.9, '#c8951a', 0.9],
    [141, 114, 74, '#c8951a', 0.9, '#c8951a', 0.9],
    [507, 90, 84, '#387440', 1.0, '#387440', 1.0],
    [48, 72, 24, '#c0392b', 0.9, '#c0392b', 0.9],
    [390, 66, -34, '#3062d4', 0.9, '#3062d4', 0.9],
  ],
};

// Score → scenario for a real run (Figma only draws 7/8, 8/8, 4/8 and 2/8, so these thresholds are ⚠️ ASSUMPTIONS).
export const pickScenario = (correct, total, passMark) => {
  if (correct >= total) return 'perfect';
  if (correct >= passMark) return 'verified';
  if (correct <= Math.floor(passMark / 3)) return 'tough';
  return 'fail';
};
// XP shown on the results modal. Figma: 7/8 → +80, 8/8 → +100 (incl. +20 bonus), 4/8 → +20, 2/8 → +10. ⚠️ ASSUMPTION formula:
// pass = 10 per correct answer + 10 (verified) or +20 bonus (perfect); practice runs = 5 per correct answer.
export const earnedXp = (scenario, correct) =>
  scenario === 'perfect'
    ? correct * 10 + 20
    : scenario === 'verified'
      ? correct * 10 + 10
      : correct * 5;
/* ---- end shared ---- */

/* ---- python ---- */
const TITLE = [
  ['What does this code ', false],
  ['print?', true],
];
const PROMPT = 'Read the code, then pick the exact output.';

const PYTHON_QUESTIONS = [
  // ⚠️ ASSUMPTION: only Challenge 5 is drawn in Figma. Q1–Q4 and Q6–Q8 are invented to fill the 8-challenge flow
  // (topics match the SL-L10 breakdown: Sets and sorting Q1,Q5 · Loops and functions Q2,Q4,Q6 · Error handling Q3 · List comprehensions Q7,Q8).
  {
    id: 'py-1',
    kind: 'code-output',
    topic: 'Sets and sorting',
    title: TITLE,
    prompt: PROMPT,
    body: { code: ["tags = ['a', 'b', 'a', 'c']", 'print(len(set(tags)))'] },
    options: ['4', '3', '2', '1'],
    answer: 1,
    hint: 'Work it out in two steps: what does set() do to the repeated "a"? What does len() count?',
    explain: {
      right: 'set() keeps one of each value (a, b, c), and len() counts them: 3.',
      wrong:
        'set() removes the repeated "a" first, so only three different values are left. This one goes on your review list.',
    },
  },
  {
    id: 'py-2',
    kind: 'code-output',
    topic: 'Loops and functions',
    title: TITLE,
    prompt: PROMPT,
    body: { code: ['total = 0', 'for n in range(1, 4):', '    total += n', 'print(total)'] },
    options: ['3', '6', '10', '4'],
    answer: 1,
    hint: 'range(1, 4) stops before 4. Add up the numbers it gives you.',
    explain: {
      right: 'range(1, 4) gives 1, 2 and 3, and the loop adds them up: 6.',
      wrong:
        'range(1, 4) gives 1, 2 and 3 (it stops before 4), so the loop adds up to 6. This one goes on your review list.',
    },
  },
  {
    id: 'py-3',
    kind: 'code-output',
    topic: 'Error handling',
    title: TITLE,
    prompt: PROMPT,
    body: {
      code: [
        'try:',
        '    value = int("ama")',
        'except ValueError:',
        '    value = -1',
        'print(value)',
      ],
    },
    options: ['"ama"', '0', '-1', 'It crashes'],
    answer: 2,
    hint: 'Can int() turn "ama" into a number? Which branch runs when it cannot?',
    explain: {
      right: 'int("ama") raises a ValueError, the except branch catches it, and value becomes -1.',
      wrong:
        'int("ama") raises a ValueError, but the except branch catches it, so value becomes -1. This one goes on your review list.',
    },
  },
  {
    id: 'py-4',
    kind: 'code-output',
    topic: 'Loops and functions',
    title: TITLE,
    prompt: PROMPT,
    body: { code: ['def double(x):', '    return x * 2', 'print(double(double(3)))'] },
    options: ['6', '12', '9', '36'],
    answer: 1,
    hint: 'Work from the inside out: double(3) first, then double of that.',
    explain: {
      right: 'double(3) is 6, and double(6) is 12.',
      wrong:
        'The inner call gives 6 and the outer call doubles it to 12. This one goes on your review list.',
    },
  },
  {
    id: 'py-5',
    kind: 'code-output',
    topic: 'Sets and sorting',
    title: TITLE,
    prompt: PROMPT,
    body: {
      code: ['data = [3, 1, 4, 1, 5, 9, 2, 6]', 'result = sorted(set(data))[:3]', 'print(result)'],
    },
    options: ['[3, 1, 4]', '[1, 2, 3]', '[1, 1, 2]', '[3, 1, 4, 1]'],
    answer: 1,
    hint: 'Work it out in three steps: what does set() do to the repeated 1? What order does sorted() give? How many items does [:3] keep?',
    explain: {
      right:
        'set() drops the duplicate 1, sorted() puts the rest in order, and [:3] keeps the first three: [1, 2, 3].',
      // Verbatim for option C (Figma SL-L08); A and D are ⚠️ ASSUMPTIONS in the same voice.
      wrong:
        'set() removes duplicates before sorting, so the second 1 is gone. That’s why [1, 1, 2] can’t happen. This one goes on your review list.',
      wrongByOption: {
        0: 'sorted() runs after set(), so the numbers come out in order, not as they were written. That’s why [3, 1, 4] can’t happen. This one goes on your review list.',
        3: '[:3] keeps three items, not four, and set() has already dropped the duplicate 1. That’s why [3, 1, 4, 1] can’t happen. This one goes on your review list.',
      },
    },
  },
  {
    id: 'py-6',
    kind: 'code-output',
    topic: 'Loops and functions',
    title: TITLE,
    prompt: PROMPT,
    body: { code: ['count = 0', 'while count < 3:', '    count += 1', 'print(count)'] },
    options: ['2', '3', '4', '0'],
    answer: 1,
    hint: 'The loop stops as soon as count < 3 is no longer true. What is count then?',
    explain: {
      right: 'The loop adds 1 until count reaches 3, then the condition fails and 3 is printed.',
      wrong:
        'The loop keeps adding 1 until count reaches 3, then stops, so 3 is printed. This one goes on your review list.',
    },
  },
  {
    id: 'py-7',
    kind: 'code-output',
    topic: 'List comprehensions',
    title: TITLE,
    prompt: PROMPT,
    body: { code: ['squares = [n * n for n in range(4)]', 'print(squares)'] },
    options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 1, 2, 3]', '[0, 2, 4, 6]'],
    answer: 0,
    hint: 'range(4) starts at 0 and stops before 4. Square each number it gives you.',
    explain: {
      right: 'range(4) gives 0, 1, 2 and 3, and each one is squared: [0, 1, 4, 9].',
      wrong:
        'range(4) starts at 0 and stops before 4, and each number is squared: [0, 1, 4, 9]. This one goes on your review list.',
    },
  },
  {
    id: 'py-8',
    kind: 'code-output',
    topic: 'List comprehensions',
    title: TITLE,
    prompt: PROMPT,
    body: {
      code: [
        'nums = [1, 2, 3, 4, 5, 6]',
        'evens = [n for n in nums if n % 2 == 0]',
        'print(evens)',
      ],
    },
    options: ['[1, 3, 5]', '[2, 4, 6]', '[2, 4]', '[0, 2, 4]'],
    answer: 1,
    hint: 'The if at the end filters the list. Which numbers leave no remainder when divided by 2?',
    explain: {
      right: 'The filter keeps only the numbers with no remainder when divided by 2: [2, 4, 6].',
      wrong:
        'The filter keeps the numbers with no remainder when divided by 2, which is [2, 4, 6]. This one goes on your review list.',
    },
  },
];

// Frame seeds: `?f=<code>` boots the engine in exactly the state a Figma frame draws.
//   results  = per-question outcome so far ('ok' | 'bad'); index = the challenge on screen (0-based)
//   status   = playing | selected | correct | wrong | finished;  selected = option index;  scenario = results modal
const R5 = ['ok', 'ok', 'bad', 'ok'];
export const PYTHON_FRAMES = {
  L05: { index: 4, results: R5, status: 'playing', selected: null, hintUsed: false, xp: 240 },
  L06: { index: 4, results: R5, status: 'selected', selected: 1, hintUsed: false, xp: 240 },
  L07: {
    index: 4,
    results: [...R5, 'ok'],
    status: 'correct',
    selected: 1,
    hintUsed: false,
    xp: 250,
  },
  L08: {
    index: 4,
    results: [...R5, 'bad'],
    status: 'wrong',
    selected: 2,
    hintUsed: false,
    xp: 240,
  },
  L09: { index: 4, results: R5, status: 'playing', selected: null, hintUsed: true, xp: 235 },
  L10: {
    index: 4,
    results: ['ok', 'ok', 'bad', 'ok', 'ok', 'ok', 'ok', 'ok'],
    status: 'finished',
    xp: 320,
    scenario: 'verified',
  },
  L10b: {
    index: 4,
    results: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'],
    status: 'finished',
    xp: 340,
    scenario: 'perfect',
  },
  L11: {
    index: 4,
    results: ['ok', 'ok', 'bad', 'ok', 'bad', 'bad', 'ok', 'bad'],
    status: 'finished',
    xp: 260,
    scenario: 'fail',
  },
  L11b: {
    index: 4,
    results: ['ok', 'bad', 'bad', 'bad', 'bad', 'ok', 'bad', 'bad'],
    status: 'finished',
    xp: 250,
    scenario: 'tough',
  },
};

// Topic breakdown + refresher drawn on each results frame (the retake question sets differ per attempt, so the Figma
// topics are not derivable from the 8 questions above — a real run derives them in useLabAttempt instead).
export const PYTHON_FRAME_RESULTS = {
  verified: {
    earned: 80,
    topics: [
      { label: 'Sets and sorting', qs: 'Q1, Q5', strong: true },
      { label: 'Loops and functions', qs: 'Q2, Q4, Q6', strong: true },
      { label: 'List comprehensions', qs: 'Q7, Q8', strong: true },
      { label: 'Error handling', qs: 'Q3', strong: false },
    ],
    refresher: {
      title: 'Brush up on error handling',
      sub: 'Free 15-min refresher in My Learning',
      cta: 'Open',
    },
  },
  perfect: {
    earned: 100,
    topics: [
      { label: 'Sets and sorting', qs: 'Q1, Q5', strong: true },
      { label: 'Loops and functions', qs: 'Q2, Q4, Q6', strong: true },
      { label: 'List comprehensions', qs: 'Q7, Q8', strong: true },
      { label: 'Error handling', qs: 'Q3', strong: true },
    ],
    refresher: null,
  },
  fail: {
    earned: 20,
    topics: [
      { label: 'Basics and loops', qs: 'Q1, Q2, Q4, Q7', strong: true },
      { label: 'Sets and sorting', qs: 'Q5', strong: false },
      { label: 'Error handling', qs: 'Q3, Q6', strong: false },
      { label: 'List comprehensions', qs: 'Q8', strong: false },
    ],
    refresher: {
      title: 'Practise first? 15-min Python refresher',
      sub: 'Covers sets, try/except and comprehensions',
      cta: 'Open',
    },
  },
  tough: {
    earned: 10,
    topics: [
      { label: 'Basics', qs: 'Q1, Q6', strong: true },
      { label: 'Loops and functions', qs: 'Q2, Q4', strong: false },
      { label: 'Sets and sorting', qs: 'Q5', strong: false },
      { label: 'Error handling and comprehensions', qs: 'Q3, Q7, Q8', strong: false },
    ],
    refresher: {
      title: 'Python refresher · 15 min',
      sub: 'Free in My Learning · built from your answers',
      cta: 'Open',
    },
  },
};

// Refresher shown on a real run's results (per scenario); {topic} is the first review topic, filled in by the engine.
export const PYTHON_REFRESHERS = {
  verified: {
    title: 'Brush up on {topic}',
    sub: 'Free 15-min refresher in My Learning',
    cta: 'Open',
  },
  perfect: null,
  fail: PYTHON_FRAME_RESULTS.fail.refresher,
  tough: PYTHON_FRAME_RESULTS.tough.refresher,
};

export const PYTHON_FLOW = {
  id: 'python',
  title: 'Python',
  headerTitle: 'Skills Lab · Python',
  subtitle: '8 challenges · Pass 6 to earn Verified · Retake any time',
  sticker: 'PASS 6 = VERIFIED',
  total: 8,
  passMark: 6,
  hintCost: 5,
  correctXp: 10,
  // GET /skills-lab/labs/python/session — Kofi is on challenge 5 of 8 (matches the hub "In progress" card).
  session: { index: 4, results: R5, xp: 240, streakDays: 7 },
  questions: PYTHON_QUESTIONS,
  frames: PYTHON_FRAMES,
  frameResults: PYTHON_FRAME_RESULTS,
  refreshers: PYTHON_REFRESHERS,
};
/* ---- end python ---- */

/* ---- registry ---- */
// Other labs: build a flow like PYTHON_FLOW in your own block above and add it here.
// More labs: drop `labFlows/<lab>.js` files exporting `FLOWS = { '<labId>': flow }` — merged here automatically.
const EXTRA = import.meta.glob('./labFlows/*.js', { eager: true });
export const LAB_FLOWS = {
  python: PYTHON_FLOW,
  ...Object.assign({}, ...Object.values(EXTRA).map((m) => m.FLOWS ?? {})),
};
export const getLabFlow = (labId) => LAB_FLOWS[labId] ?? null;
/* ---- end registry ---- */
