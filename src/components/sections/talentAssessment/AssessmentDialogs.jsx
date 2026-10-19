import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { HEADING, HubButton } from '../talentSkillsLab/HubParts.jsx';
import { HubHourglassIcon } from '../talentSkillsLab/HubIcons.jsx';
import { AssessSmileIcon } from './AssessmentIcons.jsx';
import { RETAKE_COOLDOWN } from './assessmentData.js';

const log = debug('AssessmentDialogs');

/*
 * RetakeCooldownDialog — MA-08 "Retake cooldown (pop-up)" (Figma Playful 7970:10853 / Focused 8110:32969, modal 7970:11232 /
 * 8110:33348): hourglass, "You can retake on 25 Dec", the explanation, the "personality games" hint and Got it / Remind me.
 * Open it with `?modal=retake` (assessment.update({ modal: 'retake' })) — the overview mounts it, and the personality
 * detail page ("Retake in 72 days") can mount the same component.
 * Props: data (RETAKE_COOLDOWN), onClose, onRemind (default: logs and closes).
 * Card: white r24 p32, 520px wide; Playful = 1.5px ink@.55 border + 4px hard shadow, Focused = hairline + soft shadows.
 * Scrim #1c2a21 @ 55%. Focus moves in, Tab is trapped, Esc / scrim click close (usePlayfulDialogA11y).
 */
const CARD_CHROME =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

export const RetakeCooldownDialog = ({ data = RETAKE_COOLDOWN, onClose, onRemind }) => {
  const ref = useRef(null);
  useEffect(() => {
    log('retake dialog mount');
  }, []);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: onClose,
    initialFocus: () => ref.current,
    lockScroll: true,
  });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-[rgba(28,42,33,0.55)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ma-retake-title"
        tabIndex={-1}
        className={classNames(
          'relative m-auto flex w-full max-w-[520px] flex-col gap-[16px] rounded-[24px] bg-white p-[clamp(20px,6vw,32px)] outline-none',
          CARD_CHROME
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-[72px] shrink-0 items-center justify-center self-center rounded-full bg-[#faf4e8] text-[#463409]"
        >
          <HubHourglassIcon className="size-[30px]" />
        </span>
        <h2
          id="ma-retake-title"
          className={classNames(
            HEADING,
            'text-center text-[clamp(22px,1.5vw,26px)] leading-[1.2] tracking-[-0.01em]'
          )}
        >
          {data.title}
        </h2>
        <p className="m-0 text-center font-sans text-[14.5px] leading-[22px] text-[#595959]">
          {data.body}
        </p>
        <p className="m-0 flex items-center gap-[10px] rounded-[14px] bg-[#ebf1ec] px-[16px] py-[12px] font-sans text-[13.5px] font-semibold leading-[16px] text-[#2a5730] max-sm:leading-[18px]">
          <AssessSmileIcon className="size-[18px] shrink-0 text-[#387440]" />
          {data.alt}
        </p>
        <div className="flex items-start gap-[12px] max-sm:flex-col max-sm:items-stretch">
          <div className="min-w-0 max-sm:w-full" style={{ flex: '236 1 0%' }}>
            <HubButton tone="secondary" size="lg" onClick={onClose} className="w-full">
              {data.dismiss}
            </HubButton>
          </div>
          <div className="min-w-0 max-sm:w-full" style={{ flex: '204 1 0%' }}>
            <HubButton
              tone="primary"
              size="sm"
              className="w-full max-lg:whitespace-normal"
              onClick={() => {
                log('remind me (no destination drawn)');
                if (onRemind) onRemind();
                else onClose?.();
              }}
            >
              {data.remind}
            </HubButton>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
