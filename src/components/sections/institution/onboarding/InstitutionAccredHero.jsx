import { ACCREDITATION as U } from './data/institutionOnboardingData.js';
import { CalendarIcon, FileCheckIcon, LabelIcon } from './institutionOnboardingIcons.jsx';

const ICONS = { fileCheck: FileCheckIcon, calendar: CalendarIcon, label: LabelIcon };

/*
 * InstitutionAccredHero — the cream hero band of the accreditation upload page (Figma 11.1.2a hero, 1728 x 230): copy on the left (eyebrow 11/13 700 +1.2 #387440, 44/48 600 headline
 * with the green second half, 16/24 #595959 lead, 660 wide) and the "What we check" card on the right (460 wide, white, 1px ink@.10, r24, p 20/22: three rows of a
 * 30 tile + 13/16 600 title + 12/14 text).
 */

const InstitutionAccredHero = () => (
  <section
    aria-label="Upload your accreditation documents"
    className="flex flex-col gap-[24px] bg-[linear-gradient(110deg,#e9efe8_0%,#f3f1e6_60%,#fbf0e2_100%)] px-[clamp(16px,3.7vw,64px)] py-[34px] lg:flex-row lg:items-start lg:justify-between lg:gap-[48px]"
  >
    <div className="flex max-w-[760px] flex-col gap-[12px]">
      <p className="m-0 font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] max-lg:text-[12px]">
        {U.eyebrow}
      </p>
      <h1 className="m-0 font-sans text-[clamp(30px,2.72vw,47px)] leading-[1.09] font-semibold tracking-[-0.66px] text-[#1c2a21]">
        {U.title[0]}
        <span className="text-[#387440]">{U.title[1]}</span>
      </h1>
      <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959]">{U.lead}</p>
    </div>
    <aside
      aria-label="What we check"
      className="flex w-full shrink-0 flex-col gap-[10px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white px-[22px] py-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)] lg:w-[460px]"
    >
      <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        What we check
      </h2>
      <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
        {U.checks.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <li key={c.id} className="flex items-center gap-[10px]">
              <span
                aria-hidden="true"
                className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-[#ebf1ec] text-[#387440]"
              >
                <Icon className="size-[16px]" />
              </span>
              <span className="flex flex-col gap-px">
                <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
                  {c.title}
                </span>
                <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
                  {c.text}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  </section>
);

export default InstitutionAccredHero;
