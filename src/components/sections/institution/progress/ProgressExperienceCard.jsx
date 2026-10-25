import { ProfileCard, ProfileChip } from '../../talentProfile/ProfileTabsUi.jsx';
import { GLYPHS } from '../../talentProfile/profileTabsStyles.js';

/*
 * ProgressExperienceCard — "card · Experience" (Figma 8595:851, 880x332): rows with a 48px tinted glyph tile, title 16/600, meta 13 #737373, text 14 and
 * tag chips, separated by a 1px #e6e6e6 rule. Read-only. Props: items[].
 * ⚠️ ASSUMPTION: "See all 2 →" has no target drawn; it is inert.
 */

const ProgressExperienceCard = ({ items }) => (
  <ProfileCard title="Experience" link="See all 2 →" onLink={() => {}}>
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {items.map((exp, i) => {
        const Glyph = GLYPHS[exp.icon];
        return (
          <li key={exp.key} className="flex flex-col gap-[16px]">
            {i > 0 ? <span aria-hidden="true" className="h-px w-full bg-[#e6e6e6]" /> : null}
            <div className="flex items-start gap-[16px]">
              <span
                aria-hidden="true"
                className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-solid border-[#1c2a21]"
                style={{ background: exp.iconBg }}
              >
                <Glyph className="size-[23px]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
                <h3 className="m-0 font-sans text-[16px] leading-[normal] font-semibold text-[#1c2a21]">
                  {exp.title}
                </h3>
                <p className="m-0 font-sans text-[13px] leading-[normal] whitespace-pre-wrap text-[#737373]">
                  {exp.meta}
                </p>
                <p className="m-0 font-sans text-[14px] leading-[normal] text-[#595959]">
                  {exp.text}
                </p>
                <div className="flex flex-wrap gap-[6px] pt-[6px]">
                  {exp.tags.map((t) => (
                    <ProfileChip key={t}>{t}</ProfileChip>
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </ProfileCard>
);

export default ProgressExperienceCard;
