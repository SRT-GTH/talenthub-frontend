/*
 * UI/UX design lab flow (Figma "Talent - Skills Lab": SL-L13a Q4 answer selected 7851:5575, L13e Q5 contrast 7851:5760,
 * L13b Q4 correct 7851:5926, L13c Q4 not quite 7851:6123, L13d Q4 hint 7851:6321, L13g verified 7851:6513,
 * L13h not verified yet 7851:6823; Focused twins 8110:477646 … 8110:478647).
 * Plugged in automatically: skillsLabLabsData.js merges every `labFlows/*.js` FLOWS export into LAB_FLOWS.
 *
 * Drawn: Q4 (palette: question, brief, swatches, six accents, hint, right + wrong explanation), Q5 (contrast: question, four
 * button samples), the results modal copy and topic breakdown. The correct answers are inferred from the drawn explanations:
 * Q4 = Amber ("It’s Amber."), Q5 = B, Navy on amber ("about 7:1" in the Q4 explanation) — Figma draws no checked state for Q5.
 * Everything tagged ⚠️ ASSUMPTION is invented to make the lab playable end to end, in the same voice.
 */

/* ---------- Q4: palette ---------- */
const PALETTE_BODY = {
  paletteLabel: 'THE PALETTE · 4 FIXED + 1 TO PICK',
  accentLabel: 'CHOOSE AN ACCENT',
  fixed: [
    { name: 'Navy', hex: '#0B2447', dark: true },
    { name: 'Blue', hex: '#19376D', dark: true },
    { name: 'White', hex: '#FFFFFF', dark: false },
    { name: 'Mist', hex: '#F2F4F7', dark: false },
  ],
  // Labels on the live accent swatch: nothing picked (L13d) / picked (L13a) / checked right (L13b) / checked wrong (L13c).
  preview: { idle: ['Accent?', '?'], picking: 'Preview', correct: 'Accent', wrong: 'Your pick' },
};

