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

/*
 * Theme variants. `green` (default) is the original institution look and is
 * byte-identical to the previous hardcoded classes. `amber` is the parent
 * onboarding look (white pill, amber border + dot + active label) — replaces
 * the per-section in-file badges in the parent sign-up wizard.
 *
 * `classNames` is a plain join (no tailwind-merge), so colour/padding tokens
 * that differ per theme live here rather than being passed as overrides.
 */
const VARIANTS = {
  green: {
    container: 'px-8 py-2.5 rounded-md bg-[rgba(235,241,236,0.5)] border-brand-green-light-active',
    dot: 'bg-brand-green-light-active border-success shadow-[0_0_4px_var(--color-brand-green)]',
    activeLabel: 'font-medium text-brand-green leading-5',
  },
  amber: {
    container: 'px-4 py-1 rounded-[8px] bg-white border-[#eedeb8]',
    dot: 'bg-[#eedeb8] border-[#c8951a] shadow-[0_0_4px_#f5c451]',
    activeLabel: 'font-normal text-[#c8951a] leading-[18px]',
  },
};

const Captions = ({
  items = [],
  currentIndex = 0,
  variant = 'green',
  className,
  labelClassName,
  ...rest
}) => {
  log('render', { itemCount: items.length, currentIndex, variant });
  const theme = VARIANTS[variant] ?? VARIANTS.green;

  return (
    <div
      className={classNames(
        'inline-flex items-center justify-center gap-1 border',
        theme.container,
        className
      )}
      role="navigation"
      aria-label="Onboarding progress"
      {...rest}
    >
      <div className="flex items-center gap-1.5">
        {/* Leading active dot — 8×8 themed fill + border + glow */}
        <span
          aria-hidden="true"
          className={classNames('block size-2 rounded-pill shrink-0 border-[1.5px]', theme.dot)}
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
                  isActive ? theme.activeLabel : 'font-normal text-[#999] leading-[18px]'
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
