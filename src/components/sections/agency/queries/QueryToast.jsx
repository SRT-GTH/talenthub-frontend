import StatusToast from '../../../ui/StatusToast.jsx';

/*
 * QueryToast — the confirmation line after a query is saved or a CSV is exported (a polite status, auto-dismissed after 5 s); a variant of `ui/StatusToast`.
 * ⚠️ ASSUMPTION: Figma draws no confirmation; the dark-green chip reuses the Theme 8 "Link copied" toast look (#2a5730, white 14/17 600, r12).
 * Props: message (string or null), onDismiss.
 */
const QueryToast = ({ message, onDismiss }) => (
  <StatusToast
    portal
    open={Boolean(message)}
    duration={5000}
    onClose={onDismiss}
    resetKey={message}
    wrapperClassName="pointer-events-none fixed inset-x-0 bottom-[96px] z-[70] flex justify-center px-[16px] font-sans"
    faceClassName="pointer-events-auto m-0 max-w-[480px] rounded-[12px] bg-[#2a5730] px-[16px] py-[12px] text-[14px] leading-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
  >
    {message}
  </StatusToast>
);

export default QueryToast;
