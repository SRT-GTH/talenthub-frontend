import { Link } from 'react-router-dom';
import AgencyButton from '../../agency/AgencyButton.jsx';

/*
 * AdminAccountBar — the dark "preview bar" on top of the account detail (Figma 7.1.2a "preview bar" 8623:~, 1329 x 72, #1c2a21, r16, p 12/16/12/20, gap 12): the 19px
 * eye slot (drawn ink on ink: only the slot is kept) · title 15/600 white + sub 12 #bfbfbf · the "view as" pair (Message user 13/600 #bfbfbf, "Admin actions" on
 * #ffd86b) · white "Back to accounts" button.
 * Props: bar { title, sub }, onMessage, onActions, backTo.
 */

const AdminAccountBar = ({ bar, onMessage, onActions, backTo = '/admin/accounts' }) => (
  <section
    aria-label="Account"
    className="flex flex-wrap items-center gap-[12px] rounded-[16px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[20px] max-md:gap-[10px] max-md:py-[10px] max-md:pr-[12px] max-md:pl-[14px]"
  >
    <span aria-hidden="true" className="h-[19px] w-[19px] shrink-0 max-md:hidden" />
    <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-white">
        {bar.title}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#bfbfbf]">{bar.sub}</p>
    </div>
    <div className="flex shrink-0 items-center gap-[2px] rounded-[10px] bg-[#1c2a21] p-[3px]">
      <button
        type="button"
        onClick={onMessage}
        className="cursor-pointer rounded-[8px] border-0 bg-transparent px-[12px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#bfbfbf] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
      >
        Message user
      </button>
      <button
        type="button"
        onClick={onActions}
        className="cursor-pointer rounded-[8px] border-0 bg-[#ffd86b] px-[12px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
      >
        Admin actions
      </button>
    </div>
    <Link to={backTo} className="no-underline">
      <AgencyButton size="md" tabIndex={-1}>
        Back to accounts
      </AgencyButton>
    </Link>
  </section>
);

export default AdminAccountBar;
