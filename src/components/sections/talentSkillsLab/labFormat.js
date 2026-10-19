import { useUiStyle } from '../../../hooks/useUiStyle.js';

/*
 * Copy helpers shared by every lab flow screen (play page, results dialog, lab details).
 * Figma swaps one word between the two looks: Playful says "XP", Focused says "pts" ("+80 XP" → "+80 pts",
 * "Use a hint (−5 XP)" → "Use a hint (−5 pts)"). Data strings therefore carry a {xp} token and are filled at render time.
 */
export const fillTokens = (template, vars) =>
  String(template ?? '').replace(/\{(\w+)\}/g, (match, key) =>
    vars[key] === undefined ? match : String(vars[key])
  );

/* useLabText() → { xpWord, isPlayful, t(template, vars) } — t() fills {xp} plus any vars you pass ({n}, {total}, …). */
export const useLabText = () => {
  const { uiStyle } = useUiStyle();
  const xpWord = uiStyle === 'playful' ? 'XP' : 'pts';
  const t = (template, vars = {}) => fillTokens(template, { xp: xpWord, ...vars });
  return { xpWord, t, isPlayful: uiStyle === 'playful' };
};

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
