import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import TextInput from '../../../ui/form/TextInput.jsx';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import { pronounsOf } from './rosterPronouns.js';
import { rosterActions } from './rosterStore.js';
import { Roster20FileCheckIcon } from './rosterIcons.jsx';

const log = debug('InstitutionTransferDialog');

/*
 * InstitutionTransferDialog — "Transfer Kofi Danso to another school?" (Figma 11.2.2f 8590:386599, ?modal=transfer&student=<id>): 620 wide, r28. Plain chip "Transfer out", title (second word
 * group green), text, preview card (#f8f8f4, 1px #e7e7e7, r16: 40 tile with file-check, name 15/18 600, "Form 3 · Business · on your roster since …"), "WHAT HAPPENS"
 * (11/13 700, tracking 1.2) with three red-dot lines 14/17 500, and Cancel + "Send transfer request".
 * The receiving school is typed in (its name on GTH, or any school). Send → POST /api/institution/students/:id/transfer {to, note} → the row shows
 * "Transfer requested · <school>" until the move is settled.
 * Props: student, onClose.
 */

const InstitutionTransferDialog = ({ student, onClose }) => {
  const p = pronounsOf(student);
  const first = student.name.split(' ')[0];
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const school = to.trim() || 'The new school';
  const send = async () => {
    if (busy) return;
    if (to.trim().length < 3) {
      setError('Enter the name of the school the student is moving to.');
      return;
    }
    setBusy(true);
    const out = await rosterActions.transferOut(student.id, to.trim(), note.trim() || undefined);
    setBusy(false);
    if (!out.ok) {
      setError(out.message);
      return;
    }
    log('transfer requested', student.id);
    rosterActions.toast(
      `Transfer request recorded for ${student.name} to ${out.transfer?.to || to.trim()}.`
    );
    onClose();
  };
  const effects = [
    `${school} gets a transfer request`,
    `Your verified records move with ${p.obj}`,
    `${first} stays on your roster until the move is settled`,
  ];
  return (
    <InstitutionDialogShell
      label={`Transfer ${student.name} to another school?`}
      onClose={onClose}
      size="medium"
    >
      <InstitutionDialogHeader
        chip="Transfer out"
        tone="plain"
        title={[`Transfer ${student.name} to another `, 'school?']}
        text={`The new school accepts the transfer before ${p.subj.toLowerCase()} moves.`}
      />
      <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
        <span className="grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <Roster20FileCheckIcon className="size-[20px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {student.name}
          </span>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
            {[
              student.form === 'graduates' ? 'Graduate' : `Form ${student.form}`,
              student.programme,
              student.pill,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <TextInput
          label="Moving to"
          required
          placeholder="e.g. Tamale SHS"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setError('');
          }}
          error={error || undefined}
          data-autofocus=""
        />
        <TextInput
          label={
            <>
              Note{' '}
              <span className="ml-[6px] text-[12px] leading-[18px] font-normal text-[#595959]">
                Optional
              </span>
            </>
          }
          placeholder="e.g. Family moved to Tamale"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-[16px]">
        <h3 className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959]">
          WHAT HAPPENS
        </h3>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {effects.map((t) => (
            <li
              key={t}
              className="flex items-center gap-[8px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
            >
              <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-[#c0392b]" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <InstitutionDialogActions
        cancelLabel="Cancel"
        onCancel={onClose}
        primaryLabel={busy ? 'Sending…' : 'Send transfer request'}
        onPrimary={send}
        primaryDisabled={busy}
        ring
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionTransferDialog;
