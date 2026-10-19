import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  HubArrowRightIcon,
  HubCalendarIcon,
  HubChartBarIcon,
  HubCompassIcon,
  HubDnsIcon,
  HubEyeOffIcon,
  HubFunctionIcon,
  HubHourglassIcon,
  HubImageIcon,
  HubLaptopIcon,
  HubMicIcon,
  HubRepeatIcon,
  HubSearchIcon,
  HubShieldIcon,
  HubStarIcon,
  HubTargetIcon,
  HubTrendUpIcon,
  HubUsersIcon,
  HubViewTableIcon,
  HubWifiOffIcon,
} from './HubIcons.jsx';
import { NOTE_ICONS, useXpWord } from './hubShared.js';

const log = debug('HubParts');

/*
 * Hub building blocks shared by every Skills Lab hub screen (Figma "Talent - Skills Lab" SL-01 …).
 * Focused is the default look; Playful only through `playful:` variants (hard 4px shadows, 1.5px dark borders,
 * stickers, Bricolage headings, "XP" instead of "pts").
 */

/* Emphasis card chrome: Playful 1.5px dark border + hard 4px shadow, Focused hairline + soft shadow. */
export const EMPHASIS_CARD =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
export const HAIRLINE_CARD = 'border border-solid border-[rgba(28,42,33,0.1)]';

export const HEADING = 'm-0 font-sans font-semibold text-[#1c2a21] playful:font-heading';

const PRIMARY_GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

const BUTTON_SIZES = {
  lg: 'min-h-[56px] gap-[8px] rounded-[14px] px-[34px] py-[16px] text-[16px] max-lg:min-h-[44px] max-lg:rounded-[10px] max-lg:px-[16px] max-lg:py-[10px] max-lg:text-[14px]',
  sm: 'min-h-[48px] gap-[8px] rounded-[10px] px-[18px] py-[12px] text-[16px] max-lg:min-h-[44px] max-lg:text-[14px]',
  xs: 'min-h-[34px] gap-[6px] rounded-[10px] px-[14px] text-[13px] max-lg:min-h-[40px] max-lg:text-[14px]',
  disabled: 'min-h-[44px] gap-[8px] rounded-[10px] px-[12px] text-[15px] max-lg:text-[14px]',
};

/* The card CTA shelf differs per style: Focused = soft shadow + hairline, Playful = the card's hard shadow. */
const CARD_CTA_SECONDARY =
  'border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[rgba(28,42,33,0.3)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const CARD_CTA_PRIMARY =
  'border-[#2a5730] bg-[#387440] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const SHELF_PRIMARY = 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626]';
const SHELF_SECONDARY =
  'border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]';

/*
 * HubButton — the Skills Lab pill button. tone: primary | secondary | cardPrimary | cardSecondary | disabled,
 * size: lg | sm | xs. Renders a router <Link> when `to` is set, a <button> otherwise (disabled -> real disabled button).
 */
export const HubButton = ({
  tone = 'secondary',
  size = 'lg',
  to,
  onClick,
  disabled,
  rightIcon,
  leftIcon,
  className,
  children,
  ...rest
}) => {
  const primary = tone === 'primary' || tone === 'cardPrimary';
  const toneClass =
    tone === 'primary'
      ? SHELF_PRIMARY
      : tone === 'cardPrimary'
        ? CARD_CTA_PRIMARY
        : tone === 'cardSecondary'
          ? classNames('bg-white text-[#1c2a21]', CARD_CTA_SECONDARY)
          : tone === 'disabled'
            ? 'cursor-not-allowed border-[#cccccc] bg-[#bfbfbf] text-white shadow-[0_4px_0_rgba(191,191,191,0.8)]'
            : SHELF_SECONDARY;
  const cls = classNames(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border-2 border-solid font-sans font-bold leading-[24px] tracking-[0.1px] no-underline transition-transform',
    tone !== 'disabled' && 'cursor-pointer active:translate-y-[2px]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
    BUTTON_SIZES[tone === 'disabled' ? 'disabled' : size],
    toneClass,
    className
  );
  const content = (
    <>
      {leftIcon ? (
        <span className="inline-flex size-[20px] shrink-0 items-center justify-center [&>svg]:size-full">
          {leftIcon}
        </span>
      ) : null}
      <span
        className={primary ? 'bg-clip-text text-transparent' : undefined}
        style={primary ? PRIMARY_GRADIENT : undefined}
      >
        {children}
      </span>
      {rightIcon ? (
        <span
          className={classNames(
            'inline-flex size-[20px] shrink-0 items-center justify-center [&>svg]:size-full',
            primary && 'text-[#fefefe]'
          )}
        >
          {rightIcon}
        </span>
      ) : null}
    </>
  );
  if (to && !disabled) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cls} {...rest}>
      {content}
    </button>
  );
};

