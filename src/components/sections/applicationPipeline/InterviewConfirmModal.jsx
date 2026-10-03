import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('InterviewConfirmModal');

/*
 * InterviewConfirmModal — the two 528x303 confirmations that sit over the
 * Schedule Interview modal. Figma 7249:82225 ("Cancel this Interview?") and
 * 7249:82686 ("Schedule this Interview?"); they are identical apart from copy
 * and the primary button's tone, so one component covers both.
 *
 * Card: 528x303, white, r24, padding 48/64, counter-axis CENTER, with the same
 * two-layer shadow the big modal uses (0 4 0 #000 @0.13, 0 40 100 #000 @0.25).
 * Title is Instrument Serif 36/46.8 #111111; body is 16/24 #575755 and
 * textAlignHorizontal CENTER at 432 wide. Buttons sit in a 312x44 row, gap 8:
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[528px] flex-col items-center rounded-[24px] bg-white px-[48px] py-[64px] shadow-[0_4px_0_0_rgba(0,0,0,0.13),0_40px_100px_0_rgba(0,0,0,0.25)]"
      >
        <h2 className="font-display text-[36px] not-italic leading-[46.8px] text-black">
          {copy.title}
        </h2>

        <div className="flex w-full flex-col items-center gap-[36px]">
          <p className="w-full max-w-[432px] text-center font-sans text-[16px] leading-6 text-[#575755]">
            {copy.body}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[8px]">
            <button
              type="button"
              onClick={() => {
                log('branch', { action: 'confirm', title: copy.title });
                onConfirm?.();
              }}
              className={classNames(
                'inline-flex h-[44px] items-center justify-center rounded-[10px] border-2 px-[18px]',
                'font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-white',
                'transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none',
                copy.tone === 'danger'
                  ? 'border-[#73221a] bg-danger shadow-[0_4px_0_0_#73221a]'
                  : 'border-brand-green-dark bg-brand-green shadow-[0_4px_0_0_#224626] hover:bg-brand-green-hover'
              )}
            >
              {copy.confirmLabel}
            </button>

            <button
              type="button"
              onClick={() => {
                log('branch', { action: 'keep-editing' });
                onCancel?.();
              }}
              className="inline-flex h-[44px] items-center justify-center rounded-[14px] border-2 border-black/30 bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black shadow-[0_4px_0_0_rgba(17,17,17,0.25)] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
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
