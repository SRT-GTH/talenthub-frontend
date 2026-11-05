import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import FilterSelect from '../../ui/FilterSelect.jsx';
import InlineState from '../../ui/InlineState.jsx';
import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { JOBS, JOBS_STATES, JOBS_WIDGET, ROW_MENU, SORT_MENU } from './recruiterDashboardData.js';

/*
 * ActiveJobsWidget — "Active job postings" (Figma 10049:58724, states D20–D28 in section 03). A 6-column table (JOB, POSTED, APPLICANTS, NEW · 7D, IN PIPELINE, STATUS) + row actions.
 * Below lg the table header goes away and every row becomes a card with labelled values (no horizontal scroll).
 *
 * Props: org (name for the subtitle), jobs, readOnly (pending affiliation: "Read-only" pill),
 *   sort { value, onChange, open, onOpenChange }, menuJobId + onMenu(jobId | '') (the row-actions menu, one open at a time), onRowAction(action, jobId),
 *   pausedIds (jobs shown as "Paused"), jobsState ('' | 'empty' | 'suspended' | 'error') replaces the table with an inline state, onStateAction(kind).
 */
const COLUMNS = 'lg:grid-cols-[minmax(0,1fr)_84px_84px_70px_84px_84px_36px]';

const sortOptions = SORT_MENU.options.map((option) => ({
  ...option,
  icon: dashIcons[option.icon],
}));

