import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HEADING, HubButton } from '../talentSkillsLab/HubParts.jsx';
import {
  HubCompassIcon,
  HubEyeIcon,
  HubEyeOffIcon,
  HubShieldIcon,
} from '../talentSkillsLab/HubIcons.jsx';
import { EvidenceChip } from './AssessmentParts.jsx';
import { OvChip, OvHeader } from './OverviewParts.jsx';
import { OV_CARD_A, OV_FOCUS, OV_ICONS, resolveRoute } from './overviewShared.js';
import { RECRUITER_VIEW } from './assessmentData.js';

const log = debug('RecruiterView');

/*
 * RecruiterView — MA-07 "Recruiter view (preview)" (Figma Playful 7970:10098 / Focused 8110:32604): what a recruiter sees of
 * the talent's assessment. Props: data (RECRUITER_VIEW), onExit (leaves the preview — clears ?view=recruiter).
 * Differences between the styles: Bricolage name/title (Playful), Playful chips are 32px, Focused chips 22px label-only with
 * their own text colours (see AssessmentParts EvidenceChip tone="recruiter").
 */

const BAR_FILL = { green: 'bg-[#387440]', gold: 'bg-[#c8951a]', dark: 'bg-[#595959]' };
const FunctionGlyph = OV_ICONS.function;

export const RecruiterView = ({ data = RECRUITER_VIEW, onExit }) => {
  useEffect(() => {
    log('mount');
  }, []);
  const { candidate, personality } = data;
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="-mb-[2px] flex items-center gap-[12px] rounded-[14px] bg-[#eaeffb] px-[18px] py-[12px]">
        <HubEyeIcon className="size-[18px] shrink-0 text-[#244a9f]" />
        <p className="m-0 min-w-0 flex-1 font-sans text-[14px] font-semibold leading-[17px] text-[#244a9f]">
          {data.banner}
        </p>
        <button
          type="button"
          onClick={() => {
            log('exit preview');
            onExit?.();
          }}
          className={classNames(
            'shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#244a9f] underline max-lg:min-h-[32px]',
            OV_FOCUS
          )}
        >
          {data.exit}
        </button>
      </div>

      <OvHeader title={data.title} subtitle={data.subtitle} />

      <div className="flex flex-col gap-[24px]">
        <section
          aria-label={candidate.name}
          className={classNames(
            OV_CARD_A,
            'flex flex-wrap items-center gap-[18px] p-[24px] max-sm:p-[16px]'
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[20px] font-bold leading-[24px] text-white"
          >
            {candidate.initials}
          </span>
          <div className="flex min-w-[200px] flex-1 flex-col gap-[4px]">
            <h2
              className={classNames(
                HEADING,
                'text-[clamp(19px,1.27vw,22px)] leading-[1.27] tracking-[-0.01em]'
              )}
            >
              {candidate.name}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
              {candidate.line}
            </p>
          </div>
          <OvChip tone="affinity">
            <HubShieldIcon className="size-[14px] shrink-0" />
            {candidate.chip}
          </OvChip>
          <HubButton tone="primary" size="sm" onClick={() => log('message (no destination drawn)')}>
            {candidate.message}
          </HubButton>
        </section>

        <div className="grid items-start gap-[16px] lg:grid-cols-[minmax(0,1fr)_clamp(300px,31.6%,420px)]">
          <div className="flex min-w-0 flex-col gap-[16px]">
            <section
              aria-labelledby="ma-rv-personality"
              className={classNames(OV_CARD_A, 'flex flex-col gap-[12px] p-[24px] max-sm:p-[16px]')}
            >
              <div className="flex items-center gap-[10px]">
                <span
                  aria-hidden="true"
                  className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#c8951a] text-white"
                >
                  <HubCompassIcon className="size-[20px]" />
                </span>
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <h2
                    id="ma-rv-personality"
                    className="m-0 font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]"
                  >
                    {personality.type}
                  </h2>
                  <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                    {personality.sub}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                {personality.traits.map((trait) => (
                  <div
                    key={trait.id}
                    className="flex items-center gap-[14px] max-sm:flex-wrap max-sm:gap-x-[10px] max-sm:gap-y-[4px]"
                  >
                    <span className="w-[180px] shrink-0 font-sans text-[13.5px] font-medium leading-[16px] text-[#1c2a21] max-lg:w-[130px] max-sm:w-auto max-sm:flex-1">
                      {trait.name}
                    </span>
                    <span
                      role="meter"
                      aria-label={`${trait.name} ${trait.label}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={trait.value}
                      className="h-[8px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#ebebe3] max-sm:order-3 max-sm:basis-full"
                    >
                      <span
                        className={classNames('block h-full rounded-full', BAR_FILL[trait.tone])}
                        style={{ width: `${trait.value}%` }}
                      />
                    </span>
                    <span className="w-[29px] shrink-0 text-right font-sans text-[13px] font-semibold leading-[16px] text-[#595959]">
                      {trait.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="ma-rv-skills"
              className={classNames(OV_CARD_A, 'flex flex-col gap-[6px] p-[24px] max-sm:p-[16px]')}
            >
              <h2
                id="ma-rv-skills"
                className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]"
              >
                {data.skillsTitle}
              </h2>
              <ul className="m-0 flex list-none flex-col p-0">
                {data.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="m-0 border-0 border-t border-solid border-[rgba(28,42,33,0.08)] p-0"
                  >
                    <Link
                      to={resolveRoute(null, skill.id)}
                      onClick={() => log('skill ->', skill.id)}
                      className={classNames(
                        'flex items-center gap-[12px] py-[10px] no-underline max-sm:flex-wrap',
                        OV_FOCUS
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
                      >
                        <FunctionGlyph className="size-[16px]" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
                        <span className="font-sans text-[14.5px] font-semibold leading-[17px] text-[#1c2a21]">
                          {skill.name}
                        </span>
                        <span className="font-sans text-[12.5px] leading-[15px] text-[#595959]">
                          {skill.level}
                        </span>
                      </span>
                      <EvidenceChip kind={skill.kind} tone="recruiter" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="flex min-w-0 flex-col gap-[16px]">
            <section
              aria-labelledby="ma-rv-hidden"
              className={classNames(
                OV_CARD_A,
                'flex flex-col gap-[10px] !bg-[#f8f8f4] p-[24px] max-sm:p-[16px]'
              )}
            >
              <h2
                id="ma-rv-hidden"
                className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]"
              >
                {data.hidden.title}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                {data.hidden.items.map((item) => (
                  <li
                    key={item}
                    className="m-0 flex items-center gap-[10px] p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21]"
                  >
                    <HubEyeOffIcon className="size-[16px] shrink-0 text-[#595959]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="ma-rv-improve"
              className={classNames(OV_CARD_A, 'flex flex-col gap-[10px] p-[24px] max-sm:p-[16px]')}
            >
              <h2
                id="ma-rv-improve"
                className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]"
              >
                {data.improve.title}
              </h2>
              <p className="m-0 font-sans text-[13.5px] leading-[20px] text-[#595959]">
                {data.improve.body}
              </p>
              <HubButton
                tone="secondary"
                size="lg"
                to={resolveRoute('skillsLab')}
                className="w-full"
              >
                {data.improve.cta}
              </HubButton>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
