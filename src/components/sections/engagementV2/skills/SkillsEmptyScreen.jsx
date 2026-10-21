import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SKILLS_COPY, STICKERS } from './skillsData.js';
import { SkillsArrowRightIcon, SkillsBoltIcon } from './skillsIcons.jsx';
import { ProficiencyGuide, SkillsColumns, SkillsHero } from './SkillsParts.jsx';
import { CARD, CARD_CHROME, GLYPHS } from './skillsStyles.js';

const log = debug('SkillsEmptyScreen');

/*
 * SK-01 · Skills · First visit (empty) — Figma Playful 7664:19446 / Focused 8285:22614. Hero + empty-state card (illustration,
 * title, "Add your first skill" / "Import from my CV", "How it works" steps) + the proficiency guide rail.
 * Props: onAdd (opens the add dialog), onImport (not drawn: logs only).
 */
const SideTile = ({ glyph }) => {
  const Glyph = GLYPHS[glyph];
  return (
    <span
      className={classNames(
        'inline-flex size-[64px] items-center justify-center rounded-[22px] bg-[#ebf1ec] text-[#387440] playful:size-[72px]',
        CARD_CHROME
      )}
    >
      <span className="inline-flex size-[28px] items-center justify-center playful:size-[32px] [&>svg]:size-full">
        <Glyph />
      </span>
    </span>
  );
};

const SkillsEmptyScreen = ({ onAdd, onImport }) => {
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <>
      <SkillsHero sticker={STICKERS.stage} />
      <SkillsColumns
        main={
          <section
            className={classNames(
              'flex flex-col items-center gap-[18px] p-[clamp(20px,2.8vw,48px)] pb-[clamp(20px,2.3vw,40px)] text-center',
              CARD
            )}
          >
            <div className="flex items-center -space-x-[14px]" aria-hidden="true">
              <SideTile glyph="function" />
              <span
                className={classNames(
                  'relative z-[1] inline-flex size-[80px] items-center justify-center rounded-[22px] bg-[#c8951a] text-white',
                  CARD_CHROME
                )}
              >
                <SkillsBoltIcon className="h-[32px] w-[25px]" />
              </span>
              <SideTile glyph="image" />
            </div>
            <h2 className="m-0 font-sans text-[clamp(24px,1.85vw,32px)] font-semibold leading-[1.19] text-[#1c2a21] playful:font-heading">
              No skills yet. Let’s add <span className="text-[#387440]">your first.</span>
            </h2>
            <p className="m-0 max-w-[620px] font-sans text-[16px] leading-[24px] text-[#595959] max-lg:text-[14px]">
              {SKILLS_COPY.emptyBody}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              <Button
                size="md"
                onClick={onAdd}
                rightIcon={<SkillsArrowRightIcon className="size-[20px]" />}
              >
                Add your first skill
              </Button>
              <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onImport}>
                Import from my CV
              </Button>
            </div>
            <ol className="m-0 mt-0 flex w-full list-none flex-col gap-[16px] border-0 border-t border-solid border-[#e7e7e7] p-0 pt-[24px] text-left lg:flex-row">
              {SKILLS_COPY.steps.map((step) => {
                const Glyph = GLYPHS[step.icon];
                return (
                  <li key={step.title} className="flex min-w-0 flex-1 items-start gap-[12px]">
                    <span className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
                      <span className="inline-flex size-[18px] items-center justify-center [&>svg]:size-full">
                        <Glyph />
                      </span>
                    </span>
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                        {step.title}
                      </span>
                      <span className="font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[13px]">
                        {step.text}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        }
        rail={<ProficiencyGuide />}
      />
    </>
  );
};

export default SkillsEmptyScreen;
