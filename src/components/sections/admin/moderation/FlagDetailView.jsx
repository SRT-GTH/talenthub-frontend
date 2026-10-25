import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import bulbArt from '../../../../assets/admin/flag-bulb-art.svg';
import { docId, humanize, shortDate, timeAgo } from '../../../../services/admin.api.js';
import { AdminArrowRightIcon, AdminMagnifierIcon, AdminRefreshIcon, AdminWarningIcon } from '../adminIcons.jsx';
import { flagTitle, isSystemFlag, statusLabel } from './adminModerationModel.js';

/*
 * FlagDetailView — /admin/moderation/flags/:id (Figma 7.2.2a): title + sub line · left card with the other flags of the same status (search filters them) ·
 * right card with the flag header, the report card (reason, reporter type, content type and id, escalation / appeal state) and the decision bar.
 * The moderation API returns no flagged content, author, internal notes or claim state, so the thread shows the report only and says what is missing.
 * Props: flag (flag doc), siblings (flags of the same status), onDecide(id) — 'dismiss' | 'remove' | 'escalate' | 'warn' | 'restore', onRefresh(), role.
 */

const Avatar = () => (
  <span aria-hidden="true" className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] text-[#387440]">
    <AdminWarningIcon className="size-[20px]" />
  </span>
);

const Line = ({ label, value }) =>
  value ? (
    <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
      <span className="text-[#999999]">{label}: </span>
      {value}
    </p>
  ) : null;

