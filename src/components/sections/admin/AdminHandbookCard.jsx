import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import AgencyButton from '../agency/AgencyButton.jsx';
import { AgencyArrowRightIcon } from '../agency/agencyIcons.jsx';
import { AdminLinkChainIcon } from './adminIcons.jsx';

const log = debug('AdminHandbookCard');

/*
 * AdminHandbookCard — "Staff handbook" card pinned to the bottom of the rail (Figma 255 x 146, the agency "page card"): mint header
 * chip (link icon + "Staff handbook"), the internal URL in DM Mono 10, "Open handbook →" button. ⚠️ ASSUMPTION: the handbook is an
 * internal site this frontend does not host, so the button is inert (logs only).
 */

const AdminHandbookCard = ({ session, onNavigate, className }) => (
  <section
    aria-label="Staff handbook"
    className={classNames(
      'flex flex-col gap-[10px] rounded-[12px] border border-solid border-[#f8f8f4] bg-white p-[11px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)]',
      className
    )}
  >
    <div className="flex items-center gap-[6px] rounded-[8px] bg-[#ebf1ec] px-[10px] py-[8px]">
      <AdminLinkChainIcon className="size-[14px] shrink-0 text-[#387440]" />
      <span className="font-sans text-[13px] leading-[18px] font-medium tracking-[0.2px] text-[#387440]">
        Staff handbook
      </span>
    </div>
    <p className="m-0 font-['DM_Mono',ui-monospace,monospace] text-[10px] leading-[16px] tracking-[0.2px] break-words text-[#32683a] max-lg:text-[12px]">
      {session.staff.handbook}
    </p>
    <AgencyButton
      size="xs"
      onClick={() => {
        log('open handbook (internal site, not hosted here)', session.staff.handbook);
        onNavigate?.();
      }}
      rightIcon={<AgencyArrowRightIcon className="size-[20px] text-[#387440]" />}
      className="w-full"
    >
      Open handbook
    </AgencyButton>
  </section>
);

export default AdminHandbookCard;
