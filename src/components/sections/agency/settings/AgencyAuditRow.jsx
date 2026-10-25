import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { AgencyLockIcon } from '../agencyIcons.jsx';
import {
  AgencySettingsArrowIcon,
  AgencySettingsBookmarkIcon,
  AgencySettingsCheckIcon,
  AgencySettingsDownloadIcon,
  AgencySettingsEyeIcon,
  AgencySettingsFilterIcon,
} from './agencySettingsIcons.jsx';

const KIND_ICON = {
  download: AgencySettingsDownloadIcon,
  query: AgencySettingsFilterIcon,
  request: AgencyLockIcon,
};

const Pill = ({ children, icon }) => (
  <span className="inline-flex items-center gap-[4px] rounded-full border border-[#c1d4c4] bg-[#ebf1ec] py-[3px] pr-[8px] pl-[6px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-semibold text-[#2d5d33]">
    {icon}
    {children}
  </span>
);

/*
 * AgencyAuditRow — one event of the audit list (Figma 11.6.1h "result" rows 8611:3072 / 3103 / 3131): 42 tile with the kind icon, title 16/600 (+ Logged /
 * Rejected sticker), meta 13 #737373, chips (Privileged, Details / Query, +n), row-count pill, day, dark save button and arrow (a "Details" button on
 * the rejected row, which is drawn at 50% opacity). ⚠️ ASSUMPTION: the save button toggles a bookmark (aria-pressed), the arrow / Details link to the item.
 * Props: event, grid (compact card layout).
 */
const AgencyAuditRow = ({ event: ev, grid = false }) => {
  const [saved, setSaved] = useState(true);
  const Icon = KIND_ICON[ev.kind];
  const strong = ev.strong;
  return (
    <li
      className={classNames(
        'flex gap-[14px] bg-white',
        grid
          ? 'flex-col rounded-[16px] border border-[#e1eae2] p-[16px]'
          : 'flex-wrap items-center border-t border-[#e1eae2] px-[18px] py-[14px] first:border-t-0 lg:flex-nowrap lg:pr-[18px] lg:pl-[18px]'
      )}
    >
      <div
        className={classNames(
          'flex min-w-0 flex-1 items-center gap-[14px]',
          ev.dim && 'opacity-50'
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]"
        >
          <Icon className="size-[22px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
            <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {ev.title}
            </span>
            {ev.badge ? (
              <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
                {ev.badge}
              </span>
            ) : null}
          </div>
          <span className="text-[13px] leading-[16px] text-[#737373]">{ev.meta}</span>
        </div>
      </div>
      <div className={classNames('flex flex-wrap items-center gap-[6px]', ev.dim && 'opacity-50')}>
        {ev.privileged ? (
          <span className="inline-flex items-center gap-[5px] rounded-full border border-[#c8951a] bg-[#faf4e8] px-[9px] py-[4px] text-[11px] max-lg:text-[12px] leading-[13px] font-semibold text-[#1c2a21]">
            <AgencySettingsEyeIcon className="size-[13px] text-[#1c2a21]" />
            Privileged
          </span>
        ) : null}
        <Pill icon={<AgencySettingsCheckIcon className="size-[11px] text-[#387440]" />}>
          {ev.chip}
        </Pill>
        {ev.chip2 ? (
          <Pill icon={<AgencySettingsCheckIcon className="size-[11px] text-[#387440]" />}>
            {ev.chip2}
          </Pill>
        ) : null}
        <span className="rounded-full bg-[#f8f8f4] px-[8px] py-[4px] text-[11px] max-lg:text-[12px] leading-[13px] font-medium text-[#595959]">
          {ev.more}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-[14px]">
        <span
          className={classNames(
            'rounded-full px-[10px] py-[4px] text-[12.5px] max-lg:text-[12px] leading-[15px] font-bold',
            strong
              ? 'bg-[#387440] text-white'
              : 'border border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]',
            ev.dim && 'opacity-50'
          )}
        >
          {ev.rows}
        </span>
        <span
          className={classNames(
            'min-w-[35px] text-[12.5px] max-lg:text-[12px] leading-[15px] text-[#737373]',
            ev.dim && 'opacity-50'
          )}
        >
          {ev.day}
        </span>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={`${saved ? 'Unsave' : 'Save'}: ${ev.title}`}
          onClick={() => setSaved((v) => !v)}
          className={classNames(
            'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            saved
              ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white'
              : 'border-[#e1eae2] bg-white text-[#1c2a21]',
            ev.dim && 'opacity-50'
          )}
        >
          <AgencySettingsBookmarkIcon className="size-[15px]" />
        </button>
        {ev.dim ? (
          <Link
            to={ev.href}
            className="inline-flex h-[40px] items-center rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[16px] text-[16px] font-bold text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Details
          </Link>
        ) : (
          <Link
            to={ev.href}
            aria-label={`Open: ${ev.title}`}
            className="flex size-[24px] shrink-0 items-center justify-center rounded-full text-[#2d5d33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AgencySettingsArrowIcon className="size-[16px]" />
          </Link>
        )}
      </div>
    </li>
  );
};

export default AgencyAuditRow;
