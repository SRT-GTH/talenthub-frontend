import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterJobTabs');

/*
 * RecruiterJobTabs — the "Your Postings / Templates / Screening Criteria"
 * switcher that sits under the page heading on the recruiter job screens.
 * Figma 7249:75085 (Job Templates) and the identical instances on Job
 * Postings and Job Screening.
 *
 * This is an UNDERLINE tab bar, not an outlined pill group. Figma's
 * `individualStrokeWeights` make that unambiguous:
 *   group  7249:75085 -> { top: 0, right: 0, bottom: 1, left: 0 }, #e6e2d6
 *   active 7249:75090 -> { top: 0, right: 0, bottom: 1.3, left: 0 }, #387440
 *   others 7249:75086 / :75094 -> a bottom weight but an EMPTY `strokes`
 *                                 array, so nothing paints at all
 * The flat `strokeWeight` field reads 1.0 / 1.2157 on every one of them, which
 * is what made this look like a full box on the first pass — and is also why
 * there is no cornerRadius anywhere on the group or the tabs.
 *
 * Geometry: 389x40 group, 12px gap; each tab is 40 tall with 14/6 padding and
 * 15/500 type at 0.243 letter-spacing (#737373 inactive, #387440 active).
 * Each tab is a real destination, so these render as links and the active one
 * is derived from the route rather than hardcoded.
 */
const JOB_TABS = [
  { id: 'postings', label: 'Your Postings', to: '/recruiter/job-postings' },
  { id: 'templates', label: 'Templates', to: '/recruiter/job-templates' },
  { id: 'screening', label: 'Screening Criteria', to: '/recruiter/job-screening' },
];

const RecruiterJobTabs = ({ className }) => {
  const { pathname } = useLocation();
  const rowRef = useRef(null);
  log('render', { pathname });

  // Phones: the three tabs can be wider than the screen, so the row scrolls
  // sideways — start with the active tab centred rather than hidden off-screen.
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector('[aria-current="page"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    log('branch: scrolling active tab into view', { pathname });
    row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);

  return (
    <div
      ref={rowRef}
      className={classNames(
        'flex w-fit items-center gap-[12px] border-b border-border-card',
        // Phones: scroll sideways inside the page gutters instead of overflowing.
        'no-scrollbar max-w-full max-sm:w-full max-sm:gap-[4px] max-sm:overflow-x-auto',
        className
      )}
    >
      {JOB_TABS.map((tab) => {
        const isActive = pathname === tab.to;
        return (
          <Link
            key={tab.id}
            to={tab.to}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => log('branch', { tab: tab.id, to: tab.to })}
            className={classNames(
              'flex h-[40px] max-lg:h-[36px] max-lg:text-[14px] shrink-0 items-center justify-center whitespace-nowrap px-[14px] py-[6px]',
              'font-sans text-[15px] font-medium tracking-[0.24px] transition-colors duration-300 ease-in',
              // -1px drops each tab's own underline onto the group's rule so the
              // active one overdraws it rather than stacking above it.
              '-mb-px border-b-[1.3px] max-sm:mb-0',
              isActive
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-content-helper hover:text-brand-green'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default RecruiterJobTabs;
