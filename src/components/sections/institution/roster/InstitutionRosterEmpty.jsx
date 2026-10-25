import { debug } from '../../../../utils/debug.js';
import { Roster20ArrowRightIcon, Roster20FilterIcon } from './rosterIcons.jsx';
import { downloadTemplate } from './rosterTemplate.js';

const log = debug('InstitutionRosterEmpty');

/*
 * InstitutionRosterEmpty — the empty roster of a new institution (Figma 11.2.2l "T8 · Empty state" 8744:435088 + "actions" 8744:435100, inside "empty wrap" 1329 x 458 p 56/0/64):
 * 48 round #ebf1ec icon (filter) · "No students on your roster yet" 17/20 600 · 14/20 #595959 text (max 360) · "Download CSV template" shelf button (48 high, r14)
 * · green "Upload a class list →" (44 high, r10) + light "Add one student" (52 high, r14, #e1eae2).
 * "Download CSV template" saves a real CSV (see rosterTemplate.js).
 * Props: onUpload, onAdd.
 */

const InstitutionRosterEmpty = ({ onUpload, onAdd }) => (
  <section
    aria-labelledby="roster-empty"
    className="flex flex-col items-center gap-[16px] pt-[56px] pb-[64px]"
  >
    <div className="flex w-[min(420px,100%)] flex-col items-center gap-[10px] px-[24px] py-[32px] text-center">
      <span className="grid size-[48px] place-items-center rounded-full bg-[#ebf1ec] text-[#387440]">
        <Roster20FilterIcon className="size-[24px]" />
      </span>
      <h2
        id="roster-empty"
        className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]"
      >
        No students on your roster yet
      </h2>
      <p className="m-0 max-w-[360px] font-sans text-[14px] leading-[20px] text-[#595959]">
        Upload a class list from your school system, or add students one at a time. Every Ghana Card
        is checked before anyone is added.
      </p>
      <button
        type="button"
        onClick={() => {
          log('download template');
          downloadTemplate();
        }}
        className="mt-[10px] inline-flex h-[48px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[22px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]"
      >
        Download CSV template
      </button>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-[12px]">
      <button
        type="button"
        onClick={onUpload}
        className="inline-flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730]"
      >
        Upload a class list
        <Roster20ArrowRightIcon className="size-[20px]" />
      </button>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(15,15,10,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        Add one student
      </button>
    </div>
  </section>
);

export default InstitutionRosterEmpty;
