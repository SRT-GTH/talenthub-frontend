import { ThreeInARowCheckCircleIcon } from './ThreeInARowIcons.jsx';

/*
 * ThreeInARowHead — eyebrow ("GAME 2 · INTERMEDIATE"), headline, sentence, "Untimed" chip + Measures (Figma "head" 9619:63173).
 */
const ThreeInARowHead = ({ eyebrow, headline, sentence, skills }) => (
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
    <div className="flex flex-wrap items-center gap-[8px]">
      <span className="inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
        <ThreeInARowCheckCircleIcon className="size-[14px] shrink-0" />
        Untimed
      </span>
      <span className="ml-[16px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959] max-lg:ml-[4px]">
        Measures
      </span>
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730]"
        >
          {skill}
        </span>
      ))}
    </div>
  </header>
);

export default ThreeInARowHead;