/* Pill chip (Figma "Chip · …"): outline (white), dark (selected / Focused stat chips), soft (green, "From your skills"). */
export const HubChip = ({
  tone = 'outline',
  icon,
  onClick,
  pressed,
  className,
  children,
  ...rest
}) => {
  const toneClass =
    tone === 'dark'
      ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
      : tone === 'soft'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : tone === 'statFocused'
          ? 'border-[#1c2a21] bg-[#1c2a21] text-white playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]'
          : 'border-[#e1eae2] bg-white text-[#595959]';
  const cls = classNames(
    'inline-flex h-[32px] shrink-0 items-center justify-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:min-h-[32px] max-lg:text-[13px]',
    toneClass,
    onClick &&
      'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
    className
  );
  if (onClick) {
    return (
      <button type="button" aria-pressed={pressed} onClick={onClick} className={cls} {...rest}>
        {icon}
        {children}
      </button>
    );
  }
  return (
    <span className={cls} {...rest}>
      {icon}
      {children}
    </span>
  );
};

/* Page-title sticker: Playful = yellow rotated sticker with a hard shadow, Focused = quiet green pill. */
export const HubSticker = ({ children }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] font-bold leading-[16px] text-[#1f4d26]',
      'playful:rotate-[6deg] playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]'
    )}
  >
    {children}
  </span>
);

export const HubLink = ({ to, onClick, children }) => {
  const cls =
    'inline-flex cursor-pointer items-center gap-[4px] border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-lg:min-h-[32px]';
  const arrow = <HubArrowRightIcon className="size-[16px]" />;
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
        {arrow}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
      {arrow}
    </button>
  );
};

export const HubSectionHead = ({ title, chip, link, className }) => (
  <div className={classNames('flex flex-wrap items-center gap-x-[12px] gap-y-[6px]', className)}>
    <h2
      className={classNames(
        HEADING,
        'text-[clamp(19px,1.27vw,22px)] leading-[1.27] tracking-[-0.01em] max-lg:text-[20px]'
      )}
    >
      {title}
    </h2>
    {chip}
    <span className="min-w-0 flex-1" aria-hidden="true" />
    {link}
  </div>
);

/* The 3 / 4 right-hand tiles use this tinted rounded square behind a 15px glyph. */
export const NoteTile = ({ children }) => (
  <span className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
    {children}
  </span>
);

