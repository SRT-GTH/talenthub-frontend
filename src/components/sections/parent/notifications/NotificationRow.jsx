import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import StatusPill from '../../../ui/StatusPill.jsx';

const log = debug('NotificationRow');

/*
 * NotificationRow — one row of the Notifications page (Figma PN-04 10043:1351 "row · …" 10043:1749): 14 gap, 12px above and below, a hairline #e7e7e7 under it (not under the last row of a card),
 * icon tile 40 (#ebf1ec, r12, 20px icon), title 14/600 over a 12/400 #575755 line (3 gap), and the type chip on the right (Milestone / Needs you / Ward activity / From GTH).
 * Props: row (see data/notificationsData.js), isLast.
 * A row with a `to` is a router <Link>; one without (the weekly summary, which lives on WhatsApp) is plain.
 */
const NotificationRow = ({ row, isLast = false }) => {
  const body = (
    <>
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
        <img src={row.icon} alt="" className="size-[20px]" />
      </span>
      <span className="flex min-w-[160px] flex-1 flex-col gap-[3px]">
        <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{row.title}</span>
        <span className="text-[12px] leading-[14px] text-[#575755]">{row.sub}</span>
      </span>
      <StatusPill tone={row.chipTone}>{row.chip}</StatusPill>
    </>
  );
  const cls = `flex flex-wrap items-center gap-x-[14px] gap-y-[8px] py-[12px] text-inherit no-underline ${
    isLast ? '' : 'border-0 border-b border-solid border-[#e7e7e7]'
  }`;
  return row.to ? (
    <Link
      to={row.to}
      onClick={() => log('open row', row.id)}
      className={`${cls} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]`}
    >
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
};

export default NotificationRow;
