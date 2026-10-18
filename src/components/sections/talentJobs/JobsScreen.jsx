import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  JobArrowIcon,
  JobNoteSparkIcon,
  JobPlusIcon,
  JobSearchIcon,
  JobSparkIcon,
  JobUserIcon,
} from '../../shared/assets.jsx';
import NotifButton from '../notifications/NotifButton.jsx';
import targetArt from '../../../assets/talent-jobs/no-matches-target.svg';
import {
  AppliedRow,
  BookmarkButton,
  BrowseRow,
  JobListRow,
  MatchCard,
  SavedCard,
} from './JobCards.jsx';
import {
  AlertsButton,
  Chip,
  JobSticker,
  JobsHeader,
  JobsTabs,
  MatchToolbar,
  SortSelect,
  ViewToggle,
} from './JobsChrome.jsx';
import {
  APPLIED_COPY,
  APPLIED_ROWS,
  BROWSE_COPY,
  BROWSE_ROWS,
  DISCOVERY,
  EMPTY_COPY,
  JOBS_HEADER,
  JOB_LIST,
  LOADING_COPY,
  MATCH_FOOTER,
  SAVED_COPY,
  SAVED_JOBS,
  SORTS,
} from './talentJobsData.js';

const log = debug('JobsScreen');
const byId = (id) => JOB_LIST.find((j) => j.id === id);

const Banner = ({ dim }) => (
  <div
    className={classNames(
      'flex flex-wrap items-center gap-x-[14px] gap-y-[8px] rounded-[20px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[18px] py-[12px]',
      dim ? 'opacity-40' : null
    )}
  >
    <span className="flex shrink-0">
      {DISCOVERY.faces.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className="-ml-[8px] size-[28px] rounded-full border-2 border-solid border-white object-cover first:ml-0"
        />
      ))}
    </span>
    <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-[1px]">
      <span className="font-sans text-[14px] leading-[normal] font-semibold text-[#1c2a21]">
        {DISCOVERY.title}
      </span>
      <span className="font-sans text-[12px] leading-[16px] text-[#595959]">{DISCOVERY.body}</span>
    </div>
    <JobSticker>{DISCOVERY.sticker}</JobSticker>
  </div>
);

const Skeleton = () => (
  <div className="flex flex-col gap-[16px]" aria-busy="true">
    <span className="inline-flex w-fit items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[6px] font-sans text-[12.5px] leading-[normal] text-[#1c2a21]">
      {LOADING_COPY}
    </span>
    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[300px] flex-col gap-[14px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[18px]"
        >
          <div className="flex items-center gap-[10px]">
            <span className="size-[40px] rounded-[12px] bg-[#ececea]" />
            <span className="flex flex-col gap-[6px]">
              <span className="h-[10px] w-[120px] rounded-full bg-[#ececea]" />
              <span className="h-[8px] w-[80px] rounded-full bg-[#ececea]" />
            </span>
          </div>
          <span className="h-[14px] w-[70%] rounded-full bg-[#ececea]" />
          <span className="flex gap-[6px]">
            <span className="h-[22px] w-[70px] rounded-[8px] bg-[#ececea]" />
            <span className="h-[22px] w-[70px] rounded-[8px] bg-[#ececea]" />
            <span className="h-[22px] w-[70px] rounded-[8px] bg-[#ececea]" />
          </span>
          <span
            className={classNames(
              'h-[64px] rounded-[16px]',
              i === 1 ? 'bg-[#dce8de]' : 'bg-[#f1f1ee]'
            )}
          />
          <span className="mt-auto flex items-center justify-between">
            <span className="h-[8px] w-[60px] rounded-full bg-[#ececea]" />
            <span className="h-[30px] w-[110px] rounded-[10px] bg-[#ececea]" />
          </span>
        </div>
      ))}
    </div>
  </div>
);

