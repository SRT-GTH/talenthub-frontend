import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HubButton } from '../talentSkillsLab/HubParts.jsx';
import { AssessmentArrowRightIcon, AssessmentInfoIcon } from './AssessmentDetailIcons.jsx';
import { Card, Chip, DetailHeader, Glyph } from './AssessmentDetailParts.jsx';
import { TraitCard } from './AssessmentParts.jsx';
import { FOCUS_RING, HEADING, PAGE_WRAP, RAISED } from './assessmentDetailStyles.js';

const log = debug('PersonalityDetail');

/*
 * PersonalityDetail — the body of `/my-assessment/personality` (Figma MA-02 Playful 7965:326919 / Focused 8110:30568).
 * Props: data — PERSONALITY_DETAIL from assessmentData.js (`GET /assessment/personality`). Rendered inside AssessmentFrame by
 * pages/talentAssessment/AssessmentDetailPage.jsx. Layout (1728 frame): main column 1329 = archetype card · six traits (2 x 3
 * grid) · two cards side by side (best work · what recruiters see). Below lg everything stacks. Playful = hard-shadow badge +
 * 32px outlined chips + Bricolage headings; Focused = hairline badge + 22px flat chips + SF Pro headings.
 */
/* Data tone -> TraitCard bar tone (AssessmentParts uses green | gold | dark). */
const TRAIT_TONE = { green: 'green', amber: 'gold', grey: 'dark' };

const TraitItem = ({ trait }) => (
  <li className="min-w-0">
    <TraitCard
      name={trait.name}
      percentileLabel={trait.percentileLabel}
      percent={trait.percentile}
      description={trait.text}
      level={trait.level}
      tone={TRAIT_TONE[trait.tone]}
      className="h-full max-lg:[&>div:last-child>span:last-child]:!text-[12px]"
    />
  </li>
);

const Archetype = ({ data }) => {
  const { archetype, measured } = data;
  return (
    <Card
      label="Your archetype"
      className="flex-wrap gap-[28px] p-[28px] max-sm:p-[18px] lg:flex-row lg:items-center"
    >
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex size-[120px] shrink-0 items-center justify-center rounded-[28px] border border-solid bg-[#c8951a] text-white max-sm:size-[88px] max-sm:rounded-[22px]',
          RAISED
        )}
      >
        <Glyph name={archetype.icon} className="size-[56px] max-sm:size-[42px]" />
      </span>
      <div className="flex min-w-[240px] flex-1 flex-col gap-[10px]">
        <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.06em] text-[#387440] max-lg:text-[12px]">
          {archetype.eyebrow}
        </p>
        <h2
          className={classNames(
            HEADING,
            'text-[clamp(30px,2.31vw,40px)] leading-[1.1] tracking-[-0.02em]'
          )}
        >
          {archetype.lead}
          <span className="text-[#387440]">{archetype.name}</span>
        </h2>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959] max-sm:text-[14px] max-sm:leading-[20px]">
          {archetype.summary}
        </p>
        <div className="flex flex-wrap items-center gap-[8px]">
          <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[14px]">
            {archetype.affinityLabel}
          </span>
          <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
            {archetype.affinity.map((item) => (
              <li key={item}>
                <Chip tone="soft">{item}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside
        aria-label={measured.title}
        className="flex w-[280px] shrink-0 flex-col gap-[16px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[18px] max-lg:w-full"
      >
        <h3 className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {measured.title}
        </h3>
        {measured.rows.map((row) => (
          <p
            key={row.text}
            className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px]"
          >
            <Glyph name={row.icon} className="size-[15px] shrink-0" />
            {row.text}
          </p>
        ))}
        <Link
          to={measured.link.to}
          onClick={() => log('prefer games link')}
          className={classNames(
            'inline-flex w-fit items-center gap-[4px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440] no-underline max-lg:text-[14px]',
            FOCUS_RING
          )}
        >
          {measured.link.label}
          <AssessmentArrowRightIcon className="size-[14px] shrink-0" />
        </Link>
      </aside>
    </Card>
  );
};

const Traits = ({ traits }) => (
  <Card label={traits.title} className="gap-[16px] p-[24px] max-sm:p-[16px]">
    <div className="flex flex-wrap items-center justify-between gap-[8px]">
      <h2 className="m-0 font-sans text-[19px] leading-[23px] font-semibold text-[#1c2a21]">
        {traits.title}
      </h2>
      <span className="inline-flex h-[22px] items-center rounded-full bg-[#f8f8f4] px-[10px] font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
        {traits.chip}
      </span>
    </div>
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 lg:grid-cols-2">
      {traits.items.map((trait) => (
        <TraitItem key={trait.id} trait={trait} />
      ))}
    </ul>
  </Card>
);

const BestWork = ({ bestWork }) => (
  <Card label={bestWork.title} className="gap-[12px] p-[24px] max-sm:p-[16px]">
    <h2 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
      {bestWork.title}
    </h2>
    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
      {bestWork.rows.map((row) => (
        <li key={row.text} className="flex items-start gap-[10px]">
          <Glyph
            name={row.icon}
            className={classNames(
              'mt-px size-[18px] shrink-0',
              row.icon === 'alert' ? 'text-[#967014]' : 'text-[#387440]'
            )}
          />
          <span className="font-sans text-[14px] leading-[17px] text-[#1c2a21] max-lg:text-[15px] max-lg:leading-[20px]">
            {row.text}
          </span>
        </li>
      ))}
    </ul>
  </Card>
);

const Recruiters = ({ recruiters }) => (
  <Card label={recruiters.title} className="gap-[12px] p-[24px] max-sm:p-[16px]">
    <h2 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
      {recruiters.title}
    </h2>
    <div className="flex flex-col gap-[12px]">
      {recruiters.rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-[12px] py-[8px]">
          <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21] max-lg:text-[15px]">
            {row.label}
          </span>
          <Chip tone={row.tone} icon={row.icon}>
            {row.chip}
          </Chip>
        </div>
      ))}
    </div>
    <p className="m-0 flex items-start gap-[8px] rounded-[12px] bg-[#f8f8f4] px-[14px] py-[10px] font-sans text-[12.5px] leading-[15px] text-[#595959]">
      <AssessmentInfoIcon className="mt-px size-[16px] shrink-0 text-[#595959]" />
      {recruiters.note}
    </p>
  </Card>
);

const PersonalityDetail = ({ data }) => {
  log('render');
  return (
    <div className={PAGE_WRAP}>
      <DetailHeader
        back={data.back}
        title={data.title}
        subtitle={data.subtitle}
        actions={
          <HubButton tone="secondary" size="lg" to={data.retake.to}>
            {data.retake.label}
          </HubButton>
        }
      />
      <Archetype data={data} />
      <Traits traits={data.traits} />
      <div className="grid grid-cols-1 items-start gap-[16px] lg:grid-cols-2">
        <BestWork bestWork={data.bestWork} />
        <Recruiters recruiters={data.recruiters} />
      </div>
    </div>
  );
};

export default PersonalityDetail;
