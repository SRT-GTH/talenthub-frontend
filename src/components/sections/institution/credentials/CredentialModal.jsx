import { classNames } from '../../../../utils/classNames.js';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { RecordsIconClose } from '../records/recordsIcons.jsx';

/*
 * CredentialModal — the white r28 dialog card of the credential screens (Figma "Modal · Add a certificate" 8593:389543 820 wide, "Modal · Delete certificate" 8593:390243 620 wide, 11.2.4g/h 820):
 * p36/40/32, a 32px chip (green for the actions, white for the revoke), the 32/38 heading (its last words may be green), a 15/22 #595959 sentence and the 40px close button (#f3f3ef) at 24/24.
 * Behaviour (AgencyDialogShell): role dialog, focus moves in (the element marked data-autofocus, else the panel), Tab is trapped, Esc / scrim / close call onClose, focus returns to the opener.
 * Props: label (accessible name), chip, chipTone green|plain, heading (node), description (node), descriptionId, onClose, width (max px), gap (px between the blocks), scrim (colour class), children.
 */
const CredentialModal = ({
  label,
  chip,
  chipTone = 'green',
  heading,
  description,
  descriptionId,
  onClose,
  width = 820,
  gap = 20,
  scrim = 'bg-[#0b1a0f]/55',
  children,
}) => (
  <AgencyDialogShell
    title={label}
    onClose={onClose}
    scrim={scrim}
    describedBy={description ? descriptionId : undefined}
  >
    <div
      style={{ maxWidth: width, gap }}
      className="relative mx-auto flex w-full flex-col rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white px-[clamp(20px,2.4vw,40px)] pt-[36px] pb-[32px] font-sans shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06),0_40px_100px_rgba(0,0,0,0.2)]"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-[24px] right-[24px] flex size-[40px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <RecordsIconClose className="size-[16px]" />
      </button>
      <header className="flex flex-col gap-[8px] pr-[44px]">
        <span
          className={classNames(
            'inline-flex h-[32px] w-fit items-center rounded-full border border-solid px-[14px] text-[13px] leading-[16px] font-semibold',
            chipTone === 'green'
              ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
              : 'border-[#e1eae2] bg-white text-[#595959]'
          )}
        >
          {chip}
        </span>
        <h2 className="m-0 text-[26px] leading-[32px] font-semibold text-[#1c2a21] md:text-[32px] md:leading-[38px]">
          {heading}
        </h2>
        {description ? (
          <p id={descriptionId} className="m-0 text-[15px] leading-[22px] text-[#595959]">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  </AgencyDialogShell>
);

export default CredentialModal;
