import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { usePlayfulScope } from '../../ui/PlayfulScope.js';
import {
  ShareArrowLeftIcon,
  ShareBoxesIcon,
  ShareCardCheckWhiteIcon,
  ShareCardMobileIcon,
  ShareCardWorkIcon,
  ShareCloseIcon,
} from '../../shared/assets.jsx';
import { FitArt } from './ShareCardArt.jsx';
import { CARD_LOOKS, CARD_SIZES, SHOW_OPTIONS, STEPPER } from './talentProfileCardData.js';

const log = debug('ShareCardParts');

/* ---------- buttons (Focused: DS Button; Playful: shelf buttons from playful.css) ---------- */
export const CardButton = ({ variant = 'primary', children, className = '', ...rest }) => {
  const playful = usePlayfulScope();
  if (playful) {
    return (
      <button
        type="button"
        className={classNames(
          'pf-ov-btn !min-h-[48px] !text-[16px] !font-bold',
          variant === 'primary' ? 'pf-ov-btn--primary' : 'pf-ov-btn--secondary',
          className
        )}
        {...rest}
      >
        {variant === 'primary' ? <span className="pf-ov-btn__grad">{children}</span> : children}
      </button>
    );
  }
  return (
    <Button
      variant={variant === 'primary' ? 'primary' : 'tertiary'}
      size="sm"
      className={className}
      {...rest}
    >
      {children}
    </Button>
  );
};

/* ---------- head ---------- */
const SquareIconButton = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e6e6e6] bg-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {children}
  </button>
);

export const CardHeader = ({ titleId, descId, title, sub, onBack, onClose, titleRef }) => (
  <div className="flex items-start gap-[12px]">
    <SquareIconButton label="Back" onClick={onBack}>
      <ShareArrowLeftIcon />
    </SquareIconButton>
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <h2
        id={titleId}
        ref={titleRef}
        tabIndex={-1}
        className="m-0 text-[clamp(22px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading outline-none"
      >
        {title}
      </h2>
      <p id={descId} className="m-0 text-[14px] leading-[normal] text-[#737373]">
        {sub}
      </p>
    </div>
    <SquareIconButton label="Close" onClick={onClose}>
      <ShareCloseIcon />
    </SquareIconButton>
  </div>
);

