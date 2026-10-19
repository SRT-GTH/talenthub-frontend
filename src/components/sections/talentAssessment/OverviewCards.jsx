import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HEADING, HubButton } from '../talentSkillsLab/HubParts.jsx';
import {
  HubArrowRightIcon,
  HubBulbIcon,
  HubChartBarIcon,
  HubCompassIcon,
  HubLockIcon,
} from '../talentSkillsLab/HubIcons.jsx';
import { useLabText } from '../talentSkillsLab/labFormat.js';
import { AssessBoltIcon, AssessGameIcon } from './AssessmentIcons.jsx';
import { AssessmentHistoryRow, EvidenceChip } from './AssessmentParts.jsx';
import { OvCardHead, OvChip, OvLink } from './OverviewParts.jsx';
import {
  OV_CARD_A,
  OV_CARD_B,
  OV_CARD_C,
  OV_FOCUS,
  OV_ICONS,
  resolveRoute,
} from './overviewShared.js';
import { ASSESSMENT_OVERVIEW } from './assessmentData.js';

const log = debug('OverviewCards');

/*
 * OverviewCards — the MA-01 cards (Figma Playful 7963:9352 / Focused 8110:28604), one component per card:
 *   ProgressCard (summary + the four steps) · PersonalityCard · SkillsEvidenceCard · NextAssessmentCard · LabelsLegendCard
 *   (`compact` = the 10px item gap of the first-visit frame) · SkillsLabCard · HistoryCard · OverviewBody (the whole 3-of-4 body).
 * Every card takes its slice of ASSESSMENT_OVERVIEW (assessmentData.js) as `data` so an API response can replace it.
 */

const FunctionGlyph = OV_ICONS.function;

const StepTile = ({ icon, className }) => {
  const Glyph = OV_ICONS[icon];
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[36px] shrink-0 items-center justify-center rounded-[11px] text-[#387440]',
        className
      )}
    >
      <Glyph className="size-[18px]" />
    </span>
  );
};

const StepCard = ({ step }) => {
  const { t } = useLabText();
  const isFull = step.status === 'not-started';
  const done = step.status === 'done';
  const body = (
    <>
      <div className="flex items-center gap-[10px]">
        <StepTile icon={step.icon} className={isFull ? 'bg-white' : 'bg-[#ebf1ec]'} />
        <span aria-hidden="true" className="min-w-0 flex-1" />
        {done ? (
          <OvChip tone="done" check>
            Done
          </OvChip>
        ) : (
          <OvChip tone="outline">{step.statusLabel}</OvChip>
        )}
      </div>
      <p className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
        {step.title}
      </p>
      <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[13px]">
        {t(step.sub)}
      </p>
    </>
  );
  const shell = 'flex min-w-0 flex-col gap-[10px] rounded-[16px] border border-solid p-[18px]';
  if (isFull) {
    return (
      <div className={classNames(shell, 'border-[#387440] bg-[#ebf1ec] playful:border-[1.5px]')}>
        {body}
        <HubButton
          tone="primary"
          size="lg"
          to={resolveRoute(step.to)}
          rightIcon={<HubArrowRightIcon className="size-full" />}
          className="mt-[2px] w-full"
          onClick={() => log('start full assessment')}
        >
          {step.cta}
        </HubButton>
      </div>
    );
  }
  return (
    <Link
      to={resolveRoute(step.to)}
      aria-label={`${step.title}. ${t(step.sub)}`}
      className={classNames(shell, 'border-[rgba(28,42,33,0.12)] bg-white no-underline', OV_FOCUS)}
      onClick={() => log('step ->', step.id)}
    >
      {body}
    </Link>
  );
};

