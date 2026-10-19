import ExtLabScreen from '../labScreens/ExtLabScreen.jsx';

/*
 * Team leadership lab flow (Figma SL-L17a … L17h, Playful 7851:12080 … 7851:13056 / Focused 8110:484034 … 8110:484810).
 * Five scenarios, each answer is scored "strongest" or "weaker" (no trick answers). Drawn: Scenario 2 "Handling conflict" in full
 * (answer selected, strong answer, weaker answer = option B, hint) and both results modals. Topics of the SL-L17g/h breakdown:
 * Handling conflict S2, Giving feedback S1+S4, Delegating S3, Owning mistakes S5.
 * ⚠️ ASSUMPTION: scenarios 1, 3, 4 and 5 are not drawn. They are invented in the same voice (same two people on the scenario card,
 * 4 options, one strongest) to complete the five-scenario flow. In Scenario 2 only option B's "not the strongest" text is drawn; the
 * texts for options C and D are invented. Hints and the "strong call" explanations of the invented scenarios are invented too.
 */
const TITLE_Q = (sentence) => [
  [`${sentence} `, false],
  ['What do you do first?', true],
];

const QUESTIONS = [
  {
    id: 'tl-1',
    kind: 'scenario',
    eyebrow: 'GIVING FEEDBACK',
    topic: 'Giving feedback',
    title: TITLE_Q('A teammate’s report has two wrong figures and goes to the client tomorrow.'),
    scenario: {
      headline: 'Evening check-in before a client handover',
      text: 'You lead a team of four. Kojo worked late on the weekly report and is proud of it. Two figures in it are wrong, and the client reads it at nine tomorrow.',
    },
    options: [
      'Talk to Kojo privately tonight, point to the two figures, and fix them together.',
      'Correct the figures yourself and say nothing, so Kojo isn’t embarrassed.',
      'Post the mistakes in the team chat so everyone checks their own work.',
      'Send it as it is and mention the errors to the client afterwards.',
    ],
    answer: 0,
    hint: 'Think about two things at once: the client’s report tomorrow, and how Kojo learns from this.',
    explain: {
      right:
        'The report is right before the client sees it, and Kojo hears it privately, with specifics. He learns without losing face.',
      wrong:
        'Pointing at the two figures with Kojo, in private, protects the client and the teammate.',
    },
    weaker: {
      1: 'Fixing it silently saves tonight, but Kojo never learns and the same slip comes back. Say it, kindly, with the figures in hand.',
      2: 'Naming a mistake in front of the whole team may fix the report, but it costs Kojo trust. Feedback lands better in private.',
      3: 'The client would read wrong figures first. Fix the report before it leaves, then talk it through with Kojo.',
    },
  },
  {
    id: 'tl-2',
    kind: 'scenario',
    eyebrow: 'HANDLING CONFLICT',
    topic: 'Handling conflict',
    title: TITLE_Q('Two teammates disagree in front of the client.'),
    scenario: {
      headline: 'Weekly video call with a client in Takoradi',
      text: 'You lead a team of four. Ama says the launch date is fixed; Kwabena says it must move to fit testing. The client is listening and looks confused.',
    },
    options: [
      'Pause politely, say you’ll confirm the plan today, then align the team privately before replying to the client.',
      'Back the more senior teammate on the spot so the client hears one answer.',
      'Let them finish. The client should see every point of view.',
      'Apologise to the client and end the call early.',
    ],
    answer: 0,
    hint: 'Think about two things at once: what the client needs to hear today, and what the team needs so this doesn’t happen again.',
    explain: {
      right:
        'You protect the client relationship and the team. One clear answer later beats two answers now, and the disagreement gets solved in private.',
      wrong: 'Pausing to align first keeps both the client’s confidence and the team’s trust.',
    },
    weaker: {
      1: 'Backing the senior person gives the client one answer, but it may be the wrong one and Kwabena loses trust. Pausing to align first keeps both.',
      2: 'Letting the argument run shows the client a team that doesn’t agree, and no one leaves with a plan. Pause, then settle it privately.',
      3: 'Ending the call early leaves the client with the confusion and the team with the problem. Say you’ll confirm today, then sort it out.',
    },
  },
  {
    id: 'tl-3',
    kind: 'scenario',
    eyebrow: 'DELEGATING',
    topic: 'Delegating',
    title: TITLE_Q('You have three urgent tasks and one teammate with free time.'),
    scenario: {
      headline: 'Monday planning, end of the month',
      text: 'You lead a team of four. Efua has space this week and has asked for something bigger. A client demo, a data clean-up and a report all land by Friday.',
    },
    options: [
      'Do all three yourself so nothing is missed.',
      'Give Efua the data clean-up with clear steps, a deadline and a check-in on Wednesday.',
      'Hand Efua the demo with no briefing, since she asked for more.',
      'Split every task into small pieces and give a piece to everyone.',
    ],
    answer: 1,
    hint: 'Good delegation gives someone a whole task, clear outcomes, and a moment to check in.',
    explain: {
      right:
        'Efua gets a real piece of work she can own, you keep your time for the demo, and the Wednesday check-in catches problems early.',
      wrong:
        'Handing over a clear task with a deadline and a check-in is what makes delegating work.',
    },
    weaker: {
      0: 'Doing everything yourself means the week is at your limit and Efua’s ask goes unanswered. Hand over a whole task instead.',
      2: 'Efua wants more, but a high-stakes demo with no briefing sets her up to struggle. Give clear steps and a check-in.',
      3: 'Cutting everything into scraps creates more hand-offs than it saves. One whole task with an owner is clearer.',
    },
  },
  {
    id: 'tl-4',
    kind: 'scenario',
    eyebrow: 'GIVING FEEDBACK',
    topic: 'Giving feedback',
    title: TITLE_Q('A strong teammate keeps arriving late to stand-up.'),
    scenario: {
      headline: 'Stand-up at 9:00, three days running',
      text: 'You lead a team of four. Yaw does excellent work, but he has joined stand-up ten minutes late three days in a row. The others have started to notice.',
    },
    options: [
      'Ignore it. His work is excellent, so the timing doesn’t matter.',
      'Mention it in front of the team so he feels the pressure.',
      'Ask Yaw for a quick private chat, describe what you saw, and ask what is getting in the way.',
      'Send a group reminder about start times and hope he reads it.',
    ],
    answer: 2,
    hint: 'Start with what you have seen, not a guess about why, and give him room to explain.',
    explain: {
      right:
        'You name the pattern without blame and ask a real question. Yaw can explain, and you can agree on a fix together.',
      wrong:
        'A private, specific conversation that starts with a question is the strongest first step.',
    },
    weaker: {
      0: 'Great work doesn’t cancel the effect on the team. If it is ignored, the others will follow. Raise it early and kindly.',
      1: 'A public call-out may change the time he arrives, but it costs the relationship. Say it privately, and ask first.',
      3: 'A general reminder skips the person who needs to hear it. Talk to Yaw directly, with what you saw.',
    },
  },
  {
    id: 'tl-5',
    kind: 'scenario',
    eyebrow: 'OWNING MISTAKES',
    topic: 'Owning mistakes',
    title: TITLE_Q('Your team missed a deadline because of a plan you approved.'),
    scenario: {
      headline: 'Review meeting with your manager',
      text: 'You lead a team of four. The release slipped two days. The plan was yours, and it left no time for testing. Your manager asks what happened.',
    },
    options: [
      'Explain that the testers were slower than expected.',
      'Say the plan you approved left no testing time, what you’re changing, and the new date.',
      'Say the schedule was unrealistic from the start, without mentioning who set it.',
      'Promise it won’t happen again and change the subject.',
    ],
    answer: 1,
    hint: 'Say what happened, own your part, and show what changes next.',
    explain: {
      right:
        'You own the decision, show you understand the cause, and bring a fix with a date. That builds trust faster than any excuse.',
      wrong: 'Owning your part, with the fix and a date, is what a manager can work with.',
    },
    weaker: {
      0: 'Blaming the testers hides the real cause, and your team hears it. Own the plan, then say what changes.',
      2: 'The schedule was yours to set, so leaving that out sounds like dodging. Name your part, then the fix.',
      3: 'A promise with no explanation tells your manager nothing has been learned. Say what happened and what you’ll change.',
    },
  },
];