const FlagDetailView = ({ flag, siblings = [], onDecide, onRefresh, role }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const id = docId(flag);
  const open = ['open', 'under_review', 'escalated'].includes(flag.status);
  const removed = flag.status === 'approved' && flag.isHidden;
  const list = siblings.filter((f) =>
    !query.trim() ? true : `${flagTitle(f)} ${f.resourceType} ${f.flagReason}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const decisions = open
    ? [
        { id: 'dismiss', label: 'Dismiss' },
        { id: 'warn', label: 'Warn author' },
        ...(role === 'moderator' ? [{ id: 'escalate', label: 'Escalate' }] : []),
      ]
    : [];

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#1c2a21]">{flagTitle(flag)}</h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">
          {humanize(flag.resourceType)} · {statusLabel(flag.status)} · reported {timeAgo(flag.createdAt)}
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-[10px] lg:grid-cols-[minmax(300px,371fr)_minmax(0,948fr)]">
        <aside aria-label="Flags" className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e5e5e5] bg-white px-[22px] py-[28px]">
          <label className="flex h-[45px] items-center gap-[10px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px]">
            <AdminMagnifierIcon className="size-[16px] shrink-0 text-[#999999]" />
            <input
              type="search"
              aria-label="Search flags"
              placeholder="Search these flags"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[13px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
            />
          </label>
          <div className="flex items-center gap-[16px]">
            <span className="inline-flex h-[33px] items-center gap-[5px] rounded-full border border-solid border-[#e1eae2] bg-[#387440] px-[14px] font-sans text-[14.6px] leading-[25px] font-semibold text-white">
              {statusLabel(flag.status)} <span className="font-medium">({siblings.length})</span>
            </span>
            <button
              type="button"
              aria-label="Refresh"
              onClick={onRefresh}
              className="ml-auto grid size-[20px] cursor-pointer place-items-center border-0 bg-transparent text-[#387440]"
            >
              <AdminRefreshIcon className="size-[20px]" />
            </button>
          </div>
          <ul className="m-0 flex list-none flex-col gap-[7px] p-0">
            {list.map((f, i) => (
              <li key={docId(f)} className={classNames(i > 0 && 'border-t border-solid border-[#f2f2f2] pt-[7px]')}>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/moderation/flags/${docId(f)}`)}
                  aria-current={docId(f) === id ? 'true' : undefined}
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid bg-white px-[10px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    docId(f) === id ? 'border-[#e1eae2] shadow-[0_1px_2px_rgba(15,15,10,0.05)]' : 'border-transparent',
                  )}
                >
                  <Avatar />
                  <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
                    <span className="flex items-center justify-between gap-[10px]">
                      <span className="truncate font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21]">{humanize(f.flagReason)}</span>
                      <span className="shrink-0 font-sans text-[13px] leading-[16px] text-[#737373]">{timeAgo(f.createdAt)}</span>
                    </span>
                    <span className="font-sans text-[13.5px] leading-[17px] text-[#737373]">{humanize(f.resourceType)}</span>
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 ? <li className="font-sans text-[13px] text-[#737373]">No flags match.</li> : null}
          </ul>
        </aside>

        <section aria-label="Report" className="relative flex min-h-[520px] flex-col rounded-[24px] border border-solid border-[#e5e5e5] bg-white px-[22px] pt-[18px] pb-[18px]">
          <div className="flex items-center gap-[16px] rounded-full border border-solid border-[#e5e5e5] px-[12px] py-[8px]">
            <Avatar />
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <p className="m-0 font-sans text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                {humanize(flag.resourceType)} {String(flag.resourceId || '').slice(-8)}
              </p>
              <p className="m-0 font-sans text-[14px] leading-[17px] text-[#737373]">
                {isSystemFlag(flag) ? 'System flag' : `Reported by a ${humanize(flag.flaggedByType || 'user').toLowerCase()} · identity protected`}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[15px] pt-[32px] pb-[24px]">
            <span className="mx-auto inline-flex rounded-full bg-[#e5e5e5]/50 px-[14px] py-[6px] font-sans text-[13px] leading-[16px] text-[#595959]">
              {shortDate(flag.createdAt)}
            </span>
            <div className="relative ml-auto flex w-[380px] max-w-full flex-col gap-[10px] rounded-[10px] border border-solid border-[#e1eae2] bg-[linear-gradient(135deg,#ffffff,#f3f8f4)] px-[18px] pt-[24px] pb-[18px]">
              <img src={bulbArt} alt="" draggable="false" className="pointer-events-none absolute -top-[18px] -right-[28px] size-[73px]" />
              <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#387440]">REPORT</p>
              <p className="m-0 font-sans text-[16px] leading-[19px] font-medium text-[#1c2a21]">{humanize(flag.flagReason)}</p>
              <Line label="Content" value={`${humanize(flag.resourceType)} · ${flag.resourceId}`} />
              <Line label="Field" value={flag.fieldKey || flag.section} />
              <Line label="Hidden" value={flag.isHidden ? 'Yes' : 'No'} />
              <Line label="Escalation" value={flag.escalationLevel ? `Level ${flag.escalationLevel} · ${humanize(flag.escalationSeverity)} · ${flag.escalationReason || ''}` : null} />
              <Line label="Appeal" value={flag.appealStatus ? `${humanize(flag.appealStatus)}${flag.appealReason ? ` · ${flag.appealReason}` : ''}` : null} />
              <Line label="Decision" value={flag.resolutionAction ? `${humanize(flag.resolutionAction)}${flag.resolutionReason ? ` · ${flag.resolutionReason}` : ''}` : null} />
            </div>
            <div className="ml-auto flex w-[448px] max-w-full flex-col gap-[2px] rounded-[12px] bg-[#e5e5e5]/50 px-[16px] py-[12px]">
              <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
                The moderation API doesn’t return the flagged content, its author or notes yet, so open the {humanize(flag.resourceType).toLowerCase()} to read it.
              </p>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-end gap-[12px] pt-[16px]">
              {decisions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onDecide(d.id)}
                  className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {d.label}
                </button>
              ))}
              {open ? (
                <button
                  type="button"
                  onClick={() => onDecide('remove')}
                  className="inline-flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  Remove content
                  <AdminArrowRightIcon className="size-[20px]" />
                </button>
              ) : removed && (role === 'senior' || role === 'super') ? (
                <button
                  type="button"
                  onClick={() => onDecide('restore')}
                  className="inline-flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white shadow-[0_4px_0_#2a5730]"
                >
                  Restore content
                  <AdminArrowRightIcon className="size-[20px]" />
                </button>
              ) : (
                <span className="font-sans text-[14px] text-[#737373]">This flag is closed.</span>
              )}
            </div>
          </div>
        </section>
      </div>
      <Link to="/admin/moderation" className="sr-only">
        Back to the flag queue
      </Link>
    </div>
  );
};

export default FlagDetailView;
