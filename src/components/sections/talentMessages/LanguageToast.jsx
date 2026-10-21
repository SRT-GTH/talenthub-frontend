import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { BellIcon } from './dIcons.jsx';

const log = debug('LanguageToast');

/*
 * LanguageToast — Figma "Toast · on the list" (frame L-03 7497:7466 Playful / 8110:456736 Focused; node 7497:7881).
 * Dark pill (#1c2a21) 391x56, bell disc, "You’re on the list!" + "We’ll ping you the moment your language lands." and
 * a yellow "Undo". Copy verbatim from the node `characters`.
 * No auto-hide is drawn, so it stays until closed or undone. Props: onUndo(), onClose(), autoHideMs (default 0 = stay).
 */
const LanguageToast = ({ onUndo, onClose, autoHideMs = 0 }) => {
  useEffect(() => {
    log('mount', { autoHideMs });
    if (!autoHideMs) return undefined;
    const t = setTimeout(() => {
      log('auto hide');
      onClose?.();
    }, autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[126px] left-1/2 z-[80] flex w-[391px] max-w-[calc(100vw-24px)] -translate-x-1/2 lg:left-[calc(50%+11.6vw)] items-center gap-[12px] rounded-[999px] bg-[#1c2a21] py-[10px] pr-[18px] pl-[10px] shadow-[0_10px_24px_rgba(28,42,33,0.06),0_4px_16px_rgba(28,42,33,0.2)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <span
        aria-hidden="true"
        className="flex size-[36px] shrink-0 items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]"
      >
        <BellIcon className="size-[16px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[14.5px] leading-[17px] font-semibold text-white">
          You’re on the list!
        </span>
        <span className="text-[12px] leading-[15px] text-[#c1d4c4] lg:whitespace-nowrap">
          We’ll ping you the moment your language lands.
        </span>
      </span>
      <button
        type="button"
        onClick={() => {
          log('undo');
          onUndo?.();
        }}
        className="min-h-[24px] shrink-0 cursor-pointer text-[13.5px] leading-[16px] font-bold text-[#ffd86b]"
      >
        Undo
      </button>
    </div>
  );
};

export default LanguageToast;
