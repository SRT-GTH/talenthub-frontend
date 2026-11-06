import { classNames } from '../../../../../utils/classNames.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import { MediaClose18Icon } from './MediaIcons.jsx';

/*
 * MediaDialogShell — the modal card of the Media library dialogs (Figma "Modal · …" 7.8.9b-g, k): white, 1px ink@.10 border, r24, p28, gap16, shadow
 * 0 1px 2px + 0 2px 8px, scrim #1c2a21 at 55 %. Header row: 44 tile (r13, tone 'green' #ebf1ec@.5 | 'red' #f9ebea@.5 | 'amber' #faf4e8) with a 21 icon,
 * title 24/29 600 ls -0.24, 30 close button (#f8f8f4, round, 18 icon). On phones the card is a full-width sheet with 12px gutters.
 * Props: label, title, icon, tone, width (px, desktop), onClose, children, titleId.
 */
const TILE = {
  green: 'bg-[#ebf1ec]/50',
  red: 'bg-[#f9ebea]/50',
  amber: 'bg-[#faf4e8]',
};

const WIDTH = { 520: 'sm:w-[520px]', 560: 'sm:w-[560px]', 640: 'sm:w-[640px]' };

const MediaDialogShell = ({
  label,
  title,
  icon,
  tone = 'green',
  width = 560,
  focusTitle = true,
  onClose,
  children,
}) => (
  <AgencyDialog
    label={label ?? title}
    onClose={onClose}
    scrimClassName="bg-[#1c2a21]/55"
    panelClassName={classNames('w-[calc(100vw-24px)]', WIDTH[width] ?? WIDTH[560])}
  >
    <div className="flex w-full flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,4vw,28px)] font-sans text-[#1c2a21] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-[12px]">
        <span
          className={classNames(
            'grid size-[44px] shrink-0 place-items-center rounded-[13px] text-[#27522e]',
            TILE[tone]
          )}
        >
          {icon}
        </span>
        <h2
          tabIndex={focusTitle ? -1 : undefined}
          data-autofocus={focusTitle || undefined}
          className="m-0 min-w-0 outline-none flex-1 text-[clamp(20px,5vw,24px)] leading-[1.2] font-semibold tracking-[-0.24px] text-[#1c2a21]"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="relative grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] text-[#1c2a21] before:absolute before:-inset-[1px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <MediaClose18Icon className="size-[18px]" />
        </button>
      </div>
      {children}
    </div>
  </AgencyDialog>
);

export default MediaDialogShell;
