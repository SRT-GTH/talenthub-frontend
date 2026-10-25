import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import {
  InstitutionSettingsArrowIcon,
  InstitutionSettingsCheckIcon,
  InstitutionSettingsDownloadIcon,
  InstitutionSettingsEyeIcon,
  InstitutionSettingsFilterIcon,
  InstitutionSettingsLockIcon,
} from './institutionSettingsIcons.jsx';

const KIND_ICON = {
  download: InstitutionSettingsDownloadIcon,
  change: InstitutionSettingsFilterIcon,
  request: InstitutionSettingsLockIcon,
};

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-[4px] rounded-full border border-[#c1d4c4] bg-[#ebf1ec] py-[3px] pr-[8px] pl-[6px] text-[11.5px] leading-[14px] font-semibold text-[#2d5d33] max-lg:text-[12px]">
    <InstitutionSettingsCheckIcon className="size-[11px] text-[#387440]" />
    {children}
  </span>
);

/*
 * InstitutionAuditRow — one event of the audit list (Figma 11.6.1g "result" rows 8746:1225 / 1257 / 1286): 42 tile with the kind icon, title 16/600
 * (+ Logged / Rejected sticker), meta 13 #737373, chips (gold "Two approvals" / "One approver" with an eye, then green check chips), the count pill, the
 * day and an arrow (a "Details" button on the rejected row, which is drawn at 50% opacity). ⚠️ ASSUMPTION: the arrow and Details link to the item.
 * Props: event, grid (compact card layout).
 */
const InstitutionAuditRow = ({ event: ev, grid = false }) => {
  const Icon = KIND_ICON[ev.kind];
  return (
    <li
      className={classNames(
        'flex gap-[14px] bg-white',
        grid
          ? 'flex-col rounded-[16px] border border-[#e1eae2] p-[16px]'
          : 'flex-wrap items-center border-t border-[#e1eae2] px-[18px] py-[14px] first:border-t-0 lg:flex-nowrap'
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
              <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[11.5px] leading-[14px] font-bold text-[#1f4a2b] max-lg:text-[12px]">
                {ev.badge}
              </span>
            ) : null}
          </div>
          <span className="text-[13px] leading-[16px] text-[#737373]">{ev.meta}</span>
        </div>
      </div>
      <div className={classNames('flex flex-wrap items-center gap-[6px]', ev.dim && 'opacity-50')}>
        {ev.flag ? (
          <span className="inline-flex items-center gap-[5px] rounded-full border border-[#c8951a] bg-[#faf4e8] px-[9px] py-[4px] text-[11px] leading-[13px] font-semibold text-[#1c2a21] max-lg:text-[12px]">
            <InstitutionSettingsEyeIcon className="size-[13px] text-[#1c2a21]" />
            {ev.flag}
          </span>
        ) : null}
        <Pill>{ev.chip}</Pill>
        {ev.chip2 ? <Pill>{ev.chip2}</Pill> : null}
      </div>
      <div className="flex shrink-0 items-center gap-[14px]">
        <span
          className={classNames(
            'rounded-full px-[10px] py-[4px] text-[12.5px] leading-[15px] font-bold max-lg:text-[12px]',
            ev.strong
              ? 'bg-[#387440] text-white'
              : 'border border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]',
            ev.dim && 'opacity-50'
          )}
        >
          {ev.rows}
        </span>
        <span
          className={classNames(
            'min-w-[35px] text-[12.5px] leading-[15px] text-[#737373] max-lg:text-[12px]',
            ev.dim && 'opacity-50'
          )}
        >
          {ev.day}
        </span>
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
            <InstitutionSettingsArrowIcon className="size-[16px]" />
          </Link>
        )}
      </div>
    </li>
  );
};

export default InstitutionAuditRow;