const EmptyMatches = ({ jobs }) => (
  <div className="flex flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e1eae2] bg-white px-[24px] py-[32px] text-center">
    <img src={targetArt} alt="" aria-hidden="true" className="size-[150px]" />
    <h2 className="m-0 font-sans text-[31px] leading-[37px] font-semibold text-[#1c2a21] playful:font-heading max-sm:text-[26px]">
      {EMPTY_COPY.title}
    </h2>
    <p className="m-0 max-w-[470px] font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[14px]">
      {EMPTY_COPY.body}
    </p>
    <ul className="m-0 flex w-full max-w-[560px] list-none flex-col overflow-hidden rounded-[16px] border border-solid border-[#e1eae2] p-0">
      {[JobPlusIcon, JobSparkIcon, JobUserIcon].map((Icon, i) => (
        <li
          key={EMPTY_COPY.steps[i].title}
          className="flex items-center gap-[12px] border-0 border-b border-solid border-[#e1eae2] bg-[#f8f8f4] px-[14px] py-[10px] text-left last:border-b-0"
        >
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] border border-solid border-[rgba(28,42,33,0.2)] bg-white">
            <Icon className="size-[15px]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-sans text-[13px] leading-[normal] font-semibold text-[#1c2a21]">
              {EMPTY_COPY.steps[i].title}
            </span>
            <span className="font-sans text-[12px] leading-[normal] text-[#737373]">
              {EMPTY_COPY.steps[i].sub}
            </span>
          </span>
          <JobArrowIcon className="size-[16px] shrink-0" />
        </li>
      ))}
    </ul>
    <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[6px]">
      <NotifButton size="md" tone="primary">
        {EMPTY_COPY.primary}
      </NotifButton>
      <NotifButton size="md" tone="secondary" onClick={() => jobs.update({ tab: 'browse' })}>
        {EMPTY_COPY.secondary}
      </NotifButton>
    </div>
  </div>
);

const ListCard = ({ children }) => (
  <div className="overflow-hidden rounded-[22px] border border-solid border-[#e1eae2] bg-white">
    {children}
  </div>
);

const MatchedTab = ({ jobs, saved, toggle }) => {
  const open = (job) => jobs.update({ job: job.id });
  const dismiss = (job) => jobs.update({ modal: 'not-for-me', dismiss: job.id });
  const shown = JOB_LIST.filter((j) => !jobs.hidden.includes(j.id));
  const pending = jobs.modal === 'not-for-me' ? (jobs.dismiss ?? 'bi-intern') : null;
  const list = jobs.view === 'list';
  return (
    <>
      <Banner />
      {list ? (
        <ListCard>
          {shown.map((j) => (
            <JobListRow
              key={j.id}
              job={j}
              saved={saved.has(j.id)}
              onSave={() => toggle(j.id)}
              onOpen={open}
            />
          ))}
        </ListCard>
      ) : (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {shown.map((j, i) => (
            <MatchCard
              key={j.id}
              job={j}
              featured={i === 0}
              onDismiss={dismiss}
              showDismiss={pending === j.id}
              saved={saved.has(j.id)}
              onSave={() => toggle(j.id)}
              onOpen={open}
            />
          ))}
        </div>
      )}
      <p className="m-0 text-center font-sans text-[12px] leading-[18px] text-[#737373]">
        {MATCH_FOOTER.done} {MATCH_FOOTER.sub}{' '}
        <button
          type="button"
          onClick={() => jobs.update({ tab: 'browse' })}
          className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-semibold text-[#2d5d33] underline"
        >
          {MATCH_FOOTER.link}
        </button>
      </p>
    </>
  );
};

const BrowseTab = ({ jobs }) => {
  const [mine, setMine] = useState(false);
  const rows = mine ? BROWSE_ROWS.filter((r) => r.match) : BROWSE_ROWS;
  const open = (r) => jobs.update({ job: r.id });
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[10px]">
        <label className="flex h-[40px] min-w-[240px] flex-[1_1_320px] items-center gap-[10px] rounded-full border border-solid border-[rgba(28,42,33,0.15)] bg-white px-[14px]">
          <JobSearchIcon className="size-[20px] shrink-0" />
          <input
            type="search"
            placeholder={BROWSE_COPY.search}
            aria-label={BROWSE_COPY.search}
            className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[13px] text-[#1c2a21] outline-none placeholder:text-[#999999] max-lg:text-[14px]"
          />
        </label>
        {BROWSE_COPY.filters.map((f) => (
          <Chip key={f}>{f}</Chip>
        ))}
        <ViewToggle view={jobs.view} onView={(v) => jobs.update({ view: v })} />
        <SortSelect label={SORTS.browse} />
        <AlertsButton onClick={() => jobs.update({ modal: 'alerts' })} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <span className="font-sans text-[14px] leading-[normal] font-semibold text-[#1c2a21]">
          {BROWSE_COPY.count}
        </span>
        <label className="flex cursor-pointer items-center gap-[8px] font-sans text-[12.5px] text-[#595959]">
          {BROWSE_COPY.onlyMine}
          <button
            type="button"
            role="switch"
            aria-checked={mine}
            aria-label={BROWSE_COPY.onlyMine}
            onClick={() => setMine((m) => !m)}
            className={classNames(
              'relative h-[20px] w-[36px] cursor-pointer rounded-full border-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              mine ? 'bg-[#387440]' : 'bg-[#c9c9c4]'
            )}
          >
            <span
              className={classNames(
                'absolute top-[2px] size-[16px] rounded-full bg-white transition-all',
                mine ? 'left-[18px]' : 'left-[2px]'
              )}
            />
          </button>
        </label>
      </div>
      {jobs.view === 'cards' ? (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const full = byId(r.id);
            const [company, ...rest] = r.meta.split(' · ');
            const job = full ?? {
              id: r.id,
              company: { name: company, confidential: false, logo: null },
              title: r.title,
              location: rest.slice(0, 2).join(' · '),
              type: rest[2] ?? '',
              pay: BROWSE_COPY.unmatched,
              match: 0,
              why: [],
              posted: r.age,
            };
            return r.match || full ? (
              <MatchCard key={r.id} job={job} saved={false} onSave={() => {}} onOpen={open} />
            ) : (
              <UnmatchedCard key={r.id} row={r} company={company} meta={rest} onOpen={open} />
            );
          })}
        </div>
      ) : (
        <ListCard>
          {rows.map((r) => (
            <BrowseRow key={r.id} row={r} onOpen={open} />
          ))}
        </ListCard>
      )}
    </>
  );
};

