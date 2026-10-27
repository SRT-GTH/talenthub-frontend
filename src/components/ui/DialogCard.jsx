import AgencyDialog from '../sections/agency/onboarding/AgencyDialog.jsx';
import { classNames } from '../../utils/classNames.js';
import closeGreen from '../../assets/parent/link-close-green.svg';
import closeGrey from '../../assets/parent/link-close-grey.svg';

/*
 * DialogCard — the white modal card of the parent dialogs (Figma "modal · …": r24, #1c2a21 at 10 % hairline, three-layer shadow 0 1 2 / 0 2 8 / 0 24 48, scrim #1c2a21 at 55 %) on the AgencyDialog
 * portal / focus trap / Esc handling. Used by the ward dialogs (Unlink, Who can find), the flag dialogs (Flag a field, Flag again, Re-review) and the link-a-ward dialogs.
 * Props: label (accessible name), onClose, width (px, default 520), padding (px, default 28), gap (px, default 20), className (e.g. 'items-start', 'max-sm:!p-[20px]' — padding is inline), children,
 * focusCard (default true: focus lands on the card itself, so no ring shows on the close button; pass false when the dialog marks its own control with data-autofocus).
 * <DialogCloseButton> is its 36px round close button: tone 'green' (#f8f8f4 face, green X) or 'grey' (#f1f1ee face, #575755 X) — Figma draws both.
 */
const DialogCard = ({
  label,
  onClose,
  width = 520,
  padding = 28,
  gap = 20,
  focusCard = true,
  className,
  children,
}) => (
  <AgencyDialog label={label} onClose={onClose} scrimClassName="bg-[#1c2a21]/55">
    <div
      tabIndex={focusCard ? -1 : undefined}
      data-autofocus={focusCard ? '' : undefined}
      style={{ width: `min(${width}px, calc(100vw - 32px))`, padding, gap }}
      className={classNames(
        'flex flex-col overflow-clip rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white font-sans shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04),0_24px_48px_rgba(28,42,33,0.12)] outline-none',
        className
      )}
    >
      {children}
    </div>
  </AgencyDialog>
);

export const DialogCloseButton = ({ onClose, tone = 'green' }) => (
  <button
    type="button"
    aria-label="Close"
    onClick={onClose}
    className={classNames(
      'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      tone === 'grey' ? 'bg-[#f1f1ee]' : 'bg-neutral'
    )}
  >
    <img
      src={tone === 'grey' ? closeGrey : closeGreen}
      alt=""
      aria-hidden="true"
      className="size-[16px]"
    />
  </button>
);

export default DialogCard;
