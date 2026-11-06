import { useId, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { REJECT_REASONS } from './data/recordsData.js';
import { RecordsIconChevdown } from './recordsIcons.jsx';

/*
 * RecordRejectDialog — "Reject this record?" (Figma 11.2.3d 8593:387851): the 528 card with a required Reason select and a "Note to <first name>"
 * input, then the red "Reject record" button and Cancel. mode="ask" reuses the card for "Ask for more information" (no reason, a required note).
 * Props: mode ('reject' | 'ask'), firstName, busy, onConfirm({ reason, note }), onCancel.
 */
const RecordRejectDialog = ({ mode = 'reject', firstName, busy, onConfirm, onCancel }) => {
  const descId = useId();
  const reasonId = useId();
  const noteId = useId();
  const [reason, setReason] = useState(REJECT_REASONS[0].id);
  const [note, setNote] = useState('');
  const ask = mode === 'ask';
  const needsNote = ask || reason === 'other';
  const title = ask ? `Ask ${firstName} for more?` : 'Reject this record?';
  const fieldClass =
    'w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[20px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-[#387440]';
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
          if (busy) return;
          onConfirm({
            reason: ask ? undefined : REJECT_REASONS.find((r) => r.id === reason)?.label,
            note: note.trim(),
          });
        }}
      >
        <h2 className="m-0 text-[26px] leading-[34px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {title}
        </h2>
        <p id={descId} className="m-0 text-[16px] leading-[24px] text-[#575755]">
          {ask
            ? `${firstName} gets your question and can send a new copy or more detail. The record stays in your queue as “Needs info”.`
            : `${firstName} sees your reason and can upload a corrected copy. The record stays off the verified list until then.`}
        </p>
        {ask ? null : (
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
                className={`${fieldClass} h-[51px] cursor-pointer appearance-none pr-[44px] font-medium`}
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
        )}
        <div className="flex w-full flex-col gap-[8px] text-left">
          <label
            htmlFor={noteId}
            className="text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
          >
            {ask ? `What do you need from ${firstName}?` : `Note to ${firstName}`}
            {needsNote ? <span className="text-[#1d7c4d]"> *</span> : null}
          </label>
          <textarea
            id={noteId}
            rows={3}
            required={needsNote}
            minLength={needsNote ? 2 : undefined}
            maxLength={600}
            value={note}
            placeholder={
              ask
                ? 'e.g. Please send the page with the head teacher’s stamp.'
                : 'Optional: what to fix'
            }
            onChange={(e) => setNote(e.target.value)}
            className={`${fieldClass} resize-y py-[14px]`}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-[8px]">
          <Button
            type="submit"
            variant={ask ? 'primary' : 'danger'}
            size="md"
            disabled={busy}
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
          >
            {busy ? 'Sending…' : ask ? 'Send question' : 'Reject record'}
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
