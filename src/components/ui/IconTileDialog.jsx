import Modal from './Modal.jsx';
import { classNames } from '../../utils/classNames.js';

/*
 * IconTileDialog — the recruiter confirm / form dialog: a 24px-radius white card on a #0b1a0f 45 % scrim (Figma "Modal · Invite Kofi to apply" 10102:42398 and "Modal · Add Kofi to a pipeline" 10102:44650).
 * Header: a 44px #ebf1ec tile with a 22px glyph, a Bricolage 24/600 title, a 14/24 #575755 body and a 32px #fffefc round close button. Below: the children (gap 14), then the footer slot (gap 20 above it).
 * Built on `ui/Modal` (focus containment, Escape, scroll lock; a bottom sheet below `sm`).
 * Props: icon (node, the 22px glyph, coloured by the caller), title, body, onClose, widthClassName (a literal `!max-w-[…px]` class, default 600px; 540px for the pipeline dialog), iconTileClassName (add-only: tile fill + glyph colour, default green; the pipeline's Not progressing dialog passes red), children, footer, className.
 */
const CloseGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-[16px]">
    <path
      d="M12 4L4 12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 4L12 12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTileDialog = ({
  icon,
  title,
  body,
  onClose,
  widthClassName = '!max-w-[600px]',
  iconTileClassName = 'bg-[#ebf1ec] text-[#2a5730]',
  children,
  footer,
  className,
}) => (
  <Modal
    isOpen
    onClose={onClose}
    size="sm"
    ariaLabel={title}
    showClose={false}
    scrollHint={false}
    initialFocus="dialog"
    className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
    contentClassName={classNames(
      widthClassName,
      '!rounded-[24px] p-[24px] sm:!pb-[24px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)] max-sm:!rounded-b-none max-sm:p-[20px]',
      className
    )}
  >
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-start gap-[12px]">
        <span
          className={classNames(
            'flex size-[44px] shrink-0 items-center justify-center rounded-[10px]',
            iconTileClassName
          )}
        >
          {icon}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
            {title}
          </h2>
          {body ? (
            <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
              {body}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#fffefc] text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <CloseGlyph />
        </button>
      </div>
      <div className="flex flex-col gap-[14px]">{children}</div>
      {footer}
    </div>
  </Modal>
);

export default IconTileDialog;
