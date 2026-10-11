import ClampText from '../../ui/ClampText.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInlineNotice');

/*
 * ParentInlineNotice — compact, flat, dismissible success notice used on phones
 * in place of the shared top-right Toast (whose full-screen scrim + ~200px card
 * covers the whole viewport below md). Renders the same title / body message.
 * Parent sign-up screens only render this below `lg`; `lg+` keeps the Toast.
 */

const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="#387440" strokeWidth="1.4" />
    <path
      d="m5 8.2 2.2 2.2L11 6.4"
      stroke="#387440"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ParentInlineNotice = ({ title, children, onDismiss }) => {
  log('render', { title });
  return (
    <div
      role="status"
      className="relative flex w-full items-start gap-2 rounded-[10px] border border-[#c1d4c4] bg-[#ebf1ec]/60 py-2.5 pl-3 pr-11"
    >
      <span className="mt-0.5 shrink-0">
        <CheckCircle />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="font-sans text-[13px] font-semibold leading-5 text-[#2a5730]">{title}</p>
        <ClampText
          lines={2}
          className="font-sans text-[13px] leading-[18px] text-[#575755]"
          buttonClassName="text-[12px]"
        >
          {children}
        </ClampText>
      </div>
      <button
        type="button"
        aria-label="Dismiss notice"
        onClick={() => {
          log('dismissed');
          onDismiss?.();
        }}
        className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-full text-[#575755] before:absolute before:-inset-1 before:content-['']"
      >
        <svg width="10" height="10" viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <path
            d="M1 1l6 6M7 1 1 7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ParentInlineNotice;
