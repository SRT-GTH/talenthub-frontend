import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { JobChevronIcon, JobViewGridIcon, JobViewListIcon } from '../../shared/assets.jsx';
import headSparkle from '../../../assets/notifications/icons/head-sparkle.svg';
import headFlame from '../../../assets/notifications/icons/head-flame.svg';
import headDoodleGold from '../../../assets/notifications/icons/head-doodle-gold.svg';
import headDoodleGreen from '../../../assets/notifications/icons/head-doodle-green.svg';
import headDoodleSquiggle from '../../../assets/notifications/icons/head-doodle-squiggle.svg';
import headDoodleRing from '../../../assets/notifications/icons/head-doodle-ring.svg';
import face1 from '../../../assets/notifications/avatars/face-1.png';
import face2 from '../../../assets/notifications/avatars/face-2.png';
import face3 from '../../../assets/notifications/avatars/face-3.png';
import face4 from '../../../assets/notifications/avatars/face-4.png';
import {
  ALERTS_BUTTON,
  JOBS_HEADER,
  JOB_TAB_LIST,
  MATCH_FILTERS,
  SORTS,
} from './talentJobsData.js';

const log = debug('JobsChrome');
const FACES = [face1, face2, face3, face4];

/*
 * JobsChrome — header, tab strip and toolbar shared by every Job Postings list frame (Figma "GTH · Job
 * Postings" J-01…J-19, e.g. Playful 7503:104 / Focused 8110:409276). Main column x343 w1329, gap 24.
 *   header   title Bricolage 34/41 + yellow sticker, 16px #999 subtitle; right: Messages-header decoration
 *            (faces · "9 recruiters viewed you" · green + amber stickers) — Playful only, like /notifications
 *   tabs     Matched to you / Browse all / Saved / Applied, 13.5px, counts as 22x16 pills (amber = selected)
 *   toolbar  filter chips (28px), grid/list toggle, sort select, "Match alerts · 75%+" button
 */
export const JobSticker = ({ children, className }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] font-bold leading-[normal] text-[#2d5d33]',
      'playful:rotate-[-3deg] playful:border-[1.5px] playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[1.5px_1.5px_0_rgba(28,42,33,0.9)]',
      className
    )}
  >
    {children}
  </span>
);

const HeaderDecor = () => (
  <div
    className="relative hidden h-[84px] w-[600px] shrink-0 xl:playful:block"
    aria-hidden="true"
    data-doodle=""
  >
    {/* Live: the faces + "N recruiters viewed you" pair only shows when we have that number. */}
    {JOBS_HEADER.decor.viewed ? (
      <>
        <span className="absolute left-[27px] top-[34px] flex">
          {FACES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="-ml-[12px] size-[40px] rounded-full border-[3px] border-solid border-white object-cover first:ml-0"
              style={{ zIndex: 4 - i }}
            />
          ))}
        </span>
        <span className="absolute left-[163px] top-[42px] inline-flex whitespace-nowrap items-center gap-[6px] rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px] font-sans text-[12px] leading-[normal] text-[#1c2a21]">
          <span className="size-[8px] rounded-full bg-[#349643]" />
          {JOBS_HEADER.decor.viewed}
        </span>
      </>
    ) : null}
    <span
      className="absolute left-[372px] top-[10px] inline-flex items-center gap-[6px] rounded-full bg-[#387440] px-[14px] py-[8px] font-sans text-[13px] font-medium leading-[16px] tracking-[0.2px] text-white"
      style={{ transform: 'rotate(2deg)' }}
    >
      <img src={headSparkle} alt="" className="size-[15px]" />
      {JOBS_HEADER.decor.daily}
    </span>
    {JOBS_HEADER.decor.week ? (
      <span
        className="absolute left-[464px] top-[43px] inline-flex whitespace-nowrap items-center gap-[6px] rounded-full border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px] font-sans text-[12px] font-semibold leading-[normal] text-[#8a6410]"
        style={{ transform: 'rotate(2deg)' }}
      >
        <img src={headFlame} alt="" className="size-[15px]" />
        {JOBS_HEADER.decor.week}
      </span>
    ) : null}
    <img src={headDoodleGold} alt="" className="absolute left-[574px] top-0 size-[22px]" />
    <img src={headDoodleGreen} alt="" className="absolute left-[316px] top-[46px] size-[12px]" />
    <img
      src={headDoodleSquiggle}
      alt=""
      className="absolute left-[298px] top-[10px] h-[20px] w-[48px]"
    />
    <img src={headDoodleRing} alt="" className="absolute left-[250px] top-[6px] size-[14px]" />
  </div>
);

export const JobsHeader = ({ sticker }) => (
  <div className="flex items-start justify-between gap-[24px]">
    <div className="flex min-w-0 flex-col gap-[3px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1c2a21] playful:font-heading">
          {JOBS_HEADER.title}
        </h1>
        {sticker ? <JobSticker>{sticker}</JobSticker> : null}
      </div>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999999] max-sm:text-[14px] max-sm:leading-[20px]">
        {JOBS_HEADER.subtitle}
      </p>
    </div>
    <HeaderDecor />
  </div>
);

