import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { FOCUS_RING } from '../talentSettings/helpUi.jsx';
import { HEADING, HERO_CARD, StatusChip } from './walletUi.jsx';

/*
 * Shared panels of the Wallet pages (Figma: the big white "card" with a spot illustration, chip, heading, text, content, buttons;
 * "info tile" grids; stepper-less timelines). Focused values are the default, Playful via `playful:` variants.
 */

const log = debug('WalletPanels');

const CARD_GAPS = {
  12: 'gap-[12px]',
  14: 'gap-[14px]',
  16: 'gap-[16px]',
  18: 'gap-[18px]',
  20: 'gap-[20px]',
  24: 'gap-[24px]',
};

const PLAYFUL_GAPS = {
  8: 'playful:gap-[8px]',
  10: 'playful:gap-[10px]',
  12: 'playful:gap-[12px]',
  14: 'playful:gap-[14px]',
  16: 'playful:gap-[16px]',
  18: 'playful:gap-[18px]',
  20: 'playful:gap-[20px]',
  24: 'playful:gap-[24px]',
};

/* `gap` is one number (both styles) or [Focused, Playful]. */
const gapClass = (gap, fallback) => {
  const [f, p] = Array.isArray(gap) ? gap : [gap, gap];
  return classNames(CARD_GAPS[f] ?? fallback, p !== f && PLAYFUL_GAPS[p]);
};

/* Hero card shell: r26, padding 22 x 24, gap 24 (18 on the "pending" cards). */
export const HeroCard = ({ gap = 24, className, children, ...rest }) => (
  <section
    {...rest}
    className={classNames(
      'flex flex-col rounded-[26px] bg-white px-[clamp(16px,1.4vw,24px)] py-[22px]',
      gapClass(gap, 'gap-[24px]'),
      HERO_CARD,
      className
    )}
  >
    {children}
  </section>
);

/* Spot illustration (96px) + status chip + heading + paragraph, the head of a hero card. */
export const HeroHead = ({
  art,
  chip,
  title,
  titleClass = 'text-[30px] tracking-[-0.02em]',
  textClass = 'text-[15px]',
  text,
  artChipGap,
  headGap = 12,
  wide = false,
}) => (
  <>
    <div className={artChipGap ? 'flex flex-col items-start gap-[4px]' : 'contents'}>
      {art ? <img src={art} alt="" className="size-[96px] shrink-0" /> : null}
      {chip ? (
        <StatusChip tone={chip.tone} className="self-start">
          {chip.text}
        </StatusChip>
      ) : null}
    </div>
    {title ? (
      <div className="flex flex-col" style={{ gap: headGap }}>
        <h2
          className={classNames(
            HEADING,
            wide ? 'max-w-[800px]' : 'max-w-[760px]',
            'm-0 leading-[1.15] text-[#1c2a21]',
            titleClass
          )}
        >
          {title}
        </h2>
        {text ? (
          <p
            className={classNames(
              wide ? 'max-w-[800px]' : 'max-w-[760px]',
              'm-0 font-sans leading-[1.2] text-[#575755]',
              textClass
            )}
          >
            {text}
          </p>
        ) : null}
      </div>
    ) : null}
  </>
);

/* Soft grey info tile (benefits, loan facts): icon or label + value. */
export const InfoTile = ({ children, className }) => (
  <div className={classNames('rounded-[16px] bg-[#f4f7f2] p-[16px]', className)}>{children}</div>
);

/* A drawn row of a vertical status timeline: 12px dot + bold label + soft note. */
export const TimelineRow = ({ dot, label, note, labelClass = 'text-[#1c2a21]' }) => (
  <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[2px]">
    <span
      aria-hidden="true"
      className="size-[12px] shrink-0 rounded-full"
      style={{ background: dot }}
    />
    <span className={`font-sans text-[14px] font-semibold leading-[1.2] ${labelClass}`}>
      {label}
    </span>
    <span className="font-sans text-[13px] leading-[1.2] text-[#575755]">{note}</span>
  </div>
);

