import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';

/*
 * Shared building blocks for the talent-home content column (Core agent).
 * Focused is the default look; Playful is layered with `playful:` variants only
 * (wiki/playful-mode.md). Every class string here is a literal so Tailwind sees it.
 */

// Card surfaces ---------------------------------------------------------------------------
// INK: Focused = hairline + soft shadow; Playful = 1.5px ink border + 5px offset "shelf".
export const CARD_INK =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]';
// SOFT: pale border + soft drop (Playful has a slightly stronger drop).
export const CARD_SOFT =
  'border border-[#e7e7e7] shadow-[0_5px_8.5px_rgba(18,38,20,0.03)] playful:shadow-[0_8px_12px_rgba(18,38,20,0.06)]';
export const CARD_DASHED = 'border border-dashed border-[#c1d4c4]';

// Heading face: SF Pro Rounded in Focused, Bricolage Grotesque in Playful.
export const HEAD = 'font-sans font-semibold playful:font-heading';
// Fluid card padding (Figma 22-28px at desktop).
export const PAD_CARD = 'p-[clamp(14px,1.5vw,24px)]';

// "+50 XP" in Playful, "+50 pts" in Focused.
export const Points = ({ n }) => (
  <>
    {n} <span className="playful:hidden">pts</span>
    <span className="hidden playful:inline">XP</span>
  </>
);

// Heading with an accent-coloured part: [['Your profile '], ['journey', true]]
export const AccentText = ({ parts, accent = 'text-[#387440]', base = 'text-[#1c2a21]' }) => (
  <>
    {parts.map(([text, isAccent], i) => (
      <span key={i} className={isAccent ? accent : base}>
        {text}
      </span>
    ))}
  </>
);

// Sticker (Playful only, `genz:` layers in Figma): hidden in Focused.
export const Sticker = ({ children, className, color = 'bg-[#ffd86b]', rotate = 'rotate-6' }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'pointer-events-none absolute z-10 hidden playful:block',
      rotate,
      'motion-safe:transition-transform',
      className
    )}
  >
    <span
      className={classNames(
        'block rounded-[8px] border-[1.2px] border-[#1c2a21] px-[11px] py-[5px] text-[12px] leading-[normal] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]',
        color
      )}
    >
      {children}
    </span>
  </span>
);

// Decorative doodle star (Playful only).
export const Doodle = ({ icon, className }) => {
  const Star = icon;
  return (
    <span
      aria-hidden="true"
      className={classNames('pointer-events-none absolute hidden playful:block', className)}
    >
      <Star className="block size-full" />
    </span>
  );
};

// 32px bordered chip, identical in both styles (Figma "Chip").
const CHIP_TONES = {
  white: 'bg-white border-[#e1eae2] text-[#595959]',
  green: 'bg-[#ebf1ec] border-[#c1d4c4] text-[#387440]',
  ink: 'bg-[#1c2a21] border-[#1c2a21] text-white',
};
export const Chip = ({ tone = 'white', icon, children, className, as: Tag = 'span', ...rest }) => (
  <Tag
    className={classNames(
      'inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border px-[14px] text-[13px] leading-[normal] font-semibold whitespace-nowrap',
      CHIP_TONES[tone],
      Tag === 'button' && 'cursor-pointer',
      className
    )}
    {...rest}
  >
    {icon}
    {children}
  </Tag>
);

// Soft pill (22px, 12px text) in Focused that becomes a 32px bordered chip in Playful.
const SOFT_F = {
  green: 'bg-[#ebf1ec] text-[#387440]',
  amber: 'bg-[#faf4e8] text-[#785910]',
  grey: 'bg-[#f7f8f4] text-[#595959]',
  white: 'bg-white text-[#387440]',
  whiteGold: 'bg-white text-[#c8951a]',
};
const SOFT_P = {
  green: 'playful:bg-[#ebf1ec] playful:border-[#c1d4c4] playful:text-[#387440]',
  white: 'playful:bg-white playful:border-[#e1eae2] playful:text-[#595959]',
};
export const DualPill = ({ focused = 'green', playful = 'green', children, className }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full px-[10px] py-[4px] text-[12px] leading-[normal] font-semibold whitespace-nowrap',
      'playful:h-[32px] playful:gap-[6px] playful:border playful:px-[14px] playful:py-0 playful:text-[13px]',
      SOFT_F[focused],
      SOFT_P[playful],
      className
    )}
  >
    {children}
  </span>
);

// Always-soft meta pill (same in both styles), Journey card meta row.
const META_TONES = {
  green: 'bg-[#ebf1ec] text-[#387440]',
  amber: 'bg-[#faf4e8] text-[#785910]',
  grey: 'bg-[#f7f8f4] text-[#595959]',
};
export const MetaPill = ({ tone = 'grey', children }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full px-[10px] py-[4px] text-[12px] leading-[normal] font-semibold whitespace-nowrap',
      META_TONES[tone]
    )}
  >
    {children}
  </span>
);

// Thin gradient progress bar. Focused = solid brand green; Playful = green -> `to` gradient.
export const Bar = ({ pct, height = 6, to = 'playful:to-[#7aa870]', className }) => (
  <span
    className={classNames('block w-full overflow-hidden bg-[#eceee8]', className)}
    style={{ height, borderRadius: height / 2 }}
  >
    <span
      className={classNames(
        'block h-full bg-[#387440] playful:bg-gradient-to-r playful:from-[#387440]',
        to
      )}
      style={{ width: `${pct}%`, borderRadius: height / 2 }}
    />
  </span>
);

// "Continue →" style CTA built on the shared Button (sizes: lg 56 / md 52 / sm 48 tall).
export const CtaButton = ({ children, size = 'sm', className, ...rest }) => (
  <Button
    variant="primary"
    size={size}
    rightIcon={<ArrowRightIcon />}
    className={className}
    {...rest}
  >
    {children}
  </Button>
);

// Round avatar-ish photo.
export const Photo = ({ src, size = 36, className }) => (
  <img
    src={src}
    alt=""
    width={size}
    height={size}
    draggable="false"
    className={classNames('shrink-0 rounded-full object-cover', className)}
    style={{ width: size, height: size }}
  />
);

// Card header with title + optional "link →" on the right (Figma "Card head").
export const LinkLabel = ({ children, onClick, Icon }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex shrink-0 cursor-pointer items-center gap-[4px] text-[14px] font-semibold whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {children}
    {Icon ? <Icon className="size-[15px]" /> : null}
  </button>
);
