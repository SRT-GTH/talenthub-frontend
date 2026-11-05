import { debug } from '../../utils/debug.js';
import { SettingsAToastCheckIcon } from '../shared/assets.jsx';
import StatusToast from './StatusToast.jsx';

const log = debug('SavedToast');

/*
 * SavedToast — the white status card of the settings screens (look of the talent "Toast · Saved", Figma 8110 ST-09b: white, r16, hairline border, 28px green check disc,
 * 15/600 title + 13 body, optional green "Undo"). A variant of `ui/StatusToast`; the agency and institution settings toasts are this one component.
 * Props: toast { title, body?, undo? } | null, onUndo, onDismiss, ms (default 8000).
 * ⚠️ ASSUMPTION: the agency and institution frames draw no toast; the copy comes from their settings data TOASTS.
 */
const SavedToast = ({ toast, onUndo, onDismiss, ms = 8000 }) => {
  log('render', toast?.title);
  return (
    <StatusToast
      open={Boolean(toast)}
      duration={ms}
      onClose={onDismiss}
      resetKey={toast}
      wrapperClassName="pointer-events-none fixed top-[clamp(64px,6vw,100px)] right-[clamp(12px,3.2vw,56px)] z-[70] max-w-[calc(100vw-24px)]"
      faceClassName="pointer-events-auto flex items-center gap-[12px] rounded-[16px] border border-[rgba(28,42,33,0.1)] bg-white px-[18px] py-[14px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]"
    >
      <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#387440]">
        <SettingsAToastCheckIcon className="block size-[16px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-px">
        <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {toast?.title}
        </p>
        {toast?.body ? (
          <p className="m-0 text-[13px] leading-[16px] text-[#595959]">{toast.body}</p>
        ) : null}
      </div>
      {toast?.undo ? (
        <button
          type="button"
          onClick={onUndo}
          className="cursor-pointer px-[10px] py-[6px] text-[14px] font-semibold whitespace-nowrap text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          Undo
        </button>
      ) : null}
    </StatusToast>
  );
};

export default SavedToast;