const UnmatchedCard = ({ row, company, meta, onOpen }) => (
  <article className="flex min-w-0 flex-col gap-[14px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[18px]">
    <span className="font-sans text-[13.5px] leading-[normal] font-semibold text-[#1c2a21]">
      {company}
    </span>
    <h3 className="m-0 font-sans text-[23px] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading max-sm:text-[21px]">
      {row.title}
    </h3>
    <span className="font-sans text-[12px] leading-[16px] text-[#737373]">{meta.join(' · ')}</span>
    <span className="w-fit rounded-full border border-solid border-[rgba(28,42,33,0.15)] bg-[#f8f8f4] px-[12px] py-[4px] font-sans text-[12px] text-[#737373]">
      {BROWSE_COPY.unmatched}
    </span>
    <div className="mt-auto flex items-center justify-between">
      <span className="font-sans text-[12px] text-[#737373]">{row.age}</span>
      <NotifButton size="sm" tone="secondary" onClick={() => onOpen(row)}>
        View opportunity
      </NotifButton>
    </div>
  </article>
);

const SubFilters = ({ items, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-[8px]">
    {items.map((f) => (
      <Chip key={f.id} on={value === f.id} onClick={() => onChange(f.id)}>
        {`${f.label} ${f.count}`}
      </Chip>
    ))}
  </div>
);

const SavedTab = ({ jobs }) => {
  const [removed, setRemoved] = useState([]);
  const sub = jobs.sub ?? 'all';
  const items = SAVED_JOBS.filter((s) => !removed.includes(s.id)).filter((s) =>
    sub === 'all' ? true : sub === 'closed' ? s.status === 'closed' : s.status !== 'closed'
  );
  const open = (j) => jobs.update({ job: j.id });
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <SubFilters
          items={SAVED_COPY.filters}
          value={sub}
          onChange={(v) => jobs.update({ sub: v === 'all' ? null : v })}
        />
        <div className="flex flex-wrap items-center gap-[10px]">
          <ViewToggle view={jobs.view} onView={(v) => jobs.update({ view: v })} />
          <SortSelect label={SORTS.saved} />
          <AlertsButton onClick={() => jobs.update({ modal: 'alerts' })} />
        </div>
      </div>
      <div className="flex items-center gap-[10px] rounded-[14px] bg-[#faf4e8] px-[14px] py-[10px]">
        <JobNoteSparkIcon className="size-[14px] shrink-0" />
        <span className="font-sans text-[12.5px] leading-[18px] text-[#595959]">
          {SAVED_COPY.notice}
        </span>
      </div>
      {jobs.view === 'list' ? (
        <ListCard>
          {items.map((s) => (
            <JobListRow
              key={s.id}
              job={byId(s.id)}
              saved
              onSave={() => setRemoved((r) => [...r, s.id])}
              onOpen={open}
            />
          ))}
        </ListCard>
      ) : (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <SavedCard
              key={s.id}
              job={byId(s.id)}
              status={s.status}
              onRemove={() => setRemoved((r) => [...r, s.id])}
              onOpen={open}
            />
          ))}
        </div>
      )}
    </>
  );
};

