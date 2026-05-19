import { classNames } from '../../utils/classNames.js';

/*
 * MilestoneStatTile — single stat box on the milestone unlock screen.
 * Source: Figma frame ("You're discoverable" milestone hero, stat row).
 *
 * Three of these render side-by-side under the milestone description:
 *   "3/9 STAGES DONE"
 *   "33% PROFILE STRENGTH"
 *   "+50 XP MILESTONE BONUS"
 *
 * The number uses Instrument Serif (display); the label is the same
 * small uppercase paragraph style used by other section kickers.
 */

const MilestoneStatTile = ({ value, label, accent = 'brand', className }) => (
  <div
    className={classNames(
      'flex flex-col items-center justify-center gap-1',
      'rounded-xl bg-white border border-border-default',
      'px-5 py-4 min-w-[140px]',
      className
    )}
  >
    <span
      className={classNames(
        'font-display text-[clamp(28px,3vw,36px)] leading-[1.0] tracking-[-0.5px]',
        accent === 'accent' ? 'text-accent-dark' : 'text-brand-green'
      )}
    >
      {value}
    </span>
    <span className="font-sans font-semibold text-[10px] leading-3 tracking-[1.4px] uppercase text-neutral-darker text-center">
      {label}
    </span>
  </div>
);

export default MilestoneStatTile;