const FRAMES = {
  L17a: { index: 1, results: ['ok'], status: 'selected', selected: 0, hintUsed: false, xp: 240 },
  L17b: {
    index: 1,
    results: ['ok', 'ok'],
    status: 'correct',
    selected: 0,
    hintUsed: false,
    xp: 250,
  },
  L17c: {
    index: 1,
    results: ['ok', 'bad'],
    status: 'wrong',
    selected: 1,
    hintUsed: false,
    xp: 240,
  },
  L17d: { index: 1, results: ['ok'], status: 'playing', selected: null, hintUsed: true, xp: 235 },
  // The results frames sit on top of Scenario 2 with option A selected.
  L17g: {
    index: 1,
    results: ['ok', 'ok', 'bad', 'ok', 'ok'],
    status: 'finished',
    selected: 0,
    xp: 290,
    scenario: 'verified',
  },
  L17h: {
    index: 1,
    results: ['ok', 'bad', 'bad', 'ok', 'bad'],
    status: 'finished',
    selected: 0,
    xp: 250,
    scenario: 'fail',
  },
};

// Figma inconsistency: the SL-L17h dots show scenarios 1 and 4 right, yet the topic rows list S1, S4 as Review and S5 as Strong.
// The drawn rows are kept as they are.
const FRAME_RESULTS = {
  verified: {
    earned: 50,
    topics: [
      { label: 'Handling conflict', qs: 'S2', strong: true },
      { label: 'Giving feedback', qs: 'S1, S4', strong: true },
      { label: 'Delegating', qs: 'S3', strong: false },
      { label: 'Owning mistakes', qs: 'S5', strong: true },
    ],
    refresher: { title: 'Brush up on delegating', sub: '6-min lesson in My Learning', cta: 'Open' },
  },
  fail: {
    earned: 10,
    topics: [
      { label: 'Handling conflict', qs: 'S2', strong: false },
      { label: 'Giving feedback', qs: 'S1, S4', strong: false },
      { label: 'Delegating', qs: 'S3', strong: false },
      { label: 'Owning mistakes', qs: 'S5', strong: true },
    ],
    refresher: {
      title: 'Practise first? Leading a team, 10 min',
      sub: 'Conflict, feedback and delegation',
      cta: 'Open',
    },
  },
};

