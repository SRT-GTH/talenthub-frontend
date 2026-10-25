import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import AgencyButton from './AgencyButton.jsx';
import { AgencyArrowRightIcon, AgencyLinkIcon } from './agencyIcons.jsx';

const log = debug('AgencyPageCard');

/*
 * AgencyPageCard — "Your agency page" card pinned to the bottom of the rail (Figma "Recruiter view link" 8597:398710, 255 x 146):
 * mint header chip (link icon + "Your agency page"), the public URL in DM Mono 10, "Preview public view →" button.
 * The button opens the public agency page (/agency/public-page, 11.6.1i) — ⚠️ ASSUMPTION: the in-app preview, not the real gth.com URL.
 */

const AgencyPageCard = ({ session, to = '/agency/public-page', onNavigate, className }) => (
  <section
    aria-label="Your agency page"
    className={classNames(
      'flex flex-col gap-[10px] rounded-[12px] border border-solid border-[#f8f8f4] bg-white p-[11px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)]',
      className
    )}
  >
    <div className="flex items-center gap-[6px] rounded-[8px] bg-[#ebf1ec] px-[10px] py-[8px]">
      <AgencyLinkIcon className="size-[14px] shrink-0 text-[#387440]" />
      <span className="font-sans text-[13px] leading-[18px] font-medium tracking-[0.2px] text-[#387440]">
        Your agency page
      </span>
    </div>
    <p className="m-0 font-['DM_Mono',ui-monospace,monospace] text-[10px] max-lg:text-[12px] leading-[16px] tracking-[0.2px] break-words text-[#32683a]">
      {session.agency.publicUrl}
    </p>
    <AgencyButton
      size="xs"
      to={to}
      onClick={() => {
        log('preview public view');
        onNavigate?.();
      }}
      rightIcon={<AgencyArrowRightIcon className="size-[20px] text-[#387440]" />}
      className="w-full"
    >
      Preview public view
    </AgencyButton>
  </section>
);

export default AgencyPageCard;
