import { HeadLink, ProfileCard, ProfileChip } from '../../talentProfile/ProfileTabsUi.jsx';

/*
 * ProgressAboutCard — "card · About" of the student detail (Figma 8595:793, 880x166, p24, r20, 1px #e6e6e6): title 23/29 600, "Read more →", the
 * text (15/23 #595959) and the "My vibe" chips. Read-only (no pencil). Props: about { text, vibe[] }.
 * ⚠️ ASSUMPTION: "Read more →" has no target drawn; it is inert (the About text is already shown in full).
 */

const ProgressAboutCard = ({ about }) => (
  <ProfileCard title="About" link="Read more →" onLink={() => {}}>
    <div className="flex flex-col gap-[16px]">
      <p className="m-0 font-sans text-[15px] leading-[23px] text-[#595959]">{about.text}</p>
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className="font-sans text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#737373]">
          My vibe
        </span>
        {about.vibe.map((v) => (
          <ProfileChip key={v.label} icon={v.icon}>
            {v.label}
          </ProfileChip>
        ))}
      </div>
    </div>
  </ProfileCard>
);

export default ProgressAboutCard;
