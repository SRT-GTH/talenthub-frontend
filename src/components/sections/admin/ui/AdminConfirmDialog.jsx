import { classNames } from '../../../../utils/classNames.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AdminArrowRightIcon } from '../adminIcons.jsx';

/*
 * AdminConfirmDialog — the centred confirmation card of the admin screens (Figma "div.vid-card": 528 x 296+, white, r24, p 48/64, scrim #1c2a21 at 70 %):
 * 32/40 600 title, 16/24 #575755 body (432 wide, 10 gap), optional field slot, then the buttons 36 below: a primary (green "→" or red, 14/600, 2px border, 4px
 * shelf, r10) and a white secondary (2px ink@.30, r14). The card grows with its title (554 / 602 wide in the frames that have a longer one).
 * Used by: reactivate, second approval, reclassify, merge blocked, parent link, the sign-in notices.
 * Props: title, body, primary { label, tone: 'green' | 'red', arrow }, secondary (label), onPrimary, onSecondary (defaults to onClose), onClose, children (fields).
 */

const PRIMARY = {
  green: 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#2a5730] focus-visible:outline-[#387440]',
  red: 'border-[#73221a] bg-[#c0392b] shadow-[0_4px_0_#73221a] focus-visible:outline-[#c0392b]',
};

const AdminConfirmDialog = ({
  title,
  body,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  onClose,
  children,
  label,
}) => (
  <AgencyDialog
    label={label ?? title}
    onClose={onClose}
    scrimClassName="bg-[#1c2a21]/70"
    panelClassName="w-max min-w-[min(528px,calc(100vw-32px))] max-w-[calc(100vw-32px)]"
  >
    <div className="flex flex-col items-center gap-[36px] rounded-[24px] bg-white px-[clamp(20px,9vw,64px)] py-[clamp(32px,10vw,48px)] text-center shadow-[0_4px_0_rgba(0,0,0,0.1),0_40px_100px_rgba(0,0,0,0.25)]">
      <div className="flex w-full max-w-[432px] flex-col items-center gap-[10px]">
        <h2 className="m-0 font-sans text-[clamp(24px,6vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
          {title}
        </h2>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#575755]">{body}</p>
      </div>
      {children ? <div className="w-full max-w-[432px] text-left">{children}</div> : null}
      <div className="flex flex-wrap items-center justify-center gap-[8px]">
        <button
          type="button"
          data-autofocus
          onClick={onPrimary}
          className={classNames(
            'inline-flex min-h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-white focus-visible:outline-2 focus-visible:outline-offset-2',
            PRIMARY[primary.tone ?? 'green']
          )}
        >
          {primary.label}
          {primary.arrow ? <AdminArrowRightIcon className="size-[20px]" /> : null}
        </button>
        <button
          type="button"
          onClick={onSecondary ?? onClose}
          className="inline-flex min-h-[44px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {secondary}
        </button>
      </div>
    </div>
  </AgencyDialog>
);

export default AdminConfirmDialog;
