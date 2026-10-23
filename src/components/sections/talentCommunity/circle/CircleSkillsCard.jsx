import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleLockIcon, CircleVerifiedIcon } from './circleIcons.jsx';
import CircleButton from './CircleButton.jsx';
import CircleMutualFaces from './CircleMutualFaces.jsx';
import { CARD, HEADING } from './circleStyles.js';

const FACES = {
  figma: ['kwame-boateng', 'abena-owusu'],
  'user-research': ['efua-asante', 'akosua-mensah'],
  prototyping: ['kojo-annan', 'abena-owusu'],
  'design-thinking': ['efua-asante', 'kwame-boateng'],
};

/*
 * CircleSkillsCard — Figma `Skills & endorsements` (NW-06 / 06b): "Skills" 20/24 + "Endorse skills you have seen Yaw use", then one
 * row per skill (name, "Verified · Skills Lab" chip, endorser faces + "12 endorsements · including Kwame Boateng (mentor)") with an
 * Endorse button. Not connected (NW-06b): the buttons are drawn the same but the card ends with the lock line "Link up with Yaw to
 * endorse his skills" — ⚠️ ASSUMPTION: they are aria-disabled then, and clicking one scrolls nothing and does nothing.
 * Props: profile, endorsed (skill ids the talent endorsed this session), locked (bool), onEndorse(skillId).
 */
const CircleSkillsCard = ({ profile, endorsed, locked, onEndorse }) => (
  <section
    className={classNames(CARD, 'flex flex-col gap-[14px] px-[22px] py-[20px] max-sm:px-[16px]')}
  >
    <div className="flex flex-wrap items-baseline justify-between gap-[8px]">
      <h2 className={classNames(HEADING, 'text-[20px] leading-[24px]')}>{COPY.skills}</h2>
      <span className="font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[14px]">
        {profile.endorsePrompt}
      </span>
    </div>
    <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
      {profile.skills.map((skill, i) => {
        const done = endorsed.includes(skill.id);
        const count = skill.count + (done ? 1 : 0);
        return (
          <li
            key={skill.id}
            className={classNames(
              'flex items-center gap-[14px] py-[10px] max-sm:flex-wrap',
              i > 0 && 'border-t border-solid border-[#e7e7e7]'
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
              <div className="flex flex-wrap items-center gap-[8px]">
                <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                  {skill.label}
                </span>
                {skill.verified && (
                  <span className="inline-flex h-[22px] items-center gap-[5px] rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#387440] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
                    <CircleVerifiedIcon className="size-[13px]" />
                    {skill.verified}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-[6px]">
                <CircleMutualFaces ids={FACES[skill.id] ?? []} />
                <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
                  {done ? skill.line.replace(/^\d+/, String(count)) : skill.line}
                </span>
              </div>
            </div>
            <CircleButton
              tone="soft"
              className="min-w-[129px]"
              aria-disabled={locked || undefined}
              aria-label={`Endorse ${skill.label}`}
              onClick={() => {
                if (!locked) onEndorse(skill.id);
              }}
            >
              {done ? 'Endorsed' : COPY.endorse}
            </CircleButton>
          </li>
        );
      })}
    </ul>
    {locked && (
      <p className="m-0 flex items-center gap-[8px] font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
        <CircleLockIcon className="size-[14px] shrink-0" />
        {profile.lockedNote}
      </p>
    )}
  </section>
);

export default CircleSkillsCard;
