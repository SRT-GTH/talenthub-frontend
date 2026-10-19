import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import {
  JobArrowIcon,
  JobBookmarkIcon,
  JobBriefIcon,
  JobCashIcon,
  JobClockIcon,
  JobConfidentialLockIcon,
  JobEyeIcon,
  JobPinIcon,
  JobStepCheckIcon,
  JobWhyCheckIcon,
} from '../../shared/assets.jsx';
import NotifButton from '../notifications/NotifButton.jsx';
import { JobSticker } from './JobsChrome.jsx';
import { APPLIED_COPY, BROWSE_COPY, SAVED_COPY } from './talentJobsData.js';

/*
 * Job cards / rows for every list frame (Figma J-01 7503:104 cards, J-01L 7559:6406 list, J-18 browse rows,
 * J-19 saved cards, J-10 applied rows). Card = 430 wide r22 p18 gap14; the first card is "featured"
 * (ink border + shelf + green primary button), the rest are hairline cards with a white button.
 */
const Logo = ({ company, size = 40 }) =>
  company.confidential ? (
    <span
      className="flex shrink-0 items-center justify-center rounded-[12px] border border-dashed border-[rgba(28,42,33,0.35)] bg-[#f8f8f4]"
      style={{ width: size, height: size }}
    >
      <JobConfidentialLockIcon className="size-[19px]" />
    </span>
  ) : company.logo ? (
    <img
      src={company.logo}
      alt=""
      aria-hidden="true"
      className="shrink-0 rounded-[12px]"
      style={{ width: size, height: size }}
    />
  ) : (
    // Live postings without a logo: initials tile (never a borrowed brand mark).
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] font-sans text-[14px] font-bold text-[#2d5d33]"
      style={{ width: size, height: size }}
    >
      {company.initials ||
        String(company.name || '?')
          .slice(0, 1)
          .toUpperCase()}
    </span>
  );

export const BookmarkButton = ({ on, onClick, title }) => (
  <button
    type="button"
    aria-pressed={on}
    aria-label={`${on ? 'Unsave' : 'Save'} ${title}`}
    onClick={onClick}
    className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    <JobBookmarkIcon className={classNames('size-[15px]', on ? '[&_path]:fill-[#1c2a21]' : null)} />
  </button>
);

const MetaChip = ({ icon, children }) => {
  const Icon = icon;
  return (
    <span className="inline-flex items-center gap-[5px] rounded-[8px] border border-solid border-[rgba(28,42,33,0.35)] bg-[#f8f8f4] px-[8px] py-[4px] font-sans text-[12px] leading-[normal] text-[#1c2a21]">
      <Icon className="size-[13px] shrink-0" />
      {children}
    </span>
  );
};

const WhyChip = ({ children }) => (
  <span className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#c1d4c4] bg-white px-[8px] py-[3px] font-sans text-[11.5px] leading-[normal] text-[#2d5d33] max-lg:text-[12px]">
    <JobWhyCheckIcon className="size-[11px] shrink-0" />
    {children}
  </span>
);

