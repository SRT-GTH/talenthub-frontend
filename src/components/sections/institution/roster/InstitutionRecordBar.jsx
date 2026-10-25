import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { Roster20EyeIcon } from './rosterIcons.jsx';

const log = debug('InstitutionRecordBar');

/*
 * InstitutionRecordBar — the dark bar over the student record (Figma "preview bar" 8744:433489, 1329 x 72, #1c2a21, r16, p 12/16/12/20, gap 12): eye glyph 19 white · "Kofi Danso · student record"
 * 15/18 600 white over the 12/14 #bfbfbf sentence · a 196 x 36 segmented block ("Edit record" #bfbfbf, "Message Kofi" on #ffd86b) · "Back to students" (white shelf, 48 high).
 * "Edit record" has no destination drawn (logs). Props: title, text, name (first name), messageTo (route), backTo (route).
 */
const InstitutionRecordBar = ({ title, text, firstName, messageTo, backTo }) => (
  <div className="flex flex-wrap items-center gap-[12px] rounded-[16px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[20px]">
    <Roster20EyeIcon className="size-[19px] shrink-0 text-white" />
    <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-white">{title}</p>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#bfbfbf] max-lg:text-[12px]">
        {text}
      </p>
    </div>
    <div className="flex h-[36px] items-center gap-[2px] rounded-[10px] bg-[#1c2a21] p-[3px]">
      <button
        type="button"
        onClick={() => log('edit record (no destination drawn)')}
        className="inline-flex h-[30px] cursor-pointer items-center rounded-[8px] border-0 bg-transparent px-[12px] font-sans text-[13px] leading-[16px] font-semibold text-[#bfbfbf] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
      >
        Edit record
      </button>
      <Link
        to={messageTo}
        className="inline-flex h-[30px] items-center rounded-[8px] bg-[#ffd86b] px-[12px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
      >
        Message {firstName}
      </Link>
    </div>
    <Link
      to={backTo}
      className="inline-flex h-[48px] items-center rounded-[10px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]"
    >
      Back to students
    </Link>
  </div>
);

export default InstitutionRecordBar;
