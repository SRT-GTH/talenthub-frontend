import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { SEARCH_PANEL as S } from './recruiterDashboardData.js';

/*
 * SearchPanel — the top-bar global search for a recruiter (Figma D13 10078:62351 focused with recent searches and quick filters, D14 10078:63760 results for "Akua",
 * D15 10083:66139 no results for "Zxqy"). A 760px card under the search field: category filters with counts, then RECENT SEARCHES + QUICK FILTERS (empty query) or an
 * "Ask Hiring Assistant" row + PEOPLE / APPLICATIONS / JOBS groups (query), a key legend and the scope note.
 * Props: query, onClose. The first recent / person row is highlighted as the keyboard cursor ("Enter to open").
 * ⚠️ ASSUMPTION: the results are mock data for "Akua" (any other text shows the D15 "No results" card); nothing opens (no destination is drawn).
 */
const KEY_CLASS =
  'inline-flex h-[32px] items-center rounded-[8px] border border-solid border-[#e5e7eb] bg-white px-[10px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] shadow-[0_1px_2px_rgba(0,0,0,0.06)]';

const GroupLabel = ({ children }) => (
  <div className="px-[12px] pt-[14px] pb-[6px] font-sans text-[12px] leading-[16px] font-bold tracking-[0.6px] text-[#595959]">
    {children}
  </div>
);

const Row = ({ icon, avatar, title, sub, hint, active, accent, trailing, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border-0 px-[12px] py-[8px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
      active ? 'bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#f8f8f4]'
    )}
  >
    <img
      src={icon ?? avatar}
      alt=""
      aria-hidden="true"
      className={classNames('size-[34px] shrink-0', avatar && 'rounded-full object-cover')}
    />
    <span className="flex min-w-0 flex-1 flex-col">
      <span
        className={classNames(
          'font-sans text-[14px] leading-[20px] font-semibold',
          accent ? 'text-[#387440]' : 'text-[#111]'
        )}
      >
        {title}
      </span>
      <span className="font-sans text-[12px] leading-[16px] text-[#595959]">{sub}</span>
    </span>
    {hint ? (
      <span className="shrink-0 font-sans text-[12px] leading-[16px] font-medium text-[#595959]">
        {hint}
      </span>
    ) : null}
    {trailing}
  </button>
);

const SearchPanel = ({ query = '', onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    const onDown = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !event.target.closest?.('input[type=search]')
      ) {
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  const hasQuery = query.trim().length > 0;
  const results = hasQuery && /^akua/i.test(query.trim());
  const none = hasQuery && !results;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Search"
      className="absolute top-[calc(100%+6px)] left-0 z-50 flex w-[760px] max-w-[calc(100vw-32px)] flex-col rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[16px] shadow-[0_16px_40px_-8px_rgba(15,15,10,0.2),0_2px_6px_rgba(15,15,10,0.06)]"
    >
      {none ? (
        <div className="flex flex-col items-center gap-[8px] px-[24px] py-[40px] text-center">
          <img
            src={dashIcons.searchNoResultsIllustration}
            alt=""
            aria-hidden="true"
            className="size-[56px]"
          />
          <h3 className="m-0 font-sans text-[16px] leading-[28px] font-semibold text-[#111]">
            {S.none.title(query.trim())}
          </h3>
          <p className="m-0 max-w-[420px] font-sans text-[14px] leading-[24px] text-[#575755]">
            {S.none.body}
          </p>
        </div>
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Result type"
            className="flex flex-wrap gap-[8px] pb-[4px]"
          >
            {S.categories.map((cat, index) => (
              <Chip
                key={cat.id}
                as="button"
                type="button"
                role="tab"
                aria-selected={index === 0}
                tone={index === 0 ? 'mint' : 'outline-success'}
                className={classNames(
                  'h-[32px] px-[14px] text-[13px] font-semibold',
                  index === 0 ? '!bg-[#387440] !text-white' : '!text-[#387440]'
                )}
              >
                {cat.label}
                {results ? <span className="ml-[4px]">{cat.count}</span> : null}
              </Chip>
            ))}
          </div>

          {results ? (
            <>
              <Row
                icon={dashIcons.searchAssistantTile}
                title={S.assistant.title('Akua Mensah')}
                sub={S.assistant.sub}
                active
                trailing={<span className={KEY_CLASS}>{S.assistant.key}</span>}
              />
              <GroupLabel>{S.peopleLabel}</GroupLabel>
              {S.people.map((p, i) => (
                <Row
                  key={p.id}
                  avatar={dashIcons[p.avatar]}
                  title={p.name}
                  sub={p.sub}
                  hint={i === 0 ? p.hint : undefined}
                  active={i === 0}
                />
              ))}
              <GroupLabel>{S.applicationsLabel}</GroupLabel>
              <Row
                icon={dashIcons.searchResultApplicationTile}
                title={S.application.title}
                sub={S.application.sub}
                trailing={<Chip tone="mint">{S.application.status}</Chip>}
              />
              <GroupLabel>{S.jobsLabel}</GroupLabel>
              <Row
                icon={dashIcons.searchResultJobsEmptyTile}
                title={S.noJobs.title}
                sub={S.noJobs.sub(query.trim())}
                accent
              />
            </>
          ) : (
            <>
              <GroupLabel>{S.recentLabel}</GroupLabel>
              {S.recents.map((r, i) => (
                <Row
                  key={r.id}
                  icon={dashIcons[r.icon]}
                  title={r.title}
                  sub={r.sub}
                  hint={r.hint}
                  active={i === 0}
                />
              ))}
              <GroupLabel>{S.quickLabel}</GroupLabel>
              <div className="grid grid-cols-2 gap-x-[8px] max-sm:grid-cols-1">
                {S.quick.map((q) => (
                  <Row key={q.id} icon={dashIcons[q.icon]} title={q.title} sub={q.sub} accent />
                ))}
              </div>
            </>
          )}

          <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[8px] border-t border-solid border-[#e5e8e3] pt-[12px]">
            <span className="flex flex-wrap items-center gap-[8px] font-sans text-[12px] leading-[16px] text-[#595959]">
              {S.keys.map((k) => (
                <span key={k.key} className="flex items-center gap-[6px]">
                  <span className={KEY_CLASS}>{k.key}</span>
                  {k.label}
                </span>
              ))}
            </span>
            {results ? (
              <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
                {S.seeAll}
              </span>
            ) : null}
          </div>
          {results ? (
            <p className="m-0 mt-[10px] flex items-center gap-[8px] font-sans text-[12px] leading-[16px] text-[#575755]">
              {S.scope}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SearchPanel;
