import ExtLabScreen from '../labScreens/ExtLabScreen.jsx';

/*
 * Public speaking lab flow (Figma SL-L16a … L16h, Playful 7851:10551 … 7851:11785 / Focused 8110:482533 … 8110:483526).
 * Drawn: Q1 "Build the strongest opening line." (tap phrases into 5 slots; a decoy phrase does not belong), Q2 "Which version lands
 * hardest?" (multiple choice), the Q1 states (in progress, correct, not quite, hint) and both results modals. Topics of the SL-L16g/h
 * breakdown: Structure Q1+Q4, Clarity Q2, Openings and closings Q3+Q5, Handling questions Q6.
 *   GET /skills-lab/labs/public-speaking/session · /questions · POST …/answers · GET …/result   (same shapes as PYTHON_FLOW)
 * ⚠️ ASSUMPTION: questions 3–6 are not drawn in Figma. They are invented in the same voice (multiple choice, 4 options) to complete the
 * six-challenge flow, with hints and explanations. Q2's hint / explanation / wrong-answer copy is also invented (Figma draws Q2 unanswered).
 */
const PHRASES = [
  { id: 'prob', text: 'we’ve found the root cause' },
  { id: 'out', text: 'that will cut overhead costs by 40%' },
  { id: 'cred', text: 'After six months of research,' },
  { id: 'decoy', text: 'I think maybe we could try' },
  { id: 'sol', text: 'and a clear fix' },
  { id: 'when', text: 'starting next quarter.' },
];
const CORRECT = ['cred', 'prob', 'sol', 'out', 'when'];
const WRONG_ARRANGEMENT = 'decoy|cred|prob|sol|when';

const mc = (id, eyebrow, topic, title, prompt, options, answer, hint, right, wrong) => ({
  id,
  kind: 'choice',
  eyebrow,
  topic,
  title,
  prompt,
  options,
  answer,
  hint,
  explain: { right, wrong },
});

