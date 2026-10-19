import { classNames } from '../../../../../utils/classNames.js';

/* Class helpers shared by the personality games (kept out of the .jsx files: react-refresh wants component-only exports). */

export const INK_HAIR = 'border border-solid border-[rgba(28,42,33,0.12)]';

/* Option card surface shared by Makola moves, Ludo moves, Escape choices, Group chat replies. */
export const optionCardClass = (selected) =>
  classNames(
    'border border-solid text-left transition-[background-color,box-shadow,border-color] duration-150',
    selected
      ? 'border-[#387440] bg-[#ebf1ec] shadow-[0_4px_11px_rgba(56,116,64,0.08)] playful:border-[1.5px] playful:shadow-[0_6px_16px_rgba(56,116,64,0.16)]'
      : 'border-[rgba(28,42,33,0.12)] bg-white hover:border-[rgba(28,42,33,0.3)]'
  );