const SignalChip = ({ children }) => (
  <span className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border border-solid border-[#c8951a] bg-[#faf4e8] px-[8px] py-[3px] font-sans text-[11.5px] leading-[normal] font-semibold text-[#8a6410] max-lg:text-[12px]">
    <JobEyeIcon className="size-[12px] shrink-0" />
    {children}
  </span>
);

const Meter = ({ pct }) => (
  <span
    className="h-[8px] w-[110px] shrink-0 overflow-hidden rounded-full bg-white"
    aria-hidden="true"
  >
    <span
      className={classNames(
        'block h-full rounded-full',
        pct >= 80 ? 'bg-[#387440]' : 'bg-[#c8951a]'
      )}
      style={{ width: `${pct}%` }}
    />
  </span>
);

/* Cards ------------------------------------------------------------------------------------------ */
export const MatchCard = ({
  job,
  featured,
  saved,
  onSave,
  onOpen,
  onDismiss,
  showDismiss,
  footer,
}) => {
  const { company } = job;
  return (
    <article
      className={classNames(
        'group flex min-w-0 flex-col gap-[14px] rounded-[22px] bg-white p-[18px]',
        featured
          ? 'border-[1.5px] border-solid border-[rgba(28,42,33,0.55)] shadow-[0_4px_0_rgba(28,42,33,0.12)]'
          : 'border border-solid border-[#e1eae2]',
        job.dim ? 'opacity-70' : null
      )}
    >
      <div className="flex items-center gap-[10px]">
        <Logo company={company} />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="truncate font-sans text-[13.5px] leading-[normal] font-semibold text-[#1c2a21]">
            {company.name}
          </span>
          <span className="truncate font-sans text-[12px] leading-[normal] text-[#737373] max-lg:text-[12px]">
            {company.sector ?? job.signal}
          </span>
        </div>
        {job.isNew ? <JobSticker>New</JobSticker> : null}
        {job.statusPill}
        {onDismiss ? (
          <button
            type="button"
            onClick={() => onDismiss(job)}
            className={classNames(
              'hidden cursor-pointer items-center gap-[4px] rounded-full border-0 bg-[#1c2a21] px-[10px] py-[5px] font-sans text-[11.5px] leading-[normal] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] lg:inline-flex',
              showDismiss
                ? 'opacity-100'
                : 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100'
            )}
          >
            <span aria-hidden="true">×</span> Not for me
          </button>
        ) : null}
        {onSave ? <BookmarkButton on={saved} onClick={onSave} title={job.title} /> : null}
      </div>
      <h3 className="m-0 font-sans text-[23px] leading-[1.2] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading max-sm:text-[21px]">
        {job.title}
      </h3>
      <div className="flex flex-wrap gap-[6px]">
        <MetaChip icon={JobPinIcon}>{job.location}</MetaChip>
        <MetaChip icon={JobBriefIcon}>{job.type}</MetaChip>
        <MetaChip icon={JobCashIcon}>{job.pay}</MetaChip>
      </div>
      <div className="flex flex-col gap-[10px] rounded-[16px] bg-[#ebf1ec] p-[12px]">
        <div className="flex items-center gap-[10px]">
          <span className="font-sans text-[23px] leading-[1] font-semibold text-[#1c2a21] playful:font-heading">
            {job.match}%
          </span>
          <span className="font-sans text-[12px] leading-[normal] text-[#595959]">match</span>
          <Meter pct={job.match} />
        </div>
        <div className="flex flex-wrap gap-[6px]">
          {job.why.map((w) => (
            <WhyChip key={w}>{w}</WhyChip>
          ))}
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px]">
        <span className="font-sans text-[12px] leading-[normal] text-[#737373]">{job.posted}</span>
        <div className="flex items-center gap-[8px]">
          {footer}
          {onDismiss ? (
            <button
              type="button"
              onClick={() => onDismiss(job)}
              className="cursor-pointer whitespace-nowrap border-0 bg-transparent px-[6px] font-sans text-[12px] leading-[normal] font-semibold text-[#595959] hover:underline focus-visible:outline-2 focus-visible:outline-[#387440] lg:hidden"
            >
              Not for me
            </button>
          ) : null}
          <NotifButton
            size="sm"
            tone={featured ? 'primary' : 'secondary'}
            onClick={() => onOpen?.(job)}
          >
            View opportunity
          </NotifButton>
        </div>
      </div>
    </article>
  );
};

