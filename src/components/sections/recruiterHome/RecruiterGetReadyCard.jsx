import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { RowCheckIcon, InlineArrowRightIcon } from './recruiterHomeIcons.jsx';
import { GET_READY, HERO_GRADIENT } from './recruiterHomeData.js';

const log = debug('RecruiterGetReadyCard');

/*
 * RecruiterGetReadyCard — the onboarding checklist card. Figma 7249:73965.
 *
 * Card: white, r16, 1.5px #fefefe border, bottom.100 shadow (NOT the
 * two-layer Elevation/Card used by the hero and quick actions — Figma gives
 * this one the flatter single-layer shadow).
 *
 * Header pad is asymmetric in Figma (L20 R14 T18 B16) and is reproduced as
 * such. The progress track is 1295x8 r4 on #f8f8f4 with a brand-gradient fill
 * at 80/1295 = 6.18%.
 *
 * Row 1 is the completed state: a filled green circle, a STRIKETHROUGH title
 * (Figma styleOverrideTable["1"].textDecoration) and a "Done" label. Rows 2-4
 * are pending: a 1.5px #dfdfdc ring, a dark-green title and a trailing action
 * (a green CTA on row 2, a duration label on rows 3-4).
 */
const RecruiterGetReadyCard = ({ onItemAction, className }) => {
  log('render', {
    itemCount: GET_READY.items.length,
    progressPercent: Number(GET_READY.progressPercent.toFixed(2)),
  });

  return (
    <section
      className={classNames(
        'flex w-full flex-col rounded-lg border-[1.5px] border-neutral-light bg-white shadow-bottom-100',
        className
      )}
    >
      {/* Header — Figma 7249:73966, pad L20 R14 T18 B16, gap 12 */}
      <div className="flex flex-col gap-[12px] pb-[16px] pl-[20px] pr-[14px] pt-[18px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-[3px]">
            <h2
              className={classNames(
                'text-[16px] font-semibold leading-6 tracking-[0.2px] text-brand-green-darker',
                GET_READY.titleCase && 'capitalize'
              )}
            >
              {GET_READY.title}
            </h2>
            {/* whitespace-pre-wrap preserves the deliberate double space Figma
                shows in "job matches  in any order" — HTML collapses it otherwise. */}
            <p className="whitespace-pre-wrap text-normal-50 text-neutral-dark">
              {GET_READY.subtitle}
            </p>
          </div>
          {/* Figma 7249:73971 — #ebf1ec at 50% FILL opacity (fill-level, not node-level) */}
          <span className="shrink-0 rounded-[8px] bg-brand-green-light/50 px-[10px] py-[6px] text-[12px] font-medium leading-4 tracking-[0.2px] text-brand-green">
            {GET_READY.badge}
          </span>
        </div>

        <div className="h-[8px] w-full overflow-hidden rounded-[4px] border border-neutral-light bg-neutral">
          <div
            className="h-full rounded-[4px]"
            style={{ width: `${GET_READY.progressPercent}%`, backgroundImage: HERO_GRADIENT }}
          />
        </div>
      </div>

      {/* Checklist — Figma 7249:73975, pad L20 R20 T2 B10 */}
      <ul className="flex flex-col px-[20px] pb-[10px] pt-[2px]">
        {GET_READY.items.map((item) => (
          <li
            key={item.id}
            className={classNames(
              'flex items-center gap-[12px] py-[8px]',
              item.tall && 'min-h-[78px]'
            )}
          >
            {item.done ? (
              <span className="grid size-[24px] shrink-0 place-items-center rounded-full bg-brand-green">
                <RowCheckIcon className="size-[13px] text-white" />
              </span>
            ) : (
              <span className="size-[24px] shrink-0 rounded-full border-[1.5px] border-neutral-hover" />
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span
                className={classNames(
                  item.done
                    ? 'text-normal-75 text-neutral-dark line-through'
                    : 'text-[14px] font-semibold leading-6 tracking-[0.1px] text-brand-green-dark',
                  item.titleCase && 'capitalize'
                )}
              >
                {item.title}
              </span>
              {item.description && (
                <span className="text-normal-50 text-neutral-active">{item.description}</span>
              )}
            </div>

            {item.action ? (
              <Link
                to={item.actionTo}
                onClick={() => {
                  log('branch', { itemAction: item.id, to: item.actionTo });
                  onItemAction?.(item.id);
                }}
                /* Figma shadow is a solid 3px shelf (#2a5730, 0 blur) — the
                   theme's --shadow-button-shelf is 0 4px 8px blurred, a
                   different effect, so this is an arbitrary value. */
                className="inline-flex shrink-0 items-center gap-[6px] rounded-[9px] bg-brand-green px-[14px] py-[8px] shadow-[0_3px_0_0_var(--color-brand-green-dark)] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <span className="text-[14px] font-semibold leading-6 tracking-[0.2px] text-white">
                  {item.action}
                </span>
                <InlineArrowRightIcon className="size-[13px] text-white" />
              </Link>
            ) : (
              item.trailingLabel && (
                <span
                  className={classNames(
                    'shrink-0 text-[12px] leading-5 tracking-[0.2px]',
                    item.done
                      ? 'font-medium text-brand-green'
                      : 'font-normal leading-[18px] text-[#bfbfbf]'
                  )}
                >
                  {item.trailingLabel}
                </span>
              )
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecruiterGetReadyCard;