export const HowLabsWorkCard = ({ rows }) => (
  <section
    aria-label="How labs work"
    className={classNames(
      'flex flex-col gap-[14px] rounded-[20px] bg-white p-[22px]',
      HAIRLINE_CARD
    )}
  >
    <h2 className={classNames(HEADING, 'text-[18px] leading-[22px] tracking-[-0.01em]')}>
      How labs work
    </h2>
    <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
      {rows.map((row) => {
        const Glyph = NOTE_ICONS[row.icon];
        return (
          <li key={row.text} className="flex items-start gap-[12px]">
            <NoteTile>
              <Glyph className="size-[15px]" />
            </NoteTile>
            <span className="min-w-0 flex-1 font-sans text-[14px] leading-[20px] text-[#1c2a21] max-lg:text-[14px]">
              {row.text}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);

export const VerificationCard = ({ summary }) => {
  const xp = useXpWord();
  const rows = [
    { Icon: HubStarIcon, text: `${summary.xp} ${xp} earned in labs` },
    { Icon: HubTrendUpIcon, text: summary.topLine },
    { Icon: HubSearchIcon, text: 'Recruiters can filter by Verified skills' },
  ];
  return (
    <section
      aria-label="Your verification"
      className="flex flex-col gap-[14px] rounded-[24px] bg-[#2a5730] p-[24px] text-white"
    >
      <p className="m-0 font-sans text-[11.5px] font-bold uppercase leading-[14px] tracking-[0.06em] text-[#84cc16] max-lg:text-[12px]">
        YOUR VERIFICATION
      </p>
      <div className="flex items-end gap-[10px]">
        <span
          className={classNames(
            HEADING,
            'text-[44px] leading-[48px] tracking-[-0.02em] !text-white max-sm:text-[36px] max-sm:leading-[40px]'
          )}
        >
          {summary.verified} of {summary.total}
        </span>
        <span className="pb-[2px] font-sans text-[15px] font-medium leading-[18px]">
          skills verified
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Skills verified"
        aria-valuemin={0}
        aria-valuemax={summary.total}
        aria-valuenow={summary.verified}
        className="h-[10px] w-full overflow-hidden rounded-full bg-white/20"
      >
        <div
          className="h-full rounded-full bg-[#387440]"
          style={{ width: `${(summary.verified / summary.total) * 100}%` }}
        />
      </div>
      <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
        {rows.map((row) => {
          const Glyph = row.Icon;
          const { text } = row;
          return (
            <li key={text} className="flex items-center gap-[10px]">
              <Glyph className="size-[18px] shrink-0 text-[#ebf1ec]" />
              <span className="font-sans text-[14px] font-medium leading-[17px]">{text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export const WeeklyCard = ({ weekly, onJoin }) => {
  const xp = useXpWord();
  return (
    <section
      aria-label="This week's challenge"
      className={classNames(
        'flex flex-col gap-[10px] rounded-[24px] bg-[#ffd86b] p-[22px]',
        EMPHASIS_CARD
      )}
    >
      <div className="flex items-center gap-[8px]">
        <p className="m-0 font-sans text-[11.5px] font-bold uppercase leading-[14px] tracking-[0.06em] text-[#1c2a21] max-lg:text-[12px]">
          THIS WEEK&apos;S CHALLENGE
        </p>
        <span className="min-w-0 flex-1" aria-hidden="true" />
        <HubChip tone="dark">
          +{weekly.xp} {xp}
        </HubChip>
      </div>
      <h2 className={classNames(HEADING, 'text-[24px] leading-[29px] tracking-[-0.01em]')}>
        {weekly.title}
      </h2>
      <p className="m-0 font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
        {weekly.detail}
      </p>
      <HubButton tone="secondary" className="mt-[4px] w-full" onClick={onJoin}>
        Join the challenge
      </HubButton>
    </section>
  );
};

/* Toggle row used by "Show scores on your profile" (verified tab + history). */
export const HubToggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => {
      log('toggle', label, !on);
      onChange(!on);
    }}
    className={classNames(
      'relative inline-flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] p-[2px] transition-colors playful:border-[1.5px] playful:border-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      on ? 'justify-end bg-[#387440]' : 'justify-start bg-[#e1eae2]'
    )}
  >
    <span className="size-[20px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white playful:border-[1.2px] playful:border-[#1c2a21]" />
  </button>
);

export const ScoresCard = ({ scores, onToggle, intro }) => (
  <section
    aria-label="Show scores on your profile"
    className={classNames(
      'flex flex-col gap-[12px] rounded-[20px] bg-white p-[22px]',
      HAIRLINE_CARD
    )}
  >
    <h2 className={classNames(HEADING, 'text-[18px] leading-[22px] tracking-[-0.01em]')}>
      Show scores on your profile
    </h2>
    {intro ? (
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{intro}</p>
    ) : null}
    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
      {scores.map((s) => (
        <li key={s.labId} className="flex items-center justify-between gap-[10px]">
          <span className="min-w-0 flex-1 font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21]">
            {s.label}
          </span>
          <HubToggle on={s.shown} label={s.label} onChange={(next) => onToggle(s, next)} />
        </li>
      ))}
    </ul>
  </section>
);

/* Rows of rounded dots: 8 = card (14x8, current 22x8) or continue card (28x10, current 36x10). */
export const HubDots = ({ dots, big }) => (
  <span
    className={classNames('flex items-center', big ? 'gap-[6px]' : 'gap-[6px]')}
    aria-hidden="true"
  >
    {dots.map((d, i) => (
      <span
        key={i}
        className={classNames(
          'rounded-full',
          big ? 'h-[10px]' : 'h-[8px]',
          d === 'current'
            ? classNames(
                big ? 'w-[36px]' : 'w-[22px]',
                'border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] playful:border-[#1c2a21]'
              )
            : big
              ? 'w-[28px]'
              : 'w-[14px]',
          d === 'correct' && 'bg-[#387440]',
          d === 'review' && 'bg-[#c0392b]',
          d === 'upcoming' && 'bg-[#e7e7e7]'
        )}
      />
    ))}
  </span>
);
