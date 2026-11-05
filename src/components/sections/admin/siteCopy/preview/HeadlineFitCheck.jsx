import Button from '../../../../ui/Button.jsx';
import { PreviewWarningIcon } from './PreviewIcons.jsx';

/*
 * HeadlineFitCheck — the "How it fits" card beside the phone preview (Figma 7.8.3c, 400 wide, white, r20, p22, gap12): a warning banner that the new headline
 * wraps onto N lines, the original headline with its own line count and an "Edit headline" button. N comes from the measured phone frame (MockHero).
 * Props: lines ({ now, original }), original (the published headline), editTo (link to the section editor).
 */
const HeadlineFitCheck = ({ lines, original, editTo }) => (
  <section
    aria-label="How it fits"
    className="flex w-full max-w-[400px] flex-col gap-[12px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[22px]"
  >
    <h2 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
      How it fits
    </h2>
    <div
      role="status"
      className="flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px]"
    >
      <PreviewWarningIcon className="size-[18px] shrink-0 text-[#8a6100]" />
      <p className="m-0 font-sans text-[14px] leading-[20px] font-medium text-[#463409]">
        {`The new headline wraps onto ${lines.now} lines on phones. Shorter headlines read better on small screens.`}
      </p>
    </div>
    <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">
      {`Original: “${original}” (${lines.original} ${lines.original === 1 ? 'line' : 'lines'})`}
    </p>
    <div>
      <Button to={editTo} variant="tertiary" size="sm" className="!py-[10px]">
        Edit headline
      </Button>
    </div>
  </section>
);

export default HeadlineFitCheck;