const QUESTIONS = [
  {
    id: 'ps-1',
    kind: 'phrases',
    eyebrow: 'STRUCTURE',
    topic: 'Structure',
    title: [
      ['Build the strongest ', false],
      ['opening line.', true],
    ],
    prompt:
      'You’re presenting a new product roadmap to senior leaders. Tap the phrases in order: credibility, problem, solution, outcome, timing. One phrase doesn’t belong.',
    body: {
      slots: 5,
      phrases: PHRASES,
      correct: CORRECT,
      guide: ['Credibility', 'Problem', 'Solution', 'Outcome', 'When'],
      // Figma SL-L16c marks the 1st, 2nd and 5th slot red and the 3rd and 4th green for this exact arrangement.
      marksByArrangement: { [WRONG_ARRANGEMENT]: ['bad', 'bad', 'ok', 'ok', 'bad'] },
    },
    options: [],
    answer: CORRECT.join('|'),
    hint: 'One phrase makes you sound unsure. Leave it out. The last two slots are the outcome (a number) and the timing.',
    explain: {
      right:
        'Evidence first, then the problem, the fix, the payoff and the timing. Leaders hear why to trust you before you ask for anything.',
      wrongTitle: 'Close, but not quite.',
      wrong:
        '“I think maybe” undercuts you before you start, and the 40% outcome is missing. Open with the research, and say what it saves.',
    },
  },
  mc(
    'ps-2',
    'CLARITY',
    'Clarity',
    [
      ['Which version ', false],
      ['lands hardest?', true],
    ],
    'Same message, four ways. Pick the one you’d say to a room of busy managers.',
    [
      'So, um, basically what we kind of found is that costs are, like, quite high?',
      'We found the root cause of our overhead. Fixing it saves 40% from next quarter.',
      'I just wanted to quickly share some thoughts, if that’s okay, about costs.',
      'Costs. High. Fix. 40%. Next quarter.',
    ],
    1,
    'Look for the version with a clear claim and a number, said in full sentences and without filler.',
    'It names the cause, the fix and the saving in two clean sentences. No filler, nothing to decode.',
    'The best version names the cause, the fix and the saving in two clean sentences. Filler words and fragments make busy managers work harder. This one goes on your review list.'
  ),
  mc(
    'ps-3',
    'OPENINGS',
    'Openings and closings',
    [
      ['Which opening ', false],
      ['hooks a room fastest?', true],
    ],
    'You’re about to speak to a hall of new graduates. Pick the strongest first sentence.',
    [
      'Hello everyone, thanks for having me, I hope this is useful.',
      'One in three of you will change jobs within a year. Here is how to be ready.',
      'Today I am going to talk about careers.',
      'Sorry, I’m a bit nervous, so bear with me.',
    ],
    1,
    'The strongest opening gives the audience a reason to listen before it says who you are.',
    'A specific fact tied to the audience, then a promise. People know straight away why this talk is for them.',
    'The strongest opening gives the room a specific reason to listen. Thanks, topic announcements and apologies spend the first seconds on you instead. This one goes on your review list.'
  ),
  mc(
    'ps-4',
    'STRUCTURE',
    'Structure',
    [
      ['Which order ', false],
      ['works best?', true],
    ],
    'You have five minutes to update your team on a late project. Pick the running order.',
    [
      'History of the project, every task, then the delay.',
      'The delay and its cause, what it changes, then the new date.',
      'The new date, then a long list of apologies.',
      'The tasks you finished, then silence for questions.',
    ],
    1,
    'Lead with what the listeners most need to know, then explain it.',
    'Headline first: the delay, its cause and what changes, then the new date. Listeners can act on it straight away.',
    'Lead with what the team most needs to know. Starting with history or apologies hides the news. This one goes on your review list.'
  ),
  mc(
    'ps-5',
    'CLOSINGS',
    'Openings and closings',
    [
      ['Which closing leaves people ', false],
      ['ready to act?', true],
    ],
    'You’ve just pitched a weekly clean-up to your estate committee. Pick the closing line.',
    [
      'Well, that’s all I have, so, yeah, thanks.',
      'Does anyone have any questions? No? Okay then.',
      'Please vote today. If we start this Saturday, the estate is clean by the end of the month.',
      'I hope you’ll think about it.',
    ],
    2,
    'A good closing asks for one clear action and gives a reason to do it now.',
    'It asks for one action, today, and shows the payoff. People leave knowing what to do next.',
    'A strong closing asks for one clear action and gives a reason to take it now. Trailing off or hoping leaves the room with nothing to do. This one goes on your review list.'
  ),
  mc(
    'ps-6',
    'Q AND A',
    'Handling questions',
    [
      ['What do you ', false],
      ['say next?', true],
    ],
    'A manager asks a question you can’t answer yet. Pick the best reply.',
    [
      'Guess confidently and move on.',
      'Say you don’t know and stop talking.',
      'Say you’ll confirm the number today, then repeat the part you do know.',
      'Tell them the question isn’t relevant.',
    ],
    2,
    'Honest, specific and useful beats a guess. Say what you do know and when you will follow up.',
    'You stay honest, give a time for the answer and keep the useful part on the table.',
    'The best reply is honest and specific: what you know now, and when you will confirm the rest. Guessing or dodging costs trust. This one goes on your review list.'
  ),
];

const D3 = { placed: ['cred', 'prob', 'sol'] };
const FRAMES = {
  L16a: {
    index: 0,
    results: [],
    status: 'playing',
    selected: null,
    hintUsed: false,
    xp: 240,
    draft: D3,
  },
  L16e: { index: 1, results: ['ok'], status: 'selected', selected: 1, hintUsed: false, xp: 240 },
  L16b: {
    index: 0,
    results: ['ok'],
    status: 'correct',
    selected: CORRECT.join('|'),
    hintUsed: false,
    xp: 250,
  },
  L16c: {
    index: 0,
    results: ['bad'],
    status: 'wrong',
    selected: WRONG_ARRANGEMENT,
    hintUsed: false,
    xp: 240,
  },
  L16d: {
    index: 0,
    results: [],
    status: 'playing',
    selected: null,
    hintUsed: true,
    xp: 235,
    draft: D3,
  },
  // The results frames sit on top of the Q1 screen with 3 phrases placed.
  L16g: {
    index: 0,
    results: ['ok', 'ok', 'ok', 'bad', 'ok', 'ok'],
    status: 'finished',
    xp: 300,
    scenario: 'verified',
    draft: D3,
  },
  L16h: {
    index: 0,
    results: ['bad', 'ok', 'bad', 'ok', 'bad', 'ok'],
    status: 'finished',
    xp: 255,
    scenario: 'fail',
    draft: D3,
  },
};