export const ProgressCard = ({ summary, steps }) => (
  <section
    aria-labelledby="ma-progress-title"
    className={classNames(OV_CARD_A, 'flex flex-col gap-[18px] p-[24px] max-sm:p-[16px]')}
  >
    <div className="flex items-start gap-[14px]">
      <div className="flex w-[56px] shrink-0 flex-col items-center">
        <span className="font-sans text-[40px] font-semibold leading-[44px] tracking-[-0.02em] text-[#387440] playful:font-heading">
          {summary.done}
        </span>
        <span className="whitespace-nowrap font-sans text-[11px] font-bold leading-[13px] text-[#595959] max-lg:text-[12px]">
          {summary.numberCaption}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <h2
          id="ma-progress-title"
          className="m-0 font-sans text-[19px] font-semibold leading-[23px] text-[#1c2a21]"
        >
          {summary.headline}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959] max-sm:leading-[20px]">
          {summary.body}
        </p>
        <div
          role="progressbar"
          aria-label={summary.headline}
          aria-valuemin={0}
          aria-valuemax={summary.total}
          aria-valuenow={summary.done}
          className="h-[10px] w-full overflow-hidden rounded-full bg-[#ebebe3]"
        >
          <div
            className="h-full rounded-full bg-[#387440]"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-4 items-start gap-[14px] max-lg:grid-cols-2 max-sm:grid-cols-1">
      {steps.map((step) => (
        <StepCard key={step.id} step={step} />
      ))}
    </div>
  </section>
);

