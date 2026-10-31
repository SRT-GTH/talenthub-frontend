import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HubButton } from '../talentSkillsLab/HubParts.jsx';
import {
  AssessmentBoltIcon,
  AssessmentButtonArrowIcon,
  AssessmentChevronIcon,
  AssessmentEmptyAttemptsArt,
} from './AssessmentDetailIcons.jsx';
import {
  Card,
  Chip,
  DetailHeader,
  Glyph,
  MiniChip,
  RowChevron,
  RowLink,
  Tile,
} from './AssessmentDetailParts.jsx';
import { EvidenceRung } from './AssessmentParts.jsx';
import { FOCUS_RING, PAGE_WRAP } from './assessmentDetailStyles.js';

const log = debug('SkillEvidence');

/*
 * SkillEvidence — the body of `/my-assessment/skills/:skillId` (Figma MA-03 Python 7967:9820 / 8110:30892 and MA-03b Firebase,
 * self-reported 7987:10602 / 8110:35142). Props: data — one SKILL_EVIDENCE entry (`GET /assessment/skills/:skillId`, see
 * assessmentData.js). Layout (1728 frame): header + CTA · evidence ladder (4 rungs + tip) · left column (every attempt or the
 * empty state · topic breakdown) + right column 420 (how recruiters see it · close the gaps / start proving · other skills).
 * Below xl the columns stack and the ladder becomes a 2-up grid (1-up on phones). Playful = hard-shadow-free but outlined 32px chips,
 * Bricolage title; Focused = flat 22px chips, SF Pro title.
 */
/* Rung icon colours: Figma tints the glyph green on done / current rungs, and the "next" tile keeps the shield's grey. */
const RUNG_ICON = (rung) =>
  rung.state === 'next' && rung.icon !== 'shield' ? 'text-[#387440]' : '';

const Rung = ({ rung }) => (
  <EvidenceRung
    state={rung.state}
    title={rung.title}
    text={rung.sub}
    chipLabel={rung.chip}
    icon={<Glyph name={rung.icon} className={classNames('size-[17px]', RUNG_ICON(rung))} />}
    className="h-full flex-1 max-lg:[&>div:first-child>span:last-child]:text-[12px]"
  />
);

const Ladder = ({ ladder }) => (
  <Card label={ladder.title} className="gap-[16px] p-[24px] max-sm:p-[16px]">
    <div className="flex flex-wrap items-center justify-between gap-[8px] playful:min-h-[32px]">
      <h2 className="m-0 font-sans text-[19px] leading-[23px] font-semibold text-[#1c2a21]">
        {ladder.title}
      </h2>
      <Chip tone="neutral">{ladder.step}</Chip>
    </div>
    <ol className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-2 xl:flex xl:items-center">
      {ladder.rungs.map((rung, i) => (
        <li
          key={rung.id}
          aria-current={rung.state === 'current' ? 'step' : undefined}
          className="min-w-0 xl:contents"
        >
          <Rung rung={rung} />
          {i < ladder.rungs.length - 1 ? (
            <AssessmentChevronIcon className="size-[20px] shrink-0 text-[#595959] max-xl:hidden" />
          ) : null}
        </li>
      ))}
    </ol>
    <p
      className={classNames(
        'm-0 flex items-start gap-[10px] rounded-[12px] bg-[#faf4e8] px-[16px] py-[12px] font-sans text-[13.5px] leading-[16px] max-lg:text-[14px] max-lg:leading-[18px]',
        ladder.tipStyle === 'strong' ? 'font-semibold text-[#463409]' : 'font-medium text-[#967014]'
      )}
    >
      <AssessmentBoltIcon className="mt-px size-[18px] shrink-0 text-[#463409]" />
      {ladder.tip}
    </p>
  </Card>
);

const Attempts = ({ attempts }) => (
  <Card label={attempts.title} className="gap-[4px] p-[24px] max-sm:p-[16px]">
    <h2 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
      {attempts.title}
    </h2>
    <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
      {attempts.note}
    </p>
    {attempts.rows.length ? (
      <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
        {attempts.rows.map((row) => (
          <li key={row.id} className="border-0 border-b border-solid border-[rgba(28,42,33,0.08)]">
            <RowLink to={row.to} className="gap-[16px] py-[14px] max-sm:flex-wrap max-sm:gap-[8px]">
              <span className="w-[64px] shrink-0 font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[14px]">
                {row.date}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] max-lg:text-[16px]">
                  {row.title}
                </span>
                <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
                  {row.sub}
                </span>
              </span>
              <Chip tone={row.chip.tone}>{row.chip.label}</Chip>
              <RowChevron className="size-[18px]" />
            </RowLink>
          </li>
        ))}
      </ul>
    ) : (
      <div className="flex flex-col items-center gap-[10px] px-[8px] py-[24px] text-center">
        <AssessmentEmptyAttemptsArt className="size-[104px]" />
        <p className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
          {attempts.empty.title}
        </p>
        <p className="m-0 font-sans text-[13.5px] leading-[16px] text-[#595959] max-lg:text-[14px]">
          {attempts.empty.body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[10px]">
          <HubButton
            tone="secondary"
            size="lg"
            to={attempts.empty.secondary.to || undefined}
            onClick={() => log('empty: chat with buddy')}
          >
            {attempts.empty.secondary.label}
          </HubButton>
          <HubButton
            tone="primary"
            size="lg"
            to={attempts.empty.primary.to}
            rightIcon={<AssessmentButtonArrowIcon />}
          >
            {attempts.empty.primary.label}
          </HubButton>
        </div>
      </div>
    )}
  </Card>
);

