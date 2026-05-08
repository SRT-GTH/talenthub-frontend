import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Breadcrumbs');

/*
 * Breadcrumbs — vertical step list.
 * Source: Figma frame 2263:8179 ("Breadcrumbs"). Variants:
 *   2263:8178 default  — pending step (grey medium text + grey check)
 *   2263:8180 variant2 — active / current step (brand-green semibold + green filled check)
 *   2263:8186 variant3 — completed step (grey medium text + green filled check)
 *
 * Note: Figma names this "Breadcrumbs" but the layout is a vertical step
 * list (think wizard sidebar), not horizontal site breadcrumbs. We follow
 * Figma's name for consistency. For horizontal step indicators, see
 * `Captions.jsx`.
 *
 * API: pass an `items` array describing the steps and the component
 * derives per-step state from `currentIndex`. Each entry can be a string
 * (rendered as the step label) or an object `{ label, status? }` to override
 * the auto-derived status (e.g. mark a future step as "skipped").
 *
 * Status rules (when not overridden):
 *   index < currentIndex   → 'completed'  (grey text + green filled check)
 *   index === currentIndex → 'active'     (green semibold + green filled check)
 *   index > currentIndex   → 'pending'    (grey medium + grey check)
 */

// 20-check-circle-fill — pulled directly from Figma node 41:1451.
// Single path; fill colour is `currentColor` so the parent controls
// pending grey vs active/completed brand-green.
const CheckCircle = ({ className }) => (
  <svg viewBox="0 0 14.4 14.4" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.2 0C3.22355 0 0 3.22355 0 7.2C0 11.1764 3.22355 14.4 7.2 14.4C11.1764 14.4 14.4 11.1764 14.4 7.2C14.4 3.22355 11.1764 0 7.2 0ZM10.2748 5.36687C10.4774 5.10466 10.4291 4.72784 10.1669 4.52523C9.90466 4.32261 9.52785 4.37092 9.32523 4.63313L6.36492 8.46411L5.04598 6.99862C4.8243 6.75231 4.44493 6.73235 4.19862 6.95402C3.95231 7.1757 3.93235 7.55507 4.15402 7.80138L5.95402 9.80138C6.07306 9.93364 6.24466 10.0062 6.42247 9.99958C6.60029 9.99291 6.76597 9.90767 6.87477 9.76687L10.2748 5.36687Z"
      fill="currentColor"
    />
  </svg>
);

const STATUS_CLASSES = {
  pending: {
    icon: 'text-neutral-dark', // #babab7
    label: 'text-neutral-dark font-medium',
  },
  active: {
    icon: 'text-brand-green',
    label: 'text-brand-green font-semibold',
  },
  completed: {
    icon: 'text-brand-green',
    label: 'text-neutral-dark font-medium',
  },
};

const normaliseItem = (item) => (typeof item === 'string' ? { label: item } : item);

const Breadcrumbs = ({ items = [], currentIndex = 0, className, ...rest }) => {
  log('render', { itemCount: items.length, currentIndex });

  return (
    <ol className={classNames('flex flex-col gap-3', className)} role="list" {...rest}>
      {items.map((raw, index) => {
        const item = normaliseItem(raw);
        const status =
          item.status ||
          (index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'pending');
        const classes = STATUS_CLASSES[status];
        const isCurrent = status === 'active';

        return (
          <li
            key={item.key || index}
            aria-current={isCurrent ? 'step' : undefined}
            className="flex items-center gap-3 capitalize"
          >
            <span className={classNames('inline-flex shrink-0 size-4', classes.icon)}>
              <CheckCircle className="size-full" />
            </span>
            <span className={classNames('font-sans text-[14px] tracking-[0.14px]', classes.label)}>
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumbs;