/* Text link in brand green. */
export const GreenLink = ({ onClick, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'min-h-[24px] shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 text-left font-sans text-[14px] font-semibold leading-[1.2] text-[#387440]',
      FOCUS_RING,
      className
    )}
  >
    {children}
  </button>
);

/* Section heading row: title, optional Playful-only sticker, spacer, green link on the right. */
export const SectionHead = ({ title, link, onLink, sticker }) => (
  <div className="flex w-full flex-wrap items-center gap-x-[8px] gap-y-[4px]">
    <h2 className={classNames(HEADING, 'm-0 text-[22px] leading-[1.25] text-[#1c2a21]')}>
      {title}
    </h2>
    {sticker ? (
      <span className="hidden whitespace-nowrap rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-white px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[1.2] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-flex playful:rotate-[3deg] max-lg:playful:text-[12px]">
        {sticker}
      </span>
    ) : null}
    <span className="min-w-0 flex-1" />
    {link ? <GreenLink onClick={onLink}>{link}</GreenLink> : null}
  </div>
);

/* 8px progress track (#eceee9) with a coloured fill; `value` 0..1. */
export const Progress = ({ value, fill, className, height = 8 }) => (
  <div
    role="presentation"
    className={classNames('w-full overflow-hidden rounded-[99px] bg-[#eceee9]', className)}
    style={{ height }}
  >
    <div
      className="h-full rounded-[99px]"
      style={{ width: `${Math.min(1, value) * 100}%`, background: fill }}
    />
  </div>
);

/* Small side card: title row inside a white plain card (credit mini, repayment plan, upcoming payments). */
export const SideCard = ({ label, title, gap = 20, pad, className, children, ...rest }) => (
  <section
    {...rest}
    className={classNames(
      'flex flex-col rounded-[22px] border border-solid border-[#e1eae2] bg-white',
      pad === 18 ? 'p-[clamp(16px,1.04vw,18px)]' : 'p-[clamp(16px,1.1vw,19px)]',
      gapClass(gap, 'gap-[20px]'),
      className
    )}
  >
    {label ? (
      <p className="m-0 font-sans text-[12px] font-semibold uppercase leading-[1.2] tracking-[0.72px] text-[#575755]">
        {label}
      </p>
    ) : null}
    {title ? (
      <h2 className={classNames(HEADING, 'm-0 text-[18px] leading-[1.25] text-[#1c2a21]')}>
        {title}
      </h2>
    ) : null}
    {children}
  </section>
);

/* Soft box of label / value rows (repayment plan, upcoming payments). */
export const RowsBox = ({ rows, gap = 16 }) => (
  <dl
    className={classNames(
      'm-0 flex flex-col rounded-[16px] bg-[#f4f7f2] p-[16px] font-sans text-[14px] leading-[1.2]',
      gap === 20 ? 'gap-[20px]' : 'gap-[16px]'
    )}
  >
    {rows.map(([a, b]) => (
      <div key={a} className="flex justify-between gap-[12px]">
        <dt className="whitespace-nowrap text-[#575755]">{a}</dt>
        <dd className="m-0 whitespace-nowrap text-right font-semibold text-[#2d5d33]">{b}</dd>
      </div>
    ))}
  </dl>
);

/* Talent credit score mini card (right column of the financing and credit pages). Props: onView. */
export const CreditMiniCard = () => (
  <SideCard label="Talent credit score" aria-label="Talent credit score">
    <div className="flex items-center gap-[8px]">
      <span
        className={classNames(
          HEADING,
          'text-[32px] leading-[1.15] tracking-[-0.02em] text-[#1c2a21]'
        )}
      >
        712
      </span>
      <StatusChip tone="ok">Good</StatusChip>
    </div>
    <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#575755]">
      Good scores get lower rates. Verified skills and finished courses help most.
    </p>
    <GreenLink onClick={() => log('view your score (no destination in the prototype)')}>
      View your score →
    </GreenLink>
  </SideCard>
);
