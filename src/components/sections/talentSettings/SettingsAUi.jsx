import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SettingsACheckIcon,
  SettingsAToastCheckIcon,
  SettingsAToggleOffIcon,
  SettingsAToggleOffPlayfulIcon,
  SettingsAToggleOnIcon,
  SettingsAToggleOnPlayfulIcon,
} from '../../shared/assets.jsx';

const log = debug('SettingsAUi');

/*
 * Talent settings · A — shared building blocks (cards, rows, toggles, checkboxes, link buttons,
 * unsaved bar, toast). Focused is the default look; Playful is layered with `playful:` variants only
 * (wiki/playful-mode.md). Values come from ST-01..ST-09b (Focused 8110:*, Playful 78xx:*).
 */

// Head font: SF Pro Rounded in Focused, Bricolage Grotesque in Playful.
export const HEAD = 'font-sans font-semibold playful:font-heading';
const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* ---------- group card (Figma "group · …") ---------- */
export const SettingsACard = ({ title, desc, gap = 'gap-[8px]', className, children, ...rest }) => (
  <section
    aria-label={title}
    className={classNames(
      'flex w-full min-w-0 flex-col rounded-[20px] border border-[rgba(28,42,33,0.1)] bg-white p-[clamp(14px,1.39vw,24px)]',
      gap,
      className
    )}
    {...rest}
  >
    <header className="flex flex-col gap-[4px] pb-[8px]">
      <h2
        className={classNames(
          HEAD,
          'text-[clamp(17px,1.1vw,19px)] leading-[1.25] tracking-[-0.19px] text-[#1c2a21]'
        )}
      >
        {title}
      </h2>
      {desc ? <p className="text-[14px] leading-[1.45] text-[#595959]">{desc}</p> : null}
    </header>
    {children}
  </section>
);

/* ---------- row: title + description left, control right ---------- */
export const SettingsARow = ({ title, desc, first = false, className, badge, children }) => (
  <div
    className={classNames(
      'flex items-center gap-[20px] py-[14px] max-sm:gap-[12px]',
      !first && 'border-t border-[rgba(28,42,33,0.08)]',
      className
    )}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
      <div className="flex min-w-0 items-center gap-[8px]">
        <p className="leading-[18px] text-[15px] font-semibold text-[#1c2a21]">{title}</p>
        {badge}
      </div>
      {desc ? <p className="text-[13.5px] leading-[1.45] text-[#595959]">{desc}</p> : null}
    </div>
    {children}
  </div>
);

/* ---------- link button ("Change", "Choose per skill", …) ---------- */
export const SettingsALink = ({ children, onClick, tone = 'green', className, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'shrink-0 cursor-pointer text-[14px] font-semibold whitespace-nowrap underline decoration-solid',
      tone === 'green' ? 'text-[#387440]' : 'text-[#595959]',
      FOCUS_RING,
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

/* ---------- toggle (44×26 SVG, Focused + Playful artwork) ---------- */
export const SettingsAToggle = ({ on, onChange, label, disabled = false }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange?.(!on)}
    className={classNames(
      'relative block h-[26px] w-[44px] shrink-0 cursor-pointer rounded-full',
      disabled && 'cursor-not-allowed',
      FOCUS_RING
    )}
  >
    <span className="playful:hidden">
      {on ? (
        <SettingsAToggleOnIcon className="block h-[26px] w-[44px]" />
      ) : (
        <SettingsAToggleOffIcon className="block h-[26px] w-[44px]" />
      )}
    </span>
    <span className="hidden playful:block">
      {on ? (
        <SettingsAToggleOnPlayfulIcon className="block h-[26px] w-[44px]" />
      ) : (
        <SettingsAToggleOffPlayfulIcon className="block h-[26px] w-[44px]" />
      )}
    </span>
  </button>
);

/* ---------- checkbox (22×22, r6) ---------- */
export const SettingsACheckbox = ({ checked, onChange, label, disabled = false }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange?.(!checked)}
    className={classNames(
      'flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[6px]',
      checked
        ? 'bg-[#387440]'
        : 'border border-[rgba(28,42,33,0.1)] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.35)]',
      disabled && 'cursor-not-allowed',
      FOCUS_RING
    )}
  >
    {checked ? <SettingsACheckIcon className="block size-[16px]" /> : null}
  </button>
);

/* ---------- sticky "You have 1 unsaved change" bar (ST-02b / ST-09) ---------- */
export const SettingsASaveBar = ({ message, discardLabel, saveLabel, onDiscard, icon }) => (
  <div
    role="status"
    className="sticky bottom-[clamp(12px,1.39vw,24px)] z-20 flex w-full flex-wrap items-center gap-x-[16px] gap-y-[8px] rounded-[20px] bg-[#1c2a21] px-[clamp(14px,1.39vw,24px)] py-[14px] shadow-[0_1px_1.5px_rgba(28,42,33,0.06),0_5px_8.5px_rgba(28,42,33,0.04)] playful:shadow-[0_1px_1.5px_rgba(28,42,33,0.06),0_8px_12px_rgba(28,42,33,0.08)]"
  >
    {icon}
    <p className="leading-[18px] min-w-0 flex-1 text-[15px] font-semibold text-white max-sm:basis-[60%]">
      {message}
    </p>
    <button
      type="button"
      onClick={onDiscard}
      className={classNames(
        'cursor-pointer px-[16px] py-[10px] text-[15px] font-semibold whitespace-nowrap text-white underline decoration-solid max-sm:px-[8px]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
      )}
    >
      {discardLabel}
    </button>
    {saveLabel}
  </div>
);

/* ---------- "Toast · Saved" (ST-09b) ---------- */
export const SettingsAToast = ({ title, body, undoLabel, onUndo, onExpire, ms = 10000 }) => {
  useEffect(() => {
    log('toast shown', { title });
    const t = window.setTimeout(() => onExpire?.(), ms);
    return () => window.clearTimeout(t);
  }, [title, ms, onExpire]);
  return (
    <div
      role="status"
      className="fixed top-[clamp(64px,6.02vw,104px)] right-[clamp(12px,3.24vw,56px)] z-[70] flex max-w-[calc(100vw-24px)] items-center gap-[12px] rounded-[16px] border border-[rgba(28,42,33,0.1)] bg-white px-[18px] py-[14px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]"
    >
      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#387440] playful:bg-[#ebf1ec]">
        <SettingsAToastCheckIcon className="block size-[16px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-px">
        <p className="leading-[18px] text-[15px] font-semibold text-[#1c2a21]">{title}</p>
        <p className="leading-[16px] text-[13px] text-[#595959]">{body}</p>
      </div>
      <button
        type="button"
        onClick={onUndo}
        className={classNames(
          'cursor-pointer px-[10px] py-[6px] text-[14px] font-semibold whitespace-nowrap text-[#387440] underline decoration-solid',
          FOCUS_RING
        )}
      >
        {undoLabel}
      </button>
    </div>
  );
};
