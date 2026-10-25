import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  DataRequestIconArrowUpRight,
  DataRequestIconBookmark,
  DataRequestIconChartBar,
  DataRequestIconCheck,
  DataRequestIconEye,
  DataRequestIconLock,
  DataRequestIconMap,
} from './dataRequestIcons.jsx';
import { REQUEST_STATUS_LABEL } from './data/dataRequestsData.js';

const log = debug('DataRequestRow');

/*
 * DataRequestRow — one request of the list (Figma 11.4.3a, "result" rows 8597:58 / 89 / 117): 42px data icon tile · title + status sticker + detail
 * line · the review note pill (eye) · tag chips + "+n" · the action pill (Open data · Pending · View reason) · bookmark · arrow. A rejected row is
 * drawn at 50 % with a full-strength "Appeal" button instead of the arrow. The title is the row's link (stretched over the row); the other controls
 * sit above it. ⚠️ ASSUMPTION: the bookmark pins the request in the list (Figma draws it without a behaviour): aria-pressed, local state.
 * Props: request (see dataRequestsData.REQUESTS), grid (card layout for the grid view).
 */

const ICONS = {
  chart: DataRequestIconChartBar,
  map: DataRequestIconMap,
  lock: DataRequestIconLock,
};

const DataRequestRow = ({ request, grid = false }) => {
  const [saved, setSaved] = useState(false);
  const Icon = ICONS[request.icon] ?? DataRequestIconMap;
  const to = `/agency/data-requests/${request.id}`;
  const rejected = request.status === 'rejected';
  const approved = request.status === 'approved';
  return (
    <li
      className={classNames(
        'relative flex gap-[14px] px-[18px] py-[14px] pr-[20px]',
        grid
          ? 'flex-col rounded-[16px] border border-solid border-[#e1eae2] bg-white p-[18px]'
          : 'flex-wrap items-center md:flex-nowrap'
      )}
    >
      <div
        className={classNames(
          'flex min-w-0 flex-1 items-center gap-[14px]',
          rejected && 'opacity-50',
          grid && 'w-full flex-none'
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]"
        >
          <Icon className="size-[24px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex min-w-0 flex-wrap items-center gap-[8px]">
            <Link
              to={to}
              onClick={() => log('open', request.id)}
              className="font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {request.title}
            </Link>
            {request.status !== 'pending' ? (
              <span
                className={classNames(
                  'rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans leading-[13px] font-bold text-[#1f4a2b]',
                  rejected ? 'text-[11.5px] max-lg:text-[12px]' : 'text-[11px] max-lg:text-[12px]'
                )}
              >
                {REQUEST_STATUS_LABEL[request.status]}
              </span>
            ) : null}
          </div>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373]">
            {request.detail}
          </p>
        </div>
      </div>
      <div
        className={classNames(
          'relative z-[1] flex flex-wrap items-center gap-[6px]',
          rejected && 'opacity-50'
        )}
      >
        {request.note ? (
          <span className="inline-flex items-center gap-[5px] rounded-full border border-solid border-[#c8951a] bg-[#faf4e8] px-[9px] py-[4px] font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-semibold text-[#1c2a21]">
            <DataRequestIconEye className="size-[13px]" />
            {request.note.label}
          </span>
        ) : null}
        {request.chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] py-[3px] pr-[8px] pl-[6px] font-sans text-[11.5px] max-lg:text-[12px] leading-[14px] font-semibold text-[#2d5d33]"
          >
            <DataRequestIconCheck className="size-[11px]" />
            {chip}
          </span>
        ))}
        {request.more ? (
          <span className="rounded-full bg-[#f8f8f4] px-[8px] py-[4px] font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-medium text-[#595959]">
            +{request.more}
          </span>
        ) : null}
      </div>
      <div className="relative z-[1] flex shrink-0 items-center gap-[14px]">
        {approved ? (
          <Link
            to={`${to}?view=dataset`}
            className="rounded-full border border-solid border-[#1c2a21]/12 bg-[#387440] px-[10px] py-[4px] font-sans text-[12.5px] leading-[15px] font-bold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {request.action}
          </Link>
        ) : (
          <span
            className={classNames(
              'rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12.5px] leading-[15px] font-bold text-[#2d5d33]',
              rejected && 'opacity-50'
            )}
          >
            {request.action}
          </span>
        )}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={`${saved ? 'Unpin' : 'Pin'} ${request.title}`}
          onClick={() => setSaved((v) => !v)}
          className={classNames(
            'flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-solid border-[#1c2a21]/12 bg-[#1c2a21] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            rejected && 'opacity-50',
            saved && 'bg-[#387440]'
          )}
        >
          <DataRequestIconBookmark className="size-[15px]" />
        </button>
        {rejected ? (
          <Link
            to={`${to}?modal=appeal`}
            className="inline-flex h-[40px] items-center rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Appeal
          </Link>
        ) : (
          <DataRequestIconArrowUpRight className="size-[16px] text-[#2d5d33]" aria-hidden="true" />
        )}
      </div>
    </li>
  );
};

export default DataRequestRow;
