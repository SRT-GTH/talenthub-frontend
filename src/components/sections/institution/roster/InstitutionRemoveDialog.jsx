import { debug } from '../../../../utils/debug.js';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import { cap, pronounsOf } from './rosterPronouns.js';
import { rosterActions } from './rosterStore.js';
import {
  Roster20CloseIcon,
  Roster20DeleteIcon,
  Roster20InfoCircleIcon,
  RosterCloseIcon,
} from './rosterIcons.jsx';

const log = debug('InstitutionRemoveDialog');

/*
 * InstitutionRemoveDialog — "Remove Yaw Adomako from your roster?" (Figma 11.2.2e 8590:386008, ?modal=remove&student=<id>): 520 wide, r24, p 28, gap 16, on a #1c2a21 55 % scrim.
 * Header: 44 tile (#f9ebea, r13) with the trash glyph (#902b20), title 24/29 600, 30 round close. "What happens:" 15/18 600 and three red-x lines 14/17; amber note (#faf4e8, r12, p 12,
 * 13.5/20 500 #463409); buttons Cancel (white shelf, 56 high) + "Remove student" (white shelf, 46 high, red 15/24 700 label with the trash glyph).
 * Behaviour (InstitutionDialogShell): focus trap, Esc, scrim click, focus back to the opener. Remove → MOCK DELETE /institution/students/:id → the roster store (counts follow).
 * Props: student, onClose, onRemoved.
 */

const shelf =
  'inline-flex min-w-[120px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white font-sans font-bold tracking-[0.1px] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]';

const InstitutionRemoveDialog = ({ student, onClose, onRemoved }) => {
  const p = pronounsOf(student);
  const remove = () => {
    log('remove (mock)', student.id);
    rosterActions.removeStudent(student.id);
    rosterActions.toast(`${student.name} was removed from your roster.`);
    onRemoved?.(student);
    onClose();
  };
  const lines = [
    `${p.subjIs} removed from your roster and class lists`,
    `You can’t verify any new records for ${p.obj}`,
    `${p.subj} ${p.drops} out of your progress reports`,
  ];
  return (
    <InstitutionDialogShell
      label={`Remove ${student.name} from your roster?`}
      onClose={onClose}
      size="narrow"
      scrim="ink"
      closeButton={false}
    >
      <div className="flex items-start gap-[12px]">
        <span className="mt-[7px] grid size-[44px] shrink-0 place-items-center rounded-[13px] bg-[#f9ebea] text-[#902b20]">
          <Roster20DeleteIcon className="size-[21px]" />
        </span>
        <h2 className="m-0 flex-1 font-sans text-[24px] leading-[29px] font-semibold tracking-[-0.24px] text-[#1c2a21]">
          Remove {student.name} from your roster?
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mt-[14px] grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <RosterCloseIcon className="size-[18px]" />
        </button>
      </div>
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        What happens:
      </p>
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {lines.map((t) => (
          <li
            key={t}
            className="flex items-center gap-[10px] font-sans text-[14px] leading-[17px] text-[#1c2a21]"
          >
            <Roster20CloseIcon className="size-[16px] shrink-0 text-[#902b20]" />
            {t}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-[10px] rounded-[12px] bg-[#faf4e8] p-[12px]">
        <Roster20InfoCircleIcon className="size-[18px] shrink-0 text-[#463409]" />
        <p className="m-0 font-sans text-[13.5px] leading-[20px] font-medium text-[#463409]">
          {cap(p.poss)} profile, verified records and credentials stay {p.possAbs}. Moving schools?
          Use Transfer out instead.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-[12px]">
        <button
          type="button"
          onClick={onClose}
          data-autofocus=""
          className={`${shelf} h-[56px] px-[34px] text-[16px] leading-[24px] text-[#1c2a21]`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={remove}
          className={`${shelf} h-[46px] gap-[8px] px-[20px] text-[15px] leading-[24px] text-[#c0392b]`}
        >
          <Roster20DeleteIcon className="size-[20px]" />
          Remove student
        </button>
      </div>
    </InstitutionDialogShell>
  );
};

export default InstitutionRemoveDialog;
