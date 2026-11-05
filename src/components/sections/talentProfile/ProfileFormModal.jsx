import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import { HEAD } from '../talentHome/coreUi.jsx';
import { ProfileEditDraftLockIcon, ProfileEditModalCloseIcon } from '../../shared/assets.jsx';

/*
 * The profile's form dialog (2026-11-01): the same shell, fields and buttons as AddExperienceModal (P-09), shared by
 * the education editor and the Work style editor. Bottom sheet on phones, centred card from `sm`.
 */

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const INPUT_BASE =
  'block h-[51px] w-full rounded-[10px] border border-[#ccc] bg-white pr-[16px] pl-[20px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#8c8c8c] ' +
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)] ' +
  'focus:border-2 focus:border-[#c1d4c4] focus:bg-[#fffefc] focus:pr-[15px] focus:pl-[19px] ' +
  'aria-[invalid=true]:border-[#c0392b]';

export const FieldLabel = ({ htmlFor, id, children, required, hint }) => (
  <div className="flex items-center justify-between gap-[8px]">
    <label
      htmlFor={htmlFor}
      id={id}
      className="flex gap-px text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="w-[6px] text-[14px] font-semibold text-[#2e8b57]">
          *
        </span>
      ) : null}
    </label>
    {hint ? (
      <span className="text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">{hint}</span>
    ) : null}
  </div>
);

/* A pill toggle (multi-select chips: job types, start options). */
export const ChoiceChip = ({ on, onClick, children, role = 'checkbox' }) => (
  <button
    type="button"
    role={role}
    aria-checked={on}
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[36px] cursor-pointer items-center rounded-full border px-[14px] py-[7px] text-[13px] leading-[normal] font-semibold',
      on
        ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
        : 'border-[#e6e6e6] bg-white text-[#595959]',
      FOCUS_RING
    )}
  >
    {children}
  </button>
);

/* The on/off switch AddExperienceModal uses for "I'm doing this now". */
export const Switch = ({ on, onToggle, labelledBy }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-labelledby={labelledBy}
    onClick={onToggle}
    className={classNames(
      'relative h-[24px] w-[40px] shrink-0 cursor-pointer rounded-[12px] transition-colors',
      on ? 'bg-[#387440]' : 'bg-[#bfbfbf]',
      FOCUS_RING
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'absolute top-[3px] size-[18px] rounded-full bg-white transition-[left]',
        on ? 'left-[19px]' : 'left-[3px]'
      )}
    />
  </button>
);

const ProfileFormModal = ({
  title,
  subtitle,
  onClose,
  onSubmit,
  initialFocus,
  error = '',
  saving = false,
  submitLabel = 'Save',
  footerNote = 'Nothing is saved until you hit Save',
  extraAction = null,
  children,
}) => {
  const uid = useId();
  const dialogRef = useRef(null);
  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: onClose,
    initialFocus,
    lockScroll: true,
  });

  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden bg-[rgba(28,42,33,0.55)] sm:items-start sm:px-[clamp(12px,2vw,32px)] sm:pt-[clamp(16px,5vh,68px)] sm:pb-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        aria-describedby={subtitle ? `${uid}-sub` : undefined}
        tabIndex={-1}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={classNames(
          'flex max-h-full w-full max-w-[680px] flex-col gap-[18px] overflow-y-auto rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white p-[clamp(16px,1.6vw,28px)] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]',
          'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]',
          'max-sm:max-h-[100dvh] max-sm:rounded-b-none max-sm:pb-[calc(16px+env(safe-area-inset-bottom))]'
        )}
      >
        <div className="flex items-center gap-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2
              id={`${uid}-title`}
              className={classNames(HEAD, 'text-[29px] leading-[1.2] text-[#1c2a21]')}
            >
              {title}
            </h2>
            {subtitle ? (
              <p id={`${uid}-sub`} className="text-[14px] leading-[normal] text-[#737373]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={classNames(
              'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e6e6e6] bg-transparent',
              FOCUS_RING
            )}
          >
            <ProfileEditModalCloseIcon className="size-[16px]" />
          </button>
        </div>

        {children}

        {error ? (
          <p role="alert" className="text-[13px] leading-[normal] font-medium text-[#c0392b]">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-[10px] pt-[6px]">
          <p className="flex min-w-0 flex-1 items-center gap-[5px] text-[12px] leading-[normal] text-[#737373]">
            <ProfileEditDraftLockIcon className="size-[14px] shrink-0" />
            {footerNote}
          </p>
          {extraAction}
          <Button variant="tertiary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            {saving ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
};

export default ProfileFormModal;
