import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SettingsTrashIcon } from '../../shared/assets.jsx';

const log = debug('SettingsBUi');

/*
 * Shared building blocks for the Settings-B pages (ST-05..ST-09). Focused is the default look
 * (built from the Focused frames); Playful is layered with `playful:` variants only
 * (wiki/playful-mode.md). Every class string is a literal so Tailwind sees it.
 * Figma colours are exact — no contrast recolouring.
 */

const HEAD_FONT = 'font-sans font-semibold playful:font-heading';
// 15px label text; descriptions 13.5px (floors at 12px are respected, nothing here is below 13px
// except the 11px chips, which switch to 12px below lg).
const ROW_TITLE = 'text-[15px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]';
const ROW_DESC = 'text-[13.5px] leading-[1.45] text-[#595959]';

// Group card (Figma `group · …`): white, 20px radius, hairline border, 24px padding.
// (add-only) `recruiter`: the recruiter Settings card (Figma "Card · …", 10161:80007): 16px radius, #e5e8e3 border + soft shadow, gap 16, Bricolage 22/26 title, 12/20 description.
export const GroupCard = ({
  title,
  description,
  children,
  gap = 'gap-[8px]',
  danger = null,
  recruiter = false,
  className,
  headClassName,
  ...rest
}) => {
  const border =
    danger === 'paused'
      ? 'border-[1.5px] border-[#bf382b]'
      : danger
        ? 'border-[1.5px] border-[#c0392b]'
        : 'border border-[rgba(28,42,33,0.1)]';
  const titleColor =
    danger === 'paused' ? 'text-[#902b20]' : danger ? 'text-[#c0392b]' : 'text-[#1c2a21]';
  return (
    <section
      className={classNames(
        'flex w-full flex-col items-start bg-white p-[clamp(14px,1.4vw,24px)]',
        recruiter
          ? 'gap-[16px] rounded-[16px] border border-[#e5e8e3] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)]'
          : `rounded-[20px] ${border} ${gap}`,
        className
      )}
      {...rest}
    >
      {title && (
        <header
          className={classNames(
            'flex w-full flex-col items-start',
            recruiter ? 'gap-[2px]' : 'pb-[8px]',
            !recruiter && description && 'gap-[4px]',
            headClassName
          )}
        >
          <h2
            className={classNames(
              recruiter ? 'font-heading font-semibold' : HEAD_FONT,
              recruiter
                ? 'text-[22px] leading-[26px] tracking-[-0.44px] text-[#111]'
                : `text-[19px] leading-[1.25] tracking-[-0.19px] whitespace-nowrap ${titleColor}`
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={classNames(
                'w-full',
                recruiter
                  ? 'text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]'
                  : 'text-[14px] leading-[1.45] text-[#595959]'
              )}
            >
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
};

// Setting row: text on the left, a control on the right. `top` draws the 8% divider above the row
// (Figma draws it on every row but the last of a group).
export const SettingRow = ({
  title,
  description,
  chip,
  control,
  top = true,
  nowrapControl = true,
  className,
  titleId,
  recruiter = false,
}) => (
  <div
    className={classNames(
      'flex w-full items-center',
      // (add-only) `recruiter`: Figma "Setting · …" rows: no divider, gap 12, 14/24 title and 12/20 description.
      recruiter ? 'gap-x-[12px] gap-y-[10px]' : 'gap-x-[20px] gap-y-[10px] py-[14px]',
      !recruiter && top && 'border-t border-[rgba(28,42,33,0.08)]',
      nowrapControl ? 'flex-nowrap' : 'flex-wrap',
      className
    )}
  >
    <div
      className={classNames(
        'flex min-w-0 flex-[1_1_220px] flex-col items-start',
        recruiter ? 'gap-[2px]' : 'gap-[3px]'
      )}
    >
      <div className="flex items-center gap-[8px]">
        <p
          id={titleId}
          className={
            recruiter
              ? 'text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]'
              : ROW_TITLE
          }
        >
          {title}
        </p>
        {chip}
      </div>
      {description && (
        <p
          className={
            recruiter ? 'text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]' : ROW_DESC
          }
        >
          {description}
        </p>
      )}
    </div>
    {control}
  </div>
);

// Switch 44x26 — Focused: 1px .12 ring; Playful: 1.5px ink ring and half-pixel knob offsets.
// (add-only) `recruiter`: the 40x22 recruiter switch (Figma "Toggle · On/Off": #387440 / #babab7, 18px white knob with a soft shadow, no ring); `disabled` is also new.
export const SettingsToggle = ({
  checked,
  onChange,
  label,
  labelledBy,
  className,
  recruiter = false,
  disabled = false,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={labelledBy ? undefined : label}
    aria-labelledby={labelledBy}
    disabled={disabled}
    onClick={() => {
      log('toggle', { label: label ?? labelledBy, next: !checked });
      onChange(!checked);
    }}
    className={classNames(
      'relative shrink-0 cursor-pointer rounded-full transition-colors duration-150 disabled:cursor-not-allowed',
      recruiter
        ? 'h-[22px] w-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
        : 'h-[26px] w-[44px] shadow-[inset_0_0_0_1px_rgba(28,42,33,0.12)] playful:shadow-[inset_0_0_0_1.5px_#1c2a21]',
      checked ? 'bg-[#387440]' : recruiter ? 'bg-[#babab7]' : 'bg-[#e1eae2]',
      className
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'absolute rounded-full bg-white',
        'motion-safe:transition-[left] motion-safe:duration-150',
        recruiter
          ? 'top-[2px] size-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.18)]'
          : 'top-[3px] size-[20px] border-[1.2px] border-[#1c2a21]',
        recruiter
          ? checked
            ? 'left-[20px]'
            : 'left-[2px]'
          : checked
            ? 'left-[21px] playful:left-[20.5px]'
            : 'left-[3px] playful:left-[3.5px]'
      )}
    />
  </button>
);

// Segmented control (Figma `seg`): #f8f8f4 tray, white active segment with a green label.
export const SegmentedControl = ({ options, value, onChange, label, className }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className={classNames(
      'flex shrink-0 items-start gap-[4px] rounded-[12px] bg-[#f8f8f4] p-[4px]',
      className
    )}
  >
    {options.map((option) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => {
            log('segment', { label, option });
            onChange(option);
          }}
          className={classNames(
            'cursor-pointer rounded-[10px] border px-[clamp(10px,1vw,14px)] py-[8px] text-[14px] leading-[normal] font-semibold whitespace-nowrap',
            active
              ? 'border-[rgba(28,42,33,0.1)] bg-white text-[#387440] playful:border-[rgba(28,42,33,0.15)]'
              : 'border-transparent text-[#1c2a21]'
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);

// Small pills: Beta (amber), On / Linked / Saves about 60% (green; Playful = light green + ink ring),
// This device (soft green). 11px on desktop, 12px below lg.
const PILL_BASE =
  'inline-flex shrink-0 items-center rounded-full text-[11px] leading-[normal] whitespace-nowrap max-lg:text-[12px]';
const PILL_TONES = {
  beta: 'bg-[#faf4e8] px-[7px] py-[2px] font-semibold text-[#463409]',
  on: 'gap-[6px] border border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] py-[2px] font-bold text-[#1c2a21] playful:border-[#1c2a21] playful:bg-[#ebf1ec]',
  device: 'bg-[#ebf1ec] px-[8px] py-[2px] font-semibold text-[#2a5730]',
};
export const StatusPill = ({ tone, children, className }) => (
  <span className={classNames(PILL_BASE, PILL_TONES[tone], className)}>{children}</span>
);

// Underlined text action (Disconnect / Log out / Change / Reset to default).
const ACTION_TONES = {
  danger: 'text-[#902b20]',
  green: 'text-[#387440]',
  grey: 'text-[#595959]',
};
export const TextAction = ({ tone = 'danger', onClick, children, className, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'shrink-0 cursor-pointer text-[14px] leading-[normal] font-semibold whitespace-nowrap underline decoration-solid decoration-from-font [text-underline-position:from-font]',
      ACTION_TONES[tone],
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

// "Delete my account" action (Figma `Btn · Delete my account`): cream (danger row) or white
// (confirm dialog) tertiary with a green trash glyph.
export const DeleteAccountButton = ({ onClick, tone = 'cream', disabled, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px]',
      'border-x-2 border-t border-b-2 border-solid border-[rgba(28,42,33,0.3)]',
      'drop-shadow-[0_4px_0_rgba(17,17,17,0.25)] max-lg:drop-shadow-[0_2px_0_rgba(17,17,17,0.25)]',
      'px-[20px] max-lg:px-[14px] max-lg:py-[8px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap max-lg:text-[14px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      tone === 'cream'
        ? 'h-[47px] bg-[#faf4e8] text-[#575755] max-lg:h-auto'
        : 'h-[46px] bg-white text-[#1c2a21] max-lg:h-auto',
      className
    )}
  >
    <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
    {children}
  </button>
);
