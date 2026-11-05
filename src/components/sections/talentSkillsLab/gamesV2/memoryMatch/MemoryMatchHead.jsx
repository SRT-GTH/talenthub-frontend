import { classNames } from '../../../../../utils/classNames.js';
import { LabStopwatchIcon } from '../../LabPlayIcons.jsx';
import { GameV2CheckCircleSmIcon } from '../GameV2PlatformIcons.jsx';
import { MEMORY_COPY } from './memoryMatchData.js';

/*
 * MemoryMatchHead — the "head" of GV-04: kicker "INTERMEDIATE · 4×4 CARDS" (11.5/700, #387440, caps) · title "Find every pair."
 * (36/43, Bricolage in Playful) · prompt (15/22 #595959) · status pills (clock, pairs) · "Measures" + three skill chips.
 * Pills are 30px high, white, 1px ink@.12 (Figma "stat · …"); chips #ebf1ec with #2a5730 text.
 */
const PILL =
  'inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold';

const MemoryMatchHead = ({ kicker, timeLabel, pairsLabel }) => (
  <div className="flex flex-col gap-[10px]">
    <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.06em] text-[#387440] max-lg:text-[12px]">
      {kicker}
    </p>
    <h2 className="m-0 font-sans text-[clamp(28px,2.1vw,36px)] leading-[1.19] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
      {MEMORY_COPY.title}
    </h2>
    <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
      {MEMORY_COPY.prompt}
    </p>
    <ul className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0" aria-label="Status">
      <li className={classNames(PILL, 'bg-white text-[#1c2a21]')}>
        <LabStopwatchIcon className="size-[14px] shrink-0" />
        {timeLabel}
      </li>
      <li className={classNames(PILL, 'bg-white text-[#1c2a21]')}>
        <GameV2CheckCircleSmIcon className="size-[14px] shrink-0" />
        {pairsLabel}
      </li>
      <li
        aria-hidden="true"
        className="ml-[16px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959] max-lg:text-[12px]"
      >
        Measures
      </li>
      {MEMORY_COPY.measures.map((label) => (
        <li key={label} className={classNames(PILL, 'bg-[#ebf1ec] text-[#2a5730]')}>
          {label}
        </li>
      ))}
    </ul>
  </div>
);

export default MemoryMatchHead;
