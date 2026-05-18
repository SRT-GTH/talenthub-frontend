import { classNames } from '../../../utils/classNames.js';
import Modal from '../../ui/Modal.jsx';
import giftImg from '../../../assets/engagement/reward-gift.png';

/*
 * MilestoneDetailsModal — celebratory details modal that pops over the
 * MilestoneUnlockPage when the user claims a milestone reward.
 * Source: Figma frame ("Profile Discoverable" details modal).
 *
 * Layout:
 *   ├─ close X (top-right, inherited from Modal)
 *   ├─ small gift / trophy image, centered
 *   ├─ headline ("Profile Discoverable") with italic green accent
 *   ├─ description paragraph
 *   ├─ feature rows — each row has an icon (check / arrow / plus),
 *   │  a title (optionally with a small inline badge like "One extra
 *   │  step"), and a one-line description. Rows are separated by a
 *   │  thin divider.
 *   └─ bottom CTA — a full-width green pill ("Keep going, Skills next →")
 *
 * Generic over content via props so milestones 2 and 3 reuse it.
 */

const STATUS_ICONS = {
  // Filled green check circle — for completed features.
  check: ({ className }) => (
    <span
      aria-hidden="true"
      className={classNames(
        'inline-flex items-center justify-center rounded-full',
        'bg-brand-green-light text-brand-green',
        className
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M3 8.5l3 3 7-7" />
      </svg>
    </span>
  ),
  // Filled dark arrow circle — for newly-enabled features.
  arrow: ({ className }) => (
    <span
      aria-hidden="true"
      className={classNames(
        'inline-flex items-center justify-center rounded-full',
        'bg-content-primary text-white',
        className
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5"
      >
        <path d="M3 8h10" />
        <path d="M9 4l4 4-4 4" />
      </svg>
    </span>
  ),
  // Outlined yellow plus circle — for optional / extra-step features.
  plus: ({ className }) => (
    <span
      aria-hidden="true"
      className={classNames(
        'inline-flex items-center justify-center rounded-full',
        'border-2 border-accent text-accent-dark bg-white',
        className
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5"
      >
        <path d="M8 3v10" />
        <path d="M3 8h10" />
      </svg>
    </span>
  ),
};

const ArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 10h12" />
    <path d="M10 4l6 6-6 6" />
  </svg>
);

const FeatureRow = ({ icon, title, description, badge }) => {
  const Icon = STATUS_ICONS[icon] || STATUS_ICONS.check;
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="size-9 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-sans font-semibold text-[14px] leading-5 tracking-[0.1px] text-content-primary">
            {title}
          </span>
          {badge && (
            <span
              className={classNames(
                'inline-flex items-center rounded-md px-2 py-0.5',
                'bg-neutral text-neutral-darker border border-neutral-hover',
                'font-sans font-medium text-[10px] leading-4 tracking-[0.2px]'
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-neutral-darker">
          {description}
        </p>
      </div>
    </div>
  );
};

const MilestoneDetailsModal = ({
  isOpen,
  onClose,
  iconSrc = giftImg,
  headlinePrefix,
  headlineAccent,
  description,
  items = [],
  ctaLabel,
  onCta,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="md"
    ariaLabel={`${headlinePrefix} ${headlineAccent}`}
  >
    <div className="px-[clamp(20px,3vw,32px)] py-[clamp(24px,3vw,32px)]">
      {/* Hero image */}
      <div className="flex justify-center">
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          className="size-[clamp(48px,5vw,64px)] object-contain"
        />
      </div>

      {/* Headline + description */}
      <h2 className="mt-3 text-center font-display text-[clamp(26px,2.6vw,32px)] leading-[1.1] tracking-[-0.3px] text-content-primary">
        {headlinePrefix} <span className="italic text-brand-green">{headlineAccent}</span>
      </h2>
      <p className="mt-2 mx-auto max-w-[44ch] text-center font-sans text-[13px] leading-[20px] tracking-[0.2px] text-neutral-darker">
        {description}
      </p>

      {/* Feature rows */}
      <div className="mt-5 divide-y divide-border-default">
        {items.map((item) => (
          <FeatureRow
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            badge={item.badge}
          />
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onCta}
        className={classNames(
          'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-pill',
          'bg-brand-green text-white px-5 py-3.5',
          'font-sans font-semibold text-[15px] leading-5 tracking-[0.1px]',
          'shadow-bottom-300 hover:bg-brand-green-hover',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-dark'
        )}
      >
        {ctaLabel}
        <ArrowRight className="size-4" />
      </button>
    </div>
  </Modal>
);

export default MilestoneDetailsModal;
