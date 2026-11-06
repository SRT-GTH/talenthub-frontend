import { useMemo, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ApplyingToArrowheadIcon } from './jobScreeningIcons.jsx';
import { flowIcons } from './screeningFlowIcons.js';
import {
  AVATAR_TONES,
  CLOSE_APPLICANTS,
  DONT_APPLICANTS,
  MEET_APPLICANTS,
  NONE_STATE,
  RESULTS_TEXT,
  SELECTION_FOOTER,
  WAITING_STATE,
} from './screeningFlowData.js';

const log = debug('ScreeningResults');

/*
 * ScreeningResults — "Screening results" (Figma JS-05 10117:65714 meet-all, JS-06 10117:66188 close matches, JS-08 10117:67598 no one meets, JS-09 10117:67878 no applicants yet).
 * Breadcrumb + title + the two header actions, four stat cards, the three tab pills with the search box and sort, then the applicant table — or, when nobody qualifies / nobody applied, the centred empty card.
 * Props: job ({ title, criteriaName, … }), counts ({ screened, meet, close, dont }), tab ('meet' | 'close' | 'dont'), mode ('list' | 'none' | 'waiting'), query, onTab, onQuery, onBack, onAdjust, onMove,
 * onApplySuggestion(apply), onReviewClose, onInvite. Row selection is local state (⚠️ ASSUMPTION: not part of the URL; the Meet-all tab opens with everyone selected, as drawn).
 */
const Box = ({ checked, label, onChange }) => (
  <label className="flex cursor-pointer items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[18px] items-center justify-center rounded-[5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
        checked ? 'bg-[#387440]' : 'border border-solid border-[#dbded9] bg-white'
      )}
    >
      {checked ? <img src={flowIcons.checkboxTickWhite} alt="" className="size-[12px]" /> : null}
    </span>
  </label>
);

const Avatar = ({ initials, tone }) => (
  <span
    aria-hidden="true"
    className="flex size-[40px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px]"
    style={{ backgroundColor: AVATAR_TONES[tone].bg, color: AVATAR_TONES[tone].fg }}
  >
    {initials}
  </span>
);

const GRIDS = {
  meet: 'lg:grid-cols-[minmax(28px,128px)_minmax(0,420px)_minmax(64px,100px)_minmax(100px,140px)_minmax(80px,120px)_minmax(150px,200px)]',
  close:
    'lg:grid-cols-[minmax(28px,128px)_minmax(0,420px)_minmax(64px,100px)_minmax(0,310px)_minmax(250px,250px)]',
};
GRIDS.dont = GRIDS.close;

const StatCard = ({ stat, value, tone }) => (
  <div className="flex flex-col gap-[6px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.04)]">
    <div className="flex flex-col gap-[4px]">
      <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
        {stat.label}
      </span>
      <span
        className="font-['Bricolage_Grotesque',sans-serif] text-[32px] leading-[38px] font-semibold tracking-[-0.64px]"
        style={{ color: tone }}
      >
        {value}
      </span>
      <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
        {stat.note}
      </span>
    </div>
  </div>
);

const STAT_TONES = { screened: '#111111', meet: '#2a5730', close: '#463409', dont: '#575755' };

const ViewProfile = () => (
  <a
    href="#view-profile"
    onClick={(event) => {
      event.preventDefault();
      log('branch', { action: 'view-profile', wired: false });
    }}
    className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] no-underline hover:underline"
  >
    {RESULTS_TEXT.viewProfile}
  </a>
);