export const PersonalityCard = ({ data }) => (
  <section
    aria-labelledby="ma-personality-title"
    className={classNames(OV_CARD_B, 'flex flex-col gap-[16px] p-[22px] max-sm:p-[16px]')}
  >
    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px]">
      <span
        aria-hidden="true"
        className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
      >
        <HubBulbIcon className="size-[17px]" />
      </span>
      <h2
        id="ma-personality-title"
        className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]"
      >
        {data.title}
      </h2>
      <span aria-hidden="true" className="min-w-0 flex-1" />
      <OvChip tone="soft">{data.status}</OvChip>
      <OvLink to={resolveRoute('personality')}>{data.link}</OvLink>
    </div>

    <div className="flex items-start gap-[18px] max-sm:flex-col">
      <span
        aria-hidden="true"
        className="flex size-[80px] shrink-0 items-center justify-center rounded-[22px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#c8951a] text-white shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
      >
        <HubCompassIcon className="size-[38px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <p
          className={classNames(
            HEADING,
            'text-[clamp(24px,1.68vw,29px)] leading-[1.2] text-[#1c2a21]'
          )}
        >
          {data.lead}
          <span className="text-[#387440]">{data.type}</span>
        </p>
        <p className="m-0 font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
          {data.meta}
        </p>
        <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">{data.blurb}</p>
        <div className="flex flex-wrap items-center gap-[6px]">
          <span className="mr-[0px] font-sans text-[12px] font-bold leading-[14px] text-[#595959]">
            {data.affinityLabel}
          </span>
          {data.affinity.map((a) => (
            <OvChip key={a} tone="affinity">
              {a}
            </OvChip>
          ))}
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-[12px] border-0 border-t border-solid border-[#e7e7e7] pt-[14px]">
      {data.traits.map((trait) => (
        <div key={trait.id} className="flex flex-col gap-[5px]">
          <div className="flex items-baseline justify-between gap-[4px]">
            <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21]">
              {trait.name}
            </span>
            <span
              className={classNames(
                'font-sans text-[12px] font-semibold leading-[14px]',
                trait.tone === 'green' ? 'text-[#387440]' : 'text-[#595959]'
              )}
            >
              {trait.label}
            </span>
          </div>
          <div
            role="meter"
            aria-label={`${trait.name}, ${trait.label}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={trait.value}
            className="h-[8px] w-full overflow-hidden rounded-[4px] bg-[#eceee8]"
          >
            <div
              className="h-full rounded-[4px] bg-[#387440] playful:bg-[linear-gradient(90deg,#387440,#7aa870)]"
              style={{ width: `${trait.fill}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    <p className="m-0 flex items-start gap-[8px] rounded-[12px] bg-[#f8f8f4] px-[12px] py-[10px] font-sans text-[12px] leading-[14px] text-[#595959]">
      <HubLockIcon className="mt-[0px] size-[14px] shrink-0" />
      {data.note}
    </p>
  </section>
);

export const SkillsEvidenceCard = ({ data }) => (
  <section
    aria-labelledby="ma-skills-title"
    className={classNames(OV_CARD_B, 'flex flex-col gap-[8px] p-[22px] max-sm:p-[16px]')}
  >
    <OvCardHead
      icon={<AssessBoltIcon className="h-[15px] w-[12px]" />}
      title={data.title}
      titleId="ma-skills-title"
      trailing={<OvChip tone="soft">{data.chip}</OvChip>}
    />
    <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">{data.sub}</p>
    <ul className="m-0 flex list-none flex-col p-0">
      {data.skills.map((skill) => (
        <li key={skill.id} className="m-0 p-0">
          <Link
            to={resolveRoute(null, skill.id)}
            onClick={() => log('skill ->', skill.id)}
            className={classNames(
              'flex items-center gap-[12px] border-0 border-b border-solid border-[#e7e7e7] py-[11px] no-underline max-sm:flex-wrap',
              OV_FOCUS
            )}
          >
            <span
              aria-hidden="true"
              className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#f8f8f4] text-[#387440]"
            >
              <FunctionGlyph className="size-[17px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
              <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {skill.name}
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
                {skill.level}
              </span>
            </span>
            <EvidenceChip kind={skill.kind} />
          </Link>
        </li>
      ))}
    </ul>
    <div className="flex items-center justify-between gap-[8px] pt-[10px]">
      <span className="font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
        {data.more}
      </span>
      <OvLink to={resolveRoute('skills')} arrow={false} className="!text-[13px] !leading-[16px]">
        {data.manage}
      </OvLink>
    </div>
  </section>
);

export const NextAssessmentCard = ({ data }) => {
  const { t } = useLabText();
  return (
    <section
      aria-labelledby="ma-next-title"
      className={classNames(
        OV_CARD_C,
        'relative flex flex-col gap-[12px] p-[22px] max-sm:p-[16px]'
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[22px] right-[11px] hidden -rotate-[5deg] items-center rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[22px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:flex"
      >
        {data.sticker}
      </span>
      <div className="flex items-center gap-[12px]">
        <span
          aria-hidden="true"
          className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] text-[#785910]"
        >
          <HubChartBarIcon className="size-[24px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <h2
            id="ma-next-title"
            className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]"
          >
            {data.title}
          </h2>
          <span className="font-sans text-[12px] font-medium leading-[14px] text-[#785910]">
            {t(data.meta)}
          </span>
        </div>
      </div>
      <p className="m-0 font-sans text-[14px] leading-[21px] text-[#595959]">{data.body}</p>
      <HubButton
        tone="primary"
        size="sm"
        to={`/my-assessment/full/${data.skillId}`}
        rightIcon={<HubArrowRightIcon className="size-full" />}
        className="w-full !px-[28px] !py-[14px]"
        onClick={() => log('start next assessment', data.skillId)}
      >
        {data.cta}
      </HubButton>
    </section>
  );
};

export const LabelsLegendCard = ({ data, compact = false }) => (
  <section
    aria-labelledby="ma-legend-title"
    className={classNames(
      OV_CARD_B,
      'flex flex-col p-[22px] max-sm:p-[16px]',
      compact ? 'gap-[10px]' : 'gap-[16px]'
    )}
  >
    <h2
      id="ma-legend-title"
      className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]"
    >
      {data.title}
    </h2>
    {data.items.map((item) => (
      <div key={item.kind} className="flex flex-col items-start gap-[4px]">
        <EvidenceChip kind={item.kind} />
        <span className="font-sans text-[12px] leading-[14px] text-[#595959]">{item.text}</span>
      </div>
    ))}
  </section>
);

export const SkillsLabCard = ({ data }) => (
  <section
    aria-labelledby="ma-lab-title"
    className={classNames(OV_CARD_B, 'flex flex-col gap-[4px] p-[22px] max-sm:p-[16px]')}
  >
    <div className="flex items-center gap-[10px] pb-[4px]">
      <span
        aria-hidden="true"
        className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
      >
        <AssessGameIcon className="size-[17px]" />
      </span>
      <h2
        id="ma-lab-title"
        className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]"
      >
        {data.title}
      </h2>
      <span aria-hidden="true" className="min-w-0 flex-1" />
      <OvLink to={resolveRoute('skillsLab')} arrow={false}>
        {data.link}
      </OvLink>
    </div>
    <ul className="m-0 flex list-none flex-col p-0">
      {data.games.map((game) => (
        <li key={game.id} className="m-0 p-0">
          <Link
            to={resolveRoute('skillsLab')}
            onClick={() => log('game ->', game.id)}
            className={classNames(
              'flex items-center gap-[10px] border-0 border-b border-solid border-[#e7e7e7] py-[10px] no-underline',
              OV_FOCUS
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
              <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {game.name}
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
                {game.when}
              </span>
            </span>
            <span className="flex w-[52px] shrink-0 flex-col items-end gap-[3px]">
              <span className="flex items-baseline gap-[2px]">
                <span className="font-sans text-[19px] font-semibold leading-[24px] text-[#1c2a21] playful:font-heading">
                  {game.score}
                </span>
                <span className="font-sans text-[12px] font-medium leading-[14px] text-[#595959]">
                  /100
                </span>
              </span>
              <span
                className={classNames(
                  'font-sans text-[12px] font-semibold leading-[14px]',
                  game.strong ? 'text-[#387440]' : 'text-[#595959]'
                )}
              >
                {game.top}
              </span>
              <span
                aria-hidden="true"
                className="h-[5px] w-full overflow-hidden rounded-[2.5px] bg-[#eceee8]"
              >
                <span className="block h-full w-full rounded-[2.5px] bg-[#387440]" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export const HistoryCard = ({ data }) => (
  <section
    aria-labelledby="ma-history-title"
    className={classNames(OV_CARD_A, 'flex flex-col gap-[8px] p-[24px] max-sm:p-[16px]')}
  >
    <div className="flex items-center justify-between gap-[8px]">
      <h2
        id="ma-history-title"
        className="m-0 font-sans text-[19px] font-semibold leading-[23px] text-[#1c2a21]"
      >
        {data.title}
      </h2>
      <OvChip tone="quiet">{data.window}</OvChip>
    </div>
    <p className="m-0 font-sans text-[13.5px] leading-[16px] text-[#595959] max-sm:leading-[18px]">
      {data.sub}
    </p>
    <div>
      {data.rows.map((row) => (
        <AssessmentHistoryRow
          key={row.id}
          date={row.date}
          title={row.title}
          sub={row.sub}
          chip={row.chip}
          to={resolveRoute(row.to, row.skillId)}
        />
      ))}
    </div>
  </section>
);

export const OverviewBody = ({ data = ASSESSMENT_OVERVIEW }) => (
  <div className="flex flex-col gap-[24px]">
    <ProgressCard summary={data.summary} steps={data.steps} />
    <div className="grid items-start gap-[16px] lg:grid-cols-[minmax(0,1fr)_clamp(300px,31.6%,420px)]">
      <div className="flex min-w-0 flex-col gap-[16px]">
        <PersonalityCard data={data.personality} />
        <SkillsEvidenceCard data={data.skillsEvidence} />
      </div>
      <div className="flex min-w-0 flex-col gap-[16px] max-lg:mt-[6px]">
        <NextAssessmentCard data={data.next} />
        <LabelsLegendCard data={data.labelsLegend} />
        <SkillsLabCard data={data.skillsLab} />
      </div>
    </div>
    <HistoryCard data={data.history} />
  </div>
);
