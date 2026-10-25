import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { FAILED_NUMBERS } from './data/messagesData.js';
import { MessagesIconClose } from './messagesIcons.jsx';

/*
 * FailedNumbersDialog — "See the 12" (⚠️ ASSUMPTION: the list behind the button is not drawn). A 480 wide white card (r24, p 28, same shell as "New message"):
 * the guardians whose SMS failed, each with the student, the relation and the MASKED number (never a full number), and a "Fix number" link to the roster record.
 * Focus trap, Esc, scrim click and focus return come from AgencyDialogShell.
 * Props: rows (defaults to FAILED_NUMBERS, first `count` used), count, onClose().
 */

const FailedNumbersDialog = ({ count, onClose }) => {
  const rows = FAILED_NUMBERS.slice(0, count);
  const title = `${count} guardians didn’t get the SMS`;
  return (
    <AgencyDialogShell
      title={title}
      onClose={onClose}
      scrim="bg-[#1c2a21]/55"
      className="mx-auto max-w-[520px]"
    >
      <div className="flex max-h-[85vh] flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-sm:p-[20px]">
        <div className="flex items-start gap-[12px]">
          <h2 className="m-0 min-w-0 flex-1 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <MessagesIconClose className="size-[18px]" />
          </button>
        </div>
        <ul className="m-0 flex min-h-0 list-none flex-col overflow-y-auto p-0">
          {rows.map(([student, relation, number]) => (
            <li
              key={student}
              className="flex items-center justify-between gap-[12px] border-0 border-t border-solid border-[#f2f2f2] py-[10px] first:border-t-0"
            >
              <span className="flex min-w-0 flex-col">
                <span className="text-[15px] leading-[18px] font-medium text-[#1c2a21]">
                  {student}
                </span>
                <span className="text-[13px] leading-[16px] text-[#737373]">
                  {relation} · {number}
                </span>
              </span>
              <a
                href="/institution/students"
                className="inline-flex min-h-[24px] items-center text-[13px] font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                Fix number
              </a>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          data-autofocus=""
          className="!rounded-[14px]"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </AgencyDialogShell>
  );
};

export default FailedNumbersDialog;