const FRAME_RESULTS = {
  verified: {
    earned: 60,
    topics: [
      { label: 'Structure', qs: 'Q1, Q4', strong: false },
      { label: 'Clarity', qs: 'Q2', strong: true },
      { label: 'Openings and closings', qs: 'Q3, Q5', strong: true },
      { label: 'Handling questions', qs: 'Q6', strong: true },
    ],
    refresher: {
      title: 'Brush up on structure',
      sub: 'Build a talk in 4 parts, 8 min',
      cta: 'Open',
    },
  },
  fail: {
    earned: 15,
    topics: [
      { label: 'Structure', qs: 'Q1, Q4', strong: false },
      { label: 'Clarity', qs: 'Q2', strong: true },
      { label: 'Openings and closings', qs: 'Q3, Q5', strong: false },
      { label: 'Handling questions', qs: 'Q6', strong: true },
    ],
    refresher: {
      title: 'Practise first? Speaking with impact, 10 min',
      sub: 'Openings, structure and closings',
      cta: 'Open',
    },
  },
};

// ⚠️ ASSUMPTION: refreshers of a real run (Figma only draws the two frame refreshers above); perfect has none.
const REFRESHERS = {
  verified: { title: 'Brush up on {topic}', sub: 'Build a talk in 4 parts, 8 min', cta: 'Open' },
  perfect: null,
  fail: FRAME_RESULTS.fail.refresher,
  tough: {
    title: 'Speaking with impact · 10 min',
    sub: 'Free in My Learning · built from your answers',
    cta: 'Open',
  },
};

const RESULT_COPY = {
  verified: {
    body: '{n} of {total}. {title} now carries the Verified badge on your card.',
    confetti: 'public-speaking:verified',
  },
  fail: {
    heading: [
      ['Good energy. ', false],
      ['Not yet.', true],
    ],
    body: '{n} of {total}, and you need {passMark}. Nothing changes on your card until you pass. Retake with new lines whenever you’re ready.',
  },
};

const CONFETTI = {
  verified: [
    [153, 129, -81, '#387440', 1.0, '#387440', 1.0],
    [457, 104, -78, '#3062d4', 0.9, '#3062d4', 0.9],
    [405, 17, -66, '#c0392b', 0.9, '#c0392b', 0.9],
    [387, 47, 38, '#c0392b', 0.9, '#c0392b', 0.9],
    [18, 101, 63, '#c8951a', 0.9, '#c8951a', 0.9],
    [507, 122, 25, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [431, 120, 84, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [154, 104, 32, '#3062d4', 0.9, '#3062d4', 0.9],
    [475, 26, 82, '#c8951a', 0.9, '#c8951a', 0.9],
    [404, 32, -63, '#387440', 1.0, '#387440', 1.0],
    [34, 68, 67, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [149, 115, -14, '#387440', 1.0, '#387440', 1.0],
    [462, 26, 16, '#ffd86b', 0.9, '#387440', 1.0],
    [15, 92, 48, '#3062d4', 0.9, '#3062d4', 0.9],
    [493, 58, -24, '#ffd86b', 0.9, '#387440', 1.0],
    [451, 40, 23, '#387440', 1.0, '#387440', 1.0],
    [439, 125, 36, '#c0392b', 0.9, '#c0392b', 0.9],
    [462, 85, -67, '#3062d4', 0.9, '#3062d4', 0.9],
    [476, 33, 15, '#3062d4', 0.9, '#3062d4', 0.9],
    [97, 113, -89, '#3062d4', 0.9, '#3062d4', 0.9],
  ],
};

const summary = (results) => {
  const ok = results.filter((r) => r === 'ok').length;
  const bad = results.filter((r) => r === 'bad').length;
  return (
    [ok ? `${ok} correct` : null, bad ? `${bad} to review` : null].filter(Boolean).join(' · ') ||
    'Just started'
  );
};

export const PUBLIC_SPEAKING_FLOW = {
  id: 'public-speaking',
  title: 'Public speaking',
  headerTitle: 'Skills Lab · Public speaking',
  subtitle: '6 challenges · Pass 5 to earn Verified · Retake any time',
  sticker: 'PASS 5 = VERIFIED',
  total: 6,
  passMark: 5,
  hintCost: 5,
  correctXp: 10,
  // GET /skills-lab/labs/public-speaking/session — not started (lab details SL-02b), Challenge 1 of 6.
  session: { index: 0, results: [], xp: 240, streakDays: 7 },
  questions: QUESTIONS,
  frames: FRAMES,
  frameResults: FRAME_RESULTS,
  refreshers: REFRESHERS,
  resultCopy: RESULT_COPY,
  confetti: CONFETTI,
  ui: { unit: 'Challenge', next: 'Next challenge', last: 'See results', summary },
  Screen: ExtLabScreen,
};

export const FLOWS = { 'public-speaking': PUBLIC_SPEAKING_FLOW };
