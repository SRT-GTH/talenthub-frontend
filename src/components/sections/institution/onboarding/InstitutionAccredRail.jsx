import { ACCREDITATION as U } from './data/institutionOnboardingData.js';
import { BellIcon, CheckFillIcon, TimeClockIcon, UserIcon } from './institutionOnboardingIcons.jsx';

const ICONS = {
  checkFill: CheckFillIcon,
  timeClock: TimeClockIcon,
  user: UserIcon,
  bell: BellIcon,
};

/*
 * InstitutionAccredRail — the right rail of the accreditation page (Figma "Rail" 8596:1164, 464 wide, gap 20): "What the badges mean" (Verified / Pending / Needs more info) and "Renewals" cards
 * (white, 1px ink@.10, r24, p 24, gap 14; 18/22 600 title, rows of a 16 glyph + 14/17 600 title + 13/19 #595959 text).
 */

const Row = ({ icon, title, text }) => {
  const Icon = ICONS[icon];
  return (
    <li className="flex items-start gap-[12px]">
      <Icon className="mt-[2px] size-[16px] shrink-0 text-[#387440]" />
      <span className="flex flex-col gap-[2px]">
        <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {title}
        </span>
        <span className="font-sans text-[13px] leading-[19px] text-[#595959]">{text}</span>
      </span>
    </li>
  );
};

const CARD =
  'flex flex-col gap-[14px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]';

const InstitutionAccredRail = () => (
  <div className="flex w-full flex-col gap-[20px] lg:w-[464px] lg:shrink-0">
    <section aria-labelledby="accred-badges" className={CARD}>
      <h2
        id="accred-badges"
        className="m-0 font-sans text-[18px] leading-[22px] font-semibold text-[#1c2a21]"
      >
        What the badges mean
      </h2>
      <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
        {U.badges.map((b) => (
          <Row key={b.id} {...b} />
        ))}
      </ul>
    </section>
    <section aria-labelledby="accred-renewals" className={CARD}>
      <h2
        id="accred-renewals"
        className="m-0 font-sans text-[18px] leading-[22px] font-semibold text-[#1c2a21]"
      >
        {U.renewals.title}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
        <Row icon={U.renewals.icon} title={U.renewals.itemTitle} text={U.renewals.text} />
      </ul>
    </section>
  </div>
);

export default InstitutionAccredRail;