const ACCENTS = [
  { name: 'Burnt orange', hex: '#E8590C' },
  { name: 'Emerald', hex: '#22C55E' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Cyan', hex: '#06B6D4' },
];

/* ---------- Q5: contrast ---------- */
const sample = 'Send money';
const CONTRAST_OPTIONS = [
  { caption: 'White on amber', fg: '#ffffff', bg: '#f59e0b', sample },
  { caption: 'Navy on amber', fg: '#0b2447', bg: '#f59e0b', sample },
  { caption: 'Light grey on white', fg: '#9ca3af', bg: '#ffffff', sample },
  { caption: 'White on mist', fg: '#ffffff', bg: '#f2f4f7', sample },
];

const UI_QUESTIONS = [
  {
    // ⚠️ ASSUMPTION: the whole of Q1 (topic Hierarchy per the SL-L13g results breakdown: Q1, Q3).
    id: 'ux-1',
    kind: 'choice',
    topic: 'Hierarchy',
    eyebrowTopic: 'Hierarchy',
    title: [
      ['Which button ', false],
      ['leads?', true],
    ],
    prompt: 'A payment screen has two buttons: Pay now and Cancel. One of them is the main action.',
    body: { optionsLabel: 'HOW SHOULD THEY LOOK?' },
    options: [
      'Both look the same, so neither is pushed.',
      'Pay now is filled and bold; Cancel is a quiet text link.',
      'Cancel is filled and bold; Pay now is a quiet text link.',
      'Both are quiet text links.',
    ],
    answer: 1,
    hint: 'The main action should be the easiest thing to spot. The other choices should not compete with it.',
    explain: {
      right:
        'The main action gets the strongest style, so the eye finds it first. Cancel stays available without competing.',
      wrong:
        'The main action should be the strongest thing on screen. Pay now leads, and Cancel stays quiet but available.',
    },
  },
  {
    // ⚠️ ASSUMPTION: the whole of Q2 (topic Accessibility: Q2, Q5).
    id: 'ux-2',
    kind: 'choice',
    topic: 'Accessibility',
    eyebrowTopic: 'Accessibility',
    title: [
      ['How big should a ', false],
      ['tap target', true],
      [' be?', false],
    ],
    prompt: 'Buttons on a phone screen get tapped with a thumb, often on the move.',
    body: { optionsLabel: 'PICK THE SMALLEST SIZE THAT STAYS COMFORTABLE' },
    options: ['16 × 16 px', '44 × 44 px', '24 × 24 px', '32 × 32 px'],
    answer: 1,
    hint: 'Think of a thumb pad, not a fingertip. Common guidance is a little over 40 px.',
    explain: {
      right: 'About 44 × 44 px fits a thumb, so people hit the right button the first time.',
      wrong:
        'Smaller targets get missed, especially on the move. About 44 × 44 px is the comfortable minimum.',
    },
  },
  {
    // ⚠️ ASSUMPTION: the whole of Q3 (topic Hierarchy).
    id: 'ux-3',
    kind: 'choice',
    topic: 'Hierarchy',
    eyebrowTopic: 'Hierarchy',
    title: [
      ['What should ', false],
      ['stand out', true],
      [' most?', false],
    ],
    prompt: 'This is the confirmation screen after someone sends money.',
    body: { optionsLabel: 'WHICH ELEMENT SHOULD BE LARGEST?' },
    options: ['The amount sent', 'The terms link', 'The footer copyright', 'The help icon'],
    answer: 0,
    hint: 'What does the person most want to confirm at a glance?',
    explain: {
      right: 'The amount is what they came to check, so it gets the most size and weight.',
      wrong:
        'People want to confirm the amount first, so it should be the largest thing on the screen.',
    },
  },
  {
    // Drawn (SL-L13a/b/c/d/g/h). Title, brief, swatches, six accents, hint, both explanations verbatim.
    id: 'ux-4',
    kind: 'palette',
    topic: 'Colour and palettes',
    eyebrowTopic: 'Colour',
    title: [
      ['Pick the ', false],
      ['accent', true],
      [' for this palette.', false],
    ],
    prompt:
      'Brief: a fintech app for young Ghanaians. It should feel trustworthy and modern. Deep navy is the anchor. The accent marks buttons and highlights, so it must not look like an error.',
    body: PALETTE_BODY,
    options: ACCENTS,
    answer: 2,
    answerLabel: 'Amber',
    hint: 'Rule out any colour your users already link to errors or success messages. Then pick the one with the most contrast against navy.',
    explain: {
      right:
        'Amber pops against navy and reads as energy, not danger. Navy text on amber is easy to read too (about 7:1).',
      // Verbatim for Red (Figma SL-L13c). ⚠️ ASSUMPTION for the other wrong picks (same voice).
      wrong:
        'On a money app, red reads as an error or a loss, so every button would feel like a warning. Amber gives the same energy without the alarm.',
      wrongByOption: {
        0: 'Burnt orange sits too close to red, so on a money app it can still read as a warning. Amber gives the same energy without the alarm.',
        1: 'Green already means success on a money app, so it would blur with confirmations. Amber stands out on navy without borrowing that meaning.',
        3: 'Violet has less contrast against navy, so buttons would sink into the background. Amber pops and reads as energy.',
        5: 'Cyan sits close to the blue already in the palette, so it would not stand out as the accent. Amber pops against navy.',
      },
    },
  },
  {
    // Drawn (SL-L13e): title, prompt, four button samples with captions. ⚠️ ASSUMPTION: the correct answer (B), hint and explanations.
    id: 'ux-5',
    kind: 'contrast',
    topic: 'Accessibility',
    eyebrowTopic: 'Accessibility',
    title: [
      ['Which label is ', false],
      ['easiest to read?', true],
    ],
    prompt:
      'Users will read these on a phone outside in bright sun. Pick the one that passes WCAG AA contrast for small text.',
    body: {},
    options: CONTRAST_OPTIONS,
    answer: 1,
    hint: 'Pass or fail depends on how far apart the text and background are in lightness. Which two are most different?',
    explain: {
      right:
        'Navy on amber has the strongest contrast of the four (about 7:1), so it passes WCAG AA for small text.',
      wrong:
        'Navy on amber is the only one with strong contrast (about 7:1). White on amber, light grey on white and white on mist are all too faint for small text.',
    },
  },
  {
    // ⚠️ ASSUMPTION: the whole of Q6 (topic Layout).
    id: 'ux-6',
    kind: 'choice',
    topic: 'Layout',
    eyebrowTopic: 'Layout',
    title: [
      ['Where does the ', false],
      ['main button', true],
      [' go?', false],
    ],
    prompt: 'A long form on a phone ends with a Send button.',
    body: { optionsLabel: 'WHERE IS IT EASIEST TO REACH?' },
    options: [
      'At the very top, out of thumb reach.',
      'Hidden in a menu.',
      'At the bottom of the screen, where the thumb rests.',
      'In the middle of the form.',
    ],
    answer: 2,
    hint: 'Hold a phone in one hand. Which part of the screen does your thumb reach without stretching?',
    explain: {
      right: 'The bottom of the screen sits under the thumb, so the main button is easy to reach.',
      wrong: 'The thumb rests near the bottom of the screen, so the main button belongs there.',
    },
  },
];

/* ---------- frame seeds ---------- */
const R4 = ['ok', 'bad', 'ok'];
export const UI_FRAMES = {
  // L13g / L13h keep the amber pick on the live swatch behind the scrim (Figma), hence `selected: 2` on a finished state.
  L13a: { index: 3, results: R4, status: 'selected', selected: 2, hintUsed: false, xp: 240 },
  L13e: {
    index: 4,
    results: [...R4, 'ok'],
    status: 'playing',
    selected: null,
    hintUsed: false,
    xp: 240,
  },
  L13b: {
    index: 3,
    results: [...R4, 'ok'],
    status: 'correct',
    selected: 2,
    hintUsed: false,
    xp: 250,
  },
  L13c: {
    index: 3,
    results: [...R4, 'bad'],
    status: 'wrong',
    selected: 4,
    hintUsed: false,
    xp: 240,
  },
  L13d: { index: 3, results: R4, status: 'playing', selected: null, hintUsed: true, xp: 235 },
  L13g: {
    index: 3,
    results: ['ok', 'bad', 'ok', 'ok', 'ok', 'ok'],
    status: 'finished',
    selected: 2,
    xp: 300,
    scenario: 'verified',
  },
  L13h: {
    index: 3,
    results: ['ok', 'bad', 'ok', 'bad', 'bad', 'ok'],
    status: 'finished',
    selected: 2,
    xp: 255,
    scenario: 'fail',
  },
};

const UI_FRAME_RESULTS = {
  verified: {
    earned: 60,
    topics: [
      { label: 'Colour and palettes', qs: 'Q4', strong: true },
      { label: 'Hierarchy', qs: 'Q1, Q3', strong: true },
      { label: 'Accessibility', qs: 'Q2, Q5', strong: false },
      { label: 'Layout', qs: 'Q6', strong: true },
    ],
    refresher: {
      title: 'Brush up on accessibility',
      sub: 'Contrast and touch targets, 8 min',
      cta: 'Open',
    },
  },
  fail: {
    earned: 15,
    topics: [
      { label: 'Colour and palettes', qs: 'Q4', strong: false },
      { label: 'Hierarchy', qs: 'Q1, Q3', strong: true },
      { label: 'Accessibility', qs: 'Q2, Q5', strong: false },
      { label: 'Layout', qs: 'Q6', strong: true },
    ],
    refresher: {
      title: 'Practise first? Colour and contrast, 12 min',
      sub: 'Free in My Learning',
      cta: 'Open',
    },
  },
};

const UI_REFRESHERS = {
  // ⚠️ ASSUMPTION: generic wording for any review topic (Figma only draws the accessibility case).
  verified: {
    title: 'Brush up on {topic}',
    sub: 'Free 8-min refresher in My Learning',
    cta: 'Open',
  },
  perfect: null,
  fail: UI_FRAME_RESULTS.fail.refresher,
  // ⚠️ ASSUMPTION: tough run (≤ 1 of 6) is not drawn for this lab; mirrors the Python wording.
  tough: {
    title: 'UI/UX design refresher · 12 min',
    sub: 'Free in My Learning · built from your answers',
    cta: 'Open',
  },
};

// Results copy that differs from the shared Python wording (Figma SL-L13g / SL-L13h). Needs the one-line `flow.resultCopy`
// merge in useLabAttempt.buildResultView (see the report); perfect / tough fall back to the shared copy (⚠️ ASSUMPTION).
const UI_RESULT_COPY = {
  verified: {
    body: '{n} of {total}. {title} (and your Figma skill) now shows the Verified badge.',
  },
  fail: {
    heading: [
      ['Nearly there. ', false],
      ['Run it back.', true],
    ],
    body: '{n} of {total}, and you need {passMark}. Nothing changes on your card until you pass. New screens every retake.',
  },
};

export const UI_UX_FLOW = {
  id: 'ui-ux-design',
  title: 'UI/UX design',
  headerTitle: 'Skills Lab · UI/UX design',
  subtitle: '6 challenges · Pass 5 to earn Verified · Retake any time',
  sticker: 'PASS 5 = VERIFIED',
  total: 6,
  passMark: 5,
  hintCost: 5,
  correctXp: 10,
  // GET /skills-lab/labs/ui-ux-design/session — Kofi is on challenge 4 of 6 (SL-L13a: 2 correct · 1 to review, 240 XP).
  session: { index: 3, results: R4, xp: 240, streakDays: 7 },
  questions: UI_QUESTIONS,
  frames: UI_FRAMES,
  frameResults: UI_FRAME_RESULTS,
  refreshers: UI_REFRESHERS,
  resultCopy: UI_RESULT_COPY,
};

export const FLOWS = { 'ui-ux-design': UI_UX_FLOW };
