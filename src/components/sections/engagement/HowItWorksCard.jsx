import { classNames } from '../../../utils/classNames.js';

/*
 * HowItWorksCard — explainer checklist card (right rail).
 * Source: Figma frame 3384:82026 ("Background+Border+Shadow").
 *
 *   ├─ Heading 4 → "💡 How this works"
 *   └─ 4-item checklist with green ✓ glyphs
 *
 * Pure presentational; items live in `ENGAGEMENT_HOW_IT_WORKS` so a future
 * CMS swap is a one-file change.
 */

const ENGAGEMENT_HOW_IT_WORKS = [
  'All 9 stages always visible — nothing locked',
  'Pick any order that fits your flow',
  'Auto-saved after every keystroke',
  'Avatar alone is enough to be searchable',
];

const HowItWorksCard = ({ items = ENGAGEMENT_HOW_IT_WORKS, className }) => (
  <aside
    className={classNames(
      'rounded-2xl bg-white border border-border-default shadow-bottom-200',
      'p-4',
      className
    )}
  >
    <p className="font-sans font-semibold text-[12px] leading-4 tracking-[0.2px] uppercase text-neutral-dark-hover">
      💡 How this works
    </p>
    <ul className="mt-3 flex flex-col gap-2" role="list">
      {items.map((text) => (
        <li
          key={text}
          className="flex items-start gap-2 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-content-primary"
        >
          <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-brand-green font-semibold">
            ✓
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  </aside>
);

export default HowItWorksCard;
