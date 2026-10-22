import {
  BookGlyph,
  CompanyGlyph,
  GlobeGlyph,
  HeartGlyph,
  LockGlyph,
  MapGlyph,
  WalletGlyph,
} from './OpportunitiesIcons.jsx';
import { RESULTS } from './OpportunitiesData.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('JobCard');

const JOB_ICONS = {
  wallet: WalletGlyph,
  globe: GlobeGlyph,
  company: CompanyGlyph,
  map: MapGlyph,
  heart: HeartGlyph,
  book: BookGlyph,
};

/*
 * Job card (Figma "Job · …" 7797:28600, 576x176 desktop, full column width on tablet/mobile): tile + title/meta + heart,
 * chips (gold type · mint pay), locked fit-score strip with "Posted 2d ago". The first card is the featured one
 * (#f5f9f5, green tile, rotated lime FEATURED sticker).
 */
const JobCard = ({ job }) => {
  const Icon = JOB_ICONS[job.icon];
  return (
    <article
      className={classNames(
        'relative flex flex-col gap-3 rounded-[24px] border-[1.4px] border-[#1c2a21]/[0.32] p-5 shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]',
        job.featured ? 'bg-[#f5f9f5]' : 'bg-white'
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={classNames(
            'flex size-12 shrink-0 items-center justify-center rounded-[14px]',
            job.featured ? 'bg-[#387440] text-white' : 'bg-[#ebf1ec] text-[#387440]'
          )}
        >
          <span className="size-6">
            <Icon />
          </span>
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <h3 className="m-0 font-sans text-[17px] font-semibold leading-[20.3px] text-[#1c2a21]">
            {job.title}
          </h3>
          <p className="m-0 font-sans text-[13px] leading-[15.5px] text-[#595959]">{job.meta}</p>
        </div>
        <button
          type="button"
          aria-label={`Save ${job.title}`}
          onClick={() => log('save (inert)', job.id)}
          className="size-5 shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#595959]"
        >
          <HeartGlyph />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-[6px]">
        <span className="inline-flex h-[26px] items-center rounded-full border border-[#1c2a21] bg-[#ffd86b] px-3 font-sans text-[12px] font-semibold text-[#1c2a21]">
          {job.chip}
        </span>
        <span className="inline-flex h-6 items-center rounded-full bg-[#ebf1ec] px-3 font-sans text-[12px] font-semibold text-[#387440]">
          {job.pay}
        </span>
      </div>
      <div className="flex items-center gap-[10px] rounded-[14px] bg-[#f7f8f4] px-3 py-[10px]">
        <span className="size-4 shrink-0 text-[#595959]">
          <LockGlyph />
        </span>
        <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#595959]">
          {RESULTS.fitLocked}
        </span>
        <span aria-hidden="true" className="min-w-0 flex-1" />
        <span className="shrink-0 font-sans text-[12px] font-medium leading-[14.3px] text-[#595959]">
          {RESULTS.posted}
        </span>
      </div>
      {job.featured ? (
        <span className="absolute -top-[19px] right-[47px] -rotate-[5deg] rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#84cc16] px-[11px] py-[5px] font-sans text-[12px] font-bold tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]">
          {RESULTS.featured}
        </span>
      ) : null}
    </article>
  );
};

export default JobCard;
