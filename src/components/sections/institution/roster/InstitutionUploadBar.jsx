import { Roster20UploadIcon } from './rosterIcons.jsx';

/*
 * InstitutionUploadBar — the green dashed upload strip of the Add-one-student and Upload-CSV dialogs (Figma "Upload" 8590:384467, 740 x 94, #ebf1ec, 1px #387440 dashed, r16, p 18, gap 16):
 * 56 white tile (r16, 1px ink at 10 %, soft shadow) with the upload glyph (#387440, 26) · title 15/18 600 + hint 13/16 #595959 · green button (r10, 48 high, 16/24 700).
 * Props: title, hint, action (button label), onAction, children (e.g. the hidden file input), actionRef.
 */
const InstitutionUploadBar = ({ title, hint, action, onAction, actionRef, children }) => (
  <div className="flex flex-wrap items-center gap-[16px] rounded-[16px] border border-dashed border-[#387440] bg-[#ebf1ec] p-[18px]">
    <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] border border-solid border-[#1c2a21]/10 bg-white text-[#387440] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
      <Roster20UploadIcon className="size-[26px]" />
    </span>
    <div className="flex min-w-[180px] flex-1 flex-col gap-[3px]">
      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {title}
      </span>
      <span className="font-sans text-[13px] leading-[16px] text-[#595959]">{hint}</span>
    </div>
    {children}
    <button
      ref={actionRef}
      type="button"
      onClick={onAction}
      className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730]"
    >
      {action}
    </button>
  </div>
);

export default InstitutionUploadBar;
