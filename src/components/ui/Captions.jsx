import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Captions');

/*
 * Captions — horizontal step / journey indicator.
 * Source: Figma node 2374:15129 ("Captions"). Renders inside a soft
 * green-tinted pill (bg `rgba(235,241,236,0.5)`, 1px brand-green-light-active
 * border) with an active status dot on the left and chevron-separated
 * step labels.
 *
 * The Figma example shows a 3-step path: Register › Get Assessed › Get
 * Matched, with "Get Matched" as the active (brand-green) step. The other
 * steps render in grey. Use `items` + `currentIndex` to describe the path
 * and which step is current.
 *
 * Status rules (auto):
 *   index === currentIndex → active (brand-green text)
 *   else                   → inactive (grey text)
 *
 * The leading dot is a small (8px) glowing brand-green-light-active circle
 * with a 1.5px success border + a subtle green glow shadow — the visual
 * "you are here" anchor.
 *
 * ── Item shape (backward-compatible) ────────────────────────────────────
 * items can be either plain strings OR objects:
 *   { index: '01', label: 'Institution Setup' }
 *
 * When `index` is provided it renders as a bold brand-green monospace badge
 * immediately before the label text inside the same step span, e.g.:
 *   ● 01 Institution Setup
 *
 * Plain strings are normalised to { label: item } automatically, so all
 * existing usages continue to work without change.
 */

/** Normalise a Captions item to { index?, label }. */
const normalise = (item) => (typeof item === 'string' ? { label: item } : item);

const Captions = ({ items = [], currentIndex = 0, className, labelClassName, ...rest }) => {
  log('render', { itemCount: items.length, currentIndex });

  return (
    <div
      className={classNames(
        'inline-flex items-center justify-center px-8 py-2.5 gap-1 rounded-md',
        'bg-[rgba(235,241,236,0.5)] border border-brand-green-light-active',
        className
      )}
      role="navigation"
      aria-label="Onboarding progress"
      {...rest}
    >
      <div className="flex items-center gap-1.5">
        {/* Leading active dot — 8×8 brand-green-light-active w/ success-darker border + green glow */}
        <span
          aria-hidden="true"
          className={classNames(
            'block size-2 rounded-pill shrink-0',
            'bg-brand-green-light-active border-[1.5px] border-success',
            'shadow-[0_0_4px_var(--color-brand-green)]'
          )}
        />
        {items.map((rawItem, index) => {
          const item = normalise(rawItem);
          const isLast = index === items.length - 1;
          const isActive = index === currentIndex;
          return (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span
                className={classNames(
                  'inline-flex items-center gap-1',
                  'font-sans text-[12px] tracking-[0.2px] whitespace-nowrap',
                  isActive
                    ? 'font-medium text-brand-green leading-5'
                    : 'font-normal text-[#999] leading-[18px]'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Numeric index badge — only rendered when explicitly provided */}
                {item.index && (
                  <span
                    aria-hidden="true"
                    className={classNames(
                      ' font-normal  font-serif italic tracking-[0%]   text-[16px] leading-none',
                      isActive ? 'text-[#B5B5B5]' : 'text-[#B5B5B5]'
                    )}
                  >
                    {item.index}
                  </span>
                )}
                <span className={`font-sans ${labelClassName}`}>{item.label}</span>
              </span>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="font-sans font-medium text-[12px] text-[#999] opacity-35"
                >
                  ›
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Captions;
