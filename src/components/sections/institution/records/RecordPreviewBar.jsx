import InstitutionButton from '../InstitutionButton.jsx';
import { RecordsIconEye19 } from './recordsIcons.jsx';

/*
 * RecordPreviewBar — the dark bar over the record (Figma "preview bar" 8593:584, 1329x72): eye, "<student> · <record>" 15/600 white, the sentence 12 #bfbfbf, the 2-segment control
 * (Reject · Approve record on #ffd86b) and "Back to records". Props: title, sentence, onReject, onApprove.
 */
const RecordPreviewBar = ({ title, sentence, onReject, onApprove }) => (
  <div className="flex flex-wrap items-center gap-[12px] rounded-[16px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[20px] font-sans">
    <RecordsIconEye19 className="size-[19px] shrink-0 text-[#1c2a21]" />
    <div className="flex min-w-[220px] flex-1 flex-col gap-[2px]">
      <p className="m-0 text-[15px] leading-[18px] font-semibold text-white">{title}</p>
      <p className="m-0 text-[12px] leading-[14px] text-[#bfbfbf]">{sentence}</p>
    </div>
    <div className="flex gap-[2px] rounded-[10px] bg-[#1c2a21] p-[3px]">
      <button
        type="button"
        onClick={onReject}
        className="cursor-pointer rounded-[8px] border-0 bg-transparent px-[12px] py-[7px] text-[13px] leading-[16px] font-semibold text-[#bfbfbf] hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffd86b]"
      >
        Reject
      </button>
      <button
        type="button"
        onClick={onApprove}
        className="cursor-pointer rounded-[8px] border-0 bg-[#ffd86b] px-[12px] py-[7px] text-[13px] leading-[16px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-white"
      >
        Approve record
      </button>
    </div>
    <InstitutionButton
      to="/institution/records"
      size="md"
      className="!h-[48px] !rounded-[10px] !px-[18px] !text-[16px] !font-bold"
    >
      Back to records
    </InstitutionButton>
  </div>
);

export default RecordPreviewBar;
