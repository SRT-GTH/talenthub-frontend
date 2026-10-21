import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { CvCalloutInfoIcon, CvCalloutShieldIcon, CvCloseIcon, CvTickIcon } from './cvIcons.jsx';

const log = debug('CvParts');

/*
 * Upload my CV — shared building blocks (Figma "modal · …" frames, Focused 8966:508317 … / Playful 8966:887 …).
 * Focused card: white, 1px ink@.10 border, soft shadow. Playful: 1.5px ink@.55 border + hard 4px shelf, Bricolage title.
 */

const CARD =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/*
 * CvDialog — scrim (#1c2a21 @ 55%) + card. role=dialog, labelled, focus trap, Esc, inert backdrop, scroll lock.
 * Props: title, onClose, wide (960 review modal), footerNote {icon, text}, footer (buttons node), initialFocus, children.
 */
export const CvDialog = ({
  title,
  onClose,
  wide = false,
  note,
  noteIcon,
  buttons,
  initialFocus,
  toast,
  children,
}) => {
  const ref = useRef(null);
  const titleId = useId();
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: () => {
      log('escape');
      onClose?.();
    },
    initialFocus,
    lockScroll: true,
  });
  const NoteIcon = noteIcon;
  return createPortal(
    <div
      data-pf-portal
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[rgba(28,42,33,0.55)] px-3 py-4 sm:items-center sm:p-6"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={classNames(
          'my-auto flex w-full flex-col gap-[18px] rounded-[24px] bg-white p-4 outline-none sm:p-[28px]',
          wide ? 'max-w-[960px]' : 'max-w-[680px]',
          CARD
        )}
      >
        <div className="flex items-start gap-[10px]">
          <h2
            id={titleId}
            className="m-0 min-w-0 flex-1 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21] playful:font-heading max-sm:text-[22px] max-sm:leading-[28px]"
          >
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              log('close');
              onClose?.();
            }}
            className="inline-flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e6e6e6] bg-transparent p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CvCloseIcon />
          </button>
        </div>
        {children}
        <div className="flex min-h-[63px] flex-wrap items-center gap-[10px]">
          <p className="m-0 flex min-w-0 flex-1 basis-[200px] items-center gap-[6px] font-sans text-[12px] leading-[14px] font-medium text-[#737373]">
            {NoteIcon ? <NoteIcon className="shrink-0 text-[#387440]" /> : null}
            {note}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-[10px]">{buttons}</div>
        </div>
      </div>
      {toast}
    </div>,
    document.body
  );
};

/* Footer buttons exactly as drawn: tertiary Lg (secondary action) + primary Sm. */
export const CvSecondaryButton = ({ onClick, children }) => (
  <Button variant="tertiary" size="lg" onClick={onClick}>
    {children}
  </Button>
);
export const CvPrimaryButton = ({ onClick, disabled, children, ref }) => (
  <Button variant="primary" size="sm" onClick={onClick} disabled={disabled} ref={ref}>
    {children}
  </Button>
);

const TONES = {
  neutral: { box: 'border-[rgba(28,42,33,0.25)] bg-[#f7f8f4]', title: 'text-[#1c2a21]' },
  error: { box: 'border-[rgba(192,57,43,0.25)] bg-[#fcece9]', title: 'text-[#c0392b]' },
  warn: { box: 'border-[rgba(160,112,10,0.25)] bg-[#fdf5e0]', title: 'text-[#a0700a]' },
};

/* Callout — 12px radius, 1px tone border, 18px icon, title 14/600, body 13/16 ink@.85. */
export const CvCallout = ({ tone = 'neutral', title, children, role }) => {
  const t = TONES[tone];
  const Glyph = tone === 'error' ? CvCalloutShieldIcon : CvCalloutInfoIcon;
  return (
    <div
      role={role}
      className={classNames(
        'flex gap-[12px] rounded-[12px] border border-solid px-[16px] py-[14px]',
        t.box
      )}
    >
      <Glyph className="mt-px shrink-0 text-[#387440]" />
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p
          className={classNames('m-0 font-sans text-[14px] leading-[17px] font-semibold', t.title)}
        >
          {title}
        </p>
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#1c2a21]/85 max-lg:text-[13px]">
          {children}
        </p>
      </div>
    </div>
  );
};

/* 40px rounded tile holding a 20px glyph. */
export const CvIconTile = ({ icon, tone = 'mint', className }) => {
  const Glyph = icon;
  const bg = { mint: 'bg-[#ebf1ec]', white: 'bg-white', amber: 'bg-[#faf4e8]' }[tone];
  return (
    <span
      className={classNames(
        'inline-flex size-[40px] shrink-0 items-center justify-center rounded-[12px] text-[#387440]',
        bg,
        className
      )}
    >
      <Glyph />
    </span>
  );
};

/* Title + optional sub line row (steps list, tips list, "added" list). */
export const CvTextRow = ({ icon, tone, title, sub, dim = false }) => (
  <div className={classNames('flex items-center gap-[12px] py-[10px]', dim && 'opacity-55')}>
    <CvIconTile icon={icon} tone={tone} />
    <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {title}
      </p>
      {sub ? (
        <p className="m-0 font-sans text-[12.5px] leading-[18px] text-[#737373] max-lg:text-[12.5px]">
          {sub}
        </p>
      ) : null}
    </div>
  </div>
);

/* File card with progress bar (CV-02 / CV-03). */
export const CvFileCard = ({ tone, icon, name, status, percent, onCancel }) => (
  <div className="flex items-center gap-[14px] rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[16px]">
    <CvIconTile icon={icon} tone={tone} />
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <p className="m-0 truncate font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {name}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#737373]">{status}</p>
      <div
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-[8px] w-full overflow-hidden rounded-[4px] bg-[#e6e6e6]"
      >
        <div className="h-full rounded-[4px] bg-[#387440]" style={{ width: `${percent}%` }} />
      </div>
    </div>
    <button
      type="button"
      aria-label="Cancel"
      onClick={onCancel}
      className="inline-flex size-[24px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <CvCloseIcon />
    </button>
  </div>
);

/* GTHCheckbox 20px. */
export const CvCheckbox = ({ checked, onChange, label, labelledBy, className }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    aria-labelledby={labelledBy}
    onClick={() => onChange(!checked)}
    className={classNames(
      'relative inline-flex size-[20px] shrink-0 cursor-pointer items-center justify-center overflow-visible rounded-[6px] border-[1.5px] border-solid p-0 before:absolute before:-inset-[2px] before:content-[""] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      checked
        ? 'border-[#19341d] bg-[#387440] text-[#fffefc] shadow-[0_1.2px_0_#19341d]'
        : 'border-[#ccc] bg-white shadow-[0_2px_0_#ccc]',
      className
    )}
  >
    {checked ? (
      <span className="absolute -inset-[2.5px] flex items-center justify-center">
        <CvTickIcon />
      </span>
    ) : null}
  </button>
);

/* Review-list pill (amber "Check end date" / plain "Add proof later"). */
export const CvPill = ({ tone = 'amber', children }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold',
      tone === 'amber' ? 'bg-[#faf4e8] text-[#1c2a21]' : 'bg-white text-[#737373]'
    )}
  >
    {children}
  </span>
);

/* Review group card (Work / Education / Skills / Certificates). */
export const CvGroup = ({ title, children }) => (
  <section className="flex flex-col rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[16px]">
    <h3 className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
      {title}
    </h3>
    {children}
  </section>
);

export const CvWarningText = ({ children }) => (
  <p className="m-0 font-sans text-[12px] leading-[18px] text-[#575755]">{children}</p>
);
