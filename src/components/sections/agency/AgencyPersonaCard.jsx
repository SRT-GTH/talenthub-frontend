import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { AgencyShieldIcon } from './agencyIcons.jsx';
import { AGENCY_BASE } from './agencyNav.js';

const log = debug('AgencyPersonaCard');

/*
 * AgencyPersonaCard — "Persona card" of the agency rail (Figma 8602:400246, 279 x 327, r16, border #e1eae2):
 * monogram 62 (#387440) · name 14/600 + Admin chip (#eaeffb, #244a9f 10/600) · "Director, Research & Data · NYA" 12 · MoU status line ·
 * quota bar (gradient #1f4a2b → #3f7f4c on #ebf1ec/50) · "View MoU and access →" · stats strip (Regions · Requests · Programmes).
 * Props: session (useAgencySession()). The status line, quota % and stats follow the MoU gate (?mou=, ?quota=).
 */

const Stat = ({ value, label }) => (
  <div className="flex flex-1 flex-col items-center gap-[2px] px-[2px]">
    <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#387440]">
      {value}
    </span>
    <span className="font-sans text-[11px] max-lg:text-[12px] leading-[13px] text-[#999999]">
      {label}
    </span>
  </div>
);

const AgencyPersonaCard = ({ session, onNavigate, className }) => {
  const { analyst, agency, mou, quota, stats } = session;
  log('render', { status: mou.status, pct: quota.pct });
  return (
    <section
      aria-label="Your account"
      className={classNames(
        'flex flex-col gap-[16px] rounded-[16px] border-[1.4px] border-solid border-[#e1eae2] bg-white px-[9.6px] py-[17.6px]',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="mx-auto flex size-[62px] items-center justify-center rounded-full bg-[#387440] font-sans text-[22px] leading-[26px] font-semibold text-white"
      >
        {analyst.monogram}
      </span>
      <div className="flex flex-col items-center gap-[7px]">
        <div className="flex items-center gap-[5px]">
          <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#1c2a21]">
            {analyst.name}
          </span>
          <span className="inline-flex h-[18px] items-center gap-[3px] rounded-[4px] bg-[#eaeffb] py-[2px] pr-[7px] pl-[6px] font-sans text-[10px] max-lg:text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#244a9f]">
            <AgencyShieldIcon className="size-[8px] text-[#185fa5]" />
            {analyst.role}
          </span>
        </div>
        <p className="m-0 text-center font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
          {analyst.title} · {agency.short}
        </p>
        <p className="m-0 flex items-center gap-[5px] font-sans text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#387440]">
          <span aria-hidden="true" className="size-[4px] rounded-full bg-[#387440]" />
          {mou.label}
        </p>
      </div>
      <div className="mx-[9px] flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[13px] leading-[16px] font-semibold tracking-[0.2px] text-[#1c2a21]">
            Query quota this month
          </span>
          <span className="font-sans text-[11px] max-lg:text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#babab7]">
            {quota.pct}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Query quota this month"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={quota.pct}
          className="h-[7px] w-full overflow-hidden rounded-[4px] bg-[#ebf1ec]/50"
        >
          <div
            className="h-full rounded-[4px] bg-[linear-gradient(135deg,#1f4a2b,#3f7f4c)]"
            style={{ width: `${quota.pct}%` }}
          />
        </div>
        <Link
          to={`${AGENCY_BASE}/settings/mou`}
          onClick={onNavigate}
          className="font-sans text-[11px] max-lg:text-[12px] leading-[13px] tracking-[0.2px] text-[#70706e] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          View MoU and access →
        </Link>
      </div>
      <div
        role="group"
        aria-label="Your agency in numbers"
        className="flex items-center gap-[4px] rounded-[10px] border border-solid border-[#faf4e8] bg-[#ebf1ec]/50 px-[3px] py-[9px]"
      >
        <Stat value={stats.regions} label="Regions" />
        <span aria-hidden="true" className="h-[28px] w-px bg-[#ebf1ec]" />
        <Stat value={stats.requests} label="Requests" />
        <span aria-hidden="true" className="h-[28px] w-px bg-[#ebf1ec]" />
        <Stat value={stats.programmes} label="Programmes" />
      </div>
    </section>
  );
};

export default AgencyPersonaCard;
