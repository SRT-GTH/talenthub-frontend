import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import { classNames } from '../../../../../utils/classNames.js';
import { PublishCloseIcon } from './PublishIcons.jsx';

/*
 * PublishModalShell — the white card of every publish-flow dialog (Figma "Modal · …" 11023:76402 etc.): 560 wide (520 for the small
 * confirms), r24, 1px ink@.10, p28, gap16, header = 44 tile (r13) + 24/600 title + 30 round close; scrim #1c2a21 at 55 %.
 * Props: label (dialog name), title, tone ('green' | 'blue' | 'red' tile colour), icon (a component, 21px), onClose, narrow, children.
 * Figma centres the card 65px above the viewport middle (frame centre y 558 of 1143): kept on tall desktop viewports (5.7vh).
 * Below sm the card is a full-width sheet with 12px gutters (AgencyDialog keeps 16px of padding, the card is 8px wider on each side).
 */
const TILES = {
  green: 'bg-[#ebf1ec]/50 text-[#387440]',
  blue: 'bg-[#eaeffb] text-[#387440]',
  red: 'bg-[#f9ebea]/50 text-[#b42318]',
};

const PublishModalShell = ({ label, title, tone = 'green', icon, onClose, narrow, children }) => {
  const Glyph = icon;
  return (
    <AgencyDialog
      label={label ?? title}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName={`shrink-0 ${narrow ? 'w-[min(520px,calc(100vw-24px))]' : 'w-[min(560px,calc(100vw-24px))]'} min-[1280px]:[@media(min-height:900px)]:-translate-y-[5.7vh]`}
    >
      <div className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(18px,5vw,28px)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]">
        <div className="flex min-h-[44px] items-center gap-[12px]">
          <span
            className={classNames(
              'flex size-[44px] shrink-0 items-center justify-center rounded-[13px]',
              TILES[tone]
            )}
          >
            <Glyph className="size-[21px]" />
          </span>
          <h2 className="m-0 min-w-0 flex-1 font-sans text-[clamp(20px,5vw,24px)] leading-[29px] font-semibold tracking-[-0.24px] text-[#1c2a21]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="relative flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21] before:absolute before:-inset-[2px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <PublishCloseIcon className="size-[18px]" />
          </button>
        </div>
        {children}
      </div>
    </AgencyDialog>
  );
};

export default PublishModalShell;
