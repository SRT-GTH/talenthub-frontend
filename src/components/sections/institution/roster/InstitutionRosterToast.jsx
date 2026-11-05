import { debug } from '../../../../utils/debug.js';
import StatusToast from '../../../ui/StatusToast.jsx';

const log = debug('InstitutionRosterToast');

/*
 * InstitutionRosterToast — a status line at the bottom of the page for the roster actions (student added, removed, reminder sent, consent requests sent ...); a variant of `ui/StatusToast`.
 * ⚠️ ASSUMPTION: Figma draws no toast; this is the minimal dark pill (#1c2a21, white 14/20) with role="status", hidden after 5 s, with an optional action button.
 * Props: toast ({ id, message, action: { label, onClick } } | null), onDone.
 */
const InstitutionRosterToast = ({ toast, onDone }) => {
  if (toast) log('show', toast.message);
  return (
    <StatusToast
      open={Boolean(toast)}
      duration={5000}
      onClose={onDone}
      resetKey={toast}
      wrapperClassName="pointer-events-none fixed inset-x-0 bottom-[96px] z-[80] flex justify-center px-[16px]"
      faceClassName="pointer-events-auto flex max-w-[560px] items-center gap-[14px] rounded-[14px] bg-[#1c2a21] px-[18px] py-[12px] font-sans text-[14px] leading-[20px] text-white shadow-[0_8px_24px_rgba(15,15,10,0.24)]"
    >
      <span>{toast?.message}</span>
      {toast?.action ? (
        <button
          type="button"
          onClick={() => {
            toast.action.onClick();
            onDone();
          }}
          className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] font-semibold text-[#ffd86b] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {toast.action.label}
        </button>
      ) : null}
    </StatusToast>
  );
};

export default InstitutionRosterToast;