const Topics = ({ topics }) => (
  <Card label={topics.title} className="gap-[10px] p-[24px] max-sm:p-[16px]">
    <h2 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
      {topics.title}
    </h2>
    <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
      {topics.rows.map((row) => (
        <li
          key={row.id}
          className="flex items-center gap-[14px] py-[6px] max-sm:flex-wrap max-sm:gap-x-[12px] max-sm:gap-y-[6px]"
        >
          <span className="w-[220px] shrink-0 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] max-lg:w-[180px] max-lg:text-[15px] max-sm:w-full">
            {row.label}
          </span>
          <div
            role="meter"
            aria-label={`${row.label}: ${row.level}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={row.value}
            className="h-[8px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#ebebe3]"
          >
            <div
              className={classNames(
                'h-full rounded-full',
                row.tone === 'review' ? 'bg-[#c8951a]' : 'bg-[#387440]'
              )}
              style={{ width: `${row.value}%` }}
            />
          </div>
          <MiniChip tone={row.tone}>{row.level}</MiniChip>
        </li>
      ))}
    </ul>
  </Card>
);

const RecruiterPreview = ({ preview }) => (
  <Card label={preview.title} className="gap-[12px] p-[24px] max-sm:p-[16px]">
    <h2 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
      {preview.title}
    </h2>
    <div className="flex flex-wrap items-center gap-[12px] rounded-[14px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[16px]">
      <Tile className="size-[36px] rounded-[11px] bg-[#ebf1ec] text-[#387440]">
        <Glyph name="function" className="size-[18px]" />
      </Tile>
      <div className="flex min-w-[140px] flex-1 flex-col gap-[2px]">
        <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21] max-lg:text-[15px]">
          {preview.skill}
        </span>
        <span className="font-sans text-[12.5px] leading-[15px] text-[#595959] max-lg:text-[13px]">
          {preview.line}
        </span>
      </div>
      <MiniChip tone={preview.chip.tone}>{preview.chip.label}</MiniChip>
    </div>
  </Card>
);

const Practice = ({ practice }) => (
  <Card
    label={practice.title}
    className={classNames(
      'p-[24px] max-sm:p-[16px]',
      practice.gap === 16 ? 'gap-[16px]' : 'gap-[12px]'
    )}
  >
    <h2 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
      {practice.title}
    </h2>
    <ul
      className={classNames(
        'm-0 flex list-none flex-col p-0',
        practice.gap === 16 ? 'gap-[16px]' : 'gap-[12px]'
      )}
    >
      {practice.rows.map((row) => (
        <li key={row.id}>
          <RowLink to={row.to} className="gap-[12px]">
            <Tile className="size-[36px] rounded-[11px] bg-[#ebf1ec] text-[#387440]">
              <Glyph name={row.icon} className="size-[18px]" />
            </Tile>
            <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
              <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21] max-lg:text-[15px]">
                {row.title}
              </span>
              <span className="font-sans text-[12.5px] leading-[15px] text-[#595959] max-lg:text-[13px]">
                {row.sub}
              </span>
            </span>
            <RowChevron className="size-[18px]" />
          </RowLink>
        </li>
      ))}
    </ul>
  </Card>
);

const OtherSkills = ({ other }) => (
  <Card label={other.title} className="gap-[8px] p-[20px] max-sm:p-[16px]">
    <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
      {other.title}
    </h2>
    <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
      {other.skills.map((skill) => (
        <li key={skill.id}>
          <Link
            to={`/my-assessment/skills/${skill.id}`}
            onClick={() => log('other skill', skill.id)}
            className={classNames('rounded-full no-underline', FOCUS_RING)}
          >
            <Chip tone="neutral" className="text-[#1c2a21] playful:text-[#595959]">
              {skill.label}
            </Chip>
          </Link>
        </li>
      ))}
    </ul>
  </Card>
);

const SkillEvidence = ({ data }) => {
  log('render', { skill: data.id });
  return (
    <div className={PAGE_WRAP}>
      <DetailHeader
        back={data.back}
        title={data.title}
        titleChip={
          <Chip tone={data.badge.tone} icon={data.badge.icon} size="title">
            {data.badge.label}
          </Chip>
        }
        subtitle={data.subtitle}
        actions={
          <HubButton
            tone="primary"
            size="lg"
            to={data.cta.to}
            rightIcon={<AssessmentButtonArrowIcon />}
          >
            {data.cta.label}
          </HubButton>
        }
      />
      <Ladder ladder={data.ladder} />
      <div className="grid grid-cols-1 items-start gap-[16px] xl:grid-cols-[minmax(0,1fr)_31.6%]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <Attempts attempts={data.attempts} />
          {data.topics ? <Topics topics={data.topics} /> : null}
        </div>
        <div className="flex min-w-0 flex-col gap-[16px]">
          <RecruiterPreview preview={data.recruiterPreview} />
          <Practice practice={data.practice} />
          <OtherSkills other={data.otherSkills} />
        </div>
      </div>
    </div>
  );
};

export default SkillEvidence;
