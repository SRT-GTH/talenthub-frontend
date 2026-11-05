import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ConfirmArrowRightIcon } from './scheduleInterviewIcons.jsx';

const log = debug('InterviewConfirmModal');

/*
 * InterviewConfirmModal — the two 528x294 confirmations. Figma V2.0
 * 7249:82225 ("Cancel this Interview?") and 7249:82686 ("Schedule this
 * Interview?"); identical apart from copy, the primary button's tone and the
 * arrow on the brand button, so one component covers both. In V2.0 they sit
 * over the pipeline page itself (the schedule modal is hidden behind them).
 *
 * Card: 528x294, white, r24, padding 64 (top/bottom) / 48 (sides), centred, with
 * the two-layer shadow the big modal uses (0 4 0 #000 @0.13, 0 40 100 #000 @0.25).
 * Title is Bricolage Grotesque 600 32/38 #1c2a21; body is 16/24 #575755 centred
 * at 432 wide, 36 below it the buttons row (gap 8):
 *   danger  167x44  #c0392b on 2px #73221a, r10, solid 4px #73221a shelf
 *   brand   #387440 on 2px #2a5730, r10, 4px #224626 shelf
 *   cancel  137x44  white on 2px #111111 @0.30, r14, 4px #111111 @0.25 shelf
 */
const InterviewConfirmModal = ({ open, copy, onConfirm, onCancel }) => {
  if (!open) return null;
  log('render', { title: copy.title, tone: copy.tone });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1c2a21]/70 px-4 max-sm:items-end max-sm:px-0"
      onClick={onCancel}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[528px] flex-col items-center rounded-[24px] bg-white px-[48px] py-[64px] max-sm:py-[32px] shadow-[0_4px_0_0_rgba(0,0,0,0.13),0_40px_100px_0_rgba(0,0,0,0.25)] max-sm:max-h-dvh max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:px-[20px] max-sm:pb-[calc(24px+env(safe-area-inset-bottom))] max-sm:pt-[32px]"
      >
        <h2 className="font-heading text-[32px] font-semibold leading-[38px] text-center text-[#1c2a21] max-sm:text-[22px] max-sm:leading-[28px]">
          {copy.title}
        </h2>

        <div className="flex w-full flex-col items-center gap-[36px] max-sm:gap-[24px]">
          <p className="w-full max-w-[432px] text-center font-sans text-[16px] leading-6 text-[#575755]">
            {copy.body}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[8px] max-sm:w-full max-sm:flex-col max-sm:gap-[12px]">
            <button
              type="button"
              onClick={() => {
                log('branch', { action: 'confirm', title: copy.title });
                onConfirm?.();
              }}
              className={classNames(
                'inline-flex h-[44px] max-sm:h-[40px] max-sm:w-full max-sm:shadow-none items-center justify-center gap-[8px] rounded-[10px] border-2 px-[18px]',
                'font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-white',
                'transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none',
                copy.tone === 'danger'
                  ? 'border-[#73221a] bg-danger shadow-[0_4px_0_0_#73221a]'
                  : 'border-brand-green-dark bg-brand-green shadow-[0_4px_0_0_#224626] hover:bg-brand-green-hover'
              )}
            >
              {copy.confirmLabel}
              {copy.withArrow ? <ConfirmArrowRightIcon className="size-[20px] shrink-0" /> : null}
            </button>

            <button
              type="button"
              onClick={() => {
                log('branch', { action: 'keep-editing' });
                onCancel?.();
              }}
              className="inline-flex h-[44px] max-sm:h-[40px] max-sm:w-full max-sm:shadow-none items-center justify-center rounded-[14px] border-2 border-black/30 bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black shadow-[0_4px_0_0_rgba(17,17,17,0.25)] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
            >
              {copy.cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewConfirmModal;
