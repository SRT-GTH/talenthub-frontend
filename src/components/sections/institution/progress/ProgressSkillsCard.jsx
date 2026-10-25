import { classNames } from '../../../../utils/classNames.js';
import {
  GlyphTile,
  HeadLink,
  Meter,
  ProfileCard,
  ProfileChip,
} from '../../talentProfile/ProfileTabsUi.jsx';
import { CARD_PLAIN } from '../../talentProfile/profileTabsStyles.js';

/*
 * ProgressSkillsCard — "card · Top skills" (Figma 8595:805, 880x295): 2x2 grid of skill tiles (glyph tile 40 · name 15/600 · Assessed / Skills Lab /
 * Endorsed chip · 6px meter · note 12 #737373). Read-only. Props: skills[].
 * ⚠️ ASSUMPTION: "See all 7 →" has no target drawn; it is inert (no Skills tab is drawn for the school view).
 */

const ProgressSkillsCard = ({ skills }) => (
  <ProfileCard title="Top skills" link="See all 7 →" onLink={() => {}}>
    <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 @2xl:grid-cols-2">
      {skills.map((item) => (
        <li
          key={item.key}
          className={classNames(
            CARD_PLAIN,
            'flex min-w-0 items-center gap-[12px] rounded-[16px] p-[14px]'
          )}
        >
          <GlyphTile name={item.icon} size={40} glyph={21} />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px]">
            <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
              <span className="font-sans text-[15px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
                {item.name}
              </span>
              <ProfileChip tone={item.chip.tone} icon="check">
                {item.chip.label}
              </ProfileChip>
            </div>
            <Meter pct={item.pct} className="w-full max-w-[300px]" />
            <span className="font-sans text-[12px] leading-[normal] text-[#737373]">
              {item.note}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </ProfileCard>
);

export default ProgressSkillsCard;
