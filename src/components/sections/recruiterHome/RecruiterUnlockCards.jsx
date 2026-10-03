import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SparkleOutlineIcon,
  ShieldCheckFilledIcon,
  VisibilityIcon,
  LockedBadgeIcon,
} from './recruiterHomeIcons.jsx';
import { COMING_UP } from './recruiterHomeData.js';

const log = debug('RecruiterUnlockCards');

/*
 * RecruiterUnlockCards — the "Unlocks as you build your profile" row.
 * Figma 7249:74005 (block) / :74010 :74029 :74049 (cards).
 *
 * Each card: white, r16, VERTICAL gap 12, pad 16, node opacity 0.92 (a
 * NODE-level opacity in Figma, so it dims the whole card including children —
 * applied as `opacity-[0.92]`, not as a fill alpha).
 *
 * The dashed outline is 1px #387440 with a 7/5 dash array. CSS `border-dashed`
 * gives no control over dash length, so the border is drawn as an inline SVG
 * rect instead — one of the few cases the styling rules allow raw SVG/CSS,
 * because Tailwind genuinely cannot express `stroke-dasharray`. The rect uses
 * a 2px stroke centred on the element edge, half of which the SVG viewport
 * clips, yielding an exact 1px inset dashed line that follows the r16 corners.
 */
const ICONS = {
  sparkle: SparkleOutlineIcon,
  shield: ShieldCheckFilledIcon,
  visibility: VisibilityIcon,
};

const RecruiterUnlockCards = ({ className }) => {
  log('render', { cardCount: COMING_UP.cards.length });

  return (
    <section className={classNames('flex w-full flex-col gap-[12px]', className)}>
      <div className="flex max-w-[415px] flex-col gap-[2px]">
        <h2
          className={classNames(
            'text-[16px] font-semibold leading-7 tracking-[0.1px] text-black',
            COMING_UP.titleCase && 'capitalize'
          )}
        >
          {COMING_UP.title}
        </h2>
        {/* See RecruiterGetReadyCard — same deliberate double space, in
            "turns these on  no pressure". */}
        <p className="whitespace-pre-wrap text-normal-50 text-neutral-dark">{COMING_UP.subtitle}</p>
      </div>

      <div className="flex items-stretch gap-[14px]">
        {COMING_UP.cards.map((card) => {
          const Icon = ICONS[card.icon];
          return (
            <article
              key={card.id}
              className="relative flex min-w-0 flex-1 flex-col gap-[12px] rounded-lg bg-white p-[16px] opacity-[0.92]"
            >
              {/* Exact 7/5 dashed r16 outline — see component note above. */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full text-brand-green"
              >
                <rect
                  width="100%"
                  height="100%"
                  rx="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="7 5"
                />
              </svg>

              <div className="relative flex items-center justify-between gap-2">
                <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] border border-neutral-light bg-white">
                  <Icon
                    className={classNames(
                      'text-brand-green',
                      card.icon === 'shield' ? 'size-[24px]' : 'size-[22px]'
                    )}
                  />
                </span>
                <span className="inline-flex shrink-0 items-center gap-[4px] rounded-pill border border-neutral-light bg-white py-[3px] pl-[8px] pr-[9px]">
                  <LockedBadgeIcon className="size-[11px] text-neutral-dark-active" />
                  <span className="text-[12px] font-medium leading-5 tracking-[0.2px] text-neutral-dark">
                    {COMING_UP.lockedLabel}
                  </span>
                </span>
              </div>

              <div className="relative flex flex-col gap-[8px]">
                <div className="flex flex-col gap-[6px]">
                  <h3
                    className={classNames(
                      'text-[14px] font-semibold leading-5 tracking-[0.2px] text-brand-green-darker',
                      card.titleCase && 'capitalize'
                    )}
                  >
                    {card.title}
                  </h3>
                  {/* #646461 — a one-off description grey with no theme token. */}
                  <p className="text-normal-50 text-[#646461]">{card.description}</p>
                </div>

                <span className="inline-flex w-fit items-center gap-[8px] rounded-pill border border-neutral-light bg-white px-[8px] py-[4px]">
                  <span className="h-[6px] w-[56px] overflow-hidden rounded-full bg-brand-green-light-hover">
                    <span
                      className="block h-full rounded-full bg-brand-green"
                      style={{ width: `${card.percent}%` }}
                    />
                  </span>
                  <span className="text-[12px] font-semibold leading-[18px] tracking-[0.2px] text-brand-green">
                    {card.percentLabel}
                  </span>
                </span>

                <p className="text-normal-50 text-brand-green">{card.unlockLabel}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RecruiterUnlockCards;
