import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import { classNames } from '../../../../../utils/classNames.js';
import { CloseIcon } from './FieldsIcons.jsx';

/*
 * FieldDialog — the modal card of the Site copy field dialogs (Figma "Modal · …": scrim #1c2a21 at 55 %, white r24 card, 1 px ink 10 % ring, 28 padding,
 * 16 gap; header = 44 px tile (#ebf1ec at 50 %, or #f9ebea at 50 % for a block), 24 / 600 title, 30 px close button #f8f8f4).
 * Built on AgencyDialog (portal, focus trap, Esc, scroll lock). Below sm the card takes the full width with 16 px gutters (AgencyDialog's own padding).
 * Props: label (accessible name + title), icon (tile glyph, ~21 px), tone ('green' | 'red'), width (max px, default 900), onClose, children.
 */
const FieldDialog = ({ label, icon, tone = 'green', width = 900, onClose, children }) => (
  <AgencyDialog
    label={label}
    onClose={onClose}
    scrimClassName="bg-[#1c2a21]/55"
    panelClassName="w-full"
  >
    <div
      style={{ maxWidth: width }}
      className="mx-auto flex w-full flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,2vw,28px)] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-[12px]">
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[44px] shrink-0 items-center justify-center rounded-[13px]',
            tone === 'red' ? 'bg-[#f9ebea]/50 text-[#b42318]' : 'bg-[#ebf1ec]/50 text-[#27522e]'
          )}
        >
          {icon}
        </span>
        <h2
          tabIndex={-1}
          data-autofocus
          className="m-0 min-w-0 outline-none flex-1 font-sans text-[clamp(19px,1.4vw,24px)] leading-[1.2] font-semibold tracking-[-0.24px] text-[#1c2a21]"
        >
          {label}
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="relative flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] before:absolute before:inset-[-4px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <CloseIcon className="size-[18px]" />
        </button>
      </div>
      {children}
    </div>
  </AgencyDialog>
);

export default FieldDialog;
