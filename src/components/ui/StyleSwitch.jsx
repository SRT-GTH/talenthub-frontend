import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import focusedActive from '../../assets/playful/style-focused-active.svg';
import focusedInactive from '../../assets/playful/style-focused-inactive.svg';
import playfulActive from '../../assets/playful/style-playful-active.svg';
import playfulInactive from '../../assets/playful/style-playful-inactive.svg';

const log = debug('StyleSwitch');

/*
 * StyleSwitch — "GTH · Style switch", Figma 7875:85654 (two variants).
 * Pill (r999, p4, gap 2) with two 16px-icon segments; the active segment is
 * filled #387440:
 *   Focused variant: 1px rgba(28,42,33,.14) border, flat.
 *   Playful variant: 1.5px rgba(28,42,33,.55) border + drop-shadow
 *     0 10px 12px rgba(28,42,33,.06), 5px 5px 0 rgba(28,42,33,.55) (the
 *     "sticker" shelf); the active segment gets a 1.5px #1c2a21 border.
 * Labels 14px: active Semibold white, inactive Medium #595959.
 *
 * Accessibility: a radiogroup of two radios (roving tabindex + arrow keys),
 * visible focus ring. On very narrow screens the labels are visually hidden
 * (icon-only) but stay in the accessible name.
 */
const SEGMENTS = [
  { id: 'focused', label: 'Focused', active: focusedActive, inactive: focusedInactive },
  { id: 'playful', label: 'Playful', active: playfulActive, inactive: playfulInactive },
];

const StyleSwitch = ({ className, inNav = false }) => {
  const { uiStyle, setUiStyle } = useUiStyle();
  const isPlayful = uiStyle === 'playful';

  const onKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const next = uiStyle === 'focused' ? 'playful' : 'focused';
    const group = event.currentTarget.parentElement;
    log('branch', { key: event.key, next });
    setUiStyle(next);
    // move focus to the newly selected radio once it has re-rendered
    requestAnimationFrame(() => group?.querySelector('[aria-checked="true"]')?.focus());
  };

  return (
    <div
      role="radiogroup"
      aria-label="Appearance style"
      className={classNames(
        'inline-flex items-center gap-[2px] rounded-[999px] bg-white p-[4px]',
        isPlayful
          ? inNav
            ? // Top-bar instance (Figma 7878:85737): lighter 1.4px / .32 border and .2 shelf
              'border-[1.4px] border-solid border-[rgba(28,42,33,0.32)] shadow-[5px_5px_0px_rgba(28,42,33,0.2)] drop-shadow-[0px_10px_12px_rgba(28,42,33,0.06)]'
            : 'border-[1.5px] border-solid border-[rgba(28,42,33,0.55)] shadow-[5px_5px_0px_rgba(28,42,33,0.55)] drop-shadow-[0px_10px_12px_rgba(28,42,33,0.06)]'
          : 'border border-solid border-[rgba(28,42,33,0.14)]',
        className
      )}
    >
      {SEGMENTS.map((segment) => {
        const selected = uiStyle === segment.id;
        return (
          <button
            key={segment.id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => {
              if (!selected) {
                log('dispatch', { uiStyle: segment.id });
                setUiStyle(segment.id);
              }
            }}
            onKeyDown={onKeyDown}
            className={classNames(
              'inline-flex items-center gap-[6px] rounded-[999px] px-[12px] py-[7px] font-sans text-[14px] leading-[normal] whitespace-nowrap transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              selected
                ? classNames(
                    'bg-brand-green font-semibold text-white',
                    isPlayful && 'border-[1.5px] border-solid border-[#1c2a21]'
                  )
                : 'font-medium text-[#595959] hover:bg-brand-green-light'
            )}
          >
            <img
              src={selected ? segment.active : segment.inactive}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="size-[16px] shrink-0"
            />
            <span className="max-[480px]:sr-only">{segment.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StyleSwitch;