/* Tab counts are generated content (data-count) so a label never wraps away from its number. */
export const JobsTabs = ({ tab, onTab, matchedCount }) => (
  <nav
    aria-label="Job postings"
    className="no-scrollbar max-lg:[mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-24px),transparent)] -mb-px flex gap-[clamp(14px,1.9vw,32px)] overflow-x-auto border-b border-solid border-[#e1eae2]"
  >
    {JOB_TAB_LIST.map((item) => {
      const t = item.id === 'matched' && matchedCount ? { ...item, count: matchedCount } : item;
      const on = t.id === tab;
      return (
        <button
          key={t.id}
          type="button"
          aria-current={on ? 'page' : undefined}
          aria-label={`${t.label}, ${t.count}`}
          onClick={() => {
            log('tab ->', t.id);
            onTab(t.id);
          }}
          className={classNames(
            'relative flex shrink-0 cursor-pointer items-center gap-[8px] whitespace-nowrap border-0 bg-transparent px-0 py-[10px] font-sans text-[13.5px] leading-[normal] max-lg:text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            on ? 'font-bold text-[#1c2a21]' : 'font-medium text-[#595959]'
          )}
        >
          <span aria-hidden="true">{t.label}</span>
          <span
            aria-hidden="true"
            data-count={t.count}
            className={classNames(
              'inline-flex h-[16px] min-w-[22px] items-center justify-center rounded-full px-[6px] text-[11px] font-bold after:content-[attr(data-count)] max-lg:text-[12px]',
              on
                ? 'bg-[#ffd86b] text-[#1c2a21] playful:bg-[#ffd86b]'
                : 'bg-[#ebf1ec] text-[#2d5d33]'
            )}
          />
          {on ? (
            <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#1c2a21]" />
          ) : null}
        </button>
      );
    })}
  </nav>
);

export const Chip = ({ on, dim, children, onClick }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={classNames(
      'inline-flex h-[28px] shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border border-solid px-[12px] font-sans text-[12.5px] leading-[normal] font-semibold max-lg:text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      on
        ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
        : 'border-[rgba(28,42,33,0.2)] bg-white text-[#1c2a21]',
      dim ? 'opacity-45' : null
    )}
  >
    {children}
  </button>
);

const VIEW_OPTIONS = [
  { id: 'cards', label: 'Cards', icon: <JobViewGridIcon className="size-[16px]" /> },
  { id: 'list', label: 'List', icon: <JobViewListIcon className="size-[16px]" /> },
];

export const ViewToggle = ({ view, onView, dim }) => (
  <span
    role="radiogroup"
    aria-label="Layout"
    className={classNames(
      'inline-flex h-[34px] w-[78px] shrink-0 items-center gap-[2px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[3px]',
      dim ? 'opacity-45' : null
    )}
  >
    {VIEW_OPTIONS.map((opt) => (
      <button
        key={opt.id}
        type="button"
        role="radio"
        aria-checked={view === opt.id}
        aria-label={opt.label}
        onClick={() => onView(opt.id)}
        className={classNames(
          'flex h-full flex-1 cursor-pointer items-center justify-center rounded-full border-0 p-0 focus-visible:outline-2 focus-visible:outline-[#387440]',
          view === opt.id ? 'bg-[#1c2a21] text-white [&_path]:stroke-white' : 'bg-transparent'
        )}
      >
        {opt.icon}
      </button>
    ))}
  </span>
);

export const SortSelect = ({ label, dim }) => (
  <button
    type="button"
    aria-label={`Sort: ${label}`}
    className={classNames(
      'inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-[4px] whitespace-nowrap rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white pr-[10px] pl-[14px] font-sans text-[12.5px] leading-[normal] font-medium text-[#595959] max-lg:text-[12px]',
      dim ? 'opacity-45' : null
    )}
  >
    {label}
    <JobChevronIcon className="size-[14px]" />
  </button>
);

export const AlertsButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-[34px] shrink-0 cursor-pointer items-center whitespace-nowrap rounded-[10px] border border-solid border-[rgba(28,42,33,0.3)] bg-white px-[14px] font-sans text-[12.5px] leading-[normal] font-bold text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.2)] max-lg:text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {ALERTS_BUTTON}
  </button>
);

/* Matched-tab toolbar (and the disabled look it takes in the empty frame J-07). */
export const MatchToolbar = ({ jobs, dim }) => {
  const filter = jobs.sub ?? 'All';
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[10px]">
      <div className="no-scrollbar max-lg:[mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-24px),transparent)] -mx-px flex min-w-0 max-w-full items-center gap-[8px] overflow-x-auto px-px">
        {MATCH_FILTERS.map((f) => (
          <Chip
            key={f}
            on={filter === f}
            dim={dim && filter !== f}
            onClick={() => jobs.update({ sub: f === 'All' ? null : f })}
          >
            {f}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-[10px]">
        <ViewToggle view={jobs.view} dim={dim} onView={(v) => jobs.update({ view: v })} />
        <SortSelect label={SORTS[jobs.tab]} dim={dim} />
        <AlertsButton onClick={() => jobs.update({ modal: 'alerts' })} />
      </div>
    </div>
  );
};
