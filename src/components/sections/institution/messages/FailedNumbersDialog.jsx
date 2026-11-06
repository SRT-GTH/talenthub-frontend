import { Link } from 'react-router-dom';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { MessagesIconClose } from './messagesIcons.jsx';

/*
 * FailedNumbersDialog — "See the n" (⚠️ ASSUMPTION: the list behind the button is not drawn). A 520 wide white card (r24, p 28, same shell as "New message"):
 * the guardians whose copy failed (GET /api/institution/messages/:id/failures), each with the student, the relation and the MASKED number or email
 * (never in full), and a "Fix contact" link to the student's roster record. Focus trap, Esc, scrim click and focus return from AgencyDialogShell.
 * Props: items ([{ rosterId, student, relation, contact }] | null while loading), onClose().
 */

const FailedNumbersDialog = ({ items, onClose }) => {
  const n = items?.length ?? 0;
  const title = items
    ? `${n} ${n === 1 ? 'guardian' : 'guardians'} didn’t get the copy`
    : 'Guardian copies';
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
        {!items ? (
          <p className="m-0 text-[14px] leading-[20px] text-[#737373]">Loading…</p>
        ) : n ? (
          <ul className="m-0 flex min-h-0 list-none flex-col overflow-y-auto p-0">
            {items.map((r) => (
              <li
                key={r.rosterId}
                className="flex items-center justify-between gap-[12px] border-0 border-t border-solid border-[#f2f2f2] py-[10px] first:border-t-0"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] leading-[18px] font-medium text-[#1c2a21]">
                    {r.student}
                  </span>
                  <span className="text-[13px] leading-[16px] text-[#737373]">
                    {r.relation} · {r.contact}
                  </span>
                </span>
                <Link
                  to={`/institution/students/${r.rosterId}`}
                  className="inline-flex min-h-[24px] items-center text-[13px] font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  Fix contact
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-[14px] leading-[20px] text-[#737373]">
            Every guardian copy went through.
          </p>
        )}
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
