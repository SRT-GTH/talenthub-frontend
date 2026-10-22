import { useEffect, useMemo, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { LEVEL_DOTS, SKILLS_COPY, STICKERS } from './skillsData.js';
import {
  SkillsArrowRightIcon,
  SkillsEditIcon,
  SkillsGameIcon,
  SkillsPlusIcon,
} from './skillsIcons.jsx';
import {
  LevelDots,
  MiniChip,
  ProficiencyGuide,
  SkChip,
  SkillsColumns,
  SkillsHero,
  Sticker,
  Tile,
} from './SkillsParts.jsx';
import { CARD, CARD20, SOFT_FOCUS } from './skillsStyles.js';

const log = debug('SkillsListScreen');

/*
 * SK-02 · Skills · Your skills — Figma Playful 7664:19658 / Focused 8285:22787. Hero (+ "New: verify skills by playing games"
 * pill) · Lab nudge · "Your skills" header with All / Verified / Self-reported filter chips · skill rows (Verify in Lab,
 * Edit) · "Add another skill" · rail (Get more endorsements + proficiency guide).
 * Props: skills (array, see skillsData.MOCK_SKILLS / skillsFromProfile; `level` and `category` may be empty for rows loaded
 * from the profile), onAdd, onVerify(labId), onAllLabs, onEdit(skill) (edit is not drawn: logs only), onAskColleague (not
 * drawn: logs only), progressSticker (hero sticker text; defaults to the drawn STICKERS.progress).
 */
const Faces = ({ skill }) => (
  <span className="inline-flex shrink-0 items-center -space-x-[8px]" aria-hidden="true">
    {skill.endorsers.map((src, i) => (
      <img
        key={i}
        src={src}
        alt=""
        width={22}
        height={22}
        className="size-[22px] rounded-full border-2 border-solid border-white object-cover"
      />
    ))}
  </span>
);

const SkillRow = ({ skill, onVerify, onEdit }) => {
  const tone = skill.verified ? 'green' : 'soft';
  return (
    <article
      data-skill={skill.id}
      data-verified={skill.verified ? 'true' : 'false'}
      className={classNames(
        'flex flex-wrap items-center gap-x-[16px] gap-y-[12px] py-[18px] pl-[18px] pr-[20px]',
        CARD20
      )}
    >
      <Tile glyph={skill.icon} tone={tone} />
      <div className="flex min-w-[min(100%,220px)] flex-1 flex-col gap-[6px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h3 className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
            {skill.name}
          </h3>
          {skill.verified ? <SkChip>Verified</SkChip> : <MiniChip>Self-reported</MiniChip>}
        </div>
        <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[4px]">
          {skill.level ? (
            <span className="inline-flex items-center gap-[6px]">
              <LevelDots filled={LEVEL_DOTS[skill.level]} />
              <span className="font-sans text-[13px] font-medium leading-[16px] text-[#1c2a21]">
                {skill.level}
              </span>
            </span>
          ) : null}
          {skill.category ? (
            <span className="whitespace-pre font-sans text-[13px] leading-[16px] text-[#595959]">
              {skill.level ? `·  ${skill.category}` : skill.category}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-[6px]">
            <Faces skill={skill} />
            <span className="font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
              {`${skill.endorsements} endorsements`}
            </span>
          </span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-[16px]">
        {skill.verified ? (
          <span className="font-sans text-[12px] font-medium leading-[14px] text-[#595959]">
            {`Verified ${skill.verifiedOn}`}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onVerify(skill.labId)}
            className={classNames(
              'inline-flex min-h-[36px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid py-[9px] pl-[12px] pr-[14px] font-sans text-[13px] font-semibold leading-[16px]',
              skill.highlight
                ? 'border-[rgba(28,42,33,0.1)] bg-[#387440] text-white'
                : 'border-[rgba(28,42,33,0.1)] bg-white text-[#387440]',
              'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
              SOFT_FOCUS
            )}
          >
            <SkillsGameIcon className="size-[16px] shrink-0" />
            Verify in Lab
          </button>
        )}
        <button
          type="button"
          aria-label={`Edit ${skill.name}`}
          onClick={() => onEdit(skill)}
          className={classNames(
            'inline-flex size-[38px] cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white text-[#1c2a21]',
            SOFT_FOCUS
          )}
        >
          <SkillsEditIcon className="size-[14px]" />
        </button>
      </div>
    </article>
  );
};

const SkillsListScreen = ({
  skills,
  onAdd,
  onVerify,
  onAllLabs,
  onEdit,
  onAskColleague,
  progressSticker = STICKERS.progress,
}) => {
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    log('mount', { count: skills.length });
  }, [skills.length]);
  const counts = useMemo(() => {
    const verified = skills.filter((s) => s.verified).length;
    return { all: skills.length, verified, self: skills.length - verified };
  }, [skills]);
  const shown = skills.filter(
    (s) => filter === 'all' || (filter === 'verified' ? s.verified : !s.verified)
  );
  log('render', { filter, shown: shown.length });
  const filters = [
    ['all', `All ${counts.all}`],
    ['verified', `Verified ${counts.verified}`],
    ['self', `Self-reported ${counts.self}`],
  ];
  const ready = skills.find((s) => s.highlight);

  return (
    <>
      <SkillsHero sticker={progressSticker} arcade={onAllLabs} />
      <SkillsColumns
        main={
          <>
            {ready ? (
              <section
                className={classNames(
                  'relative flex flex-wrap items-center gap-x-[16px] gap-y-[12px] !bg-[#faf4e8] py-[18px] pl-[18px] pr-[20px]',
                  CARD20
                )}
              >
                <Tile glyph="game" tone="gold" radius={14} glyphSize={24} />
                <div className="flex min-w-[min(100%,240px)] flex-1 flex-col gap-[3px]">
                  <h2 className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
                    {SKILLS_COPY.nudgeTitle}
                  </h2>
                  <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959] max-lg:leading-[20px]">
                    {SKILLS_COPY.nudgeText}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAllLabs}
                  className={classNames(
                    'min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#387440]',
                    SOFT_FOCUS
                  )}
                >
                  All labs
                </button>
                <Button
                  size="sm"
                  onClick={() => onVerify(ready.labId)}
                  rightIcon={<SkillsArrowRightIcon className="size-[20px]" />}
                >
                  Verify Python
                </Button>
                <Sticker rotate={-6} className="absolute right-[clamp(20px,6vw,90px)] top-[-21px]">
                  {STICKERS.xp}
                </Sticker>
              </section>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px] pt-[8px]">
              <h2 className="m-0 font-sans text-[clamp(24px,1.68vw,29px)] font-semibold leading-[1.21] text-[#1c2a21] playful:font-heading">
                Your skills
              </h2>
              <MiniChip strong>{skills.length}</MiniChip>
              <span className="min-w-0 flex-1" />
              <div
                className="flex flex-wrap items-center gap-[12px]"
                role="group"
                aria-label="Filter skills"
              >
                {filters.map(([id, label]) => (
                  <SkChip
                    key={id}
                    tone={filter === id ? 'dark' : 'outline'}
                    pressed={filter === id}
                    onClick={() => {
                      log('filter', id);
                      setFilter(id);
                    }}
                  >
                    {label}
                  </SkChip>
                ))}
              </div>
            </div>
            {shown.map((skill) => (
              <SkillRow key={skill.id} skill={skill} onVerify={onVerify} onEdit={onEdit} />
            ))}
            <button
              type="button"
              onClick={onAdd}
              className={classNames(
                'flex min-h-[60px] cursor-pointer items-center justify-center gap-[8px] rounded-[20px] border border-solid border-[#387440] bg-[#ebf1ec] p-[20px] font-sans text-[15px] font-semibold leading-[18px] text-[#387440] playful:border-[1.5px]',
                SOFT_FOCUS
              )}
            >
              <SkillsPlusIcon className="size-[18px]" />
              Add another skill
            </button>
          </>
        }
        rail={
          <>
            <aside className={classNames('flex flex-col gap-[12px] p-[24px]', CARD)}>
              <h2 className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
                {SKILLS_COPY.endorseTitle}
              </h2>
              <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">
                {SKILLS_COPY.endorseText}
              </p>
              <Button
                variant="tertiary-subtle"
                size="lg"
                className="w-full !py-[12px]"
                onClick={onAskColleague}
              >
                Ask a colleague
              </Button>
            </aside>
            <ProficiencyGuide />
          </>
        }
      />
    </>
  );
};

export default SkillsListScreen;