const ScreeningResults = ({
  job,
  counts,
  tab,
  mode,
  query,
  onTab,
  onQuery,
  onBack,
  onAdjust,
  onMove,
  onApplySuggestion,
  onReviewClose,
  onInvite,
}) => {
  const [selected, setSelected] = useState(() => new Set(MEET_APPLICANTS.map((row) => row.id)));
  const rows = useMemo(() => {
    const source = { meet: MEET_APPLICANTS, close: CLOSE_APPLICANTS, dont: DONT_APPLICANTS }[tab];
    const needle = query.trim().toLowerCase();
    return needle ? source.filter((row) => row.name.toLowerCase().includes(needle)) : source;
  }, [tab, query]);
  const total = { meet: counts.meet, close: counts.close, dont: counts.dont }[tab];
  const columns = RESULTS_TEXT.columns[tab];
  const allSelected =
    tab === 'meet' && rows.length > 0 && rows.every((row) => selected.has(row.id));
  const waiting = mode === 'waiting';
  const subtitle = waiting
    ? WAITING_STATE.subtitle
    : `${job.title} · ${job.criteriaName} · run just now`;
  log('render', { tab, mode, rows: rows.length, counts });

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex w-full flex-col gap-[24px] py-[32px] pr-[clamp(16px,3.24vw,56px)] pl-[clamp(16px,2.3vw,40px)] max-md:gap-[16px] max-md:py-[16px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img src={flowIcons.backUndo} alt="" aria-hidden="true" className="size-[16px]" />
          {waiting ? RESULTS_TEXT.backToPostings : RESULTS_TEXT.back}
        </button>
        <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {`${RESULTS_TEXT.breadcrumb}${job.title}`}
        </span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex min-w-0 flex-col gap-[4px]">
          <h1 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[34px] leading-[41px] font-semibold tracking-[-0.68px] text-[#111] max-md:text-[28px] max-md:leading-[34px]">
            {RESULTS_TEXT.heading.lead}
            <span className="text-[#387440]">{RESULTS_TEXT.heading.accent}</span>
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[28px] tracking-[0.2px] text-[#575755]">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-[12px]">
          <Button variant="tertiary" onClick={onAdjust}>
            {RESULTS_TEXT.adjust}
          </Button>
          {waiting ? (
            <Button variant="primary" size="sm" onClick={onInvite}>
              {WAITING_STATE.invite(job.invite)}
            </Button>
          ) : (
            <Button variant="primary" size="sm" disabled={counts.meet === 0} onClick={onMove}>
              {`Move ${counts.meet} to Pipeline`}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1 lg:grid-cols-4">
        {RESULTS_TEXT.stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            tone={STAT_TONES[stat.id]}
            value={
              {
                screened: counts.screened,
                meet: counts.meet,
                close: counts.close,
                dont: counts.dont,
              }[stat.id]
            }
          />
        ))}
      </div>

      {mode === 'none' ? (
        <section className="flex flex-col items-center gap-[14px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white px-[8px] py-[40px] shadow-[0_1px_2px_rgba(15,15,10,0.04)]">
          <span className="flex size-[64px] items-center justify-center rounded-[10px] bg-[#faf4e8]">
            <img
              src={flowIcons.noMatchesFilterGlyph}
              alt=""
              aria-hidden="true"
              className="size-[32px]"
            />
          </span>
          <h2 className="m-0 px-[12px] text-center font-['Bricolage_Grotesque',sans-serif] text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
            {NONE_STATE.title}
          </h2>
          <p className="m-0 px-[12px] text-center font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
            {NONE_STATE.body}
          </p>
          <ul className="m-0 flex w-full max-w-[620px] list-none flex-col gap-[10px] p-[0_12px]">
            {NONE_STATE.suggestions.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-[12px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[16px]"
              >
                <img
                  src={flowIcons.suggestionSparkles}
                  alt=""
                  aria-hidden="true"
                  className="size-[18px]"
                />
                <span className="min-w-0 flex-1 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
                  {item.label}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#e8f2ed] px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#165d3a]">
                  {item.gain}
                </span>
                <button
                  type="button"
                  onClick={() => onApplySuggestion(item.apply)}
                  className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  {NONE_STATE.apply}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[14px]">
            <Button variant="tertiary" onClick={onAdjust}>
              {NONE_STATE.adjust}
            </Button>
            <Button variant="primary" size="sm" onClick={onReviewClose}>
              {NONE_STATE.review(counts.close)}
            </Button>
          </div>
        </section>
      ) : null}

      {waiting ? (
        <section className="flex flex-col items-center gap-[14px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white px-[8px] py-[48px] shadow-[0_1px_2px_rgba(15,15,10,0.04)]">
          <span className="flex size-[64px] items-center justify-center rounded-[10px] bg-[#ebf1ec]">
            <img
              src={flowIcons.emptyInboxGlyph}
              alt=""
              aria-hidden="true"
              className="size-[32px]"
            />
          </span>
          <h2 className="m-0 px-[12px] text-center font-['Bricolage_Grotesque',sans-serif] text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
            {WAITING_STATE.title}
          </h2>
          <p className="m-0 max-w-[560px] px-[12px] text-center font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
            {WAITING_STATE.body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[14px]">
            <Button variant="tertiary" onClick={onAdjust}>
              {WAITING_STATE.editCriteria}
            </Button>
            <Button variant="primary" size="sm" onClick={onInvite}>
              {WAITING_STATE.invite(job.invite)}
            </Button>
          </div>
        </section>
      ) : null}

      {mode === 'list' ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <div
              role="tablist"
              aria-label="Screening results"
              className="flex flex-wrap items-center gap-[8px]"
            >
              {RESULTS_TEXT.tabs.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onTab(item.id)}
                    className={classNames(
                      'inline-flex cursor-pointer items-center gap-[6px] rounded-full px-[16px] py-[8px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                      active
                        ? 'border-0 bg-[#2a5730] text-white'
                        : 'border border-solid border-[#dbded9] bg-white text-[#111]'
                    )}
                  >
                    {item.label}
                    <span
                      className={classNames(
                        'text-[12px] leading-[20px] font-medium',
                        active ? 'text-[#fffefc]' : 'text-[#2a5730]'
                      )}
                    >
                      {counts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-[12px] max-md:w-full">
              <label className="flex h-[49px] w-[362px] items-center gap-[10px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[24px] shadow-[0_2px_0_0_#e6e6e6] max-md:w-full max-md:flex-1 max-md:px-[16px]">
                <img
                  src={flowIcons.resultsSearchGlass}
                  alt=""
                  aria-hidden="true"
                  className="size-[19px]"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => onQuery(event.target.value)}
                  placeholder={RESULTS_TEXT.search}
                  aria-label={RESULTS_TEXT.search}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14.5px] leading-[24px] text-[#111] outline-none placeholder:text-[#999999]"
                />
              </label>
              <button
                type="button"
                onClick={() => log('branch', { action: 'sort', wired: false })}
                className="flex h-[51px] w-[200px] cursor-pointer items-center justify-between gap-[8px] rounded-[10px] border border-solid border-[#cccccc] bg-white px-[16px] text-left font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] shadow-[0_2.5px_0_0_#bfbfbf] max-md:w-full"
              >
                {RESULTS_TEXT.sort}
                <ApplyingToArrowheadIcon className="size-[20px] shrink-0 text-brand-green" />
              </button>
            </div>
          </div>

          <section
            aria-label="Applicants"
            className="flex flex-col rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[8px] shadow-[0_1px_2px_rgba(15,15,10,0.04)]"
          >
            <div
              className={classNames(
                'hidden items-center gap-[16px] px-[16px] py-[12px] lg:grid',
                GRIDS[tab]
              )}
            >
              <Box
                checked={allSelected}
                label="Select all applicants"
                onChange={() =>
                  setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.id)))
                }
              />
              {columns.map((column) => (
                <span
                  key={column}
                  className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]"
                >
                  {column}
                </span>
              ))}
              <span />
            </div>

            {rows.length === 0 ? (
              <p className="m-0 border-t border-solid border-[#e5e8e3] px-[16px] py-[32px] text-center font-sans text-[14px] leading-[24px] text-[#575755]">
                {`No applicants match “${query}”`}
              </p>
            ) : null}

            {rows.map((row) => {
              const checked = selected.has(row.id);
              return (
                <div
                  key={row.id}
                  className={classNames(
                    'flex flex-wrap items-center gap-x-[16px] gap-y-[8px] border-t border-solid border-[#e5e8e3] px-[16px] py-[12px] lg:grid',
                    GRIDS[tab]
                  )}
                >
                  <Box
                    checked={checked}
                    label={`Select ${row.name}`}
                    onChange={() => toggleRow(row.id)}
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-[12px] lg:flex-none">
                    <Avatar initials={row.initials} tone={row.tone} />
                    <div className="flex min-w-0 flex-col gap-[2px]">
                      <span className="truncate font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#111]">
                        {row.name}
                      </span>
                      <span className="truncate font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                        {row.meta}
                      </span>
                    </div>
                  </div>
                  <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#2a5730]">
                    {row.match}
                  </span>
                  {tab === 'meet' ? (
                    <>
                      <span className="inline-flex w-fit items-center gap-[4px] rounded-full bg-[#e8f2ed] px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#165d3a]">
                        <img
                          src={flowIcons.applicantSkillsCheck}
                          alt=""
                          aria-hidden="true"
                          className="size-[12px]"
                        />
                        {RESULTS_TEXT.skillsMet}
                      </span>
                      <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
                        {row.score}
                      </span>
                    </>
                  ) : (
                    <span
                      className={classNames(
                        'inline-flex w-fit items-center gap-[4px] rounded-full px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px]',
                        tab === 'close'
                          ? 'bg-[#faf4e8] text-[#463409]'
                          : 'bg-[#f9ebea] text-[#902b20]'
                      )}
                    >
                      <img
                        src={flowIcons.closeMatchAlert}
                        alt=""
                        aria-hidden="true"
                        className={classNames(
                          'size-[12px]',
                          tab === 'dont' && 'hue-rotate-[-30deg]'
                        )}
                      />
                      {row.why}
                    </span>
                  )}
                  <div className="ml-auto flex items-center justify-end gap-[8px] lg:ml-0">
                    <ViewProfile />
                    {tab === 'close' ? (
                      <Button
                        variant="tertiary"
                        onClick={() =>
                          log('branch', { action: 'move-anyway', id: row.id, wired: false })
                        }
                      >
                        {RESULTS_TEXT.moveAnyway}
                      </Button>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Message ${row.name}`}
                        className="flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                      >
                        <img
                          src={flowIcons.applicantMessage}
                          alt=""
                          aria-hidden="true"
                          className="size-[18px]"
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-[12px] border-t border-solid border-[#e5e8e3] px-[16px] pt-[14px] pb-[10px]">
              <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                {SELECTION_FOOTER[tab](rows.length, total)}
              </span>
              <button
                type="button"
                onClick={() => log('branch', { action: 'load-more', wired: false })}
                className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                {RESULTS_TEXT.loadMore}
              </button>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default ScreeningResults;
