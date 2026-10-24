import { classNames } from '../../../../utils/classNames.js';
import { formatChange } from '../publicDataFormat.js';

/*
 * ChangeBadge — Figma "T8 · Change badge" (component 8482:22, instance 8487:346011 > 8485:34; mobile hero badge 8507:66).
 * Pure presentation, no data fetching, Focused only.
 *
 * Props
 *   pct      number   percentage change; text is built by formatChange(): 42 -> "▲ +42%", -3 -> "▼ -3%".
 *   suffix   string   words after the figure, e.g. "vs last quarter" (Figma: "▲ +42% vs last quarter").
 *   tone     'auto' | 'up' | 'down' | 'flat'   default 'auto' (>0 up, <0 down, 0 flat).
 *   surface  'tint' | 'white'   'tint' = brand-green-light pill (desktop hero), 'white' = pill on the tinted mobile hero (8507:66).
 *   size     'md' | 'sm'        md = 13/16 (desktop), sm = 12/14 (mobile hero).
 *   className
 * Variants implemented: up (drawn), down + flat (⚠️ ASSUMPTION: Figma only draws the up state; down uses the danger tint
 *   #f9ebea / #9f2a1e that the section-error icon uses, flat uses the neutral #f2f2ee / #595959).
 * a11y: the arrow glyph is decorative; an aria-label spells the change out ("Up 42% vs last quarter").
 */

const TONES = {
  up: { tint: 'bg-[#ebf1ec] text-[#2a5730]', white: 'bg-white text-[#2a5730]' },
  down: { tint: 'bg-[#f9ebea] text-[#9f2a1e]', white: 'bg-white text-[#9f2a1e]' },
  flat: { tint: 'bg-[#f2f2ee] text-[#595959]', white: 'bg-white text-[#595959]' },
};

const SIZES = {
  md: 'px-[10px] py-[4px] text-[13px] leading-[16px]',
  sm: 'px-[10px] py-[4px] text-[12px] leading-[14px]',
};

const ChangeBadge = ({ pct, suffix, tone = 'auto', surface = 'tint', size = 'md', className }) => {
  if (typeof pct !== 'number' || Number.isNaN(pct)) return null;
  const resolved = tone === 'auto' ? (pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat') : tone;
  const spoken = `${pct >= 0 ? 'Up' : 'Down'} ${Math.abs(pct)}%${suffix ? ` ${suffix}` : ''}`;
  return (
    <span
      aria-label={spoken}
      className={classNames(
        'inline-flex w-fit items-center rounded-full font-sans font-semibold whitespace-nowrap',
        SIZES[size] ?? SIZES.md,
        TONES[resolved][surface] ?? TONES[resolved].tint,
        className
      )}
    >
      <span aria-hidden="true">
        {formatChange(pct)}
        {suffix ? ` ${suffix}` : ''}
      </span>
    </span>
  );
};

export default ChangeBadge;
