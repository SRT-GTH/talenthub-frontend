import { SwitchSortCheckCircleIcon, SwitchSortClockIcon } from './SwitchSortIcons.jsx';

/*
 * SwitchSortHead — eyebrow, headline, sentence, status chips + "Measures" chips (Figma "head" 9619:57151).
 *   eyebrow 11.5/700 caps #387440 · headline 36/43 (Bricolage in Playful) · sentence 15/22 #595959 · chips 13/600
 */
const CHIP =
  'inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]';
const SKILL =
  'inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730]';

const SwitchSortHead = ({ eyebrow, headline, sentence, timeLeft, tally, skills }) => (
  <header className="flex flex-col gap-[10px]">
    <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.06em] text-[#387440] uppercase max-lg:text-[12px]">
      {eyebrow}
    </p>
    <h1 className="m-0 font-sans text-[clamp(26px,2.1vw,36px)] leading-[1.19] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
      {headline}
    </h1>
    <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
      {sentence}
    </p>
    <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[8px]">
      <span className={CHIP}>
        <SwitchSortClockIcon className="size-[14px] shrink-0" />
        {timeLeft}
      </span>
      <span className={CHIP}>
        <SwitchSortCheckCircleIcon className="size-[14px] shrink-0" />
        {tally}
      </span>
      <span className="ml-[16px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959] max-lg:ml-[4px]">
        Measures
      </span>
      {skills.map((skill) => (
        <span key={skill} className={SKILL}>
          {skill}
        </span>
      ))}
    </div>
  </header>
);

export default SwitchSortHead;
