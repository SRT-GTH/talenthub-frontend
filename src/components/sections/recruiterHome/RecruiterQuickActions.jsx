import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { CheckCircleIcon, WorkflowSquareIcon } from './recruiterHomeIcons.jsx';
import { SearchIcon, BriefcaseIcon } from '../../shared/assets.jsx';
import { QUICK_ACTIONS } from './recruiterHomeData.js';

const log = debug('RecruiterQuickActions');

/*
 * RecruiterQuickActions — the four tinted shortcut cards under the hero.
 * Figma 7249:73932 (strip) / :73933 :73941 :73949 :73958 (cards).
 *
 * Each card: h88, r16, 1px #fefefe border, Elevation/Card shadow, pad 16/14,
 * gap 12, a 44x44 white r12 icon tile and a 2px-gap text column. The tint and
 * icon colour vary per card and live in recruiterHomeData.js.
 *
 * SearchIcon and BriefcaseIcon are reused from shared/assets.jsx (both already
 * take `className` and stroke in currentColor); the other two glyphs have no
 * shared equivalent and are hand-crafted in recruiterHomeIcons.jsx.
 */
const ICONS = {
  'complete-profile': CheckCircleIcon,
  'search-talents': SearchIcon,
  'review-pipeline': WorkflowSquareIcon,
  'post-a-job': BriefcaseIcon,
};

const RecruiterQuickActions = ({ onSelect, className }) => {
  log('render', { cardCount: QUICK_ACTIONS.length });

  return (
    <div className={classNames('flex w-full items-stretch gap-[16px]', className)}>
      {QUICK_ACTIONS.map((action) => {
        const Icon = ICONS[action.id];
        /* A card with a destination is navigation, so it renders as a link;
           one without is still an action surface and stays a button that logs
           its intent (SOP §17 — <a> for navigation, <button> for actions). */
        const Tag = action.to ? Link : 'button';
        const tagProps = action.to ? { to: action.to } : { type: 'button' };
        return (
          <Tag
            key={action.id}
            {...tagProps}
            onClick={() => {
              log('branch', { action: action.id, to: action.to ?? 'none-in-app' });
              onSelect?.(action.id);
            }}
            className={classNames(
              'flex min-w-0 flex-1 items-center gap-[12px] rounded-lg border border-neutral-light px-[16px] py-[14px] text-left shadow-card',
              'transition-all duration-300 ease-in hover:-translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              action.tintClass
            )}
          >
            <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-white">
              <Icon className={classNames('size-[22px]', action.iconClass)} />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span
                className={classNames(
                  'text-[14px] font-semibold leading-5 tracking-[0.1px] text-black/90',
                  action.titleCase && 'capitalize'
                )}
              >
                {action.title}
              </span>
              <span className="text-normal-50 text-neutral-dark-hover">{action.meta}</span>
            </span>
          </Tag>
        );
      })}
    </div>
  );
};

export default RecruiterQuickActions;
