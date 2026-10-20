/*
 * Skills Lab — lab FLOW mock data (the question-by-question play screens, Figma "Talent - Skills Lab" SL-L05 … SL-L18h).
 * One entry per lab (labFlows/*.js, dev / demo builds only — see the registry below), shaped like the API:
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


/* ---- registry ---- */
// Every lab flow lives in `labFlows/<lab>.js` exporting `FLOWS = { '<labId>': flow }`.
// ⚠️ The flows hold the answer keys, so they are loaded ONLY in dev builds (`npm run dev`: `?demo=1` and the Figma
// `?f=` frames). In a production build `import.meta.env.DEV` is false, this glob is dead code and no flow file (and no
// answer) is bundled; live runs get the questions without answers from GET /skills-lab/labs/:id/play.
export const LOCAL_LAB_FLOWS_AVAILABLE = import.meta.env.DEV;
const LOCAL_FLOW_LOADERS = import.meta.env.DEV ? import.meta.glob('./labFlows/*.js') : {};
export const loadLocalLabFlow = async (labId) => {
  for (const load of Object.values(LOCAL_FLOW_LOADERS)) {
    const mod = await load();
    if (mod.FLOWS?.[labId]) return mod.FLOWS[labId];
  }
  return null;
};
/* ---- end registry ---- */