const RowMenu = ({ job, onAction, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={`Actions for ${job.title}`}
      className="absolute top-[calc(100%+6px)] right-0 z-30 flex w-[180px] flex-col rounded-[12px] border border-solid border-[#e5e8e3] bg-white p-[6px] shadow-[0_12px_32px_-8px_rgba(15,15,10,0.18),0_2px_6px_rgba(15,15,10,0.06)]"
    >
      {ROW_MENU.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          onClick={() => onAction(item.id, job.id)}
          className={classNames(
            'flex w-full cursor-pointer items-center gap-[12px] rounded-[8px] border-0 bg-transparent px-[12px] py-[9px] text-left hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
            item.danger && 'mt-[2px] border-t border-solid border-[#e5e8e3]'
          )}
        >
          <img
            src={dashIcons[item.icon]}
            alt=""
            aria-hidden="true"
            className="size-[18px] shrink-0"
          />
          <span className="flex flex-col">
            <span
              className={classNames(
                'font-sans text-[14px] leading-[24px]',
                item.danger ? 'text-[#c0392b]' : 'text-[#111]'
              )}
            >
              {item.label}
            </span>
            {item.note ? (
              <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                {item.note}
              </span>
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
};

const StateBody = ({ kind, org, onAction }) => {
  const copy = JOBS_STATES[kind];
  const message = typeof copy.body === 'function' ? copy.body(org) : copy.body;
  const primary = kind === 'empty';
  return (
    <InlineState
      tone={copy.tone}
      icon={dashIcons[copy.icon]}
      title={copy.title}
      actions={
        <button
          type="button"
          onClick={() => onAction?.(kind)}
          className={classNames(
            'inline-flex cursor-pointer items-center gap-[8px] whitespace-nowrap max-sm:gap-[6px] rounded-[10px] font-sans leading-[24px] font-medium tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
            primary
              ? 'min-h-[44px] border-0 bg-[#387440] px-[18px] text-[14px] text-white shadow-[0_3px_0_#2a5730]'
              : 'h-[36px] border border-solid border-[#1c2a21]/30 bg-white px-[14px] text-[14px] text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)]'
          )}
        >
          <img src={dashIcons[copy.actionIcon]} alt="" aria-hidden="true" className="size-[16px]" />
          {copy.action}
        </button>
      }
    >
      {message}
    </InlineState>
  );
};

const ActiveJobsWidget = ({
  org,
  jobs = JOBS,
  readOnly = false,
  sort,
  menuJobId = '',
  onMenu,
  onRowAction,
  pausedIds = [],
  jobsState = '',
  onStateAction,
  onViewAll,
}) => {
  const inState = Boolean(jobsState);
  return (
    <WidgetCard
      id="dash-jobs"
      icon={dashIcons.tileActiveJobs}
      title={JOBS_WIDGET.title}
      titleChip={
        inState ? null : (
          <Chip tone="mint" className="py-[2px]">
            {JOBS_WIDGET.chip}
          </Chip>
        )
      }
      subtitle={JOBS_WIDGET.subtitle(org)}
      controls={
        inState ? null : (
          <>
            <FilterSelect
              label={`Sort: ${sortOptions.find((o) => o.value === sort.value)?.label ?? 'Urgent first'}`}
              icon={dashIcons.sortLines}
              options={sortOptions}
              value={sort.value}
              onChange={sort.onChange}
              open={sort.open}
              onOpenChange={sort.onOpenChange}
              menuLabel={SORT_MENU.label}
              width={260}
              ariaLabel="Sort job postings"
            />
            <Link
              to="/recruiter/job-postings"
              onClick={onViewAll}
              className="inline-flex h-[32px] items-center gap-[3px] rounded-[10px] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              {JOBS_WIDGET.viewAll}
              <img
                src={dashIcons.arrowRightLink}
                alt=""
                aria-hidden="true"
                className="size-[15px]"
              />
            </Link>
            {readOnly ? (
              <Chip tone="amber" className="text-[12px]">
                Read-only
              </Chip>
            ) : null}
          </>
        )
      }
    >
      {inState ? (
        <StateBody kind={jobsState} org={org} onAction={onStateAction} />
      ) : (
        <div role="table" aria-label={JOBS_WIDGET.title} className="flex flex-col">
          <div
            role="row"
            className={`hidden items-center gap-[12px] rounded-[10px] bg-[#fffefc] px-[12px] py-[8px] lg:grid ${COLUMNS}`}
          >
            {JOBS_WIDGET.columns.map((column) => (
              <span
                key={column}
                role="columnheader"
                className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]"
              >
                {column}
              </span>
            ))}
            <span role="columnheader" aria-label="Actions" />
          </div>

          {jobs.map((job, index) => {
            const paused = pausedIds.includes(job.id);
            return (
              <div
                key={job.id}
                role="row"
                className={`grid grid-cols-2 items-center gap-x-[12px] gap-y-[10px] px-[12px] py-[14px] max-sm:grid-cols-1 lg:gap-y-0 ${COLUMNS} ${
                  index < jobs.length - 1 ? 'border-b border-solid border-[#e5e8e3]' : ''
                }`}
              >
                <div
                  role="cell"
                  className="col-span-2 flex min-w-0 flex-col gap-[6px] max-sm:col-span-1 lg:col-span-1"
                >
                  <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
                    {job.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
                    <span className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#575755]">
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-[4px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                      <img
                        src={dashIcons.mapPinJob}
                        alt=""
                        aria-hidden="true"
                        className="size-[12px]"
                      />
                      {job.place}
                    </span>
                    {job.urgent && !paused ? (
                      <Chip tone="danger" icon={dashIcons.clockUrgent}>
                        {job.urgent}
                      </Chip>
                    ) : null}
                  </span>
                </div>

                <div
                  role="cell"
                  className="font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]"
                >
                  <span className="mr-[6px] text-[12px] text-[#575755] lg:hidden">Posted</span>
                  {job.posted}
                </div>
                <div
                  role="cell"
                  className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]"
                >
                  <span className="mr-[6px] text-[12px] font-normal text-[#575755] lg:hidden">
                    Applicants
                  </span>
                  {job.applicants}
                </div>
                <div role="cell">
                  <span className="mr-[6px] font-sans text-[12px] text-[#575755] lg:hidden">
                    New · 7d
                  </span>
                  <Chip tone="mint">{job.fresh}</Chip>
                </div>
                <div role="cell" className="flex items-center gap-[8px]">
                  <span className="mr-[2px] font-sans text-[12px] text-[#575755] lg:hidden">
                    In pipeline
                  </span>
                  <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
                    {job.pipeline}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-[5px] w-[40px] shrink-0 overflow-hidden rounded-[5px] bg-[#fefefe]"
                  >
                    <span
                      className="block h-full rounded-[5px] bg-[#387440]"
                      style={{ width: `${job.pipelineFill}px` }}
                    />
                  </span>
                </div>
                <div role="cell">
                  {paused ? (
                    <Chip tone="amber" icon={dashIcons.statusPausedChip}>
                      Paused
                    </Chip>
                  ) : (
                    <Chip tone="success" icon={dashIcons.checkActive}>
                      {job.status}
                    </Chip>
                  )}
                </div>
                <div
                  role="cell"
                  className="relative max-lg:col-span-2 max-lg:justify-self-end max-sm:col-span-1"
                >
                  <button
                    type="button"
                    aria-label={`More actions for ${job.title}`}
                    aria-haspopup="menu"
                    aria-expanded={menuJobId === job.id}
                    disabled={readOnly}
                    onClick={() => onMenu?.(menuJobId === job.id ? '' : job.id)}
                    className="flex h-[32px] w-[36px] cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <img
                      src={dashIcons.moreRowActions}
                      alt=""
                      aria-hidden="true"
                      className="size-[18px]"
                    />
                  </button>
                  {menuJobId === job.id ? (
                    <RowMenu
                      job={job}
                      onAction={(action) => onRowAction?.(action, job.id)}
                      onClose={() => onMenu?.('')}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
};

export default ActiveJobsWidget;
