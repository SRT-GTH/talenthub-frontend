import { classNames } from '../../../../utils/classNames.js';
import PublicCard from '../ui/PublicCard.jsx';
import { EVIDENCE_KINDS } from './data/showcaseData.js';
import {
  PublicIconChartBar,
  PublicIconFileCheck,
  PublicIconTarget,
  PublicIconThumbUp,
} from './showcaseIcons.jsx';

/*
 * ShowcaseSkillsCard — Figma "Verified skills" 8497:1832 (560x327 on desktop, full width on tablet 8508:352085, phone card 8508:138).
 * Header "Verified skills" · aside "4 skills · with evidence" (phone: "4 skills"). Rows (desktop): name 16/19 600, detail 13/16 400 #595959, and
 * the evidence chip on the right (pill p 6/10, icon 14 + 12/14 600): Assessment #ebf1ec/#2a5730 · Certificate #eaeffb/#244a9f ·
 * Skills Lab #faf4e8/#785910 · Endorsed #f2f2ee/#575755; rows separated by 1px #e7e7e7, py 12, list px24 pb20.
 * Phone rows: name 14/17, detail 12/14, a neutral #f2f2ee chip with the 11/13 label only (no icon), gap 12.
 * Every skill carries its evidence kind, so a visitor sees how it was verified. Props: profile
 */

const ICONS = {
  assessment: PublicIconChartBar,
  certificate: PublicIconFileCheck,
  skillsLab: PublicIconTarget,
  endorsed: PublicIconThumbUp,
};

const ShowcaseSkillsCard = ({ profile, className }) => {
  const count = profile.skills.length;
  return (
    <PublicCard
      id="showcase-skills"
      title="Verified skills"
      hint={`${count} skills · with evidence`}
      hintCompact={`${count} skills`}
      bodyClassName="px-[16px] pb-[16px] md:px-[24px] md:pb-[20px]"
      className={className}
    >
      <ul
        aria-label="Verified skills"
        className="m-0 flex list-none flex-col gap-[12px] p-0 md:gap-0"
      >
        {profile.skills.map((skill, i) => {
          const kind = EVIDENCE_KINDS[skill.evidence];
          const Icon = ICONS[skill.evidence];
          return (
            <li
              key={skill.id}
              className={classNames(
                'flex items-center justify-between gap-[12px] md:py-[12px]',
                i < count - 1 && 'md:border-b md:border-solid md:border-b-[#e7e7e7]'
              )}
            >
              <div className="flex min-w-0 flex-col gap-[2px]">
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21] md:text-[16px] md:leading-[19px]">
                  {skill.name}
                </span>
                <span className="text-[12px] leading-[14px] text-[#595959] md:text-[13px] md:leading-[16px]">
                  {skill.detail}
                </span>
              </div>
              <span
                className={classNames(
                  'inline-flex shrink-0 items-center gap-[6px] rounded-full bg-[#f2f2ee] px-[8px] py-[4px] text-[12px] leading-[14px] font-semibold text-[#1c2a21]',
                  'md:px-[10px] md:py-[6px]',
                  kind.chip
                )}
              >
                <Icon className={classNames('hidden size-[14px] shrink-0 md:block', kind.icon)} />
                {kind.label}
              </span>
            </li>
          );
        })}
      </ul>
    </PublicCard>
  );
};

export default ShowcaseSkillsCard;
