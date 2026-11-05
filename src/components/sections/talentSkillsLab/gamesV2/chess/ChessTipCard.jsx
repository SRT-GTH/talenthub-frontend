import { GameBulbIcon } from '../planningShared/PlanningChessIcons.jsx';

/* ChessTipCard — Figma "tip": #faf4e8, r14, padding 12/16, gap 10, 18px bulb + 14/17 600 #463409 text. */
const ChessTipCard = ({ children }) => (
  <p className="m-0 flex items-start gap-[10px] rounded-[14px] bg-[#faf4e8] px-[16px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#463409]">
    <GameBulbIcon className="size-[18px] shrink-0 text-[#463409]" />
    <span className="min-w-0">{children}</span>
  </p>
);

export default ChessTipCard;
