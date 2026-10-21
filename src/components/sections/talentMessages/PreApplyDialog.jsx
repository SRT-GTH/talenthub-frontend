import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { HEADING, HubButton } from '../talentSkillsLab/HubParts.jsx';
import { PRE_APPLY_PREVIEW } from './cards/messageCardsData.js';
import { CloseXIcon, EyeOffIcon, SeenCheckIcon } from './bIcons.jsx';

const log = debug('PreApplyDialog');

/*
 * PreApplyDialog — T-MSG-06 "Before you apply" (Figma Playful 7420:3578 / Focused 8110:438016). Open with ?modal=pre-apply.
 * Props: open, onClose, onSubmit (Continue application -> the lead sets the job card to 'applied'), data (PRE_APPLY_PREVIEW),
 * onEditVisibility (optional; no destination is drawn, default logs only).
 * Scrim #1c2a21 @45%. Focus trap, Esc and scrim click close (usePlayfulDialogA11y).
 * Heading font: Bricolage (Playful) / SF Rounded (Focused). Shadow differs per style as drawn.
 */
const PreApplyDialog = ({
  open,
  onClose,
  onSubmit,
  data = PRE_APPLY_PREVIEW,
  onEditVisibility,
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (open) log('open', { role: data.role });
  }, [open, data.role]);
  usePlayfulDialogA11y({ open: !!open, dialogRef: ref, onEscape: onClose, lockScroll: true });
  if (!open) return null;
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-[rgba(28,42,33,0.45)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pre-apply-title"
        aria-describedby="pre-apply-sub"
        tabIndex={-1}
        className="relative m-auto flex w-full max-w-[620px] flex-col gap-[20px] rounded-[24px] bg-white px-[clamp(16px,5vw,32px)] py-[clamp(20px,5vw,40px)] shadow-[0_14px_45px_rgba(0,0,0,0.125)] outline-none playful:shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-start gap-[16px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <h2
              id="pre-apply-title"
              className={classNames(
                HEADING,
                'text-[clamp(24px,2vw,32px)] leading-[1.19] tracking-normal'
              )}
            >
              {data.title}
            </h2>
            <p
              id="pre-apply-sub"
              className="m-0 font-sans text-[15px] leading-[18px] tracking-[0.2px] text-[#595959]"
            >
              This is what {data.company} will see for {data.role}.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <CloseXIcon className="size-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-[16px] rounded-[16px] bg-[#ebf1ec] p-[18px]">
          <span
            className={classNames(
              HEADING,
              'text-[34px] leading-[41px] tracking-[0.2px] text-[#2d5d33]'
            )}
          >
            {data.matchPercent}%
          </span>
          <p className="m-0 min-w-0 flex-1 font-sans text-[14px] leading-[17px] tracking-[0.2px] text-[#32683a]">
            Your match for this role.
            {data.boostedPercent ? (
              <>
                {' '}
                It goes up to about <span className="font-semibold">{data.boostedPercent}%</span> if
                you show your work experience.
              </>
            ) : null}
          </p>
        </div>

        <section aria-labelledby="pre-apply-sees" className="flex flex-col gap-[8px]">
          <h3
            id="pre-apply-sees"
            className="m-0 font-sans text-[11px] max-lg:text-[12px] font-semibold leading-[13px] tracking-[0.2px] text-[#737373]"
          >
            {data.sectionsLabel}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
            {data.rows.map((r) => (
              <li
                key={r.id}
                className={classNames(
                  'flex items-center gap-[12px] rounded-[10px] px-[12px] font-sans text-[14px] leading-[17px] tracking-[0.2px]',
                  r.hidden
                    ? 'bg-[#faf4e8] py-[16px] font-medium text-[#c8951a]'
                    : 'py-[12px] text-[#1c2a21]'
                )}
              >
                <span className="inline-flex size-[18px] shrink-0 items-center justify-center">
                  {r.hidden ? (
                    <EyeOffIcon className="size-[18px] text-[#c8951a]" />
                  ) : (
                    <SeenCheckIcon className="h-[10px] w-[14px] text-[#387440]" />
                  )}
                </span>
                <span className="min-w-0 flex-1">{r.label}</span>
                {r.action ? (
                  <button
                    type="button"
                    onClick={() => {
                      log('branch: edit visibility (no destination drawn)');
                      onEditVisibility?.();
                    }}
                    className="inline-flex min-h-[24px] shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    {r.action}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap justify-end gap-[10px] pb-[4px] max-sm:flex-col-reverse">
          <HubButton tone="secondary" size="lg" onClick={onClose}>
            {data.cancelLabel}
          </HubButton>
          <HubButton
            tone="primary"
            size="lg"
            onClick={() => {
              log('branch: continue application');
              onSubmit?.();
            }}
          >
            {data.continueLabel}
          </HubButton>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PreApplyDialog;
