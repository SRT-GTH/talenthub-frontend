import { classNames } from '../../../../utils/classNames.js';
import { GvInfoIcon, GvShieldIcon } from './GamesV2Icons.jsx';

/*
 * "Verifies skills" badge (green, shield) — or Makola Haggle's "Play style · early read" (gold, info icon).
 * `bordered`: Playful draws a 1.2px ink@.35 outline on the card / dialog badge (24px high); the section heading chip has none.
 */
const GameV2VerifiesChip = ({ label, playStyle = false, bordered = true }) => {
  const Glyph = playStyle ? GvInfoIcon : GvShieldIcon;
  return (
    <span
      className={classNames(
        'inline-flex shrink-0 items-center gap-[5px] rounded-full px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px]',
        playStyle ? 'bg-[#fef8ec] text-[#8a6100]' : 'bg-[#e2f1e4] text-[#27522e]',
        bordered &&
          'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:py-[3px] playful:px-[9px]'
      )}
    >
      <Glyph className="size-[13px] shrink-0" />
      {label}
    </span>
  );
};

export default GameV2VerifiesChip;
