import Modal from './Modal.jsx';
import { classNames } from '../../utils/classNames.js';

/*
 * CenteredIconDialog — the recruiter prompt dialog with a centred header: a 56px #ebf1ec icon tile, a Bricolage 28/600 centred title, a centred 14/24 #575755 body, the children (left-aligned, gap 12), then a centred footer row (Figma "Modal · Move 3 candidates to Screening" 10173:16179, "Akosua accepted your offer!" 10173:19440, "Akosua declined the offer" 10173:20098; 24px radius, 32px padding, gap 16, on the #0b1a0f 45 % scrim).
 * Sibling of `ui/IconTileDialog` (left-aligned header with a 44px tile and a close button); built on `ui/Modal` (focus containment, Escape, scroll lock, bottom sheet below `sm`).
 * Props: icon (node, the 28px glyph), iconTileClassName (tile fill + glyph colour, default green; red for the "declined" tone), title, body, onClose, widthClassName (literal `!max-w-[…px]` class, default 520px), children, footer.
 */
const CenteredIconDialog = ({
  icon,
  iconTileClassName = 'bg-[#ebf1ec] text-[#2a5730]',
  title,
  body,
  onClose,
  widthClassName = '!max-w-[520px]',
  children,
  footer,
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
      '!rounded-[24px] p-[32px] sm:!pb-[32px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)] max-sm:!rounded-b-none max-sm:p-[20px]'
    )}
  >
    <div className="flex flex-col items-center gap-[16px]">
      <span
        className={classNames(
          'flex size-[56px] shrink-0 items-center justify-center rounded-[10px]',
          iconTileClassName
        )}
      >
        {icon}
      </span>
      <h2 className="m-0 text-center font-['Bricolage_Grotesque',sans-serif] text-[clamp(22px,2.4vw,28px)] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
        {title}
      </h2>
      <div className="flex w-full flex-col gap-[12px]">
        {body ? (
          <p className="m-0 text-center font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
            {body}
          </p>
        ) : null}
        {children}
      </div>
      {footer ? (
        <div className="flex w-full flex-wrap items-center justify-center gap-[12px]">{footer}</div>
      ) : null}
    </div>
  </Modal>
);

export default CenteredIconDialog;
