import Button from '../../../../ui/Button.jsx';
import { PreviewClockIcon } from './PreviewIcons.jsx';

/*
 * PreviewExpired — the card shown when the 30-minute preview link ran out (Figma 7.8.3e "expired": white, r20, p56, gap14, centred; 60 px #faf4e8 circle with the
 * clock, 22/26 600 title, 15/22 #575755 text, primary "Open a fresh preview"). Props: minutes, onFresh.
 */
const PreviewExpired = ({ minutes, onFresh }) => (
  <section
    aria-label="Preview expired"
    className="flex flex-col items-center gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(24px,4vw,56px)] text-center"
  >
    <span className="inline-flex size-[60px] items-center justify-center rounded-full bg-[#faf4e8] text-[#8a6100]">
      <PreviewClockIcon className="size-[28px]" />
    </span>
    <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
      This preview has expired
    </h2>
    <p className="m-0 max-w-[520px] font-sans text-[15px] leading-[22px] text-[#575755]">
      {`Preview links last ${minutes} minutes so drafts stay private. Your changes are still saved.`}
    </p>
    <Button variant="primary" size="lg" onClick={onFresh} data-autofocus>
      Open a fresh preview
    </Button>
  </section>
);

export default PreviewExpired;
