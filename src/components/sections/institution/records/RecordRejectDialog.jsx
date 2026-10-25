import { useId, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { REJECT_NOTE_SAMPLE, REJECT_REASONS } from './data/recordsData.js';
import { RecordsIconChevdown } from './recordsIcons.jsx';

/*
 * RecordRejectDialog — "Reject this record?" (Figma 11.2.3d 8593:387851): the same 528 card as the approve dialog with a required Reason select
 * ("Grades don’t match our mark sheet", chevron) and a "Note to <first name>" input, then the red "Reject record" button (44 high, r10) and Cancel.
 * ⚠️ ASSUMPTION: the note starts with the drawn sample text; only the drawn reason exists (no other reasons are drawn).
 * Props: student (first name for the copy), pronoun ("she"/"he"), possessive ("her"/"his"), onConfirm({ reason, note }), onCancel.
 */
const RecordRejectDialog = ({ firstName, pronounPossessive, onConfirm, onCancel }) => {
  const descId = useId();
  const reasonId = useId();
  const noteId = useId();
  const [reason, setReason] = useState(REJECT_REASONS[0].id);
  const [note, setNote] = useState(REJECT_NOTE_SAMPLE);
  const title = 'Reject this record?';
  return (
    <AgencyDialogShell
      title={title}
      onClose={onCancel}
      scrim="bg-[#1c2a21]/70"
      role="alertdialog"
      describedBy={descId}
    >
      <form
        className="mx-auto flex max-w-[528px] flex-col items-center gap-[20px] rounded-[24px] bg-white px-[clamp(20px,2.8vw,48px)] py-[clamp(32px,3.7vw,64px)] text-center font-sans shadow-[0_4px_0_rgba(0,0,0,0),0_40px_100px_rgba(0,0,0,0.25)]"
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm({ reason: REJECT_REASONS.find((r) => r.id === reason)?.label, note });
        }}
      >
        <h2 className="m-0 text-[26px] leading-[34px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {title}
        </h2>
        <p id={descId} className="m-0 text-[16px] leading-[24px] text-[#575755]">
          {firstName} sees your reason and can upload a corrected copy. The record stays off{' '}
          {pronounPossessive} verified list until then.
        </p>
        <div className="flex w-full flex-col gap-[8px] text-left">
          <label
            htmlFor={reasonId}
            className="text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
          >
            Reason<span className="text-[#1d7c4d]"> *</span>
          </label>
          <div className="relative">
            <select
              id={reasonId}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-[51px] w-full cursor-pointer appearance-none rounded-[10px] border border-solid border-[#cccccc] bg-white pr-[44px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-[#387440]"
            >
              {REJECT_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <RecordsIconChevdown className="pointer-events-none absolute top-[16px] right-[16px] size-[20px] text-[#1c2a21]" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[8px] text-left">
          <label
            htmlFor={noteId}
            className="text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
          >
            Note to {firstName}
          </label>
          <input
            id={noteId}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-[51px] w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[20px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] shadow-[0_1px_2px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-[#387440]"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-[8px]">
          <Button
            type="submit"
            variant="danger"
            size="md"
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
          >
            Reject record
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            data-autofocus=""
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </AgencyDialogShell>
  );
};

export default RecordRejectDialog;
