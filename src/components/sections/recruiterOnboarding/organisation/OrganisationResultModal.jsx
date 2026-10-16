import { useEffect, useId, useRef } from 'react';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { CloseSmallIcon, ShieldSmallIcon, SuccessCheckBadgeIcon } from './OrganisationIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('OrganisationResultModal');

/*
 * OrganisationResultModal - centred success card shared by
 *   R04  "Request sent."         7374:5780 (caption "Request pending")
 *   R04b "Organisation created." (caption "Primary Admin assigned")
 * Figma card: 440 wide, r24, 3px #c1d4c4 ring, p 40; close chip 28px #ebf1ec; 64px check
 * badge (#e1eae2, r10); caption pill; h2 Bricolage 29/35 600 (rendered with the app's
 * font-display); description 12/18 #959592; summary box (fill #ebf1ec @30%, stroke #e1eae2,
 * r16) with two rows; 4px progress rail; primary CTA; footer note 10px #959592.
 *
 * a11y: role=dialog aria-modal aria-labelledby, focus moves in, Tab is trapped, Esc and the
 * close chip call onClose, focus returns to the element that had it before opening.
 *
 * Props: title, caption, description, rows [{ icon, label, value }], ctaLabel,
 *        onContinue, onClose, railPercent (progress rail fill, Figma ~16%).
 */
const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const OrganisationResultModal = ({
  title,
  caption,
  description,
  rows,
  ctaLabel,
  onContinue,
  onClose,
  railPercent = 16,
}) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const ctaWrapRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    log('open', { title });
    const previouslyFocused = document.activeElement;
    ctaWrapRef.current?.querySelector('button')?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        log('escape closes');
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      log('closed, focus restored');
    };
  }, [title]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-end max-sm:px-0"
      style={{ background: 'rgba(0, 0, 0, 0.30)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[440px] rounded-[24px] bg-white px-10 py-10 max-sm:max-h-[92dvh] max-sm:overflow-y-auto max-sm:overscroll-contain max-sm:rounded-b-none max-sm:px-4 max-sm:pt-4 max-sm:pb-[max(16px,env(safe-area-inset-bottom))]"
        style={{
          outline: '3px solid #C1D4C4',
          outlineOffset: '-3px',
          boxShadow:
            '0 24px 64px rgba(0,0,0,0.12), 0 4px 0 rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-brand-green transition-colors hover:bg-brand-green-light-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-sm:size-11"
        >
          <CloseSmallIcon />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <span
            className="flex size-16 items-center justify-center rounded-[10px] bg-brand-green-light-hover"
            style={{ boxShadow: '0 1px 2px rgba(27,36,44,0.12)' }}
          >
            <SuccessCheckBadgeIcon />
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-green-light-active px-3 py-1"
            style={{ background: 'rgba(235, 241, 236, 0.50)' }}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full border-[1.5px] border-success bg-brand-green-light-active"
              style={{ boxShadow: '0 0 4px 0 #387440' }}
            />
            <span
              className="text-[12px] leading-[18px] text-[#999999]"
              style={{ letterSpacing: '0.2px' }}
            >
              {caption}
            </span>
          </span>
          <div className="flex flex-col gap-1">
            <h2
              id={titleId}
              className="font-heading font-semibold text-[#1c2a21] max-sm:text-[24px]! max-sm:leading-7!"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 1.8125rem)',
                lineHeight: '35px',
                letterSpacing: '-0.58px',
              }}
            >
              {title}
            </h2>
            <p
              className="mx-auto max-w-[300px] text-[12px] leading-[18px] text-[#959592]"
              style={{ letterSpacing: '0.2px' }}
            >
              {description}
            </p>
          </div>
        </div>

        <ul
          className="mt-4 flex flex-col rounded-[16px] border border-brand-green-light-hover px-[17px] py-[18px]"
          style={{ background: 'rgba(235, 241, 236, 0.30)' }}
        >
          {rows.map((row, i) => (
            <li
              key={row.label}
              className={
                'flex items-center justify-between gap-3 py-1.5 text-[12px] leading-5 ' +
                (i < rows.length - 1 ? 'border-b border-brand-green-light-hover' : '')
              }
            >
              <span className="flex items-center gap-3 text-[#575755]">
                <span className="inline-flex size-4 items-center justify-center text-brand-green">
                  {row.icon}
                </span>
                {row.label}
              </span>
              <span className="text-right font-semibold text-brand-green">{row.value}</span>
            </li>
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="mt-4 h-1 w-full overflow-hidden rounded-full bg-brand-green-light"
        >
          <div
            className="h-full rounded-full bg-brand-green-light-hover"
            style={{ width: `${railPercent}%` }}
          />
        </div>

        <div ref={ctaWrapRef} className="contents">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onContinue}
            rightIcon={<ArrowRightIcon />}
            className="mt-4 w-full max-sm:h-11 max-sm:min-h-11 max-sm:py-0"
          >
            {ctaLabel}
          </Button>
        </div>

        <p
          className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] leading-4 text-[#959592] max-lg:text-[12px]"
          style={{ letterSpacing: '0.2px' }}
        >
          <ShieldSmallIcon className="size-3 shrink-0" />
          Data encrypted at rest · Ghana Data Protection Act compliant
        </p>
      </div>
    </div>
  );
};

export default OrganisationResultModal;
