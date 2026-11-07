import { classNames } from '../../../utils/classNames.js';
import { FOCUS_RING, HelpChip } from './helpUi.jsx';

/*
 * Your support requests (useMyRequests: GET /api/support/cases) for the Help page and the Contact support aside. Each row opens
 * ?help=request&ref=SUP-… (HelpRequestView). Props: requests (useMyRequests()), onOpen(ref), limit, chipTone ('status' ink pill, default; 'soft' green tint — add-only).
 */

const agoOf = (at) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(at).getTime()) / 60000));
  if (m < 60) return m <= 1 ? 'just now' : `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
};

const HelpRequestsList = ({ requests, onOpen, limit = 5, chipTone = 'status' }) => {
  if (requests.loading) {
    return <p className="m-0 font-sans text-[13px] text-[#595959]">Loading your requests…</p>;
  }
  if (requests.error) {
    return (
      <p className="m-0 font-sans text-[13px] text-[#595959]">
        We couldn’t load your requests.{' '}
        <button
          type="button"
          onClick={requests.reload}
          className={classNames(
            'cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline',
            FOCUS_RING
          )}
        >
          Try again
        </button>
      </p>
    );
  }
  if (!requests.rows.length) {
    return (
      <p className="m-0 font-sans text-[13px] text-[#595959]">
        No requests yet. When you contact support, you can follow the reply here.
      </p>
    );
  }
  return (
    <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
      {requests.rows.slice(0, limit).map((r) => (
        <li key={r.ref}>
          <button
            type="button"
            onClick={() => onOpen(r.ref)}
            className={classNames(
              'flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 bg-transparent p-[6px] text-left hover:bg-[#f8f8f4]',
              FOCUS_RING
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[1.2]">
              <span className="truncate font-sans text-[14px] font-semibold text-[#1c2a21]">
                {r.subject}
              </span>
              <span className="font-sans text-[12.5px] text-[#595959]">
                {r.ref} · {agoOf(r.updatedAt)}
                {r.lastFromStaff && !['resolved', 'closed'].includes(r.status)
                  ? ' · new reply'
                  : ''}
              </span>
            </span>
            <HelpChip
              tone={chipTone === 'status' ? 'status' : undefined}
              soft={chipTone === 'soft'}
            >
              {r.statusLabel}
            </HelpChip>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default HelpRequestsList;