/* ---------- stepper: done = how many steps are complete, active = index (or -1 when all done) ---------- */
export const CardStepper = ({ done, active }) => (
  <ol
    aria-label="Progress"
    className="m-0 flex list-none flex-wrap items-center gap-x-[10px] gap-y-[6px] p-0"
  >
    {STEPPER.map((label, i) => {
      const isDone = i < done;
      const isActive = i === active;
      return (
        <li
          key={label}
          className="flex items-center gap-[10px]"
          aria-current={isActive ? 'step' : undefined}
        >
          <span className="flex items-center gap-[8px]">
            <span
              className={classNames(
                'flex size-[26px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                isDone && 'border border-[rgba(28,42,33,0.12)] bg-[#387440] text-white',
                isActive && 'border border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white',
                !isDone && !isActive && 'border-[1.5px] border-[#bfbfbf] bg-white text-[#737373]'
              )}
            >
              {isDone ? <ShareCardCheckWhiteIcon className="size-[13px]" /> : i + 1}
            </span>
            <span
              className={classNames(
                'text-[13px] whitespace-nowrap',
                isActive ? 'font-semibold' : 'font-medium',
                isDone || isActive ? 'text-[#1c2a21]' : 'text-[#737373]'
              )}
            >
              {label}
            </span>
          </span>
          {i < STEPPER.length - 1 && (
            <span
              aria-hidden="true"
              className={classNames(
                'h-[2px] w-[clamp(20px,2.3vw,40px)] shrink-0 rounded-[1px]',
                i < done ? 'bg-[#387440]' : 'bg-[#e6e6e6]'
              )}
            />
          )}
        </li>
      );
    })}
  </ol>
);

/* ---------- preview stage ---------- */
export const PreviewStage = ({ size, dims, children, badge, className = '' }) => (
  <div
    className={classNames(
      'relative flex flex-col items-center gap-[12px] self-start rounded-[20px] bg-[#f8f8f4] pt-[24px] pb-[24px]',
      size === 'banner' ? 'px-[24px]' : 'px-[20px]',
      className
    )}
  >
    {badge}
    <FitArt size={size}>{children}</FitArt>
    <p className="m-0 text-[12px] leading-[14px] font-medium text-[#595959]">{dims}</p>
  </div>
);

/* ---------- Style swatches ---------- */
export const StyleGroup = ({ look, onChange }) => {
  const playful = usePlayfulScope();
  return (
    <div className="flex flex-col gap-[10px]" role="radiogroup" aria-label="Style">
      <p className="m-0 text-[14px] leading-[normal] font-medium text-[#1c2a21]" aria-hidden="true">
        Style
      </p>
      <div className="flex gap-[12px]">
        {CARD_LOOKS.map((l) => {
          const selected = l.id === look;
          return (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                log('look', l.id);
                onChange(l.id);
              }}
              className="flex cursor-pointer flex-col items-center gap-[6px] rounded-[18px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387440]"
            >
              <span
                className={classNames(
                  'relative block size-[64px] rounded-[16px] border',
                  selected
                    ? 'border-[1.2px] border-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[3px_3px_0_rgba(28,42,33,0.55)]'
                    : 'border-[#e6e6e6]'
                )}
                style={{ backgroundColor: l.bg }}
              >
                <span
                  className="absolute right-[8px] bottom-[8px] size-[18px] rounded-full"
                  style={{ backgroundColor: playful && l.playfulDot ? l.playfulDot : l.dot }}
                />
              </span>
              <span
                className={classNames(
                  'text-[12px] leading-[normal]',
                  selected ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#595959]'
                )}
              >
                {l.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Size segmented control ---------- */
const SIZE_ICON = {
  story: <ShareCardMobileIcon className="size-[15px]" />,
  post: <ShareBoxesIcon className="size-[15px]" />,
  banner: <ShareCardWorkIcon className="size-[15px]" />,
};

export const SizeGroup = ({ size, onChange }) => (
  <div className="flex flex-col gap-[10px]">
    <p id="card-size-label" className="m-0 text-[14px] leading-[normal] font-medium text-[#1c2a21]">
      Size
    </p>
    <div
      role="radiogroup"
      aria-labelledby="card-size-label"
      className="flex max-w-full flex-wrap gap-[2px] self-start rounded-[12px] border border-[#e6e6e6] bg-[#f8f8f4] p-[3px]"
    >
      {CARD_SIZES.map((s) => {
        const active = s.id === size;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              log('size', s.id);
              onChange(s);
            }}
            className={classNames(
              'flex cursor-pointer items-center gap-[6px] rounded-[9px] px-[14px] py-[9px] text-[13px] leading-[normal] font-semibold whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              active ? 'bg-[#1c2a21] text-white' : 'text-[#595959]'
            )}
          >
            <span className={classNames('flex shrink-0', !active && '[&_path]:fill-[#595959]')}>
              {SIZE_ICON[s.id]}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* ---------- Show-on-card checkboxes ---------- */
const Check = ({ id, label, checked, onChange }) => {
  const inputId = useId();
  return (
    <label htmlFor={inputId} className="flex cursor-pointer items-center gap-[10px]">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          log('show', id, e.target.checked);
          onChange(id, e.target.checked);
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={classNames(
          'flex size-[20px] shrink-0 items-center justify-center rounded-[6px] border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440]',
          checked ? 'border-[#387440] bg-[#387440]' : 'border-[1.5px] border-[#bfbfbf] bg-white'
        )}
      >
        {checked && <ShareCardCheckWhiteIcon className="size-[13px]" />}
      </span>
      <span
        className={classNames(
          'text-[14px] leading-[normal] font-medium',
          checked ? 'text-[#1c2a21]' : 'text-[#595959]'
        )}
      >
        {label}
      </span>
    </label>
  );
};

export const ShowGroup = ({ show, onChange, rowGap = 10 }) => (
  <fieldset className="m-0 min-w-0 border-0 p-0">
    <legend className="mb-[10px] p-0 text-[14px] leading-[normal] font-medium text-[#1c2a21]">
      Show on card
    </legend>
    <div
      className="grid grid-cols-1 gap-x-[12px] sm:grid-cols-[repeat(2,minmax(0,250px))]"
      style={{ rowGap }}
    >
      {SHOW_OPTIONS.map((o) => (
        <Check
          key={o.id}
          id={o.id}
          label={o.label}
          checked={Boolean(show[o.id])}
          onChange={onChange}
        />
      ))}
    </div>
  </fieldset>
);

/* ---------- footer row: note + actions ---------- */
export const CardFooter = ({ note, children }) => (
  <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[12px]">
    <div className="flex min-w-[200px] flex-1 items-center gap-[6px] text-[12px] leading-[14px] font-medium text-[#737373]">
      {note}
    </div>
    <div className="flex items-center gap-[10px] max-sm:w-full max-sm:justify-end">{children}</div>
  </div>
);
