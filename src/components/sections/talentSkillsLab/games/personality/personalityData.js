/*
 * Personality games — mock content shaped like `GET /skills-lab/games/:gameId` (rounds + the play-style result).
 * Figma: "Talent - Skills Lab" SL-GP03 … SL-GP12 (frame -> URL table in wiki/talent-skills-lab.md). Copy is VERBATIM from
 * the frames. Anything marked ⚠️ ASSUMPTION was added only to make the loop complete (the Figma draws one round per
 * game, plus the Makola Haggle completion) and keeps the drawn voice. Strings may carry the {xp} token (XP in Playful,
 * pts in Focused — see labFormat.js).
 *
 * Icons are referenced by key; each game file maps the keys onto the Figma glyphs in PersonalityIcons.jsx.
 */

/* ⚠️ ASSUMPTION: the order "Play next game" walks (the frame only names Escape Room after Makola Haggle). */
export const PLAY_ORDER = [
  'makola-haggle',
  'escape-room',
  'desert-island',
  'trotro-rush',
  'group-chat-drama',
  'speed-sort',
  'tower-builder',
  'the-pitch',
  'ludo-risk',
];