const AppliedTab = ({ jobs }) => {
  const sub = jobs.sub ?? 'all';
  // J-21: a withdrawn application stays in the list, dimmed, with "Apply again" (Active 3 → 2, Closed 1 → 2).
  const withdrawn = jobs.withdrawn || jobs.wd;
  const all = APPLIED_ROWS.map((r) =>
    withdrawn && r.id === 'data-analyst'
      ? {
          ...r,
          step: -1,
          tone: 'withdrawn',
          group: 'closed',
          status: APPLIED_COPY.withdrawnStatus,
          action: APPLIED_COPY.withdrawnAction,
        }
      : r
  );
  const rows = all.filter((r) =>
    sub === 'all' ? true : sub === 'active' ? r.group !== 'closed' : r.group === sub
  );
  const filters = withdrawn
    ? APPLIED_COPY.filters.map((f) =>
        f.id === 'active' ? { ...f, count: '2' } : f.id === 'closed' ? { ...f, count: '2' } : f
      )
    : APPLIED_COPY.filters;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-[10px]">
        <SubFilters
          items={filters}
          value={sub}
          onChange={(v) => jobs.update({ sub: v === 'all' ? null : v })}
        />
        <div className="flex flex-wrap items-center gap-[10px]">
          <SortSelect label={SORTS.applied} />
          <AlertsButton onClick={() => jobs.update({ modal: 'alerts' })} />
        </div>
      </div>
      <div className="flex flex-col gap-[14px]">
        {rows.map((r, i) => {
          const j = byId(r.id);
          return (
            <AppliedRow
              key={r.id}
              row={r}
              featured={i === 0 && r.tone === 'good'}
              logo={
                j?.company.logo ? (
                  <img
                    src={j.company.logo}
                    alt=""
                    aria-hidden="true"
                    className="size-[40px] shrink-0 rounded-[12px]"
                  />
                ) : (
                  <span
                    className="size-[40px] shrink-0 rounded-[12px] bg-[#8b5cf6]"
                    aria-hidden="true"
                  />
                )
              }
              onAction={() => jobs.update({ job: r.id })}
            />
          );
        })}
      </div>
      <div className="flex w-fit items-center gap-[8px] rounded-full bg-[#ebf1ec] px-[14px] py-[8px]">
        <JobNoteSparkIcon className="size-[14px] shrink-0" />
        <span className="font-sans text-[12px] leading-[16px] text-[#2d5d33]">
          {APPLIED_COPY.tip}
        </span>
      </div>
    </>
  );
};

const JobsScreen = ({ jobs }) => {
  const [saved, setSaved] = useState(() => new Set());
  const toggle = (id) => {
    log('toggle save', id);
    setSaved((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const empty = jobs.state === 'empty' && jobs.tab === 'matched';
  const loading = jobs.state === 'loading' && jobs.tab === 'matched';
  const sticker = empty ? JOBS_HEADER.stickers.empty : JOBS_HEADER.stickers[jobs.tab];

  return (
    <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] px-[clamp(12px,3vw,52px)] pt-[clamp(16px,1.85vw,32px)] pb-[24px]">
      <JobsHeader sticker={sticker} />
      <div className="flex flex-col gap-[16px]">
        <JobsTabs
          matchedCount={empty ? '0' : undefined}
          tab={jobs.tab}
          onTab={(tab) =>
            jobs.update({ tab: tab === 'matched' ? null : tab, sub: null, view: null, state: null })
          }
        />
        {jobs.tab === 'matched' ? <MatchToolbar jobs={jobs} dim={empty} /> : null}
        {loading ? <Banner dim /> : null}
      </div>
      {empty ? (
        <EmptyMatches jobs={jobs} />
      ) : loading ? (
        <Skeleton />
      ) : jobs.tab === 'matched' ? (
        <MatchedTab jobs={jobs} saved={saved} toggle={toggle} />
      ) : jobs.tab === 'browse' ? (
        <BrowseTab jobs={jobs} />
      ) : jobs.tab === 'saved' ? (
        <SavedTab jobs={jobs} />
      ) : (
        <AppliedTab jobs={jobs} />
      )}
    </div>
  );
};

export { BookmarkButton };
export default JobsScreen;
