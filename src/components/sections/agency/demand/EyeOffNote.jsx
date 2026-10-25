import { DemandEyeOffIcon } from './demandIcons.jsx';

/*
 * EyeOffNote — the centred "hidden" body of a suppressed chart card (Figma 8707:426050 eye-off 28px #575755, title 16/19 600 #1c2a21, message 13/16 #575755, max 360, gap 10).
 * Props: title, message. role="status" so a screen reader hears why the chart is empty.
 */

const EyeOffNote = ({ title, message }) => (
  <div
    role="status"
    className="mx-auto flex min-h-[180px] w-full max-w-[360px] flex-1 flex-col items-center justify-center gap-[10px] py-[24px] text-center font-sans"
  >
    <DemandEyeOffIcon className="size-[28px] text-[#575755]" />
    <p className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">{title}</p>
    <p className="m-0 text-[13px] leading-[16px] text-[#575755]">{message}</p>
  </div>
);

export default EyeOffNote;