/* Saved card: same body, status pill instead of the New sticker, Remove + View in the footer. */
export const SavedCard = ({ job, status, onRemove, onOpen }) => {
  const closed = status === 'closed';
  const pill = (
    <span
      className={classNames(
        'inline-flex items-center gap-[4px] whitespace-nowrap rounded-full border border-solid px-[8px] py-[3px] font-sans text-[11.5px] leading-[normal] font-semibold max-lg:text-[12px]',
        closed
          ? 'border-[rgba(28,42,33,0.2)] bg-[#f1f1ee] text-[#737373]'
          : status === 'closing'
            ? 'border-[#c8951a] bg-[#faf4e8] text-[#8a6410]'
            : 'hidden'
      )}
    >
      {status === 'closing' ? <JobClockIcon className="size-[13px]" /> : null}
      {closed ? SAVED_COPY.closed : SAVED_COPY.closesIn}
    </span>
  );
  return (
    <MatchCard
      job={{ ...job, isNew: false, statusPill: status === 'open' ? null : pill, dim: closed }}
      saved
      onSave={onRemove}
      onOpen={onOpen}
      footer={
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer border-0 bg-transparent px-[6px] font-sans text-[12.5px] leading-[normal] font-semibold text-[#595959] hover:underline focus-visible:outline-2 focus-visible:outline-[#387440]"
        >
          {SAVED_COPY.remove}
        </button>
      }
    />
  );
};

/* Rows ------------------------------------------------------------------------------------------- */
export const ArrowButton = ({ label, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    <JobArrowIcon className="size-[16px]" />
  </button>
);

const MatchPill = ({ pct }) => (
  <span
    className={classNames(
      'inline-flex h-[26px] shrink-0 items-center whitespace-nowrap rounded-full px-[12px] font-sans text-[12.5px] leading-[normal] font-bold max-lg:text-[12px]',
      pct >= 80
        ? 'bg-[#387440] text-white'
        : 'border border-solid border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]'
    )}
  >
    {pct}% match
  </span>
);

const Age = ({ children }) => (
  <span className="w-[40px] shrink-0 text-right font-sans text-[12px] leading-[normal] text-[#737373]">
    {children}
  </span>
);

const RowShell = ({ children, className }) => (
  <div
    className={classNames(
      'flex flex-wrap items-center gap-x-[14px] gap-y-[8px] border-0 border-b border-solid border-[#e1eae2] px-[18px] py-[14px] last:border-b-0 max-md:px-[14px]',
      className
    )}
  >
    {children}
  </div>
);

/* J-01L / J-19L list row (matched jobs) */
export const JobListRow = ({ job, saved, onSave, onOpen }) => {
  const extra = job.why.length > 2 ? job.why.length - 2 : job.why.length - 1;
  const shown = job.why.slice(0, job.signal && job.signal !== 'New match' ? 1 : 2);
  return (
    <RowShell>
      <Logo company={job.company} />
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-[2px]">
        <span className="flex flex-wrap items-center gap-[8px]">
          <span className="font-sans text-[14.5px] leading-[normal] font-semibold text-[#1c2a21]">
            {job.title}
          </span>
          {job.isNew ? <JobSticker>New</JobSticker> : null}
        </span>
        <span className="font-sans text-[12px] leading-[16px] text-[#737373]">
          {job.company.name} · {job.location} · {job.type} · {job.pay}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-[8px] max-lg:hidden">
        {job.signal && job.signal !== 'New match' && job.signal.includes('viewed') ? (
          <SignalChip>{job.signal}</SignalChip>
        ) : null}
        {shown.map((w) => (
          <WhyChip key={w}>{w}</WhyChip>
        ))}
        <span className="inline-flex h-[22px] items-center rounded-full border border-solid border-[#c1d4c4] bg-white px-[7px] font-sans text-[11.5px] text-[#2d5d33] max-lg:text-[12px]">
          +{Math.max(extra, 1)}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-[10px]">
        <MatchPill pct={job.match} />
        <Age>{job.age}</Age>
        <BookmarkButton on={saved} onClick={onSave} title={job.title} />
        <ArrowButton label={`View ${job.title}`} onClick={() => onOpen?.(job)} />
      </div>
    </RowShell>
  );
};

/* J-18 browse row: no logo in the Figma rows, a leading marker tile instead. */
export const BrowseRow = ({ row, onOpen, saved: savedProp, onSave }) => {
  // Live: saved state + toggle come from the screen (real bookmarks); demo: local only.
  const [localSaved, setSaved] = useState(false);
  const saved = onSave ? Boolean(savedProp) : localSaved;
  return (
    <RowShell>
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-[2px] pl-[2px]">
        <span className="font-sans text-[14.5px] leading-[normal] font-semibold text-[#1c2a21]">
          {row.title}
        </span>
        <span className="font-sans text-[12px] leading-[16px] text-[#737373]">{row.meta}</span>
      </div>
      <div className="ml-auto flex items-center gap-[10px]">
        {row.match ? (
          <MatchPill pct={row.match} />
        ) : (
          <span className="inline-flex h-[26px] items-center whitespace-nowrap rounded-full border border-solid border-[rgba(28,42,33,0.15)] bg-[#f8f8f4] px-[12px] font-sans text-[12px] leading-[normal] text-[#737373]">
            {BROWSE_COPY.unmatched}
          </span>
        )}
        <Age>{row.age}</Age>
        <BookmarkButton
          on={saved}
          onClick={onSave ?? (() => setSaved((s) => !s))}
          title={row.title}
        />
        <ArrowButton label={`View ${row.title}`} onClick={() => onOpen?.(row)} />
      </div>
    </RowShell>
  );
};

/* J-10 applied row: progress stepper + status pill + action. */
export const AppliedRow = ({ row, onAction, featured, logo }) => {
  const closed = row.tone === 'closed' || row.tone === 'withdrawn';
  return (
    <article
      className={classNames(
        'flex flex-wrap items-center gap-x-[24px] gap-y-[14px] rounded-[20px] bg-white px-[20px] py-[16px]',
        featured
          ? 'border-[1.5px] border-solid border-[rgba(28,42,33,0.55)] shadow-[0_4px_0_rgba(28,42,33,0.12)]'
          : 'border border-solid border-[#e1eae2]',
        closed ? 'opacity-60' : null
      )}
    >
      <div className="flex min-w-0 flex-[1_1_220px] items-center gap-[12px] lg:max-w-[300px]">
        {logo}
        <div className="flex min-w-0 flex-col gap-[2px]">
          <h3 className="m-0 font-sans text-[17px] leading-[normal] font-semibold text-[#1c2a21] playful:font-heading">
            {row.title}
          </h3>
          <span className="font-sans text-[12px] leading-[16px] text-[#737373]">{row.meta}</span>
        </div>
      </div>
      <ol
        aria-label="Application progress"
        className="m-0 flex min-w-[280px] flex-[2_1_320px] list-none items-start p-0"
      >
        {APPLIED_COPY.steps.map((s, i) => {
          const done = i < row.step;
          const here = i === row.step;
          return (
            <li key={s} className="relative flex min-w-0 flex-1 flex-col items-center gap-[6px]">
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className={classNames(
                    'absolute top-[10px] right-1/2 left-[-50%] h-[2px]',
                    i <= row.step ? 'bg-[#387440]' : 'bg-[#e1eae2]'
                  )}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={classNames(
                  'relative flex shrink-0 items-center justify-center rounded-full border-2 border-solid',
                  here && row.tone === 'good' ? 'size-[22px]' : 'size-[16px] mt-[3px]',
                  done || (here && !closed)
                    ? 'border-[#387440] bg-[#387440]'
                    : 'border-[#d3dcd4] bg-white',
                  here && row.tone === 'good' ? '!border-[#c8951a] !bg-[#ffd86b]' : null
                )}
              >
                {done ? <JobStepCheckIcon className="size-[9px]" /> : null}
              </span>
              <span
                className={classNames(
                  'font-sans text-[11px] leading-[normal] max-lg:text-[12px]',
                  here ? 'font-bold text-[#1c2a21]' : 'text-[#737373]'
                )}
              >
                {s}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="ml-auto flex items-center gap-[12px]">
        <span
          className={classNames(
            'inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border border-solid px-[10px] py-[4px] font-sans text-[11.5px] leading-[normal] font-semibold max-lg:text-[12px]',
            row.tone === 'good'
              ? 'border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]'
              : 'border-[rgba(28,42,33,0.2)] bg-white text-[#595959]'
          )}
        >
          {row.status.startsWith('Seen') ? <JobEyeIcon className="size-[13px]" /> : null}
          {row.status}
        </span>
        <NotifButton
          size="md"
          tone={row.tone === 'good' ? 'primary' : 'secondary'}
          onClick={() => onAction?.(row)}
        >
          {row.action}
        </NotifButton>
      </div>
    </article>
  );
};