// ⚠️ ASSUMPTION: refreshers of a real run; perfect has none.
const REFRESHERS = {
  verified: { title: 'Brush up on {topic}', sub: '6-min lesson in My Learning', cta: 'Open' },
  perfect: null,
  fail: FRAME_RESULTS.fail.refresher,
  tough: {
    title: 'Leading a team · 10 min',
    sub: 'Free in My Learning · built from your answers',
    cta: 'Open',
  },
};

const RESULT_COPY = {
  verified: {
    body: '{n} of {total} strong answers. {title} now carries the Verified badge on your card.',
    confetti: 'team-leadership:verified',
    stats: [
      { value: '{n}/{total}', label: 'STRONG', tone: 'green' },
      { value: '+{earned} {xp}', label: 'EARNED', tone: 'gold' },
      { value: 'Verified', label: 'BADGE ADDED', tone: 'green' },
    ],
  },
  fail: {
    heading: [
      ['Good start. ', false],
      ['Not yet.', true],
    ],
    body: '{n} of {total} strong answers, and you need {passMark}. Nothing changes on your card until you pass. Fresh scenarios every retake.',
    stats: [
      { value: '{n}/{total}', label: 'STRONG', tone: 'plain' },
      { value: '+{earned} {xp}', label: 'FOR PRACTICE', tone: 'gold' },
      { value: '{passMark}', label: 'NEEDED TO PASS', tone: 'plain' },
    ],
    actions: { secondary: 'Back to Skills Lab', primary: 'Retake with new scenarios' },
  },
};

const CONFETTI = {
  verified: [
    [74, 60, -45, '#c8951a', 0.9, '#c8951a', 0.9],
    [128, 58, -66, '#c8951a', 0.9, '#c8951a', 0.9],
    [145, 67, 24, '#ffd86b', 0.9, '#387440', 1.0],
    [174, 80, -64, '#c0392b', 0.9, '#c0392b', 0.9],
    [471, 140, -76, '#3062d4', 0.9, '#3062d4', 0.9],
    [134, 80, 31, '#387440', 1.0, '#387440', 1.0],
    [76, 112, -76, '#387440', 1.0, '#387440', 1.0],
    [430, 37, 61, '#c8951a', 0.9, '#c8951a', 0.9],
    [159, 74, 23, '#3062d4', 0.9, '#3062d4', 0.9],
    [126, 114, -21, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [92, 110, 45, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [160, 138, 63, '#ffd86b', 0.9, '#387440', 1.0],
    [514, 28, -19, '#ffd86b', 0.9, '#387440', 1.0],
    [39, 32, -64, '#ffd86b', 0.9, '#387440', 1.0],
    [496, 91, 29, '#c8951a', 0.9, '#c8951a', 0.9],
    [65, 92, -11, '#c8951a', 0.9, '#c8951a', 0.9],
    [121, 51, -27, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [467, 20, -19, '#c8951a', 0.9, '#c8951a', 0.9],
    [118, 120, 64, '#ffd86b', 0.9, '#387440', 1.0],
    [131, 110, 37, '#c0392b', 0.9, '#c0392b', 0.9],
  ],
};

const summary = (results) => {
  const ok = results.filter((r) => r === 'ok').length;
  const bad = results.filter((r) => r === 'bad').length;
  if (!ok && !bad) return 'Just started';
  if (!bad) return `${ok} strong answer${ok === 1 ? '' : 's'}`;
  return [ok ? `${ok} strong` : null, `${bad} to review`].filter(Boolean).join(' · ');
};

export const TEAM_LEADERSHIP_FLOW = {
  id: 'team-leadership',
  title: 'Team leadership',
  headerTitle: 'Skills Lab · Team leadership',
  subtitle: '5 scenarios · Pass 4 to earn Verified · Retake any time',
  sticker: 'PASS 4 = VERIFIED',
  total: 5,
  passMark: 4,
  hintCost: 5,
  correctXp: 10,
  note: 'Scored by experienced team leads in Ghana. Some answers are stronger than others; none is a trick.',
  // ⚠️ ASSUMPTION: starts at Scenario 1 (the lab is not started in the hub data).
  session: { index: 0, results: [], xp: 240, streakDays: 7 },
  questions: QUESTIONS,
  frames: FRAMES,
  frameResults: FRAME_RESULTS,
  refreshers: REFRESHERS,
  resultCopy: RESULT_COPY,
  confetti: CONFETTI,
  ui: { unit: 'Scenario', next: 'Next scenario', last: 'See results', summary },
  Screen: ExtLabScreen,
};

export const FLOWS = { 'team-leadership': TEAM_LEADERSHIP_FLOW };
