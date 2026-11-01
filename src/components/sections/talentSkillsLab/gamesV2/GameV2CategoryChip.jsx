import { GAME_V2_CATEGORIES } from './gamesV2Data.js';

/* Category chip (Figma `category chip`: r999, 4/10 padding, 12/14 600, colours per category). */
const GameV2CategoryChip = ({ category }) => {
  const c = GAME_V2_CATEGORIES[category];
  return (
    <span
      className="inline-flex min-w-0 items-center rounded-full px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px]"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      <span className="truncate">{c.label}</span>
    </span>
  );
};

export default GameV2CategoryChip;
