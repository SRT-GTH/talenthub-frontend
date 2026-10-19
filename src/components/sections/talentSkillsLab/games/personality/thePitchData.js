/*
 * The Pitch mock content (Figma SL-GP11 Recording, Playful 7943:11118 / Focused 8110:497911). Verbatim from the frame: the
 * prompt, chips, captions text, 64 waveform bar heights (first 44 played), "0:42 of 1:00", footer actions.
 * The catalogue also lists `pitch-in-60` (skill game, Public speaking) sharing this artwork; it has no frame of its own.
 *
 * ⚠️ ASSUMPTION: there is no real speech capture — the clock, the waveform progress, the live captions (the drawn text,
 * revealed with the clock), "Filler words" (1 per 21s) and the checklist count (1 per 14s) are simulated; "Switch to
 * typing" swaps in a text box (not drawn); one redo; the completion dialog.
 */
export const BARS = [
  28, 46, 40, 37, 34, 10, 50, 76, 51, 22, 59, 54, 31, 17, 10, 36, 64, 59, 10, 60, 70, 39, 12, 26,
  33, 47, 53, 23, 47, 78, 55, 11, 42, 43, 37, 37, 24, 32, 71, 68, 18, 49, 61, 40, 21, 11, 23, 55,
  67, 34, 41, 72, 55, 17, 22, 29, 41, 54, 40, 25, 71, 70, 26, 33,
];

export const PITCH = {
  gameId: 'the-pitch',
  title: 'Personality game · The Pitch',
  subtitle: '1 pitch · Not shared with recruiters · 1 min',
  doneSubtitle: '1 pitch · Game done',
  sticker: 'RECORDING',
  xp: '+30 {xp}',
  doneXp: '+50 {xp}',
  progressNote: 'Not shared with recruiters',
  doneNote: 'Saved',
  info: 'Talk like you would to a friend. You can redo once.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Extraversion', 'Openness'],
  eyebrow: 'PITCH 1 · CREATIVITY',
  title2: ['Sell a solar-powered ', 'kenkey warmer.'],
  body: 'You have 60 seconds. Sell it to a busy trotro mate: who is it for, why now, and what does it cost?',
  captionsLabel: 'LIVE CAPTIONS',
  captions:
    '"…so imagine, it is 6am, the sun is already up, and your kenkey is still warm at 1pm. No gas, no light bill. Fifty cedis and it pays for itself in a month. Every chop bar on the Kasoa road needs one…"',
  startSeconds: 42,
  limit: 60,
  /* ⚠️ ASSUMPTION: typing mode copy */
  typing: {
    label: 'YOUR PITCH',
    placeholder: 'Type your pitch here…',
    switchBack: 'Switch to voice',
  },
  complete: {
    sticker: 'PITCHED',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Bold Seller.',
    body: 'You jumped straight in, painted a picture and asked for the sale.',
    stats: [
      { value: '0:42', label: 'PITCH LENGTH', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      { label: 'Extraversion', note: 'Started without a warm-up', chip: '+7', strong: true },
      { label: 'Openness', note: 'Picked a fresh angle', chip: '+4', strong: true },
    ],
    next: { title: 'Up next: Ludo Risk', sub: '~3 min · Strategy · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};
