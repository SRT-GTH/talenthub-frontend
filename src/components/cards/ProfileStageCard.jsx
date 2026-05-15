import { classNames } from '../../utils/classNames.js';
import Tag from '../ui/Tag.jsx';
import { STAGE_STATUS } from '../../constants/profileStages.js';
import { debug } from '../../utils/debug.js';

const log = debug('ProfileStageCard');

/*
 * ProfileStageCard — one row in the Profile Engagement stage list.
 * Source: Figma instance 3384:81946 ("Cards" — the 9 repeating rows).
 *
 * Layout (Figma exact):
 *   1173 × 87.89 px container, rounded-xl, white bg with bottom-200 shadow
 *   ├─ left: 40×40 icon block (rounded-md, neutral-50 fill) holding the
 *   │        stage emoji or icon
 *   ├─ middle (gap-3): title row + subtitle + meta chip strip
 *   │     ├─ title row: "Avatar" · "✓ Done" / "Not started"
 *   │     ├─ subtitle: "show up as you" (paragraph/Normal/75)
 *   │     └─ chips: "Avatar set" + "~3 min" (Tag variant=chip)
 *   └─ right: arrow button (33×28 rounded square, neutral border)
 *
 * Status drives the title-row status chip + icon-tile background:
 *   done         → green-light tile, "✓ Done" success chip
 *   in-progress  → green-light tile, "In progress" brand chip
 *   not-started  → neutral tile, muted "Not started" text (no chip)
 *
 * Renders as <button> so it's keyboard-accessible. onClick gets the stage id.
 */

const ArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2.5 6h7" />
    <path d="M6 2.5L9.5 6 6 9.5" />
  </svg>
);

const STATUS_LABEL = {
  [STAGE_STATUS.DONE]: '✓ Done',
  [STAGE_STATUS.IN_PROGRESS]: 'In progress',
  [STAGE_STATUS.NOT_STARTED]: 'Not started',
};

const ProfileStageCard = ({ stage, onSelect, className, ...rest }) => {
  log('render', { id: stage?.id, status: stage?.status });

  const isDone = stage.status === STAGE_STATUS.DONE;
  const isInProgress = stage.status === STAGE_STATUS.IN_PROGRESS;

  const iconTileClasses = isDone || isInProgress ? 'bg-brand-green-light' : 'bg-neutral';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(stage)}
      className={classNames(
        'group w-full flex items-center gap-4 text-left',
        'rounded-xl bg-white border border-border-default shadow-bottom-200',
        'px-4 py-4',
        'transition-[border-color,box-shadow,transform] duration-150 ease-out',
        'hover:border-brand-green-light-active hover:shadow-bottom-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        className
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex shrink-0 items-center justify-center size-10 rounded-md',
          'text-[20px] leading-none',
          iconTileClasses
        )}
      >
        {stage.emoji}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display text-[20px] leading-[1.15] text-content-primary">
            {stage.title}
          </span>
          <span
            className={classNames(
              'font-sans text-[12px] leading-4 tracking-[0.2px]',
              isDone
                ? 'text-success font-semibold'
                : isInProgress
                  ? 'text-brand-green font-semibold'
                  : 'text-neutral-dark-hover font-medium'
            )}
          >
            {STATUS_LABEL[stage.status] || STATUS_LABEL[STAGE_STATUS.NOT_STARTED]}
          </span>
        </div>

        <p className="mt-1 font-sans text-[12px] leading-4 tracking-[0.2px] text-neutral-dark-hover">
          {stage.subtitle}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Tag variant="chip" color={isDone ? 'brand' : 'neutral'}>
            {stage.metaPrimary}
          </Tag>
          <Tag variant="chip" color="neutral">
            {stage.durationLabel}
          </Tag>
        </div>
      </div>

      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex shrink-0 items-center justify-center size-8 rounded-md',
          'border border-border-default bg-white text-neutral-dark-hover',
          'transition-colors group-hover:text-brand-green group-hover:border-brand-green-light-active'
        )}
      >
        <ArrowRight className="size-3" />
      </span>
    </button>
  );
};

export default ProfileStageCard;
