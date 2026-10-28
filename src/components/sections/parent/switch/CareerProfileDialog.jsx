import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import Button from '../../../ui/Button.jsx';
import spotProfile from '../../../../assets/parent/switch-spot-profile.svg';
import checkIcon from '../../../../assets/parent/switch-check.svg';
import { CAREER_DIALOG } from './switchData.js';

const log = debug('CareerProfileDialog');

/*
 * CareerProfileDialog — PD-04 "Build your own career profile" (Figma 10037:5838, modal 10037:6574): 560 wide, p28, gap16; the 88px spot and the close button, a 26/600 title, a 14/400 body, a mint
 * card (r16, p16) of three checked points and the buttons on the right: "Not now" (mint, #165d3a label) and "Start with Career Buddy" (primary, 240×52). `?modal=career-profile`.
 * Props: onClose (Not now, the X and Esc), onStart.
 */
const CareerProfileDialog = ({ onClose, onStart }) => (
  <DialogCard label={CAREER_DIALOG.title} onClose={onClose} width={560} gap={16}>
    <div className="flex items-start justify-between gap-[16px]">
      <img src={spotProfile} alt="" aria-hidden="true" className="size-[88px] shrink-0" />
      <DialogCloseButton onClose={onClose} />
    </div>
    <h2 className="m-0 text-[26px] leading-[31px] font-semibold text-[#1c2a21]">
      {CAREER_DIALOG.title}
    </h2>
    <p className="m-0 text-[14px] leading-[17px] text-[#575755]">{CAREER_DIALOG.body}</p>
    <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[16px] bg-[#ebf1ec] p-[16px]">
      {CAREER_DIALOG.points.map((p) => (
        <li key={p} className="flex items-center gap-[10px]">
          <img src={checkIcon} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
          <span className="text-[13.5px] leading-[16px] font-medium text-[#1c2a21]">{p}</span>
        </li>
      ))}
    </ul>
    <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[2px]">
      <button
        type="button"
        onClick={onClose}
        className="h-[52px] cursor-pointer rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(28,42,33,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {CAREER_DIALOG.later}
      </button>
      <Button
        size="sm"
        onClick={() => {
          log('start with Career Buddy');
          onStart?.();
        }}
      >
        {CAREER_DIALOG.start}
      </Button>
    </div>
  </DialogCard>
);

export default CareerProfileDialog;
