import { debug } from '../../../../utils/debug.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import { pronounsOf } from './rosterPronouns.js';
import { rosterActions } from './rosterStore.js';
import { Roster20EditIcon, Roster20FileCheckIcon } from './rosterIcons.jsx';

const log = debug('InstitutionTransferDialog');

/*
 * InstitutionTransferDialog — "Transfer Kofi Danso to another school?" (Figma 11.2.2f 8590:386599, ?modal=transfer&student=<id>): 620 wide, r28. Plain chip "Transfer out", title (second word
 * group green), text, preview card (#f8f8f4, 1px #e7e7e7, r16: 40 tile with file-check, name 15/18 600, "Form 3 · Business · on your roster since Sep 2024"), "WHAT HAPPENS"
 * (11/13 700, tracking 1.2) with three red-dot lines 14/17 500, the amber "Pending record?" card (only for a student with a record waiting) and Cancel + "Send transfer request".
 * Send → MOCK POST /institution/students/:id/transfer → a status line. ⚠️ ASSUMPTION: the receiving school is fixed to Tamale SHS (Figma draws no school picker).
 * Props: student, onClose.
 */

const SCHOOL = 'Tamale SHS';

const InstitutionTransferDialog = ({ student, onClose }) => {
  const p = pronounsOf(student);
  const first = student.name.split(' ')[0];
  const pending = student.pill === 'Record pending';
  const send = () => {
    log('transfer (mock)', student.id);
    rosterActions.transferOut(student.id);
    rosterActions.toast(`Transfer request sent to ${SCHOOL}.`);
    onClose();
  };
  const effects = [
    `${SCHOOL} gets a transfer request`,
    `Your verified records move with ${p.obj}`,
    `${first} is told and can see the status`,
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
            Form {student.form} · {student.programme} · on your roster since Sep 2024
          </span>
        </div>
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
      {pending ? (
        <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[16px] pl-[14px]">
          <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-[#c8951a] text-white">
            <Roster20EditIcon className="size-[17px]" />
          </span>
          <div className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              Pending record?
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
              Approve or reject {p.poss} WASSCE mock record before {p.subj.toLowerCase()} leaves.
            </span>
          </div>
        </div>
      ) : null}
      <InstitutionDialogActions
        cancelLabel="Cancel"
        onCancel={onClose}
        primaryLabel="Send transfer request"
        onPrimary={send}
        ring
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionTransferDialog;
