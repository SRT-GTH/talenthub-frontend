import lockIconAmber from '../../../../assets/recruiter/community/network-icon-lock-amber.svg';
import { NETWORK_MINOR } from './recruiterCircleData.js';

/*
 * NetworkHiddenNotice — Figma `Banner · Hidden from recruiters` (RC-NW10, 10194:36503): #faf4e8 r10 p16 gap 12, a 20px amber lock,
 * "Hidden from recruiters" 14/600 and the 12/20 line. Figma floats it (@343,150, 1100px) OVER the switch row, hiding "My network":
 * ⚠️ ASSUMPTION: it is drawn in flow above the switch instead so no control is covered. Props: notice ({ title, body }), className.
 */
const NetworkHiddenNotice = ({ notice = NETWORK_MINOR.notice, className }) => (
  <aside
    role="note"
    aria-label={notice.title}
    className={`flex max-w-[1100px] gap-[12px] rounded-[10px] bg-[#faf4e8] p-[16px] ${className ?? ''}`}
  >
    <img src={lockIconAmber} alt="" draggable="false" className="mt-[2px] size-[20px] shrink-0" />
    <div className="flex min-w-0 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[14px] font-semibold leading-[24px] tracking-[0.1px] text-[#111]">
        {notice.title}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755] max-lg:text-[13px]">
        {notice.body}
      </p>
    </div>
  </aside>
);

export default NetworkHiddenNotice;
