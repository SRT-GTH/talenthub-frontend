import { classNames } from '../../../../../utils/classNames.js';
import {
  GameBulbDuoIcon,
  GameCheckCircleDuoIcon,
  GameCloseIcon,
  GameInfoIcon,
} from './PlanningChessIcons.jsx';

/*
 * GameV2FeedbackChip — Figma "GTH · Game feedback" pill (10/18/10/14 padding, gap 10, white 24px icon disc, 14/17 600 message).
 *   tone 'info'    #f2f5f4 / #6b6b6b   "A bigger disc can’t go on a smaller one. No move counted."
 *   tone 'success' #e2f1e4 / #27522e   "Tower moved in 17 moves. The fewest is 15."
 *   tone 'error'   #fcebe8 / #c73326   "Blunder: your queen was open. Kwaku took it."
 *   tone 'tip'     #e5f0fa / #2966b0   "The gold route is 6 blocks shorter."
 * Playful: 1.2px ink@.35 border + a 3px hard shelf. Focused: no border, no shadow.
 */
const TONES = {
  info: { box: 'bg-[#f2f5f4] text-[#6b6b6b]', icon: GameInfoIcon, iconColor: 'text-[#6b6b6b]' },
  success: {
    box: 'bg-[#e2f1e4] text-[#27522e]',
    icon: GameCheckCircleDuoIcon,
    iconColor: 'text-[#27522e]',
  },
  error: { box: 'bg-[#fcebe8] text-[#c73326]', icon: GameCloseIcon, iconColor: 'text-[#c73326]' },
  tip: { box: 'bg-[#e5f0fa] text-[#2966b0]', icon: GameBulbDuoIcon, iconColor: 'text-[#2966b0]' },
};

const GameV2FeedbackChip = ({ tone = 'info', children, className }) => {
  const t = TONES[tone] ?? TONES.info;
  const Glyph = t.icon;
  return (
    <p
      role="status"
      aria-live="polite"
      className={classNames(
        'm-0 inline-flex max-w-full items-center gap-[10px] rounded-[999px] py-[10px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-semibold',
        'playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:shadow-[0_3px_0_rgba(28,42,33,0.25)]',
        t.box,
        className
      )}
    >
      <span className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-full bg-white">
        <Glyph className={classNames('size-[16px]', t.iconColor)} />
      </span>
      <span className="min-w-0">{children}</span>
    </p>
  );
};

export default GameV2FeedbackChip;
