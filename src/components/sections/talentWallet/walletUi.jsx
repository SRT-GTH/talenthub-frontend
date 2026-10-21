import { useLayoutEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import {
  WalletArrowDownLeftIcon,
  WalletArrowUpRightIcon,
  WalletBookIcon,
  WalletCardIcon,
  WalletStarIcon,
} from '../../shared/assets.jsx';
import { FOCUS_RING, HEADING } from '../talentSettings/helpUi.jsx';

export { HEADING };

/*
 * Shared building blocks of the Wallet screens (Figma "Talent Wallet" 8817:693). Focused values are the default;
 * Playful is added ONLY through `playful:` variants.
 */

// Hero cards (Balance card, Cycles card): Focused 1px ink-10 + soft shadow; Playful 1.5px ink-55 + 4px shelf.
export const HERO_CARD =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';

// Plain white cards (Coming in tiles, Recent activity, Savings, Credit score, Statements): same in both styles.
export const PLAIN_CARD = 'rounded-[22px] border border-solid border-[#e1eae2] bg-white';

export const CAPS_LABEL =
  'font-sans text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.72px]';

const PRIMARY_LABEL = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

/* GTH · Button as drawn in the Wallet frames: 14px radius, 34 x 16 padding (Playful and Focused identical). */
export const WalletButton = ({ tone = 'secondary', className, children, ...rest }) => {
  const primary = tone === 'primary';
  return (
    <button
      type="button"
      {...rest}
      className={classNames(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] whitespace-nowrap rounded-[14px] border-b-2 border-l-2 border-r-2 border-t border-solid h-[56px] px-[clamp(18px,1.97vw,34px)] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] transition-transform active:translate-y-[2px] max-lg:text-[14px]',
        FOCUS_RING,
        primary
          ? 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626]'
          : 'border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]',
        className
      )}
    >
      {primary ? <span style={PRIMARY_LABEL}>{children}</span> : children}
    </button>
  );
};

const CHIP_TONES = {
  ok: 'bg-[#e8f2ed] text-[#387440]',
  warn: 'bg-[#fff4d6] text-[#967014]',
  bad: 'bg-[#f9ebea] text-[#c0392b]',
  grey: 'bg-[#f1f1ee] text-[#575755]',
};

/* chip · Completed / Scheduled / In escrow / Failed · retry / Cycles / Saved */
export const StatusChip = ({ tone = 'ok', children, className }) => (
  <span
    className={classNames(
      'inline-flex items-center whitespace-nowrap rounded-full px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px]',
      CHIP_TONES[tone],
      className
    )}
  >
    {children}
  </span>
);

/* Title-row sticker "KYC verified" (Playful: yellow, ink border + shelf, tilted 6°; Focused: soft green pill).
   Figma lays the tilted sticker out by its rotated bounding box (h·cos6° + w·sin6°), so the header is taller for long labels:
   the wrapper takes that height in Playful (the --sticker-h variable is measured from the sticker itself). */
export const KycSticker = ({ icon, children }) => {
  const ref = useRef(null);
  const [boxH, setBoxH] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const rad = (6 * Math.PI) / 180;
    setBoxH(Math.round((h * Math.cos(rad) + w * Math.sin(rad)) * 10) / 10);
  }, [children]);
  return (
    <span
      className="flex items-center playful:h-[var(--sticker-h)] playful:px-[6px]"
      style={boxH ? { '--sticker-h': `${boxH}px` } : undefined}
    >
      <span
        ref={ref}
        className={classNames(
          'inline-flex items-center gap-[4px] whitespace-nowrap rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] font-bold leading-[1.2] text-[#1f4a2b]',
          'playful:rotate-[6deg] playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]'
        )}
      >
        {icon}
        {children}
      </span>
    </span>
  );
};

const TILE_ICONS = {
  in: WalletArrowDownLeftIcon,
  out: WalletArrowUpRightIcon,
  card: WalletCardIcon,
  book: WalletBookIcon,
  star: WalletStarIcon,
};

/* icon tile of a transaction row (40px, r12, #eef4ef, 20px glyph in #387455) */
export const TxIconTile = ({ kind }) => {
  const Glyph = TILE_ICONS[kind] ?? WalletArrowDownLeftIcon;
  return (
    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ef] text-[#387455]">
      <Glyph className="size-[20px]" />
    </span>
  );
};

/* One transaction row (Recent activity on Home, the month lists on Transactions). */
export const TxRow = ({ tx, onOpen }) => {
  const Tag = onOpen ? 'button' : 'div';
  return (
    <Tag
      {...(onOpen
        ? {
            type: 'button',
            onClick: () => onOpen(tx.id),
            'aria-label': `${tx.title}, ${typeof tx.meta === 'string' ? `${tx.meta}, ` : ''}${tx.amount}, ${tx.status}`,
          }
        : {})}
      className={classNames(
        'flex w-full items-center gap-[14px] border-0 border-b border-solid border-[#eeeee9] bg-transparent p-0 py-[12px] text-left',
        onOpen && `cursor-pointer ${FOCUS_RING}`
      )}
    >
      <TxIconTile kind={tx.kind} />
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="truncate font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
          {tx.title}
        </span>
        <span className="truncate font-sans text-[13px] leading-[1.2] text-[#575755]">
          {tx.meta}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-[4px]">
        <span
          className={classNames(
            'whitespace-nowrap font-sans text-[15px] font-semibold leading-[1.2]',
            tx.money === 'in' ? 'text-[#387440]' : 'text-[#1c2a21]'
          )}
        >
          {tx.amount}
        </span>
        <StatusChip tone={tx.tone}>{tx.status}</StatusChip>
      </span>
    </Tag>
  );
};

/* Copy that Figma draws differently in the two styles (Focused is the default, Playful via `playful:`). */
export const StyleText = ({ focused, playful }) => (
  <>
    <span className="playful:hidden">{focused}</span>
    <span className="hidden playful:inline">{playful}</span>
  </>
);
